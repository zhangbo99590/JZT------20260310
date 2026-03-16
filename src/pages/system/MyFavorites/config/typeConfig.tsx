/**
 * 收藏类型配置
 * 创建时间: 2026-01-13
 */

import React from "react";
import { BookOutlined, SendOutlined, DollarOutlined } from "@ant-design/icons";
import type { FavoriteType, TypeConfig } from "../types/index.ts";

// 类型配置
export const typeConfig: Record<FavoriteType, TypeConfig> = {
  policy: {
    label: "政策",
    color: "blue",
    icon: <BookOutlined />,
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  opportunity: {
    label: "商机",
    color: "green",
    icon: <SendOutlined />,
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  financing: {
    label: "融资",
    color: "orange",
    icon: <DollarOutlined />,
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
  },
};

// 获取类型对应的头像背景色
export function getAvatarBgColor(type: FavoriteType): string {
  switch (type) {
    case "policy":
      return "#1890ff";
    case "opportunity":
      return "#52c41a";
    case "financing":
      return "#fa8c16";
    default:
      return "#1890ff";
  }
}
