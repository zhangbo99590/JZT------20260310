/**
 * 融资诊断页面类型定义
 * 创建时间: 2026-01-13
 */

// 表单数据接口
export interface FormData {
  // 融资目标
  fundingPurpose: string;
  fundingAmount: number;
  usagePeriod: string;
  customPeriod?: number;

  // 企业基本信息（已注释）
  companyName?: string;
  establishedYear?: number;
  registeredCapital?: number;
  employeeCount?: number;
  industry?: string;
  businessScope?: string;

  // 财务状况
  annualRevenue: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;

  // 经营状况（已注释）
  mainProducts?: string;
  marketPosition?: string;
  competitiveAdvantages?: string;
  developmentPlans?: string;

  // 风险评估
  riskFactors: string[];
  guaranteeMethod: string;
  collateralValue?: number;

  // 其他信息（已注释）
  previousFinancing?: boolean;
  creditRating?: string;
  specialRequirements?: string;
}

// 选项接口
export interface SelectOption {
  label: string;
  value: string;
}
