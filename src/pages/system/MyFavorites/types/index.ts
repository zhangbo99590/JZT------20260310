/**
 * 我的收藏类型定义
 * 创建时间: 2026-01-13
 */

// 收藏项目类型
export type FavoriteType = "policy" | "opportunity" | "financing";

// 收藏项目接口
export interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  type: FavoriteType;
  category: string;
  addedDate: string;
  sourceModule: string;
  url: string;
  tags?: string[];
  status?: string;
  amount?: number;
}

// 统计数据类型
export interface FavoriteStats {
  total: number;
  policy: number;
  opportunity: number;
  financing: number;
  thisMonth: number;
  lastMonth: number;
}

// 类型配置接口
export interface TypeConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}
