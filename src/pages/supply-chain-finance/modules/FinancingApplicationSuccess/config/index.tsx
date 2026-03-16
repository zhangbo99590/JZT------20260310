/**
 * 融资申请成功页面配置
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  CheckCircleOutlined,
  PhoneOutlined,
  FileTextOutlined,
  BankOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { NextStep, ContactInfo } from "../types";

// 后续流程配置
export const NEXT_STEPS: NextStep[] = [
  {
    time: "1个工作日内",
    content: "专业客户经理主动联系您，了解详细需求",
    icon: <PhoneOutlined style={{ color: "#1890ff" }} />,
  },
  {
    time: "2-3个工作日",
    content: "完成资料收集和初步评估",
    icon: <FileTextOutlined style={{ color: "#52c41a" }} />,
  },
  {
    time: "3-5个工作日",
    content: "出具融资方案，确定最终条件",
    icon: <BankOutlined style={{ color: "#faad14" }} />,
  },
  {
    time: "5-7个工作日",
    content: "完成审批流程，资金到账",
    icon: <CheckCircleOutlined style={{ color: "#f5222d" }} />,
  },
];

// 联系方式配置
export const CONTACT_INFO: ContactInfo[] = [
  {
    title: "客服热线",
    content: "400-888-9999",
    icon: <PhoneOutlined />,
    description: "工作时间：9:00-18:00",
  },
  {
    title: "在线客服",
    content: "璟智通官网在线咨询",
    icon: <MessageOutlined />,
    description: "7×24小时在线服务",
  },
  {
    title: "邮箱咨询",
    content: "service@jingzhitong.com",
    icon: <MailOutlined />,
    description: "24小时内回复",
  },
];

// 资金用途映射
export const PURPOSE_MAP: Record<string, string> = {
  equipment: "设备采购",
  "working-capital": "流动资金",
  expansion: "业务扩张",
  rd: "研发投入",
  other: "其他",
};

// 获取资金用途文本
export function getPurposeText(purpose: string): string {
  return PURPOSE_MAP[purpose] || "待确定";
}

// 生成处理步骤
export function getProcessSteps(currentStep: number) {
  return [
    {
      title: "申请提交",
      description: "您的申请已成功提交",
      status: "finish" as const,
      icon: <CheckCircleOutlined />,
    },
    {
      title: "初步审核",
      description: "系统正在进行初步审核",
      status: currentStep >= 1 ? ("finish" as const) : ("process" as const),
      icon: <FileTextOutlined />,
    },
    {
      title: "专员联系",
      description: "专业客户经理将主动联系您",
      status: currentStep >= 2 ? ("finish" as const) : ("wait" as const),
      icon: <CustomerServiceOutlined />,
    },
  ];
}
