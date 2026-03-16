/**
 * 融资诊断结果页面类型定义
 * 创建时间: 2026-01-13
 */

// 融资方案接口
export interface FinancingOption {
  id: string;
  name: string;
  type: string;
  matchScore: number;
  matchLevel: string;
  interestRate: string;
  amount: string;
  term: string;
  requirements: string[];
  advantages: string[];
  risks: string[];
  // provider: string;
  processingTime: string;
  successRate: number;
  rating: number;
}

// 分析步骤接口
export interface AnalysisStep {
  title: string;
  description: string;
  status: "finish" | "process" | "wait" | "error";
  icon: React.ReactNode;
}
