/**
 * 路由配置聚合文件
 * 嵌入操作完成日期：2026/1/13
 */
import React from "react";
import { Route, Navigate } from "react-router-dom";
import * as Pages from "./lazyComponents";
/**
 * 政策中心路由配置
 * 更新时间: 2026-03-10 - 新增增强版政策搜索页面
 */
export const policyRoutes = (
  <>
    <Route
      path="/policy-center"
      element={<Navigate to="/policy-center/main" replace />}
    />
    <Route path="/policy-center/main" element={<Pages.AIPolicySearchV2 />} />
    <Route path="/policy/search" element={<Pages.EnhancedPolicySearch />} />
    <Route path="/policy/ai-search" element={<Pages.AIPolicySearchV2 />} />
    <Route
      path="/policy-center/detail/:id"
      element={<Pages.EnhancedPolicyDetail />}
    />
    <Route path="/policy/detail/:id" element={<Pages.EnhancedPolicyDetail />} />
    <Route
      path="/policy-center/approved-list"
      element={<Pages.PolicyApprovedList />}
    />
    <Route
      path="/policy-center/my-applications"
      element={<Pages.NewApplicationManagement />}
    />
  </>
);

/**
 * 新申报管理模块路由配置 - 2026-02-26
 */
export const newApplicationRoutes = (
  <>
    <Route path="/application" element={<Pages.NewApplicationManagement />} />
    <Route
      path="/application/detail/:id"
      element={<Pages.ApplicationPolicyDetail />}
    />
    <Route
      path="/application/apply/:id"
      element={<Pages.ApplicationApplyWizard />}
    />
    <Route
      path="/application/success/:id"
      element={<Pages.ApplicationApplySuccess />}
    />
  </>
);

/**
 * 法律护航路由配置
 */
export const legalRoutes = (
  <>
    <Route path="/legal-support" element={<Pages.LegalSupport />} />
    <Route
      path="/legal-support/regulation-query"
      element={<Pages.RegulationQuery />}
    />
    <Route
      path="/legal-support/regulation-detail/:id"
      element={<Pages.RegulationDetail />}
    />
    <Route
      path="/legal-support/regulation-query/detail/:id"
      element={<Pages.RegulationDetail />}
    />
    <Route path="/legal-support/ai-lawyer" element={<Pages.AILawyer />} />
  </>
);

/**
 * 企服管理路由配置
 */
export const industryRoutes = (
  <>
    <Route
      path="/industry/service-match/workbench"
      element={<Pages.ServiceMatchWorkbench />}
    />
    <Route
      path="/industry/service-match/procurement-hall"
      element={<Pages.ProcurementHall />}
    />
    <Route
      path="/industry/service-match/my-services"
      element={<Pages.MyServices />}
    />
    <Route
      path="/industry/service-match/publish"
      element={<Pages.ServiceMatchPublish />}
    />
    <Route
      path="/industry/service-match/detail/:id"
      element={<Pages.ServiceMatchDetail />}
    />
    <Route
      path="/industry/service-match/my-matches"
      element={<Pages.ServiceMatchMyMatches />}
    />
    <Route
      path="/industry/service-match/my-messages"
      element={<Pages.ServiceMatchMyMessages />}
    />
  </>
);

/**
 * 金融服务路由配置
 */
export const financeRoutes = (
  <>
    <Route
      path="/supply-chain-finance"
      element={<Pages.SupplyChainFinance />}
    />
    <Route
      path="/supply-chain-finance/financing-diagnosis"
      element={<Pages.FinancingDiagnosis />}
    />
    <Route
      path="/supply-chain-finance/financing-diagnosis-result"
      element={<Pages.FinancingDiagnosisResult />}
    />
    <Route
      path="/supply-chain-finance/diagnosis-report"
      element={<Pages.FinancingDiagnosisResult />}
    />
    <Route
      path="/supply-chain-finance/financing-option-detail/:id"
      element={<Pages.FinancingOptionDetail />}
    />
    <Route
      path="/supply-chain-finance/application-success"
      element={<Pages.FinancingApplicationSuccess />}
    />
    <Route
      path="/supply-chain-finance/diagnosis-analysis"
      element={<Pages.DiagnosisAnalysis />}
    />
  </>
);

/**
 * 系统管理路由配置
 */
export const systemRoutes = (
  <>
    <Route path="/system" element={<Pages.SystemManagement />} />
    <Route path="/system/users" element={<Pages.UserManagement />} />
    <Route path="/system/personal-center" element={<Pages.PersonalCenter />} />
    <Route path="/system/my-favorites" element={<Pages.MyFavorites />} />
    <Route
      path="/system/company-management"
      element={<Pages.CompanyManagement />}
    />
  </>
);

/**
 * 公开路由配置（无需登录）
 */
export const publicRoutes = (
  <>
    <Route path="/login" element={<Pages.Login />} />
    <Route path="/register" element={<Pages.Register />} />
    <Route path="/reset-password" element={<Pages.ResetPassword />} />
  </>
);

/**
 * 首页路由
 */
export const homeRoute = <Route path="/" element={<Pages.Home />} />;
