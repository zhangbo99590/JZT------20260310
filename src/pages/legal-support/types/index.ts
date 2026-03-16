/**
 * LegalSupport页面类型定义
 * 创建时间: 2026-01-13
 * 功能: 定义法律护航页面相关的TypeScript类型
 */

/**
 * 统计数据项类型
 * 类型定义时间: 2026-01-13
 */
export interface StatisticItem {
  title: string;
  value: number;
  prefix: React.ReactNode;
  color: string;
}

/**
 * 功能模块卡片类型
 * 类型定义时间: 2026-01-13
 */
export interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
}

/**
 * 快速入口按钮类型
 * 类型定义时间: 2026-01-13
 */
export interface QuickEntry {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}
