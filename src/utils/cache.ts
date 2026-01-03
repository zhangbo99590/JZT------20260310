/**
 * 统一的内存缓存工具
 * 用于缓存API请求结果，减少重复请求
 * 支持LRU策略、持久化、缓存预热等高级特性
 */

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
  accessCount: number;
  lastAccess: number;
}

/**
 * 缓存选项接口
 */
export interface CacheOptions {
  /** 过期时间（毫秒） */
  ttl?: number;
  /** 是否持久化到localStorage */
  persist?: boolean;
}

/**
 * 缓存管理器类
 */
class CacheManager {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;
  private maxSize: number;
  private currentSize: number;
  private persistKey: string;
  private hits: number = 0;
  private misses: number = 0;

  /**
   * 创建缓存管理器
   * @param defaultTTL 默认过期时间（毫秒）
   * @param maxSize 最大缓存条目数
   * @param persistKey localStorage存储键
   */
  constructor(
    defaultTTL: number = 5 * 60 * 1000, // 默认5分钟
    maxSize: number = 100, // 最大缓存条目数
    persistKey: string = 'app_cache'
  ) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
    this.currentSize = 0;
    this.persistKey = persistKey;
    this.loadFromStorage();
  }

  /**
   * 从localStorage加载缓存
   */
  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.persistKey);
      if (!stored) return;
      
      const data = JSON.parse(stored);
      // 验证数据格式
      if (!data || typeof data !== 'object') return;
      
      Object.entries(data).forEach(([key, item]: [string, any]) => {
        // 验证缓存项格式
        if (item && typeof item === 'object' && 'data' in item && 'timestamp' in item) {
          this.cache.set(key, item);
          this.currentSize++;
        }
      });
      
      // 加载后立即清理过期项
      this.cleanup();
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * 保存缓存到localStorage
   */
  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const data: Record<string, any> = {};
      this.cache.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(this.persistKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * LRU淘汰策略 - 移除最少使用的缓存
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < lruTime) {
        lruTime = item.lastAccess;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.currentSize--;
    }
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param options 缓存选项或过期时间
   */
  set<T>(key: string, data: T, options?: CacheOptions | number): void {
    // 兼容旧API，允许直接传入过期时间
    const opts: CacheOptions = typeof options === 'number' 
      ? { ttl: options } 
      : options || {};

    const expiresIn = opts.ttl || this.defaultTTL;

    // 如果缓存已满，执行LRU淘汰
    if (this.currentSize >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
      accessCount: 0,
      lastAccess: Date.now(),
    };

    const isNewKey = !this.cache.has(key);
    this.cache.set(key, item);
    if (isNewKey) {
      this.currentSize++;
    }

    // 持久化
    if (opts.persist) {
      this.saveToStorage();
    }
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据，如果不存在或已过期则返回null
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.misses++;
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      this.currentSize--;
      this.misses++;
      return null;
    }

    // 更新访问信息
    item.accessCount++;
    item.lastAccess = Date.now();
    this.hits++;

    return item.data as T;
  }

  /**
   * 删除缓存
   * @param key 缓存键
   * @returns 是否成功删除
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.currentSize--;
    }
    return deleted;
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.hits = 0;
    this.misses = 0;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.persistKey);
    }
  }

  /**
   * 检查缓存是否存在且未过期
   * @param key 缓存键
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.currentSize;
  }

  /**
   * 清理过期缓存
   * @returns 清理的数量
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
        this.currentSize--;
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const hitRate = this.hits + this.misses > 0 
      ? (this.hits / (this.hits + this.misses)) * 100 
      : 0;
      
    return {
      size: this.currentSize,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate.toFixed(2) + '%',
      items: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        accessCount: item.accessCount,
        age: Math.round((Date.now() - item.timestamp) / 1000) + 's',
        ttl: Math.round(item.expiresIn / 1000) + 's',
        expiresIn: Math.round((item.timestamp + item.expiresIn - Date.now()) / 1000) + 's',
      })),
    };
  }

  /**
   * 预热缓存
   * @param keys 要预热的键数组
   * @param fetchFn 获取数据的函数
   */
  async warmup<T>(keys: string[], fetchFn: (key: string) => Promise<T>, options?: CacheOptions): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!this.has(key)) {
        try {
          const data = await fetchFn(key);
          this.set(key, data, options);
        } catch (error) {
          console.warn(`Failed to warmup cache for key: ${key}`, error);
        }
      }
    });
    await Promise.all(promises);
  }
}

// 创建全局缓存实例
export const cache = new CacheManager();

// 定期清理过期缓存（每10分钟）
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

/**
 * 缓存装饰器工厂函数
 * 用于包装异步函数，自动处理缓存
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator?: (...args: Parameters<T>) => string;
    ttl?: number;
    persist?: boolean;
    forceRefresh?: boolean;
  } = {}
): T {
  const { keyGenerator, ttl, persist, forceRefresh } = options;

  return (async (...args: Parameters<T>) => {
    // 生成缓存键
    const cacheKey = keyGenerator 
      ? keyGenerator(...args)
      : `${fn.name}_${JSON.stringify(args)}`;

    // 如果强制刷新，跳过缓存查询
    if (!forceRefresh) {
      // 尝试从缓存获取
      const cachedData = cache.get(cacheKey);
      if (cachedData !== null) {
        return cachedData;
      }
    }

    try {
      // 执行原函数
      const result = await fn(...args);

      // 存入缓存
      cache.set(cacheKey, result, { ttl, persist });

      return result;
    } catch (error) {
      // 如果出错且缓存中有旧数据，则返回旧数据
      if (!forceRefresh) {
        const cachedData = cache.get(cacheKey);
        if (cachedData !== null) {
          console.warn(`Error fetching fresh data, using cached data for ${cacheKey}`, error);
          return cachedData;
        }
      }
      throw error;
    }
  }) as T;
}

export default cache;
