import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tooltip,
  Select,
  Typography,
  Breadcrumb,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  StopOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Publication, PublicationStatus } from '../../types/industry';
import {
  getMyPublications,
  deletePublication,
  offlinePublication,
  refreshPublication,
} from '../../services/industryService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MyPublications: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [offlineModalVisible, setOfflineModalVisible] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [offlineForm] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyPublications(statusFilter);
      setPublications(data);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePublication(id);
      message.success('删除成功');
      loadPublications();
    } catch (error) {
      message.error('删除失败');
    }
  }, [loadPublications]);

  const handleOffline = useCallback((publication: Publication) => {
    setSelectedPublication(publication);
    setOfflineModalVisible(true);
  }, []);

  const handleOfflineSubmit = async () => {
    try {
      const values = await offlineForm.validateFields();
      await offlinePublication(selectedPublication!.id, values.reason);
      message.success('已下架');
      setOfflineModalVisible(false);
      offlineForm.resetFields();
      loadPublications();
    } catch (error) {
      message.error('下架失败');
    }
  };

  const handleRefresh = useCallback(async (id: string) => {
    try {
      await refreshPublication(id);
      message.success('已刷新，有效期延长30天');
      loadPublications();
    } catch (error) {
      message.error('刷新失败');
    }
  }, [loadPublications]);

  const getStatusTag = useCallback((status: PublicationStatus) => {
    const statusConfig: Record<
      PublicationStatus,
      { color: string; text: string }
    > = {
      pending: { color: 'orange', text: '待审核' },
      active: { color: 'green', text: '已生效' },
      offline: { color: 'default', text: '已下架' },
      expired: { color: 'red', text: '已过期' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  }, []);

  const getTypeText = useCallback((type: string, subType: string) => {
    const typeMap: Record<string, string> = {
      supply: '供给',
      demand: '需求',
    };
    const subTypeMap: Record<string, string> = {
      product: '产品',
      service: '服务',
      capacity: '产能',
      technology: '技术',
      purchase: '采购',
      cooperation: '合作',
    };
    return `${typeMap[type]} - ${subTypeMap[subType]}`;
  }, []);

  const columns: ColumnsType<Publication> = useMemo(() => [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text strong>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '类型',
      key: 'type',
      width: 120,
      render: (_, record) => getTypeText(record.type, record.subType),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
    },
    {
      title: '到期时间',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
    },
    {
      title: '浏览/对接',
      key: 'stats',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">浏览: {record.viewCount}</Text>
          <Text type="secondary">对接: {record.connectionCount}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate('/industry/connection-application-success', {
                state: {
                  applicationData: {
                    applicationId: record.id,
                    publicationTitle: record.title,
                    publisherName: '我的企业',
                    submitTime: record.publishTime,
                    companyName: '我的企业',
                    contactPerson: '联系人',
                    contactPhone: '400-888-999',
                    connectionPurpose: 'supply',
                    specificRequirements: record.description || '无'
                  }
                }
              })}
            />
          </Tooltip>

          {(record.status === 'pending' || record.status === 'offline') && (
            <Tooltip title="编辑">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => message.info('编辑功能开发中')}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="确定删除此发布吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ], [navigate, handleDelete, handleOffline, handleRefresh, getStatusTag, getTypeText]);

  return (
    <div className="page-container">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '产业大厅',
          },
          {
            title: '我的商机',
          },
        ]}
      />
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            我的发布
          </Title>
          <Text type="secondary">管理我的商机发布信息</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/industry-hall/new-publication')}
        >
          新建发布
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text>状态筛选：</Text>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部</Option>
              <Option value="pending">待审核</Option>
              <Option value="active">已生效</Option>
              <Option value="offline">已下架</Option>
              <Option value="expired">已过期</Option>
            </Select>
            <Button onClick={loadPublications}>刷新</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={publications}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 下架弹窗 */}
      <Modal
        title="下架发布"
        open={offlineModalVisible}
        onOk={handleOfflineSubmit}
        onCancel={() => {
          setOfflineModalVisible(false);
          offlineForm.resetFields();
        }}
        width={500}
      >
        {selectedPublication && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>发布标题：</Text>
            <Text>{selectedPublication.title}</Text>
          </div>
        )}
        <Form form={offlineForm} layout="vertical">
          <Form.Item
            name="reason"
            label="下架原因"
            rules={[{ required: true, message: '请输入下架原因' }]}
          >
            <TextArea
              rows={4}
              placeholder="请说明下架原因"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyPublications;
