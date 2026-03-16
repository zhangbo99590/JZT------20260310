/**
 * 请求频率限制工具
 * 用于限制接口请求频率，防止过于频繁的请求
 */

interface RateLimitConfig {
  windowMs: number; // 时间窗口大小（毫秒）
  maxRequests: number; // 时间窗口内最大请求数
  message: string; // 超出限制时的提示信息
}

interface RequestRecord {
  timestamp: number;
  endpoint: string;
}

class RateLimiter {
  private config: RateLimitConfig;
  private requestRecords: Map<string, RequestRecord[]>;

  constructor(
    config: RateLimitConfig = {
      windowMs: 60 * 1000, // 默认1分钟
      maxRequests: 20, // 默认20次，提高限制以适应常用功能
      message: "操作频繁，请稍后再试",
    }
  ) {
    this.config = config;
    this.requestRecords = new Map();
  }

  /**
   * 检查请求是否超出频率限制
   * @param key 请求标识（可以是endpoint或其他唯一标识）
   * @returns 是否允许请求
   */
  check(key: string): { allowed: boolean; message?: string } {
    const now = Date.now();
    const records = this.requestRecords.get(key) || [];

    // 过滤掉时间窗口外的记录
    const validRecords = records.filter(
      (record) => now - record.timestamp < this.config.windowMs
    );

    // 检查是否超出限制
    if (validRecords.length >= this.config.maxRequests) {
      return {
        allowed: false,
        message: this.config.message,
      };
    }

    // 添加新的请求记录
    validRecords.push({
      timestamp: now,
      endpoint: key,
    });

    // 更新记录
    this.requestRecords.set(key, validRecords);

    return { allowed: true };
  }

  /**
   * 清除指定请求的记录
   * @param key 请求标识
   */
  clear(key: string): void {
    this.requestRecords.delete(key);
  }

  /**
   * 清除所有请求记录
   */
  clearAll(): void {
    this.requestRecords.clear();
  }

  /**
   * 获取指定请求的当前请求数
   * @param key 请求标识
   * @returns 当前请求数
   */
  getCurrentCount(key: string): number {
    const now = Date.now();
    const records = this.requestRecords.get(key) || [];
    const validRecords = records.filter(
      (record) => now - record.timestamp < this.config.windowMs
    );
    return validRecords.length;
  }

  /**
   * 重置配置
   * @param config 新的配置
   */
  resetConfig(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 创建默认实例
export const rateLimiter = new RateLimiter();

// 导出类供自定义实例使用
export default RateLimiter;
