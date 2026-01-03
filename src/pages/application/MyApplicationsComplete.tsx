import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, List, Input, Select, DatePicker, Button, Space, Badge, 
  Tag, Typography, Alert, Empty, Divider, message, Modal, Upload, Spin, Breadcrumb,
  Row, Col
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  BellOutlined,
  UploadOutlined,
  CalendarOutlined,
  DollarOutlined,
  WarningOutlined,
  RocketOutlined,
  SyncOutlined,
  TeamOutlined,
  ReloadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { myApplicationService, ApplicationProject } from '../../services/myApplicationService';
import type { UploadFile } from 'antd/es/upload/interface';
import PageWrapper from '../../components/PageWrapper';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const MyApplicationsComplete: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPolicyType, setFilterPolicyType] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<any>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [reminderVisible, setReminderVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ApplicationProject[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  // 加载数据
  useEffect(() => {
    // 检查是否需要重置数据（版本更新）
    const dataVersion = localStorage.getItem('my_applications_version');
    if (dataVersion !== '2.3') {
      // 清除旧数据，加载新数据（包含已驳回项目）
      myApplicationService.clearStorage();
      localStorage.setItem('my_applications_version', '2.3');
    }
    loadProjects();
    loadDrafts();
  }, []);

  const loadProjects = () => {
    setLoading(true);
    try {
      const data = myApplicationService.getAllProjects();
      setProjects(data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

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
      
      setDrafts(savedDrafts);
    } catch (error) {
    }
  };

  // 统计各状态数量 - 使用 useMemo 优化性能
  const statusCounts = useMemo(() => ({
    all: projects.length,
    drafts: drafts.length,
    draft: projects.filter(p => p.status === 'draft').length,
    reviewing: projects.filter(p => p.status === 'reviewing').length,
    supplement: projects.filter(p => p.status === 'supplement').length,
    approved: projects.filter(p => p.status === 'approved').length,
    rejected: projects.filter(p => p.status === 'rejected').length,
    expired: projects.filter(p => p.status === 'expired').length
  }), [projects, drafts]);

  // 待办提醒统计 - 使用 useMemo 优化性能
  const reminderCounts = useMemo(() => myApplicationService.getReminders(), [projects]);

  // 状态配置
  const statusConfig: { [key: string]: { label: string; color: string; icon: React.ReactNode } } = {
    draft: { label: '待提交', color: 'default', icon: <EditOutlined /> },
    reviewing: { label: '审核中', color: 'processing', icon: <SyncOutlined spin /> },
    supplement: { label: '需补正', color: 'warning', icon: <ExclamationCircleOutlined /> },
    approved: { label: '已通过', color: 'success', icon: <CheckCircleOutlined /> },
    rejected: { label: '已驳回', color: 'error', icon: <CloseCircleOutlined /> },
    expired: { label: '已过期', color: 'default', icon: <ClockCircleOutlined /> }
  };

  // 过滤项目
  const filteredProjects = projects.filter(project => {
    // 状态筛选
    if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
    
    // 关键词搜索 - 支持项目名称、政策编号、政策类型、部门、申请人
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      const searchFields = [
        project.name,
        project.policyNo || '',
        project.policyType,
        project.department,
        project.applicant,
        project.description || ''
      ];
      
      const matchFound = searchFields.some(field => 
        field.toLowerCase().includes(keyword)
      );
      
      if (!matchFound) return false;
    }
    
    // 政策类型筛选
    if (filterPolicyType !== 'all' && project.policyType !== filterPolicyType) return false;
    
    // 部门筛选
    if (filterDepartment !== 'all' && project.department !== filterDepartment) return false;
    
    // 日期范围筛选
    if (filterDateRange && filterDateRange.length === 2) {
      const applyDate = dayjs(project.applyDate);
      if (applyDate.isBefore(filterDateRange[0], 'day') || applyDate.isAfter(filterDateRange[1], 'day')) {
        return false;
      }
    }
    
    return true;
  });

  // 继续编辑
  const handleEdit = (projectId: string) => {
    message.info('跳转到编辑页面');
    navigate(`/policy-center/application-management/apply/${projectId}`);
  };

  // 继续编辑草稿
  const handleContinueDraft = (draftId: string) => {
    // 如果草稿编辑路由不存在，可以跳转到申报向导页面
    navigate(`/policy-center/application-management/apply/new?draftId=${draftId}`);
  };

  // 复制草稿
  const handleCopyDraft = (draftId: string) => {
    try {
      const draft = drafts.find(d => d.id === draftId);
      if (draft) {
        const newDraft = {
          ...draft,
          id: Date.now().toString(),
          title: `${draft.title} - 副本`,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
          currentStep: 1,
          progress: 0,
          completedSteps: 0,
          description: '已复制，请继续编辑'
        };
        
        const updatedDrafts = [...drafts, newDraft];
        localStorage.setItem('applicationDrafts', JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        message.success('草稿已复制');
      }
    } catch (error) {
      message.error('复制失败');
    }
  };

  // 删除草稿
  const handleDeleteDraft = (draftId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      okType: 'danger',
      onOk: () => {
        try {
          const updatedDrafts = drafts.filter(d => d.id !== draftId);
          localStorage.setItem('applicationDrafts', JSON.stringify(updatedDrafts));
          setDrafts(updatedDrafts);
          message.success('草稿已删除');
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  // 提交申报
  const handleSubmit = async (projectId: string) => {
    Modal.confirm({
      title: '确认提交',
      content: '确认提交此申报项目？提交后将进入审核流程。',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await myApplicationService.submitApplication(projectId);
          if (result.success) {
            message.success(result.message);
            loadProjects();
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('提交失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 补正材料
  const handleSupplement = (projectId: string) => {
    setCurrentProjectId(projectId);
    setFileList([]);
    setUploadModalVisible(true);
  };

  // 上传文件
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件');
      return;
    }

    setUploading(true);
    try {
      for (const file of fileList) {
        if (file.originFileObj) {
          await myApplicationService.supplementMaterial(
            currentProjectId,
            file.originFileObj,
            '补正材料'
          );
        }
      }
      message.success('材料上传成功');
      setUploadModalVisible(false);
      setFileList([]);
      loadProjects();
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 重新申报
  // 渲染草稿列表项
  const renderDraftItem = (draft: any) => {
    const isExpiring = new Date(draft.expiryTime) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const isExpired = new Date(draft.expiryTime) < new Date();

    return (
      <div style={{ 
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '16px',
        border: isExpired ? '1px solid #ff4d4f' : isExpiring ? '1px solid #faad14' : '1px solid #d9d9d9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Title level={5} style={{ margin: 0, marginRight: '12px' }}>
                {draft.title}
              </Title>
              <Tag color="orange">草稿</Tag>
              {isExpired && <Tag color="red">已过期</Tag>}
              {isExpiring && !isExpired && <Tag color="warning">即将过期</Tag>}
            </div>
            <Space size="large" style={{ marginBottom: '12px' }}>
              <Text type="secondary">
                <CalendarOutlined style={{ marginRight: '4px' }} />
                创建时间：{dayjs(draft.createTime).format('YYYY-MM-DD HH:mm')}
              </Text>
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: '4px' }} />
                过期时间：{dayjs(draft.expiryTime).format('YYYY-MM-DD')}
              </Text>
            </Space>
            <div style={{ marginBottom: '12px' }}>
              <Text type="secondary">完成进度：</Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ flex: 1, marginRight: '12px' }}>
                  <div style={{ 
                    height: '8px', 
                    background: '#f0f0f0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      background: '#1890ff',
                      width: `${draft.progress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
                <Text strong>{draft.progress}%</Text>
              </div>
            </div>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {draft.description}
            </Text>
          </div>
          <Space>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleContinueDraft(draft.id)}
              disabled={isExpired}
            >
              继续编辑
            </Button>
            <Button 
              icon={<CloseCircleOutlined />}
              onClick={() => handleCopyDraft(draft.id)}
            >
              复制
            </Button>
            <Button 
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleDeleteDraft(draft.id)}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  const handleReapply = async (projectId: string) => {
    Modal.confirm({
      title: '重新申报',
      content: '将基于此项目创建新的申报，是否继续？',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await myApplicationService.reapplyProject(projectId);
          if (result.success) {
            message.success('已创建新申报，请继续编辑');
            loadProjects();
            navigate(`/policy-center/application-management/apply/${result.newId}`);
          } else {
            message.error('重新申报失败');
          }
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 删除项目
  const handleDelete = (projectId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      okType: 'danger',
      onOk: () => {
        const success = myApplicationService.deleteProject(projectId);
        if (success) {
          message.success('删除成功');
          loadProjects();
        } else {
          message.error('删除失败');
        }
      }
    });
  };

  // 渲染列表项
  const renderListItem = (project: ApplicationProject) => {
    const config = statusConfig[project.status];
    
    return (
      <List.Item
        key={project.id}
        style={{
          padding: '20px 24px',
          background: '#fff',
          borderRadius: '8px',
          marginBottom: '12px',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#1890ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#f0f0f0';
        }}
        actions={[
          <Space key="actions" size="small">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                try {
                  navigate(`/policy-center/my-applications/detail/${project.id}?status=${project.status}`);
                } catch (error) {
                  message.error('页面跳转失败');
                }
              }}
            >
              查看详情
            </Button>
            {project.status === 'draft' && (
              <>
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project.id);
                  }}
                >
                  编辑
                </Button>
                <Button 
                  type="link" 
                  icon={<RocketOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit(project.id);
                  }}
                >
                  提交
                </Button>
              </>
            )}
            {project.status === 'supplement' && (
              <Button 
                type="link" 
                icon={<UploadOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupplement(project.id);
                }}
              >
                补正材料
              </Button>
            )}
            {project.status === 'rejected' && (
              <Button 
                type="link" 
                icon={<RocketOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReapply(project.id);
                }}
              >
                重新申报
              </Button>
            )}
            {(project.status === 'draft' || project.status === 'rejected') && (
              <Button 
                type="link" 
                danger
                icon={<CloseCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project.id);
                }}
              >
                删除
              </Button>
            )}
          </Space>
        ]}
      >
        <List.Item.Meta
          avatar={
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '8px',
              background: config.color === 'processing' ? '#e6f7ff' :
                         config.color === 'warning' ? '#fff7e6' :
                         config.color === 'success' ? '#f6ffed' :
                         config.color === 'error' ? '#fff1f0' : '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: config.color === 'processing' ? '#1890ff' :
                     config.color === 'warning' ? '#faad14' :
                     config.color === 'success' ? '#52c41a' :
                     config.color === 'error' ? '#ff4d4f' : '#8c8c8c'
            }}>
              <FileTextOutlined />
            </div>
          }
          title={
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: '16px' }}>{project.name}</Text>
                <Tag icon={config.icon} color={config.color}>
                  {config.label}
                </Tag>
              </Space>
              <Space size="small" wrap>
                {project.policyNo && (
                  <Tag color="cyan" style={{ fontFamily: 'monospace' }}>
                    编号：{project.policyNo}
                  </Tag>
                )}
                <Tag color="blue">{project.policyType}</Tag>
                <Tag icon={<CalendarOutlined />}>申报: {project.applyDate}</Tag>
                <Tag icon={<TeamOutlined />}>{project.department}</Tag>
              </Space>
            </Space>
          }
          description={
            <div style={{ marginTop: '12px' }}>
              {/* 审核中状态 */}
              {project.status === 'reviewing' && (
                <Alert
                  message={
                    <Space>
                      <Text strong>当前节点：</Text>
                      <Text>{project.currentNode}</Text>
                      {project.remainingDays && project.remainingDays <= 3 && (
                        <Tag color="red" icon={<WarningOutlined />}>
                          还剩 {project.remainingDays} 天
                        </Tag>
                      )}
                    </Space>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: '8px' }}
                />
              )}
              
              {/* 需补正状态 */}
              {project.status === 'supplement' && (
                <>
                  <Alert
                    message={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                          <Text strong>补正截止：</Text>
                          <Text type="danger">{project.supplementDeadline}</Text>
                        </Space>
                        <div>
                          <Text strong style={{ marginRight: 8 }}>需补正材料：</Text>
                          <Space wrap size="small">
                            <Tag color="orange">营业执照</Tag>
                            <Tag color="orange">合同</Tag>
                            <Tag color="orange">财务报表</Tag>
                          </Space>
                        </div>
                      </Space>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: '8px' }}
                  />
                </>
              )}
              
              {/* 已通过状态 */}
              {project.status === 'approved' && project.subsidyAmount && (
                <Alert
                  message={
                    <Space>
                      <DollarOutlined />
                      <Text strong>补贴金额：</Text>
                      <Text type="success" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {project.subsidyAmount}
                      </Text>
                    </Space>
                  }
                  type="success"
                  showIcon
                  style={{ marginBottom: '8px' }}
                />
              )}
              
              {/* 已驳回状态 */}
              {project.status === 'rejected' && (
                <Alert
                  message="该项目已被驳回"
                  description={
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <div>
                        <Text strong>驳回时间：</Text>
                        <Text>2024-03-15</Text>
                        <Divider type="vertical" />
                        <Text strong>审核人员：</Text>
                        <Text>市科技局审核组</Text>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Text strong>驳回原因：</Text>
                        <div style={{ marginTop: 4, whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                          <Text type="secondary">
                            经审核，您的申报材料存在以下问题：{'\n'}
                            1. 营业执照副本不清晰，无法辨认关键信息{'\n'}
                            2. 缺少相关业务合同的完整版本{'\n'}
                            3. 财务报表数据与申报信息不符，需重新提供
                          </Text>
                        </div>
                      </div>
                    </Space>
                  }
                  type="error"
                  showIcon
                  closable={false}
                  style={{ marginBottom: '8px' }}
                />
              )}
              
              <Space size="large" style={{ color: '#8c8c8c' }}>
                <Text type="secondary">
                  <ClockCircleOutlined /> 截止日期: {project.deadline}
                </Text>
                <Text type="secondary">
                  申请人: {project.applicant}
                </Text>
              </Space>
            </div>
          }
        />
      </List.Item>
    );
  };

  return (
    <PageWrapper module="policy">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '政策中心',
          },
          {
            title: '申报管理',
          },
          {
            title: '我的申报',
          },
        ]}
      />

      {/* 页面头部 */}
      {!loading && (
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: '#262626' }}>
                <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                我的申报
              </Title>
              <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
                申报进度跟踪 · 材料提交管理 · 申报结果查询
              </Paragraph>
            </Col>
          </Row>
        </div>
      )}
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>加载中...</div>
        </div>
      ) : (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <Layout style={{ background: 'transparent', padding: '0 24px 24px' }}>
          {/* 左侧状态导航 */}
          <Sider 
            width={240} 
            style={{ 
              background: '#fff',
              borderRadius: '8px',
              padding: '16px 0',
              marginRight: '24px'
            }}
          >
            <div style={{ padding: '0 16px 16px' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={5} style={{ margin: 0 }}>申报项目</Title>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<ReloadOutlined />}
                  onClick={loadProjects}
                />
              </Space>
            </div>
            
            <div style={{ padding: '0 8px' }}>
              <Button
                type={selectedStatus === 'all' ? 'primary' : 'text'}
                block
                style={{ 
                  textAlign: 'left', 
                  marginBottom: '8px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setSelectedStatus('all')}
              >
                <span>全部项目</span>
                <Badge count={statusCounts.all} showZero style={{ backgroundColor: '#52c41a' }} />
              </Button>

              <Button
                type={selectedStatus === 'drafts' ? 'primary' : 'text'}
                block
                icon={<FileTextOutlined />}
                style={{ 
                  textAlign: 'left', 
                  marginBottom: '8px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setSelectedStatus('drafts')}
              >
                <span>我的草稿</span>
                <Badge 
                  count={statusCounts.drafts} 
                  showZero 
                  style={{ backgroundColor: '#faad14' }} 
                />
              </Button>
              
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  type={selectedStatus === key ? 'primary' : 'text'}
                  block
                  icon={config.icon}
                  style={{ 
                    textAlign: 'left', 
                    marginBottom: '8px',
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => setSelectedStatus(key)}
                >
                  <span>{config.label}</span>
                  <Badge 
                    count={statusCounts[key as keyof typeof statusCounts]} 
                    showZero 
                    style={{ 
                      backgroundColor: config.color === 'processing' ? '#1890ff' : 
                                     config.color === 'warning' ? '#faad14' :
                                     config.color === 'success' ? '#52c41a' :
                                     config.color === 'error' ? '#ff4d4f' : '#d9d9d9'
                    }} 
                  />
                </Button>
              ))}
            </div>
          </Sider>

          {/* 右侧内容区 */}
          <Content>
            {/* 筛选栏 */}
            <div 
              style={{ 
                background: '#fff',
                borderRadius: '8px',
                padding: '16px 24px',
                marginBottom: '16px'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space size="middle" wrap style={{ width: '100%' }}>
                  <Input
                    placeholder="搜索项目名称、政策编号、部门、申请人..."
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    allowClear
                    style={{ width: '320px' }}
                    onPressEnter={() => {
                      // 回车搜索时的反馈
                      if (searchKeyword.trim()) {
                        message.info(`搜索"${searchKeyword}"，找到 ${filteredProjects.length} 个结果`);
                      }
                    }}
                  />
                  <Select
                    style={{ width: '150px' }}
                    placeholder="政策类型"
                    value={filterPolicyType}
                    onChange={setFilterPolicyType}
                  >
                    <Select.Option value="all">全部类型</Select.Option>
                    <Select.Option value="高企认定">高企认定</Select.Option>
                    <Select.Option value="科技评价">科技评价</Select.Option>
                    <Select.Option value="研发补贴">研发补贴</Select.Option>
                    <Select.Option value="数字化">数字化</Select.Option>
                    <Select.Option value="专精特新">专精特新</Select.Option>
                    <Select.Option value="税收优惠">税收优惠</Select.Option>
                    <Select.Option value="知识产权">知识产权</Select.Option>
                    <Select.Option value="人才补贴">人才补贴</Select.Option>
                  </Select>
                  <RangePicker
                    placeholder={['开始日期', '结束日期']}
                    value={filterDateRange}
                    onChange={setFilterDateRange}
                  />
                  <Select
                    style={{ width: '150px' }}
                    placeholder="审批部门"
                    value={filterDepartment}
                    onChange={setFilterDepartment}
                  >
                    <Select.Option value="all">全部部门</Select.Option>
                    <Select.Option value="市科技局">市科技局</Select.Option>
                    <Select.Option value="区科技局">区科技局</Select.Option>
                    <Select.Option value="市财政局">市财政局</Select.Option>
                    <Select.Option value="市工信局">市工信局</Select.Option>
                    <Select.Option value="省工信厅">省工信厅</Select.Option>
                    <Select.Option value="税务局">税务局</Select.Option>
                    <Select.Option value="区知识产权局">区知识产权局</Select.Option>
                    <Select.Option value="市人社局">市人社局</Select.Option>
                  </Select>
                  <Button 
                    icon={<FilterOutlined />}
                    onClick={() => {
                      setSearchKeyword('');
                      setFilterPolicyType('all');
                      setFilterDepartment('all');
                      setFilterDateRange(null);
                      message.success('筛选条件已清空');
                    }}
                  >
                    清空筛选
                  </Button>
                  <Button 
                    type="primary"
                    icon={<RocketOutlined />}
                    onClick={() => navigate('/policy-center/application-management/apply/new')}
                  >
                    新建申报
                  </Button>
                </Space>
                
                <Divider style={{ margin: '8px 0' }} />
                
                <Space>
                  <Text type="secondary">
                    共找到 <Text strong style={{ color: '#1890ff' }}>{filteredProjects.length}</Text> 个申报项目
                  </Text>
                </Space>
              </Space>
            </div>

            {/* 列表展示 */}
            {selectedStatus === 'drafts' ? (
              // 草稿列表
              drafts.length > 0 ? (
                <List
                  dataSource={drafts}
                  renderItem={renderDraftItem}
                  style={{ background: 'transparent' }}
                />
              ) : (
                <div style={{ 
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '60px 24px',
                  textAlign: 'center'
                }}>
                  <Empty 
                    description={
                      <Space direction="vertical">
                        <Text>暂无草稿</Text>
                        <Button type="primary" onClick={() => navigate('/policy-center/application-management')}>
                          去申报
                        </Button>
                      </Space>
                    }
                  />
                </div>
              )
            ) : filteredProjects.length > 0 ? (
              <List
                dataSource={filteredProjects}
                renderItem={renderListItem}
                style={{ background: 'transparent' }}
              />
            ) : (
              <div style={{ 
                background: '#fff',
                borderRadius: '8px',
                padding: '60px 24px',
                textAlign: 'center'
              }}>
                <Empty 
                  description={
                    <Space direction="vertical">
                      <Text>暂无符合条件的申报项目</Text>
                      <Button type="primary" onClick={() => navigate('/policy-center/application-management')}>
                        去申报
                      </Button>
                    </Space>
                  }
                />
              </div>
            )}
          </Content>
        </Layout>

        {/* 补正材料上传模态框 */}
        <Modal
          title="补正材料上传"
          open={uploadModalVisible}
          onOk={handleUpload}
          onCancel={() => setUploadModalVisible(false)}
          confirmLoading={uploading}
          okText="确认上传"
          cancelText="取消"
        >
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">支持上传 PDF、Word、Excel、图片等格式文件</Text>
          </div>
        </Modal>
      </div>
      )}
    </PageWrapper>
  );
};

export default MyApplicationsComplete;
