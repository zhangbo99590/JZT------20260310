/**
 * Login页面类型定义
 * 创建时间: 2026-01-13
 * 功能: 定义登录相关的TypeScript类型
 */

/**
 * 登录表单数据类型
 * 类型定义时间: 2026-01-13
 */
export interface LoginFormValues {
  phone: string;
  password?: string;
  code?: string;
}

/**
 * 登录方式类型
 * 类型定义时间: 2026-01-13
 */
export type LoginType = "password" | "sms";
