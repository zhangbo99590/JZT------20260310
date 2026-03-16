/**
 * 融资诊断结果页面配置
 * 创建时间: 2026-01-13
 */

import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { FinancingOption, AnalysisStep } from "../types";

// 融资方案数据
export const FINANCING_OPTIONS: FinancingOption[] = [
  {
    id: "1",
    name: "流动资金贷款",
    type: "流动资金贷款",
    matchScore: 95,
    matchLevel: "极度推荐",
    interestRate: "2.5%-5.5%",
    amount: "100-2000万",
    term: "6-36个月",
    requirements: ["企业信用良好", "上下流稳定", "足额订单支撑"],
    advantages: ["审批快速", "无需抵押", "成本相对较低"],
    risks: ["依赖核心企业信用", "应收账款质量风险"],
    processingTime: "3-5个工作日",
    successRate: 95,
    rating: 5,
  },
];

// 分析步骤配置
export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    title: "需求分析",
    description: "基于企业融资需求、还款能力完成初步定位",
    status: "finish",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "风险评估",
    description: "综合企业信用、财务、经营等维度完成风险核验",
    status: "finish",
    icon: <CheckCircleOutlined />,
  },
  {
    title: "方案匹配",
    description: "依据需求与风险结果匹配适配融资方案",
    status: "finish",
    icon: <CheckCircleOutlined />,
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
