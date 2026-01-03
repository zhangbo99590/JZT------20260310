/**
 * 分页Hook
 * 统一处理分页逻辑
 */

import { useState, useMemo, useCallback } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export function usePagination<T>(
  data: T[],
  options: PaginationOptions = {}
) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);

  // 获取当前页数据
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  // 跳转到指定页
  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // 下一页
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // 上一页
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // 改变每页数量
  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // 重置到第一页
  }, []);

  // 重置分页
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems: data.length,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pageSizeOptions,
  };
}
