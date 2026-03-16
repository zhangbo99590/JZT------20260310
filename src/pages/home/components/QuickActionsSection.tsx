/**
 * 首页快捷操作组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { QuickActionItem } from "../types/index.ts";

const { Text } = Typography;

interface QuickActionsSectionProps {
  quickActions: QuickActionItem[];
  onNavigate: (path: string) => void;
  loading?: boolean;
}

/**
 * 快捷操作组件
 * 组件创建时间: 2026-01-13
 */
export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  quickActions,
  onNavigate,
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <TrophyOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
          核心功能
        </div>
      }
      style={{ height: "100%" }}
    >
      <Row gutter={[12, 12]}>
        {quickActions.map((action, index) => (
          <Col span={12} key={index}>
            <Card
              size="small"
              className="hover-card"
              style={{
                cursor: "pointer",
                backgroundColor: action.bgColor,
                border: `1px solid ${action.color}30`,
                height: "120px",
              }}
              onClick={() => onNavigate(action.path)}
              styles={{
                body: {
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                },
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div className="quick-action-icon">{action.icon}</div>
                <div style={{ marginTop: "8px" }}>
                  <Text
                    strong
                    style={{ fontSize: "14px", color: action.color }}
                  >
                    {action.title}
                  </Text>
                </div>
                <div style={{ marginTop: "4px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {action.description}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};
