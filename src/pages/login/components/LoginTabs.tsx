/**
 * 登录标签页组件
 * 创建时间: 2026-01-13
 * 功能: 渲染密码登录和验证码登录的标签页内容
 */

import React from "react";
import { Form, Input, Button } from "antd";
import {
  MobileOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { phoneRules, passwordRules, codeRules } from "../config/formConfig.ts";

interface LoginTabsProps {
  countdown: number;
  onSendCode: () => void;
}

/**
 * 登录标签页配置函数
 * 函数创建时间: 2026-01-13
 */
export function LoginTabs({ countdown, onSendCode }: LoginTabsProps) {
  return [
    {
      key: "password",
      label: "密码登录",
      children: (
        <>
          <Form.Item name="phone" rules={phoneRules}>
            <Input
              prefix={<MobileOutlined />}
              placeholder="请输入手机号"
              maxLength={11}
              size="large"
              autoComplete="tel"
            />
          </Form.Item>
          <Form.Item name="password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>
          <div className="forgot-pwd">
            <a href="/reset-password">忘记密码?</a>
          </div>
        </>
      ),
    },
    {
      key: "sms",
      label: "验证码登录",
      children: (
        <>
          <Form.Item name="phone" rules={phoneRules}>
            <Input
              prefix={<MobileOutlined />}
              placeholder="请输入手机号"
              maxLength={11}
              size="large"
              autoComplete="tel"
            />
          </Form.Item>
          <Form.Item name="code" rules={codeRules}>
            <Input
              prefix={<SafetyOutlined />}
              placeholder="请输入验证码"
              maxLength={6}
              size="large"
              suffix={
                <Button
                  type="link"
                  disabled={countdown > 0}
                  onClick={onSendCode}
                  style={{ padding: 0 }}
                >
                  {countdown > 0 ? `${countdown}s后重发` : "获取验证码"}
                </Button>
              }
            />
          </Form.Item>
          {/* 占位元素，保持与密码登录 Tab 高度一致 */}
          <div className="forgot-pwd" style={{ visibility: "hidden" }}>
            <span>占位</span>
          </div>
        </>
      ),
    },
  ];
}
