/**
 * 供应链金融诊断历史记录组件
 * 创建时间: 2026-01-13
 * 功能: 展示最近的诊断记录列表
 */

import React from "react";
import { Card, List, Button, Tag, Space, Typography, message } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { mockDiagnosisRecords } from "../config/mockData";
import type { DiagnosisStatus } from "../types";

const { Text } = Typography;

/**
 * 诊断历史记录组件
 * 组件创建时间: 2026-01-13
 */
const DiagnosisHistory: React.FC = () => {
  const navigate = useNavigate();

  /**
   * 获取状态标签
   * 函数创建时间: 2026-01-13
   */
  const getStatusTag = (status: DiagnosisStatus) => {
    switch (status) {
      case "completed":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已完成
          </Tag>
        );
      case "processing":
        return (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            进行中
          </Tag>
        );
      case "draft":
        return (
          <Tag color="warning" icon={<ExclamationCircleOutlined />}>
            草稿
          </Tag>
        );
      default:
        return <Tag>未知</Tag>;
    }
  };

  const handleViewRecord = (recordId: string) => {
    // navigate(`/supply-chain-finance/record/${recordId}`);
    message.info("很抱歉，该功能目前还在完善当中，暂时无法使用，敬请期待。");
  };

  const handleViewAll = () => {
    navigate("/supply-chain-finance/history");
  };

  return (
    <Card
      title="最近诊断记录"
      className="professional-card slide-in-right"
      extra={
        <Button type="link" onClick={handleViewAll}>
          查看全部
        </Button>
      }
    >
      <List
        dataSource={mockDiagnosisRecords}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="view"
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewRecord(item.id)}
              >
                查看
              </Button>,
            ]}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <List.Item.Meta
              title={
                <Text strong style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </Text>
              }
              description={
                <Space direction="vertical" size={4}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {item.createTime} | {item.amount} | {item.type}
                  </Text>
                  {getStatusTag(item.status)}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DiagnosisHistory;
