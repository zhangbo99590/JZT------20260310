import React, {
  Suspense,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Space,
  Typography,
  Tooltip,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import LoadingFallback from "../components/common/LoadingFallback";
import BreadcrumbNav from "../components/common/BreadcrumbNav";
import { useAuth } from "../context/auth";
import {
  getMenuItems,
  getDefaultOpenKeys,
  getSelectedKeys,
  parentMenuPaths,
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

  const defaultOpenKeys = useMemo(
    () => getDefaultOpenKeys(location.pathname),
    [location.pathname],
  );
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);
  const openKeysRef = useRef<string[]>(defaultOpenKeys);

  // 同步 openKeys 到 ref
  useEffect(() => {
    openKeysRef.current = openKeys;
  }, [openKeys]);
  const [collapsed, setCollapsed] = useState(false);

  // 为菜单项添加tooltip支持
  const dynamicMenuItems = useMemo(() => {
    const items = getMenuItems(roleType);

    // 在折叠状态下，为每个菜单项添加tooltip
    const addTooltipToItems = (menuItems: any[]): any[] => {
      return menuItems?.map((item) => {
        if (!item) return item;

        const newItem = { ...item };

        // 为一级菜单和子菜单添加tooltip
        if (collapsed) {
          newItem.title = item.label;
        }

        // 递归处理子菜单
        if (item.children) {
          newItem.children = addTooltipToItems(item.children);
        }

        return newItem;
      });
    };

    return addTooltipToItems(items);
  }, [roleType, collapsed]);

  /**
   * 当前选中的菜单键值
   */
  const selectedKeys = useMemo(
    () => getSelectedKeys(location.pathname),
    [location.pathname, location.search],
  );

  /**
   * 监听路由变化，智能更新菜单展开状态
   * 优化：点击子菜单时保持父菜单展开，避免菜单状态被重置
   */
  useEffect(() => {
    const newOpenKeys = getDefaultOpenKeys(location.pathname);
    const currentOpenKeys = openKeysRef.current;

    // 如果新的展开键为空（如首页），不做处理
    if (newOpenKeys.length === 0) {
      // 记录路由历史
      const routeHistory = RouteHistory.getInstance();
      routeHistory.addRoute(location.pathname + location.search);
      return;
    }

    // 检查当前路由对应的父菜单是否已经展开
    const isAlreadyOpen = newOpenKeys.every((key) =>
      currentOpenKeys.includes(key),
    );

    if (!isAlreadyOpen) {
      // 如果父菜单未展开，则添加到展开列表（保持其他已展开的菜单）
      setOpenKeys((prev) => {
        const combined = [...new Set([...prev, ...newOpenKeys])];
        return combined;
      });
    }
    // 如果已经展开，则不做任何修改，保持当前状态

    // 记录路由历史
    const routeHistory = RouteHistory.getInstance();
    routeHistory.addRoute(location.pathname + location.search);
  }, [location.pathname, location.search]);

  /**
   * 监听浏览器前进后退事件，确保菜单状态同步
   */
  useEffect(() => {
    const handlePopState = () => {
      // 浏览器前进后退时，智能更新菜单状态
      const newOpenKeys = getDefaultOpenKeys(window.location.pathname);

      if (newOpenKeys.length > 0) {
        // 合并新的展开键，保持其他已展开的菜单
        setOpenKeys((prev) => {
          const combined = [...new Set([...prev, ...newOpenKeys])];
          return combined;
        });
      }
    };

    const handleBeforeUnload = () => {
      // 页面卸载时清理路由历史
      const routeHistory = RouteHistory.getInstance();
      routeHistory.clear();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  /**
   * 菜单项点击处理
   *
   * @param key - 点击的菜单项键值
   *
   * @description
   * 仅在点击二级子菜单时导航，点击一级菜单不跳转。
   * 通过判断菜单项是否有子菜单来决定是否导航。
   */
  const handleMenuClick = useCallback(
    ({ key, keyPath }: { key: string; keyPath: string[] }) => {
      // 如果是一级菜单（keyPath长度为1且不是首页），不跳转
      const isParentMenu = parentMenuPaths.includes(key);

      if (!isParentMenu) {
        // 只有二级菜单或首页才跳转
        navigate(key);
        if (key === "/") {
          setOpenKeys([]);
        }
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
   * 支持多个菜单同时展开，用户可以同时查看多个模块的子菜单。
   * 点击已展开的菜单会收起，点击未展开的菜单会展开，其他菜单保持状态不变。
   */
  const handleOpenChange = useCallback((keys: string[]) => {
    // 允许多个菜单同时展开
    setOpenKeys(keys);
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

  const topNavItems = useMemo(() => [{ key: "/", label: "首页" }], []);

  /**
   * 顶部导航点击处理
   */
  const handleTopNavClick = useCallback(
    ({ key }: { key: string }) => {
      navigate(key);
    },
    [navigate],
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={256}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sidebar}
        trigger={null}
      >
        <div
          className={styles.logo}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {/* 品牌标识 */}
          <div
            style={{
              width: 32,
              height: 32,
              background: "#1890ff",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            璟
          </div>
          {!collapsed && (
            <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>
              璟智通
            </span>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          items={dynamicMenuItems}
          className={styles.menu}
          inlineCollapsed={collapsed}
        />

        <div
          className={styles.collapseButton}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Tooltip
            title={collapsed ? "展开菜单" : "收起菜单"}
            placement="right"
          >
            <div className={styles.collapseIcon}>{collapsed ? "»" : "«"}</div>
          </Tooltip>
        </div>
      </Sider>

      <Layout>
        <Header
          className={styles.header}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            zIndex: 1,
          }}
        >
          {/* 顶部全局导航 */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Menu
              mode="horizontal"
              selectedKeys={selectedKeys}
              items={topNavItems}
              onClick={handleTopNavClick}
              style={{ borderBottom: "none", flex: 1, minWidth: 400 }}
            />
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space
              className={styles.userDropdown}
              style={{ cursor: "pointer" }}
            >
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
