import React, { useState, useCallback, useEffect, ReactNode } from "react";
import { apiClient } from "../services/apiClient";
import {
  AuthContext,
  AuthContextType,
  UserInfo,
  UserRole,
  CONNECTION_ALLOWED_ROLES,
} from "./auth";

/**
 * AuthProvider 认证上下文提供者
 *
 * @file AuthContext.tsx
 * @desc 提供全局认证状态管理，包括用户登录、登出、角色验证等功能
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 管理用户认证状态（已登录/未登录）
 * 2. 存储和更新用户信息
 * 3. 提供登录、登出、刷新用户信息等方法
 * 4. 角色权限验证功能
 * 5. 企业对接权限验证（企业画像分数）
 *
 * --- 技术要点 ---
 * - 使用 React Context API 提供全局状态
 * - 使用 useCallback 优化回调函数性能
 * - localStorage 持久化用户数据
 * - apiClient 统一管理请求认证头
 * - 动态导入 authService 避免循环依赖
 *
 * @note 登录功能当前为占位实现，需要接入真实API
 * @warning 必须在应用根节点使用此Provider包裹
 */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const userInfoStr = localStorage.getItem("userInfo");
    const portalToken = localStorage.getItem("portalToken");

    if (portalToken) {
      apiClient.setAuthToken(portalToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as UserInfo;

        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          parsedUser.roleType = userInfo.roleType;
        }

        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * 用户登录
   *
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 登录是否成功
   *
   * @description
   * 执行用户登录操作，验证邮箱和密码。当前为占位实现，
   * 需要接入真实API。成功后更新用户状态和认证标记。
   *
   * @todo 接入真实登录API
   */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);

      setLoading(false);
      return false;
    },
    [],
  );

  /**
   * 用户登出
   *
   * @description
   * 执行用户登出操作，清除所有用户相关的本地存储数据和认证状态。
   * 同时清除 apiClient 的认证头。
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);

    apiClient.setAuthToken("");

    localStorage.removeItem("auth_user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("lastLoginTime");
    localStorage.removeItem("username");
    localStorage.removeItem("portalToken");
  }, []);

  /**
   * 刷新用户信息
   *
   * @description
   * 从服务器重新获取用户信息并更新本地状态。动态导入 authService
   * 避免循环依赖。更新用户信息包括角色、企业信息等。
   *
   * @note 企业画像分数当前固定为 100
   */
  const refreshUser = useCallback(async () => {
    try {
      const { authService, saveAuthState } =
        await import("../services/authService");
      const userInfo = await authService.getUserInfo();
      if (userInfo) {
        saveAuthState(userInfo);
        const updatedUser: UserInfo = {
          id: String(userInfo.userId),
          name: userInfo.nickName || "用户",
          phone: userInfo.phone,
          email: userInfo.email || "",
          role: userInfo.roleType === "0" ? "admin" : "viewer",
          roleType: userInfo.roleType,
          companyId: String(userInfo.enterpriseId),
          companyName: userInfo.enterpriseName,
          companyProfileScore: 100,
          avatar: userInfo.avatar,
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Refresh user info failed:", error);
    }
  }, []);

  /**
   * 检查用户是否具有指定角色
   *
   * @param requiredRoles - 需要的角色列表
   * @returns 是否具有任一所需角色
   *
   * @description
   * 检查当前用户的角色是否在所需角色列表中。用户未登录时返回 false。
   */
  const hasRole = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      if (!user) return false;
      return requiredRoles.includes(user.role);
    },
    [user],
  );

  /**
   * 检查用户是否可以发起企业对接
   *
   * @returns { allowed: boolean, reason?: string } 是否允许及原因
   *
   * @description
   * 检查用户是否满足发起企业对接的条件：
   * 1. 已登录
   * 2. 角色为 admin、enterprise_admin 或 business
   * 3. 企业画像完善度不低于 80%
   *
   * @note 企业画像分数阈值可根据实际需求调整
   */
  const canInitiateConnection = useCallback((): {
    allowed: boolean;
    reason?: string;
  } => {
    if (!isAuthenticated || !user) {
      return { allowed: false, reason: "请先登录后再发起对接" };
    }

    if (!CONNECTION_ALLOWED_ROLES.includes(user.role)) {
      return {
        allowed: false,
        reason: "仅企业管理员或商务岗可发起对接，请联系管理员获取权限",
      };
    }

    if (user.companyProfileScore < 80) {
      return {
        allowed: false,
        reason: `企业画像完善度不足（当前${user.companyProfileScore}%），请先完善企业信息后发起对接`,
      };
    }

    return { allowed: true };
  }, [isAuthenticated, user]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshUser,
    hasRole,
    canInitiateConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
