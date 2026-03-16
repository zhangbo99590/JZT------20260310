/**
 * 同步状态工具函数
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { SyncStatus } from "../types/index.ts";

// 获取同步状态图标
export function getSyncStatusIcon(status: SyncStatus): React.ReactNode {
  switch (status) {
    case "success":
      return React.createElement(CheckCircleOutlined, {
        style: { color: "#52c41a" },
      });
    case "syncing":
      return React.createElement(SyncOutlined, {
        spin: true,
        style: { color: "#1890ff" },
      });
    case "failed":
      return React.createElement(ExclamationCircleOutlined, {
        style: { color: "#ff4d4f" },
      });
    default:
      return null;
  }
}

// 获取同步状态文案
export function getSyncStatusText(status: SyncStatus): string {
  switch (status) {
    case "success":
      return "已同步";
    case "syncing":
      return "同步中";
    case "failed":
      return "同步失败";
    default:
      return "未知";
  }
}
