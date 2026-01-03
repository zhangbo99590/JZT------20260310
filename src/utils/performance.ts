/**
 * 性能优化工具集
 * 提供防抖、节流、性能监控等功能
 */

/**
 * 防抖函数 - 延迟执行，多次触发只执行最后一次
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数 - 限制执行频率
 * @param fn 要执行的函数
 * @param limit 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 性能监控装饰器
 * @param label 监控标签
 */
export function measurePerformance(label: string) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
      } catch (error) {
        const end = performance.now();
        console.error(`[Performance Error] ${label}: ${(end - start).toFixed(2)}ms`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 批量处理函数 - 将多个操作合并为一次执行
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function batchProcess<T>(
  fn: (items: T[]) => void,
  delay: number = 100
): (item: T) => void {
  let items: T[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  return (item: T) => {
    items.push(item);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(items);
      items = [];
      timeoutId = null;
    }, delay);
  };
}

/**
 * 懒加载图片
 * @param imageUrl 图片URL
 * @param placeholder 占位图URL
 */
export function lazyLoadImage(
  imageUrl: string,
  placeholder?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(imageUrl);
    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * 请求去重 - 防止重复请求
 */
class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // 如果已有相同的请求在进行中，直接返回该请求的Promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // 创建新请求
    const promise = requestFn().finally(() => {
      // 请求完成后清除
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear() {
    this.pendingRequests.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * 内存优化 - 大数据分页处理
 */
export function chunkArray<T>(array: T[], chunkSize: number = 100): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * 记录性能指标
   */
  record(label: string, duration: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
  }

  /**
   * 获取性能统计
   */
  getStats(label: string) {
    const durations = this.metrics.get(label);
    if (!durations || durations.length === 0) {
      return null;
    }

    const sorted = [...durations].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * 获取所有统计
   */
  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [label] of this.metrics) {
      stats[label] = this.getStats(label);
    }
    return stats;
  }

  /**
   * 清空统计
   */
  clear() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * 异步任务队列 - 控制并发数量
 */
export class AsyncQueue {
  private queue: Array<() => Promise<any>> = [];
  private running: number = 0;
  private maxConcurrency: number;

  constructor(maxConcurrency: number = 3) {
    this.maxConcurrency = maxConcurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.running >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();

    if (task) {
      try {
        await task();
      } finally {
        this.running--;
        this.process();
      }
    }
  }
}

/**
 * 资源预加载
 */
export function preloadResources(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload: ${url}`));
        document.head.appendChild(link);
      });
    })
  );
}
