/**
 * LegalSupport页面快速入口配置
 * 创建时间: 2026-01-13
 * 功能: 定义法律护航页面的快速入口配置
 */

import React from "react";
import { message } from "antd";
import {
  SearchOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { QuickEntry } from "../types/index.ts";

/**
 * 创建快速入口配置
 * 函数创建时间: 2026-01-13
 */
export function createQuickEntriesConfig(
  handleNavigate: (path: string) => void,
): QuickEntry[] {
  return [
    {
      icon: <SearchOutlined />,
      text: "法规搜索",
      onClick: () => handleNavigate("/legal-support/regulation-query"),
    },
    {
      icon: <BulbOutlined />,
      text: "AI解读",
      onClick: () => message.info("该功能还在完善中"),
    },
    {
      icon: <ClockCircleOutlined />,
      text: "时效管理",
      onClick: () => message.info("该功能还在完善中"),
    },
    {
      icon: <AlertOutlined />,
      text: "预警中心",
      onClick: () => message.info("该功能还在完善中"),
    },
  ];
}
