/**
 * 优化版申报管理模块 - UI深度优化
 * 创建时间: 2026-02-26
 * 功能: 政务类产品专业、简洁、规整的申报管理页面
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Select, 
  Button, 
  Tag, 
  Space, 
  Pagination, 
  Empty, 
  Typography, 
  message,
  Skeleton,
  Cascader,
  Input,
  Modal,
  FloatButton,
  Divider,
  Badge,
  Avatar,
  List,
  Progress,
  DatePicker,
  Popconfirm,
  ConfigProvider
} from 'antd';
import {
  FileTextOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  VerticalAlignTopOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  SendOutlined,
  AppstoreOutlined,
  StopOutlined
} from '@ant-design/icons';
import ApplyButton from '../../components/common/ApplyButton';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { DESIGN_TOKENS } from './config/designTokens';
import MyApplications from './MyApplications';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;



const mockProjects: ProjectItem[] = [
  {
    id: '1',
    title: '2026年北京市中小企业技术创新资助项目',
    description: '支持中小企业开展技术创新活动，提升企业核心竞争力，推动产业升级转型。',
    type: '技术创新',
    region: '北京市',
    funding: '最高100万元',
    deadline: '2026-03-31',
    status: 'in_progress',
    startTime: '2026-01-01',
    department: '北京市科技委员会',
    industry: '高新技术',
    targetAudience: '中小企业',
    year: '2026',
    viewCount: 1247,
    applyCount: 89,
    isApplied: false
  },
  {
    id: '2',
    title: '海淀区高层次人才创业支持计划',
    description: '面向海淀区引进和培养的高层次人才，支持其创办高新技术企业。',
    type: '人才引进',
    region: '海淀区',
    funding: '最高80万元',
    deadline: '2026-04-15',
    status: 'in_progress',
    startTime: '2026-02-01',
    department: '海淀区人才办',
    industry: '人才服务',
    targetAudience: '高层次人才',
    year: '2026',
    viewCount: 892,
    applyCount: 56,
    isApplied: false
  },
  {
    id: '3',
    title: '朝阳区文化创意产业发展扶持资金',
    description: '扶持文化创意企业发展，促进文化产业繁荣，打造文化创意产业集群。',
    type: '其他',
    region: '朝阳区',
    funding: '最高50万元',
    deadline: '2025-12-31',
    status: 'ended',
    startTime: '2025-06-01',
    department: '朝阳区文化委',
    industry: '文化创意',
    targetAudience: '文创企业',
    year: '2025',
    viewCount: 654,
    applyCount: 123,
    isApplied: false
  },
  {
    id: '4',
    title: '丰台区科技型中小企业研发费用补贴',
    description: '对符合条件的科技型中小企业给予研发费用补贴，激励企业加大研发投入。',
    type: '技术创新',
    region: '丰台区',
    funding: '最高30万元',
    deadline: '2026-05-31',
    status: 'not_started',
    startTime: '2026-03-01',
    department: '丰台区科委',
    industry: '科技服务',
    targetAudience: '科技型企业',
    year: '2026',
    viewCount: 432,
    applyCount: 0,
    isApplied: false
  }
];

// 类型定义
interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: string;
  region: string;
  funding: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'ended';
  startTime: string;
  department: string;
  industry: string;
  targetAudience: string;
  year: string;
  viewCount: number;
  applyCount: number;
  isApplied?: boolean;
}

interface FilterState {
  policyLevel: (string | number)[][];
  status: string[];
  department: string[];
  industry: string[];
  targetAudience: string[];
  year: string[];
  projectType: string[];
}

type ViewType = 'list' | 'status' | 'statistics';

const OptimizedApplicationManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const view = searchParams.get('view');
    return (view as ViewType) || 'list';
  });


  // 监听路由参数变化
  useEffect(() => {
    const view = searchParams.get('view');
    if (view && view !== currentView) {
      setCurrentView(view as ViewType);
    } else if (location.pathname === '/policy-center/my-applications') {
       // 如果是直接访问我的申报路由，强制切换到 status 视图
       setCurrentView('status');
    }
  }, [searchParams, location.pathname]);

  const [filterExpanded, setFilterExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<FilterState>({
    policyLevel: [],
    status: [],
    department: [],
    industry: [],
    targetAudience: [],
    year: [],
    projectType: []
  });
  


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [jumpPage, setJumpPage] = useState('');

  // 模拟数据


  // 筛选选项配置
  const filterOptions = {
    policyLevel: [
      { value: 'beijing', label: '北京市', children: [
        { value: 'haidian', label: '海淀区' },
        { value: 'chaoyang', label: '朝阳区' },
        { value: 'fengtai', label: '丰台区' },
        { value: 'dongcheng', label: '东城区' },
        { value: 'xicheng', label: '西城区' }
      ]},
      { value: 'shanghai', label: '上海市', children: [
        { value: 'huangpu', label: '黄浦区' },
        { value: 'xuhui', label: '徐汇区' }
      ]}
    ],
    status: [
      { value: 'not_started', label: '未开始' },
      { value: 'in_progress', label: '申报中' },
      { value: 'ended', label: '已截止' }
    ],
    department: [
      { value: 'tech_committee', label: '北京市科技委员会' },
      { value: 'talent_office', label: '海淀区人才办' },
      { value: 'culture_committee', label: '朝阳区文化委' },
      { value: 'fengtai_tech', label: '丰台区科委' }
    ],
    industry: [
      { value: 'high_tech', label: '高新技术' },
      { value: 'talent_service', label: '人才服务' },
      { value: 'culture_creative', label: '文化创意' },
      { value: 'tech_service', label: '科技服务' }
    ],
    targetAudience: [
      { value: 'sme', label: '中小企业' },
      { value: 'high_talent', label: '高层次人才' },
      { value: 'culture_enterprise', label: '文创企业' },
      { value: 'tech_enterprise', label: '科技型企业' }
    ],
    year: [
      { value: '2026', label: '2026年' },
      { value: '2025', label: '2025年' },
      { value: '2024', label: '2024年' }
    ],
    projectType: [
      { value: '技术创新', label: '技术创新' },
      { value: '人才引进', label: '人才引进' },
      { value: '其他', label: '其他' }
    ]
  };

  // 获取项目状态
  const getProjectStatus = (project: ProjectItem) => {
    const now = new Date();
    const startTime = new Date(project.startTime);
    const endTime = new Date(project.deadline);
    
    if (now < startTime) return 'not_started';
    if (now > endTime) return 'ended';
    return 'in_progress';
  };

  // 计算倒计时天数
  const getCountdownDays = (deadline: string) => {
    const now = new Date();
    const endTime = new Date(deadline);
    const diffTime = endTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      'not_started': { color: 'default', text: '未开始' },
      'in_progress': { color: 'processing', text: '申报中' },
      'ended': { color: 'error', text: '已截止' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取类型标签样式
  const getTypeTagStyle = (type: string) => {
    const styleMap = {
      '技术创新': DESIGN_TOKENS.colors.tag.tech,
      '人才引进': DESIGN_TOKENS.colors.tag.tech,
      '其他': DESIGN_TOKENS.colors.tag.funding
    };
    return styleMap[type as keyof typeof styleMap] || DESIGN_TOKENS.colors.tag.tech;
  };

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredProjects = [...mockProjects];
      
      if (filters.status.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          filters.status.includes(getProjectStatus(project))
        );
      }
      
      if (filters.projectType.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          filters.projectType.includes(project.type)
        );
      }
      
      if (filters.year.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          filters.year.includes(project.year)
        );
      }

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
      
      setProjects(paginatedProjects);
      setPagination(prev => ({
        ...prev,
        total: filteredProjects.length
      }));
    } catch (error) {
      message.error('数据加载失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      policyLevel: [],
      status: [],
      department: [],
      industry: [],
      targetAudience: [],
      year: [],
      projectType: []
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 模拟获取最新项目信息（模拟后端接口）
  const fetchProjectLatestInfo = async (id: string): Promise<ProjectItem | null> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    // 这里应该是API调用，暂时从mock数据获取
    const project = mockProjects.find(p => p.id === id);
    return project ? { ...project } : null;
  };

  // 统一的项目操作处理（确保详情与申报逻辑一致）
  const handleProjectAction = async (project: ProjectItem, action: 'view' | 'apply') => {
    const hideLoading = message.loading('正在同步项目数据...', 0);
    
    try {
      // 1. 再次拉取最新数据做二次确认
      const latestProject = await fetchProjectLatestInfo(project.id);
      hideLoading();
      
      if (!latestProject) {
        message.error('项目不存在或已被删除');
        loadData(); // 刷新列表
        return;
      }
      
      // 计算实时状态
      const latestStatus = getProjectStatus(latestProject);
      const currentStatus = getProjectStatus(project);
      
      // 2. 一致性校验：检查状态是否变更
      if (latestStatus !== currentStatus || latestProject.isApplied !== project.isApplied) {
        message.warning('项目状态发生变更，已为您自动刷新');
        loadData(); // 重新加载列表
        return;
      }

      // 3. 统一参数与权限校验
      if (action === 'apply') {
        if (latestStatus !== 'in_progress') {
          message.warning('当前项目不在申报期内');
          return;
        }
        
        // 跳转申报页 (移除 isApplied 判断，允许重新申报)
        navigate(`/application/apply/${latestProject.id}`, {
          state: {
            projectInfo: latestProject,
            fromList: true,
            isLoggedIn: isLoggedIn
          }
        });
      } else {
        // 跳转详情页（传递相同的数据源）
        navigate(`/application/detail/${latestProject.id}`, {
          state: { 
            filters,
            pagination,
            scrollPosition: window.scrollY,
            projectInfo: latestProject // 确保详情页使用最新同步的数据
          }
        });
      }
    } catch (error) {
      hideLoading();
      message.error('数据同步失败，请检查网络');
    }
  };

  // 处理申报按钮点击
  const handleApplyClick = (project: ProjectItem) => {
    handleProjectAction(project, 'apply');
  };

  // 处理查看详情
  const handleViewDetail = (project: ProjectItem) => {
    handleProjectAction(project, 'view');
  };

  // 跳转页面处理
  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (page && page > 0 && page <= Math.ceil(pagination.total / pagination.pageSize)) {
      setPagination(prev => ({ ...prev, current: page }));
      setJumpPage('');
    } else {
      message.warning('请输入有效的页码');
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 渲染筛选区域
  const renderFilterSection = () => {
    const coreFilters = ['status', 'year', 'department'];
    const allFilters = ['policyLevel', 'status', 'department', 'industry', 'targetAudience', 'year', 'projectType'];
    const displayFilters = filterExpanded ? allFilters : coreFilters;

    const filterLabels = {
      policyLevel: '政策层级',
      status: '申报状态',
      department: '主管部门',
      industry: '行业/主题',
      targetAudience: '申领对象',
      year: '年度',
      projectType: '项目类型'
    };

    return (
      <Card 
        size="small" 
        style={{ 
          marginBottom: DESIGN_TOKENS.spacing.sm,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          borderRadius: DESIGN_TOKENS.borderRadius.sm,
          boxShadow: 'none'
        }}
        styles={{ body: { padding: `${DESIGN_TOKENS.spacing.sm}px ${DESIGN_TOKENS.spacing.md}px` } }}
      >
        <Row gutter={[DESIGN_TOKENS.spacing.sm, DESIGN_TOKENS.spacing.sm]} align="middle">
          {displayFilters.map(filterKey => (
            <Col key={filterKey} xs={24} sm={12} md={8} lg={6} xl={4}>
              <div>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: DESIGN_TOKENS.fontSize.sm, 
                    marginBottom: '4px', 
                    display: 'block',
                    color: DESIGN_TOKENS.colors.text.secondary,
                    fontFamily: 'Microsoft YaHei'
                  }}
                >
                  {filterLabels[filterKey as keyof typeof filterLabels]}
                </Text>
                {filterKey === 'policyLevel' ? (
                  <Cascader
                    placeholder="请选择"
                    options={filterOptions.policyLevel}
                    multiple
                    maxTagCount={3}
                    showSearch
                    style={{ 
                      width: '100%',
                      borderRadius: DESIGN_TOKENS.borderRadius.sm
                    }}
                    value={filters.policyLevel as any}
                    onChange={(value) => setFilters(prev => ({ ...prev, policyLevel: value as (string | number)[][] }))}
                  />
                ) : (
                  <Select
                    placeholder="请选择"
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ 
                      width: '100%'
                    }}
                    value={filters[filterKey as keyof FilterState]}
                    onChange={(value) => setFilters(prev => ({ ...prev, [filterKey]: value }))}
                    maxTagCount={filterKey === 'department' ? 5 : undefined}
                  >
                    {filterOptions[filterKey as keyof typeof filterOptions]?.map((option: any) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </div>
            </Col>
          ))}
          
          <Col flex="auto">
            <Space style={{ float: 'right' }}>
              {filterExpanded && (
                <Button 
                  type="link" 
                  onClick={resetFilters}
                  style={{ 
                    padding: '0 8px',
                    color: DESIGN_TOKENS.colors.primary,
                    fontFamily: 'Microsoft YaHei'
                  }}
                >
                  重置
                </Button>
              )}
              <Button 
                type="link" 
                icon={filterExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setFilterExpanded(!filterExpanded)}
                style={{ 
                  padding: '0 8px',
                  color: DESIGN_TOKENS.colors.primary,
                  fontFamily: 'Microsoft YaHei',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {filterExpanded ? '收起' : '更多'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染项目卡片
  const renderProjectCard = (project: ProjectItem) => {
    const status = getProjectStatus(project);
    const canApply = isLoggedIn && status === 'in_progress' && !project.isApplied;
    const countdownDays = status === 'in_progress' ? getCountdownDays(project.deadline) : 0;
    const typeStyle = getTypeTagStyle(project.type);
    
    return (
      <Card
        key={project.id}
        hoverable
        style={{
          height: '200px',
          marginBottom: DESIGN_TOKENS.spacing.md,
          border: `0.5px solid ${DESIGN_TOKENS.colors.border}`,
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        styles={{ 
          body: { 
            padding: DESIGN_TOKENS.spacing.sm,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
        onClick={(e) => {
          // 如果点击的是按钮，不触发卡片点击
          const target = e.target as HTMLElement;
          if (target.closest('button')) {
            return;
          }
          handleViewDetail(project);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* 标题区 */}
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.xs }}>
          <Title 
            level={5} 
            style={{ 
              margin: 0, 
              fontSize: DESIGN_TOKENS.fontSize.lg, 
              fontWeight: 'bold',
              color: DESIGN_TOKENS.colors.text.primary,
              fontFamily: 'Microsoft YaHei',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4'
            }}
            onClick={() => handleViewDetail(project)}
          >
            {project.title}
          </Title>
        </div>

        {/* 信息区 */}
        <div style={{ flex: 1, marginBottom: DESIGN_TOKENS.spacing.sm }}>
          <Text 
            style={{ 
              fontSize: DESIGN_TOKENS.fontSize.md,
              color: DESIGN_TOKENS.colors.text.secondary,
              fontFamily: 'Microsoft YaHei',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: DESIGN_TOKENS.spacing.xs,
              lineHeight: '1.4'
            }}
          >
            {project.description}
          </Text>
          
          {/* 标签组 */}
          <Space wrap style={{ marginBottom: DESIGN_TOKENS.spacing.xs }}>
            <Tag 
              style={{
                backgroundColor: typeStyle.bg,
                color: typeStyle.text,
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                padding: '4px 8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontFamily: 'Microsoft YaHei'
              }}
            >
              {project.type}
            </Tag>
            <Tag 
              style={{
                backgroundColor: DESIGN_TOKENS.colors.tag.region.bg,
                color: DESIGN_TOKENS.colors.tag.region.text,
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                padding: '4px 8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontFamily: 'Microsoft YaHei'
              }}
            >
              {project.region}
            </Tag>
            <Tag 
              style={{
                backgroundColor: DESIGN_TOKENS.colors.tag.funding.bg,
                color: DESIGN_TOKENS.colors.tag.funding.text,
                border: 'none',
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                padding: '4px 8px',
                fontSize: DESIGN_TOKENS.fontSize.sm,
                fontFamily: 'Microsoft YaHei'
              }}
            >
              {project.funding}
            </Tag>
          </Space>
          
          {/* 截止时间和倒计时 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing.xs }}>
            <ExclamationCircleOutlined style={{ color: DESIGN_TOKENS.colors.error, fontSize: DESIGN_TOKENS.fontSize.sm }} />
            <Text style={{ fontSize: DESIGN_TOKENS.fontSize.sm, color: DESIGN_TOKENS.colors.error, fontFamily: 'Microsoft YaHei' }}>
              截止时间：{project.deadline}
            </Text>
            {status === 'in_progress' && countdownDays > 0 && (
              <Text style={{ fontSize: DESIGN_TOKENS.fontSize.sm, color: DESIGN_TOKENS.colors.error, fontFamily: 'Microsoft YaHei' }}>
                倒计时 {countdownDays} 天
              </Text>
            )}
          </div>
        </div>

        {/* 操作区 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: DESIGN_TOKENS.spacing.xs }}>
          <Button 
            size="middle"
            style={{ 
              width: '88px', 
              height: '34px',
              borderRadius: DESIGN_TOKENS.borderRadius.md,
              backgroundColor: DESIGN_TOKENS.colors.cardBackground,
              borderColor: DESIGN_TOKENS.colors.primary,
              color: DESIGN_TOKENS.colors.primary,
              fontFamily: 'Microsoft YaHei',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleViewDetail(project)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            查看详情
          </Button>
          <ApplyButton
            status={status as any}
            isApplied={false} // 强制显示为"立即申报"，允许重新申报或编辑
            onApply={() => handleApplyClick(project)}
            style={{ width: '88px', height: '34px' }}
          />
        </div>
      </Card>
    );
  };

  // 渲染概览统计
  const renderOverview = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: DESIGN_TOKENS.spacing.md }}>
      <Col xs={12} sm={6} md={6}>
        <Card size="small" style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm, border: `1px solid ${DESIGN_TOKENS.colors.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>正在申报</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.primary, fontFamily: 'Microsoft YaHei' }}>12</div>
                </div>
                <ClockCircleOutlined style={{ fontSize: '24px', color: DESIGN_TOKENS.colors.primary, opacity: 0.2 }} />
            </div>
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6}>
        <Card size="small" style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm, border: `1px solid ${DESIGN_TOKENS.colors.border}` }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>即将截止</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.error, fontFamily: 'Microsoft YaHei' }}>3</div>
                </div>
                <ExclamationCircleOutlined style={{ fontSize: '24px', color: DESIGN_TOKENS.colors.error, opacity: 0.2 }} />
            </div>
        </Card>
      </Col>
       <Col xs={12} sm={6} md={6}>
        <Card size="small" style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm, border: `1px solid ${DESIGN_TOKENS.colors.border}` }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>本月新增</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.success, fontFamily: 'Microsoft YaHei' }}>8</div>
                </div>
                <FileTextOutlined style={{ fontSize: '24px', color: DESIGN_TOKENS.colors.success, opacity: 0.2 }} />
            </div>
        </Card>
      </Col>
       <Col xs={12} sm={6} md={6}>
        <Card size="small" style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm, border: `1px solid ${DESIGN_TOKENS.colors.border}` }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: '14px', color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>累计发布</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.text.primary, fontFamily: 'Microsoft YaHei' }}>156</div>
                </div>
                <BarChartOutlined style={{ fontSize: '24px', color: DESIGN_TOKENS.colors.text.primary, opacity: 0.2 }} />
            </div>
        </Card>
      </Col>
    </Row>
  );

  // 渲染项目列表
  const renderProjectList = () => {
    if (loading) {
      return (
        <div>
          {renderOverview()}
          {renderFilterSection()}
          <Divider style={{ margin: `${DESIGN_TOKENS.spacing.sm}px 0`, borderColor: DESIGN_TOKENS.colors.border }} />
          <Row gutter={[20, 0]}>
            {[1, 2, 3, 4].map(i => (
              <Col key={i} xs={24} lg={12}>
                <Card style={{ height: '200px', marginBottom: DESIGN_TOKENS.spacing.md }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div>
          {renderOverview()}
          {renderFilterSection()}
          <Divider style={{ margin: `${DESIGN_TOKENS.spacing.sm}px 0`, borderColor: DESIGN_TOKENS.colors.border }} />
          <Empty
            image={<FileTextOutlined style={{ fontSize: '64px', color: DESIGN_TOKENS.colors.text.disabled }} />}
            description={
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg, color: DESIGN_TOKENS.colors.text.primary, fontFamily: 'Microsoft YaHei' }}>
                  暂无申报项目
                </Text>
                <br />
                <Text style={{ fontSize: DESIGN_TOKENS.fontSize.md, color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>
                  您可调整筛选条件或关注最新政策
                </Text>
              </div>
            }
          >
            <Button 
              type="primary" 
              onClick={resetFilters}
              style={{
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
                fontFamily: 'Microsoft YaHei'
              }}
            >
              重置筛选
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div>
        {renderOverview()}
        {renderFilterSection()}
        <Divider style={{ margin: `${DESIGN_TOKENS.spacing.sm}px 0`, borderColor: DESIGN_TOKENS.colors.border }} />
        
        {/* 项目统计 */}
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.sm }}>
          <Text style={{ fontSize: DESIGN_TOKENS.fontSize.md, color: DESIGN_TOKENS.colors.text.secondary, fontFamily: 'Microsoft YaHei' }}>
            共 {pagination.total} 条项目
          </Text>
        </div>
        
        <Row gutter={[20, 0]}>
          {projects.map(project => (
            <Col key={project.id} xs={24} lg={12}>
              {renderProjectCard(project)}
            </Col>
          ))}
        </Row>
        
        {/* 分页 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: DESIGN_TOKENS.spacing.lg,
          padding: `${DESIGN_TOKENS.spacing.md}px 0`,
          borderTop: `1px solid ${DESIGN_TOKENS.colors.border}`
        }}>
          <Space size="large" align="center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger
              showTotal={(total, range) => (
                <Text style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.secondary }}>
                  第 {range[0]}-{range[1]} 条/共 {total} 条
                </Text>
              )}
              pageSizeOptions={['10', '20', '30']}
              onChange={(page, pageSize) => {
                setPagination(prev => ({ ...prev, current: page, pageSize }));
              }}
              style={{
                fontFamily: 'Microsoft YaHei'
              }}
            />
            <Space>
              <Text style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.secondary }}>跳至第</Text>
              <Input
                size="small"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                style={{ width: '60px', textAlign: 'center' }}
                onPressEnter={handleJumpPage}
              />
              <Text style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.secondary }}>页</Text>
              <Button 
                size="small" 
                type="primary" 
                onClick={handleJumpPage}
                style={{
                  borderRadius: DESIGN_TOKENS.borderRadius.sm,
                  fontFamily: 'Microsoft YaHei'
                }}
              >
                确定
              </Button>
            </Space>
          </Space>
        </div>
      </div>
    );
  };



  // 渲染数据统计
  const renderStatistics = () => {
    const pieChartOption = {
      color: [
        DESIGN_TOKENS.colors.primary,
        DESIGN_TOKENS.colors.success,
        DESIGN_TOKENS.colors.warning,
        DESIGN_TOKENS.colors.tag.funding,
        DESIGN_TOKENS.colors.tag.tech
      ],
      title: {
        text: '申报项目类型分布',
        left: 'center',
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          color: DESIGN_TOKENS.colors.text.primary,
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        textStyle: {
          fontFamily: 'Microsoft YaHei'
        }
      },
      series: [
        {
          name: '项目类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 45, name: '技术创新' },
            { value: 30, name: '人才引进' },
            { value: 25, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    const barChartOption = {
        color: [DESIGN_TOKENS.colors.primary],
        title: {
            text: '月度申报趋势',
            left: 'center',
            textStyle: {
                fontFamily: 'Microsoft YaHei',
                color: DESIGN_TOKENS.colors.text.primary,
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '申报数',
                type: 'bar',
                barWidth: '60%',
                data: [10, 52, 200, 334, 390, 330, 220, 150, 80, 70, 110, 130]
            }
        ]
    };

    return (
      <div style={{ padding: DESIGN_TOKENS.spacing.md }}>
        <Title level={3} style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.primary, marginBottom: DESIGN_TOKENS.spacing.md }}>
          数据统计
        </Title>
        <Row gutter={[DESIGN_TOKENS.spacing.md, DESIGN_TOKENS.spacing.md]}>
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.primary, fontFamily: 'Microsoft YaHei' }}>
                156
              </div>
              <Text type="secondary" style={{ fontFamily: 'Microsoft YaHei' }}>项目总数</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.success, fontFamily: 'Microsoft YaHei' }}>
                1247
              </div>
              <Text type="secondary" style={{ fontFamily: 'Microsoft YaHei' }}>申报总数</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: DESIGN_TOKENS.colors.warning, fontFamily: 'Microsoft YaHei' }}>
                892
              </div>
              <Text type="secondary" style={{ fontFamily: 'Microsoft YaHei' }}>成功申报</Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card style={{ textAlign: 'center', borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1', fontFamily: 'Microsoft YaHei' }}>
                71.5%
              </div>
              <Text type="secondary" style={{ fontFamily: 'Microsoft YaHei' }}>平均成功率</Text>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card 
              style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}
            >
              <ReactECharts option={pieChartOption} style={{ height: '350px' }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}
            >
              <ReactECharts option={barChartOption} style={{ height: '350px' }} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染当前视图内容
  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return renderProjectList();
      case 'status':
        return <MyApplications />;
      case 'statistics':
        return renderStatistics();
      default:
        return renderProjectList();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: DESIGN_TOKENS.colors.background }}>
      {/* 主内容区 */}
      <Layout>
        <Content style={{ backgroundColor: DESIGN_TOKENS.colors.background }}>
          {/* 内容区域 */}
          <div style={{ 
            padding: DESIGN_TOKENS.spacing.md, 
            minHeight: '100vh',
            backgroundColor: DESIGN_TOKENS.colors.background
          }}>
            {renderCurrentView()}
          </div>
        </Content>
      </Layout>

      {/* 悬浮按钮组 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton 
          icon={<BookOutlined />} 
          tooltip="申报指引"
          onClick={() => message.info('申报指引')}
        />
        <FloatButton 
          icon={<CustomerServiceOutlined />} 
          tooltip="客服支持"
          onClick={() => message.info('客服支持')}
        />
        <FloatButton 
          icon={<VerticalAlignTopOutlined />} 
          tooltip="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </FloatButton.Group>

      {/* 登录弹窗 */}
      <Modal
        title={<span style={{ fontFamily: 'Microsoft YaHei' }}>用户登录</span>}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setLoginModalVisible(false)}
            style={{ fontFamily: 'Microsoft YaHei' }}
          >
            取消
          </Button>,
          <Button 
            key="login" 
            type="primary" 
            onClick={() => {
              setIsLoggedIn(true);
              setLoginModalVisible(false);
              message.success('登录成功');
            }}
            style={{ fontFamily: 'Microsoft YaHei' }}
          >
            登录
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <UserOutlined style={{ fontSize: '48px', color: DESIGN_TOKENS.colors.primary, marginBottom: DESIGN_TOKENS.spacing.sm }} />
          <p style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.secondary }}>
            请登录后继续申报操作
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OptimizedApplicationManagement;
