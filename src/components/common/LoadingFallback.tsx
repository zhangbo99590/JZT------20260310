import React from "react";
import { Spin } from "antd";

/**
 * LoadingFallback 加载中占位组件
 *
 * @file LoadingFallback.tsx
 * @desc 全局加载状态占位组件，用于在异步加载过程中显示加载动画
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 显示居中的加载动画
 * 2. 展示"加载中..."提示文字
 * 3. 占满整个视口高度
 *
 * --- 技术要点 ---
 * - 使用 Ant Design 的 Spin 组件
 * - 尺寸设置为 large
 * - Flexbox 布局实现居中显示
 * - 纯展示组件，无状态管理
 *
 * @usage 用于路由懒加载、异步组件加载等场景的加载占位
 */

const LoadingFallback: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    <Spin size="large" />
    <div style={{ marginTop: 16, color: "#666" }}>加载中...</div>
  </div>
);

export default LoadingFallback;
