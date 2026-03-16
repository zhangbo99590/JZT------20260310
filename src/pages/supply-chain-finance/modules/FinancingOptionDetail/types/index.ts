/**
 * 融资方案详情页面类型定义
 * 创建时间: 2026-01-13
 */

// 融资方案详情接口
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
  provider: string;
  processingTime: string;
  successRate: number;
  rating: number;
  description: string;
  applicationProcess: string[];
  requiredDocuments: string[];
  contactInfo: ContactInfo;
  caseStudies: CaseStudy[];
}

// 联系信息接口
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
}

// 案例研究接口
export interface CaseStudy {
  companyName: string;
  industry: string;
  amount: string;
  term: string;
  result: string;
}
