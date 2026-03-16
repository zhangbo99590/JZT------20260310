/**
 * 筛选管理Hook - 添加筛选条件的持久化和重置功能
 * 实现实时筛选结果反馈
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import FilterService from '../services/filterService';
import SearchErrorHandler from '../services/searchErrorHandler';
import { searchPolicies, SearchParams } from '../services/mockPolicyAPI';
import { 
  FilterState, 
  FilterCondition, 
  FilterResult, 
  PolicyItem,
  FilterType,
  FilterEventType,
  FilterPersistenceConfig,
  FilterPerformanceMetrics
} from '../types/filterTypes';

interface UseFilterManagerOptions {
  persistenceConfig?: FilterPersistenceConfig;
  autoSave?: boolean;
  debounceMs?: number;
  enablePerformanceMonitoring?: boolean;
}

interface FilterManagerState {
  filterState: FilterState;
  searchResults: FilterResult | null;
  isSearching: boolean;
  performanceMetrics: FilterPerformanceMetrics;
  hasUnsavedChanges: boolean;
}

const DEFAULT_PERSISTENCE_CONFIG: FilterPersistenceConfig = {
  storageKey: 'policy_filter_state',
  expireTime: 24 * 60 * 60 * 1000, // 24小时
  includeResults: false,
  compression: true
};

export const useFilterManager = (
  policies: PolicyItem[],
  options: UseFilterManagerOptions = {}
) => {
  const {
    persistenceConfig = DEFAULT_PERSISTENCE_CONFIG,
    autoSave = true,
    debounceMs = 300,
    enablePerformanceMonitoring = true
  } = options;

  const filterService = useRef(FilterService.getInstance());
  const errorHandler = useRef(SearchErrorHandler.getInstance());
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const [state, setState] = useState<FilterManagerState>({
    filterState: filterService.current.getFilterState(),
    searchResults: null,
    isSearching: false,
    performanceMetrics: filterService.current.getPerformanceMetrics(),
    hasUnsavedChanges: false
  });

  /**
   * 加载持久化的筛选条件
   */
  const loadPersistedFilters = useCallback(() => {
    try {
      const stored = localStorage.getItem(persistenceConfig.storageKey);
      if (!stored) return;

      const data = JSON.parse(stored);
      
      // 检查过期时间
      if (Date.now() - data.timestamp > persistenceConfig.expireTime) {
        localStorage.removeItem(persistenceConfig.storageKey);
        return;
      }

      // 恢复筛选条件
      if (data.conditions && Array.isArray(data.conditions)) {
        data.conditions.forEach((condition: FilterCondition) => {
          filterService.current.addCondition({
            type: condition.type,
            value: condition.value,
            label: condition.label,
            operator: condition.operator,
            isActive: condition.isActive,
            priority: condition.priority
          });
        });
        
        message.success('已恢复上次的筛选条件');
      }
    } catch (error) {
      console.error('Failed to load persisted filters:', error);
      localStorage.removeItem(persistenceConfig.storageKey);
    }
  }, [persistenceConfig]);

  /**
   * 保存筛选条件到本地存储
   */
  const saveFiltersToStorage = useCallback(() => {
    if (!autoSave) return;

    try {
      const currentState = filterService.current.getFilterState();
      const dataToSave = {
        conditions: currentState.conditions,
        timestamp: Date.now(),
        version: '1.0'
      };

      // 避免使用state.searchResults，直接从service获取
      if (persistenceConfig.includeResults) {
        const currentResults = filterService.current.getLastSearchResults?.() || null;
        if (currentResults) {
          dataToSave.results = currentResults;
        }
      }

      const serialized = JSON.stringify(dataToSave);
      
      // 可选的压缩处理
      if (persistenceConfig.compression && serialized.length > 1024) {
        localStorage.setItem(persistenceConfig.storageKey, serialized);
      } else {
        localStorage.setItem(persistenceConfig.storageKey, serialized);
      }

      // 使用函数式更新避免依赖state
      setState(prev => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      console.error('Failed to save filters:', error);
      message.error('保存筛选条件失败');
    }
  }, [autoSave, persistenceConfig]); // 移除state.searchResults依赖

  /**
   * 防抖保存
   */
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveFiltersToStorage();
    }, 1000);
  }, [saveFiltersToStorage]);

  /**
   * 执行搜索
   */
  const executeSearch = useCallback(async () => {
    if (state.isSearching) return;
    
    setState(prev => ({ ...prev, isSearching: true }));
    
    const startTime = performance.now();
    
    try {
      // 构建搜索参数
      const searchParams: SearchParams = {
        keyword: '',
        districts: [],
        industries: [],
        levels: [],
        categories: [],
        page: 1,
        pageSize: 20,
        sortBy: 'default'
      };
      
      // 从筛选条件中提取参数
      state.filterState.conditions.forEach(condition => {
        switch (condition.type) {
          case FilterType.KEYWORD:
            searchParams.keyword = String(condition.value);
            break;
          case FilterType.DISTRICT:
            searchParams.districts = Array.isArray(condition.value) ? condition.value : [condition.value];
            break;
          case FilterType.INDUSTRY:
            searchParams.industries = Array.isArray(condition.value) ? condition.value : [condition.value];
            break;
          case FilterType.LEVEL:
            searchParams.levels = Array.isArray(condition.value) ? condition.value : [condition.value];
            break;
          case FilterType.CATEGORY:
            searchParams.categories = Array.isArray(condition.value) ? condition.value : [condition.value];
            break;
        }
      });
      
      // 使用新的模拟API执行搜索
      const result = await searchPolicies(searchParams);
      
      // 转换结果格式以兼容现有接口
      const transformedResult = {
        total: result.total,
        items: result.items.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          district: item.district,
          industry: item.industry,
          level: item.level,
          publishDate: item.publishDate,
          matchScore: item.matchScore || 0
        })),
        facets: Object.entries(result.facets).map(([key, values]) => ({
          field: key,
          values: Object.entries(values).map(([value, count]) => ({
            value,
            count,
            selected: false
          }))
        })),
        executionTime: result.executionTime,
        hasMore: result.hasMore
      };
      
      // 更新搜索结果
      setState(prev => ({
        ...prev,
        searchResults: transformedResult,
        isSearching: false,
        performanceMetrics: filterService.current.getPerformanceMetrics()
      }));

      // 性能监控
      if (enablePerformanceMonitoring && performance.now() - startTime > 1000) {
        console.warn(`Slow filter execution: ${performance.now() - startTime}ms`);
      }

      // 触发保存
      if (autoSave) {
        debouncedSave();
      }

    } catch (error) {
      console.error('Search execution failed:', error);
      setState(prev => ({ ...prev, isSearching: false }));
      
      // 使用错误处理器解析错误
      const parsedError = errorHandler.current.parseError(error);
      
      // 检查是否应该显示错误（防重复）
      if (errorHandler.current.shouldShowError(parsedError)) {
        message.error(parsedError.message);
      }
    }
  }, [policies, debounceMs, enablePerformanceMonitoring, autoSave, debouncedSave]);

  /**
   * 添加筛选条件
   */
  const addFilter = useCallback((condition: Omit<FilterCondition, 'id'>) => {
    try {
      const conditionId = filterService.current.addCondition(condition);
      
      setState(prev => ({
        ...prev,
        filterState: filterService.current.getFilterState(),
        hasUnsavedChanges: true
      }));

      return conditionId;
    } catch (error) {
      console.error('Failed to add filter:', error);
      message.error('添加筛选条件失败');
      return null;
    }
  }, []);

  /**
   * 移除筛选条件
   */
  const removeFilter = useCallback((conditionId: string) => {
    try {
      const success = filterService.current.removeCondition(conditionId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          filterState: filterService.current.getFilterState(),
          hasUnsavedChanges: true
        }));
      }

      return success;
    } catch (error) {
      console.error('Failed to remove filter:', error);
      message.error('移除筛选条件失败');
      return false;
    }
  }, []);

  /**
   * 更新筛选条件
   */
  const updateFilter = useCallback((conditionId: string, updates: Partial<FilterCondition>) => {
    try {
      const success = filterService.current.updateCondition(conditionId, updates);
      
      if (success) {
        setState(prev => ({
          ...prev,
          filterState: filterService.current.getFilterState(),
          hasUnsavedChanges: true
        }));
      }

      return success;
    } catch (error) {
      console.error('Failed to update filter:', error);
      message.error('更新筛选条件失败');
      return false;
    }
  }, []);

  /**
   * 重置所有筛选条件
   */
  const resetFilters = useCallback(() => {
    try {
      filterService.current.resetFilters();
      
      setState(prev => ({
        ...prev,
        filterState: filterService.current.getFilterState(),
        searchResults: null,
        hasUnsavedChanges: true
      }));

      // 清除本地存储
      localStorage.removeItem(persistenceConfig.storageKey);
      
      message.success('已重置所有筛选条件');
    } catch (error) {
      console.error('Failed to reset filters:', error);
      message.error('重置筛选条件失败');
    }
  }, [persistenceConfig.storageKey]);

  /**
   * 手动保存筛选条件
   */
  const saveFilters = useCallback(() => {
    saveFiltersToStorage();
    message.success('筛选条件已保存');
  }, [saveFiltersToStorage]);

  /**
   * 获取筛选统计信息
   */
  const getFilterStats = useCallback(() => {
    const currentState = filterService.current.getFilterState();
    const activeConditions = currentState.conditions.filter(c => c.isActive);
    
    return {
      totalConditions: currentState.conditions.length,
      activeConditions: activeConditions.length,
      resultCount: state.searchResults?.total || 0,
      lastUpdated: currentState.lastUpdated,
      hasResults: !!state.searchResults,
      isLoading: state.isSearching
    };
  }, [state.searchResults, state.isSearching]);

  /**
   * 批量操作筛选条件
   */
  const batchUpdateFilters = useCallback((operations: Array<{
    action: 'add' | 'remove' | 'update';
    conditionId?: string;
    condition?: Omit<FilterCondition, 'id'>;
    updates?: Partial<FilterCondition>;
  }>) => {
    try {
      operations.forEach(op => {
        switch (op.action) {
          case 'add':
            if (op.condition) {
              filterService.current.addCondition(op.condition);
            }
            break;
          case 'remove':
            if (op.conditionId) {
              filterService.current.removeCondition(op.conditionId);
            }
            break;
          case 'update':
            if (op.conditionId && op.updates) {
              filterService.current.updateCondition(op.conditionId, op.updates);
            }
            break;
        }
      });

      setState(prev => ({
        ...prev,
        filterState: filterService.current.getFilterState(),
        hasUnsavedChanges: true
      }));

      message.success(`批量操作完成，共处理 ${operations.length} 个操作`);
    } catch (error) {
      console.error('Batch update failed:', error);
      message.error('批量操作失败');
    }
  }, []);

  /**
   * 导出筛选配置
   */
  const exportFilterConfig = useCallback(() => {
    try {
      const currentState = filterService.current.getFilterState();
      const config = {
        conditions: currentState.conditions,
        timestamp: Date.now(),
        version: '1.0',
        metadata: {
          totalResults: state.searchResults?.total || 0,
          executionTime: state.searchResults?.executionTime || 0
        }
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filter-config-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      message.success('筛选配置已导出');
    } catch (error) {
      console.error('Export failed:', error);
      message.error('导出失败');
    }
  }, [state.searchResults]);

  /**
   * 导入筛选配置
   */
  const importFilterConfig = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        
        if (config.conditions && Array.isArray(config.conditions)) {
          // 重置现有筛选条件
          filterService.current.resetFilters();
          
          // 导入新的筛选条件
          config.conditions.forEach((condition: FilterCondition) => {
            filterService.current.addCondition({
              type: condition.type,
              value: condition.value,
              label: condition.label,
              operator: condition.operator,
              isActive: condition.isActive,
              priority: condition.priority
            });
          });
          
          setState(prev => ({
            ...prev,
            filterState: filterService.current.getFilterState(),
            hasUnsavedChanges: true
          }));
          
          message.success('筛选配置已导入');
        } else {
          throw new Error('Invalid config format');
        }
      } catch (error) {
        console.error('Import failed:', error);
        message.error('导入失败，请检查文件格式');
      }
    };
    
    reader.readAsText(file);
  }, []);

  // 事件监听器设置
  useEffect(() => {
    const handleConditionChanged = () => {
      setState(prev => ({
        ...prev,
        filterState: filterService.current.getFilterState(),
        hasUnsavedChanges: true
      }));
    };

    // 注册事件监听器 - 移除会导致循环的SEARCH_EXECUTED监听
    filterService.current.addEventListener(FilterEventType.CONDITION_ADDED, handleConditionChanged);
    filterService.current.addEventListener(FilterEventType.CONDITION_REMOVED, handleConditionChanged);
    filterService.current.addEventListener(FilterEventType.CONDITION_UPDATED, handleConditionChanged);

    return () => {
      // 清理事件监听器
      filterService.current.removeEventListener(FilterEventType.CONDITION_ADDED, handleConditionChanged);
      filterService.current.removeEventListener(FilterEventType.CONDITION_REMOVED, handleConditionChanged);
      filterService.current.removeEventListener(FilterEventType.CONDITION_UPDATED, handleConditionChanged);
    };
  }, []); // 移除executeSearch依赖

  // 初始化加载
  useEffect(() => {
    let mounted = true;
    
    const initializeFilters = async () => {
      try {
        loadPersistedFilters();
      } catch (error) {
        console.error('Failed to initialize filters:', error);
      }
    };
    
    if (mounted) {
      initializeFilters();
    }
    
    return () => {
      mounted = false;
    };
  }, []); // 只在组件挂载时执行一次

  // 清理资源
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // 状态
    filterState: state.filterState,
    searchResults: state.searchResults,
    isSearching: state.isSearching,
    performanceMetrics: state.performanceMetrics,
    hasUnsavedChanges: state.hasUnsavedChanges,
    
    // 操作方法
    addFilter,
    removeFilter,
    updateFilter,
    resetFilters,
    saveFilters,
    executeSearch,
    
    // 批量操作
    batchUpdateFilters,
    
    // 导入导出
    exportFilterConfig,
    importFilterConfig,
    
    // 统计信息
    getFilterStats
  };
};
