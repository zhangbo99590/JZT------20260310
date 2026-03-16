/**
 * 供应链金融主页面
 * 创建时间: 2026-01-13
 * 功能: 供应链金融服务主入口页面
 *
 */

import React from "react";
import { Row, Col } from "antd";
import {
  PageHeader,
  DiagnosisFlow,
  QuickEntryGrid,
  DiagnosisHistory,
} from "./components";

/**
 * 供应链金融主页面组件
 * 最后更新时间: 2026-01-14
 */
const SupplyChainFinance: React.FC = () => {
  return (
    <div className="page-container">
      {/* 页面头部  */}
      <PageHeader />

      {/* 诊断流程导航  */}
      <DiagnosisFlow />

      <Row gutter={[24, 24]}>
        {/* 左侧快捷入口  */}
        <Col xs={24} lg={16}>
          <QuickEntryGrid />
        </Col>

        {/* 右侧历史记录  */}
        <Col xs={24} lg={8}>
          <DiagnosisHistory />
        </Col>
      </Row>
    </div>
  );
};

export default SupplyChainFinance;
