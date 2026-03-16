/**
 * 首页数据概览组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的数据概览卡片
 */

import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { DataOverviewItem } from "../types/index.ts";

const { Text } = Typography;

interface DataOverviewSectionProps {
  dataOverview: DataOverviewItem[];
  loading?: boolean;
}

/**
 * 数据概览组件
 * 组件创建时间: 2026-01-13
 */
export const DataOverviewSection: React.FC<DataOverviewSectionProps> = ({
  dataOverview,
  loading = false,
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      {dataOverview.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            loading={loading}
            className="hover-card"
            style={{
              background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
              border: `1px solid ${item.color}30`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  {item.icon}
                  <Text strong style={{ marginLeft: "8px", fontSize: "14px" }}>
                    {item.title}
                  </Text>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <Text
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: item.color,
                    }}
                  >
                    {item.prefix}
                    {item.value.toLocaleString()}
                    {item.suffix}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {item.description}
                  </Text>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ArrowUpOutlined
                      style={{ color: "#52c41a", fontSize: "12px" }}
                    />
                    <Text
                      style={{
                        color: "#52c41a",
                        fontSize: "12px",
                        marginLeft: "2px",
                      }}
                    >
                      {item.growthRate}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
