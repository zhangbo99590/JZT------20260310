/**
 * 筛选服务 - 核心筛选逻辑处理
 * 优化查找算法以支持多条件组合查询
 */

import {
  FilterState,
  FilterCondition,
  FilterResult,
  PolicyItem,
  FilterType,
  FilterOperator,
  FilterPerformanceMetrics,
  FilterEvent,
  FilterEventType,
} from "../types/filterTypes";

class FilterService {
  private static instance: FilterService;
  private filterState: FilterState;
  private performanceMetrics: FilterPerformanceMetrics;
  private eventListeners: Map<FilterEventType, Function[]> = new Map();
  private cache: Map<string, FilterResult> = new Map();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.filterState = {
      conditions: [],
      isLoading: false,
      hasError: false,
      lastUpdated: Date.now(),
    };

    this.performanceMetrics = {
      queryTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      errorRate: 0,
    };
  }

  public static getInstance(): FilterService {
    if (!FilterService.instance) {
      FilterService.instance = new FilterService();
    }
    return FilterService.instance;
  }

  /**
   * 添加筛选条件
   */
  public addCondition(condition: Omit<FilterCondition, "id">): string {
    const startTime = performance.now();

    try {
      const id = this.generateConditionId();
      const newCondition: FilterCondition = {
        ...condition,
        id,
        isActive: true,
      };

      // 验证筛选条件
      if (!this.validateCondition(newCondition)) {
        throw new Error(`Invalid filter condition: ${condition.type}`);
      }

      // 检查是否已存在相同类型的条件
      const existingIndex = this.filterState.conditions.findIndex(
        (c) => c.type === condition.type && c.value === condition.value,
      );

      if (existingIndex >= 0) {
        // 更新现有条件
        this.filterState.conditions[existingIndex] = newCondition;
      } else {
        // 添加新条件
        this.filterState.conditions.push(newCondition);
      }

      this.filterState.lastUpdated = Date.now();

      // 触发事件
      this.emitEvent(FilterEventType.CONDITION_ADDED, {
        condition: newCondition,
      });

      // 自动执行搜索（防抖）
      this.debouncedSearch();

      return id;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    } finally {
      this.updatePerformanceMetrics("queryTime", performance.now() - startTime);
    }
  }

  /**
   * 移除筛选条件
   */
  public removeCondition(conditionId: string): boolean {
    const startTime = performance.now();

    try {
      const index = this.filterState.conditions.findIndex(
        (c) => c.id === conditionId,
      );

      if (index >= 0) {
        const removedCondition = this.filterState.conditions.splice(
          index,
          1,
        )[0];
        this.filterState.lastUpdated = Date.now();

        // 触发事件
        this.emitEvent(FilterEventType.CONDITION_REMOVED, {
          condition: removedCondition,
        });

        // 自动执行搜索
        this.debouncedSearch();

        return true;
      }

      return false;
    } catch (error) {
      this.handleError(error as Error);
      return false;
    } finally {
      this.updatePerformanceMetrics("queryTime", performance.now() - startTime);
    }
  }

  /**
   * 更新筛选条件
   */
  public updateCondition(
    conditionId: string,
    updates: Partial<FilterCondition>,
  ): boolean {
    const startTime = performance.now();

    try {
      const index = this.filterState.conditions.findIndex(
        (c) => c.id === conditionId,
      );

      if (index >= 0) {
        const oldCondition = { ...this.filterState.conditions[index] };
        this.filterState.conditions[index] = {
          ...this.filterState.conditions[index],
          ...updates,
        };

        // 验证更新后的条件
        if (!this.validateCondition(this.filterState.conditions[index])) {
          // 回滚更改
          this.filterState.conditions[index] = oldCondition;
          throw new Error(`Invalid condition update: ${conditionId}`);
        }

        this.filterState.lastUpdated = Date.now();

        // 触发事件
        this.emitEvent(FilterEventType.CONDITION_UPDATED, {
          oldCondition,
          newCondition: this.filterState.conditions[index],
        });

        // 自动执行搜索
        this.debouncedSearch();

        return true;
      }

      return false;
    } catch (error) {
      this.handleError(error as Error);
      return false;
    } finally {
      this.updatePerformanceMetrics("queryTime", performance.now() - startTime);
    }
  }

  /**
   * 重置所有筛选条件
   */
  public resetFilters(): void {
    const startTime = performance.now();

    try {
      const oldConditions = [...this.filterState.conditions];
      this.filterState.conditions = [];
      this.filterState.lastUpdated = Date.now();
      this.filterState.resultCount = undefined;

      // 清除缓存
      this.cache.clear();

      // 触发事件
      this.emitEvent(FilterEventType.FILTERS_RESET, { oldConditions });
    } catch (error) {
      this.handleError(error as Error);
    } finally {
      this.updatePerformanceMetrics("queryTime", performance.now() - startTime);
    }
  }

  /**
   * 执行筛选搜索
   */
  public async executeSearch(policies: PolicyItem[]): Promise<FilterResult> {
    const startTime = performance.now();

    try {
      this.filterState.isLoading = true;
      this.filterState.hasError = false;

      // 生成缓存键
      const cacheKey = this.generateCacheKey();

      // 检查缓存
      if (this.cache.has(cacheKey)) {
        const cachedResult = this.cache.get(cacheKey)!;
        this.updateCacheHitRate(true);
        return cachedResult;
      }

      this.updateCacheHitRate(false);

      // 执行筛选逻辑
      const filteredPolicies = this.applyFilters(policies);

      // 计算匹配分数
      const scoredPolicies = this.calculateMatchScores(filteredPolicies);

      // 排序结果
      const sortedPolicies = this.sortResults(scoredPolicies);

      // 生成分面统计
      const facets = this.generateFacets(policies, filteredPolicies);

      const result: FilterResult = {
        total: sortedPolicies.length,
        items: sortedPolicies,
        facets,
        executionTime: performance.now() - startTime,
        hasMore: false,
      };

      // 缓存结果
      this.cache.set(cacheKey, result);

      // 更新状态
      this.filterState.resultCount = result.total;

      // 触发事件
      this.emitEvent(FilterEventType.RESULTS_LOADED, { result });

      return result;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    } finally {
      this.filterState.isLoading = false;
      this.updatePerformanceMetrics("queryTime", performance.now() - startTime);
    }
  }

  /**
   * 应用筛选条件
   */
  private applyFilters(policies: PolicyItem[]): PolicyItem[] {
    if (this.filterState.conditions.length === 0) {
      return policies;
    }

    return policies.filter((policy) => {
      return this.filterState.conditions.every((condition) => {
        if (!condition.isActive) return true;

        return this.matchCondition(policy, condition);
      });
    });
  }

  /**
   * 匹配单个筛选条件
   */
  private matchCondition(policy: any, condition: FilterCondition): boolean {
    try {
      const { type, value, operator = FilterOperator.EQUALS } = condition;

      // 特殊处理：关键词搜索
      if (type === FilterType.KEYWORD) {
        const searchFields = [
          policy.title || "",
          policy.summary || "",
          policy.content || "",
          policy.district || "",
          policy.region || "",
          policy.industry || "",
          policy.category || "",
          policy.department || "",
          policy.policyOrg || "",
          policy.subsidyType || "",
          (policy.tags || []).join(" "),
        ]
          .join(" ")
          .toLowerCase();

        const keyword = value.toString().toLowerCase();
        return searchFields.includes(keyword);
      }

      // 获取政策对应字段值
      let policyValue: any;

      switch (type) {
        case FilterType.DISTRICT:
          policyValue = policy.district || policy.region;
          break;
        case FilterType.INDUSTRY:
          policyValue = policy.industry || policy.category;
          break;
        case FilterType.LEVEL:
          policyValue = policy.level;
          break;
        case FilterType.ORG_TYPE:
          policyValue = policy.orgType;
          break;
        case FilterType.POLICY_ORG:
          policyValue = policy.policyOrg || policy.department;
          break;
        case FilterType.SUBSIDY_TYPE:
          policyValue = policy.subsidyType;
          break;
        default:
          return true;
      }

      // 应用操作符
      switch (operator) {
        case FilterOperator.EQUALS:
          return Array.isArray(value)
            ? value.includes(policyValue)
            : policyValue === value;

        case FilterOperator.CONTAINS:
          return (
            policyValue &&
            policyValue
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
          );

        case FilterOperator.IN:
          return Array.isArray(value) && value.includes(policyValue);

        default:
          return true;
      }
    } catch (error) {
      console.error("Error matching condition:", error, condition);
      return false;
    }
  }

  /**
   * 计算匹配分数
   */
  private calculateMatchScores(policies: PolicyItem[]): PolicyItem[] {
    return policies.map((policy) => {
      let score = 0;
      let matchedConditions = 0;

      this.filterState.conditions.forEach((condition) => {
        if (condition.isActive && this.matchCondition(policy, condition)) {
          score += condition.priority || 1;
          matchedConditions++;
        }
      });

      return {
        ...policy,
        matchScore:
          this.filterState.conditions.length > 0
            ? (matchedConditions / this.filterState.conditions.length) * 100
            : 100,
      };
    });
  }

  /**
   * 排序结果
   */
  private sortResults(policies: PolicyItem[]): PolicyItem[] {
    return policies.sort((a, b) => {
      // 首先按匹配分数排序
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      // 然后按发布日期排序
      return (
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    });
  }

  /**
   * 生成分面统计
   */
  private generateFacets(
    allPolicies: PolicyItem[],
    filteredPolicies: PolicyItem[],
  ): any[] {
    // 这里可以实现分面统计逻辑
    return [];
  }

  /**
   * 验证筛选条件
   */
  private validateCondition(condition: FilterCondition): boolean {
    if (!condition.type || !condition.value) {
      return false;
    }

    // 根据类型进行特定验证
    switch (condition.type) {
      case FilterType.DISTRICT:
      case FilterType.INDUSTRY:
        return Array.isArray(condition.value)
          ? condition.value.length > 0
          : condition.value.toString().length > 0;
      default:
        return true;
    }
  }

  /**
   * 防抖搜索
   */
  private debouncedSearch(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.emitEvent(FilterEventType.SEARCH_EXECUTED, {
        conditions: this.filterState.conditions,
      });
    }, 300);
  }

  /**
   * 生成条件ID
   */
  private generateConditionId(): string {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(): string {
    const conditionsStr = JSON.stringify(
      this.filterState.conditions
        .filter((c) => c.isActive)
        .sort((a, b) => a.type.localeCompare(b.type)),
    );

    return btoa(conditionsStr).replace(/[^a-zA-Z0-9]/g, "");
  }

  /**
   * 更新性能指标
   */
  private updatePerformanceMetrics(
    metric: keyof FilterPerformanceMetrics,
    value: number,
  ): void {
    this.performanceMetrics[metric] = value;
  }

  /**
   * 更新缓存命中率
   */
  private updateCacheHitRate(isHit: boolean): void {
    // 简化的命中率计算
    const currentRate = this.performanceMetrics.cacheHitRate;
    this.performanceMetrics.cacheHitRate = isHit
      ? Math.min(currentRate + 0.1, 1)
      : Math.max(currentRate - 0.05, 0);
  }

  /**
   * 错误处理
   */
  private handleError(error: Error): void {
    this.filterState.hasError = true;
    this.filterState.errorMessage = error.message;
    this.performanceMetrics.errorRate += 0.1;

    this.emitEvent(FilterEventType.ERROR_OCCURRED, { error });

    console.error("FilterService Error:", error);
  }

  /**
   * 事件发射器
   */
  private emitEvent(type: FilterEventType, payload: any): void {
    const event: FilterEvent = {
      type,
      payload,
      timestamp: Date.now(),
      source: "FilterService",
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Event listener error:", error);
      }
    });
  }

  /**
   * 添加事件监听器
   */
  public addEventListener(type: FilterEventType, listener: Function): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    this.eventListeners.get(type)!.push(listener);
  }

  /**
   * 移除事件监听器
   */
  public removeEventListener(type: FilterEventType, listener: Function): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 获取当前筛选状态
   */
  public getFilterState(): FilterState {
    return { ...this.filterState };
  }

  /**
   * 获取性能指标
   */
  public getPerformanceMetrics(): FilterPerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.cache.clear();
    this.eventListeners.clear();
  }
}

export default FilterService;
