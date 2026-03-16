/**
 * 风险评估页面配置
 * 创建时间: 2026-01-13
 */

import type {
  RiskScore,
  FinancialIndicator,
  IndustryComparison,
  HistoryRecord,
} from "../types";

// 风险评分数据
export const RISK_SCORES: RiskScore[] = [
  {
    category: "信用风险",
    score: 85,
    level: "low",
    description: "企业信用记录良好，违约概率较低",
  },
  {
    category: "财务风险",
    score: 72,
    level: "medium",
    description: "财务状况稳定，但需关注现金流",
  },
  {
    category: "行业风险",
    score: 68,
    level: "medium",
    description: "所处行业竞争激烈，市场波动较大",
  },
  {
    category: "经营风险",
    score: 78,
    level: "low",
    description: "经营模式成熟，管理团队经验丰富",
  },
  {
    category: "政策风险",
    score: 90,
    level: "low",
    description: "符合国家产业政策导向，政策支持力度大",
  },
];

// 财务指标数据
export const FINANCIAL_INDICATORS: FinancialIndicator[] = [
  { name: "资产负债率", value: "45.2%", trend: "down", status: "good" },
  { name: "流动比率", value: "2.1", trend: "up", status: "good" },
  { name: "速动比率", value: "1.8", trend: "up", status: "good" },
  { name: "净资产收益率", value: "15.6%", trend: "up", status: "excellent" },
  { name: "毛利率", value: "28.3%", trend: "stable", status: "good" },
  { name: "净利率", value: "12.1%", trend: "up", status: "good" },
];

// 行业对比数据
export const INDUSTRY_COMPARISON: IndustryComparison[] = [
  {
    metric: "营收增长率",
    company: "18.5%",
    industry: "12.3%",
    status: "above",
  },
  { metric: "利润率", company: "12.1%", industry: "8.7%", status: "above" },
  { metric: "资产周转率", company: "1.2", industry: "1.0", status: "above" },
  { metric: "负债率", company: "45.2%", industry: "52.1%", status: "below" },
];

// 历史记录数据
export const HISTORY_RECORDS: HistoryRecord[] = [
  {
    key: "1",
    date: "2024-01-15",
    score: 78,
    level: "medium",
    status: "completed",
  },
  {
    key: "2",
    date: "2023-07-20",
    score: 72,
    level: "medium",
    status: "completed",
  },
  {
    key: "3",
    date: "2023-01-10",
    score: 68,
    level: "medium",
    status: "completed",
  },
];

// 企业类型选项
export const COMPANY_TYPE_OPTIONS = [
  { value: "private", label: "民营企业" },
  { value: "state", label: "国有企业" },
  { value: "foreign", label: "外资企业" },
  { value: "joint", label: "合资企业" },
];

// 行业选项
export const INDUSTRY_OPTIONS = [
  { value: "manufacturing", label: "制造业" },
  { value: "technology", label: "科技行业" },
  { value: "retail", label: "零售业" },
  { value: "finance", label: "金融业" },
  { value: "real-estate", label: "房地产" },
];
