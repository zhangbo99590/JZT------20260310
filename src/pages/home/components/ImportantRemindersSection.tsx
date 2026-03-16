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


    </>
  );
};
