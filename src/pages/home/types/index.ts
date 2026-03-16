/**
 * Home页面类型定义
 * 创建时间: 2026-01-13
 * 功能: 定义首页相关的TypeScript类型
 */

/**
 * 数据概览项类型
 * 类型定义时间: 2026-01-13
 */
export interface DataOverviewItem {
  title: string;
  value: number;
  growth: number;
  growthRate: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  prefix?: string;
  suffix?: string;
}

/**
 * 快捷操作项类型
 * 类型定义时间: 2026-01-13
 */
export interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  bgColor: string;
}

/**
 * 最近活动项类型
 * 类型定义时间: 2026-01-13
 */
export interface RecentActivityItem {
  id: number;
  title: string;
  description: string;
  amount?: string;
  status: "success" | "info" | "warning" | "error";
  time: string;
  type: "result" | "policy" | "todo";
}

/**
 * 重要提醒项类型
 * 类型定义时间: 2026-01-13
 */
export interface ImportantReminderItem {
  id: number;
  title: string;
  content: string;
  type: "deadline" | "recommendation";
  urgency: "high" | "medium" | "low";
  action: string;
}

/**
 * 首页数据类型
 * 类型定义时间: 2026-01-13
 */
export interface HomeData {
  dataOverview: DataOverviewItem[];
  quickActions: QuickActionItem[];
  recentActivities: RecentActivityItem[];
  importantReminders: ImportantReminderItem[];
}
