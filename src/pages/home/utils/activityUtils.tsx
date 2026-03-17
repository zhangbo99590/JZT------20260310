/**
 * Home页面活动相关工具函数
 * 创建时间: 2026-01-13
 * 功能: 处理活动相关的工具函数
 */

import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

/**
 * 获取活动图标
 * 函数创建时间: 2026-01-13
 */
export const getActivityIcon = (
  type: string,
  status: string,
): React.ReactNode => {
  if (type === "result") {
    return status === "success" ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : (
      <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
    );
  } else if (type === "policy") {
    return <NotificationOutlined style={{ color: "#1890ff" }} />;
  } else {
    return <ClockCircleOutlined style={{ color: "#fa8c16" }} />;
  }
};

/**
 * 获取活动标签颜色
 * 函数创建时间: 2026-01-13
 */
export const getActivityTagColor = (status: string): string => {
  const colorMap = {
    success: "success",
    info: "blue",
    warning: "warning",
    error: "error",
  };
  return colorMap[status as keyof typeof colorMap] || "default";
};
