/**
 * Home页面数据配置
 * 创建时间: 2026-01-13
 * 功能: 定义首页的静态数据配置
 */

import React from "react";
import {
  FileTextOutlined,
  FormOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  AuditOutlined,
  CalculatorOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { HomeData } from "../types/index.ts";

/**
 * 首页默认数据配置
 * 配置创建时间: 2026-01-13
 */
export const defaultHomeData: HomeData = {
  dataOverview: [
    {
      title: "政策总数",
      value: 128,
      growth: 15,
      growthRate: "+13.3%",
      icon: <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      color: "#1890ff",
      description: "可申请政策",
    },
    {
      title: "申报项目",
      value: 23,
      growth: 5,
      growthRate: "+27.8%",
      icon: <FormOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      color: "#52c41a",
      description: "当前申报中",
    },
    {
      title: "补贴金额",
      value: 2450000,
      growth: 1180000,
      growthRate: "+118.5%",
      icon: <DollarOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      color: "#722ed1",
      description: "累计获得补贴",
      prefix: "¥",
    },
    {
      title: "申报通过率",
      value: 85.6,
      growth: 3.2,
      growthRate: "+3.9%",
      icon: <PercentageOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
      color: "#fa8c16",
      description: "当前通过率",
      suffix: "%",
    },
  ],
  quickActions: [
    {
      title: "政策中心",
      description: "浏览最新政策，智能匹配推荐",
      icon: <BankOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
      color: "#1890ff",
      path: "/policy-center",
      bgColor: "#e6f7ff",
    },
    {
      title: "申报管理",
      description: "提交申报材料，跟踪审核进度",
      icon: <AuditOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      color: "#52c41a",
      path: "/policy-center/application-management",
      bgColor: "#f6ffed",
    },
    {
      title: "金融服务",
      description: "融资诊断，供应链金融服务",
      icon: <CalculatorOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
      color: "#722ed1",
      path: "/supply-chain-finance",
      bgColor: "#f9f0ff",
    },
    {
      title: "法律护航",
      description: "AI智能问答，法规查询服务",
      icon: <SafetyOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
      color: "#fa8c16",
      path: "/legal-support",
      bgColor: "#fff7e6",
    },
  ],
  recentActivities: [
    {
      id: 1,
      title: "技术创新补贴申报结果",
      description: "恭喜！您的技术创新补贴申报已通过审核",
      amount: "50万元",
      status: "success",
      time: "2小时前",
      type: "result",
    },
    {
      id: 2,
      title: "2024年小微企业税收优惠政策更新",
      description: "新政策已发布，建议及时了解相关优惠条件",
      status: "info",
      time: "1天前",
      type: "policy",
    },
    {
      id: 3,
      title: "财务报表补充材料待办",
      description: "请在3个工作日内补充完善相关财务材料",
      status: "warning",
      time: "2天前",
      type: "todo",
    },
  ],
  importantReminders: [
    {
      id: 1,
      title: "申报截止提醒",
      content: "中小企业技术创新补贴申报剩余 3 天",
      type: "deadline",
      urgency: "high",
      action: "立即申报",
    },
    {
      id: 2,
      title: "政策匹配推荐",
      content: "基于您的企业画像，为您推荐了 5 项适合的政策",
      type: "recommendation",
      urgency: "medium",
      action: "查看详情",
    },
  ],
};
