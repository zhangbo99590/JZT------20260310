/**
 * 企业管理模拟数据配置
 * 创建时间: 2026-01-13
 */

import type { CompanyProfile } from "../types/index.ts";

// 模拟企业画像数据
export const mockCompanyProfile: CompanyProfile = {
  id: "1",
  // 基础信息
  companyName: "深圳创新科技有限公司",
  creditCode: "91440300MA5XXXXXX",
  legalPerson: "张三",
  registeredCapital: "1000万元",
  establishDate: "2018-03-15",
  industry: "软件和信息技术服务业",
  scale: "中型企业",
  companyType: "有限责任公司",
  address: "深圳市南山区科技园南区",

  // 财务数据
  revenue: "5000万元",
  profit: "800万元",
  taxAmount: "150万元",
  assets: "3000万元",

  // 研发数据
  rdInvestment: "500万元",
  rdRatio: "10%",
  rdPersonnel: 25,
  rdProjects: 8,

  // 知识产权
  patents: 15,
  inventionPatents: 5,
  softwareCopyrights: 12,
  trademarks: 3,
  achievements: 3,

  // 人员信息
  totalEmployees: 120,
  technicalPersonnel: 80,
  bachelorAbove: 90,

  // 资质认证
  qualifications: ["高新技术企业", "专精特新企业", "科技型中小企业"],
  certifications: ["ISO9001质量管理体系", "ISO27001信息安全管理", "CMMI3级"],

  // 经营信息
  mainBusiness: "企业管理软件开发、云计算服务、大数据分析",
  mainProducts: "企业ERP系统、智能办公平台、数据分析工具",
  marketShare: "行业前10%",
  exportVolume: "200万美元",

  // 项目经验
  completedProjects: 45,
  ongoingProjects: 12,
  governmentProjects: 8,

  // 荣誉奖项
  awards: ["深圳市科技进步奖", "广东省优秀软件产品奖", "国家级专精特新小巨人"],

  // 系统信息
  lastSyncTime: "2024-01-15 14:30:00",
  syncStatus: "success",
  dataSource: {
    business: "success",
    tax: "success",
    rd: "success",
  },
};

// 行业选项
export const industryOptions = [
  { value: "软件和信息技术服务业", label: "软件和信息技术服务业" },
  { value: "制造业", label: "制造业" },
  { value: "批发和零售业", label: "批发和零售业" },
  { value: "科学研究和技术服务业", label: "科学研究和技术服务业" },
  { value: "其他", label: "其他" },
];

// 企业规模选项
export const scaleOptions = [
  { value: "微型企业", label: "微型企业" },
  { value: "小型企业", label: "小型企业" },
  { value: "中型企业", label: "中型企业" },
  { value: "大型企业", label: "大型企业" },
];

// 企业类型选项
export const companyTypeOptions = [
  { value: "有限责任公司", label: "有限责任公司" },
  { value: "股份有限公司", label: "股份有限公司" },
  { value: "个人独资企业", label: "个人独资企业" },
  { value: "合伙企业", label: "合伙企业" },
];

// 资质选项
export const qualificationOptions = [
  { value: "高新技术企业", label: "高新技术企业" },
  { value: "专精特新企业", label: "专精特新企业" },
  { value: "科技型中小企业", label: "科技型中小企业" },
  { value: "瞪羚企业", label: "瞪羚企业" },
  { value: "独角兽企业", label: "独角兽企业" },
];

// 认证选项
export const certificationOptions = [
  { value: "ISO9001质量管理体系", label: "ISO9001质量管理体系" },
  { value: "ISO27001信息安全管理", label: "ISO27001信息安全管理" },
  { value: "CMMI3级", label: "CMMI3级" },
  { value: "CMMI5级", label: "CMMI5级" },
];

// 数据类型名称映射
export const dataTypeNames: Record<string, string> = {
  business: "工商数据",
  tax: "税务数据",
  rd: "研发数据",
};
