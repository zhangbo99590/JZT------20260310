/**
 * 注册表单组件
 * 创建时间: 2026-01-13
 * 功能: 处理用户注册表单逻辑
 */

import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  MobileOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { authService } from "../../../services/authService";
import { useCountdown } from "../../reset-password/hooks/useCountdown";
import {
  validationRules,
  fieldConfig,
  COUNTDOWN_SECONDS,
} from "../config/formConfig";
import { pageTexts } from "../config/contentConfig";
import type { RegisterFormValues } from "../types";

/**
 * 注册表单组件
 * 组件创建时间: 2026-01-13
 */
const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { countdown, startCountdown, isCountingDown } =
    useCountdown(COUNTDOWN_SECONDS);

  /**
   * 发送验证码处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue("phone");
      if (!phone) {
        message.error("请输入手机号");
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        message.error("手机号格式不正确");
        return;
      }

      // 先检查手机号是否已注册
      const checkResult = await authService.checkPhone(phone);
      if (checkResult.registered) {
        message.error("该手机号已注册，请直接登录");
        return;
      }

      // 发送验证码
      await authService.sendCode({ phone, type: "register" });
      message.success("验证码已发送");
      startCountdown();
    } catch (error: any) {
      message.error(error.message || "发送验证码失败，请稍后重试");
    }
  };

  /**
   * 注册处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleRegister = async (values: RegisterFormValues) => {
    if (!values.agreement) {
      message.error("请阅读并同意用户协议");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        phone: values.phone,
        code: values.code,
        password: values.password,
        inviteCode: values.inviteCode?.toUpperCase(),
      });

      message.success("注册成功，请登录");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      message.error(error.message || "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 确认密码验证规则
   * 规则创建时间: 2026-01-13
   */
  const confirmPasswordRules = [
    ...validationRules.confirmPwd,
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("两次输入的密码不一致"));
      },
    }),
  ];

  return (
    <div className="register-right">
      <div className="register-header">
        <h2>{pageTexts.header.title}</h2>
        <p>{pageTexts.header.subtitle}</p>
      </div>

      <Form
        form={form}
        onFinish={handleRegister}
        layout="vertical"
        requiredMark={false}
      >
        <div className="form-grid">
          <Form.Item
            name="phone"
            label={fieldConfig.phone.label}
            rules={validationRules.phone}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder={fieldConfig.phone.placeholder}
              maxLength={fieldConfig.phone.maxLength}
            />
          </Form.Item>

          <Form.Item
            name="code"
            label={fieldConfig.code.label}
            rules={validationRules.code}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder={fieldConfig.code.placeholder}
              maxLength={fieldConfig.code.maxLength}
              suffix={
                <Button
                  type="link"
                  disabled={isCountingDown}
                  onClick={handleSendCode}
                  style={{ padding: 0 }}
                >
                  {isCountingDown ? `${countdown}s` : "获取验证码"}
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={fieldConfig.password.label}
            rules={validationRules.password}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={fieldConfig.password.placeholder}
              maxLength={fieldConfig.password.maxLength}
            />
          </Form.Item>

          <Form.Item
            name="confirmPwd"
            label={fieldConfig.confirmPwd.label}
            dependencies={["password"]}
            rules={confirmPasswordRules}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={fieldConfig.confirmPwd.placeholder}
              maxLength={fieldConfig.confirmPwd.maxLength}
            />
          </Form.Item>
        </div>

        <Form.Item name="nickName" label={fieldConfig.nickName.label}>
          <Input
            prefix={<UserOutlined />}
            placeholder={fieldConfig.nickName.placeholder}
            maxLength={fieldConfig.nickName.maxLength}
          />
        </Form.Item>

        <div className="invite-section">
          <Form.Item name="inviteCode" label={fieldConfig.inviteCode.label}>
            <Input
              prefix={<TeamOutlined />}
              placeholder={fieldConfig.inviteCode.placeholder}
              maxLength={fieldConfig.inviteCode.maxLength}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
          <div className="invite-tip">{pageTexts.inviteTip}</div>
        </div>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>
            {pageTexts.agreement.text}{" "}
            <a href="javascript:void(0)">{pageTexts.agreement.userAgreement}</a>{" "}
            和{" "}
            <a href="javascript:void(0)">{pageTexts.agreement.privacyPolicy}</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            {pageTexts.submitButton}
          </Button>
        </Form.Item>
      </Form>

      <div className="register-footer">
        {pageTexts.footer.text}
        <a href={pageTexts.footer.linkUrl}>{pageTexts.footer.linkText}</a>
      </div>
    </div>
  );
};

export default RegisterForm;
