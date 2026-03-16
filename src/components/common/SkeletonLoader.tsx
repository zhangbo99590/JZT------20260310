/**
 * 骨架屏加载组件
 * 创建时间: 2026-02-26
 * 功能: 提供统一的骨架屏加载效果
 */

import React from 'react';
import { Card, Skeleton, Row, Col } from 'antd';

interface SkeletonLoaderProps {
  type?: 'card' | 'chart' | 'list' | 'overview';
  rows?: number;
  loading?: boolean;
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  rows = 3,
  loading = true,
  children
}) => {
  if (!loading && children) {
    return <>{children}</>;
  }

  const renderSkeleton = () => {
    switch (type) {
      case 'overview':
        return (
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map(i => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Card>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        );
      
      case 'chart':
        return (
          <Card>
            <Skeleton.Input style={{ width: '100%', height: '300px' }} active />
          </Card>
        );
      
      case 'list':
        return (
          <Card>
            <Skeleton active paragraph={{ rows }} />
          </Card>
        );
      
      default:
        return (
          <Card>
            <Skeleton active paragraph={{ rows }} />
          </Card>
        );
    }
  };

  return renderSkeleton();
};

// 专用的首页骨架屏组件
export const HomePageSkeleton: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 页面头部骨架 */}
      <div style={{ marginBottom: '24px' }}>
        <Skeleton.Input style={{ width: '300px', height: '32px' }} active />
        <Skeleton.Input style={{ width: '400px', height: '16px', marginTop: '8px' }} active />
      </div>

      {/* 数据概览骨架 */}
      <SkeletonLoader type="overview" />

      {/* 天气和日历骨架 */}
      <Row gutter={[16, 16]} style={{ margin: '24px 0' }}>
        <Col xs={24} md={12}>
          <SkeletonLoader type="card" rows={4} />
        </Col>
        <Col xs={24} md={12}>
          <SkeletonLoader type="list" rows={3} />
        </Col>
      </Row>

      {/* 智能看板骨架 */}
      <SkeletonLoader type="chart" />

      {/* 主要内容区域骨架 */}
      <Row gutter={[16, 16]} style={{ margin: '24px 0' }}>
        <Col xs={24} lg={12}>
          <SkeletonLoader type="card" rows={4} />
        </Col>
        <Col xs={24} lg={12}>
          <SkeletonLoader type="chart" />
        </Col>
      </Row>
    </div>
  );
};
