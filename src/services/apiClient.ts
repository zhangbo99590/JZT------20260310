/**
 * 统一API客户端
 * 提供请求拦截、错误处理、缓存等功能
 */

import { cache } from '../utils/cache';
import { handleNetworkError, AppError, ErrorType } from '../utils/errorHandler';
import { requestDeduplicator } from '../utils/performance';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  cacheTTL?: number;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 移除认证token
   */
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * 构建完整URL
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(url: string, config: RequestConfig): string {
    return `api_${config.method || 'GET'}_${url}_${JSON.stringify(config.body || {})}`;
  }

  /**
   * 请求超时处理
   */
  private withTimeout<T>(
    promise: Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new AppError('请求超时', ErrorType.NETWORK, 'TIMEOUT')),
          timeout
        )
      ),
    ]);
  }

  /**
   * 重试逻辑
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * 发送请求
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache: useCache = method === 'GET',
      cacheTTL = 5 * 60 * 1000,
      timeout = this.defaultTimeout,
      retry = 0,
      retryDelay = 1000,
    } = config;

    const url = this.buildURL(endpoint);
    const cacheKey = this.getCacheKey(url, config);

    // 检查缓存
    if (useCache && method === 'GET') {
      const cached = cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // 请求去重
    const requestFn = async () => {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      try {
        const response = await this.withTimeout(
          fetch(url, fetchOptions),
          timeout
        );

        // 处理HTTP错误
        if (!response.ok) {
          throw await this.handleHTTPError(response);
        }

        const result: ApiResponse<T> = await response.json();

        // 处理业务错误
        if (!result.success) {
          throw new AppError(
            result.message || '请求失败',
            ErrorType.BUSINESS,
            result.code
          );
        }

        // 缓存成功响应
        if (useCache && method === 'GET') {
          cache.set(cacheKey, result.data, cacheTTL);
        }

        return result.data;
      } catch (error: any) {
        throw handleNetworkError(error);
      }
    };

    // 应用重试逻辑
    const executeRequest = retry > 0
      ? () => this.withRetry(requestFn, retry, retryDelay)
      : requestFn;

    // 应用请求去重
    return requestDeduplicator.deduplicate(cacheKey, executeRequest);
  }

  /**
   * 处理HTTP错误
   */
  private async handleHTTPError(response: Response): Promise<AppError> {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // 无法解析响应体
    }

    return handleNetworkError({
      response: {
        status: response.status,
        data: errorData,
      },
    });
  }

  /**
   * GET请求
   */
  get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST请求
   */
  post<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT请求
   */
  put<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE请求
   */
  delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH请求
   */
  patch<T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * 批量请求
   */
  async batch<T = any>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(req => req()));
  }

  /**
   * 清除缓存
   */
  clearCache(endpoint?: string) {
    if (endpoint) {
      const url = this.buildURL(endpoint);
      const cacheKey = this.getCacheKey(url, { method: 'GET' });
      cache.delete(cacheKey);
    } else {
      cache.clear();
    }
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 导出类供自定义实例使用
export default ApiClient;
