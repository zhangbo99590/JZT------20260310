import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Typography, 
  Progress, 
  Alert,
  Tooltip,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { formatDateTime } from '../../utils/commonUtils';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Draft {
  id: string;
  title: string;
  type: string;
  progress: number;
  createTime: string;
  updateTime: string;
  expiryTime: string;
  status: 'active' | 'expiring' | 'expired';
  completedSteps: number;
  totalSteps: number;
  description: string;
}

const DraftManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  // 从localStorage加载草稿数据
  useEffect(() => {
    loadDrafts();
  }, []);

  // 加载草稿数据
  const loadDrafts = () => {
    try {
      let savedDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      
      // 如果没有草稿数据，初始化默认测试数据
      if (savedDrafts.length === 0) {
        const now = new Date();
        const defaultDrafts = [
          {
            id: Date.now().toString(),
            title: 'high tech',
            type: '资质认定',
            currentStep: 1,
            progress: 33,
            data: {},
            createTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updateTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            expiryTime: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            completedSteps: 1,
            totalSteps: 3,
            description: '已完成第1步，进度33%'
          },
          {
            id: (Date.now() + 1).toString(),
            title: '未命名申报',
            type: '资质认定',
            currentStep: 2,
            progress: 66,
            data: {},
            createTime: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updateTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            expiryTime: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            completedSteps: 2,
            totalSteps: 3,
            description: '已完成第2步，进度66%'
          },
          {
            id: (Date.now() + 2).toString(),
            title: '未命名申报',
            type: '资质认定',
            currentStep: 1,
            progress: 33,
            data: {},
            createTime: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updateTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            expiryTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            completedSteps: 1,
            totalSteps: 3,
            description: '已完成第1步，进度33%'
          }
        ];
        localStorage.setItem('applicationDrafts', JSON.stringify(defaultDrafts));
        savedDrafts = defaultDrafts;
      }
      
      // 转换数据格式并计算状态
      const formattedDrafts = savedDrafts.map((draft: any) => {
        const remainingDays = getRemainingDays(draft.expiryTime);
        let status: 'active' | 'expiring' | 'expired' = 'active';
        
        if (remainingDays < 0) {
          status = 'expired';
        } else if (remainingDays <= 7) {
          status = 'expiring';
        }
        
        return {
          id: draft.id,
          title: draft.title || '未命名申报',
          type: draft.type || '资质认定',
          progress: draft.progress || 0,
          createTime: formatDateTime(draft.createTime),
          updateTime: formatDateTime(draft.updateTime),
          expiryTime: formatDateTime(draft.expiryTime),
          status,
          completedSteps: draft.completedSteps || 0,
          totalSteps: draft.totalSteps || 3,
          description: draft.description || '草稿已保存'
        };
      });
      
      setDrafts(formattedDrafts);
    } catch (error) {
      console.error('加载草稿失败:', error);
      message.error('加载草稿失败');
    }
  };


  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      active: { color: 'green', text: '正常' },
      expiring: { color: 'orange', text: '即将过期' },
      expired: { color: 'red', text: '已过期' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取剩余天数
  const getRemainingDays = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 表格列定义
  const columns: ColumnsType<Draft> = [
    {
      title: '申报项目',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Draft) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{text}</div>
          <Tag>{record.type}</Tag>
        </div>
      )
    },
    {
      title: '完成进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      render: (progress: number, record: Draft) => (
        <div>
          <Progress 
            percent={progress} 
            size="small" 
            status={record.status === 'expired' ? 'exception' : 'active'}
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.completedSteps}/{record.totalSteps} 步骤完成
          </Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: Draft) => (
        <div>
          {getStatusTag(status)}
          {status === 'expiring' && (
            <div style={{ fontSize: '12px', color: '#faad14', marginTop: '4px' }}>
              <ClockCircleOutlined /> {getRemainingDays(record.expiryTime)}天后过期
            </div>
          )}
        </div>
      )
    },
    {
      title: '最后修改',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (time: string) => (
        <div>
          <div>{time.split(' ')[0]}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {time.split(' ')[1]}
          </Text>
        </div>
      )
    },
    {
      title: '过期时间',
      dataIndex: 'expiryTime',
      key: 'expiryTime',
      width: 150,
      render: (time: string, record: Draft) => (
        <div>
          <div style={{ color: record.status === 'expired' ? '#ff4d4f' : undefined }}>
            {time.split(' ')[0]}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {time.split(' ')[1]}
          </Text>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: Draft) => (
        <Space>
          <Tooltip title="继续申报">
            <Button 
              type="primary" 
              size="small"
              icon={<EditOutlined />}
              disabled={record.status === 'expired'}
              onClick={() => handleContinueApplication(record)}
            >
              继续申报
            </Button>
          </Tooltip>
          <Button 
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定要删除这个草稿吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDeleteDraft(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 处理继续申报
  const handleContinueApplication = (draft: Draft) => {
    navigate(`/policy-center/application-management/apply/${draft.id}?draft=true`);
  };

  // 查看详情
  const handleViewDetail = (draft: Draft) => {
    setSelectedDraft(draft);
    setDetailVisible(true);
  };

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      const updatedDrafts = savedDrafts.filter((draft: any) => draft.id !== id);
      localStorage.setItem('applicationDrafts', JSON.stringify(updatedDrafts));
      loadDrafts();
      message.success('草稿删除成功');
    } catch (error) {
      console.error('删除草稿失败:', error);
      message.error('删除草稿失败');
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      const updatedDrafts = savedDrafts.filter((draft: any) => !selectedRowKeys.includes(draft.id));
      localStorage.setItem('applicationDrafts', JSON.stringify(updatedDrafts));
      const count = selectedRowKeys.length;
      setSelectedRowKeys([]);
      loadDrafts();
      message.success(`已删除 ${count} 个草稿`);
    } catch (error) {
      console.error('批量删除草稿失败:', error);
      message.error('批量删除草稿失败');
    }
  };

  // 统计数据
  const statistics = {
    total: drafts.length,
    active: drafts.filter(d => d.status === 'active').length,
    expiring: drafts.filter(d => d.status === 'expiring').length,
    expired: drafts.filter(d => d.status === 'expired').length
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <PageWrapper module="policy">
      <Title level={2} style={{ marginBottom: '24px' }}>
        草稿管理
      </Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="草稿总数"
              value={statistics.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常草稿"
              value={statistics.active}
              valueStyle={{ color: '#3f8600' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="即将过期"
              value={statistics.expiring}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已过期"
              value={statistics.expired}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 提醒信息 */}
      {statistics.expiring > 0 && (
        <Alert
          message="草稿过期提醒"
          description={`您有 ${statistics.expiring} 个草稿即将过期，请及时完成申报。草稿保留期限为30天，过期后将自动删除。`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" onClick={() => {
              const expiringDrafts = drafts.filter(d => d.status === 'expiring');
              if (expiringDrafts.length > 0) {
                handleContinueApplication(expiringDrafts[0]);
              }
            }}>
              立即处理
            </Button>
          }
        />
      )}

      {/* 草稿列表 */}
      <Card
        title="我的草稿"
        extra={
          selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`确定要删除选中的 ${selectedRowKeys.length} 个草稿吗？`}
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger>
                批量删除 ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={drafts}
          rowKey="id"
          pagination={{
            total: drafts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="草稿详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          selectedDraft?.status !== 'expired' && (
            <Button 
              key="continue" 
              type="primary"
              onClick={() => {
                if (selectedDraft) {
                  handleContinueApplication(selectedDraft);
                }
              }}
            >
              继续申报
            </Button>
          )
        ].filter(Boolean)}
      >
        {selectedDraft && (
          <div>
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Text strong>项目名称：</Text>
                <div>{selectedDraft.title}</div>
              </Col>
              <Col span={12}>
                <Text strong>申报类型：</Text>
                <div>{selectedDraft.type}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Text strong>创建时间：</Text>
                <div>{selectedDraft.createTime}</div>
              </Col>
              <Col span={12}>
                <Text strong>最后修改：</Text>
                <div>{selectedDraft.updateTime}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Text strong>过期时间：</Text>
                <div style={{ color: selectedDraft.status === 'expired' ? '#ff4d4f' : undefined }}>
                  {selectedDraft.expiryTime}
                </div>
              </Col>
              <Col span={12}>
                <Text strong>状态：</Text>
                <div>{getStatusTag(selectedDraft.status)}</div>
              </Col>
            </Row>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>完成进度：</Text>
              <Progress 
                percent={selectedDraft.progress} 
                style={{ marginTop: '8px' }}
                status={selectedDraft.status === 'expired' ? 'exception' : 'active'}
              />
              <Text type="secondary">
                已完成 {selectedDraft.completedSteps}/{selectedDraft.totalSteps} 个步骤
              </Text>
            </div>
            
            <div>
              <Text strong>描述：</Text>
              <div style={{ marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                {selectedDraft.description}
              </div>
            </div>
            
            {selectedDraft.status === 'expiring' && (
              <Alert
                message={`草稿将在 ${getRemainingDays(selectedDraft.expiryTime)} 天后过期`}
                description="请尽快完成申报，避免草稿过期丢失。"
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
            
            {selectedDraft.status === 'expired' && (
              <Alert
                message="草稿已过期"
                description="该草稿已超过保留期限，无法继续编辑。建议重新开始申报流程。"
                type="error"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default DraftManagement;
