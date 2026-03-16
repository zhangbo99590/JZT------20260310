/**
 * 璟智通政策搜索模块 - 增强版搜索结果展示组件
 * 对标企知道搜索结果页面，实现结构化展示、分类标签、高亮显示等功能
 */

import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Tag, 
  Button, 
  Select, 
  Tabs, 
  Badge, 
  Typography, 
  Space, 
  Divider, 
  Empty,
  Pagination,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  FileTextOutlined, 
  CalendarOutlined, 
  BankOutlined, 
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 政策数据接口
interface PolicyItem {
  id: string;
  title: string;
  originalTitle?: string;
  summary: string;
  tags?: string[];
  level?: string;
  category?: string;
  publishOrg?: string;
  publishDate?: string;
  amount?: string;
  approvedCompanies?: number;
  subsidyAmount?: {
    central?: number;
    provincial?: number;
    municipal?: number;
    district?: number;
  };
  district?: string;
  industry?: string;
  matchScore?: number;
  [key: string]: any;
}

interface PolicySearchResultsEnhancedProps {
  results: PolicyItem[];
  loading?: boolean;
  searchKeywords?: string[];
  totalCount?: number;
  onApply?: (policyId: string) => void;
  className?: string;
}

// 关键词高亮函数
const highlightKeywords = (text: string, keywords: string[]): React.ReactNode => {
  if (!keywords || keywords.length === 0 || !text) return text;
  
  let highlightedText: React.ReactNode = text;
  keywords.forEach((keyword, index) => {
    const parts = String(highlightedText).split(new RegExp(`(${keyword})`, 'gi'));
    highlightedText = parts.map((part, i) => 
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={`${index}-${i}`} style={{ color: '#ff4d4f', fontWeight: 'bold', backgroundColor: '#fff1f0' }}>
          {part}
        </span>
      ) : part
    );
  });
  
  return highlightedText;
};

// 获取标签颜色
const getTagColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    '国家级': 'red',
    '省级': 'orange',
    '市级': 'blue',
    '区级': 'green',
    '县级': 'cyan',
    '政策资讯': 'purple',
    '政策文件': 'geekblue',
    '相关项目': 'magenta',
    '扶持企业': 'volcano'
  };
  return colorMap[type] || 'default';
};

