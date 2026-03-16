import React, { Suspense, useMemo, useCallback, useState, useEffect } from "react";
import { Routes, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import LoadingFallback from "../components/common/LoadingFallback";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
import { useAuth } from "../context/auth";
import {
  getMenuItems,
  getDefaultOpenKeys,
  getSelectedKeys,
} from "../config/menuConfig";
import { RouteHistory } from "../utils/navigationUtils";
import styles from "./MainLayout.module.css";
import {
  homeRoute,
  policyRoutes,
  legalRoutes,
  industryRoutes,
  financeRoutes,
  systemRoutes,
  newApplicationRoutes,
} from "../routes";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

/**
 * MainLayout 主布局组件
 *
 * @file MainLayout.tsx
 * @desc 系统主布局组件，包含侧边栏菜单、顶部导航和内容区域
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 提供响应式侧边栏菜单导航
 * 2. 根据用户角色动态显示菜单项
 * 3. 顶部用户信息展示和下拉菜单
 * 4. 路由懒加载和加载状态管理
 * 5. 菜单自动展开/收起和选中状态管理
 *
 * --- 技术要点 ---
 * - 使用 Ant Design Layout 组件构建布局
 * - 使用 useMemo 优化菜单计算性能
 * - 使用 useCallback 优化事件处理函数
 * - Suspense 实现路由懒加载
 * - 根据用户角色动态生成菜单
 * - 单一菜单展开模式（同时只能展开一个父菜单）
 *
 * --- 布局结构 ---
 * - 左侧 Sider：宽度 256px，包含 Logo 和导航菜单
 * - 右侧 Layout：包含 Header 和 Content
 * - Header：显示用户头像和用户名，下拉菜单提供个人信息和退出登录
 * - Content：显示当前路由对应的内容，使用 Suspense 包裹实现懒加载
 *
 * @note 侧边栏菜单使用单层展开模式
 * @warning 必须在登录后使用，依赖 useAuth 上下文
 */

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const username = useMemo(() => user?.name || "用户", [user]);
  const avatar = useMemo(() => user?.avatar, [user]);

  const roleType = useMemo(() => user?.roleType, [user]);

  const dynamicMenuItems = useMemo(() => getMenuItems(roleType), [roleType]);

  const defaultOpenKeys = useMemo(
    () => getDefaultOpenKeys(location.pathname),
    [location.pathname],
  );
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  /**
   * 当前选中的菜单键值
   */
  const selectedKeys = useMemo(
    () => getSelectedKeys(location.pathname),
    [location.pathname, location.search],
  );

  /**
   * 监听路由变化，更新菜单展开状态
   */
  useEffect(() => {
    const newOpenKeys = getDefaultOpenKeys(location.pathname);
    setOpenKeys(newOpenKeys);
    
    // 记录路由历史
    const routeHistory = RouteHistory.getInstance();
    routeHistory.addRoute(location.pathname + location.search);
  }, [location.pathname, location.search]);

  /**
   * 监听浏览器前进后退事件，确保菜单状态同步
   */
  useEffect(() => {
    const handlePopState = () => {
      // 强制重新计算菜单状态
      const newOpenKeys = getDefaultOpenKeys(window.location.pathname);
      setOpenKeys(newOpenKeys);
    };

    const handleBeforeUnload = () => {
      // 页面卸载时清理路由历史
      const routeHistory = RouteHistory.getInstance();
      routeHistory.clear();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /**
   * 菜单项点击处理
   *
   * @param key - 点击的菜单项键值
   *
   * @description
   * 导航到对应的路由路径。如果是首页，则收起所有展开的菜单。
   */
  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      navigate(key);
      if (key === "/") {
        setOpenKeys([]);
      }
    },
    [navigate],
  );

  /**
   * 菜单展开/收起处理
   *
   * @param keys - 展开的菜单键值数组
   *
   * @description
   * 实现单一菜单展开模式，同时只能展开一个父级菜单。
   * 当点击新的父菜单时，收起之前展开的菜单。
   */
  const handleOpenChange = useCallback((keys: string[]) => {
    const latestOpenKey = keys[keys.length - 1];
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  }, []);

  /**
   * 用户退出登录处理
   *
   * @description
   * 清除本地存储的登录信息，并导航到登录页面。
   */
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  }, [navigate]);

  const userMenuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "个人信息",
        onClick: () => navigate("/system/personal-center"),
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        onClick: handleLogout,
      },
    ],
    [handleLogout, navigate],
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={256}
        className={styles.sidebar}
      >
        <div className={styles.logo}>
          璟智通
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          items={dynamicMenuItems}
          className={styles.menu}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className={styles.userDropdown}>
              <Avatar 
                src={avatar} 
                icon={<UserOutlined />} 
                className={styles.userAvatar}
              />
              <Text>{username}</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content className={styles.content}>
          <BreadcrumbNav />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {homeRoute}
              {policyRoutes}
              {newApplicationRoutes}
              {legalRoutes}
              {industryRoutes}
              {financeRoutes}
              {systemRoutes}
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
