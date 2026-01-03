import React, { Suspense, lazy, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Spin, Badge } from 'antd';
import ErrorBoundary from './components/ErrorBoundary';
import PerformanceMonitor from './components/PerformanceMonitor';
import './styles/common.css';
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyOutlined,
  LogoutOutlined,
  BookOutlined,
  KeyOutlined,
  BankOutlined,
  FilterOutlined,
  FileTextOutlined,
  DollarOutlined,
  FundOutlined,
  LineChartOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  FileSearchOutlined,
  AppstoreOutlined,
  SendOutlined,
  FileProtectOutlined,
  LinkOutlined,
  RobotOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  StarOutlined,
  CalendarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

// 懒加载页面组件 - 提升初始加载性能
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const SystemManagement = lazy(() => import('./pages/SystemManagement'));
const UserManagement = lazy(() => import('./pages/system/UserManagement'));
const RoleManagement = lazy(() => import('./pages/system/RoleManagement'));
const PermissionManagement = lazy(() => import('./pages/system/PermissionManagement'));
const PersonalCenter = lazy(() => import('./pages/system/PersonalCenter'));
const MyFavorites = lazy(() => import('./pages/system/MyFavorites'));
const CompanyManagement = lazy(() => import('./pages/system/CompanyManagement'));
const PolicyCenterMain = lazy(() => import('./pages/policy/PolicyCenterMain'));
const SmartMatching = lazy(() => import('./pages/SmartMatching'));
const LegalSupport = lazy(() => import('./pages/LegalSupport'));
const RegulationQuery = lazy(() => import('./pages/legal/RegulationQuery'));
const LegalInterpretation = lazy(() => import('./pages/legal/LegalInterpretation'));
const TimelinessManagement = lazy(() => import('./pages/legal/TimelinessManagement'));
const JudicialCaseSearch = lazy(() => import('./pages/legal/JudicialCaseSearch'));
const CaseDetail = lazy(() => import('./pages/legal/CaseDetail'));
const EnhancedContractManagement = lazy(() => import('./pages/legal/EnhancedContractManagement'));
const AIAssistant = lazy(() => import('./pages/legal/AIAssistant'));
const AIAssistantHistory = lazy(() => import('./pages/legal/AIAssistantHistory'));
// 使用增强版合同管理组件，移除旧版组件
const MyContractDetail = lazy(() => import('./pages/legal/MyContractDetail'));
const ApplicationManagement = lazy(() => import('./pages/application/ApplicationManagement'));
const QualificationList = lazy(() => import('./pages/application/QualificationList'));
const QualificationDetail = lazy(() => import('./pages/application/QualificationDetail'));
const ApplicationWizard = lazy(() => import('./pages/application/ApplicationWizard'));
const DraftManagement = lazy(() => import('./pages/application/DraftManagement'));
const ConditionCheck = lazy(() => import('./pages/application/ConditionCheck'));
const SupplyChainFinance = lazy(() => import('./pages/SupplyChainFinance'));
const FinancingDiagnosis = lazy(() => import('./pages/supply-chain/FinancingDiagnosis'));
const FinancingDiagnosisResult = lazy(() => import('./pages/supply-chain/FinancingDiagnosisResult'));
const FinancingOptionDetail = lazy(() => import('./pages/supply-chain/FinancingOptionDetail'));
const FinancingApplicationSuccess = lazy(() => import('./pages/supply-chain/FinancingApplicationSuccess'));
const DiagnosisAnalysis = lazy(() => import('./pages/supply-chain/DiagnosisAnalysis'));
const DataVisualization = lazy(() => import('./pages/supply-chain/DataVisualization'));
const IndustryHall = lazy(() => import('./pages/IndustryHall'));
const SupplyDemandHall = lazy(() => import('./pages/industry/SupplyDemandHall'));
const SupplyDemandDetail = lazy(() => import('./pages/industry/SupplyDemandDetail'));
const NewPublication = lazy(() => import('./pages/industry/NewPublication'));
const ConnectionApplicationSuccess = lazy(() => import('./pages/industry/ConnectionApplicationSuccess'));
const MyPublications = lazy(() => import('./pages/industry/MyPublications'));
const MyApplicationsEnhanced = lazy(() => import('./pages/application/MyApplicationsComplete'));
const ApplicationDetailEnhanced = lazy(() => import('./pages/application/ApplicationDetailEnhanced'));


