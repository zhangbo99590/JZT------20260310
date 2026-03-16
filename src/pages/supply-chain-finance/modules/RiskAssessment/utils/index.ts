/**
 * 风险评估页面工具函数
 * 创建时间: 2026-01-13
 */

// 根据风险等级获取颜色
export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "#52c41a";
    case "medium":
      return "#faad14";
    case "high":
      return "#ff4d4f";
    default:
      return "#d9d9d9";
  }
}

// 根据状态获取颜色
export function getStatusColor(status: string): string {
  switch (status) {
    case "excellent":
      return "#52c41a";
    case "good":
      return "#1890ff";
    case "warning":
      return "#faad14";
    case "danger":
      return "#ff4d4f";
    default:
      return "#d9d9d9";
  }
}

// 获取风险等级配置
export function getRiskLevelConfig(level: string): {
  color: string;
  text: string;
} {
  const config: Record<string, { color: string; text: string }> = {
    low: { color: "green", text: "低风险" },
    medium: { color: "orange", text: "中风险" },
    high: { color: "red", text: "高风险" },
  };
  return config[level] || { color: "default", text: "未知" };
}

// 获取风险等级文本
export function getRiskLevelText(level: string): string {
  const textMap: Record<string, string> = {
    low: "低风险",
    medium: "中风险",
    high: "高风险",
  };
  return textMap[level] || "未知";
}
