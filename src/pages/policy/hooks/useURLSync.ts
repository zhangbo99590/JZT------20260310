/**
 * URL参数同步Hook
 * 支持筛选条件和搜索状态与URL参数的双向同步
 * 实现分享链接和刷新后状态恢复功能
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export interface URLSyncState {
  keyword?: string;
  districts?: string[];
  industries?: string[];
  levels?: string[];
  categories?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  tab?: string;
}

export interface UseURLSyncOptions {
  onStateChange?: (state: URLSyncState) => void;
  debounceMs?: number;
}

export const useURLSync = (options: UseURLSyncOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { onStateChange, debounceMs = 300 } = options;

  // 从URL参数解析状态
  const parseStateFromURL = useCallback((): URLSyncState => {
    const state: URLSyncState = {};
    
    // 解析关键词
    const keyword = searchParams.get('keyword');
    if (keyword) state.keyword = decodeURIComponent(keyword);
    
    // 解析区域数组
    const districts = searchParams.get('districts');
    if (districts) {
      state.districts = districts.split(',').map(d => decodeURIComponent(d)).filter(Boolean);
    }
    
    // 解析行业数组
    const industries = searchParams.get('industries');
    if (industries) {
      state.industries = industries.split(',').map(i => decodeURIComponent(i)).filter(Boolean);
    }
    
    // 解析级别数组
    const levels = searchParams.get('levels');
    if (levels) {
      state.levels = levels.split(',').map(l => decodeURIComponent(l)).filter(Boolean);
    }
    
    // 解析类别数组
    const categories = searchParams.get('categories');
    if (categories) {
      state.categories = categories.split(',').map(c => decodeURIComponent(c)).filter(Boolean);
    }
    
    // 解析分页参数
    const page = searchParams.get('page');
    if (page && !isNaN(Number(page))) {
      state.page = Number(page);
    }
    
    const pageSize = searchParams.get('pageSize');
    if (pageSize && !isNaN(Number(pageSize))) {
      state.pageSize = Number(pageSize);
    }
    
    // 解析排序参数
    const sortBy = searchParams.get('sortBy');
    if (sortBy) state.sortBy = sortBy;
    
    // 解析Tab参数
    const tab = searchParams.get('tab');
    if (tab) state.tab = tab;
    
    return state;
  }, [searchParams]);

  // 当前URL状态
  const currentState = useMemo(() => parseStateFromURL(), [parseStateFromURL]);

  // 更新URL参数
  const updateURL = useCallback((newState: Partial<URLSyncState>, replace: boolean = false) => {
    const params = new URLSearchParams(searchParams);
    
    // 更新关键词
    if (newState.keyword !== undefined) {
      if (newState.keyword && newState.keyword.trim()) {
        params.set('keyword', encodeURIComponent(newState.keyword.trim()));
      } else {
        params.delete('keyword');
      }
    }
    
    // 更新区域数组
    if (newState.districts !== undefined) {
      if (newState.districts && newState.districts.length > 0) {
        params.set('districts', newState.districts.map(d => encodeURIComponent(d)).join(','));
      } else {
        params.delete('districts');
      }
    }
    
    // 更新行业数组
    if (newState.industries !== undefined) {
      if (newState.industries && newState.industries.length > 0) {
        params.set('industries', newState.industries.map(i => encodeURIComponent(i)).join(','));
      } else {
        params.delete('industries');
      }
    }
    
    // 更新级别数组
    if (newState.levels !== undefined) {
      if (newState.levels && newState.levels.length > 0) {
        params.set('levels', newState.levels.map(l => encodeURIComponent(l)).join(','));
      } else {
        params.delete('levels');
      }
    }
    
    // 更新类别数组
    if (newState.categories !== undefined) {
      if (newState.categories && newState.categories.length > 0) {
        params.set('categories', newState.categories.map(c => encodeURIComponent(c)).join(','));
      } else {
        params.delete('categories');
      }
    }
    
    // 更新分页参数
    if (newState.page !== undefined) {
      if (newState.page && newState.page > 1) {
        params.set('page', String(newState.page));
      } else {
        params.delete('page');
      }
    }
    
    if (newState.pageSize !== undefined) {
      if (newState.pageSize && newState.pageSize !== 10) {
        params.set('pageSize', String(newState.pageSize));
      } else {
        params.delete('pageSize');
      }
    }
    
    // 更新排序参数
    if (newState.sortBy !== undefined) {
      if (newState.sortBy && newState.sortBy !== 'default') {
        params.set('sortBy', newState.sortBy);
      } else {
        params.delete('sortBy');
      }
    }
    
    // 更新Tab参数
    if (newState.tab !== undefined) {
      if (newState.tab && newState.tab !== 'all') {
        params.set('tab', newState.tab);
      } else {
        params.delete('tab');
      }
    }
    
    // 更新URL
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    
    if (newSearch !== currentSearch) {
      if (replace) {
        setSearchParams(params, { replace: true });
      } else {
        setSearchParams(params);
      }
    }
  }, [searchParams, setSearchParams]);

  // 清空所有参数
  const clearURL = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // 生成分享链接
  const generateShareLink = useCallback((state?: Partial<URLSyncState>) => {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    const finalState = state ? { ...currentState, ...state } : currentState;
    
    if (finalState.keyword) {
      params.set('keyword', encodeURIComponent(finalState.keyword));
    }
    if (finalState.districts && finalState.districts.length > 0) {
      params.set('districts', finalState.districts.map(d => encodeURIComponent(d)).join(','));
    }
    if (finalState.industries && finalState.industries.length > 0) {
      params.set('industries', finalState.industries.map(i => encodeURIComponent(i)).join(','));
    }
    if (finalState.levels && finalState.levels.length > 0) {
      params.set('levels', finalState.levels.map(l => encodeURIComponent(l)).join(','));
    }
    if (finalState.categories && finalState.categories.length > 0) {
      params.set('categories', finalState.categories.map(c => encodeURIComponent(c)).join(','));
    }
    if (finalState.page && finalState.page > 1) {
      params.set('page', String(finalState.page));
    }
    if (finalState.pageSize && finalState.pageSize !== 10) {
      params.set('pageSize', String(finalState.pageSize));
    }
    if (finalState.sortBy && finalState.sortBy !== 'default') {
      params.set('sortBy', finalState.sortBy);
    }
    if (finalState.tab && finalState.tab !== 'all') {
      params.set('tab', finalState.tab);
    }
    
    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [currentState]);

  // 检查是否有筛选条件
  const hasFilters = useMemo(() => {
    return !!(
      currentState.keyword ||
      (currentState.districts && currentState.districts.length > 0) ||
      (currentState.industries && currentState.industries.length > 0) ||
      (currentState.levels && currentState.levels.length > 0) ||
      (currentState.categories && currentState.categories.length > 0)
    );
  }, [currentState]);

  // 监听URL变化并通知状态变化
  useEffect(() => {
    if (onStateChange) {
      const timeoutId = setTimeout(() => {
        onStateChange(currentState);
      }, debounceMs);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentState, onStateChange, debounceMs]);

  // 浏览器前进后退处理
  useEffect(() => {
    const handlePopState = () => {
      // 当用户点击浏览器前进后退按钮时，重新解析URL状态
      const newState = parseStateFromURL();
      if (onStateChange) {
        onStateChange(newState);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseStateFromURL, onStateChange]);

  return {
    currentState,
    updateURL,
    clearURL,
    generateShareLink,
    hasFilters,
    // 便捷方法
    setKeyword: (keyword: string) => updateURL({ keyword }),
    setDistricts: (districts: string[]) => updateURL({ districts }),
    setIndustries: (industries: string[]) => updateURL({ industries }),
    setLevels: (levels: string[]) => updateURL({ levels }),
    setCategories: (categories: string[]) => updateURL({ categories }),
    setPage: (page: number) => updateURL({ page }),
    setPageSize: (pageSize: number) => updateURL({ pageSize }),
    setSortBy: (sortBy: string) => updateURL({ sortBy }),
    setTab: (tab: string) => updateURL({ tab }),
    // 批量更新
    updateFilters: (filters: Partial<URLSyncState>) => updateURL(filters),
    // 重置到第一页
    resetPage: () => updateURL({ page: 1 }),
  };
};
