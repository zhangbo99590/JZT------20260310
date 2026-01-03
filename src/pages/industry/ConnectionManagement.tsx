import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  message,
  Avatar,
  Badge,
  Tabs,
  Typography,
  Divider,
  List,
  Row,
  Col,
  Progress,
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Connection, ConnectionStatus, ChatMessage } from '../../types/industry';
import { getConnections, updateConnectionStatus } from '../../services/industryService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ConnectionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | ConnectionStatus>('all');
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messageText, setMessageText] = useState('');

  const loadConnections = useCallback(async () => {
    setLoading(true);
    try {
      const filter = activeTab === 'all' ? undefined : { status: activeTab };
      const data = await getConnections(filter);
      setConnections(data);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const handleUpdateStatus = useCallback(async (id: string, status: ConnectionStatus) => {
    try {
      await updateConnectionStatus(id, status);
      message.success('状态已更新');
      loadConnections();
    } catch (error) {
      message.error('更新失败');
    }
  }, [loadConnections]);

  const handleOpenChat = useCallback((connection: Connection) => {
    setSelectedConnection(connection);
    setChatModalVisible(true);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim()) {
      message.warning('请输入消息内容');
      return;
    }
    // 模拟发送消息
    message.success('消息已发送');
    setMessageText('');
  }, [messageText]);

  const getStatusTag = useCallback((status: ConnectionStatus) => {
    const statusConfig: Record<
      ConnectionStatus,
      { color: string; text: string }
    > = {
      pending: { color: 'orange', text: '待处理' },
      accepted: { color: 'green', text: '已接受' },
      rejected: { color: 'red', text: '已拒绝' },
      negotiating: { color: 'blue', text: '洽谈中' },
      completed: { color: 'purple', text: '已完成' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  }, []);

  const columns: ColumnsType<Connection> = useMemo(() => [
    {
      title: '申请编号',
      dataIndex: 'applicationId',
      key: 'applicationId',
      width: 120,
      render: (applicationId) => applicationId ? (
        <Text code style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {applicationId}
        </Text>
      ) : '-',
    },
    {
      title: '发布标题',
      dataIndex: 'publicationTitle',
      key: 'publicationTitle',
      width: 200,
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'publicationType',
      key: 'publicationType',
      width: 80,
      render: (type) => (
        <Tag color={type === 'supply' ? 'green' : 'blue'}>
          {type === 'supply' ? '供给' : '需求'}
        </Tag>
      ),
    },
    {
      title: '发起方',
      key: 'initiator',
      width: 150,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} src={record.initiatorAvatar} />
          <Text>{record.initiatorName}</Text>
        </Space>
      ),
    },
    {
      title: '接收方',
      key: 'receiver',
      width: 150,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} src={record.receiverAvatar} />
          <Text>{record.receiverName}</Text>
        </Space>
      ),
    },
    {
      title: '匹配度',
      dataIndex: 'matchScore',
      key: 'matchScore',
      width: 120,
      render: (score) =>
        score ? (
          <Space>
            <Progress
              type="circle"
              percent={score}
              width={40}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleUpdateStatus(record.id, 'accepted')}
              >
                接受
              </Button>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                danger
                onClick={() => handleUpdateStatus(record.id, 'rejected')}
              >
                拒绝
              </Button>
            </>
          )}

          {record.status === 'accepted' && (
            <Button
              type="text"
              size="small"
              onClick={() => handleUpdateStatus(record.id, 'negotiating')}
            >
              开始洽谈
            </Button>
          )}

          {record.status === 'negotiating' && (
            <Button
              type="text"
              size="small"
              onClick={() => handleUpdateStatus(record.id, 'completed')}
            >
              标记完成
            </Button>
          )}
        </Space>
      ),
    },
  ], [navigate, handleUpdateStatus, getStatusTag]);

  const tabItems = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待处理' },
    { key: 'accepted', label: '已接受' },
    { key: 'negotiating', label: '洽谈中' },
    { key: 'completed', label: '已完成' },
    { key: 'rejected', label: '已拒绝' },
  ];

  const renderChatMessage = (msg: ChatMessage) => (
    <div
      key={msg.id}
      style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: msg.senderId === 'current-user-id' ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: 8,
          backgroundColor: msg.senderId === 'current-user-id' ? '#1890ff' : '#f0f0f0',
          color: msg.senderId === 'current-user-id' ? '#fff' : '#000',
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <Text
            strong
            style={{
              color: msg.senderId === 'current-user-id' ? '#fff' : '#000',
              fontSize: 12,
            }}
          >
            {msg.senderName}
          </Text>
        </div>
        <div>{msg.content}</div>
        <div
          style={{
            marginTop: 4,
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          {msg.timestamp}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          对接管理
        </Title>
        <Text type="secondary">查看和处理商机对接请求</Text>
      </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={connections}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1520 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 沟通弹窗 */}
      <Modal
        title="对接沟通"
        open={chatModalVisible}
        onCancel={() => setChatModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedConnection && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text type="secondary">申请编号：</Text>
                  <Text code style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {selectedConnection.applicationId || '-'}
                  </Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">发布标题：</Text>
                  <Text strong>{selectedConnection.publicationTitle}</Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">状态：</Text>
                  {getStatusTag(selectedConnection.status)}
                </Col>
              </Row>
              {selectedConnection.matchScore && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">匹配度：</Text>
                  <Progress
                    percent={selectedConnection.matchScore}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </div>
              )}
            </Card>

            <Divider orientation="left">对接说明</Divider>
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
              <Text>{selectedConnection.message}</Text>
            </Card>

            <Divider orientation="left">聊天记录</Divider>
            <div
              style={{
                height: 300,
                overflowY: 'auto',
                padding: 16,
                backgroundColor: '#fafafa',
                borderRadius: 4,
                marginBottom: 16,
              }}
            >
              {selectedConnection.chatMessages.length > 0 ? (
                selectedConnection.chatMessages.map((msg) => renderChatMessage(msg))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Text type="secondary">暂无聊天记录</Text>
                </div>
              )}
            </div>

            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="输入消息内容"
                autoSize={{ minRows: 2, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (e.ctrlKey) {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
              >
                发送
              </Button>
            </Space.Compact>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              提示：按 Ctrl+Enter 快速发送
            </Text>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ConnectionManagement;
