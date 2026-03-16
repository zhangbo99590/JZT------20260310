/**
 * 融资诊断分析页面类型定义
 * 创建时间: 2026-01-13
 */

// 融资方案接口
export interface FinancingOption {
  id: string;
  name: string;
  type: string;
  matchScore: number;
  interestRate: string;
  amount: string;
  term: string;
  requirements: string[];
  advantages: string[];
  risks: string[];
  provider: string;
  processingTime: string;
  successRate: number;
}

// 分析步骤接口
export interface AnalysisStep {
  title: string;
  description: string;
  status: "finish" | "process" | "wait" | "error";
}

// 融资诊断数据接口
export interface FinancingDiagnosisData {
  companyName?: string;
  fundingAmount?: number;
  fundingPurpose?: string;
  submitTime?: string;
  [key: string]: unknown;
}
