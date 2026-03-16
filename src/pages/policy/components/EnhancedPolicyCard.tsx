/**
 * 增强版政策卡片组件
 * 支持关键词高亮和企知道样式对齐
 */

import React from 'react';
import { Card, Tag, Button, Space, Typography, Avatar, Tooltip } from 'antd';
import {
  FileTextOutlined,
  CalendarOutlined,
  BankOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { EnhancedPolicyData } from '../data/enhancedPolicyData';
import { highlightKeywords } from '../utils/keywordHighlight';

const { Title, Text, Paragraph } = Typography;

interface EnhancedPolicyCardProps {
  policy: EnhancedPolicyData;
  searchKeywords?: string[];
  matchedFields?: string[];
  onViewDetails?: (policyId: string) => void;
}

const EnhancedPolicyCard: React.FC<EnhancedPolicyCardProps> = ({
  policy,
  searchKeywords = [],
  matchedFields = [],
  onViewDetails
}) => {
  // 获取政府机构图标
  const getOrgIcon = (orgName: string) => {
    if (orgName.includes('科学技术委员会') || orgName.includes('科委')) {
      return '🔬';
    } else if (orgName.includes('发展改革委') || orgName.includes('发改委')) {
      return '📈';
    } else if (orgName.includes('财政局') || orgName.includes('财政')) {
      return '💰';
    } else if (orgName.includes('工业') || orgName.includes('信息化')) {
      return '🏭';
    }
    return '🏛️';
  };

  // 获取政策摘要（模拟）
  const getPolicySummary = (policy: EnhancedPolicyData): string => {
    if (policy.category.includes('认定')) {
      return `本政策旨在推动${policy.district}地区科技型中小企业发展，通过认定程序为符合条件的企业提供政策支持和资源倾斜。`;
    } else if (policy.category.includes('奖励') || policy.category.includes('补贴')) {
      return `针对${policy.applicableIndustries.slice(0, 2).join('、')}等重点行业，提供最高${policy.maxReward}的资金支持。`;
    }
    return `${policy.category}相关政策，适用于${policy.applicableIndustries.slice(0, 2).join('、')}等行业。`;
  };

  return (
    <Card
      className="enhanced-policy-card"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease'
      }}
      hoverable
      styles={{ body: { padding: '20px 24px' } }}
    >
      {/* 政策标题和标签 */}
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
            {highlightKeywords(policy.title, searchKeywords)}
          </Title>
          
          {/* 匹配分数指示器 */}
          {policy.matchScore && policy.matchScore > 0 && (
            <Tooltip title={`匹配度: ${policy.matchScore}分`}>
              <div style={{
                backgroundColor: policy.matchScore >= 8 ? '#52c41a' : policy.matchScore >= 5 ? '#faad14' : '#1890ff',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 12,
                fontSize: '12px',
                fontWeight: 500
              }}>
                {policy.matchScore >= 8 ? '高度匹配' : policy.matchScore >= 5 ? '中度匹配' : '相关'}
              </div>
            </Tooltip>
          )}
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

      {/* 政策摘要 */}
      <Paragraph
        style={{
          color: '#666',
          fontSize: '14px',
          lineHeight: '22px',
          marginBottom: 16
        }}
        ellipsis={{ rows: 2, expandable: false }}
      >
        {highlightKeywords(getPolicySummary(policy), searchKeywords)}
      </Paragraph>

      {/* 核心信息展示 */}
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {/* 资助信息 */}
          {(policy.fundingAmount !== '未公开' || policy.maxReward !== '未公开') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {policy.fundingAmount !== '未公开' && (
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  <span style={{ color: '#1890ff', fontWeight: 500 }}>资助总额:</span> {policy.fundingAmount}
                </Text>
              )}
              {policy.maxReward !== '未公开' && (
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  <span style={{ color: '#52c41a', fontWeight: 500 }}>最高奖励:</span> {policy.maxReward}
                </Text>
              )}
            </div>
          )}

          {/* 获批企业数 */}
          {policy.approvedCompanies !== '未公开' && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TeamOutlined style={{ color: '#faad14', marginRight: 6 }} />
              <Text style={{ fontSize: '14px', color: '#666' }}>
                已获批企业: <span style={{ color: '#faad14', fontWeight: 500 }}>{policy.approvedCompanies}</span>
              </Text>
            </div>
          )}

          {/* 适用行业 */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: '14px', color: '#666', minWidth: 70 }}>适用行业:</Text>
            <div style={{ flex: 1 }}>
              <Space wrap size={[4, 4]}>
                {policy.applicableIndustries.slice(0, 3).map((industry, index) => (
                  <Tag key={index} style={{ fontSize: '12px', margin: 0 }}>
                    {highlightKeywords(industry, searchKeywords)}
                  </Tag>
                ))}
                {policy.applicableIndustries.length > 3 && (
                  <Tag style={{ fontSize: '12px', margin: 0 }}>
                    +{policy.applicableIndustries.length - 3}个
                  </Tag>
                )}
              </Space>
            </div>
          </div>
        </Space>
      </div>

      {/* 底部信息和操作 */}
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
              {highlightKeywords(policy.publishOrg, searchKeywords)}
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
            <BankOutlined style={{ color: '#999', marginRight: 4, fontSize: '12px' }} />
            <Text style={{ fontSize: '13px', color: '#666' }}>
              {highlightKeywords(policy.district, searchKeywords)}
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
          onClick={() => onViewDetails?.(policy.id)}
        >
          查看详情
        </Button>
      </div>

      {/* 匹配字段指示器（调试用，生产环境可移除） */}
      {matchedFields.length > 0 && process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: 12, 
          padding: '8px 12px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: 6,
          fontSize: '12px'
        }}>
          <Text style={{ color: '#52c41a', fontWeight: 500 }}>
            匹配字段: {matchedFields.join(', ')}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default EnhancedPolicyCard;
