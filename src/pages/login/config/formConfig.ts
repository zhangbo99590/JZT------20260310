/**
 * Login页面表单配置
 * 创建时间: 2026-01-13
 * 功能: 定义登录表单验证规则和配置
 */

import { PHONE_REGEX, CODE_LENGTH } from "./constants.ts";

/**
 * 手机号验证规则
 * 规则定义时间: 2026-01-13
 */
export const phoneRules = [
  { required: true, message: "请输入手机号" },
  { pattern: PHONE_REGEX, message: "手机号格式不正确" },
];

/**
 * 密码验证规则
 * 规则定义时间: 2026-01-13
 */
export const passwordRules = [{ required: true, message: "请输入密码" }];

/**
 * 验证码验证规则
 * 规则定义时间: 2026-01-13
 */
export const codeRules = [
  { required: true, message: "请输入验证码" },
  { len: CODE_LENGTH, message: "验证码长度为6位" },
];
