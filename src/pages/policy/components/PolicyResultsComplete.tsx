/**
 * 完整的政策搜索结果组件 - 按照企知道规范实现
 * 包含头部信息区、政策列表区、分页控件区
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, Pagination, Select, Empty, Spin, Checkbox, message } from 'antd';
import { 
  DownloadOutlined, 
  EditOutlined, 
  CalendarOutlined, 
  BankOutlined, 
  TeamOutlined,
  SortAscendingOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import PolicyCardExact from './PolicyCardExact';
import { EnhancedPolicyData, searchEnhancedPolicies } from '../data/enhancedPolicyData';
import { segmentKeyword, formatKeywordDisplay } from '../utils/keywordSegmentation';

const { Text, Title } = Typography;
const { Option } = Select;

interface PolicyResultsCompleteProps {
  keyword?: string;
  districts?: string[];
  industries?: string[];
  levels?: string[];
  categories?: string[];
  loading?: boolean;
  onOrgClick?: (orgName: string) => void;
  onReset?: () => void;
  onPolicyClick?: (policyId: string) => void;
  className?: string;
}

const PolicyResultsComplete: React.FC<PolicyResultsCompleteProps> = ({
  keyword = '',
  districts = [],
  industries = [],
  levels = [],
  categories = [],
  loading = false,
  onOrgClick,
  onReset,
  onPolicyClick,
  className = ''
}) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 排序状态
  const [sortType, setSortType] = useState<'comprehensive' | 'latest'>('comprehensive');
  
  // 批量选择状态
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // 搜索结果
  const allResults = useMemo(() => {
    let results = searchEnhancedPolicies(keyword, districts, industries, levels, categories);
    
    // 排序逻辑
    if (sortType === 'latest') {
      results.sort((a, b) => {
        const dateA = new Date(a.publishDate.replace(/年|月/g, '-').replace(/日/g, ''));
        const dateB = new Date(b.publishDate.replace(/年|月/g, '-').replace(/日/g, ''));
        return dateB.getTime() - dateA.getTime();
      });
    } else {
      // 综合排序：按匹配分数排序
      results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
    
    return results;
  }, [keyword, districts, industries, levels, categories, sortType]);

  // 分页结果
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allResults.slice(startIndex, endIndex);
  }, [allResults, currentPage, pageSize]);

  // 搜索关键词组合 - 包含核心词分词
  const searchKeywords = useMemo(() => {
    const keywords = [];
    if (keyword && keyword.trim()) {
      // 对关键词进行分词，提取核心词
      const coreTerms = segmentKeyword(keyword.trim());
      keywords.push(...coreTerms);
    }
    keywords.push(...districts);
    keywords.push(...industries);
    return keywords.filter(Boolean);
  }, [keyword, districts, industries]);
  
  // 格式化关键词显示（用于头部提示）
  const formattedKeyword = useMemo(() => {
    if (!keyword || !keyword.trim()) return null;
    return formatKeywordDisplay(keyword.trim());
  }, [keyword]);

  // 搜索条件描述
  const searchDescription = useMemo(() => {
    const parts = [];
    if (districts.length > 0) {
      parts.push(districts.join('、'));
    }
    if (industries.length > 0) {
      parts.push(industries.join('、'));
    }
    if (keyword && keyword.trim()) {
      parts.push(keyword.trim());
    }
    return parts.join(' + ');
  }, [keyword, districts, industries]);

  // 自动滚动到结果区
  useEffect(() => {
    if (!loading && allResults.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }, [loading, allResults.length]);

  // 批量选择处理
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedPolicies(paginatedResults.map(p => p.id));
    } else {
      setSelectedPolicies([]);
    }
  };

  const handleSelectPolicy = (policyId: string, checked: boolean) => {
    if (checked) {
      setSelectedPolicies([...selectedPolicies, policyId]);
    } else {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId));
      setSelectAll(false);
    }
  };

  // 批量操作
  const handleBatchEdit = () => {
    if (selectedPolicies.length === 0) {
      message.warning('请先选择要编辑的政策');
      return;
    }
    message.info(`批量编辑 ${selectedPolicies.length} 条政策（功能开发中）`);
  };

  const handleExportData = () => {
    const exportData = selectedPolicies.length > 0 
      ? allResults.filter(p => selectedPolicies.includes(p.id))
      : allResults;
    
    message.success(`导出 ${exportData.length} 条政策数据（功能开发中）`);
  };

  // 分页变化处理
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
    // 滚动到结果区顶部
    resultsRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // 检查是否有搜索条件
  const hasSearchConditions = keyword.trim() || districts.length > 0 || industries.length > 0 || levels.length > 0 || categories.length > 0;

  // 如果没有搜索条件，不显示任何内容
  if (!hasSearchConditions) {
    return null;
  }

  // 加载状态
  if (loading) {
    return (
      <div ref={resultsRef} className={`${className}`} style={{ 
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

  // 空状态
  if (allResults.length === 0) {
    return (
      <div ref={resultsRef} className={`${className}`} style={{ 
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
                {keyword && keyword.trim() ? (
                  <>
                    未找到与「
                    {formattedKeyword?.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          color: part.isCore ? '#FF4D4F' : '#666',
                          fontWeight: part.isCore ? 500 : 400
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                    」相关的政策，请调整关键词或筛选条件后重试
                  </>
                ) : (
                  '未找到符合条件的政策，请调整筛选条件后重试'
                )}
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

  // 有结果时的完整展示
  return (
    <div ref={resultsRef} className={`policy-results-complete ${className}`} style={{ width: '100%' }}>
      {/* 头部信息区 */}
      <Card 
        style={{ 
          marginBottom: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* 左侧：搜索信息 */}
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: '8px', color: '#1890ff' }}>
              您主动搜索到以下政策
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {formattedKeyword && formattedKeyword.length > 0 && (
                <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>搜索关键词:</span>
                  <span style={{ fontWeight: 500 }}>「</span>
                  {formattedKeyword.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        color: part.isCore ? '#FF4D4F' : '#666',
                        fontWeight: part.isCore ? 500 : 400
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                  <span style={{ fontWeight: 500 }}>」</span>
                </div>
              )}
              {(districts.length > 0 || industries.length > 0) && (
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  筛选条件: <Text strong style={{ color: '#1890ff' }}>{searchDescription}</Text>
                </Text>
              )}
              <Text style={{ fontSize: '14px', color: '#52c41a' }}>
                共找到 <Text strong style={{ color: '#52c41a' }}>{allResults.length}</Text> 条政策
              </Text>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <Space size={12}>
            <Button 
              icon={<EditOutlined />}
              onClick={handleBatchEdit}
              disabled={selectedPolicies.length === 0}
            >
              批量编辑
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExportData}
            >
              导出数据
            </Button>
            <Select
              value={sortType}
              onChange={setSortType}
              style={{ width: 120 }}
              suffixIcon={<SortAscendingOutlined />}
            >
              <Option value="comprehensive">综合排序</Option>
              <Option value="latest">最新发布</Option>
            </Select>
          </Space>
        </div>

        {/* 批量选择控制 */}
        {allResults.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <Checkbox
                checked={selectAll}
                indeterminate={selectedPolicies.length > 0 && selectedPolicies.length < paginatedResults.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                全选当前页
              </Checkbox>
              {selectedPolicies.length > 0 && (
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  已选择 {selectedPolicies.length} 条政策
                </Text>
              )}
            </Space>
          </div>
        )}
      </Card>

      {/* 政策列表区 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0px'
      }}>
        {paginatedResults.map((policy, index) => (
          <div key={policy.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* 选择框 */}
            <div style={{ paddingTop: '20px' }}>
              <Checkbox
                checked={selectedPolicies.includes(policy.id)}
                onChange={(e) => handleSelectPolicy(policy.id, e.target.checked)}
              />
            </div>
            
            {/* 政策卡片 */}
            <div style={{ flex: 1 }}>
              <PolicyCardExact
                policy={policy}
                searchKeywords={searchKeywords}
                onOrgClick={onOrgClick}
                className="policy-card-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onPolicyClick?.(policy.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 分页控件区 */}
      <Card 
        style={{ 
          marginTop: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* 左侧：结果统计 */}
          <Text type="secondary" style={{ fontSize: '14px' }}>
            显示第 {allResults.length === 0 ? '0-0' : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, allResults.length)}`} 条结果，共 {allResults.length} 条
          </Text>

          {/* 右侧：分页控件 */}
          {allResults.length > pageSize && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={allResults.length}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['10', '20', '50', '100']}
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default PolicyResultsComplete;
