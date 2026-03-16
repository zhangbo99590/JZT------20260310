/**
 * 企业管理类型定义
 * 创建时间: 2026-01-13
 */

// 数据源同步状态类型
export type SyncStatus = "success" | "syncing" | "failed";

// 数据源类型
export type DataSourceType = "business" | "tax" | "rd";

// 数据源状态接口
export interface DataSourceStatus {
  business: SyncStatus;
  tax: SyncStatus;
  rd: SyncStatus;
}

// 企业画像数据接口
export interface CompanyProfile {
  id: string;
  // 基础信息
  companyName: string;
  creditCode: string;
  legalPerson: string;
  registeredCapital: string;
  establishDate: string;
  industry: string;
  scale: string;
  companyType: string;
  address: string;

  // 财务数据
  revenue: string;
  profit: string;
  taxAmount: string;
  assets: string;

  // 研发数据
  rdInvestment: string;
  rdRatio: string;
  rdPersonnel: number;
  rdProjects: number;

  // 知识产权
  patents: number;
  inventionPatents: number;
  softwareCopyrights: number;
  trademarks: number;
  achievements: number;

  // 人员信息
  totalEmployees: number;
  technicalPersonnel: number;
  bachelorAbove: number;

  // 资质认证
  qualifications: string[];
  certifications: string[];

  // 经营信息
  mainBusiness: string;
  mainProducts: string;
  marketShare: string;
  exportVolume: string;

  // 项目经验
  completedProjects: number;
  ongoingProjects: number;
  governmentProjects: number;

  // 荣誉奖项
  awards: string[];

  // 系统信息
  lastSyncTime: string;
  syncStatus: SyncStatus;
  dataSource: DataSourceStatus;
}
