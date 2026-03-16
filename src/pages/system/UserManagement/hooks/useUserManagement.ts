/**
 * UserManagement页面数据管理Hook
 * 创建时间: 2026-01-13
 * 功能: 管理用户列表数据的获取、分页和搜索
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import { userService } from "../../../../services/userService";
import { apiClient } from "../../../../services/apiClient";
import type { User, UserListParams, PaginationState } from "../types/index.ts";

/**
 * 用户管理数据Hook
 * Hook创建时间: 2026-01-13
 */
export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  // 分页状态
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 使用 ref 存储分页参数，避免 useCallback 依赖导致无限循环
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;

  // 查询参数
  const [searchParams] = useState<UserListParams>({});

  /**
   * 加载用户列表
   * 函数创建时间: 2026-01-13
   */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const currentPagination = paginationRef.current;
      const params: UserListParams = {
        pageNum: currentPagination.current,
        pageSize: currentPagination.pageSize,
        ...searchParams,
        username: searchText || undefined,
        status: status, // 添加状态过滤参数
      };

      const response = await userService.getUserList(params);

      // 空值保护：确保即使返回空数据也能正常处理
      setUsers(response.list ?? []);
      setPagination((prev) => ({
        ...prev,
        total: response.total ?? 0,
      }));
    } catch (error: any) {
      console.error("Failed to load users:", error);

      // 区分错误类型：无数据/无权限 vs 真正的接口错误
      const statusCode = error?.response?.status || error?.status;
      const errorCode = error?.code || error?.response?.data?.code;

      // 静默处理的情况：
      // - 404: 无数据
      // - 401: 认证失败（新用户可能暂无权限访问此接口）
      // - NO_DATA/EMPTY_RESULT: 业务码表示无数据
      const isSilentError =
        statusCode === 404 ||
        statusCode === 401 ||
        errorCode === 401 ||
        errorCode === "NO_DATA" ||
        errorCode === "EMPTY_RESULT";

      if (isSilentError) {
        // 无数据或无权限时设置空列表，不显示错误提示
        setUsers([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        return;
      }

      // 其他真正的错误才提示用户
      message.error("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  }, [searchParams, searchText, status]);

  // 初始加载和依赖变化时加载
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 分页变化时重新加载
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  /**
   * 处理搜索
   * 函数创建时间: 2026-01-13
   */
  const handleSearch = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  /**
   * 处理表格分页变化
   * 函数创建时间: 2026-01-13
   */
  const handleTableChange = useCallback(
    (paginationInfo: { current?: number; pageSize?: number }) => {
      setPagination((prev) => ({
        ...prev,
        current: paginationInfo.current || prev.current,
        pageSize: paginationInfo.pageSize || prev.pageSize,
      }));
    },
    [],
  );

  /**
   * 删除用户
   * 函数创建时间: 2026-01-13
   */
  const deleteUser = useCallback(
    async (userId: number) => {
      try {
        await userService.deleteUser(userId);
        message.success("删除成功");
        // 清除成员列表缓存，确保获取最新数据
        apiClient.clearCache("/qgb/portal/enterprise/members");
        loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        message.error("删除用户失败");
      }
    },
    [loadUsers],
  );

  /**
   * 获取用户详情
   * 函数创建时间: 2026-01-13
   */
  const getUserDetail = useCallback(
    async (userId: number): Promise<User | null> => {
      setLoading(true);
      try {
        const detailedUser = await userService.getUserDetail(userId);
        return detailedUser;
      } catch (error) {
        console.error("Failed to load user detail:", error);
        message.error("获取用户详情失败");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    users,
    loading,
    searchText,
    setSearchText,
    status,
    setStatus,
    pagination,
    loadUsers,
    handleSearch,
    handleTableChange,
    deleteUser,
    getUserDetail,
  };
}
