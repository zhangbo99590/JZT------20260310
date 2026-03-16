/**
 * 法律护航快速入口组件
 * 创建时间: 2026-01-13
 * 功能: 渲染法律护航页面的快速入口按钮
 */

import React from "react";
import { Card, Row, Col, Button } from "antd";
import { createQuickEntriesConfig } from "../config/quickEntriesConfig.tsx";

interface QuickEntriesSectionProps {
  onNavigate: (path: string) => void;
}

/**
 * 快速入口组件
 * 组件创建时间: 2026-01-13
 */
export const QuickEntriesSection: React.FC<QuickEntriesSectionProps> = ({
  onNavigate,
}) => {
  const quickEntries = createQuickEntriesConfig(onNavigate);

  return (
    <Card title="快速入口" style={{ marginTop: "24px" }}>
      <Row gutter={[16, 16]}>
        {quickEntries.map((entry, index) => (
          <Col xs={12} sm={8} md={6} key={index}>
            <Button block size="large" onClick={entry.onClick}>
              {entry.icon}
              {entry.text}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
