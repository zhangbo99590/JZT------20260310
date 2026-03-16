import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop 组件
 *
 * @file ScrollToTop.tsx
 * @desc 路由切换时自动滚动到页面顶部的功能组件，监听路由路径变化并执行平滑滚动
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 自动监听路由路径变化
 * 2. 路由切换时平滑滚动到页面顶部
 * 3. 纯功能性组件，不渲染任何 DOM 元素
 *
 * --- 技术要点 ---
 * - 使用 react-router-dom 的 useLocation hook 获取当前路由路径
 * - 通过 useEffect 监听 pathname 变化触发滚动
 * - 滚动行为设置为 smooth 实现平滑过渡效果
 * - 组件返回 null，不产生任何 DOM 节点
 *
 * @usage 放置在路由配置的根节点，确保所有页面切换都会触发滚动
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
