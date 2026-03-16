/**
 * 共享工具函数
 * 创建时间: 2026-03-02
 * 用途: 集中管理跨模块使用的通用函数，避免重复代码
 */

/**
 * 生成申请ID
 * 统一的申请ID生成逻辑
 */
export function generateApplicationId(): string {
  return "FA" + Date.now().toString().slice(-8);
}

/**
 * 根据匹配度获取颜色
 * 统一的匹配度颜色映射逻辑
 */
export function getMatchColor(score: number): string {
  if (score >= 90) return "#52c41a";
  if (score >= 80) return "#1890ff";
  if (score >= 70) return "#faad14";
  return "#ff4d4f";
}

/**
 * 根据匹配度获取标签配置
 * 统一的匹配度标签映射逻辑
 */
export function getMatchTag(score: number): { color: string; text: string } {
  if (score >= 90) return { color: "green", text: "极度推荐" };
  if (score >= 80) return { color: "blue", text: `匹配度 ${score}%` };
  if (score >= 70) return { color: "orange", text: `匹配度 ${score}%` };
  return { color: "red", text: `匹配度 ${score}%` };
}
