import { lazy } from "react";

/**
 * 懒加载页面组件
 * 按模块分组，提升初始加载性能
 * 嵌入操作完成日期：2026/1/13
 */

// 认证相关页面
export const Login = lazy(() => import("../pages/login/index"));
export const Register = lazy(() => import("../pages/register/index"));
export const ResetPassword = lazy(
  () => import("../pages/reset-password/index"),
);

// 首页
export const Home = lazy(() => import("../pages/home"));

// 系统管理页面
export const SystemManagement = lazy(
  () => import("../pages/system-management"),
);
export const UserManagement = lazy(
  () => import("../pages/system/UserManagement/index"),
);
export const PersonalCenter = lazy(
  () => import("../pages/system/PersonalCenter/index"),
);
export const MyFavorites = lazy(
  () => import("../pages/system/MyFavorites/index"),
);
export const CompanyManagement = lazy(
  () => import("../pages/system/CompanyManagement/index"),
);

// 政策中心页面
// 路由配置更新时间: 2026-03-10
// PolicyDetail已被EnhancedPolicyDetail替代并删除
export const EnhancedPolicyDetail = lazy(
  () => import("../pages/policy/EnhancedPolicyDetail"),
);
export const AIPolicySearchV2 = lazy(
  () => import("../pages/policy/AIPolicySearch"),
);
export const EnhancedPolicySearch = lazy(
  () => import("../pages/policy/EnhancedPolicySearch"),
);
export const PolicyApprovedList = lazy(
  () => import("../pages/policy/PolicyApprovedList"),
);

// 法律护航页面
// 路由配置更新时间: 2026-01-13 (模块化拆分完成)
export const LegalSupport = lazy(() => import("../pages/legal-support"));
export const RegulationQuery = lazy(
  () => import("../pages/legal/RegulationQuery"),
);
export const RegulationDetail = lazy(
  () => import("../pages/legal/RegulationDetail"),
);
export const AILawyer = lazy(() => import("../pages/legal-support/AILawyer"));
export const TimelinessManagement = lazy(
  () => import("../pages/legal/TimelinessManagement/index"),
);

// 申报管理页面
// 路由配置更新时间: 2026-01-13 16:50:00

// 新申报管理模块 - 2026-02-26
export const NewApplicationManagement = lazy(
  () => import("../pages/application/index"),
);
export const ApplicationPolicyDetail = lazy(
  () => import("../pages/application/PolicyDetail"),
);
export const ApplicationApplyWizard = lazy(
  () => import("../pages/application/ApplyWizardWithLayout"),
);
export const ApplicationApplySuccess = lazy(
  () => import("../pages/application/ApplySuccess"),
);

// 金融服务页面
// 路由配置更新时间: 2026-01-15 (目录合并: supply-chain -> supply-chain-finance/modules)
export const SupplyChainFinance = lazy(
  () => import("../pages/supply-chain-finance"),
);
export const FinancingDiagnosis = lazy(
  () =>
    import("../pages/supply-chain-finance/modules/FinancingDiagnosis/index"),
);
export const FinancingDiagnosisResult = lazy(
  () =>
    import("../pages/supply-chain-finance/modules/FinancingDiagnosisResult/index"),
);
export const FinancingOptionDetail = lazy(
  () =>
    import("../pages/supply-chain-finance/modules/FinancingOptionDetail/index"),
);
export const FinancingApplicationSuccess = lazy(
  () =>
    import("../pages/supply-chain-finance/modules/FinancingApplicationSuccess/index"),
);
export const DiagnosisAnalysis = lazy(
  () => import("../pages/supply-chain-finance/modules/DiagnosisAnalysis/index"),
);
export const RiskAssessment = lazy(
  () => import("../pages/supply-chain-finance/modules/RiskAssessment/index"),
);

// 企服管理页面
export const ServiceMatchWorkbench = lazy(
  () => import("../pages/industry/service-match/ServiceMatchHome"),
);
export const ProcurementHall = lazy(
  () => import("../pages/industry/service-match/ProcurementHall"),
);
export const MyServices = lazy(
  () => import("../pages/industry/service-match/MyServices"),
);
export const ServiceMatchPublish = lazy(
  () => import("../pages/industry/service-match/ServicePublish"),
);
export const ServiceMatchDetail = lazy(
  () => import("../pages/industry/service-match/MatchDetail"),
);
export const ServiceMatchMyMatches = lazy(
  () => import("../pages/industry/service-match/MyMatches"),
);
export const ServiceMatchMyMessages = lazy(
  () => import("../pages/industry/service-match/MyMessages"),
);
