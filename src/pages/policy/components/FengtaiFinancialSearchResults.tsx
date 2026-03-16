/**
 * 丰台区金融补贴政策搜索结果组件
 * 1:1对齐企知道样式，包含完整的筛选和分类功能
 */

import React, { useState, useMemo } from 'react';
import { 
  Row, Col, Typography, Space, Tag, Empty, Card, Button, List, 
  Select, Tabs, Breadcrumb, Input, Checkbox, Divider, Badge
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
  EyeOutlined,
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { highlightKeywords } from '../utils/keywordHighlight';
import { allFengtaiFinancialData, PolicyFileData } from '../data/fengtaiFinancialPolicies';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface FengtaiFinancialSearchResultsProps {
  searchTerm: string;
  onViewPolicyDetails?: (policyId: string) => void;
}

const FengtaiFinancialSearchResults: React.FC<FengtaiFinancialSearchResultsProps> = ({
  searchTerm,
  onViewPolicyDetails
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedRegion, setSelectedRegion] = useState<string[]>(['北京市']);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['金融业']);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 数据过滤和分类
  const filteredData = useMemo(() => {
    let filtered = allFengtaiFinancialData;

    // 根据选中的筛选条件过滤
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(item => selectedLevels.includes(item.level));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => 
        item.tags.some(tag => selectedTypes.includes(tag.text))
      );
    }

    return filtered;
  }, [selectedLevels, selectedTypes]);

  // 按类型分类数据
  const categorizedData = useMemo(() => {
    const policies = filteredData.filter(item => item.policyType === 'policy');
    const projects = filteredData.filter(item => item.policyType === 'project');
    
    return {
      all: filteredData,
      policies,
      projects,
      companies: [] // 扶持企业暂时为空
    };
  }, [filteredData]);

  // 获取当前显示的数据
  const currentData = useMemo(() => {
    const data = categorizedData[activeTab as keyof typeof categorizedData] || [];
    
    // 排序
    if (sortBy === 'date') {
      return [...data].sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    }
    
    return data;
  }, [categorizedData, activeTab, sortBy]);

  // 重置筛选条件
  const resetFilters = () => {
    setSelectedRegion(['北京市']);
    setSelectedIndustries(['金融业']);
    setSelectedLevels([]);
    setSelectedTypes([]);
    setSortBy('default');
  };

  // 获取政府机构图标
  const getOrgIcon = (orgName: string) => {
    if (orgName.includes('金融服务办公室')) return '🏦';
    if (orgName.includes('发展和改革委员会')) return '📈';
    if (orgName.includes('人民政府')) return '🏛️';
    return '🏢';
  };

  // 渲染政策卡片
  const renderPolicyCard = (policy: PolicyFileData) => (
    <Card
      key={policy.id}
      style={{
        marginBottom: 16,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      hoverable
      styles={{ body: { padding: '20px 24px' } }}
    >
      {/* 标题和标签 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              lineHeight: '24px',
              flex: 1,
              marginRight: 16
            }}
          >
            {highlightKeywords(policy.title, ['丰台区', '金融', '补贴', '政策'])}
          </Title>
          
          {/* 政策类型标识 */}
          <div style={{
            backgroundColor: policy.policyType === 'project' ? '#52c41a' : '#1890ff',
            color: 'white',
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: '12px',
            fontWeight: 500
          }}>
            {policy.policyType === 'project' ? '相关项目' : '政策文件'}
          </div>
        </div>

        {/* 标签区域 */}
        <Space wrap size={[8, 8]}>
          {policy.tags.map((tag, index) => (
            <Tag
              key={index}
              color={tag.color}
              style={{
                backgroundColor: tag.bgColor,
                border: `1px solid ${tag.color}`,
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {tag.text}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 原文标题 */}
      <div style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
          原文标题：{highlightKeywords(policy.originalTitle, ['丰台区', '金融', '补贴', '政策'])}
        </Text>
      </div>

      {/* 正文内容摘要 */}
      <Paragraph
        style={{
          color: '#666',
          fontSize: '14px',
          lineHeight: '22px',
          marginBottom: 16
        }}
        ellipsis={{ rows: 2, expandable: false }}
      >
        {highlightKeywords(policy.content, ['丰台区', '金融', '补贴', '政策', '金融服务办公室', '金融科技'])}
      </Paragraph>

      {/* 核心信息 */}
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {/* 资助信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              <span style={{ color: '#1890ff', fontWeight: 500 }}>资助总额:</span> {policy.fundingAmount}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              <span style={{ color: '#52c41a', fontWeight: 500 }}>最高奖励:</span> {policy.maxReward}
            </Text>
          </div>

          {/* 适用行业 */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: '14px', color: '#666', minWidth: 70 }}>适用行业:</Text>
            <div style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                {highlightKeywords(policy.applicableIndustries.join('；'), ['金融', '保险', '证券', '银行'])}
              </Text>
            </div>
          </div>

          {/* 项目特有信息 */}
          {policy.policyType === 'project' && policy.applicationConditions && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: '14px', color: '#666', minWidth: 70 }}>申报条件:</Text>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  {policy.applicationConditions.slice(0, 2).join('；')}...
                </Text>
              </div>
            </div>
          )}
        </Space>
      </div>

      {/* 底部信息 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTop: '1px solid #f5f5f5'
      }}>
        <Space size={16}>
          {/* 发布机构 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', marginRight: 6 }}>
              {getOrgIcon(policy.publishOrg)}
            </span>
            <Text style={{ fontSize: '13px', color: '#666' }}>
              {highlightKeywords(policy.publishOrg, ['丰台区', '金融服务办公室'])}
            </Text>
          </div>

          {/* 发布日期 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarOutlined style={{ color: '#999', marginRight: 4, fontSize: '12px' }} />
            <Text style={{ fontSize: '13px', color: '#666' }}>
              {policy.publishDate}
            </Text>
          </div>

          {/* 适用区域 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ color: '#999', marginRight: 4, fontSize: '12px' }} />
            <Text style={{ fontSize: '13px', color: '#666' }}>
              {highlightKeywords(policy.district, ['丰台区'])}
            </Text>
          </div>
        </Space>

        {/* 查看详情按钮 */}
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          style={{
            borderRadius: 6,
            fontSize: '13px',
            height: 32
          }}
          onClick={() => onViewPolicyDetails?.(policy.id)}
        >
          查看详情
        </Button>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '20px 0' }}>
      {/* 顶部搜索栏 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Input
              value={searchTerm}
              placeholder="请输入搜索关键词"
              style={{
                flex: 1,
                marginRight: 12,
                borderRadius: 6
              }}
              prefix={<SearchOutlined />}
              readOnly
            />
            <Button type="primary" style={{ borderRadius: 6 }}>
              马上知道
            </Button>
          </div>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          直接查看 <Text style={{ color: '#1890ff', fontWeight: 500 }}>'{searchTerm}'</Text> 搜索结果
        </div>
      </div>

      {/* 已选条件栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 6,
        marginBottom: 16
      }}>
        <Space>
          <Text style={{ fontSize: '14px', color: '#666' }}>
            关键词：<Text style={{ color: '#1890ff', fontWeight: 500 }}>{searchTerm}</Text>
          </Text>
        </Space>
        <Button 
          size="small" 
          icon={<ReloadOutlined />}
          onClick={resetFilters}
        >
          重置筛选
        </Button>
      </div>

      <Row gutter={24}>
        {/* 左侧筛选区 */}
        <Col xs={24} lg={6}>
          <Card 
            title="筛选条件" 
            size="small"
            style={{ marginBottom: 16 }}
            extra={<FilterOutlined />}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* 省份地区 */}
              <div>
                <Text style={{ fontSize: '14px', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  省份地区
                </Text>
                <Checkbox.Group
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                >
                  <Space direction="vertical">
                    <Checkbox value="北京市">北京市</Checkbox>
                  </Space>
                </Checkbox.Group>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* 行业 */}
              <div>
                <Text style={{ fontSize: '14px', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  行业
                </Text>
                <Checkbox.Group
                  value={selectedIndustries}
                  onChange={setSelectedIndustries}
                >
                  <Space direction="vertical">
                    <Checkbox value="金融业">金融业</Checkbox>
                    <Checkbox value="保险业">保险业</Checkbox>
                    <Checkbox value="银行业">银行业</Checkbox>
                    <Checkbox value="证券业">证券业</Checkbox>
                  </Space>
                </Checkbox.Group>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* 更多筛选 */}
              <div>
                <Text style={{ fontSize: '14px', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  级别
                </Text>
                <Checkbox.Group
                  value={selectedLevels}
                  onChange={setSelectedLevels}
                >
                  <Space direction="vertical">
                    <Checkbox value="区级">区级</Checkbox>
                    <Checkbox value="市级">市级</Checkbox>
                    <Checkbox value="国家级">国家级</Checkbox>
                  </Space>
                </Checkbox.Group>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* 政策类型 */}
              <div>
                <Text style={{ fontSize: '14px', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  政策类型
                </Text>
                <Checkbox.Group
                  value={selectedTypes}
                  onChange={setSelectedTypes}
                >
                  <Space direction="vertical">
                    <Checkbox value="产业规划">产业规划</Checkbox>
                    <Checkbox value="申报通知">申报通知</Checkbox>
                    <Checkbox value="奖励文件">奖励文件</Checkbox>
                    <Checkbox value="扶持政策">扶持政策</Checkbox>
                  </Space>
                </Checkbox.Group>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 右侧结果区 */}
        <Col xs={24} lg={18}>
          {/* 结果分类标签 */}
          <div style={{ marginBottom: 16 }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'all',
                  label: `全部 (${categorizedData.all.length})`,
                },
                {
                  key: 'policies',
                  label: (
                    <span>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      政策文件 ({categorizedData.policies.length})
                    </span>
                  ),
                },
                {
                  key: 'projects',
                  label: (
                    <span>
                      <ProjectOutlined style={{ marginRight: 4 }} />
                      相关项目 ({categorizedData.projects.length})
                    </span>
                  ),
                },
                {
                  key: 'companies',
                  label: (
                    <span>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      扶持企业 (0)
                    </span>
                  ),
                }
              ]}
            />
          </div>

          {/* 排序和筛选 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 16,
            padding: '12px 16px',
            backgroundColor: '#fafafa',
            borderRadius: 6
          }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              为您找到相关{activeTab === 'policies' ? '政策' : activeTab === 'projects' ? '项目' : '结果'} 
              <Text style={{ color: '#1890ff', fontWeight: 600, margin: '0 4px' }}>
                {currentData.length}
              </Text> 
              条
            </Text>
            
            <Space>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="default">默认排序</Option>
                <Option value="date">按时间排序</Option>
                <Option value="relevance">按相关度</Option>
              </Select>
            </Space>
          </div>

          {/* 政策列表 */}
          <div>
            {currentData.length > 0 ? (
              currentData.map(renderPolicyCard)
            ) : (
              <Empty
                description={
                  <div>
                    <Text style={{ fontSize: '16px', color: '#666' }}>
                      暂无符合条件的{activeTab === 'policies' ? '政策' : activeTab === 'projects' ? '项目' : '结果'}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '14px', color: '#999' }}>
                      请尝试调整筛选条件
                    </Text>
                  </div>
                }
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FengtaiFinancialSearchResults;
