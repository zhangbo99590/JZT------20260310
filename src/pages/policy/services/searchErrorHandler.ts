/**
 * 璟智通政策搜索模块 - 搜索错误处理服务
 * 实现精准的错误场景判定和用户友好的错误提示
 */

export enum SearchErrorType {
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_DISCONNECTED = 'NETWORK_DISCONNECTED',
  SERVER_ERROR = 'SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface SearchError {
  type: SearchErrorType;
  message: string;
  code?: number;
  details?: any;
  timestamp: number;
}

export interface SearchErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableDuplicateCheck?: boolean;
  duplicateCheckWindow?: number;
}

class SearchErrorHandler {
  private static instance: SearchErrorHandler;
  private recentErrors: Map<string, number> = new Map();
  private options: Required<SearchErrorHandlerOptions>;

  private constructor(options: SearchErrorHandlerOptions = {}) {
    this.options = {
      maxRetries: 3,
      retryDelay: 1000,
      enableDuplicateCheck: true,
      duplicateCheckWindow: 5000, // 5秒内不重复显示相同错误
      ...options
    };
  }

  public static getInstance(options?: SearchErrorHandlerOptions): SearchErrorHandler {
    if (!SearchErrorHandler.instance) {
      SearchErrorHandler.instance = new SearchErrorHandler(options);
    }
    return SearchErrorHandler.instance;
  }

  /**
   * 解析错误类型和生成用户友好的错误消息
   */
  public parseError(error: any): SearchError {
    const timestamp = Date.now();
    
    // 网络错误检测
    if (this.isNetworkError(error)) {
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('timeout')) {
        return {
          type: SearchErrorType.NETWORK_TIMEOUT,
          message: '网络连接失败，请检查网络后重试',
          timestamp
        };
      }
      
      if (!navigator.onLine) {
        return {
          type: SearchErrorType.NETWORK_DISCONNECTED,
          message: '网络连接失败，请检查网络后重试',
          timestamp
        };
      }
    }

