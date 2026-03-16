/**
 * 优化版申报状态页面
 * 创建时间: 2026-03-11
 * 功能: 全面优化的申报状态管理页面，包含左侧状态导航、筛选区、项目卡片、批量操作、分页等功能
 * 设计要点:
 * - 左侧状态导航栏：合理宽度、统一样式、状态计数右对齐
 * - 顶部筛选区：3列响应式布局、统一组件高度、支持折叠
 * - 批量操作栏：操作按钮左侧、新建按钮右侧
 * - 项目卡片：2列网格布局、信息层级优化、状态色彩区分
 * - 分页控件：居中对齐、统一样式
 * - 响应式适配：支持平板/移动端
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, Card, Row, Col, Select, DatePicker, Button, Space,
  Tag, Pagination, message, Popconfirm, Empty,
  Typography, Progress, Divider, Checkbox, Alert
} from 'antd';
import {
  SearchOutlined, FilterOutlined,
  DeleteOutlined, ExportOutlined, EditOutlined,
  EyeOutlined, SendOutlined, UndoOutlined,
  FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined, UploadOutlined,
  DownOutlined, UpOutlined, PlusOutlined,
  AuditOutlined,
  InboxOutlined, FileAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 接口定义
export interface MyApplicationItem {
  id: string;
  projectId: string;
  projectName: string;
  policyType: string;
  status: 'draft' | 'to_submit' | 'under_review' | 'needs_revision' | 'approved' | 'rejected' | 'expired';
  submitTime?: string;
  updateTime: string;
  deadline: string;
  department: string;
  applicant: string;
  batch: string;
  thumbnail?: string;
  progress?: number;
  currentNode?: string;
  missingMaterials?: string[];
  correctionDeadline?: string;
  isOverdue?: boolean;
  subsidyAmount?: string;
  rejectionReason?: string;
  supportDescription?: string;
  region?: string;
  amount?: string;
}

// 模拟数据
const mockMyApplications: MyApplicationItem[] = [
  {
    id: 'a1',
    projectId: '2',
    projectName: '2026年度高新技术企业认定',
    policyType: '高新技术企业认定',
    status: 'under_review',
    submitTime: '2026-01-15 10:30:00',
    updateTime: '2026-02-16 09:15:00',
    batch: '2026第一批',
    department: '北京市科学技术委员会',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-03-31',
    currentNode: '专家评审中',
    progress: 60,
    supportDescription: '支持高新技术企业发展，提供税收优惠和资金扶持，促进企业技术创新和产业升级',
    region: '北京市',
    amount: '最高50万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
  },
  {
    id: 'a2',
    projectId: '1',
    projectName: '科技型中小企业评价',
    policyType: '科技型中小企业',
    status: 'approved',
    submitTime: '2025-12-10 14:20:00',
    updateTime: '2026-01-05 16:00:00',
    batch: '2026年度',
    department: '科技部火炬中心',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-12-31',
    subsidyAmount: '资质认定',
    supportDescription: '认定科技型中小企业，享受研发费用加计扣除等优惠政策，提升企业创新能力',
    region: '全国',
    amount: '资质认定',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
  },
  {
    id: 'a3',
    projectId: '3',
    projectName: '企业研发费用加计扣除',
    policyType: '税收优惠',
    status: 'needs_revision',
    submitTime: '2026-01-20 09:00:00',
    updateTime: '2026-02-18 16:45:00',
    batch: '2025年度',
    department: '北京税务局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-05-31',
    correctionDeadline: '2026-03-20',
    missingMaterials: ['营业执照复印件', '研发项目合同', '财务审计报表'],
    supportDescription: '企业研发费用按175%在税前扣除，减轻企业税负，鼓励技术创新投入',
    region: '北京市',
    amount: '税收减免',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png'
  },
  {
    id: 'a4',
    projectId: '4',
    projectName: '专精特新中小企业认定',
    policyType: '专精特新',
    status: 'to_submit',
    updateTime: '2026-02-08 10:00:00',
    batch: '2026年度',
    department: '北京市经济和信息化局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-04-15',
    supportDescription: '支持专业化、精细化、特色化、新颖化的中小企业发展，提供资金和政策扶持',
    region: '北京市',
    amount: '最高100万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
  },
  {
    id: 'a5',
    projectId: '5',
    projectName: '首台（套）重大技术装备保险补偿',
    policyType: '资金补贴',
    status: 'draft',
    updateTime: '2026-03-01 09:30:00',
    batch: '2026年度',
    department: '工信部装备工业司',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-11-05',
    supportDescription: '对首台（套）重大技术装备提供保险补偿支持，降低企业创新风险',
    region: '全国',
    amount: '最高200万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
  },
  {
    id: 'a6',
    projectId: '6',
    projectName: '知识产权质押融资贴息',
    policyType: '金融支持',
    status: 'rejected',
    submitTime: '2025-11-20 15:00:00',
    updateTime: '2026-01-10 11:30:00',
    batch: '2025年度',
    department: '北京市知识产权局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-12-31',
    rejectionReason: '知识产权评估价值不足，未达到融资贴息标准',
    supportDescription: '对企业知识产权质押融资提供贴息支持，缓解企业融资难题',
    region: '北京市',
    amount: '最高30万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png'
  },
  {
    id: 'a7',
    projectId: '7',
    projectName: '绿色制造系统集成项目',
    policyType: '绿色发展',
    status: 'expired',
    updateTime: '2025-10-15 14:00:00',
    batch: '2025年度',
    department: '工信部节能与综合利用司',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-12-31',
    supportDescription: '支持企业开展绿色制造系统集成，推动工业绿色低碳转型',
    region: '全国',
    amount: '最高500万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMCEjg.png'
  },
  {
    id: 'a8',
    projectId: '8',
    projectName: '数字化车间/智能工厂建设',
    policyType: '数字化转型',
    status: 'under_review',
    submitTime: '2026-02-01 10:00:00',
    updateTime: '2026-02-20 14:30:00',
    batch: '2026年度',
    department: '北京市经济和信息化局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-06-30',
    currentNode: '材料初审中',
    progress: 30,
    supportDescription: '支持企业建设数字化车间和智能工厂，提升生产效率和智能化水平',
    region: '北京市',
    amount: '最高300万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png'
  }
];

const OptimizedMyApplications: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    policyLevel: undefined,
    department: undefined,
    industry: undefined,
    projectType: undefined,
    targetAudience: undefined,
    year: undefined,
    dateRange: undefined,
    sortBy: 'updateTime'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 状态统计
  const statusCounts = useMemo(() => {
    return {
      all: mockMyApplications.length,
      draft: mockMyApplications.filter(item => item.status === 'draft').length,
      to_submit: mockMyApplications.filter(item => item.status === 'to_submit').length,
      under_review: mockMyApplications.filter(item => item.status === 'under_review').length,
      needs_revision: mockMyApplications.filter(item => item.status === 'needs_revision').length,
      approved: mockMyApplications.filter(item => item.status === 'approved').length,
      rejected: mockMyApplications.filter(item => item.status === 'rejected').length,
      expired: mockMyApplications.filter(item => item.status === 'expired').length
    };
  }, []);

  // 筛选和分页逻辑
  const filteredData = useMemo(() => {
    let filtered = [...mockMyApplications];

    // 状态筛选
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // 搜索筛选
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item =>
        item.projectName.toLowerCase().includes(searchLower) ||
        item.policyType.toLowerCase().includes(searchLower) ||
        item.department.toLowerCase().includes(searchLower)
      );
    }

    setPagination(prev => ({ ...prev, total: filtered.length }));

    // 分页
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filtered.slice(start, end);
  }, [selectedStatus, searchText, pagination.current, pagination.pageSize]);

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      draft: { label: '我的草稿', color: '#8c8c8c', icon: <FileAddOutlined /> },
      to_submit: { label: '待提交', color: '#faad14', icon: <UploadOutlined /> },
      under_review: { label: '审核中', color: '#1890ff', icon: <AuditOutlined /> },
      needs_revision: { label: '需补正', color: '#fa8c16', icon: <ExclamationCircleOutlined /> },
      approved: { label: '已通过', color: '#52c41a', icon: <CheckCircleOutlined /> },
      rejected: { label: '已驳回', color: '#f5222d', icon: <CloseCircleOutlined /> },
      expired: { label: '已截止', color: '#d9d9d9', icon: <StopOutlined /> }
    };
    return configs[status] || configs.draft;
  };

  // 计算剩余天数
  const getRemainingDays = (deadline: string) => {
    const now = dayjs();
    const end = dayjs(deadline);
    return end.diff(now, 'day');
  };

  // 批量操作
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个项目吗？`,
      onOk: () => {
        message.success('删除成功');
        setSelectedRowKeys([]);
      }
    });
  };

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的项目');
      return;
    }
    message.success(`正在导出 ${selectedRowKeys.length} 个项目...`);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      policyLevel: undefined,
      department: undefined,
      industry: undefined,
      projectType: undefined,
      targetAudience: undefined,
      year: undefined,
      dateRange: undefined,
      sortBy: 'updateTime'
    });
    setSearchText('');
  };

  // 渲染左侧状态导航
  const renderStatusNav = () => {
    const statusItems = [
      { key: 'all', label: '全部项目', icon: <InboxOutlined />, count: statusCounts.all },
      { key: 'draft', label: '我的草稿', icon: <FileAddOutlined />, count: statusCounts.draft },
      { key: 'to_submit', label: '待提交', icon: <UploadOutlined />, count: statusCounts.to_submit },
      { key: 'under_review', label: '审核中', icon: <AuditOutlined />, count: statusCounts.under_review },
      { key: 'needs_revision', label: '需补正', icon: <ExclamationCircleOutlined />, count: statusCounts.needs_revision },
      { key: 'approved', label: '已通过', icon: <CheckCircleOutlined />, count: statusCounts.approved },
      { key: 'rejected', label: '已驳回', icon: <CloseCircleOutlined />, count: statusCounts.rejected },
      { key: 'expired', label: '已截止', icon: <StopOutlined />, count: statusCounts.expired }
    ];

    return (
      <Card
        bordered={false}
        style={{
          width: 220,
          height: '100%',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '16px 0' }}>
          {statusItems.map(item => (
            <div
              key={item.key}
              onClick={() => setSelectedStatus(item.key)}
              style={{
                padding: '14px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: selectedStatus === item.key ? '#1890ff' : 'transparent',
                color: selectedStatus === item.key ? '#fff' : '#8c8c8c',
                transition: 'all 0.3s',
                marginBottom: 6
              }}
              onMouseEnter={(e) => {
                if (selectedStatus !== item.key) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedStatus !== item.key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Space size={10}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <Text
                  style={{
                    color: selectedStatus === item.key ? '#fff' : '#595959',
                    fontSize: 14,
                    fontWeight: selectedStatus === item.key ? 500 : 400
                  }}
                >
                  {item.label}
                </Text>
              </Space>
              <Text
                style={{
                  color: selectedStatus === item.key ? '#fff' : '#8c8c8c',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                ({item.count})
              </Text>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // 渲染筛选区
  const renderFilterSection = () => {
    return (
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ marginBottom: filterExpanded ? 16 : 0 }}>
          <Space size={12}>
            <FilterOutlined style={{ fontSize: 16, color: '#1890ff' }} />
            <Text strong style={{ fontSize: 16 }}>筛选条件</Text>
            <Button
              type="text"
              size="small"
              icon={filterExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              {filterExpanded ? '收起' : '展开'}
            </Button>
          </Space>
        </div>

        {filterExpanded && (
          <>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>政策层级</Text>
                  <Select
                    placeholder="请选择政策层级"
                    style={{ width: '100%', height: 40 }}
                    value={filters.policyLevel}
                    onChange={(value) => setFilters({ ...filters, policyLevel: value })}
                    allowClear
                  >
                    <Option value="national">国家级</Option>
                    <Option value="provincial">省级</Option>
                    <Option value="municipal">市级</Option>
                    <Option value="district">区级</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>主管部门</Text>
                  <Select
                    placeholder="请选择主管部门"
                    style={{ width: '100%', height: 40 }}
                    value={filters.department}
                    onChange={(value) => setFilters({ ...filters, department: value })}
                    allowClear
                  >
                    <Option value="tech">科技委员会</Option>
                    <Option value="finance">财政局</Option>
                    <Option value="industry">经信局</Option>
                    <Option value="hr">人社局</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>行业/主题</Text>
                  <Select
                    placeholder="请选择行业主题"
                    style={{ width: '100%', height: 40 }}
                    value={filters.industry}
                    onChange={(value) => setFilters({ ...filters, industry: value })}
                    allowClear
                  >
                    <Option value="hightech">高新技术</Option>
                    <Option value="ai">人工智能</Option>
                    <Option value="biotech">生物医药</Option>
                    <Option value="newenergy">新能源</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>项目类型</Text>
                  <Select
                    placeholder="请选择项目类型"
                    style={{ width: '100%', height: 40 }}
                    value={filters.projectType}
                    onChange={(value) => setFilters({ ...filters, projectType: value })}
                    allowClear
                  >
                    <Option value="certification">认定类</Option>
                    <Option value="subsidy">补贴类</Option>
                    <Option value="tax">税收优惠</Option>
                    <Option value="finance">金融支持</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>审核对象</Text>
                  <Select
                    placeholder="请选择审核对象"
                    style={{ width: '100%', height: 40 }}
                    value={filters.targetAudience}
                    onChange={(value) => setFilters({ ...filters, targetAudience: value })}
                    allowClear
                  >
                    <Option value="sme">中小企业</Option>
                    <Option value="startup">初创企业</Option>
                    <Option value="hightech">高新技术企业</Option>
                    <Option value="talent">高层次人才</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>年度</Text>
                  <Select
                    placeholder="请选择年度"
                    style={{ width: '100%', height: 40 }}
                    value={filters.year}
                    onChange={(value) => setFilters({ ...filters, year: value })}
                    allowClear
                  >
                    <Option value="2026">2026年</Option>
                    <Option value="2025">2025年</Option>
                    <Option value="2024">2024年</Option>
                  </Select>
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>更新时间</Text>
                  <RangePicker
                    style={{ width: '100%', height: 40 }}
                    value={filters.dateRange}
                    onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                  />
                </Space>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>排序方式</Text>
                  <Select
                    style={{ width: '100%', height: 40 }}
                    value={filters.sortBy}
                    onChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <Option value="updateTime">更新时间</Option>
                    <Option value="submitTime">提交时间</Option>
                    <Option value="deadline">截止时间</Option>
                  </Select>
                </Space>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space size={12}>
                <Button onClick={handleResetFilters}>重置</Button>
                <Button type="primary" icon={<SearchOutlined />}>
                  搜索
                </Button>
              </Space>
            </div>
          </>
        )}
      </Card>
    );
  };

  // 渲染批量操作栏
  const renderBatchActions = () => {
    return (
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space size={12}>
              <Checkbox
                checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
                indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRowKeys(filteredData.map(item => item.id));
                  } else {
                    setSelectedRowKeys([]);
                  }
                }}
              >
                全选
              </Checkbox>
              {selectedRowKeys.length > 0 && (
                <Text type="secondary">已选择 {selectedRowKeys.length} 项</Text>
              )}
              <Button
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleBatchExport}
                disabled={selectedRowKeys.length === 0}
              >
                导出选中
              </Button>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/application/apply')}
              size="large"
            >
              新建申报
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染列表项
  const renderListItem = (item: MyApplicationItem) => {
    const statusConfig = getStatusConfig(item.status);
    const remainingDays = getRemainingDays(item.deadline);
    const isSelected = selectedRowKeys.includes(item.id);
    const isExpired = item.status === 'expired' || remainingDays < 0;

    return (
      <div
        key={item.id}
        style={{
          padding: '16px 20px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #f0f0f0',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fafafa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
        }}
      >
        <Row align="middle" gutter={16}>
          {/* 左侧：选择框 + 项目名称 + 状态 */}
          <Col flex="auto">
            <Space align="start" size={12}>
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRowKeys([...selectedRowKeys, item.id]);
                  } else {
                    setSelectedRowKeys(selectedRowKeys.filter(key => key !== item.id));
                  }
                }}
                style={{ marginTop: 4 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 6 }}>
                  <Space size={8}>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#262626',
                        cursor: 'pointer',
                        display: 'inline'
                      }}
                      onClick={() => navigate(`/application/detail/${item.id}`)}
                    >
                      {item.projectName}
                    </Title>
                    <Tag
                      icon={statusConfig.icon}
                      color={statusConfig.color}
                      style={{ fontSize: 12 }}
                    >
                      {statusConfig.label}
                    </Tag>
                  </Space>
                </div>
                
                {/* 补正提示 */}
                {item.status === 'needs_revision' && item.correctionDeadline && (
                  <Text type="warning" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
                    补正截止：{item.correctionDeadline}
                  </Text>
                )}
                
                {/* 扶持描述 */}
                <Paragraph
                  ellipsis={{ rows: 1 }}
                  style={{
                    color: '#8c8c8c',
                    fontSize: 14,
                    marginBottom: 8,
                    marginTop: 0
                  }}
                >
                  {item.supportDescription}
                </Paragraph>
                
                {/* 标签组 */}
                <Space size={6} wrap>
                  <Tag style={{ fontSize: 12, color: '#8c8c8c', border: 'none', background: '#f5f5f5' }}>
                    {item.policyType}
                  </Tag>
                  <Tag style={{ fontSize: 12, color: '#8c8c8c', border: 'none', background: '#f5f5f5' }}>
                    {item.region}
                  </Tag>
                  <Tag style={{ fontSize: 12, color: '#8c8c8c', border: 'none', background: '#f5f5f5' }}>
                    {item.amount}
                  </Tag>
                </Space>
              </div>
            </Space>
          </Col>

          {/* 右侧：截止时间 + 进度 + 操作按钮 */}
          <Col flex="400px" style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              {/* 截止时间 */}
              <div>
                {!isExpired ? (
                  <Space size={8}>
                    <Text
                      style={{
                        color: remainingDays <= 7 ? '#ff4d4f' : '#faad14',
                        fontWeight: 500,
                        fontSize: 14
                      }}
                    >
                      剩余 {remainingDays} 天
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      截止：{item.deadline}
                    </Text>
                  </Space>
                ) : (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    已截止：{item.deadline}
                  </Text>
                )}
              </div>

              {/* 审核进度 */}
              {item.status === 'under_review' && item.progress !== undefined && (
                <div style={{ width: 200 }}>
                  <Progress 
                    percent={item.progress} 
                    strokeColor="#1890ff" 
                    size="small"
                    format={(percent) => `审核进度 ${percent}%`}
                  />
                </div>
              )}

              {/* 操作按钮 */}
              <Space size={8}>
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/application/detail/${item.id}`)}
                >
                  查看详情
                </Button>
                
                {item.status === 'draft' && (
                  <Button
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/application/apply?id=${item.id}`)}
                  >
                    继续编辑
                  </Button>
                )}
                
                {item.status === 'to_submit' && (
                  <Button
                    size="small"
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => message.success('提交成功')}
                  >
                    立即申报
                  </Button>
                )}
                
                {item.status === 'needs_revision' && (
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<FileTextOutlined />}
                    onClick={() => navigate(`/application/apply?id=${item.id}`)}
                  >
                    补正材料
                  </Button>
                )}
                
                {item.status === 'under_review' && (
                  <Popconfirm
                    title="确定要撤回申报吗？"
                    onConfirm={() => message.success('撤回成功')}
                  >
                    <Button
                      size="small"
                      icon={<UndoOutlined />}
                    >
                      撤回申报
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Layout.Content style={{ padding: 24 }}>
        <Row gutter={24} wrap={false}>
          {/* 左侧状态导航栏 */}
          <Col flex="220px" xs={0} sm={0} md={0} lg="220px" xl="220px">
            <div style={{ position: 'sticky', top: 24 }}>
              {renderStatusNav()}
            </div>
          </Col>

          {/* 右侧内容区 */}
          <Col flex="auto">
            {/* 筛选区 */}
            {renderFilterSection()}

            {/* 批量操作栏 */}
            {renderBatchActions()}

            {/* 项目列表 */}
            {filteredData.length > 0 ? (
              <>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  {filteredData.map(item => renderListItem(item))}
                </Card>

                {/* 分页控件 */}
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                      setPagination({ ...pagination, current: page, pageSize: pageSize || 10 });
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 条记录`}
                    pageSizeOptions={['10', '20', '30', '50']}
                  />
                </div>
              </>
            ) : (
              <Card
                bordered={false}
                style={{
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  padding: '60px 0'
                }}
              >
                <Empty
                  description="暂无申报项目"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/application/apply')}
                  >
                    新建申报
                  </Button>
                </Empty>
              </Card>
            )}
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default OptimizedMyApplications;
