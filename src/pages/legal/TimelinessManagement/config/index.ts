/**
 * 时效性管理模块 - 配置和模拟数据
 * 创建时间: 2026-01-14
 */

import type {
  RegulationStatus,
  AlertRule,
  ChangeRecord,
  StatisticItem,
} from "../types";

// 模拟法规状态数据
export const mockRegulationData: RegulationStatus[] = [
  {
    id: "1",
    title: "中华人民共和国科学技术进步法",
    level: "法律",
    publishDate: "2021-12-24",
    effectiveDate: "2022-01-01",
    status: "effective",
    version: "v2.0",
    lastUpdateDate: "2021-12-24",
    nextReviewDate: "2024-12-24",
    riskLevel: "low",
    impactLevel: "high",
  },
  {
    id: "2",
    title: "企业所得税法实施条例",
    level: "行政法规",
    publishDate: "2019-04-23",
    effectiveDate: "2019-05-01",
    status: "revised",
    version: "v3.1",
    lastUpdateDate: "2023-12-15",
    nextReviewDate: "2024-04-23",
    riskLevel: "medium",
    changeType: "modified",
    impactLevel: "high",
  },
  {
    id: "3",
    title: "高新技术企业认定管理办法",
    level: "部门规章",
    publishDate: "2016-01-29",
    effectiveDate: "2016-01-29",
    status: "effective",
    version: "v1.0",
    lastUpdateDate: "2016-01-29",
    nextReviewDate: "2024-01-29",
    riskLevel: "high",
    impactLevel: "medium",
  },
];

// 预警规则数据
export const mockAlertRules: AlertRule[] = [
  {
    id: "1",
    name: "法规状态变更提醒",
    type: "status_change",
    conditions: ["状态从有效变为已修订", "状态从有效变为已废止"],
    recipients: ["legal@company.com", "compliance@company.com"],
    enabled: true,
    lastTriggered: "2024-01-15 09:30",
  },
  {
    id: "2",
    name: "新法规发布通知",
    type: "new_regulation",
    conditions: ["财税领域新法规", "科技创新领域新法规"],
    recipients: ["finance@company.com", "rd@company.com"],
    enabled: true,
    lastTriggered: "2024-01-10 14:20",
  },
  {
    id: "3",
    name: "法规复审到期提醒",
    type: "review_due",
    conditions: ["距离复审日期30天内"],
    recipients: ["legal@company.com"],
    enabled: false,
  },
];

// 最近变更记录
export const recentChanges: ChangeRecord[] = [
  {
    id: "1",
    title: "企业所得税法实施条例",
    changeType: "modified",
    changeDate: "2023-12-15",
    description: "修订了研发费用加计扣除相关条款",
    impactLevel: "high",
  },
  {
    id: "2",
    title: "劳动合同法实施条例",
    changeType: "new",
    changeDate: "2023-12-10",
    description: "新增灵活用工相关规定",
    impactLevel: "medium",
  },
  {
    id: "3",
    title: "环境保护法实施细则",
    changeType: "abolished",
    changeDate: "2023-12-05",
    description: "部分条款被新法规替代",
    impactLevel: "low",
  },
];

// 统计数据
export const statistics: StatisticItem[] = [
  { title: "有效法规", value: 1245, status: "success" },
  { title: "待复审", value: 23, status: "warning" },
  { title: "高风险", value: 8, status: "error" },
  { title: "本月更新", value: 15, status: "processing" },
];
