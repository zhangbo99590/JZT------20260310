/**
 * 融资诊断页面配置
 * 创建时间: 2026-01-13
 */

import type { SelectOption } from "../types";

// 融资用途选项
export const FUNDING_PURPOSE_OPTIONS: SelectOption[] = [
  { label: "扩大生产规模", value: "expand_production" },
  { label: "技术研发投入", value: "rd_investment" },
  { label: "市场拓展", value: "market_expansion" },
  { label: "设备采购", value: "equipment_purchase" },
  { label: "流动资金周转", value: "working_capital" },
  { label: "其他", value: "other" },
];

// 行业选项
export const INDUSTRY_OPTIONS: string[] = [
  "制造业",
  "信息技术",
  "金融服务",
  "房地产",
  "批发零售",
  "交通运输",
  "住宿餐饮",
  "教育",
  "卫生医疗",
  "文化娱乐",
  "其他",
];

// 风险因素选项
export const RISK_FACTOR_OPTIONS: SelectOption[] = [
  { label: "市场竞争激烈", value: "market_competition" },
  { label: "技术更新换代快", value: "tech_update" },
  { label: "原材料价格波动", value: "material_price" },
  { label: "政策法规变化", value: "policy_change" },
  { label: "汇率波动", value: "exchange_rate" },
  { label: "供应链风险", value: "supply_chain" },
  { label: "人才流失", value: "talent_loss" },
  { label: "其他", value: "other" },
];

// 使用期限选项
export const USAGE_PERIOD_OPTIONS: SelectOption[] = [
  { label: "3个月以内", value: "3months" },
  { label: "3-6个月", value: "6months" },
  { label: "6个月-1年", value: "1year" },
  { label: "1-2年", value: "2years" },
  { label: "2-3年", value: "3years" },
  { label: "3-5年", value: "5years" },
  { label: "5年以上", value: "longterm" },
];

// 担保方式选项
export const GUARANTEE_METHOD_OPTIONS: SelectOption[] = [
  { label: "信用担保", value: "credit" },
  { label: "抵押担保", value: "mortgage" },
  { label: "质押担保", value: "pledge" },
  { label: "保证担保", value: "guarantee" },
  { label: "混合担保", value: "mixed" },
];

// 信用等级选项
export const CREDIT_RATING_OPTIONS: SelectOption[] = [
  { label: "AAA", value: "AAA" },
  { label: "AA", value: "AA" },
  { label: "A", value: "A" },
  { label: "BBB", value: "BBB" },
  { label: "BB", value: "BB" },
  { label: "B", value: "B" },
  { label: "CCC以下", value: "CCC" },
];

// 本地存储键名
export const STORAGE_KEYS = {
  DRAFT: "financing-diagnosis-draft",
  DATA: "financing-diagnosis-data",
};
