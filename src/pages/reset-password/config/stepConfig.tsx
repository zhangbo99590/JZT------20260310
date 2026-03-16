/**
 * 重置密码步骤配置文件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  MobileOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { StepConfig } from "../types";

/**
 * 重置密码流程步骤配置
 * 配置更新时间: 2026-01-13
 */
export const resetSteps: StepConfig[] = [
  {
    title: "验证手机",
    icon: <MobileOutlined />,
  },
  {
    title: "设置新密码",
    icon: <LockOutlined />,
  },
  {
    title: "完成",
    icon: <CheckCircleOutlined />,
  },
];

/**
 * 表单验证规则配置
 * 配置更新时间: 2026-01-13
 */
export const validationRules = {
  phone: [
    { required: true, message: "请输入手机号" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
  ],
  code: [
    { required: true, message: "请输入验证码" },
    { len: 6, message: "验证码长度为6位" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码" },
    { min: 6, max: 20, message: "密码长度6-20个字符" },
  ],
  confirmPassword: [{ required: true, message: "请确认新密码" }],
};

/**
 * 倒计时配置
 */
export const COUNTDOWN_SECONDS = 60;
