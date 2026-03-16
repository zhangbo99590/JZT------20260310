import React, { createContext, ReactNode } from "react";

/**
 * 认证上下文类型定义和 Hook
 *
 * @file auth.ts
 * @desc 定义用户角色、用户信息、认证上下文类型及相关常量
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 类型定义 ---
 * - UserRole: 用户角色类型枚举
 * - UserInfo: 用户信息接口
 * - AuthContextType: 认证上下文接口
 *
 * --- 常量定义 ---
 * - CONNECTION_ALLOWED_ROLES: 允许发起对接的角色列表
 *
 * --- 导出函数 ---
 * - useAuth: 认证上下文 Hook
 *
 * @warning useAuth 必须在 AuthProvider 内部使用
 */

/**
 * 用户角色类型
 */
export type UserRole =
  | "admin"
  | "enterprise_admin"
  | "business"
  | "viewer"
  | "guest";

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleType?: string;
  companyId: string;
  companyName: string;
  companyProfileScore: number;
  avatar?: string;
}

/**
 * 认证上下文类型接口
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  canInitiateConnection: () => { allowed: boolean; reason?: string };
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * 允许发起对接的角色列表
 *
 * @description
 * 定义哪些角色的用户可以发起企业对接请求。
 * 包括管理员、企业管理员和商务岗。
 */
export const CONNECTION_ALLOWED_ROLES: UserRole[] = [
  "admin",
  "enterprise_admin",
  "business",
];

/**
 * 认证上下文 Hook
 *
 * @returns AuthContextType 认证上下文值
 * @throws Error 当在 AuthProvider 外部使用时抛出错误
 *
 * @description
 * 用于在组件中访问认证上下文。必须在 AuthProvider 包裹的组件树中使用。
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, user, logout } = useAuth();
 *   // 使用认证上下文
 * }
 * ```
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
