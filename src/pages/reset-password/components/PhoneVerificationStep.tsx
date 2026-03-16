/**
 * 手机验证步骤组件
 * 创建时间: 2026-01-13
 * 功能: 处理手机号验证和验证码发送
 */

import React from "react";
import { Form, Input, Button, message } from "antd";
import { MobileOutlined, SafetyOutlined } from "@ant-design/icons";
import { authService } from "../../../services/authService";
import { useCountdown } from "../hooks/useCountdown";
import { validationRules, COUNTDOWN_SECONDS } from "../config/stepConfig";
import type { FormInstance } from "antd";

interface PhoneVerificationStepProps {
  form: FormInstance;
  onNext: () => void;
  onPhoneChange: (phone: string) => void;
}

/**
 * 手机验证步骤组件
 * 组件创建时间: 2026-01-13
 */
const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  form,
  onNext,
  onPhoneChange,
}) => {
  const { countdown, startCountdown, isCountingDown } =
    useCountdown(COUNTDOWN_SECONDS);

  /**
   * 发送验证码处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleSendCode = async () => {
    try {
      const phoneValue = form.getFieldValue("phone");
      if (!phoneValue) {
        message.error("请输入手机号");
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phoneValue)) {
        message.error("手机号格式不正确");
        return;
      }

      // 检查手机号是否已注册
      const checkResult = await authService.checkPhone(phoneValue);
      if (!checkResult.registered) {
        message.error("该手机号未注册，请先注册");
        return;
      }

      // 发送验证码
      await authService.sendCode({ phone: phoneValue, type: "reset" });
      message.success("验证码已发送");
      startCountdown();
      onPhoneChange(phoneValue);
    } catch (error: any) {
      message.error(error.message || "发送验证码失败，请稍后重试");
    }
  };

  /**
   * 验证手机号和验证码
   * 函数创建时间: 2026-01-13
   */
  const handleVerifyCode = async () => {
    try {
      await form.validateFields(["phone", "code"]);
      onNext();
    } catch {
      // 表单验证失败
    }
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <Form.Item name="phone" label="手机号" rules={validationRules.phone}>
        <Input
          prefix={<MobileOutlined />}
          placeholder="请输入注册时的手机号"
          maxLength={11}
          size="large"
          autoComplete="tel"
        />
      </Form.Item>

      <Form.Item name="code" label="验证码" rules={validationRules.code}>
        <Input
          prefix={<SafetyOutlined />}
          placeholder="请输入验证码"
          maxLength={6}
          size="large"
          suffix={
            <Button
              type="link"
              disabled={isCountingDown}
              onClick={handleSendCode}
              style={{ padding: 0 }}
            >
              {isCountingDown ? `${countdown}s后重发` : "获取验证码"}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleVerifyCode} block size="large">
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PhoneVerificationStep;
