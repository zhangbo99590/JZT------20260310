/**
 * UserManagement页面类型定义
 * 创建时间: 2026-01-13
 * 功能: 定义用户管理相关的TypeScript类型
 */

// 从服务层导入User类型
export type { User, UserListParams } from "../../../../services/userService";

/**
 * 分页状态类型
 * 类型定义时间: 2026-01-13
 */
export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

/**
 * 用户表单数据类型
 * 类型定义时间: 2026-01-13
 */
export interface UserFormData {
  username: string;
  email: string;
  roles: string; // 改为单选
  status: "0" | "1";
}

/**
 * 状态映射表类型
 * 类型定义时间: 2026-01-13
 */
export type StatusMap = Record<string, { color: string; text: string }>;