// 加载中组件
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column'
  }}>
    <Spin size="large" />
    <div style={{ marginTop: 16, color: '#666' }}>加载中...</div>
  </div>
);

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

// 受保护的路由组件
const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// 主布局组件
const MainLayout: React.FC<{}> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = useMemo(() => localStorage.getItem('username') || 'Admin', []);

  // 菜单点击处理 - 使用useCallback避免每次渲染创建新函数
  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    navigate(key);
  }, [navigate]);

  // 菜单配置 - 使用useMemo避免每次渲染重新创建
  const menuItems: MenuProps['items'] = useMemo(() => [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/policy-center',
      icon: <BookOutlined />,
      label: '智慧政策',
      children: [
        {
          key: '/policy-center/main',
          icon: <BookOutlined />,
          label: '智慧政策',
        },
        {
          key: '/policy-center/smart-matching',
          icon: <FilterOutlined />,
          label: '智能匹配',
        },
        {
          key: '/policy-center/application-management',
          icon: <FileTextOutlined />,
          label: '申报管理',
        },
        {
          key: '/policy-center/my-applications',
          icon: <FileTextOutlined />,
          label: (
            <Space>
              <span>我的申报</span>
              <Badge count={3} offset={[5, 0]} size="small" />
            </Space>
          ),
        },
      ],
    },
    {
      key: '/legal-support',
      icon: <BankOutlined />,
      label: '法律护航',
      children: [
        {
          key: '/legal-support/judicial-cases',
          icon: <FileSearchOutlined />,
          label: '司法案例库',
        },
        {
          key: '/legal-support/regulation-query',
          icon: <SafetyOutlined />,
          label: '法规查询',
        },
        {
          key: '/legal-support/contract-management',
          icon: <FileTextOutlined />,
          label: '合同管理',
        },
      ],
    },
    {
      key: '/industry-hall',
      icon: <AppstoreOutlined />,
      label: '产业大厅',
      children: [
        { key: '/industry-hall/supply-demand', icon: <SendOutlined />, label: '商机大厅' },
        { key: '/industry-hall/my-opportunities', icon: <FileTextOutlined />, label: '我的商机' },
      ],
    },
    {
      key: '/supply-chain-finance',
      icon: <DollarOutlined />,
      label: '金融服务',
      children: [
        {
          key: '/supply-chain-finance/financing-diagnosis',
          icon: <FundOutlined />,
          label: '融资诊断',
        },
        {
          key: '/supply-chain-finance/diagnosis-report',
          icon: <FileTextOutlined />,
          label: '诊断分析报告',
        },
        {
          key: '/supply-chain-finance/data-visualization',
          icon: <BarChartOutlined />,
          label: '数据可视化',
        },
      ],
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/system/roles',
          icon: <SafetyOutlined />,
          label: '角色管理',
        },
        {
          key: '/system/permissions',
          icon: <KeyOutlined />,
          label: '权限管理',
        },
        {
          key: '/system/personal-center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: '/system/my-favorites',
          icon: <HeartOutlined />,
          label: '我的收藏',
        },
        {
          key: '/system/company-management',
          icon: <BankOutlined />,
          label: '企业管理',
        },
        {
          key: '/system/my-contracts',
          icon: <FileTextOutlined />,
          label: '我的合同',
        },
      ],
    },
  ], []);

  // 用户退出处理
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  }, [navigate]);

  // 用户菜单 - 使用useMemo优化
  const userMenuItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ], [handleLogout]);

  // 获取当前路径的菜单键 - 使用useMemo缓存计算结果
  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/policy-center')) {
      return ['/policy-center'];
    }
    if (path.startsWith('/legal-support')) {
      return ['/legal-support'];
    }
    if (path.startsWith('/industry-hall')) {
      return ['/industry-hall'];
    }
    if (path.startsWith('/supply-chain-finance')) {
      return ['/supply-chain-finance'];
    }
    if (path.startsWith('/system')) {
      return ['/system'];
    }
    return [path];
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider 
        width={256}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            企规宝
          </Title>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={['/policy-center', '/legal-support', '/industry-hall', '/supply-chain-finance', '/system']}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout>
        <Header 
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{username}</Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: '24px', margin: 0, minHeight: 280 }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/policy-center" element={<Navigate to="/policy-center/main" replace />} />
              <Route path="/policy-center/main" element={<PolicyCenterMain />} />
              <Route path="/policy-center/smart-matching" element={<SmartMatching />} />
              <Route path="/policy-center/application-management" element={<ApplicationManagement />} />
              <Route path="/policy-center/my-applications" element={<MyApplicationsEnhanced />} />
              <Route path="/policy-center/my-applications/detail/:id" element={<ApplicationDetailEnhanced />} />
              <Route path="/policy-center/application-management/qualification" element={<QualificationList />} />
              <Route path="/policy-center/application-management/qualification/:id" element={<QualificationDetail />} />
              <Route path="/policy-center/application-management/apply/:id" element={<ApplicationWizard />} />
              <Route path="/policy-center/application-management/condition-check/:id" element={<ConditionCheck />} />
              <Route path="/policy-center/application-management/drafts" element={<DraftManagement />} />
              <Route path="/policy-center/application-guide" element={<AIAssistant />} />
              <Route path="/policy-center/application-guide/history" element={<AIAssistantHistory />} />
              <Route path="/legal-support" element={<LegalSupport />} />
              <Route path="/legal-support/judicial-cases" element={<JudicialCaseSearch />} />
              <Route path="/legal-support/judicial-cases/detail/:id" element={<CaseDetail />} />
              <Route path="/legal-support/regulation-query" element={<RegulationQuery />} />
              <Route path="/legal-support/contract-management" element={<EnhancedContractManagement />} />
              <Route path="/legal-support/contract-management/detail/:id" element={<MyContractDetail />} />
              <Route path="/industry-hall" element={<IndustryHall />} />
              <Route path="/industry-hall/supply-demand" element={<SupplyDemandHall />} />
              <Route path="/industry-hall/supply-demand/detail/:id" element={<SupplyDemandDetail />} />
              <Route path="/industry-hall/new-publication" element={<NewPublication />} />
              <Route path="/industry-hall/my-opportunities" element={<MyPublications />} />
              <Route path="/industry/connection-application-success" element={<ConnectionApplicationSuccess />} />
              <Route path="/supply-chain-finance" element={<SupplyChainFinance />} />
              <Route path="/supply-chain-finance/financing-diagnosis" element={<FinancingDiagnosis />} />
              <Route path="/supply-chain-finance/financing-diagnosis-result" element={<FinancingDiagnosisResult />} />
              <Route path="/supply-chain-finance/diagnosis-report" element={<FinancingDiagnosisResult />} />
              <Route path="/supply-chain-finance/financing-option-detail/:id" element={<FinancingOptionDetail />} />
              <Route path="/supply-chain-finance/application-success" element={<FinancingApplicationSuccess />} />
              <Route path="/supply-chain-finance/diagnosis-analysis" element={<DiagnosisAnalysis />} />
              <Route path="/supply-chain-finance/data-visualization" element={<DataVisualization />} />
              <Route path="/system" element={<SystemManagement />} />
              <Route path="/system/users" element={<UserManagement />} />
              <Route path="/system/roles" element={<RoleManagement />} />
              <Route path="/system/permissions" element={<PermissionManagement />} />
              <Route path="/system/personal-center" element={<PersonalCenter />} />
              <Route path="/system/my-favorites" element={<MyFavorites />} />
              <Route path="/system/company-management" element={<CompanyManagement />} />
              <Route path="/system/my-contracts" element={<EnhancedContractManagement />} />
              <Route path="/system/my-contracts/detail/:id" element={<MyContractDetail />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

// App组件
const App: React.FC<{}> = () => {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        {/* 性能监控组件（仅开发环境） */}
        <PerformanceMonitor />
      </Router>
    </ErrorBoundary>
  );
};

export default App;