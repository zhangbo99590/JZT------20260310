/**
 * 政策搜索结果组件 - 1:1还原参考图片的精确列表结构
 * 修复空提示重复问题，确保只在无结果时显示一次空状态
 */

import React, { useState, useMemo } from 'react';
import { Empty, Typography, Spin, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PolicyCardExact from './PolicyCardExact';
import { EnhancedPolicyData, searchEnhancedPolicies } from '../data/enhancedPolicyData';

const { Text } = Typography;

interface PolicyResultsExactProps {
  keyword?: string;
  districts?: string[];
  industries?: string[];
  levels?: string[];
  categories?: string[];
  loading?: boolean;
  onOrgClick?: (orgName: string) => void;
  onReset?: () => void;
  className?: string;
}

const PolicyResultsExact: React.FC<PolicyResultsExactProps> = ({
  keyword = '',
  districts = [],
  industries = [],
  levels = [],
  categories = [],
  loading = false,
  onOrgClick,
  onReset,
  className = ''
}) => {
  // 搜索结果 - 总是执行搜索以显示默认结果
  const searchResults = useMemo(() => {
    return searchEnhancedPolicies(keyword, districts, industries, levels, categories);
  }, [keyword, districts, industries, levels, categories]);

  // 搜索关键词数组（用于高亮）
  const searchKeywords = useMemo(() => {
    const keywords = [];
    if (keyword && keyword.trim()) {
      keywords.push(keyword.trim());
    }
    keywords.push(...districts);
    keywords.push(...industries);
    return keywords.filter(Boolean);
  }, [keyword, districts, industries]);

  // 加载状态
  if (loading) {
    return (
      <div className={`${className}`} style={{ 
        width: '100%', 
        textAlign: 'center', 
        padding: '60px 20px',
        backgroundColor: '#fafafa',
        borderRadius: '8px'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          正在搜索政策数据...
        </div>
      </div>
    );
  }

  // 空状态 - 只在确实没有结果时显示
  if (searchResults.length === 0) {
    return (
      <div className={`${className}`} style={{ 
        width: '100%', 
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        padding: '40px 20px'
      }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                未找到符合条件的政策，请调整筛选条件后重试
              </Text>
              <div style={{ marginTop: '16px' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    onClick={onReset}
                  >
                    重置筛选条件
                  </Button>
                </Space>
              </div>
            </div>
          }
        />
      </div>
    );
  }

  // 有结果时的展示
  return (
    <div className={`policy-results-exact ${className}`} style={{ width: '100%' }}>
      {/* 结果统计 */}
      <div style={{ 
        marginBottom: '16px', 
        padding: '12px 16px',
        backgroundColor: '#f0f9ff',
        borderRadius: '6px',
        border: '1px solid #bae7ff'
      }}>
        <Text style={{ fontSize: '14px', color: '#1890ff' }}>
          找到 <Text strong style={{ color: '#1890ff' }}>{searchResults.length}</Text> 条相关政策
          {searchKeywords.length > 0 && (
            <span style={{ marginLeft: '8px', color: '#666' }}>
              搜索条件: {searchKeywords.join(', ')}
            </span>
          )}
        </Text>
      </div>

      {/* 政策列表 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0px' // 卡片间距由卡片自身的marginBottom控制
      }}>
        {searchResults.map((policy, index) => (
          <PolicyCardExact
            key={policy.id}
            policy={policy}
            searchKeywords={searchKeywords}
            onOrgClick={onOrgClick}
            className="policy-card-item"
          />
        ))}
      </div>

      {/* 底部提示 */}
      {searchResults.length > 5 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#999',
          fontSize: '14px'
        }}>
          已显示全部 {searchResults.length} 条政策结果
        </div>
      )}
    </div>
  );
};

export default PolicyResultsExact;
