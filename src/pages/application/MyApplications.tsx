import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';
import { 
  Layout, Card, Row, Col, Input, Select, DatePicker, Button, Space, 
  Tag, Pagination, Modal, message, Popconfirm, Tooltip, Empty, 
  Drawer, Steps, Alert, Result,
  List, Checkbox, Dropdown, MenuProps, Avatar, Typography, Progress, Badge, Divider
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, ReloadOutlined, 
  DeleteOutlined, ExportOutlined, EditOutlined, 
  EyeOutlined, SendOutlined, UndoOutlined, 
  MoreOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, 
  ClockCircleOutlined, ExclamationCircleOutlined,
  StopOutlined, UserOutlined, UploadOutlined,
  AppstoreOutlined, FormOutlined,
  BellOutlined, MailOutlined, MessageOutlined, MobileOutlined,
  DownOutlined, UpOutlined
} from '@ant-design/icons';

import { DownloadOutlined } from '@ant-design/icons';
import { DESIGN_TOKENS } from './config/designTokens';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// --- 接口定义 ---
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

// --- 模拟数据 ---
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
    supportDescription: '支持高新技术企业发展，提供税收优惠和资金扶持',
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
    supportDescription: '认定科技型中小企业，享受研发费用加计扣除等优惠政策',
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
    correctionDeadline: '2026-02-20',
    missingMaterials: ['营业执照', '合同', '财务报表'],
    isOverdue: true,
    supportDescription: '企业研发费用按175%在税前扣除，减轻企业税负',
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
    supportDescription: '支持专业化、精细化、特色化、新颖化的中小企业发展',
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
    supportDescription: '对首台（套）重大技术装备提供保险补偿支持',
    region: '全国',
    amount: '最高200万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
  },
  {
    id: 'a6',
    projectId: '6',
    projectName: '朝阳区文化产业发展资金',
    policyType: '专项资金',
    status: 'rejected',
    submitTime: '2025-11-15 11:20:00',
    updateTime: '2025-12-01 10:00:00',
    batch: '2025第四季度',
    department: '朝阳区文创办',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-12-31',
    rejectionReason: '申报材料不完整，缺少近三年财务审计报告',
    supportDescription: '支持文化产业发展，促进文化创意产业升级',
    region: '朝阳区',
    amount: '最高30万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
  },
  {
    id: 'a7',
    projectId: '7',
    projectName: '海淀区创业支持计划',
    policyType: '人才支持',
    status: 'expired',
    updateTime: '2025-09-01 10:00:00',
    batch: '2025年度',
    department: '海淀园管委会',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-10-01',
    supportDescription: '为创业人才提供资金支持和政策扶持',
    region: '海淀区',
    amount: '最高20万元',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
  },
  {
    id: 'a8',
    projectId: '8',
    projectName: '北京市知识产权试点示范单位',
    policyType: '资质认定',
    status: 'under_review',
    submitTime: '2026-02-25 14:30:00',
    updateTime: '2026-02-26 09:00:00',
    batch: '2026年度',
    department: '北京市知识产权局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-06-30',
    currentNode: '初审通过',
    progress: 40,
    supportDescription: '认定知识产权试点示范单位，提供知识产权保护支持',
    region: '北京市',
    amount: '资质认定',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'
  }
];

// --- 状态配置 ---
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  all: { label: '全部项目', color: 'default', icon: <AppstoreOutlined /> },
  draft: { label: '我的草稿', color: 'default', icon: <FileTextOutlined /> },
  to_submit: { label: '待提交', color: 'blue', icon: <SendOutlined /> },
  under_review: { label: '审核中', color: 'processing', icon: <ClockCircleOutlined /> },
  needs_revision: { label: '需补正', color: 'warning', icon: <ExclamationCircleOutlined /> },
  approved: { label: '已通过', color: 'success', icon: <CheckCircleOutlined /> },
  rejected: { label: '已驳回', color: 'error', icon: <CloseCircleOutlined /> },
  expired: { label: '已过期', color: 'default', icon: <StopOutlined /> }
};

