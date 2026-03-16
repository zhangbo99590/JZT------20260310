/**
 * 供应链金融类型定义文件
 * 创建时间: 2026-01-13
 */

/**
 * 诊断记录接口定义
 */
export interface DiagnosisRecord {
  id: string;
  title: string;
  createTime: string;
  status: "completed" | "processing" | "draft";
  amount: string;
  type: string;
}

/**
 * 诊断步骤接口定义
 */
export interface DiagnosisStep {
  title: string;
  description: string;
}

/**
 * 快捷入口接口定义
 */
export interface QuickEntry {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  path?: string;
}

/**
 * 诊断状态类型
 */
export type DiagnosisStatus = "completed" | "processing" | "draft";
