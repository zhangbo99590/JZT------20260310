/**
 * 通用页面包装器
 * 为所有模块页面提供统一的面包屑导航和布局
 */

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  module?: 'legal' | 'policy' | 'system' | 'industry' | 'finance';
  className?: string;
  style?: React.CSSProperties;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  module,
  className, 
  style 
}) => {
  return (
    <div 
      className={className}
      style={{ 
        background: '#f5f5f5', 
        minHeight: '100vh',
        ...style 
      }}
    >
      
      {/* 页面内容 */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