const PolicySearchResultsEnhanced: React.FC<PolicySearchResultsEnhancedProps> = ({
  results = [],
  loading = false,
  searchKeywords = [],
  totalCount = 0,
  onApply,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'default' | 'date' | 'amount'>('default');
  const [filterType, setFilterType] = useState<'all' | 'policy' | 'project' | 'company'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'policy' | 'project' | 'company'>('all');

  // 计算统计数据
  const statistics = useMemo(() => {
    const totalApprovedCompanies = results.reduce((sum, item) => sum + (item.approvedCompanies || 0), 0);
    const totalSubsidy = results.reduce((sum, item) => {
      const subsidy = item.subsidyAmount;
      if (subsidy) {
        return sum + (subsidy.central || 0) + (subsidy.provincial || 0) + (subsidy.municipal || 0) + (subsidy.district || 0);
      }
      return sum;
    }, 0);

    const policyCount = results.filter(r => r.category === '政策文件' || r.category === '政策资讯').length;
    const projectCount = results.filter(r => r.category === '相关项目').length;
    const companyCount = results.filter(r => r.category === '扶持企业').length;

    return {
      totalApprovedCompanies,
      totalSubsidy,
      policyCount,
      projectCount,
      companyCount,
      centralSubsidy: results.reduce((sum, item) => sum + (item.subsidyAmount?.central || 0), 0),
      provincialSubsidy: results.reduce((sum, item) => sum + (item.subsidyAmount?.provincial || 0), 0),
      municipalSubsidy: results.reduce((sum, item) => sum + (item.subsidyAmount?.municipal || 0), 0),
      districtSubsidy: results.reduce((sum, item) => sum + (item.subsidyAmount?.district || 0), 0)
    };
  }, [results]);

  // 筛选和排序结果
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // 按类型筛选
    if (filterType !== 'all') {
      const typeMap: Record<string, string[]> = {
        'policy': ['政策文件', '政策资讯'],
        'project': ['相关项目'],
        'company': ['扶持企业']
      };
      filtered = filtered.filter(item => typeMap[filterType]?.includes(item.category || ''));
    }

    // 排序
    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.publishDate || '').getTime();
        const dateB = new Date(b.publishDate || '').getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => {
        const amountA = a.subsidyAmount ? 
          (a.subsidyAmount.central || 0) + (a.subsidyAmount.provincial || 0) + 
          (a.subsidyAmount.municipal || 0) + (a.subsidyAmount.district || 0) : 0;
        const amountB = b.subsidyAmount ? 
          (b.subsidyAmount.central || 0) + (b.subsidyAmount.provincial || 0) + 
          (b.subsidyAmount.municipal || 0) + (b.subsidyAmount.district || 0) : 0;
        return amountB - amountA;
      });
    }

    return filtered;
  }, [results, filterType, sortBy]);

  // 分页数据
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedResults.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedResults, currentPage, pageSize]);

  // 空状态 - 只在非加载状态且确实没有结果时显示
  if (!loading && (!results || results.length === 0) && totalCount === 0) {
    return (
      <div className={`bg-white rounded-lg p-8 ${className}`}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                未找到符合条件的政策，请调整筛选条件后重试
              </Text>
            </div>
          }
        />
      </div>
    );
  }

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className={`${className}`} style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
        <div>正在搜索政策...</div>
      </div>
    );
  }

  // 如果没有结果但不应该显示空状态，返回null
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`} style={{ width: '100%' }}>
      {/* 结果头部信息 - 对标企知道 */}
      {results.length > 0 && (
        <Card 
          className="mb-4 shadow-sm"
          style={{ 
            borderRadius: '8px', 
            border: '1px solid #e8e8e8',
            width: '100%'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>政策总数</span>}
                value={totalCount || results.length}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>已获批企业</span>}
                value={statistics.totalApprovedCompanies}
                suffix="家"
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>补贴金额（汇总）</span>}
                value={statistics.totalSubsidy}
                suffix="万元"
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<CheckCircleOutlined />}
                  style={{ 
                    backgroundColor: '#52c41a', 
                    borderColor: '#52c41a',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)'
                  }}
                  onClick={() => onApply?.('batch')}
                >
                  立即申报
                </Button>
              </div>
            </Col>
          </Row>

          {/* 补贴金额明细 */}
          {statistics.totalSubsidy > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              <Space size="large" wrap>
                {statistics.centralSubsidy > 0 && (
                  <Text type="secondary">
                    中央财政: <Text strong style={{ color: '#1890ff' }}>{statistics.centralSubsidy}万元</Text>
                  </Text>
                )}
                {statistics.provincialSubsidy > 0 && (
                  <Text type="secondary">
                    省级财政: <Text strong style={{ color: '#52c41a' }}>{statistics.provincialSubsidy}万元</Text>
                  </Text>
                )}
                {statistics.municipalSubsidy > 0 && (
                  <Text type="secondary">
                    市级财政: <Text strong style={{ color: '#faad14' }}>{statistics.municipalSubsidy}万元</Text>
                  </Text>
                )}
                {statistics.districtSubsidy > 0 && (
                  <Text type="secondary">
                    区级财政: <Text strong style={{ color: '#722ed1' }}>{statistics.districtSubsidy}万元</Text>
                  </Text>
                )}
              </Space>
            </div>
          )}
        </Card>
      )}

      {/* 结果分类标签 - 对标企知道 */}
      <Card 
        className="mb-4"
        style={{ 
          borderRadius: '8px', 
          border: '1px solid #e8e8e8',
          width: '100%'
        }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '12px'
        }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={(key) => {
              setActiveTab(key as any);
              setFilterType(key as any);
              setCurrentPage(1);
            }}
            size="large"
            style={{ 
              marginBottom: 0,
              flex: 1,
              minWidth: '300px'
            }}
          >
            <TabPane 
              tab={<span style={{ fontSize: '15px' }}>全部 <Badge count={results.length} style={{ backgroundColor: '#1890ff', marginLeft: '8px' }} /></span>} 
              key="all" 
            />
            <TabPane 
              tab={<span style={{ fontSize: '15px' }}>政策文件 <Badge count={statistics.policyCount} style={{ backgroundColor: '#52c41a', marginLeft: '8px' }} /></span>} 
              key="policy" 
            />
            <TabPane 
              tab={<span style={{ fontSize: '15px' }}>相关项目 <Badge count={statistics.projectCount} style={{ backgroundColor: '#faad14', marginLeft: '8px' }} /></span>} 
              key="project" 
            />
            <TabPane 
              tab={<span style={{ fontSize: '15px' }}>扶持企业 <Badge count={statistics.companyCount} style={{ backgroundColor: '#722ed1', marginLeft: '8px' }} /></span>} 
              key="company" 
            />
          </Tabs>

          <Space wrap>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 140, minWidth: '120px' }}
              size="middle"
            >
              <Option value="default">默认排序</Option>
              <Option value="date">按时间排序</Option>
              <Option value="amount">按金额排序</Option>
            </Select>
          </Space>
        </div>
      </Card>

      {/* 政策列表结构化展示 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paginatedResults.map((policy, index) => (
          <Card
            key={policy.id}
            hoverable
            className="shadow-sm hover:shadow-md transition-all duration-300"
            style={{ 
              borderRadius: '8px', 
              border: '1px solid #e8e8e8',
              cursor: 'pointer',
              width: '100%'
            }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 标题行 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Title 
                      level={5} 
                      style={{ 
                        margin: 0, 
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#262626',
                        lineHeight: '24px'
                      }}
                    >
                      {highlightKeywords(policy.title, searchKeywords)}
                    </Title>
                  </div>
                  
                  {/* 标签行 */}
                  <Space size={[8, 8]} wrap style={{ marginBottom: '8px' }}>
                    {policy.level && (
                      <Tag color={getTagColor(policy.level)} style={{ margin: 0, fontSize: '12px', padding: '2px 8px' }}>
                        {policy.level}
                      </Tag>
                    )}
                    {policy.category && (
                      <Tag color={getTagColor(policy.category)} style={{ margin: 0, fontSize: '12px', padding: '2px 8px' }}>
                        {policy.category}
                      </Tag>
                    )}
                    {policy.tags?.map((tag, idx) => (
                      <Tag key={idx} style={{ margin: 0, fontSize: '12px', padding: '2px 8px' }}>
                        {tag}
                      </Tag>
                    ))}
                    {policy.matchScore && policy.matchScore > 80 && (
                      <Tag color="success" style={{ margin: 0, fontSize: '12px', padding: '2px 8px' }}>
                        匹配度 {policy.matchScore}%
                      </Tag>
                    )}
                  </Space>
                </div>

                {/* 申报按钮 */}
                <Button 
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply?.(policy.id);
                  }}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '4px',
                    fontWeight: 500
                  }}
                >
                  立即申报
                </Button>
              </div>

              {/* 原文标题 */}
              {policy.originalTitle && policy.originalTitle !== policy.title && (
                <div style={{ paddingLeft: '12px', borderLeft: '3px solid #e8e8e8' }}>
                  <Text type="secondary" style={{ fontSize: '13px', lineHeight: '20px' }}>
                    原文标题: {highlightKeywords(policy.originalTitle, searchKeywords)}
                  </Text>
                </div>
              )}

              {/* 正文摘要 */}
              <Paragraph 
                ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#595959',
                  lineHeight: '22px'
                }}
              >
                {highlightKeywords(policy.summary, searchKeywords)}
              </Paragraph>

              <Divider style={{ margin: '12px 0' }} />

              {/* 底部信息栏 */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <Space size="large" wrap>
                  {policy.publishOrg && (
                    <Tooltip title="发布单位">
                      <Space size={4}>
                        <BankOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {policy.publishOrg}
                        </Text>
                      </Space>
                    </Tooltip>
                  )}
                  {policy.publishDate && (
                    <Tooltip title="发布日期">
                      <Space size={4}>
                        <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {policy.publishDate}
                        </Text>
                      </Space>
                    </Tooltip>
                  )}
                  {policy.district && (
                    <Tooltip title="适用区域">
                      <Space size={4}>
                        <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {policy.district}
                        </Text>
                      </Space>
                    </Tooltip>
                  )}
                  {policy.approvedCompanies && policy.approvedCompanies > 0 && (
                    <Tooltip title="已获批企业数">
                      <Space size={4}>
                        <TeamOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                        <Text style={{ fontSize: '13px', color: '#52c41a', fontWeight: 500 }}>
                          已有 {policy.approvedCompanies} 家企业获批
                        </Text>
                      </Space>
                    </Tooltip>
                  )}
                </Space>

                <Button 
                  type="link" 
                  icon={<RightOutlined />}
                  iconPosition="end"
                  style={{ padding: '4px 8px', fontSize: '13px' }}
                >
                  查看详情
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 分页 */}
      {filteredAndSortedResults.length > pageSize && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredAndSortedResults.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条结果`}
            pageSizeOptions={['10', '20', '50', '100']}
            style={{ marginTop: '20px' }}
          />
        </div>
      )}
    </div>
  );
};

export default PolicySearchResultsEnhanced;
