/**
 * 融资诊断分析页面配置
 * 创建时间: 2026-01-13
 */

import type { FinancingOption, AnalysisStep } from "../types";

// 融资方案数据
export const FINANCING_OPTIONS: FinancingOption[] = [
  {
    id: "1",
    name: "供应链金融-应收账款融资",
    type: "供应链金融",
    matchScore: 95,
    interestRate: "6.5%-8.5%",
    amount: "100-2000万",
    term: "3-12个月",
    requirements: ["应收账款真实有效", "核心企业信用良好", "历史交易记录完整"],
    advantages: ["审批快速", "无需抵押", "成本相对较低"],
    risks: ["依赖核心企业信用", "应收账款质量风险"],
    provider: "工商银行",
    processingTime: "3-5个工作日",
    successRate: 85,
  },
  {
    id: "2",
    name: "银行流动资金贷款",
    type: "银行贷款",
    matchScore: 88,
    interestRate: "4.5%-6.5%",
    amount: "50-5000万",
    term: "1-3年",
    requirements: ["企业信用良好", "财务状况稳定", "提供担保或抵押"],
    advantages: ["利率较低", "额度较大", "期限灵活"],
    risks: ["审批周期长", "需要担保", "还款压力大"],
    provider: "建设银行",
    processingTime: "15-30个工作日",
    successRate: 70,
  },
  {
    id: "3",
    name: "融资租赁",
    type: "融资租赁",
    matchScore: 82,
    interestRate: "7.0%-10.0%",
    amount: "设备价值80%",
    term: "2-5年",
    requirements: ["设备价值评估", "企业经营稳定", "租赁物权属清晰"],
    advantages: ["保留设备使用权", "税收优惠", "提升资产效率"],
    risks: ["成本相对较高", "设备贬值风险"],
    provider: "中信金融租赁",
    processingTime: "10-20个工作日",
    successRate: 75,
  },
  {
    id: "4",
    name: "股权融资",
    type: "股权投资",
    matchScore: 65,
    interestRate: "股权稀释",
    amount: "500-5000万",
    term: "长期持有",
    requirements: ["企业成长性好", "商业模式清晰", "管理团队优秀"],
    advantages: ["无还款压力", "获得资源支持", "提升企业价值"],
    risks: ["股权稀释", "决策权分散", "退出不确定"],
    provider: "红杉资本",
    processingTime: "60-120个工作日",
    successRate: 25,
  },
];

// 分析步骤配置
export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    title: "需求分析",
    description: "基于企业提交的融资需求进行深度分析",
    status: "finish",
  },
  {
    title: "风险评估",
    description: "综合评估企业信用、财务、经营等风险",
    status: "finish",
  },
  {
    title: "方案匹配",
    description: "智能匹配最适合的融资方案",
    status: "process",
  },
  {
    title: "方案优化",
    description: "根据企业特点优化融资方案",
    status: "wait",
  },
];

// 资金用途选项
export const PURPOSE_OPTIONS = [
  { value: "equipment", label: "设备采购" },
  { value: "working-capital", label: "流动资金" },
  { value: "expansion", label: "业务扩张" },
  { value: "rd", label: "研发投入" },
  { value: "other", label: "其他" },
];
