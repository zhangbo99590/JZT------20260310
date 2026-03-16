/**
 * 统一存储工具
 */
import { useState, useEffect, useCallback } from 'react';
import { safeJsonParse } from './commonUtils';

export class StorageUtils {
  /**
   * 设置localStorage值
   * @param key 键名
   * @param value 值
   * @returns 是否设置成功
   */
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Failed to set localStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * 获取localStorage值
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 存储的值或默认值
   */
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // 尝试解析JSON，如果失败则返回原始字符串
      if (typeof defaultValue === 'string') {
        return item as unknown as T;
      }
      
      return safeJsonParse(item, defaultValue);
    } catch (error) {
      console.error(`Failed to get localStorage item "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * 移除localStorage项
   * @param key 键名
   * @returns 是否移除成功
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item "${key}":`, error);
      return false;
    }
  }

  /**
   * 清空localStorage
   * @returns 是否清空成功
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * 检查localStorage中是否存在指定键
   * @param key 键名
   * @returns 是否存在
   */
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * 获取localStorage中所有键名
   * @returns 键名数组
   */
  static getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }

  /**
   * 获取localStorage使用的存储大小（近似值）
   * @returns 存储大小（字节）
   */
  static getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
  static setItems(items: Record<string, any>): string[] {
    const successKeys: string[] = [];
    Object.entries(items).forEach(([key, value]) => {
      if (this.setItem(key, value)) {
        successKeys.push(key);
      }
    });
    return successKeys;
  }

  /**
   * 批量获取localStorage值
   * @param keys 键名数组
   * @param defaultValue 默认值
   * @returns 键值对对象
   */
  static getItems<T>(keys: string[], defaultValue: T): Record<string, T> {
    const result: Record<string, T> = {};
    keys.forEach(key => {
      result[key] = this.getItem(key, defaultValue);
    });
    return result;
  }

  /**
   * 批量移除localStorage项
   * @param keys 键名数组
   * @returns 移除成功的键名数组
   */
  static removeItems(keys: string[]): string[] {
    const successKeys: string[] = [];
    keys.forEach(key => {
      if (this.removeItem(key)) {
        successKeys.push(key);
      }
    });
    return successKeys;
  }
  
  /**
   * 获取localStorage中所有符合特定前缀的键
   * @param prefix 键名前缀
   * @returns 符合前缀的键名数组
   */
  static getKeysByPrefix(prefix: string): string[] {
    return this.getAllKeys().filter(key => key.startsWith(prefix));
  }
}

/**
 * LocalStorage Hook
 * 提供React组件中使用的localStorage操作
 * @param key 键名
 * @param initialValue 初始值
 * @returns [存储的值, 设置值的函数, 移除值的函数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 获取初始值
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return StorageUtils.getItem(key, initialValue);
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 设置值
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        StorageUtils.setItem(key, valueToStore);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 删除值
  const removeValue = useCallback(() => {
    StorageUtils.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  // 监听storage事件
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        // 如果值被删除
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
// Note: AppStorageManager class removed to eliminate redundancy
// Use the specialized applicationStorage utility for application data
// Use StorageUtils directly for general storage operations