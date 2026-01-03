/**
 * 防抖Hook
 * 用于延迟执行频繁变化的值
 * 使用performance.ts中的debounce函数实现
 */

import { useState, useEffect } from 'react';
import { debounce } from '../utils/performance';

/**
 * 防抖Hook - 延迟更新值
 * @param value 要防抖的值
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 使用performance.ts中的debounce函数
    const debouncedUpdate = debounce(() => {
      setDebouncedValue(value);
    }, delay);
    
    debouncedUpdate();
    
    return () => {
      // 清理效果在debounce函数内部处理
    };
  }, [value, delay]);

  return debouncedValue;
}
