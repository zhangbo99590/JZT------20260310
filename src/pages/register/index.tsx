/**
 * 注册页面主组件
 * 创建时间: 2026-01-13
 * 功能: 用户注册页面主入口
 */

import React from "react";
import { PlatformIntro, RegisterForm } from "./components";
import "./styles/register.css";

/**
 * 注册页面主组件
 * 最后更新时间: 2026-01-13
 */
const Register: React.FC = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        {/* 平台介绍 - 拆分时间: 2026-01-13  */}
        <PlatformIntro />

        {/* 注册表单 - 拆分时间: 2026-01-13  */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
