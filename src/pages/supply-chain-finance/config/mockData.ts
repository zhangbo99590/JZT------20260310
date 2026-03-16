/**
 * 供应链金融模拟数据配置文件
 * 创建时间: 2026-01-13
 */

import type { DiagnosisRecord, DiagnosisStep } from "../types";

/**
 * 模拟历史诊断记录数据
 * 数据更新时间: 2026-01-13
 */
export const mockDiagnosisRecords: DiagnosisRecord[] = [
  {
    id: "1",
    title: "设备采购融资需求诊断",
    createTime: "2024-01-15",
    status: "completed",
    amount: "500万",
    type: "设备贷款",
  },
  {
    id: "2",
    title: "流动资金融资需求诊断",
    createTime: "2024-01-10",
    status: "processing",
    amount: "200万",
    type: "信用贷款",
  },
  {
    id: "3",
    title: "供应链融资需求诊断",
    createTime: "2024-01-05",
    status: "draft",
    amount: "300万",
    type: "保理业务",
  },
];

/**
 * 诊断流程步骤配置
 * 配置更新时间: 2026-01-13
 */
export const diagnosisSteps: DiagnosisStep[] = [
  {
    title: "需求采集",
    description: "收集企业融资基本信息",
  },
  {
    title: "数据补全",
    description: "完善企业经营数据",
  },
  {
    title: "画像生成",
    description: "生成企业融资画像",
  },
  {
    title: "方案推荐",
    description: "推荐最优融资方案",
  },
];
