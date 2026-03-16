/**
 * UserManagement页面状态工具函数
 * 创建时间: 2026-01-13
 * 功能: 提供用户状态相关的工具函数
 */

import React from "react";
import { Tag } from "antd";
import type { StatusMap } from "../types/index.ts";

/**
 * 状态映射配置
 * 配置创建时间: 2026-01-13
 */
const STATUS_MAP: StatusMap = {
  ENABLE: { color: "success", text: "启用" },
  DISABLE: { color: "error", text: "禁用" },
  active: { color: "success", text: "启用" },
  inactive: { color: "error", text: "禁用" },
  // 后端返回的数字状态值映射（同时支持字符串和数字）
  "0": { color: "success", text: "启用" },
  "1": { color: "error", text: "禁用" },
};

/**
 * 获取状态标签组件
 * 函数创建时间: 2026-01-13
 * @param status - 用户状态
 * @returns 状态标签组件
 */
export function getStatusTag(status: string): React.ReactNode {
  const config = STATUS_MAP[status] || { color: "default", text: "未知" };
  return <Tag color={config.color}>{config.text}</Tag>;
}

/**
 * 获取性别显示文本
 * 函数创建时间: 2026-01-13
 * @param gender - 性别代码
 * @returns 性别显示文本
 */
export function getGenderText(gender?: string): string {
  switch (gender) {
    case "MALE":
      return "男";
    case "FEMALE":
      return "女";
    default:
      return "未知";
  }
}
