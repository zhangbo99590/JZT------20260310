/**
 * 统一错误处理工具
 * 提供错误捕获、日志记录、用户提示等功能
 */

import { message, notification } from "antd";

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = "NETWORK",
  API = "API",
  VALIDATION = "VALIDATION",
  PERMISSION = "PERMISSION",
  BUSINESS = "BUSINESS",
  UNKNOWN = "UNKNOWN",
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
  type: ErrorType;
  code?: string;
  details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: any,
  ) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.code = code;
    this.details = details;
  }
}

/**
 * 错误日志记录器
 */
class ErrorLogger {
  private logs: Array<{
    timestamp: number;
    error: Error | AppError;
    context?: any;
  }> = [];

  private maxLogs: number = 100;

  log(error: Error | AppError, context?: any) {
    this.logs.push({
      timestamp: Date.now(),
      error,
      context,
    });

    // 保持日志数量在限制内
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 在开发环境打印详细错误
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Log]", {
        message: error.message,
        type: (error as AppError).type,
        code: (error as AppError).code,
        details: (error as AppError).details,
        context,
        stack: error.stack,
      });
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }

  /**
   * 导出错误日志
   */
  export() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const errorLogger = new ErrorLogger();

/**
 * 错误处理器配置
 */
interface ErrorHandlerConfig {
  showMessage?: boolean;
  showNotification?: boolean;
  logError?: boolean;
  reportError?: boolean;
}

/**
 * 统一错误处理函数
 */
export function handleError(
  error: Error | AppError | any,
  config: ErrorHandlerConfig = {},
  context?: any,
): void {
  const {
    showMessage: shouldShowMessage = true,
    showNotification: shouldShowNotification = false,
    logError: shouldLog = true,
    reportError: shouldReport = false,
  } = config;

  // 转换为AppError
  let appError: AppError;
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(error.message, ErrorType.UNKNOWN);
  } else {
    appError = new AppError(String(error), ErrorType.UNKNOWN);
  }

  // 记录日志
  if (shouldLog) {
    errorLogger.log(appError, context);
  }

  // 显示用户提示
  if (shouldShowMessage) {
    const errorMessage = getErrorMessage(appError);
    message.error(errorMessage);
  }

  if (shouldShowNotification) {
    notification.error({
      message: "操作失败",
      description: getErrorMessage(appError),
      duration: 5,
    });
  }

  // 上报错误（可集成第三方监控服务）
  if (shouldReport) {
    reportErrorToService(appError, context);
  }
}

/**
 * 获取用户友好的错误消息
 */
function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return "网络连接失败，请检查网络设置";
    case ErrorType.API:
      return error.message || "API请求失败，请稍后重试";
    case ErrorType.VALIDATION:
      return error.message || "数据验证失败，请检查输入";
    case ErrorType.PERMISSION:
      return "您没有权限执行此操作";
    case ErrorType.BUSINESS:
      return error.message || "业务处理失败";
    default:
      return error.message || "操作失败，请稍后重试";
  }
}

/**
 * 上报错误到监控服务
 */
function reportErrorToService(error: AppError, context?: any): void {
  // 这里可以集成第三方错误监控服务，如 Sentry
  if (process.env.NODE_ENV === "production") {
    // 示例：发送到后端API
    try {
      fetch("/api/error-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          type: error.type,
          code: error.code,
          details: error.details,
          context,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(() => {
        // 静默失败，不影响用户体验
      });
    } catch (e) {
      // 静默失败
    }
  }
}

/**
 * 异步函数错误包装器
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config?: ErrorHandlerConfig,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, config, { function: fn.name, args });
      throw error;
    }
  }) as T;
}

/**
 * React组件错误边界辅助函数
 */
export function logComponentError(
  error: Error,
  errorInfo: React.ErrorInfo,
): void {
  errorLogger.log(error, {
    componentStack: errorInfo.componentStack,
  });

  // 在生产环境上报错误
  if (process.env.NODE_ENV === "production") {
    reportErrorToService(
      new AppError(error.message, ErrorType.UNKNOWN),
      errorInfo,
    );
  }
}

/**
 * 网络请求错误处理
 */
export function handleNetworkError(error: any): AppError {
  if (!navigator.onLine) {
    return new AppError("网络连接已断开", ErrorType.NETWORK, "OFFLINE");
  }

  if (error.response) {
    // 服务器返回错误响应
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return new AppError(
          data?.message || "请求参数错误",
          ErrorType.VALIDATION,
          "BAD_REQUEST",
          data,
        );
      case 401:
        return new AppError(
          "未授权，请重新登录",
          ErrorType.PERMISSION,
          "UNAUTHORIZED",
        );
      case 403:
        return new AppError("没有权限访问", ErrorType.PERMISSION, "FORBIDDEN");
      case 404:
        return new AppError("请求的资源不存在", ErrorType.API, "NOT_FOUND");
      case 500:
        return new AppError(
          "服务器内部错误",
          ErrorType.API,
          "SERVER_ERROR",
          data,
        );
      case 503:
        return new AppError(
          "服务暂时不可用",
          ErrorType.API,
          "SERVICE_UNAVAILABLE",
        );
      default:
        return new AppError(
          data?.message || `请求失败 (${status})`,
          ErrorType.API,
          `HTTP_${status}`,
          data,
        );
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return new AppError("网络请求超时", ErrorType.NETWORK, "TIMEOUT");
  } else {
    // 请求配置错误
    return new AppError(
      error.message || "请求配置错误",
      ErrorType.UNKNOWN,
      "REQUEST_ERROR",
    );
  }
}

/**
 * 表单验证错误处理
 */
export function handleValidationError(errors: Record<string, string[]>): void {
  const firstError = Object.values(errors)[0]?.[0];
  if (firstError) {
    message.error(firstError);
  }
}

/**
 * 业务错误处理
 */
export function createBusinessError(
  message: string,
  code?: string,
  details?: any,
): AppError {
  return new AppError(message, ErrorType.BUSINESS, code, details);
}

/**
 * 全局错误监听
 */
export function setupGlobalErrorHandlers(): void {
  // 捕获未处理的Promise rejection
  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    handleError(
      new AppError(
        event.reason?.message || String(event.reason),
        ErrorType.UNKNOWN,
      ),
      { showMessage: false, showNotification: true },
    );
  });

  // 捕获全局错误
  window.addEventListener("error", (event) => {
    event.preventDefault();
    handleError(
      new AppError(event.message, ErrorType.UNKNOWN),
      { showMessage: false, showNotification: true },
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    );
  });
}
