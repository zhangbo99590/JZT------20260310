/**
 * 登录页面主组件
 * 创建时间: 2026-01-13
 * 功能: 用户登录页面，支持密码登录和验证码登录
 */

import React, { useEffect } from "react";
import { Form, Button, Tabs } from "antd";
import { useLogin } from "./hooks/useLogin.ts";
import { LoginTabs } from "./components/LoginTabs.tsx";
import { LoginLeft } from "./components/LoginLeft.tsx";
import "./styles/login.css";

/**
 * 登录页面组件
 * 组件创建时间: 2026-01-13
 */
const Login: React.FC = () => {
  const {
    loginType,
    setLoginType,
    loading,
    countdown,
    form,
    handleSendCode,
    handleLogin,
  } = useLogin();

  // 检查登录状态
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      window.location.href = "/";
    }
  }, []);

  const tabItems = LoginTabs({ countdown, onSendCode: handleSendCode });

  return (
    <div className="login-container">
      <div className="login-box">
        <LoginLeft />
        <div className="login-right">
          <div className="login-header">
            <h2>欢迎登录</h2>
            <p>登录您的门户账号，开启企业服务之旅</p>
          </div>
          <Form form={form} onFinish={handleLogin} size="large">
            <Tabs
              activeKey={loginType}
              onChange={(key) => setLoginType(key as "password" | "sms")}
              items={tabItems}
              centered
            />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
          <div className="login-footer">
            还没有账号？<a href="/register">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
