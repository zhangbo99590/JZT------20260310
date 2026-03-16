/**
 * 首页重要提醒组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的重要提醒和待办事项
 */

import React from "react";
import { Card, Space, Alert, Typography, Button, Badge } from "antd";
import {
  ExclamationCircleOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ImportantReminderItem } from "../types/index.ts";

const { Text, Paragraph } = Typography;

interface ImportantRemindersSectionProps {
  importantReminders: ImportantReminderItem[];
  onNavigate: (path: string) => void;
  onMessage: (text: string) => void;
  loading?: boolean;
}

/**
 * 重要提醒组件
 * 组件创建时间: 2026-01-13 13:50:00
 */
export const ImportantRemindersSection: React.FC<
  ImportantRemindersSectionProps
> = ({ importantReminders, onNavigate, onMessage, loading = false }) => {
  return (
    <>
      <Card
        loading={loading}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <ExclamationCircleOutlined
              style={{ color: "#fa8c16", marginRight: "8px" }}
            />
            重要提醒
          </div>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {importantReminders.map((reminder) => (
            <Alert
              key={reminder.id}
              message={reminder.title}
              description={
                <div>
                  <Paragraph style={{ margin: "8px 0", fontSize: "13px" }}>
                    {reminder.content}
                  </Paragraph>
                  <Button
                    type={reminder.urgency === "high" ? "primary" : "default"}
                    size="small"
                    danger={reminder.urgency === "high"}
                    onClick={() => {
                      if (reminder.type === "deadline") {
                        onNavigate("/policy-center/application-management");
                      } else if (reminder.type === "recommendation") {
                        onNavigate("/policy-center/main");
                      } else {
                        onMessage("功能开发中...");
                      }
                    }}
                  >
                    {reminder.action}
                  </Button>
                </div>
              }
              type={reminder.urgency === "high" ? "error" : "info"}
              showIcon
              style={{ marginBottom: "12px" }}
            />
          ))}
        </Space>
      </Card>

      {/* 待办提醒模块 */}
      <Card
        loading={loading}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <BellOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
            待办提醒
          </div>
        }
        style={{ marginTop: "16px" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Button
            type="text"
            block
            onClick={() => onNavigate("/policy-center/my-applications")}
            style={{
              textAlign: "left",
              height: "auto",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "4px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Space>
              <ExclamationCircleOutlined style={{ color: "#faad14" }} />
              <div>
                <div>
                  <Text strong>需补正项目</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    请及时补充相关材料
                  </Text>
                </div>
              </div>
            </Space>
            {/* <Badge count={2} style={{ backgroundColor: "#faad14" }} /> */}
          </Button>

          <Button
            type="text"
            block
            onClick={() => onNavigate("/policy-center/my-applications")}
            style={{
              textAlign: "left",
              height: "auto",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "4px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Space>
              <ClockCircleOutlined style={{ color: "#ff4d4f" }} />
              <div>
                <div>
                  <Text strong>即将过期项目</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    3个项目即将截止
                  </Text>
                </div>
              </div>
            </Space>
            {/* <Badge count={3} style={{ backgroundColor: "#ff4d4f" }} /> */}
          </Button>

          <Button
            type="text"
            block
            onClick={() => onNavigate("/policy-center/my-applications")}
            style={{
              textAlign: "left",
              height: "auto",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "4px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <div>
                <div>
                  <Text strong>审核结果更新</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    有新的审核结果
                  </Text>
                </div>
              </div>
            </Space>
            {/* <Badge count={1} style={{ backgroundColor: "#52c41a" }} /> */}
          </Button>
        </Space>
      </Card>
    </>
  );
};