    // HTTP状态码错误
    if (error.response?.status) {
      const status = error.response.status;
      
      switch (status) {
        case 400:
          return {
            type: SearchErrorType.BAD_REQUEST,
            message: '筛选条件异常，请重新选择后重试',
            code: status,
            details: error.response.data,
            timestamp
          };
          
        case 401:
          return {
            type: SearchErrorType.UNAUTHORIZED,
            message: '暂无权限查询，请联系管理员',
            code: status,
            timestamp
          };
          
        case 403:
          return {
            type: SearchErrorType.FORBIDDEN,
            message: '暂无权限查询，请联系管理员',
            code: status,
            timestamp
          };
          
        case 404:
          return {
            type: SearchErrorType.NOT_FOUND,
            message: '搜索服务暂时不可用，请稍后重试',
            code: status,
            timestamp
          };
          
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: SearchErrorType.SERVER_ERROR,
            message: '服务器繁忙，请稍后重试',
            code: status,
            timestamp
          };
          
        default:
          return {
            type: SearchErrorType.UNKNOWN_ERROR,
            message: '搜索执行失败，请重试',
            code: status,
            timestamp
          };
      }
    }

    // 参数验证错误
    if (this.isValidationError(error)) {
      return {
        type: SearchErrorType.VALIDATION_ERROR,
        message: '请选择至少一个筛选条件',
        details: error,
        timestamp
      };
    }

    // 默认未知错误
    return {
      type: SearchErrorType.UNKNOWN_ERROR,
      message: '搜索执行失败，请重试',
      details: error,
      timestamp
    };
  }

  /**
   * 检查是否应该显示错误（防重复）
   */
  public shouldShowError(error: SearchError): boolean {
    if (!this.options.enableDuplicateCheck) {
      return true;
    }

    const errorKey = `${error.type}_${error.message}`;
    const lastShown = this.recentErrors.get(errorKey);
    const now = Date.now();

    if (lastShown && (now - lastShown) < this.options.duplicateCheckWindow) {
      return false; // 在时间窗口内，不重复显示
    }

    this.recentErrors.set(errorKey, now);
    
    // 清理过期的错误记录
    this.cleanupExpiredErrors();
    
    return true;
  }

  /**
   * 获取错误的重试建议
   */
  public getRetryAdvice(error: SearchError): {
    canRetry: boolean;
    retryDelay: number;
    maxRetries: number;
    suggestion: string;
  } {
    switch (error.type) {
      case SearchErrorType.NETWORK_TIMEOUT:
      case SearchErrorType.NETWORK_DISCONNECTED:
        return {
          canRetry: true,
          retryDelay: 2000,
          maxRetries: 3,
          suggestion: '请检查网络连接后重试'
        };
        
      case SearchErrorType.SERVER_ERROR:
        return {
          canRetry: true,
          retryDelay: 3000,
          maxRetries: 2,
          suggestion: '服务器繁忙，建议稍后重试'
        };
        
      case SearchErrorType.BAD_REQUEST:
        return {
          canRetry: false,
          retryDelay: 0,
          maxRetries: 0,
          suggestion: '请检查筛选条件后重新搜索'
        };
        
      case SearchErrorType.UNAUTHORIZED:
      case SearchErrorType.FORBIDDEN:
        return {
          canRetry: false,
          retryDelay: 0,
          maxRetries: 0,
          suggestion: '请联系管理员获取权限'
        };
        
      case SearchErrorType.VALIDATION_ERROR:
        return {
          canRetry: false,
          retryDelay: 0,
          maxRetries: 0,
          suggestion: '请选择筛选条件后重新搜索'
        };
        
      default:
        return {
          canRetry: true,
          retryDelay: this.options.retryDelay,
          maxRetries: this.options.maxRetries,
          suggestion: '请稍后重试'
        };
    }
  }

  /**
   * 验证搜索参数
   */
  public validateSearchParams(params: {
    keyword?: string;
    areas?: string[];
    industries?: string[];
    [key: string]: any;
  }): { isValid: boolean; error?: SearchError } {
    const { keyword, areas, industries } = params;
    
    // 检查是否至少有一个搜索条件
    const hasKeyword = keyword && keyword.trim().length > 0;
    const hasAreas = areas && areas.length > 0;
    const hasIndustries = industries && industries.length > 0;
    
    if (!hasKeyword && !hasAreas && !hasIndustries) {
      return {
        isValid: false,
        error: {
          type: SearchErrorType.VALIDATION_ERROR,
          message: '请选择至少一个筛选条件',
          timestamp: Date.now()
        }
      };
    }

    // 验证参数格式
    if (areas && !Array.isArray(areas)) {
      return {
        isValid: false,
        error: {
          type: SearchErrorType.VALIDATION_ERROR,
          message: '区域参数格式错误',
          timestamp: Date.now()
        }
      };
    }

    if (industries && !Array.isArray(industries)) {
      return {
        isValid: false,
        error: {
          type: SearchErrorType.VALIDATION_ERROR,
          message: '行业参数格式错误',
          timestamp: Date.now()
        }
      };
    }

    return { isValid: true };
  }

  /**
   * 格式化搜索参数确保正确传递
   */
  public formatSearchParams(params: any): {
    keyword?: string;
    area: string[];
    industry: string[];
    [key: string]: any;
  } {
    const formatted: any = {};

    // 处理关键词
    if (params.keyword && typeof params.keyword === 'string') {
      formatted.keyword = params.keyword.trim();
    }

    // 处理区域参数 - 确保数组格式
    if (params.areas || params.area || params.beijingDistricts) {
      const areas = params.areas || params.area || params.beijingDistricts;
      formatted.area = Array.isArray(areas) ? areas : [areas].filter(Boolean);
    } else {
      formatted.area = [];
    }

    // 处理行业参数 - 确保数组格式
    if (params.industries || params.industry) {
      const industries = params.industries || params.industry;
      formatted.industry = Array.isArray(industries) ? industries : [industries].filter(Boolean);
    } else {
      formatted.industry = [];
    }

    // 复制其他参数
    Object.keys(params).forEach(key => {
      if (!['keyword', 'areas', 'area', 'beijingDistricts', 'industries', 'industry'].includes(key)) {
        formatted[key] = params[key];
      }
    });

    return formatted;
  }

  /**
   * 清理过期的错误记录
   */
  private cleanupExpiredErrors(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.recentErrors.forEach((timestamp, key) => {
      if (now - timestamp > this.options.duplicateCheckWindow * 2) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.recentErrors.delete(key);
    });
  }

  /**
   * 检查是否为网络错误
   */
  private isNetworkError(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout') ||
      error.name === 'NetworkError' ||
      !navigator.onLine
    );
  }

  /**
   * 检查是否为参数验证错误
   */
  private isValidationError(error: any): boolean {
    return (
      error.type === 'VALIDATION_ERROR' ||
      error.message?.includes('validation') ||
      error.message?.includes('参数')
    );
  }

  /**
   * 重置错误状态
   */
  public reset(): void {
    this.recentErrors.clear();
  }
}

export default SearchErrorHandler;
