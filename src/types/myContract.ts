/**
 * 我的合同模块类型定义
 */

// 合同状态枚举
export enum MyContractStatus {
  PENDING_APPROVAL = 'pending_approval', // 待我审批
  INITIATED_BY_ME = 'initiated_by_me', // 我发起的
  RESPONSIBLE_BY_ME = 'responsible_by_me', // 我负责的
  COMPLETED = 'completed', // 已完成
  TERMINATED = 'terminated', // 已终止
  DRAFT = 'draft', // 草稿箱
}

// 合同类型枚举
export enum MyContractType {
  SERVICE = 'service', // 服务合同
  PURCHASE = 'purchase', // 采购合同
  SALES = 'sales', // 销售合同
  LEASE = 'lease', // 租赁合同
  COOPERATION = 'cooperation', // 合作合同
  EMPLOYMENT = 'employment', // 劳动合同
  OTHER = 'other', // 其他
}

// 签署状态枚举
export enum SignStatus {
  UNSIGNED = 'unsigned', // 未签署
  PARTIAL_SIGNED = 'partial_signed', // 部分签署
  FULLY_SIGNED = 'fully_signed', // 完全签署
}

// 用户角色枚举
export enum UserRole {
  CREATOR = 'creator', // 创建者
  APPROVER = 'approver', // 审批人
  RESPONSIBLE = 'responsible', // 负责人
  PARTICIPANT = 'participant', // 参与人
}

// 我的合同基础接口
export interface MyContract {
  id: string;
  title: string;
  contractNumber: string;
  type: MyContractType;
  status: MyContractStatus;
  signStatus: SignStatus;
  amount?: number;
  currency: string;
  partnerName: string;
  partnerType: 'company' | 'individual';
  createdBy: string;
  createdAt: string;
  signedAt?: string;
  expiryAt?: string;
  updatedAt: string;
  currentApprovalNode?: string;
  remainingDays?: number;
  progress?: number;
  userRole: UserRole;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  isUrgent: boolean;
  daysToExpiry?: number;
}

// 合同统计数据
export interface MyContractStats {
  total: number;
  pendingApproval: number;
  initiated: number;
  responsible: number;
  completed: number;
  terminated: number;
  drafts: number;
  monthlyNew: number;
  onTimeRate: number;
  overdueCount: number;
  pendingPaymentAmount: number;
}

// 合同筛选参数
export interface MyContractFilters {
  status?: MyContractStatus[];
  type?: MyContractType[];
  signStatus?: SignStatus[];
  dateRange?: [string, string];
  amountRange?: [number, number];
  partnerName?: string;
  createdBy?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 待办提醒项
export interface TodoReminder {
  type: 'approval' | 'expiry' | 'follow_up';
  title: string;
  count: number;
  contracts: Array<{
    id: string;
    title: string;
    urgency: 'high' | 'medium' | 'low';
    dueDate?: string;
  }>;
}

// 合同操作记录
export interface ContractOperation {
  id: string;
  contractId: string;
  action: string;
  description: string;
  operatorId: string;
  operatorName: string;
  timestamp: string;
  attachments?: string[];
  comment?: string;
}

// 合同文件
export interface ContractFile {
  id: string;
  name: string;
  type: 'original' | 'signed' | 'supplement';
  version: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  isPersonalUpload: boolean;
}

// 履约节点
export interface PerformanceNode {
  id: string;
  title: string;
  type: 'signing' | 'payment' | 'delivery' | 'milestone';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  responsiblePerson: string;
  dueDate: string;
  completedAt?: string;
  isPersonalResponsible: boolean;
  description?: string;
}

// 合同详情扩展
export interface MyContractDetail extends MyContract {
  description?: string;
  partyAName: string;
  partyBName: string;
  partyAContact: string;
  partyBContact: string;
  effectiveDate: string;
  terminationReason?: string;
  files: ContractFile[];
  operations: ContractOperation[];
  performanceNodes: PerformanceNode[];
  relatedContracts: Array<{
    id: string;
    title: string;
    relation: string;
  }>;
  reminderSettings: {
    expiryReminder: number; // 到期提醒提前天数
    overdueAlert: boolean;
    smsNotification: boolean;
  };
}

// 统计图表数据
export interface ChartData {
  monthlyTrend: Array<{
    month: string;
    initiated: number;
    signed: number;
    completed: number;
  }>;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
}

// 预警设置
export interface AlertSettings {
  expiryReminderDays: number[];
  overdueAlertEnabled: boolean;
  notificationMethods: ('system' | 'sms' | 'email')[];
  customRules: Array<{
    id: string;
    name: string;
    condition: string;
    action: string;
    enabled: boolean;
  }>;
}

// 搜索结果
export interface MyContractSearchResult {
  total: number;
  list: MyContract[];
  page: number;
  pageSize: number;
  stats: MyContractStats;
}

// 导出数据格式
export interface ExportData {
  summary: MyContractStats;
  details: MyContract[];
  charts: ChartData;
  exportTime: string;
  exportBy: string;
}
