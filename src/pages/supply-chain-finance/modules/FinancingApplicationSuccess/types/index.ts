/**
 * 融资申请成功页面类型定义
 * 创建时间: 2026-01-13
 */

// 申请数据接口
export interface ApplicationData {
  companyName: string;
  contactPerson: string;
  phone: string;
  amount: number;
  purpose: string;
  remarks?: string;
  applicationId: string;
  submitTime: string;
  productName: string;
}

// 后续流程接口
export interface NextStep {
  time: string;
  content: string;
  icon: React.ReactNode;
}

// 联系信息接口
export interface ContactInfo {
  title: string;
  content: string;
  icon: React.ReactNode;
  description: string;
}
