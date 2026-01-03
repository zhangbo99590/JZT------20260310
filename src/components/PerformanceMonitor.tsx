/**
 * 性能监控组件
 * 用于开发环境监控应用性能
 */

import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button, Drawer, Table, Tag } from 'antd';
import { DashboardOutlined, CloseOutlined } from '@ant-design/icons';
import { performanceMonitor } from '../utils/performance';
import { cache } from '../utils/cache';
import { errorLogger } from '../utils/errorHandler';

const PerformanceMonitor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      updateStats();
      const interval = setInterval(updateStats, 2000);
      return () => clearInterval(interval);
    }
  }, [visible]);

  const updateStats = () => {
    setStats(performanceMonitor.getAllStats());
    setCacheStats(cache.getStats());
    setErrors(errorLogger.getLogs());
  };

  const getMemoryInfo = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: (memory.usedJSHeapSize / 1048576).toFixed(2),
        total: (memory.totalJSHeapSize / 1048576).toFixed(2),
        limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2),
      };
    }
    return null;
  };

  const memoryInfo = getMemoryInfo();

  const errorColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleTimeString(),
    },
    {
      title: '错误信息',
      dataIndex: 'error',
      key: 'error',
      render: (error: any) => error.message,
    },
    {
      title: '类型',
      dataIndex: 'error',
      key: 'type',
      render: (error: any) => (
        <Tag color={error.type === 'NETWORK' ? 'red' : 'orange'}>
          {error.type || 'UNKNOWN'}
        </Tag>
      ),
    },
  ];

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <Button
        type="primary"
        icon={<DashboardOutlined />}
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        性能监控
      </Button>

      <Drawer
        title="性能监控面板"
        placement="right"
        width={600}
        onClose={() => setVisible(false)}
        open={visible}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setVisible(false)}
          />
        }
      >
        <div style={{ marginBottom: 24 }}>
          <h3>缓存统计</h3>
          {cacheStats && (
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="缓存条目"
                  value={cacheStats.size}
                  suffix={`/ ${cacheStats.maxSize}`}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="命中率"
                  value={cacheStats.hitRate.toFixed(2)}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Button
                  onClick={() => {
                    cache.clear();
                    updateStats();
                  }}
                >
                  清空缓存
                </Button>
              </Col>
            </Row>
          )}
        </div>

        {memoryInfo && (
          <div style={{ marginBottom: 24 }}>
            <h3>内存使用</h3>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="已使用"
                  value={memoryInfo.used}
                  suffix="MB"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="总计"
                  value={memoryInfo.total}
                  suffix="MB"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="限制"
                  value={memoryInfo.limit}
                  suffix="MB"
                />
              </Col>
            </Row>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <h3>性能指标</h3>
          {stats && Object.keys(stats).length > 0 ? (
            Object.entries(stats).map(([label, stat]: [string, any]) => (
              <Card key={label} size="small" style={{ marginBottom: 8 }}>
                <h4>{label}</h4>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="平均"
                      value={stat?.avg?.toFixed(2)}
                      suffix="ms"
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="最小"
                      value={stat?.min?.toFixed(2)}
                      suffix="ms"
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="最大"
                      value={stat?.max?.toFixed(2)}
                      suffix="ms"
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="P95"
                      value={stat?.p95?.toFixed(2)}
                      suffix="ms"
                    />
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>暂无性能数据</p>
          )}
        </div>

        <div>
          <h3>错误日志 ({errors.length})</h3>
          <Table
            dataSource={errors}
            columns={errorColumns}
            size="small"
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record.timestamp}
          />
          <Button
            onClick={() => {
              errorLogger.clear();
              updateStats();
            }}
            style={{ marginTop: 8 }}
          >
            清空日志
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default PerformanceMonitor;
