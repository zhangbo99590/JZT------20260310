import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

/**
 * FrozenAccountPage 账号冻结页面
 *
 * @file FrozenAccountPage.tsx
 * @desc 账号被冻结时的提示页面，提供退出登录功能
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 显示账号冻结警告信息
 * 2. 提供退出登录按钮
 * 3. 清除本地存储的用户数据
 * 4. 重定向到登录页面
 *
 * --- 技术要点 ---
 * - 使用 useNavigate 进行路由跳转
 * - 清除 localStorage 中的用户数据
 * - Flexbox 布局实现居中显示
 * - 使用警告图标（⚠️）和红色主题
 *
 * @usage 当检测到用户账号状态为 frozen 时，显示此页面
 */

const FrozenAccountPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          textAlign: "center",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{ fontSize: "48px", marginBottom: "20px", color: "#ff4d4f" }}
        >
          ⚠️
        </div>
        <h2 style={{ marginBottom: "16px", color: "#333" }}>账号已被冻结</h2>
        <p style={{ marginBottom: "24px", color: "#666", lineHeight: "1.5" }}>
          您的账号因违反系统规定已被冻结，请联系管理员了解详情。
        </p>
        <Button type="primary" onClick={handleLogout} style={{ width: "100%" }}>
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default FrozenAccountPage;
