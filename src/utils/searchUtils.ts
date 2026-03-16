/**
 * 增强的通用搜索和过滤工具类
 * 用于减少各个服务中重复的搜索和过滤逻辑
 * 提供统一的搜索、过滤、排序和分页功能
 *
 * @module searchUtils
 */

/**
 * 搜索选项接口
 */
export interface SearchOptions<T> {
  keyword?: string;
  searchFields?: (keyof T)[];
  filters?: Partial<Record<keyof T, any>>;
  page?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortDirection?: "asc" | "desc";
  delay?: number;
  booleanSearch?: boolean;
  customFilter?: (item: T) => boolean;
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 对数组进行关键词搜索
 * @param items 要搜索的数组
 * @param keyword 关键词
 * @param searchFields 要搜索的字段数组
 * @param useBooleanSearch 是否使用布尔搜索
 * @returns 过滤后的数组
 */
export function searchByKeyword<T>(
  items: T[],
  keyword?: string,
  searchFields?: (keyof T)[],
  useBooleanSearch: boolean = false
): T[] {
  if (!keyword || keyword.trim() === "") {
    return items;
  }

  // 如果使用布尔搜索
  if (useBooleanSearch) {
    return items.filter((item) => {
      if (searchFields && searchFields.length > 0) {
        // 在指定字段中搜索
        return searchFields.some((field) => {
          const value = item[field];
          return (
            typeof value === "string" && matchesBooleanQuery(value, keyword)
          );
        });
      } else {
        // 在所有字段中搜索
        const allValues = Object.values(item).join(" ");
        return matchesBooleanQuery(allValues, keyword);
      }
    });
  }

  // 标准关键词搜索
  const searchTerms = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);
  if (searchTerms.length === 0) return items;

  return items.filter((item) => {
    // 所有搜索词都必须匹配
    return searchTerms.every((searchTerm) => {
      if (searchFields && searchFields.length > 0) {
        // 在指定字段中搜索
        return searchFields.some((field) => {
          const value = item[field];
          return matchValue(value, searchTerm);
        });
      } else {
        // 在所有字段中搜索
        return Object.values(item).some((value) =>
          matchValue(value, searchTerm)
        );
      }
    });
  });
}

/**
 * 辅助函数：匹配值是否包含搜索词
 */
function matchValue(value: any, searchTerm: string): boolean {
  if (typeof value === "string") {
    return value.toLowerCase().includes(searchTerm);
  } else if (typeof value === "number") {
    return value.toString().includes(searchTerm);
  } else if (Array.isArray(value)) {
    return value.some((v) => matchValue(v, searchTerm));
  } else if (value && typeof value === "object") {
    return Object.values(value).some((v) => matchValue(v, searchTerm));
  }
  return false;
}

/**
 * 按指定字段过滤数组
 * @param items 要过滤的数组
 * @param filters 过滤条件对象
 * @returns 过滤后的数组
 */
export function filterByFields<T>(
  items: T[],
  filters?: Partial<Record<keyof T, any>>
): T[] {
  if (!filters || Object.keys(filters).length === 0) {
    return items;
  }

  return items.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) {
        return true; // 跳过未定义的过滤条件
      }

      const itemValue = item[key as keyof T];

      if (Array.isArray(value)) {
        // 如果过滤值是数组，检查项目值是否在数组中
        return value.includes(itemValue);
      } else if (typeof value === "object" && value !== null) {
        // 处理范围过滤，如 { min: 10, max: 20 }
        if ("min" in value && "max" in value) {
          const numValue = Number(itemValue);
          return numValue >= Number(value.min) && numValue <= Number(value.max);
        }
        // 处理日期范围
        if ("startDate" in value && "endDate" in value) {
          const dateValue = new Date(itemValue as string);
          const startDate = new Date(value.startDate as string);
          const endDate = new Date(value.endDate as string);
          return dateValue >= startDate && dateValue <= endDate;
        }
      }

      // 默认等值比较
      return itemValue === value;
    });
  });
}

/**
 * 对数组进行排序
 * @param items 要排序的数组
 * @param sortBy 排序字段
 * @param direction 排序方向
 * @returns 排序后的数组
 */
export function sortArray<T>(
  items: T[],
  sortBy?: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    // 处理不同类型的值
    if (typeof valueA === "string" && typeof valueB === "string") {
      return direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === "asc"
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    // 默认比较
    const strA = String(valueA);
    const strB = String(valueB);
    return direction === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
}

/**
 * 对数组进行分页
 * @param items 要分页的数组
 * @param page 页码（从1开始）
 * @param pageSize 每页条数
 * @returns 分页后的数据和分页信息
 */
export function paginateArray<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResult<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = items.slice(start, end);

  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

/**
 * 模拟API延迟
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function simulateDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 通用搜索函数，结合关键词搜索、字段过滤、排序和分页
 * @param items 要搜索的数组
 * @param options 搜索选项
 * @returns 搜索结果和分页信息
 */
export async function searchItems<T>(
  items: T[],
  options: SearchOptions<T> = {}
): Promise<PaginatedResult<T>> {
  // 模拟API延迟
  if (options.delay !== undefined) {
    await simulateDelay(options.delay);
  }

  // 关键词搜索
  let result = searchByKeyword(
    items,
    options.keyword,
    options.searchFields,
    options.booleanSearch
  );

  // 字段过滤
  result = filterByFields(result, options.filters);

  // 自定义过滤
  if (options.customFilter) {
    result = result.filter(options.customFilter);
  }

  // 排序
  if (options.sortBy) {
    result = sortArray(result, options.sortBy, options.sortDirection);
  }

  // 分页
  return paginateArray(result, options.page, options.pageSize);
}

/**
 * 创建分组统计
 * @param items 数据项数组
 * @param groupBy 分组字段
 * @returns 分组统计结果
 */
export function createGroupStats<T>(
  items: T[],
  groupBy: keyof T
): Array<{ name: string; value: any; count: number; percentage: number }> {
  const groups = new Map<string, number>();
  const total = items.length;

  // 统计每个分组的数量
  items.forEach((item) => {
    const value = item[groupBy];
    const key = String(value);
    groups.set(key, (groups.get(key) || 0) + 1);
  });

  // 转换为数组格式
  return Array.from(groups.entries()).map(([key, count]) => ({
    name: key,
    value: key,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  }));
}

/**
 * 布尔检索解析 (支持 AND / OR / NOT 操作符)
 * @param text 要搜索的文本
 * @param query 布尔查询字符串
 * @returns 是否匹配
 */
export function matchesBooleanQuery(text: string, query: string): boolean {
  const source = text.toLowerCase();
  const tokens = query.trim().toLowerCase().split(/\s+/);

  // 初始评估从第一个词开始
  let result = false;
  let op: "AND" | "OR" = "AND";
  let negateNext = false;

  for (const tk of tokens) {
    if (tk === "and" || tk === "or") {
      op = tk.toUpperCase() as "AND" | "OR";
      continue;
    }

    if (tk === "not") {
      negateNext = true;
      continue;
    }

    const hit = source.includes(tk);
    const val = negateNext ? !hit : hit;
    negateNext = false;

    if (op === "AND") {
      result = result ? result && val : val; // 如果是第一个词，直接设置；否则进行AND运算
      if (!val) return false; // 短路求值，AND操作中任一词不匹配则整体不匹配
    } else {
      result = result || val; // OR操作
    }
  }

  return result;
}
