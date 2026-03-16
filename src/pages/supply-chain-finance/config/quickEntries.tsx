/**
 * 供应链金融快捷入口配置文件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  FundOutlined,
  LineChartOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { QuickEntry } from "../types";

/**
 * 快捷入口配置数据
 * 配置更新时间: 2026-01-13
 * 维护说明: 新增功能模块时需要在此配置对应的入口
 */
export const quickEntries: QuickEntry[] = [
  {
    key: "financing-diagnosis",
    icon: <FundOutlined />,
    title: "融资诊断",
    description: "智能分析融资需求",
    path: "/supply-chain-finance/financing-diagnosis",
  },
  {
    key: "diagnosis-analysis",
    icon: <LineChartOutlined />,
    title: "诊断分析",
    description: "融资诊断深度分析",
    path: "/supply-chain-finance/diagnosis-analysis",
  },
  // {
  //   key: "data-visualization",
  //   icon: <BarChartOutlined />,
  //   title: "数据可视化",
  //   description: "数据图表可视化展示",
  //   path: "/supply-chain-finance/data-visualization", // 待开发
  // },
  // {
  //   key: "scheme-config",
  //   icon: <SettingOutlined />,
  //   title: "方案配置",
  //   description: "融资方案配置管理",
  //   // path: "/supply-chain-finance/scheme-config", // 待开发
  // },
];
