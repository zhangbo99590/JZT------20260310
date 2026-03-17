import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { getBreadcrumbItems } from "../../utils/breadcrumbConfig";

/**
 * BreadcrumbNav 面包屑导航组件
 *
 * @description
 * 根据当前路由自动生成面包屑导航。
 * 支持动态路由匹配和点击跳转。
 */
const BreadcrumbNav: React.FC = () => {
  const location = useLocation();

  // 根据当前路径获取面包屑配置
  const breadcrumbItems = useMemo(() => {
    return getBreadcrumbItems(location.pathname);
  }, [location.pathname]);

  // 如果没有面包屑配置或配置为空，则不渲染
  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  // 转换为 Ant Design Breadcrumb 需要的 items 格式
  const items = breadcrumbItems.map((item, index) => {
    const isLast = index === breadcrumbItems.length - 1;

    // 如果有路径且不是最后一项，则渲染为链接
    // 注意：最后一项通常是当前页，不需要点击跳转
    if (item.path && !isLast) {
      return {
        title: <Link to={item.path}>{item.title}</Link>,
      };
    }

    // 否则只渲染文本
    return {
      title: item.title,
    };
  });

  return (
    <Breadcrumb items={items} style={{ marginBottom: "16px" }} separator=">" />
  );
};

export default BreadcrumbNav;
