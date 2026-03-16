import React from "react";

/**
 * PageWrapper 页面容器组件
 *
 * @file PageWrapper.tsx
 * @desc 统一的页面容器组件，提供一致的页面布局和背景样式
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 提供统一的页面背景和最小高度
 * 2. 支持模块类型标识（legal、policy、system、industry、finance）
 * 3. 支持自定义样式和类名
 * 4. 统一的内边距布局
 *
 * --- 技术要点 ---
 * - 使用 React.FC 函数式组件
 * - 定义明确的 TypeScript 接口（PageWrapperProps）
 * - 默认背景色为 #f5f5f5
 * - 最小高度设置为 100vh 确保全屏显示
 * - 默认内边距为 24px
 *
 * @usage 用于包裹页面内容，确保所有页面具有统一的视觉风格
 */

interface PageWrapperProps {
  children: React.ReactNode;
  module?: "legal" | "policy" | "system" | "industry" | "finance";
  className?: string;
  style?: React.CSSProperties;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  module,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        ...style,
      }}
    >
      <div style={{ padding: "0 24px 24px 24px" }}>{children}</div>
    </div>
  );
};

export default PageWrapper;
