/**
 * LegalSupport页面功能模块配置
 * 创建时间: 2026-01-13
 * 功能: 定义法律护航页面的功能模块配置
 */

import React from "react";
import { message } from "antd";
import {
  SearchOutlined,
  BulbOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { FeatureCard } from "../types/index.ts";

/**
 * 功能模块配置
 * 配置创建时间: 2026-01-13
 */
export const featuresConfig: FeatureCard[] = [
  {
    icon: <SearchOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    title: "法规查询",
    description: "多维度法规库，整合国家、地方及行业全量法律法规",
    features: [
      "效力层级分类：法律/行政法规/部门规章",
      "领域分类：财税、劳动、知识产权、环保",
      "行业分类：制造、科技、服务等",
      "高级检索：关键词、条款号、发布机关",
    ],
    buttonText: "立即查询",
    onClick: () => message.info("该功能还在完善中"),
  },
  {
    icon: <BulbOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
    title: "智能法律解读",
    description: "专业法条场景化解析，用通俗语言解释法律条款",
    features: [
      "法条通俗化解释",
      "业务场景智能匹配",
      "政策申报指导",
      "合同签订建议",
      "用工管理提醒",
    ],
    buttonText: "智能解读",
    onClick: () => message.info("该功能还在完善中"),
  },
  {
    icon: (
      <ClockCircleOutlined style={{ fontSize: "32px", color: "#f5222d" }} />
    ),
    title: "时效性管理",
    description: "确保企业使用的法规均为最新有效版本",
    features: [
      "法规状态标注：生效/废止/修订",
      "自动预警机制",
      "新法规发布提醒",
      "旧法规变更通知",
      "版本控制管理",
    ],
    buttonText: "管理中心",
    onClick: () => message.info("该功能还在完善中"),
  },
];
