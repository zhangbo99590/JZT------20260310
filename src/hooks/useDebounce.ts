import { useState, useEffect } from "react";
import { debounce } from "../utils/performance";

/**
 * 防抖 Hook - 延迟更新值以优化性能
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    debouncedUpdate();

    return () => {};
  }, [value, delay]);

  return debouncedValue;
}
