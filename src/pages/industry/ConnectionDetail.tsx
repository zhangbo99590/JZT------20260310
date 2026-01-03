import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Avatar,
  Badge,
  Divider,
  Timeline,
  Input,
  List,
  Modal,
  Progress,
  Descriptions,
  Upload,
  message,
  Tabs,
  Alert,
  Form,
  Select,
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  SendOutlined,
  PaperClipOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  StarOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Connection, ConnectionStatus, ChatMessage } from '../../types/industry';
import { getConnections, updateConnectionStatus } from '../../services/industryService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 状态标签配置
const statusConfig = {
  pending: { color: 'orange', text: '待处理' },
  accepted: { color: 'green', text: '已接受' },
  rejected: { color: 'red', text: '已拒绝' },
  negotiating: { color: 'blue', text: '洽谈中' },
  completed: { color: 'purple', text: '已完成' },
};

const ConnectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState<ConnectionStatus>('pending');
  const [statusRemark, setStatusRemark] = useState('');

  useEffect(() => {
    if (id) {
      loadConnectionDetail();
    }
  }, [id]);

  const loadConnectionDetail = async () => {
    setLoading(true);
    try {
      // 模拟获取对接详情数据
      const connections = await getConnections();
      const foundConnection = connections.find(conn => conn.id === id);
      if (foundConnection) {
        setConnection(foundConnection);
      } else {
        message.error('对接记录不存在');
        navigate('/industry-hall/connections');
      }
    } catch (error) {
      message.error('加载对接详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !connection) return;

    setSendingMessage(true);
    try {
      // 模拟发送消息
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'current-user-id',
        senderName: '当前用户',
        content: messageText,
        type: 'text',
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        read: false,
      };

      setConnection({
        ...connection,
        chatMessages: [...connection.chatMessages, newMessage],
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });

      setMessageText('');
      message.success('消息发送成功');
    } catch (error) {
      message.error('发送消息失败');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async () => {
    if (!connection) return;

    try {
      await updateConnectionStatus(connection.id, newStatus);
      setConnection({
        ...connection,
        status: newStatus,
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      setStatusModalVisible(false);
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const renderConnectionTimeline = () => {
    if (!connection) return null;

    const timelineItems = [
      {
        color: 'blue',
        children: (
          <div>
            <Text strong>发起对接</Text>
            <br />
            <Text type="secondary">{connection.createTime}</Text>
            <br />
            <Text>{connection.message}</Text>
          </div>
        ),
      },
    ];

    // 根据状态添加时间线项目
    if (connection.status !== 'pending') {
      timelineItems.push({
        color: statusConfig[connection.status].color as any,
        children: (
          <div>
            <Text strong>{statusConfig[connection.status].text}</Text>
            <br />
            <Text type="secondary">{connection.updateTime}</Text>
          </div>
        ),
      });
    }

    return <Timeline items={timelineItems} />;
  };

  const renderChatMessages = () => {
    if (!connection?.chatMessages.length) {
      return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>暂无聊天记录</div>;
    }

    return (
      <List
        dataSource={connection.chatMessages}
        renderItem={(message) => (
          <List.Item style={{ border: 'none', padding: '8px 0' }}>
            <div style={{ width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: message.senderId === 'current-user-id' ? 'flex-end' : 'flex-start',
                marginBottom: '4px'
              }}>
                <Space>
                  {message.senderId !== 'current-user-id' && (
                    <Avatar size="small" icon={<UserOutlined />} />
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {message.senderName} {dayjs(message.timestamp).format('MM-DD HH:mm')}
                  </Text>
                  {message.senderId === 'current-user-id' && (
                    <Avatar size="small" icon={<UserOutlined />} />
                  )}
                </Space>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: message.senderId === 'current-user-id' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: message.senderId === 'current-user-id' ? '#1677ff' : '#f5f5f5',
                  color: message.senderId === 'current-user-id' ? '#fff' : '#000',
                }}>
                  {message.content}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  if (loading || !connection) {
    return (
      <div style={{ padding: '24px' }}>
        <Card loading={loading}>
          <div style={{ height: '400px' }} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* 页面头部 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/industry-hall/connections')}
              >
                返回列表
              </Button>
              <Title level={4} style={{ margin: 0 }}>
                对接详情 - {connection.publicationTitle}
              </Title>
              <Tag color={statusConfig[connection.status].color}>
                {statusConfig[connection.status].text}
              </Tag>
            </Space>
          </Col>
          <Col>
            {/* 匹配度元素已移除 */}
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* 左侧主要内容 */}
        <Col span={16}>
          <Tabs defaultActiveKey="chat">
            <TabPane tab="沟通记录" key="chat">
              <Card>
                <div style={{ height: '400px', overflowY: 'auto', marginBottom: '16px' }}>
                  {renderChatMessages()}
                </div>
                <Divider />
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="输入消息内容..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    onPressEnter={(e) => {
                      if (e.shiftKey) return;
                      e.preventDefault();
                      handleSendMessage();
                    }}
                  />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />}
                    loading={sendingMessage}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    发送
                  </Button>
                </Space.Compact>
              </Card>
            </TabPane>
            
            <TabPane tab="对接进展" key="timeline">
              <Card title="对接时间线">
                {renderConnectionTimeline()}
              </Card>
            </TabPane>

            <TabPane tab="相关文件" key="files">
              <Card title="附件文件">
                {connection.attachments.length > 0 ? (
                  <List
                    dataSource={connection.attachments}
                    renderItem={(file) => (
                      <List.Item
                        actions={[
                          <Button 
                            type="link" 
                            icon={<DownloadOutlined />}
                            onClick={() => window.open(file.url)}
                          >
                            下载
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileOutlined style={{ fontSize: '24px', color: '#1677ff' }} />}
                          title={file.name}
                          description={`${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.uploadTime}`}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    暂无相关文件
                  </div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Col>

        {/* 右侧信息栏 */}
        <Col span={8}>
          {/* 对接双方信息 */}
          <Card title="对接双方" style={{ marginBottom: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>发起方</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} src={connection.initiatorAvatar} />
                    <div>
                      <div>{connection.initiatorName}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {connection.createTime}
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text strong>接收方</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} src={connection.receiverAvatar} />
                    <div>
                      <div>{connection.receiverName}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        商机发布方
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>
            </Space>
          </Card>

          {/* 对接信息 */}
          <Card title="对接信息" style={{ marginBottom: '16px' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="对接编号">{connection.id}</Descriptions.Item>
              <Descriptions.Item label="商机类型">
                <Tag color={connection.publicationType === 'supply' ? 'blue' : 'green'}>
                  {connection.publicationType === 'supply' ? '供给' : '需求'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={statusConfig[connection.status].color}>
                  {statusConfig[connection.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{connection.createTime}</Descriptions.Item>
              <Descriptions.Item label="最后更新">{connection.updateTime}</Descriptions.Item>
              {connection.matchScore && (
                <Descriptions.Item label="匹配度">
                  <Progress 
                    percent={connection.matchScore} 
                    size="small" 
                    status={connection.matchScore >= 80 ? 'success' : 'normal'}
                  />
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* 快捷操作 */}
          <Card title="快捷操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 快捷操作按钮已移除 */}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 状态更新弹窗 */}
      <Modal
        title="更新对接状态"
        open={statusModalVisible}
        onOk={handleStatusChange}
        onCancel={() => setStatusModalVisible(false)}
        okText="确认更新"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="新状态">
            <Select
              value={newStatus}
              onChange={setNewStatus}
              style={{ width: '100%' }}
            >
              <Select.Option value="accepted">接受对接</Select.Option>
              <Select.Option value="negotiating">进入洽谈</Select.Option>
              <Select.Option value="completed">完成对接</Select.Option>
              <Select.Option value="rejected">拒绝对接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注说明">
            <TextArea
              value={statusRemark}
              onChange={(e) => setStatusRemark(e.target.value)}
              placeholder="请输入状态变更的说明..."
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConnectionDetail;
