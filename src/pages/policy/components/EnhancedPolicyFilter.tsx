/**
 * 璟智通政策搜索模块 - 优化版筛选组件
 * 参考企知道搜索功能，实现区域+行业筛选结果精准匹配
 * 支持重置筛选、查一下按钮功能与场景关联
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Tag, Space, Tooltip, Badge, Spin, Alert, message } from 'antd';
import { 
  DownOutlined, 
  UpOutlined, 
  FilterOutlined, 
  ReloadOutlined,
  SearchOutlined,
  LoadingOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useFilterManager } from '../hooks/useFilterManager';
import { FilterType, FilterOperator } from '../types/filterTypes';
import { mockPolicies } from '../data/mockPolicies';
import MoreFiltersModal from './MoreFiltersModal';
import SearchErrorHandler, { SearchErrorType } from '../services/searchErrorHandler';

// 北京市行政区域数据
const BEIJING_DISTRICTS = [
  '东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区',
  '通州区', '顺义区', '昌平区', '大兴区', '房山区', '门头沟区',
  '怀柔区', '平谷区', '密云区', '延庆区'
];

// 高频行政区域（默认展示）
const HIGH_FREQUENCY_DISTRICTS = [
  '东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区'
];

// 行业筛选数据 - 扩展版本，支持更多行业分类
const INDUSTRIES = [
  {
    category: '城乡建设与生态环境',
    subcategories: [
      '城乡建设、环境保护 / 节能与资源综合利用',
      '城乡建设、环境保护 / 城市规划',
      '环境保护 / 污染防治',
      '城市建设 / 基础设施'
    ]
  },
  {
    category: '科技创新与教育',
    subcategories: [
      '科技、教育 / 科技',
      '科技创新 / 研发投入',
      '教育培训 / 人才培养',
      '技术转移 / 成果转化'
    ]
  },
  {
    category: '综合政务与监管',
    subcategories: [
      '综合政务 / 安全生产监管 / 其他',
      '市场监管、安全生产监管 / 其他',
      '综合政务 / 政务公开',
      '行政审批 / 简政放权'
    ]
  },
  {
    category: '工业与交通',
    subcategories: [
      '工业、交通 / 信息产业（含电信）',
      '工业、交通 / 公路',
      '工业、交通 / 其他',
      '制造业 / 智能制造',
      '交通运输 / 物流配送'
    ]
  },
  {
    category: '财政金融与审计',
    subcategories: [
      '财政、金融、审计 / 其他',
      '金融服务 / 融资担保',
      '财政支持 / 专项资金',
      '税收优惠 / 减免政策'
    ]
  },
  {
    category: '商贸、海关与旅游',
    subcategories: [
      '商贸、海关、旅游 / 旅游',
      '对外贸易 / 进出口',
      '电子商务 / 数字经济',
      '文化旅游 / 产业发展'
    ]
  }
];

// 更多筛选维度 - 扩展功能
const ADDITIONAL_FILTERS = {
  level: ['国家级', '省级', '市级', '区级', '县级'],
  policyOrg: ['发改委', '科技局', '工信局', '财政局', '人社局', '商务局', '文旅局'],
  hotPolicies: ['高新技术企业认定', '专精特新', '研发费用加计扣除', '稳岗补贴', '创业担保贷款']
};

interface EnhancedPolicyFilterProps {
  onFilterChange?: (filters: any) => void;
  onSearchExecuted?: (results: any) => void;
  searchKeyword?: string;
  className?: string;
}

const EnhancedPolicyFilter: React.FC<EnhancedPolicyFilterProps> = ({ 
  onFilterChange, 
  onSearchExecuted,
  searchKeyword = '',
  className 
}) => {
  // 使用筛选管理Hook - 添加错误边界
  const filterManagerResult = useFilterManager(mockPolicies, {
    autoSave: true,
    debounceMs: 300,
    enablePerformanceMonitoring: true
  });
  
  // 安全解构，防止hook返回undefined
  const {
    filterState = { conditions: [], lastUpdated: Date.now() },
    searchResults = null,
    isSearching = false,
    performanceMetrics = { queryTime: 0, renderTime: 0, memoryUsage: 0, cacheHitRate: 0, errorRate: 0 },
    hasUnsavedChanges = false,
    addFilter = () => null,
    removeFilter = () => false,
    resetFilters = () => {},
    executeSearch = () => Promise.resolve(),
    getFilterStats = () => ({ totalConditions: 0, activeConditions: 0, resultCount: 0, lastUpdated: Date.now(), hasResults: false, isLoading: false })
  } = filterManagerResult || {};

  // 本地状态
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [moreFiltersVisible, setMoreFiltersVisible] = useState(false);
  const [selectedMoreFilters, setSelectedMoreFilters] = useState<Record<string, string[]>>({});
  const [isExecutingSearch, setIsExecutingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [resultCount, setResultCount] = useState<number>(0);
  const [currentSearchId, setCurrentSearchId] = useState<string>('');
  
  // 错误处理服务
  const errorHandler = useRef(SearchErrorHandler.getInstance());
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 计算显示的选项
  const displayedDistricts = useMemo(() => 
    showAllDistricts ? BEIJING_DISTRICTS : HIGH_FREQUENCY_DISTRICTS,
    [showAllDistricts]
  );

  const displayedIndustries = useMemo(() => 
    showAllIndustries 
      ? INDUSTRIES.flatMap(cat => cat.subcategories)
      : INDUSTRIES.slice(0, 3).flatMap(cat => cat.subcategories),
    [showAllIndustries]
  );

  // 获取筛选统计
  const filterStats = useMemo(() => getFilterStats(), [getFilterStats]);

  // 处理行政区域选择
  const handleDistrictSelect = (district: string) => {
    const newSelected = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district];
    
    setSelectedDistricts(newSelected);
    
    // 更新筛选服务
    if (newSelected.length > 0) {
      addFilter({
        type: FilterType.DISTRICT,
        value: newSelected,
        label: `北京市行政区域: ${newSelected.join(', ')}`,
        operator: FilterOperator.IN,
        isActive: true,
        priority: 2
      });
    } else {
      // 移除区域筛选条件
      const districtConditions = filterState.conditions.filter(c => c.type === FilterType.DISTRICT);
      districtConditions.forEach(condition => removeFilter(condition.id));
    }

    // 通知父组件
    const filters = {
      beijingDistricts: newSelected,
      industries: selectedIndustries,
      moreFilters: selectedMoreFilters
    };
    onFilterChange?.(filters);
  };

  // 处理行业选择
  const handleIndustrySelect = (industry: string) => {
    const newSelected = selectedIndustries.includes(industry)
      ? selectedIndustries.filter(i => i !== industry)
      : [...selectedIndustries, industry];
    
    setSelectedIndustries(newSelected);
    
    // 更新筛选服务
    if (newSelected.length > 0) {
      addFilter({
        type: FilterType.INDUSTRY,
        value: newSelected,
        label: `行业筛选: ${newSelected.join(', ')}`,
        operator: FilterOperator.IN,
        isActive: true,
        priority: 3
      });
    } else {
      // 移除行业筛选条件
      const industryConditions = filterState.conditions.filter(c => c.type === FilterType.INDUSTRY);
      industryConditions.forEach(condition => removeFilter(condition.id));
    }

    // 通知父组件
    const filters = {
      beijingDistricts: selectedDistricts,
      industries: newSelected,
      moreFilters: selectedMoreFilters
    };
    onFilterChange?.(filters);
  };

  // 重置所有筛选 - 企知道风格的完整重置功能
  const handleReset = () => {
    // 1. 清除所有已选筛选条件
    setSelectedDistricts([]);
    setSelectedIndustries([]);
    setSelectedMoreFilters({});
    
    // 2. 重置筛选服务状态
    resetFilters();
    
    // 3. 清空搜索关键词（通过父组件）
    onFilterChange?.({
      beijingDistricts: [],
      industries: [],
      moreFilters: {},
      clearKeyword: true  // 通知父组件清空搜索框
    });
    
    // 4. 重置结果数量和错误状态
    setResultCount(0);
    setSearchError('');
    setIsExecutingSearch(false);
    
    // 5. 清除当前搜索ID和超时
    setCurrentSearchId('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // 6. 重置错误处理器状态
    errorHandler.current.reset();
    
    // 7. 通知父组件清空结果区
    onSearchExecuted?.({
      total: 0,
      items: [],
      facets: [],
      executionTime: 0,
      hasMore: false
    });
    
    // 8. 重置展开状态
    setShowAllDistricts(false);
    setShowAllIndustries(false);
    
    // 9. 用户反馈
    message.success('已重置所有筛选条件，页面回到初始状态');
  };

  // "查一下"功能 - 企知道风格的核心交互逻辑
  const handleQuickSearch = async () => {
    // 生成唯一搜索ID防止重复提交
    const searchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 如果已有搜索在进行，取消之前的搜索
    if (currentSearchId && isExecutingSearch) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      return;
    }
    
    setCurrentSearchId(searchId);
    setSearchError('');
    setIsExecutingSearch(true);
    
    try {
      // 构建搜索参数
      const searchParams = {
        keyword: searchKeyword?.trim() || '',
        areas: selectedDistricts,
        industries: selectedIndustries,
        moreFilters: selectedMoreFilters
      };
      
      // 参数验证
      const validation = errorHandler.current.validateSearchParams(searchParams);
      if (!validation.isValid && validation.error) {
        const shouldShow = errorHandler.current.shouldShowError(validation.error);
        if (shouldShow) {
          setSearchError(validation.error.message);
          message.error(validation.error.message);
        }
        return;
      }
      
      // 格式化参数确保正确传递
      const formattedParams = errorHandler.current.formatSearchParams(searchParams);
      
      // 先重置筛选条件，避免累积旧的筛选
      resetFilters();

      // 添加区域筛选条件 - 确保数组格式
      if (formattedParams.area.length > 0) {
        addFilter({
          type: FilterType.DISTRICT,
          value: formattedParams.area,
          label: `区域: ${formattedParams.area.join(', ')}`,
          operator: FilterOperator.IN,
          isActive: true,
          priority: 2
        });
      }

      // 添加行业筛选条件 - 确保数组格式
      if (formattedParams.industry.length > 0) {
        addFilter({
          type: FilterType.INDUSTRY,
          value: formattedParams.industry,
          label: `行业: ${formattedParams.industry.join(', ')}`,
          operator: FilterOperator.IN,
          isActive: true,
          priority: 2
        });
      }

      // 如果有搜索关键词，添加关键词筛选条件
      if (formattedParams.keyword) {
        addFilter({
          type: FilterType.KEYWORD,
          value: formattedParams.keyword,
          label: `关键词: ${formattedParams.keyword}`,
          operator: FilterOperator.CONTAINS,
          isActive: true,
          priority: 1
        });
      }

      // 设置搜索超时
      searchTimeoutRef.current = setTimeout(() => {
        if (currentSearchId === searchId && isExecutingSearch) {
          const timeoutError = errorHandler.current.parseError({
            code: 'NETWORK_ERROR',
            message: 'timeout'
          });
          
          if (errorHandler.current.shouldShowError(timeoutError)) {
            setSearchError(timeoutError.message);
            message.error(timeoutError.message);
          }
          
          setIsExecutingSearch(false);
          setCurrentSearchId('');
        }
      }, 10000); // 10秒超时

      // 等待一小段时间确保所有筛选条件都已添加
      await new Promise(resolve => setTimeout(resolve, 100));

      // 执行搜索并等待结果
      await executeSearch();
      
      // 清除超时
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // 只有当前搜索ID匹配时才显示成功消息
      if (currentSearchId === searchId) {
        message.success('搜索完成，正在为您展示结果');
      }
      
    } catch (error) {
      console.error('Quick search failed:', error);
      
      // 使用错误处理器解析错误
      const parsedError = errorHandler.current.parseError(error);
      
      // 检查是否应该显示错误（防重复）
      if (errorHandler.current.shouldShowError(parsedError)) {
        setSearchError(parsedError.message);
        message.error(parsedError.message);
      }
      
      setResultCount(0);
    } finally {
      // 只有当前搜索ID匹配时才重置状态
      if (currentSearchId === searchId) {
        setIsExecutingSearch(false);
        setCurrentSearchId('');
      }
      
      // 清除超时
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  // 获取已选筛选条件总数
  const getTotalSelectedCount = () => {
    return selectedDistricts.length + 
           selectedIndustries.length + 
           Object.values(selectedMoreFilters).flat().length;
  };

  // 检查"查一下"按钮是否可点击
  const hasFilterConditions = selectedDistricts.length > 0 || 
                              selectedIndustries.length > 0 || 
                              searchKeyword.trim().length > 0;
  const shouldShowQuickSearchButton = getTotalSelectedCount() > 0 || searchKeyword.trim().length > 0;
  const isQuickSearchDisabled = !hasFilterConditions || isExecutingSearch || isSearching || !!currentSearchId;

  // 监听搜索结果变化 - 添加安全检查
  useEffect(() => {
    if (searchResults && typeof onSearchExecuted === 'function') {
      try {
        onSearchExecuted(searchResults);
      } catch (error) {
        console.error('Error in onSearchExecuted callback:', error);
      }
    }
  }, [searchResults, onSearchExecuted]);
  
  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // 重置错误处理器
      if (errorHandler.current) {
        errorHandler.current.reset();
      }
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`} style={{ padding: '20px' }}>
      {/* 筛选控件标题和重置按钮 - 企知道风格 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <FilterOutlined className="text-blue-600 text-lg" />
          <span className="font-medium text-gray-800 text-base">筛选条件</span>
          {getTotalSelectedCount() > 0 && (
            <Badge 
              count={getTotalSelectedCount()} 
              style={{ 
                backgroundColor: '#1890ff',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            />
          )}
          {/* 实时结果数量显示 */}
          <span className="text-sm text-gray-500">
            找到 <span className="font-medium text-blue-600">{resultCount}</span> 条结果
          </span>
        </div>
        
        {/* 重置筛选按钮 - 固定在右上角，企知道风格 */}
        <Button 
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleReset}
          style={{
            border: '1px solid #d9d9d9',
            color: '#666666',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            fontSize: '12px',
            height: '28px',
            padding: '0 12px'
          }}
          className="hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          重置筛选
        </Button>
      </div>

      {/* 错误提示 */}
      {searchError && (
        <Alert
          message="搜索失败"
          description={searchError}
          type="error"
          showIcon
          closable
          onClose={() => setSearchError('')}
          className="mb-4"
        />
      )}

      {/* 性能监控提示 */}
      {performanceMetrics.queryTime > 1000 && (
        <Alert
          message="筛选性能提示"
          description={`当前查询耗时 ${performanceMetrics.queryTime.toFixed(0)}ms，建议优化筛选条件`}
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {/* 第一行：北京市行政区域筛选 */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-700">北京市行政区域</span>
          <span className="text-xs text-gray-400">支持多选</span>
          {selectedDistricts.length > 0 && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              已选 {selectedDistricts.length} 个
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {displayedDistricts.map(district => (
            <Tag
              key={district}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedDistricts.includes(district)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
              }`}
              onClick={() => handleDistrictSelect(district)}
            >
              {district}
            </Tag>
          ))}
          <Button
            type="text"
            size="small"
            className="text-blue-600 hover:text-blue-700 font-medium"
            icon={showAllDistricts ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowAllDistricts(!showAllDistricts)}
          >
            {showAllDistricts ? '收起' : '更多'}
          </Button>
        </div>
      </div>

      {/* 第二行：行业筛选 */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">行业筛选</span>
            <span className="text-xs text-gray-400">支持多选</span>
          </div>
          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-medium">
            核心筛选
          </span>
          {selectedIndustries.length > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              已选 {selectedIndustries.length} 个
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {displayedIndustries.map(industry => (
            <Tooltip key={industry} title={industry} placement="top">
              <Tag
                className={`cursor-pointer transition-all duration-200 max-w-xs truncate hover:scale-105 ${
                  selectedIndustries.includes(industry)
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600 hover:shadow-sm'
                }`}
                onClick={() => handleIndustrySelect(industry)}
              >
                {industry.length > 20 ? `${industry.substring(0, 20)}...` : industry}
              </Tag>
            </Tooltip>
          ))}
          <Button
            type="text"
            size="small"
            className="text-blue-600 hover:text-blue-700 font-medium"
            icon={showAllIndustries ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowAllIndustries(!showAllIndustries)}
          >
            {showAllIndustries ? '收起' : '更多'}
          </Button>
        </div>
      </div>

      {/* 已选筛选条件回显和"查一下"按钮 */}
      {getTotalSelectedCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">已选筛选条件:</span>
              <span className="text-xs text-blue-600">{getTotalSelectedCount()} 个</span>
            </div>
            
            {/* "查一下"按钮 - 企知道风格，仅当有筛选条件或关键词时可点击 */}
            {shouldShowQuickSearchButton && (
              <Button
                type="primary"
                size="small"
                icon={isExecutingSearch || isSearching ? <LoadingOutlined spin /> : <SearchOutlined />}
                onClick={handleQuickSearch}
                disabled={isQuickSearchDisabled}
                loading={isExecutingSearch || isSearching}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  backgroundColor: isQuickSearchDisabled ? '#f5f5f5' : '#1890ff',
                  borderColor: isQuickSearchDisabled ? '#d9d9d9' : '#1890ff',
                  color: isQuickSearchDisabled ? '#ccc' : '#ffffff',
                  cursor: isQuickSearchDisabled ? 'not-allowed' : 'pointer',
                  opacity: isQuickSearchDisabled ? 0.6 : 1
                }}
              >
                {isExecutingSearch || isSearching ? '查询中...' : '查一下'}
              </Button>
            )}
          </div>
          
          {/* 已选条件展示 - 左对齐布局，企知道简洁矩形样式 */}
          <div className="flex flex-wrap gap-2" style={{ alignItems: 'flex-start' }}>
            {[...selectedDistricts]
              .sort((a, b) => BEIJING_DISTRICTS.indexOf(a) - BEIJING_DISTRICTS.indexOf(b))
              .map(district => (
              <Tag
                key={`district-${district}`}
                closable
                onClose={() => handleDistrictSelect(district)}
                closeIcon={<CloseOutlined style={{ fontSize: '10px', color: '#999' }} />}
                style={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666666',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  fontSize: '12px',
                  padding: '4px 10px',
                  margin: '0',
                  lineHeight: '20px'
                }}
                className="filter-tag-item"
              >
                {district}
              </Tag>
            ))}
            {selectedIndustries.map(industry => (
              <Tag
                key={`industry-${industry}`}
                closable
                onClose={() => handleIndustrySelect(industry)}
                closeIcon={<CloseOutlined style={{ fontSize: '10px', color: '#999' }} />}
                style={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666666',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                  fontSize: '12px',
                  padding: '4px 10px',
                  margin: '0',
                  lineHeight: '20px',
                  maxWidth: '200px'
                }}
                className="filter-tag-item"
              >
                <Tooltip title={industry} placement="top">
                  <span style={{ display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {industry}
                  </span>
                </Tooltip>
              </Tag>
            ))}
            {/* 显示更多筛选条件 */}
            {Object.entries(selectedMoreFilters).map(([key, values]) => 
              values.map(value => (
                <Tag
                  key={`${key}-${value}`}
                  closable
                  onClose={() => {
                    const newFilters = { ...selectedMoreFilters };
                    newFilters[key] = newFilters[key].filter(v => v !== value);
                    if (newFilters[key].length === 0) {
                      delete newFilters[key];
                    }
                    setSelectedMoreFilters(newFilters);
                  }}
                  closeIcon={<CloseOutlined style={{ fontSize: '10px', color: '#999' }} />}
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    color: '#666666',
                    border: '1px solid #d9d9d9',
                    borderRadius: '2px',
                    fontSize: '12px',
                    padding: '4px 10px',
                    margin: '0',
                    lineHeight: '20px'
                  }}
                  className="filter-tag-item"
                >
                  {value}
                </Tag>
              ))
            )}
          </div>
          
          <style>{`
            .filter-tag-item {
              transition: all 0.2s ease;
            }
            .filter-tag-item:hover {
              background-color: #e6e6e6 !important;
            }
            .filter-tag-item:hover .anticon-close {
              color: #1890ff !important;
            }
          `}</style>
        </div>
      )}

      {/* 搜索状态指示器 */}
      {(isSearching || isExecutingSearch) && (
        <div className="mt-4 flex items-center justify-center py-4">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            tip={`正在执行筛选搜索...${currentSearchId ? ` (${currentSearchId.split('_')[1]})` : ''}`}
          />
        </div>
      )}
      
      {/* 立即搜索按钮 - 在搜索框区域显示 */}
      {hasFilterConditions && !shouldShowQuickSearchButton && (
        <div className="mt-4 flex justify-center">
          <Button
            type="primary"
            size="large"
            icon={isExecutingSearch || isSearching ? <LoadingOutlined spin /> : <SearchOutlined />}
            onClick={handleQuickSearch}
            disabled={isQuickSearchDisabled}
            loading={isExecutingSearch || isSearching}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              minWidth: '120px',
              height: '40px',
              fontSize: '16px'
            }}
          >
            {isExecutingSearch || isSearching ? '查询中...' : '立即搜索'}
          </Button>
        </div>
      )}

      {/* 更多筛选弹窗 */}
      <MoreFiltersModal
        visible={moreFiltersVisible}
        onClose={() => setMoreFiltersVisible(false)}
        onConfirm={(filters) => {
          setSelectedMoreFilters(filters);
          // 这里可以添加更多筛选条件的处理逻辑
        }}
        initialFilters={selectedMoreFilters}
      />
    </div>
  );
};

export default EnhancedPolicyFilter;
