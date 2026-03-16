/**
 * 搜索反馈组件
 * 实时显示搜索结果数量和筛选条件
 */

import React from 'react';
import { Alert, Tag, Space, Typography, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SearchFeedbackProps {
  loading?: boolean;
  resultCount: number;
  searchKeyword?: string;
  filters?: {
    regions?: string[];
    industries?: string[];
    levels?: string[];
    categories?: string[];
    [key: string]: string[] | undefined;
  };
  onClearFilter?: (filterType: string, value: string) => void;
  onClearAllFilters?: () => void;
}

const SearchFeedback: React.FC<SearchFeedbackProps> = ({
  loading = false,
  resultCount,
  searchKeyword,
  filters = {},
  onClearFilter,
  onClearAllFilters
}) => {
  // 构建筛选条件描述
  const buildFilterDescription = () => {
    const filterDescriptions: string[] = [];
    
    if (searchKeyword) {
      filterDescriptions.push(`关键词"${searchKeyword}"`);
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        const filterName = getFilterDisplayName(key);
        if (values.length === 1) {
          filterDescriptions.push(`${filterName}"${values[0]}"`);
        } else {
          filterDescriptions.push(`${filterName}${values.length}项`);
        }
      }
    });

    return filterDescriptions.join('、');
  };

  const getFilterDisplayName = (key: string): string => {
    const nameMap: Record<string, string> = {
      regions: '地区',
      industries: '行业',
      levels: '级别',
      categories: '类别',
      orgTypes: '机构类型',
      subsidyTypes: '补贴类型'
    };
    return nameMap[key] || key;
  };

  // 获取所有激活的筛选标签
  const getActiveFilterTags = () => {
    const tags: Array<{ type: string; value: string; label: string }> = [];
    
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => {
          tags.push({
            type: key,
            value,
            label: `${getFilterDisplayName(key)}: ${value}`
          });
        });
      }
    });

    return tags;
  };

  const filterDescription = buildFilterDescription();
  const activeFilterTags = getActiveFilterTags();
  const hasFilters = filterDescription.length > 0;

  if (loading) {
    return (
      <div style={{ 
        padding: '16px 24px',
        background: '#f8f9fa',
        borderRadius: 8,
        margin: '16px 0'
      }}>
        <Space>
          <Spin size="small" />
          <Text>正在搜索政策...</Text>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ margin: '16px 0' }}>
      {/* 搜索结果反馈 */}
      <Alert
        message={
          <Space>
            <SearchOutlined />
            <Text strong>
              搜索完成，找到 <span style={{ color: '#1890ff', fontSize: 16 }}>{resultCount}</span> 条
              {hasFilters && ` ${filterDescription}`} 政策
            </Text>
          </Space>
        }
        type={resultCount > 0 ? 'success' : 'warning'}
        showIcon={false}
        style={{ marginBottom: activeFilterTags.length > 0 ? 12 : 0 }}
      />

      {/* 激活的筛选条件标签 */}
      {activeFilterTags.length > 0 && (
        <div style={{ 
          padding: '12px 16px',
          background: '#fafafa',
          borderRadius: 6,
          border: '1px solid #f0f0f0'
        }}>
          <Space wrap>
            <Text style={{ color: '#666', fontSize: 12 }}>
              <FilterOutlined /> 当前筛选条件：
            </Text>
            {activeFilterTags.map((tag, index) => (
              <Tag
                key={`${tag.type}-${tag.value}-${index}`}
                closable
                onClose={() => onClearFilter?.(tag.type, tag.value)}
                style={{ marginBottom: 4 }}
              >
                {tag.label}
              </Tag>
            ))}
            {activeFilterTags.length > 1 && (
              <Tag
                color="red"
                style={{ cursor: 'pointer', marginBottom: 4 }}
                onClick={onClearAllFilters}
              >
                <CloseOutlined /> 清空所有
              </Tag>
            )}
          </Space>
        </div>
      )}
    </div>
  );
};

export default SearchFeedback;
