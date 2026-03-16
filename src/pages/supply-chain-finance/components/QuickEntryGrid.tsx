/**
 * 供应链金融快捷入口网格组件
 * 创建时间: 2026-01-13
 * 功能: 展示功能模块的快捷入口网格
 */

import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { quickEntries } from "../config/quickEntries";

const { Text } = Typography;

/**
 * 快捷入口网格组件
 * 组件创建时间: 2026-01-13
 */
const QuickEntryGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleEntryClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Card title="功能模块" className="professional-card slide-in-right">
      <Row gutter={[16, 16]}>
        {quickEntries.map((entry) => (
          <Col xs={24} sm={12} md={8} key={entry.key}>
            <Card
              size="small"
              hoverable={!!entry.path}
              onClick={() => handleEntryClick(entry.path)}
              className="professional-card"
              style={{
                cursor: entry.path ? "pointer" : "not-allowed",
                textAlign: "center",
                height: "140px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: entry.path ? 1 : 0.6,
              }}
              styles={{ body: { padding: "16px" } }}
            >
              <div className="icon-enhanced" style={{ margin: "0 auto 12px" }}>
                {entry.icon}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: "4px",
                  color: "var(--text-primary)",
                }}
              >
                {entry.title}
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {entry.description}
              </Text>
              {!entry.path && (
                <Text
                  type="secondary"
                  style={{ fontSize: "10px", marginTop: "4px" }}
                >
                  (开发中)
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickEntryGrid;
