/**
 * 空状态组件
 * 创建时间: 2026-02-26
 * 功能: 提供统一的空状态显示
 */

import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { 
  InboxOutlined, 
  FileSearchOutlined, 
  DatabaseOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface EmptyStateProps {
  type?: 'data' | 'search' | 'error' | 'custom';
  title?: string;
  description?: string;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRetry?: () => void;
  onCreate?: () => void;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'data',
  title,
  description,
  image,
  actions,
  onRetry,
  onCreate,
  style
}) => {
  const getDefaultConfig = () => {
    switch (type) {
      case 'search':
        return {
          image: <FileSearchOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />,
          title: title || '暂无搜索结果',
          description: description || '尝试调整搜索条件或关键词'
        };
      
      case 'error':
        return {
          image: <DatabaseOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />,
          title: title || '数据加载失败',
          description: description || '网络连接异常，请检查网络后重试'
        };
      
      case 'custom':
        return {
          image: image || <InboxOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />,
          title: title || '暂无内容',
          description: description || ''
        };
      
      default: // 'data'
        return {
          image: <InboxOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />,
          title: title || '暂无数据',
          description: description || '当前没有可显示的数据'
        };
    }
  };

  const config = getDefaultConfig();

  const defaultActions = () => {
    const buttons = [];
    
    if (onRetry) {
      buttons.push(
        <Button key="retry" type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          重新加载
        </Button>
      );
    }
    
    if (onCreate) {
      buttons.push(
        <Button key="create" icon={<PlusOutlined />} onClick={onCreate}>
          创建新项目
        </Button>
      );
    }
    
    return buttons.length > 0 ? buttons : null;
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', ...style }}>
      <Empty
        image={config.image}
        description={
          <div>
            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              {config.title}
            </Text>
            {config.description && (
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {config.description}
              </Text>
            )}
          </div>
        }
      >
        {actions || defaultActions()}
      </Empty>
    </div>
  );
};

// 专用的数据加载错误组件
export const DataErrorState: React.FC<{
  onRetry: () => void;
  error?: string;
}> = ({ onRetry, error }) => (
  <EmptyState
    type="error"
    title="数据加载失败"
    description={error || "请检查网络连接后重试"}
    onRetry={onRetry}
  />
);

// 专用的搜索无结果组件
export const SearchEmptyState: React.FC<{
  keyword?: string;
  onClear?: () => void;
}> = ({ keyword, onClear }) => (
  <EmptyState
    type="search"
    title="未找到相关内容"
    description={keyword ? `没有找到与"${keyword}"相关的内容` : "尝试使用其他关键词搜索"}
    actions={onClear && (
      <Button onClick={onClear}>
        清除搜索条件
      </Button>
    )}
  />
);
