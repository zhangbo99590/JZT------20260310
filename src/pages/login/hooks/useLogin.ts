/**
 * 登录业务逻辑Hook
 * 创建时间: 2026-01-13
 * 功能: 管理登录相关的业务逻辑和状态
 */

import { useState } from "react";
import { Form, message } from "antd";
import {
  authService,
  saveAuthState,
  LoginResponse,
} from "../../../services/authService";
import { useCountdown } from "../../reset-password/hooks/useCountdown.ts";
import { LoginFormValues, LoginType } from "../types/index.ts";
import { PHONE_REGEX, COUNTDOWN_SECONDS } from "../config/constants.ts";

/**
 * 登录业务逻辑Hook
 * Hook创建时间: 2026-01-13
 */
export const useLogin = () => {
  const [loginType, setLoginType] = useState<LoginType>("password");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { countdown, startCountdown } = useCountdown(COUNTDOWN_SECONDS);

  /**
   * 发送验证码
   * 函数创建时间: 2026-01-13
   */
  const handleSendCode = async (): Promise<void> => {
    try {
      const phone = form.getFieldValue("phone");
      if (!phone) {
        message.error("请输入手机号");
        return;
      }
      if (!PHONE_REGEX.test(phone)) {
        message.error("手机号格式不正确");
        return;
      }

      // 发送验证码 API 调用
      await authService.sendCode({ phone, type: "login" });

      message.success("验证码已发送");
      startCountdown();
    } catch (error: any) {
      message.error(error.message || "发送验证码失败，请稍后重试");
    }
  };

  /**
   * 登录处理
   * 函数创建时间: 2026-01-13
   */
  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    setLoading(true);
    try {
      let result: LoginResponse;

      if (loginType === "sms") {
        // 验证码登录
        if (!values.code) {
          message.error("请输入验证码");
          setLoading(false);
          return;
        }
        result = await authService.loginByCode({
          phone: values.phone,
          code: values.code,
        });
      } else {
        // 密码登录
        if (!values.password) {
          message.error("请输入密码");
          setLoading(false);
          return;
        }
        result = await authService.login({
          phone: values.phone,
          password: values.password,
        });
      }

      if (result?.token) {
        // 保存登录状态
        saveAuthState(result);
        // 直接跳转，无需成功提示（跳转本身就是成功的反馈）
        window.location.href = "/";
      } else {
        message.error("登录失败");
      }
    } catch (error: any) {
      message.error(error.message || "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return {
    loginType,
    setLoginType,
    loading,
    countdown,
    form,
    handleSendCode,
    handleLogin,
  };
};