// --- 筛选配置 ---
const FILTER_OPTIONS = {
  policyLevel: ['国家级', '省级', '市级', '区级'],
  department: ['北京市科学技术委员会', '科技部火炬中心', '北京税务局', '北京市经济和信息化局', '工信部装备工业司'],
  industry: ['高新技术', '科技创新', '文化创意', '现代服务', '先进制造'],
  auditObject: ['企业', '个人', '机构', '团队'],
  year: ['2026年', '2025年', '2024年', '2023年'],
  projectType: ['认定类', '补贴类', '奖励类', '扶持类']
};

const MyApplicationsOptimized: React.FC = () => {
  const navigate = useNavigate();

  // --- State ---
  const [data, setData] = useState<MyApplicationItem[]>(mockMyApplications);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 筛选状态
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    policyLevel: undefined as string | undefined,
    status: undefined as string | undefined,
    department: undefined as string | undefined,
    industry: undefined as string | undefined,
    auditObject: undefined as string | undefined,
    year: undefined as string | undefined,
    projectType: undefined as string | undefined,
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [sortOrder, setSortOrder] = useState<'updateTime_desc' | 'submitTime_desc' | 'deadline_asc'>('updateTime_desc');
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });

  // --- 衍生数据 ---
  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. 状态筛选
    if (activeTab !== 'all') {
      result = result.filter(item => item.status === activeTab);
    }

    // 2. 文本搜索
    if (searchText) {
      const lowerText = searchText.toLowerCase();
      result = result.filter(item => 
        item.projectName.toLowerCase().includes(lowerText) || 
        item.policyType.toLowerCase().includes(lowerText) ||
        item.department.toLowerCase().includes(lowerText)
      );
    }

    // 3. 筛选条件
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'department') {
          result = result.filter(item => item.department === value);
        } else if (key === 'projectType') {
          result = result.filter(item => item.policyType.includes(value.replace('类', '')));
        }
        // 其他筛选条件可以根据实际需求添加
      }
    });

    // 4. 日期筛选
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day').valueOf();
      const end = dateRange[1].endOf('day').valueOf();
      result = result.filter(item => {
        const time = new Date(item.updateTime).getTime();
        return time >= start && time <= end;
      });
    }

    // 5. 排序
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'updateTime_desc':
          return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
        case 'submitTime_desc':
          return new Date(b.submitTime || 0).getTime() - new Date(a.submitTime || 0).getTime();
        case 'deadline_asc':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [data, activeTab, searchText, filters, dateRange, sortOrder]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // 更新总数
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, total: filteredData.length }));
  }, [filteredData.length]);

  // --- Actions ---
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData([...mockMyApplications]);
      setLoading(false);
      message.success('数据已刷新');
    }, 800);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    message.success('删除成功');
  };

  const handleSubmit = (id: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'under_review', submitTime: new Date().toLocaleString(), updateTime: new Date().toLocaleString() } : item
    ));
    message.success('提交成功，进入审核流程');
  };

  const handleFilterReset = () => {
    setFilters({
      policyLevel: undefined,
      status: undefined,
      department: undefined,
      industry: undefined,
      auditObject: undefined,
      year: undefined,
      projectType: undefined,
    });
    setSearchText('');
    setDateRange(null);
    setSortOrder('updateTime_desc');
    message.success('筛选条件已重置');
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const config = statusConfig[status] || statusConfig['draft'];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // 计算截止时间倒计时
  const getDeadlineInfo = (deadline: string, status: string) => {
    const now = dayjs();
    const deadlineDate = dayjs(deadline);
    const daysLeft = deadlineDate.diff(now, 'day');
    
    if (status === 'expired' || daysLeft < 0) {
      return { text: '已截止', color: '#ff4d4f', urgent: false };
    } else if (daysLeft <= 7) {
      return { text: `${daysLeft}天后截止`, color: '#faad14', urgent: true };
    } else if (daysLeft <= 30) {
      return { text: `${daysLeft}天后截止`, color: '#1890ff', urgent: false };
    } else {
      return { text: deadlineDate.format('YYYY-MM-DD'), color: '#8c8c8c', urgent: false };
    }
  };

  // 菜单项
  const menuItems = Object.keys(statusConfig)
    .filter(key => key !== 'all')
    .map(key => ({
      key,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>
            {statusConfig[key].icon}
            <span style={{ marginLeft: 8 }}>{statusConfig[key].label}</span>
          </span>
          <Badge 
            count={data.filter(i => i.status === key).length} 
            style={{ 
              backgroundColor: activeTab === key ? '#fff' : '#f0f0f0', 
              color: activeTab === key ? '#1890ff' : '#999',
              boxShadow: 'none' 
            }} 
          />
        </Space>
      )
    }));

  return (
    <div className="my-applications-optimized" style={{ 
      padding: '24px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Row gutter={[24, 24]}>
        {/* 左侧状态菜单 */}
        <Col xs={24} md={6} lg={5}>
          <Card 
            bordered={false} 
            style={{ 
              height: '100%', 
              minHeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
            styles={{ body: { padding: '20px 16px' } }}
          >
            <div style={{ 
              padding: '0 8px 16px', 
              borderBottom: '1px solid #f0f0f0', 
              marginBottom: 16 
            }}>
              <Title level={5} style={{ margin: 0, color: '#262626' }}>申报状态</Title>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button 
                type={activeTab === 'all' ? 'primary' : 'text'} 
                block 
                style={{ 
                  textAlign: 'left', 
                  height: 44, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  borderRadius: '6px'
                }}
                icon={<AppstoreOutlined />}
                onClick={() => setActiveTab('all')}
              >
                <span>全部项目</span>
                <Badge 
                  count={data.length} 
                  style={{ 
                    backgroundColor: activeTab === 'all' ? '#fff' : '#f0f0f0', 
                    color: activeTab === 'all' ? '#1890ff' : '#999',
                    boxShadow: 'none' 
                  }} 
                />
              </Button>
              {menuItems.map(item => (
                <Button
                  key={item.key}
                  type={activeTab === item.key ? 'primary' : 'text'}
                  block
                  style={{ 
                    textAlign: 'left', 
                    height: 44,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    borderRadius: '6px'
                  }}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        {/* 右侧主内容区 */}
        <Col xs={24} md={18} lg={19}>
          <Card 
            bordered={false} 
            style={{ 
              minHeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
            styles={{ body: { padding: '24px' } }}
          >
            {/* 优化后的筛选区 */}
            <div style={{ 
              background: '#fafafa', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #f0f0f0'
            }}>
              {/* 第一行：搜索框 */}
              <Row gutter={[16, 16]} style={{ marginBottom: filterCollapsed ? 0 : 16 }}>
                <Col xs={24} sm={16} md={18} lg={20}>
                  <Input 
                    placeholder="搜索项目名称、政策类型、主管部门" 
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    style={{ 
                      height: '40px',
                      borderRadius: '6px'
                    }}
                  />
                </Col>
                <Col xs={24} sm={8} md={6} lg={4}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button 
                      icon={<ReloadOutlined />} 
                      onClick={handleRefresh}
                      style={{ height: '40px', borderRadius: '6px' }}
                    />
                    <Button 
                      icon={filterCollapsed ? <DownOutlined /> : <UpOutlined />}
                      onClick={() => setFilterCollapsed(!filterCollapsed)}
                      style={{ height: '40px', borderRadius: '6px' }}
                    >
                      {filterCollapsed ? '展开' : '收起'}
                    </Button>
                    <Button 
                      onClick={handleFilterReset}
                      style={{ height: '40px', borderRadius: '6px' }}
                    >
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>

              {/* 展开的筛选条件 */}
              {!filterCollapsed && (
                <>
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>政策层级</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.policyLevel}
                        onChange={value => setFilters(prev => ({ ...prev, policyLevel: value }))}
                      >
                        {FILTER_OPTIONS.policyLevel.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>主管部门</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.department}
                        onChange={value => setFilters(prev => ({ ...prev, department: value }))}
                      >
                        {FILTER_OPTIONS.department.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>行业/主题</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.industry}
                        onChange={value => setFilters(prev => ({ ...prev, industry: value }))}
                      >
                        {FILTER_OPTIONS.industry.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>项目类型</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.projectType}
                        onChange={value => setFilters(prev => ({ ...prev, projectType: value }))}
                      >
                        {FILTER_OPTIONS.projectType.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>审核对象</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.auditObject}
                        onChange={value => setFilters(prev => ({ ...prev, auditObject: value }))}
                      >
                        {FILTER_OPTIONS.auditObject.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>年度</Text>
                      </div>
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%', height: '36px' }}
                        allowClear
                        value={filters.year}
                        onChange={value => setFilters(prev => ({ ...prev, year: value }))}
                      >
                        {FILTER_OPTIONS.year.map(item => (
                          <Option key={item} value={item}>{item}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>更新时间</Text>
                      </div>
                      <RangePicker 
                        style={{ width: '100%', height: '36px' }}
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <div style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>排序方式</Text>
                      </div>
                      <Select 
                        defaultValue="updateTime_desc"
                        style={{ width: '100%', height: '36px' }}
                        onChange={(val: any) => setSortOrder(val)}
                        options={[
                          { label: '按更新时间倒序', value: 'updateTime_desc' },
                          { label: '按提交时间倒序', value: 'submitTime_desc' },
                          { label: '按截止时间正序', value: 'deadline_asc' },
                        ]}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>

            {/* 分割线 */}
            <Divider style={{ margin: '0 0 24px 0', borderColor: '#e8e8e8' }} />

            {/* 工具栏 */}
            <Row 
              justify="space-between" 
              align="middle" 
              style={{ 
                marginBottom: 24, 
                background: '#f8f9fa', 
                padding: '16px 20px', 
                borderRadius: 8,
                border: '1px solid #e9ecef'
              }}
            >
              <Space wrap>
                <Checkbox 
                  indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedRowKeys.length === filteredData.length}
                  onChange={e => setSelectedRowKeys(e.target.checked ? filteredData.map(i => i.id) : [])}
                >
                  全选
                </Checkbox>
                <Divider type="vertical" />
                <Button 
                  danger 
                  disabled={selectedRowKeys.length === 0} 
                  icon={<DeleteOutlined />}
                >
                  批量删除
                </Button>
                <Button 
                  disabled={selectedRowKeys.length === 0}
                  icon={<ExportOutlined />}
                >
                  导出选中
                </Button>
              </Space>
              <Space wrap>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  共 {pagination.total} 条记录
                </Text>
                <Button 
                  type="primary" 
                  icon={<FormOutlined />} 
                  onClick={() => navigate('/application/wizard')}
                  style={{ borderRadius: '6px' }}
                >
                  新建申报
                </Button>
              </Space>
            </Row>

            {/* 2列网格项目卡片 */}
            <Row gutter={[16, 16]}>
              {paginatedData.map(item => {
                const deadlineInfo = getDeadlineInfo(item.deadline, item.status);
                const isExpired = item.status === 'expired' || deadlineInfo.text === '已截止';
                
                return (
                  <Col xs={24} lg={12} key={item.id}>
                    <Card 
                      hoverable={!isExpired}
                      style={{ 
                        height: '100%',
                        border: selectedRowKeys.includes(item.id) ? '2px solid #1890ff' : '1px solid #e8e8e8',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'all 0.3s ease',
                        opacity: isExpired ? 0.7 : 1
                      }}
                      styles={{ 
                        body: { 
                          padding: '20px',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        } 
                      }}
                    >
                      {/* 卡片头部 */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Checkbox 
                              checked={selectedRowKeys.includes(item.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedRowKeys([...selectedRowKeys, item.id]);
                                } else {
                                  setSelectedRowKeys(selectedRowKeys.filter(k => k !== item.id));
                                }
                              }}
                            />
                            <Avatar 
                              shape="square" 
                              size={40} 
                              src={item.thumbnail} 
                              icon={<FileTextOutlined />} 
                              style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                            />
                          </div>
                          <Title 
                            level={5} 
                            style={{ 
                              margin: 0, 
                              fontSize: '16px',
                              fontWeight: 600,
                              lineHeight: '24px',
                              color: '#262626'
                            }} 
                            ellipsis={{ tooltip: item.projectName }}
                          >
                            <a 
                              onClick={() => navigate(`/application/detail/${item.id}`, { state: { projectInfo: item } })}
                              style={{ color: 'inherit' }}
                            >
                              {item.projectName}
                            </a>
                          </Title>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {renderStatusTag(item.status)}
                        </div>
                      </div>

                      {/* 扶持描述 */}
                      <Paragraph 
                        style={{ 
                          margin: '0 0 16px 0',
                          color: '#595959',
                          fontSize: '13px',
                          lineHeight: '20px'
                        }}
                        ellipsis={{ rows: 2, tooltip: item.supportDescription }}
                      >
                        {item.supportDescription}
                      </Paragraph>

                      {/* 标签区域 */}
                      <div style={{ marginBottom: '16px' }}>
                        <Space wrap size={[8, 8]}>
                          <Tag color="blue" style={{ borderRadius: '4px' }}>{item.policyType}</Tag>
                          <Tag color="geekblue" style={{ borderRadius: '4px' }}>{item.region}</Tag>
                          <Tag color="green" style={{ borderRadius: '4px' }}>{item.amount}</Tag>
                        </Space>
                      </div>

                      {/* 截止时间 */}
                      <div style={{ 
                        background: deadlineInfo.urgent ? '#fff7e6' : '#f6f8fa',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        border: `1px solid ${deadlineInfo.urgent ? '#ffd591' : '#e1e4e8'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>截止时间</Text>
                          <Text 
                            style={{ 
                              fontSize: '14px', 
                              fontWeight: 500,
                              color: deadlineInfo.color 
                            }}
                          >
                            {deadlineInfo.urgent && <ClockCircleOutlined style={{ marginRight: 4 }} />}
                            {deadlineInfo.text}
                          </Text>
                        </div>
                      </div>

                      {/* 进度条 */}
                      {['under_review', 'approved'].includes(item.status) && (
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              当前节点: {item.currentNode || '审核中'}
                            </Text>
                            <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{item.progress}%</Text>
                          </div>
                          <Progress 
                            percent={item.progress} 
                            size="small" 
                            showInfo={false} 
                            strokeColor="#52c41a"
                            style={{ marginBottom: 0 }}
                          />
                        </div>
                      )}

                      {/* 补正信息 */}
                      {item.status === 'needs_revision' && (
                        <Alert 
                          type="warning" 
                          showIcon 
                          style={{ 
                            marginBottom: '16px', 
                            padding: '8px 12px',
                            fontSize: '12px'
                          }}
                          message={
                            <div>
                              <div>补正截止: {item.correctionDeadline}</div>
                              <div>需补正: {item.missingMaterials?.join('、')}</div>
                            </div>
                          }
                        />
                      )}

                      {/* 操作按钮 */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '8px',
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: '1px solid #f0f0f0'
                      }}>
                        <Button 
                          size="small" 
                          icon={<EyeOutlined />} 
                          onClick={() => navigate(`/application/detail/${item.id}`, { state: { projectInfo: item } })}
                          style={{ borderRadius: '4px' }}
                        >
                          查看详情
                        </Button>
                        
                        {isExpired ? (
                          <Button 
                            size="small" 
                            disabled
                            style={{ 
                              borderRadius: '4px',
                              color: '#bfbfbf',
                              borderColor: '#d9d9d9'
                            }}
                          >
                            已截止
                          </Button>
                        ) : (
                          <>
                            {['draft', 'to_submit', 'needs_revision'].includes(item.status) && (
                              <Button 
                                type="primary" 
                                size="small" 
                                icon={<EditOutlined />} 
                                onClick={() => navigate('/application/wizard')}
                                style={{ borderRadius: '4px' }}
                              >
                                {item.status === 'needs_revision' ? '补正材料' : '立即申报'}
                              </Button>
                            )}

                            {['under_review'].includes(item.status) && (
                              <Button 
                                size="small" 
                                icon={<UndoOutlined />}
                                style={{ borderRadius: '4px' }}
                              >
                                撤回申报
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {/* 居中分页 */}
            {filteredData.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '32px',
                padding: '20px 0'
              }}>
                <Pagination
                  {...pagination}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => `共 ${total} 条，当前 ${range[0]}-${range[1]} 条`}
                  onChange={(page, pageSize) => {
                    setPagination(prev => ({ ...prev, current: page, pageSize }));
                  }}
                  style={{
                    '& .ant-pagination-item': {
                      borderRadius: '6px'
                    },
                    '& .ant-pagination-item-active': {
                      borderColor: '#1890ff'
                    }
                  }}
                />
              </div>
            )}

            {/* 空状态 */}
            {filteredData.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Empty 
                  description="暂无符合条件的申报项目"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    icon={<FormOutlined />} 
                    onClick={() => navigate('/application/wizard')}
                  >
                    新建申报
                  </Button>
                </Empty>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyApplicationsOptimized;
