/**
 * 筛选条件类型定义
 * 重新设计筛选条件的数据结构和验证机制
 */

// 筛选条件基础接口
export interface FilterCondition {
  id: string;
  type: FilterType;
  value: string | string[];
  label: string;
  operator?: FilterOperator;
  isActive: boolean;
  priority?: number;
}

// 筛选类型枚举
export enum FilterType {
  DISTRICT = "district",
  INDUSTRY = "industry",
  LEVEL = "level",
  ORG_TYPE = "orgType",
  POLICY_ORG = "policyOrg",
  SUBSIDY_TYPE = "subsidyType",
  KEYWORD = "keyword",
  DATE_RANGE = "dateRange",
  AMOUNT_RANGE = "amountRange",
}

// 筛选操作符
export enum FilterOperator {
  EQUALS = "equals",
  CONTAINS = "contains",
  IN = "in",
  BETWEEN = "between",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
}

// 完整的筛选状态接口
export interface FilterState {
  conditions: FilterCondition[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastUpdated: number;
  resultCount?: number;
}

// 筛选配置接口
export interface FilterConfig {
  districts: DistrictOption[];
  industries: IndustryOption[];
  levels: LevelOption[];
  orgTypes: OrgTypeOption[];
  policyOrgs: PolicyOrgOption[];
  subsidyTypes: SubsidyTypeOption[];
}

// 各类筛选选项接口
export interface DistrictOption {
  code: string;
  name: string;
  isHighFrequency: boolean;
  parentCode?: string;
}

export interface IndustryOption {
  code: string;
  name: string;
  category: string;
  level: number;
  parentCode?: string;
}

export interface LevelOption {
  code: string;
  name: string;
  priority: number;
}

export interface OrgTypeOption {
  code: string;
  name: string;
  description?: string;
}

export interface PolicyOrgOption {
  code: string;
  name: string;
  shortName?: string;
  level: string;
}

export interface SubsidyTypeOption {
  code: string;
  name: string;
  description?: string;
  category: string;
}

// 筛选结果接口
export interface FilterResult {
  total: number;
  items: PolicyItem[];
  facets: FilterFacet[];
  executionTime: number;
  hasMore: boolean;
}

export interface PolicyItem {
  id: string;
  title: string;
  summary: string;
  district: string;
  industry: string;
  level: string;
  orgType: string;
  policyOrg: string;
  subsidyType: string;
  subsidyAmount?: string;
  publishDate: string;
  tags: string[];
  matchScore?: number;
  highlightedFields?: Record<string, string>;
}

export interface FilterFacet {
  field: string;
  values: FacetValue[];
}

export interface FilterFacet {
  field: string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

// 筛选验证规则
export interface FilterValidationRule {
  field: FilterType;
  required?: boolean;
  maxSelections?: number;
  minSelections?: number;
  validator?: (value: any) => boolean;
  errorMessage?: string;
}

// 筛选持久化配置
export interface FilterPersistenceConfig {
  storageKey: string;
  expireTime: number;
  includeResults: boolean;
  compression: boolean;
}

// 筛选性能监控
export interface FilterPerformanceMetrics {
  queryTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
}

// 筛选事件类型
export enum FilterEventType {
  CONDITION_ADDED = "condition_added",
  CONDITION_REMOVED = "condition_removed",
  CONDITION_UPDATED = "condition_updated",
  FILTERS_RESET = "filters_reset",
  SEARCH_EXECUTED = "search_executed",
  RESULTS_LOADED = "results_loaded",
  ERROR_OCCURRED = "error_occurred",
}

// 筛选事件接口
export interface FilterEvent {
  type: FilterEventType;
  payload: any;
  timestamp: number;
  source: string;
}
