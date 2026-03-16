/**
 * LegalSupport页面统计数据配置
 * 创建时间: 2026-01-13
 * 功能: 定义法律护航页面的统计数据配置
 */

import React from "react";
import {
  FileTextOutlined,
  AlertOutlined,
  BulbOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { StatisticItem } from "../types/index.ts";

/**
 * 统计数据配置
 * 配置创建时间: 2026-01-13
 */
export const statisticsConfig: StatisticItem[] = [
  {
    title: "法规总数",
    value: 15680,
    prefix: React.createElement(FileTextOutlined),
    color: "#1890ff",
  },
  {
    title: "今日更新",
    value: 23,
    prefix: React.createElement(AlertOutlined),
    color: "#52c41a",
  },
  {
    title: "智能解读",
    value: 1256,
    prefix: React.createElement(BulbOutlined),
    color: "#faad14",
  },
  {
    title: "预警提醒",
    value: 8,
    prefix: React.createElement(ClockCircleOutlined),
    color: "#f5222d",
  },
];
