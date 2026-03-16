/**
 * 个人中心类型定义
 * 创建时间: 2026-01-13
 */

// 操作日志接口
export interface OperationLog {
  id: string;
  time: string;
  module: string;
  type: string;
  content: string;
  result: "success" | "failed";
  ip: string;
  failReason?: string;
}

// 通知设置接口
export interface NotificationSetting {
  type: string;
  label: string;
  systemMessage: boolean;
  sms: boolean;
  email: boolean;
}

// 模块偏好接口
export interface ModulePreference {
  id: string;
  name: string;
  order: number;
  visible: boolean;
}

// 免打扰时段接口
export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

// 日志筛选接口
export interface LogFilter {
  dateRange: string;
  module: string;
  type: string;
}
