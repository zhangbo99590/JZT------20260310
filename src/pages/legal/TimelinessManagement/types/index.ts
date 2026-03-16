/**
 * 时效性管理模块 - 类型定义
 * 创建时间: 2026-01-14
 */

// 法规状态接口
export interface RegulationStatus {
  id: string;
  title: string;
  level: string;
  publishDate: string;
  effectiveDate: string;
  status: "effective" | "revised" | "abolished" | "pending";
  version: string;
  lastUpdateDate: string;
  nextReviewDate: string;
  riskLevel: "high" | "medium" | "low";
  changeType?: "new" | "modified" | "abolished";
  impactLevel: "high" | "medium" | "low";
}

// 预警规则接口
export interface AlertRule {
  id: string;
  name: string;
  type: "status_change" | "version_update" | "review_due" | "new_regulation";
  conditions: string[];
  recipients: string[];
  enabled: boolean;
  lastTriggered?: string;
}

// 变更记录接口
export interface ChangeRecord {
  id: string;
  title: string;
  changeType: "new" | "modified" | "abolished";
  changeDate: string;
  description: string;
  impactLevel: "high" | "medium" | "low";
}

// 统计数据接口
export interface StatisticItem {
  title: string;
  value: number;
  status: "success" | "warning" | "error" | "processing";
}
