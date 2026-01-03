/**
 * 统一面包屑样式配置
 * 为所有面包屑组件提供一致的样式标准
 */

import type { CSSProperties } from 'react';

// 面包屑容器样式
export const breadcrumbContainerStyle: CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#fafafa',
  borderBottom: '1px solid #f0f0f0',
  marginBottom: '16px',
};

// 面包屑项目样式
export const breadcrumbItemStyles = {
  // 可点击项目样式
  clickable: {
    cursor: 'pointer' as const,
    color: '#1890ff',
    transition: 'color 0.3s',
    fontSize: '14px',
    fontWeight: 400,
  },
  
  // 当前页面项目样式（不可点击）
  current: {
    color: '#666',
    fontSize: '14px',
    fontWeight: 500,
  },
  
  // 悬停样式
  hover: {
    color: '#40a9ff',
  },
  
  // 图标样式
  icon: {
    marginRight: '4px',
    fontSize: '14px',
  },
};

// 面包屑分隔符样式
export const breadcrumbSeparatorStyle = {
  color: '#d9d9d9',
  margin: '0 8px',
};

// 这些样式可以被各个页面直接导入使用
