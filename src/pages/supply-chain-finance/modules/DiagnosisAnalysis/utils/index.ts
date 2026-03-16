/**
 * 融资诊断分析页面工具函数
 * 创建时间: 2026-01-13
 */

// 根据匹配度获取颜色 - 使用共享工具函数
export { getMatchColor } from "../../../../../utils/sharedUtils";

// 从localStorage获取融资诊断数据
export function getFinancingDiagnosisData(): {
  hasData: boolean;
  data: unknown;
} {
  const storedData = localStorage.getItem("financing-diagnosis-data");
  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      return { hasData: true, data };
    } catch (error) {
      console.error("解析融资诊断数据失败:", error);
      return { hasData: false, data: null };
    }
  }
  return { hasData: false, data: null };
}

// 生成申请ID - 使用共享工具函数
export { generateApplicationId } from "../../../../../utils/sharedUtils";

// Note: saveApplicationData function removed to eliminate duplication
// Use the centralized applicationStorage utility instead
