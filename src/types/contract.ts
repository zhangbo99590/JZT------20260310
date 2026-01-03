/**
 * 合同管理模块类型定义
 */

// 合同分类枚举
export enum ContractCategory {
  LIFE_CONSUMPTION = 'life_consumption', // 生活消费
  COMPANY_ESTABLISHMENT = 'company_establishment', // 公司设立
  COMPANY_OPERATION = 'company_operation', // 公司经营
  ECONOMIC_TRADE = 'economic_trade', // 经济买卖
  PERSONAL_CONTRACT = 'personal_contract', // 个人合同
}

// 合同分类标签映射
export const ContractCategoryLabels: Record<ContractCategory, string> = {
  [ContractCategory.LIFE_CONSUMPTION]: '生活消费',
  [ContractCategory.COMPANY_ESTABLISHMENT]: '公司设立',
  [ContractCategory.COMPANY_OPERATION]: '公司经营',
  [ContractCategory.ECONOMIC_TRADE]: '经济买卖',
  [ContractCategory.PERSONAL_CONTRACT]: '个人合同',
};

// 合同数据接口
export interface Contract {
  id: string;
  title: string;
  category: ContractCategory;
  year: number;
  region: string;
  province: string;
  city: string;
  content: string;
  createTime: string;
  updateTime: string;
  tags: string[];
  downloadCount: number;
  viewCount: number;
}

// 搜索参数接口
export interface SearchParams {
  keyword?: string;
  category?: ContractCategory;
  yearRange?: [number, number];
  year?: number;
  province?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}

// 搜索结果接口
export interface SearchResult {
  total: number;
  list: Contract[];
  page: number;
  pageSize: number;
}

// 常用关键词接口
export interface CommonKeyword {
  keyword: string;
  count: number;
  category?: ContractCategory;
}

// 统计数据接口
export interface ContractStatistics {
  totalCount: number;
  categoryDistribution: Array<{
    category: ContractCategory;
    count: number;
    percentage: number;
  }>;
  yearlyTrend: Array<{
    year: number;
    count: number;
  }>;
  regionDistribution: Array<{
    province: string;
    count: number;
  }>;
}

// 地区数据接口
export interface Region {
  code: string;
  name: string;
  children?: Region[];
}

// 合同条款接口
export interface ContractClause {
  number: string;
  title: string;
  content: string;
  important?: boolean;
  note?: string;
}

// 合同章节接口
export interface ContractSection {
  title: string;
  clauses: ContractClause[];
}

// 合同附件接口
export interface ContractAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadTime: string;
  uploader: string;
}

// 合同历史记录接口
export interface ContractHistory {
  version: string;
  action: string;
  description: string;
  time: string;
  operator: string;
  changes?: string[];
}

// 状态变更记录接口
export interface StatusHistory {
  status: string;
  time: string;
  operator: string;
  comment?: string;
}

// 相关合同接口
export interface RelatedContract {
  id: string;
  title: string;
  year: number;
}

// 合同详情接口
export interface ContractDetail extends Contract {
  signDate: string;
  effectiveDate: string;
  expiryDate: string;
  amount?: number;
  partyA: string;
  partyB: string;
  status: string;
  sections?: ContractSection[];
  attachments?: ContractAttachment[];
  history?: ContractHistory[];
  statusHistory?: StatusHistory[];
  relatedContracts?: RelatedContract[];
  remarks?: string;
}
