// 产业大厅类型定义

// 发布类型
export type PublicationType = "supply" | "demand";

// 供给类型
export type SupplyType = "product" | "service" | "capacity" | "technology";

// 需求类型
export type DemandType = "purchase" | "cooperation" | "technology" | "capacity";

// 发布状态
export type PublicationStatus =
  | "pending"
  | "active"
  | "offline"
  | "expired"
  | "rejected"
  | "draft"
  | "auditing";

// 可见范围
export type VisibilityScope = "public" | "industry" | "enterprise";

// 对接状态
export type ConnectionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "negotiating"
  | "completed";

// 产品供给
export interface ProductSupply {
  productName: string;
  specifications: string;
  capacity: number;
  capacityUnit: string;
  priceRange: {
    min: number;
    max: number;
  };
  deliveryCycle: number; // 天数
  // 详情页面扩展字段
  diameter?: string;
  pressure?: string;
  temperature?: string;
  material?: string;
  sealingType?: string;
  connectionType?: string;
  applicableMedia?: string;
  minOrderQuantity?: number;
  quantityUnit?: string;
  stockQuantity?: number;
  workingPressure?: string;
  workingTemperature?: string;
}

// 服务供给
export interface ServiceSupply {
  serviceType: string;
  serviceScope: string;
  servicePeriod: string;
  pricingMethod: string;
}

// 产能供给
export interface CapacitySupply {
  equipmentType: string;
  idleTime: string;
  productionCapacity: string;
  cooperationMode: string;
}

// 技术供给
export interface TechnologySupply {
  technologyField: string;
  patentNumber?: string;
  licensingMethod: string;
  cooperationPeriod: string;
}

// 采购需求
export interface PurchaseRequirement {
  materialCode: string;
  quantity: number;
  quantityUnit: string;
  budgetRange: {
    min: number;
    max: number;
  };
  deliveryLocation: string;
}

// 合作需求
export interface CooperationRequirement {
  cooperationField: string;
  expectedGoal: string;
  resourceInput: string;
  profitDistribution: string;
}

// 技术需求
export interface TechnologyRequirement {
  technologyField: string;
  rdCycle: number; // 研发周期（月）
  budgetRange: {
    min: number;
    max: number;
  };
  resultOwnership: string;
}

// 产能需求
export interface CapacityRequirement {
  productType: string;
  processingRequirements: string;
  deliveryCycle: number; // 天数
  qualityStandards: string;
}

// 附件
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadTime: string;
}

// 发布基础信息
export interface PublicationBase {
  id: string;
  title: string;
  type: PublicationType;
  subType: SupplyType | DemandType;
  description: string;
  status: PublicationStatus;
  rejectReason?: string; // 审核不通过原因
  publisherId: string;
  publisherName: string;
  publisherAvatar?: string;
  productImage?: string;
  publishTime: string;
  expiryDate: string;
  validityDays: number;
  visibilityScope: VisibilityScope;
  visibleTo?: string[]; // 可见企业ID列表
  viewCount: number;
  connectionCount: number;
  attachments: Attachment[];
  tags: string[];
  region: string;
  industry: string;
  // 新增字段
  rating?: number; // 商机评星 1-5
  isCertified?: boolean; // 企业认证
  successRate?: number; // 对接成功率 0-100
  budget?: number; // 预算/价格
  budgetUnit?: "元" | "万"; // 单位

  // 详情页面扩展字段
  basicDetails?: {
    materialCode?: string; // 物料编码
    quantity?: number; // 数量
    quantityUnit?: string; // 数量单位
    budgetRange?: { min: number; max: number }; // 预算范围
    deliveryLocation?: string; // 交付地点
    paymentMethod?: string; // 付款方式
    deliveryTime?: string; // 交付时间
    qualityRequirement?: string; // 质量要求
    technicalSpecs?: {
      // 技术规格
      [key: string]: any;
    };
  };
}

// 供给发布
export interface SupplyPublication extends PublicationBase {
  type: "supply";
  subType: SupplyType;
  details?: (
    | ProductSupply
    | ServiceSupply
    | CapacitySupply
    | TechnologySupply
  ) &
    Partial<ProductSupply>;
}

// 需求发布
export interface DemandPublication extends PublicationBase {
  type: "demand";
  subType: DemandType;
  details?: (
    | PurchaseRequirement
    | CooperationRequirement
    | TechnologyRequirement
    | CapacityRequirement
  ) &
    Partial<ProductSupply>;
}

// 发布联合类型
export type Publication = SupplyPublication | DemandPublication;

// 对接记录
export interface Connection {
  id: string;
  applicationId?: string; // 申请编号
  publicationId: string;
  publicationType: PublicationType;
  publicationTitle: string;
  initiatorId: string;
  initiatorName: string;
  initiatorAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  status: ConnectionStatus;
  message: string;
  matchScore?: number; // 匹配度 0-100
  createTime: string;
  updateTime: string;
  chatMessages: ChatMessage[];
  attachments: Attachment[];
}

// 聊天消息
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "file" | "image";
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

// 统计数据
export interface IndustryStats {
  totalPublications: number;
  activeSupply: number;
  activeDemand: number;
  totalConnections: number;
  successRate: number;
  trendData: {
    date: string;
    supply: number;
    demand: number;
  }[];
  categoryDistribution: {
    name: string;
    value: number;
  }[];
  regionDistribution: {
    name: string;
    value: number;
  }[];
}

// 筛选条件
export interface PublicationFilter {
  type?: PublicationType;
  subType?: SupplyType | DemandType;
  status?: PublicationStatus;
  publisherId?: string;
  keyword?: string;
  region?: string;
  industry?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  publishedWithinDays?: number;
  expiringWithinDays?: number;
  budgetRange?: string;
  quality?: string;
}

// 新建发布表单
export interface NewPublicationForm {
  title: string;
  type: PublicationType;
  subType: SupplyType | DemandType;
  description: string;
  details: any; // 根据 subType 动态类型
  validityDays: 15 | 30 | 60;
  visibilityScope: VisibilityScope;
  visibleTo?: string[];
  tags: string[];
  region: string;
  industry: string;
  attachments: File[];
}
