/**
 * 首页最近活动组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的最近活动通知列表
 */

import React from "react";
import { Card, List, Avatar, Typography, Tag, Button } from "antd";
import { NotificationOutlined, RightOutlined } from "@ant-design/icons";
import { RecentActivityItem } from "../types/index.ts";
import {
  getActivityIcon,
  getActivityTagColor,
} from "../utils/activityUtils.tsx";

const { Text, Paragraph } = Typography;

interface RecentActivitiesSectionProps {
  recentActivities: RecentActivityItem[];
  onNavigate: (path: string) => void;
  loading?: boolean;
}

/**
 * 最近活动组件
 * 组件创建时间: 2026-01-13
 */
export const RecentActivitiesSection: React.FC<
  RecentActivitiesSectionProps
> = ({ recentActivities, onNavigate, loading = false }) => {
  return (
    <Card
      loading={loading}
      className="hover-card"
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <NotificationOutlined
            style={{ color: "#1890ff", marginRight: "8px" }}
          />
          最近活动
        </div>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={() => onNavigate("/policy-center/my-applications")}
        >
          查看全部 <RightOutlined />
        </Button>
      }
    >
      <List
        dataSource={recentActivities}
        renderItem={(item) => (
          <List.Item
            style={{ padding: "12px 0", cursor: "pointer" }}
            onClick={() => {
              if (item.type === "result" || item.type === "todo") {
                onNavigate("/policy-center/my-applications");
              } else if (item.type === "policy") {
                onNavigate("/policy-center/main");
              }
            }}
            className="activity-item-hover"
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={getActivityIcon(item.type, item.status)}
                  style={{ backgroundColor: "transparent" }}
                />
              }
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text strong>{item.title}</Text>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.amount && (
                      <Tag color="success" style={{ marginRight: "8px" }}>
                        {item.amount}
                      </Tag>
                    )}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {item.time}
                    </Text>
                  </div>
                </div>
              }
              description={
                <div>
                  <Paragraph
                    style={{ margin: 0, fontSize: "13px" }}
                    ellipsis={{ rows: 1 }}
                  >
                    {item.description}
                  </Paragraph>
                  <Tag
                    color={getActivityTagColor(item.status)}
                    style={{ marginTop: "4px" }}
                  >
                    {item.status === "success"
                      ? "已完成"
                      : item.status === "info"
                      ? "通知"
                      : item.status === "warning"
                      ? "待办"
                      : "其他"}
                  </Tag>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
