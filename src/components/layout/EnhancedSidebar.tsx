/**
 * 增强版左侧导航栏组件
 * 包含完整的导航菜单结构和折叠功能
 */

import React, { useState, useMemo } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  FileSearchOutlined,
  RobotOutlined,
  ProjectOutlined,
  FormOutlined,
  BarChartOutlined,
  SafetyOutlined,
  BankOutlined,
  IndustryOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  AuditOutlined,
  DollarOutlined,
  ShopOutlined,
  GlobalOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface EnhancedSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ 
  collapsed, 
  onCollapse 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(['policy']);

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'policy',
      icon: <FileSearchOutlined />,
      label: '政策中心',
      children: [
        {
          key: '/policy/search',
          icon: <FileSearchOutlined />,
          label: '政策搜索',
        },
        {
          key: '/policy/ai-search',
          icon: <RobotOutlined />,
          label: '智慧政策',
        },
        {
          key: '/policy/recommendations',
          icon: <ThunderboltOutlined />,
          label: '政策推荐',
        },
        {
          key: '/policy/analysis',
          icon: <BarChartOutlined />,
          label: '政策分析',
        },
      ],
    },
    {
      key: '/smart-policy',
      icon: <RobotOutlined />,
      label: '智慧政策',
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目列表',
    },
    {
      key: '/applications',
      icon: <FormOutlined />,
      label: '我的申报',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
    {
      key: 'legal',
      icon: <SafetyOutlined />,
      label: '法律护航',
      children: [
        {
          key: '/legal/consultation',
          icon: <AuditOutlined />,
          label: '法律咨询',
        },
        {
          key: '/legal/compliance',
          icon: <SafetyOutlined />,
          label: '合规检查',
        },
        {
          key: '/legal/contracts',
          icon: <FileSearchOutlined />,
          label: '合同管理',
        },
      ],
    },
    {
      key: 'industry',
      icon: <IndustryOutlined />,
      label: '产业管理',
      children: [
        {
          key: '/industry/overview',
          icon: <GlobalOutlined />,
          label: '产业概览',
        },
        {
          key: '/industry/enterprises',
          icon: <ShopOutlined />,
          label: '企业管理',
        },
        {
          key: '/industry/services',
          icon: <TeamOutlined />,
          label: '服务管理',
        },
      ],
    },
    {
      key: '/finance',
      icon: <BankOutlined />,
      label: '金融服务',
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/system/users',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/system/personal-center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: '/system/settings',
          icon: <SettingOutlined />,
          label: '系统设置',
        },
      ],
    },
  ];

  // 获取当前选中的菜单项
  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    // 精确匹配当前路径
    for (const item of menuItems) {
      if (item && typeof item === 'object' && 'key' in item) {
        if (item.key === pathname) {
          return [item.key as string];
        }
        if ('children' in item && item.children) {
          for (const child of item.children) {
            if (child && typeof child === 'object' && 'key' in child && child.key === pathname) {
              return [child.key as string];
            }
          }
        }
      }
    }
    return ['/'];
  }, [location.pathname]);

  // 获取默认展开的菜单项
  const defaultOpenKeys = useMemo(() => {
    const pathname = location.pathname;
    const openKeys: string[] = [];
    
    for (const item of menuItems) {
      if (item && typeof item === 'object' && 'key' in item && 'children' in item && item.children) {
        for (const child of item.children) {
          if (child && typeof child === 'object' && 'key' in child && child.key === pathname) {
            openKeys.push(item.key as string);
            break;
          }
        }
      }
    }
    
    return openKeys;
  }, [location.pathname]);

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    // 检查是否是父菜单
    const isParentMenu = menuItems.some(item => 
      item && typeof item === 'object' && 'key' in item && 
      item.key === key && 'children' in item && item.children
    );
    
    if (!isParentMenu) {
      navigate(key);
    }
  };

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={null}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#001529',
        zIndex: 100,
      }}
    >
      {/* Logo 区域 */}
      <div 
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#002140',
          borderBottom: '1px solid #1f1f1f',
        }}
      >
        <div 
          style={{
            color: '#fff',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 600,
            letterSpacing: collapsed ? 0 : '2px',
            transition: 'all 0.2s',
          }}
        >
          {collapsed ? '璟' : '璟智通'}
        </div>
      </div>

      {/* 导航菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
        style={{
          border: 'none',
          background: 'transparent',
        }}
      />

      {/* 折叠按钮 */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          padding: 8,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          transition: 'all 0.2s',
        }}
        onClick={() => onCollapse(!collapsed)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <Tooltip title={collapsed ? "展开菜单" : "收起菜单"} placement="right">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Tooltip>
      </div>
    </Sider>
  );
};

export default EnhancedSidebar;
