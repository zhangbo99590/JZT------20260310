/**
 * 搜索结果展示组件
 * 支持分类标签、关键词高亮、结构化信息展示
 */

import React, { useState } from 'react';
import { List, Tag, Button, Select, Tabs, Badge, Typography, Space, Avatar, Divider } from 'antd';
import { FileTextOutlined, CalendarOutlined, BankOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { highlightKeywords } from '../utils/searchUtils';

const { Text, Title } = Typography;
const { Option } = Select;

interface SearchResult {
  id: string;
  title: string;
  originalTitle?: string;
  content: string;
  summary: string;
  industry: string;
  publishDate: string;
  department: string;
  region: string;
  level: string;
  subsidyType: string;
  subsidyAmount?: string;
  tags: string[];
  type: 'policy' | 'project' | 'enterprise';
  _matchedTerms?: string[];
  _searchScore?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  searchKeywords?: string[];
  onResultClick?: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  searchKeywords = [],
  onResultClick
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'subsidy'>('relevance');
  const [filterType, setFilterType] = useState<'all' | 'policy' | 'project' | 'enterprise'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 按类型统计结果
  const resultStats = {
    all: results.length,
    policy: results.filter(r => r.type === 'policy').length,
    project: results.filter(r => r.type === 'project').length,
    enterprise: results.filter(r => r.type === 'enterprise').length
  };

  // 筛选和排序结果
  const filteredAndSortedResults = React.useMemo(() => {
    let filtered = results;
    
    // 按类型筛选
    if (filterType !== 'all') {
      filtered = results.filter(r => r.type === filterType);
    }
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'subsidy': {
          const aAmount = parseFloat(a.subsidyAmount?.replace(/[^\d.]/g, '') || '0');
          const bAmount = parseFloat(b.subsidyAmount?.replace(/[^\d.]/g, '') || '0');
          return bAmount - aAmount;
        }
        case 'relevance':
        default:
          return (b._searchScore || 0) - (a._searchScore || 0);
      }
    });
    
    return filtered;
  }, [results, filterType, sortBy]);

  // 分页结果
  const paginatedResults = filteredAndSortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'policy': return 'blue';
      case 'project': return 'green';
      case 'enterprise': return 'orange';
      default: return 'default';
    }
  };

  // 获取类型标签文本
  const getTypeText = (type: string) => {
    switch (type) {
      case 'policy': return '政策文件';
      case 'project': return '相关项目';
      case 'enterprise': return '扶持企业';
      default: return '其他';
    }
  };

  // 获取级别标签颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '国家级': return 'red';
      case '省级': return 'orange';
      case '市级': return 'blue';
      case '区县级': return 'green';
      default: return 'default';
    }
  };

  // 渲染搜索结果项
  const renderResultItem = (result: SearchResult) => (
    <List.Item
      key={result.id}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onResultClick?.(result)}
    >
      <div className="w-full">
        {/* 标题和标签行 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <Title 
              level={4} 
              className="mb-1 text-gray-800 hover:text-blue-600 transition-colors"
              style={{ fontSize: '16px', lineHeight: '1.4' }}
            >
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: highlightKeywords(result.title, searchKeywords) 
                }} 
              />
            </Title>
            {result.originalTitle && result.originalTitle !== result.title && (
              <Text type="secondary" className="text-sm">
                原文标题：
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightKeywords(result.originalTitle, searchKeywords) 
                  }} 
                />
              </Text>
            )}
          </div>
          <div className="flex gap-1 ml-4">
            <Tag color={getTypeColor(result.type)} className="text-xs">
              {getTypeText(result.type)}
            </Tag>
            <Tag color={getLevelColor(result.level)} className="text-xs">
              {result.level}
            </Tag>
          </div>
        </div>

        {/* 内容摘要 */}
        <div className="mb-3">
          <Text className="text-gray-600 text-sm leading-relaxed">
            <span 
              dangerouslySetInnerHTML={{ 
                __html: highlightKeywords(result.summary, searchKeywords) 
              }} 
            />
          </Text>
        </div>

        {/* 标签行 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {result.tags.map(tag => (
            <Tag key={tag} className="text-xs border-gray-300 text-gray-600">
              {tag}
            </Tag>
          ))}
          {result.subsidyAmount && (
            <Tag color="gold" className="text-xs font-medium">
              💰 {result.subsidyAmount}
            </Tag>
          )}
        </div>

        {/* 底部信息行 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <Space size={16} className="flex-wrap">
            <span className="flex items-center gap-1">
              <EnvironmentOutlined />
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: highlightKeywords(result.region, searchKeywords) 
                }} 
              />
            </span>
            <span className="flex items-center gap-1">
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: highlightKeywords(result.industry, searchKeywords) 
                }} 
              />
            </span>
            <span className="flex items-center gap-1">
              <CalendarOutlined />
              {result.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <BankOutlined />
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-800 no-underline"
                onClick={(e) => e.stopPropagation()}
              >
                {result.department}
              </a>
            </span>
          </Space>
          {result._searchScore && (
            <Text type="secondary" className="text-xs">
              匹配度: {Math.round(result._searchScore * 10)}%
            </Text>
          )}
        </div>
      </div>
    </List.Item>
  );

  if (!results.length) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-lg mb-2">📄</div>
        <div className="text-gray-500">暂无搜索结果</div>
        <div className="text-gray-400 text-sm mt-2">请尝试调整搜索关键词或筛选条件</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 结果分类标签和排序 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Tabs 
            activeKey={filterType} 
            onChange={setFilterType}
            size="small"
            className="search-result-tabs"
            items={[
              {
                key: 'all',
                label: <Badge count={resultStats.all} showZero><span>全部</span></Badge>
              },
              {
                key: 'policy',
                label: <Badge count={resultStats.policy} showZero><span>政策文件</span></Badge>
              },
              {
                key: 'project',
                label: <Badge count={resultStats.project} showZero><span>相关项目</span></Badge>
              },
              {
                key: 'enterprise',
                label: <Badge count={resultStats.enterprise} showZero><span>扶持企业</span></Badge>
              }
            ]}
          />
          
          <Select
            value={sortBy}
            onChange={setSortBy}
            size="small"
            style={{ width: 120 }}
          >
            <Option value="relevance">默认排序</Option>
            <Option value="date">发布时间</Option>
            <Option value="subsidy">补贴金额</Option>
          </Select>
        </div>

        {/* 搜索统计信息 */}
        <div className="text-sm text-gray-600">
          找到 <span className="font-medium text-blue-600">{filteredAndSortedResults.length}</span> 条相关结果
          {searchKeywords.length > 0 && (
            <span className="ml-2">
              关键词：
              {searchKeywords.map(keyword => (
                <Tag key={keyword} size="small" className="ml-1">
                  {keyword}
                </Tag>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* 搜索结果列表 */}
      <List
        dataSource={paginatedResults}
        renderItem={renderResultItem}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredAndSortedResults.length,
          onChange: setCurrentPage,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条结果`,
          className: "px-4 py-2"
        }}
        className="search-results-list"
      />

    </div>
  );
};

export default SearchResults;
