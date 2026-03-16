import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

/**
 * PermissionDeniedPage 权限不足页面
 *
 * @file PermissionDeniedPage.tsx
 * @desc 用户权限不足时的提示页面，提供返回上一页功能
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 显示权限不足警告信息
 * 2. 提供返回上一页按钮
 * 3. 引导用户联系管理员获取权限
 *
 * --- 技术要点 ---
 * - 使用 useNavigate 进行路由导航
 * - navigate(-1) 返回上一页
 * - Flexbox 布局实现居中显示
 * - 使用禁止图标（🚫）和橙色主题
 *
 * @usage 当用户尝试访问无权限的页面时，显示此页面
 */

const PermissionDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
          style={{ fontSize: "48px", marginBottom: "20px", color: "#faad14" }}
        >
          🚫
        </div>
        <h2 style={{ marginBottom: "16px", color: "#333" }}>权限不足</h2>
        <p style={{ marginBottom: "24px", color: "#666", lineHeight: "1.5" }}>
          您没有访问该页面的权限，请联系管理员获取相应权限。
        </p>
        <Button type="primary" onClick={handleBack} style={{ width: "100%" }}>
          返回上一页
        </Button>
      </div>
    </div>
  );
};

export default PermissionDeniedPage;
