/**
 * 个性化设置标签页组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Form,
  Select,
  List,
  Checkbox,
  Button,
  Table,
  Switch,
  Input,
  Divider,
  Space,
} from "antd";
import { LayoutOutlined, BellOutlined, SaveOutlined } from "@ant-design/icons";
import type {
  ModulePreference,
  NotificationSetting,
  QuietHours,
} from "../types/index.ts";

const { Option } = Select;

interface SettingsTabProps {
  modulePreferences: ModulePreference[];
  defaultHomePage: string;
  notificationSettings: NotificationSetting[];
  quietHours: QuietHours;
  loading: boolean;
  onModulePreferencesChange: (preferences: ModulePreference[]) => void;
  onDefaultHomePageChange: (page: string) => void;
  onNotificationSettingsChange: (settings: NotificationSetting[]) => void;
  onQuietHoursChange: (hours: QuietHours) => void;
  onSaveModulePreferences: () => void;
  onSaveNotificationSettings: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  modulePreferences,
  defaultHomePage,
  notificationSettings,
  quietHours,
  loading,
  onModulePreferencesChange,
  onDefaultHomePageChange,
  onNotificationSettingsChange,
  onQuietHoursChange,
  onSaveModulePreferences,
  onSaveNotificationSettings,
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* 页面布局偏好 */}
      <Card
        title={
          <>
            <LayoutOutlined /> 页面布局偏好
          </>
        }
      >
        <Form layout="vertical">
          <Form.Item label="默认首页模块">
            <Select
              style={{ width: 300 }}
              value={defaultHomePage}
              onChange={onDefaultHomePageChange}
            >
              {modulePreferences.map((mod) => (
                <Option key={mod.id} value={mod.id}>
                  {mod.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="导航栏模块显示">
            <List
              dataSource={modulePreferences}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Checkbox
                      key="visible"
                      checked={item.visible}
                      onChange={(e) => {
                        const updated = modulePreferences.map((m) =>
                          m.id === item.id
                            ? { ...m, visible: e.target.checked }
                            : m
                        );
                        onModulePreferencesChange(updated);
                      }}
                    >
                      显示
                    </Checkbox>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`排序: ${item.order}`}
                  />
                </List.Item>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={onSaveModulePreferences}
              loading={loading}
            >
              保存布局设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 通知提醒偏好 */}
      <Card
        title={
          <>
            <BellOutlined /> 通知提醒偏好
          </>
        }
      >
        <Table
          dataSource={notificationSettings}
          pagination={false}
          rowKey="type"
          columns={[
            {
              title: "通知类型",
              dataIndex: "label",
              key: "label",
            },
            {
              title: "系统消息",
              key: "systemMessage",
              render: (_, record) => (
                <Switch
                  checked={record.systemMessage}
                  onChange={(checked) => {
                    const updated = notificationSettings.map((n) =>
                      n.type === record.type
                        ? { ...n, systemMessage: checked }
                        : n
                    );
                    onNotificationSettingsChange(updated);
                  }}
                />
              ),
            },
            {
              title: "短信通知",
              key: "sms",
              render: (_, record) => (
                <Switch
                  checked={record.sms}
                  onChange={(checked) => {
                    const updated = notificationSettings.map((n) =>
                      n.type === record.type ? { ...n, sms: checked } : n
                    );
                    onNotificationSettingsChange(updated);
                  }}
                />
              ),
            },
            {
              title: "邮件通知",
              key: "email",
              render: (_, record) => (
                <Switch
                  checked={record.email}
                  onChange={(checked) => {
                    const updated = notificationSettings.map((n) =>
                      n.type === record.type ? { ...n, email: checked } : n
                    );
                    onNotificationSettingsChange(updated);
                  }}
                />
              ),
            },
          ]}
        />

        <Divider />

        <Form layout="inline">
          <Form.Item label="免打扰时段">
            <Switch
              checked={quietHours.enabled}
              onChange={(checked) =>
                onQuietHoursChange({ ...quietHours, enabled: checked })
              }
            />
          </Form.Item>
          {quietHours.enabled && (
            <>
              <Form.Item label="开始时间">
                <Input
                  style={{ width: 100 }}
                  value={quietHours.startTime}
                  onChange={(e) =>
                    onQuietHoursChange({
                      ...quietHours,
                      startTime: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="结束时间">
                <Input
                  style={{ width: 100 }}
                  value={quietHours.endTime}
                  onChange={(e) =>
                    onQuietHoursChange({
                      ...quietHours,
                      endTime: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </>
          )}
        </Form>

        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSaveNotificationSettings}
            loading={loading}
          >
            保存通知设置
          </Button>
        </div>
      </Card>
    </Space>
  );
};

export default SettingsTab;
