/**
 * 增强版主布局组件
 * 集成新的品牌标识、导航栏和用户菜单
 */

import React, { useState, Suspense } from 'react';
import { Layout } from 'antd';
import { Routes } from 'react-router-dom';
import EnhancedHeader from '../components/layout/EnhancedHeader';
import EnhancedSidebar from '../components/layout/EnhancedSidebar';
import LoadingFallback from '../components/common/LoadingFallback';
import BreadcrumbNav from '../components/common/BreadcrumbNav';
import {
  homeRoute,
  policyRoutes,
  legalRoutes,
  industryRoutes,
  financeRoutes,
  systemRoutes,
  newApplicationRoutes,
} from '../routes';

const { Content } = Layout;

const EnhancedMainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 增强版侧边栏 */}
      <EnhancedSidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
      />
      
      {/* 主内容区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
        {/* 增强版顶部导航 */}
        <EnhancedHeader 
          collapsed={collapsed} 
          onToggleCollapse={() => setCollapsed(!collapsed)} 
        />
        
        {/* 内容区域 */}
        <Content 
          style={{ 
            margin: '16px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 96px)',
            borderRadius: 8,
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            background: '#fff', 
            padding: '16px 24px 8px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <BreadcrumbNav />
          </div>
          
          <div style={{ padding: '24px' }}>
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
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EnhancedMainLayout;
