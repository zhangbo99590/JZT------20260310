/**
 * 风险评估页面类型定义
 * 创建时间: 2026-01-13
 */

// 风险评分接口
export interface RiskScore {
  category: string;
  score: number;
  level: "low" | "medium" | "high";
  description: string;
}

// 财务指标接口
export interface FinancialIndicator {
  name: string;
  value: string;
  trend: "up" | "down" | "stable";
  status: "excellent" | "good" | "warning" | "danger";
}

// 行业对比接口
export interface IndustryComparison {
  metric: string;
  company: string;
  industry: string;
  status: "above" | "below";
}

// 评估结果接口
export interface AssessmentResult {
  overallScore: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

// 历史记录接口
export interface HistoryRecord {
  key: string;
  date: string;
  score: number;
  level: "low" | "medium" | "high";
  status: "completed" | "processing";
}
