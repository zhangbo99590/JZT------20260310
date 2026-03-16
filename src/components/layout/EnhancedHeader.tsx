/**
 * 增强版顶部导航组件
 * 包含璟智通品牌标识和用户操作菜单
 */

import React from 'react';
import { Layout, Space, Dropdown, Avatar, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

interface EnhancedHeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人信息",
      onClick: () => navigate("/system/personal-center"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "账号设置",
      onClick: () => navigate("/system/settings"),
    },
    {
      type: 'divider',
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)'
      }}
    >
      {/* 左侧品牌标识区域 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#1890ff',
            letterSpacing: '1px',
            marginRight: 16
          }}
        >
          璟智通
        </div>
        <div 
          style={{
            fontSize: 12,
            color: '#666',
            background: '#f0f9ff',
            padding: '2px 8px',
            borderRadius: 12,
            border: '1px solid #e6f7ff'
          }}
        >
          政策智能管理系统
        </div>
      </div>

      {/* 右侧用户操作区域 */}
      <Space size={16}>
        {/* 通知铃铛 */}
        <Button 
          type="text" 
          icon={<BellOutlined />} 
          style={{ color: '#666' }}
          onClick={() => navigate('/notifications')}
        />
        
        {/* 用户下拉菜单 */}
        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <Space 
            style={{ 
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 6,
              transition: 'background-color 0.2s',
            }}
            className="user-dropdown-trigger"
          >
            <Avatar 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              size={32}
              style={{ border: '2px solid #f0f0f0' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                {user?.name || "用户"}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', lineHeight: 1.2 }}>
                {user?.role || "管理员"}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>

      <style jsx>{`
        .user-dropdown-trigger:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </Header>
  );
};

export default EnhancedHeader;
