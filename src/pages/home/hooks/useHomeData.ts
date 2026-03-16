/**
 * 首页数据管理Hook
 * 创建时间: 2026-01-13
 * 更新时间: 2026-02-26
 * 功能: 管理首页数据的获取和状态，支持加载状态和错误处理
 */

import { useState, useEffect, useCallback } from "react";
import { HomeData } from "../types/index.ts";
import { defaultHomeData } from "../config/homeDataConfig.tsx";

/**
 * 首页数据Hook
 * Hook创建时间: 2026-01-13
 */
export const useHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData>(defaultHomeData);

  /**
   * 获取首页数据
   * 函数创建时间: 2026-01-13
   * 更新时间: 2026-02-26
   */
  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 模拟API请求，实际项目中应调用真实接口
      // const data = await apiClient.get("/home/data");
      // setHomeData(data);

      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 模拟API请求成功（实际项目中应使用真实数据）
      setHomeData((prev) => ({
        ...prev,
        // 可以在这里更新一些动态数据
        dataOverview: prev.dataOverview.map(item => ({
          ...item,
          value: item.value + Math.floor(Math.random() * 5) - 2, // 模拟数据变化
        }))
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "获取首页数据失败";
      console.error("获取首页数据失败:", error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载数据
  useEffect(() => {
    fetchHomeData().catch(() => {
      // 错误已经在fetchHomeData中处理了
    });
  }, [fetchHomeData]);

  return {
    loading,
    error,
    homeData,
    fetchHomeData,
  };
};
