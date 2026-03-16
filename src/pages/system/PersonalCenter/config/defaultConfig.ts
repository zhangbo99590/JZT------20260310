/**
 * 个人中心默认配置
 * 创建时间: 2026-01-13
 */

import type {
  NotificationSetting,
  ModulePreference,
  QuietHours,
} from "../types/index.ts";

// 默认通知设置
export const defaultNotificationSettings: NotificationSetting[] = [
  {
    type: "application",
    label: "申报进度更新",
    systemMessage: true,
    sms: true,
    email: false,
  },
  {
    type: "policy",
    label: "政策更新通知",
    systemMessage: true,
    sms: false,
    email: true,
  },
  {
    type: "opportunity",
    label: "商机推荐",
    systemMessage: true,
    sms: false,
    email: false,
  },
  {
    type: "finance",
    label: "融资诊断结果",
    systemMessage: true,
    sms: true,
    email: true,
  },
  {
    type: "system",
    label: "系统维护通知",
    systemMessage: true,
    sms: false,
    email: false,
  },
];

// 默认模块偏好
export const defaultModulePreferences: ModulePreference[] = [
  { id: "home", name: "首页", order: 1, visible: true },
  { id: "policy", name: "政策中心", order: 2, visible: true },
  { id: "opportunity", name: "商机大厅", order: 3, visible: true },
  { id: "finance", name: "金融服务", order: 4, visible: true },
  { id: "legal", name: "法律护航", order: 5, visible: true },
  { id: "system", name: "系统管理", order: 6, visible: true },
];

// 默认免打扰时段
export const defaultQuietHours: QuietHours = {
  enabled: true,
  startTime: "20:00",
  endTime: "08:00",
};

// 模块映射
export const moduleMap: Record<string, string> = {
  policy: "政策中心",
  opportunity: "商机大厅",
  finance: "融资诊断",
  legal: "法律护航",
  system: "系统管理",
};

// 操作类型映射
export const typeMap: Record<string, string> = {
  query: "查询",
  add: "新增",
  edit: "修改",
  delete: "删除",
};
