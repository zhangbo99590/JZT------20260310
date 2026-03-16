/**
 * 系统管理主页面
 * 创建时间: 2026-01-13
 * 功能: 提供系统管理各模块的导航入口
 */

import React from "react";
import { Row, Col } from "antd";
import { PageHeader, ModuleCard } from "./components";
import { systemModules } from "./config/systemModules";

const SystemManagement: React.FC = () => {
  return (
    <div style={{ background: "transparent" }}>
      {/* 页面头部 */}
      <PageHeader />

      {/* 功能模块网格 */}
      <Row gutter={[16, 16]}>
        {systemModules.map((module, index) => (
          <Col xs={24} lg={8} key={index}>
            <ModuleCard module={module} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SystemManagement;
