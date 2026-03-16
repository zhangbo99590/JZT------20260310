/**
 * API工具类
 * 提供统一的API调用、延迟模拟、缓存和错误处理功能
 */

import { handleError } from "../utils/errorHandler";
import { simulateDelay } from "../utils/commonUtils";

/**
 * 创建带延迟的API调用
 * @param fn 要执行的API函数
 * @param delay 延迟时间（毫秒）
 * @returns 包装后的函数
 */
export function withDelay<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300
): T {
  return (async (...args: Parameters<T>) => {
    await simulateDelay(delay);
    return fn(...args);
  }) as T;
}

/**
 * 创建带错误处理的API调用
 * @param fn 要执行的API函数
 * @param errorMessage 错误提示信息
 * @returns 包装后的函数
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage: string = "操作失败"
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, { showMessage: true });
      throw error;
    }
  }) as T;
}

/**
 * 创建带延迟和错误处理的API调用
 * @param fn 要执行的API函数
 * @param delay 延迟时间（毫秒）
 * @param errorMessage 错误提示信息
 * @returns 包装后的函数
 */
export function createApiCall<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300,
  errorMessage: string = "操作失败"
): T {
  return withErrorHandling(withDelay(fn, delay), errorMessage);
}
