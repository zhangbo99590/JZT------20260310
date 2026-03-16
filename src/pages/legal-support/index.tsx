/**
 * 法律护航主页面
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";
import {
  PageHeader,
  StatisticsSection,
  FeaturesSection,
  QuickEntriesSection,
} from "./components/index.ts";

/**
 * 法律护航主页面组件
 * 组件创建时间: 2026-01-13
 */
const LegalSupport: React.FC = () => {
  const navigate = useNavigate();

  /**
   * 页面导航处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageWrapper module="legal">
      <PageHeader />
      <StatisticsSection />
      <FeaturesSection />
      <Divider />
      <QuickEntriesSection onNavigate={handleNavigate} />
    </PageWrapper>
  );
};

export default LegalSupport;
