/**
 * AI政策中心类型定义
 */

// 企业画像信息
export interface CompanyProfile {
  id?: string;
  name: string;
  industry: string;
  scale: 'large' | 'medium' | 'small' | 'micro';
  region: string;
  qualifications: string[]; // 如：高新技术企业、专精特新企业
  registeredCapital?: number;
  employeeCount?: number;
  annualRevenue?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 政策信息
export interface PolicyInfo {
  id: string;
  title: string;
  category: string; // 补贴/资质认定/培训扶持
  level: string; // 国家级/省级/市级/区级
  publishDate: string;
  deadline?: string;
  status: 'active' | 'upcoming' | 'expired';
  tags: string[];
  summary: string;
  content: string;
  
  // AI相关字段
  matchScore?: number; // 匹配度 0-100
  matchReason?: string; // 匹配理由
  
  // 申报相关
  applicationConditions: {
    hard: string[]; // 硬性条件
    soft: string[]; // 软性条件（加分项）
  };
  requiredMaterials: MaterialRequirement[];
  subsidy?: {
    min?: number;
    max?: number;
    average?: number;
    unit: string; // 万元/元
  };
  applicationDifficulty?: 'low' | 'medium' | 'high';
  
  // 时间相关
  daysUntilDeadline?: number;
  isUrgent?: boolean; // 近7天截止
}

// 材料要求
export interface MaterialRequirement {
  name: string;
  type: 'ai-generated' | 'seal-required' | 'third-party-certified' | 'manual';
  description?: string;
  required: boolean;
}

// AI搜索历史
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultCount?: number;
}

// AI推荐模板
export interface AITemplate {
  id: string;
  title: string;
  template: string;
  category: string;
  usageCount?: number;
}

// 申报适配性结果
export interface ApplicationEligibility {
  eligible: boolean;
  probability: number; // 0-100
  status: 'qualified' | 'partially-qualified' | 'not-qualified';
  reasons: string[];
  suggestions: string[];
  missingRequirements?: string[];
  similarPolicies?: PolicyInfo[];
}

// 政策对比项
export interface PolicyComparison {
  policies: PolicyInfo[];
  comparisonFields: {
    conditions: string[][];
    materials: string[][];
    subsidy: string[];
    difficulty: string[];
    deadline: string[];
    matchScore: number[];
  };
}

// AI材料生成请求
export interface MaterialGenerationRequest {
  policyId: string;
  companyProfile: CompanyProfile;
  materialType: string;
}

// AI材料生成结果
export interface MaterialGenerationResult {
  id: string;
  policyId: string;
  materialType: string;
  content: string;
  suggestions: string[];
  createdAt: string;
}

// 申报进度跟踪
export interface ApplicationProgress {
  id: string;
  policyId: string;
  policyTitle: string;
  applicationNumber: string;
  currentStage: string;
  stages: ProgressStage[];
  estimatedNextStageDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStage {
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// 政策订阅
export interface PolicySubscription {
  id: string;
  name: string;
  filters: {
    regions?: string[];
    industries?: string[];
    categories?: string[];
    minSubsidy?: number;
  };
  notificationMethods: ('system' | 'sms' | 'email')[];
  active: boolean;
  createdAt: string;
}

// AI洞察数据
export interface AIInsights {
  applicablePoliciesCount: number;
  estimatedTotalSubsidy: number;
  highMatchPoliciesCount: number;
  priorityRecommendations: PriorityRecommendation[];
  qualificationGaps: QualificationGap[];
  lastUpdated: string;
}

export interface PriorityRecommendation {
  policyId: string;
  policyTitle: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  subsidy?: number;
  difficulty: 'low' | 'medium' | 'high';
  daysRemaining?: number;
}

export interface QualificationGap {
  qualification: string;
  requiredBy: string[]; // 政策ID列表
  acquisitionPath?: string;
  relatedPolicies?: PolicyInfo[];
}

// 语音输入状态
export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error?: string;
}
