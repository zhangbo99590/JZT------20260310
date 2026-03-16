/**
 * 导航工具函数
 * 
 * @file navigationUtils.ts
 * @desc 提供导航相关的工具函数，用于处理路由匹配、菜单状态同步等
 * @author 系统开发
 * @since 2026-03-03
 * @version 1.0.0
 */

/**
 * 标准化路径，移除末尾斜杠和处理查询参数
 * 
 * @param path - 原始路径
 * @returns 标准化后的路径
 */
export function normalizePath(path: string): string {
  // 移除末尾的斜杠（除非是根路径）
  const normalizedPath = path === '/' ? path : path.replace(/\/$/, '');
  return normalizedPath;
}

/**
 * 检查两个路径是否匹配
 * 
 * @param currentPath - 当前路径
 * @param targetPath - 目标路径
 * @param exact - 是否精确匹配
 * @returns 是否匹配
 */
export function isPathMatch(currentPath: string, targetPath: string, exact: boolean = false): boolean {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetPath);
  
  if (exact) {
    return normalizedCurrent === normalizedTarget;
  }
  
  return normalizedCurrent.startsWith(normalizedTarget);
}

/**
 * 从路径中提取路由参数
 * 
 * @param path - 包含参数的路径
 * @param pattern - 路由模式
 * @returns 提取的参数对象
 */
export function extractRouteParams(path: string, pattern: string): Record<string, string> {
  const pathSegments = path.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    
    if (patternSegment.startsWith(':') && pathSegment) {
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    }
  }
  
  return params;
}

/**
 * 获取查询参数对象
 * 
 * @param search - 查询字符串
 * @returns 查询参数对象
 */
export function getQueryParams(search: string = window.location.search): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * 构建完整的路径（包含查询参数）
 * 
 * @param pathname - 路径名
 * @param queryParams - 查询参数对象
 * @returns 完整路径
 */
export function buildFullPath(pathname: string, queryParams: Record<string, string> = {}): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * 检查是否为动态路由
 * 
 * @param path - 路径
 * @returns 是否为动态路由
 */
export function isDynamicRoute(path: string): boolean {
  return path.includes('/:') || /\/\d+/.test(path);
}

/**
 * 获取路由的基础路径（移除动态参数）
 * 
 * @param path - 完整路径
 * @returns 基础路径
 */
export function getBasePath(path: string): string {
  // 移除数字参数（如 /detail/123 -> /detail）
  const withoutNumericParams = path.replace(/\/\d+/g, '');
  
  // 移除查询参数
  const withoutQuery = withoutNumericParams.split('?')[0];
  
  return normalizePath(withoutQuery);
}

/**
 * 验证路由是否有效
 * 
 * @param path - 路径
 * @param validRoutes - 有效路由列表
 * @returns 是否有效
 */
export function isValidRoute(path: string, validRoutes: string[]): boolean {
  const basePath = getBasePath(path);
  
  return validRoutes.some(route => {
    if (route.includes(':')) {
      // 处理动态路由模式
      const routePattern = route.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(basePath);
    }
    
    return isPathMatch(basePath, route, true);
  });
}

/**
 * 获取面包屑路径数组
 * 
 * @param path - 当前路径
 * @returns 面包屑路径数组
 */
export function getBreadcrumbPaths(path: string): string[] {
  const segments = path.split('/').filter(Boolean);
  const paths: string[] = ['/'];
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    paths.push(currentPath);
  }
  
  return paths;
}

/**
 * 路由历史记录管理
 */
export class RouteHistory {
  private static instance: RouteHistory;
  private history: string[] = [];
  private maxSize: number = 10;
  
  static getInstance(): RouteHistory {
    if (!RouteHistory.instance) {
      RouteHistory.instance = new RouteHistory();
    }
    return RouteHistory.instance;
  }
  
  addRoute(path: string): void {
    // 避免重复添加相同路径
    if (this.history[this.history.length - 1] !== path) {
      this.history.push(path);
      
      // 保持历史记录大小限制
      if (this.history.length > this.maxSize) {
        this.history.shift();
      }
    }
  }
  
  getPreviousRoute(): string | null {
    return this.history.length > 1 ? this.history[this.history.length - 2] : null;
  }
  
  getHistory(): string[] {
    return [...this.history];
  }
  
  clear(): void {
    this.history = [];
  }
}
