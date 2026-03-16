/**
 * 政策卡片组件 - 1:1还原参考图片的精确布局和样式
 * 包含：主标题、标签、资助总额、最高奖励、已获批企业数、适用行业、发布日期、发布单位
 */

import React from 'react';
import { Card, Tag, Space, Typography, Divider } from 'antd';
import { BankOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { EnhancedPolicyData } from '../data/enhancedPolicyData';

const { Text, Title } = Typography;

interface PolicyCardExactProps {
  policy: EnhancedPolicyData;
  searchKeywords?: string[];
  onOrgClick?: (orgName: string) => void;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// 关键词高亮函数 - 红色字体，无背景色
const highlightKeywords = (text: string, keywords: string[]): React.ReactNode => {
  if (!keywords || keywords.length === 0 || !text) return text;
  
  // 过滤空关键词
  const validKeywords = keywords.filter(k => k && k.trim());
  if (validKeywords.length === 0) return text;
  
  // 创建正则表达式，不区分大小写
  const pattern = validKeywords
    .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 转义特殊字符
    .join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        // 检查是否是关键词（不区分大小写）
        const isKeyword = validKeywords.some(
          keyword => keyword.toLowerCase() === part.toLowerCase()
        );
        
        if (isKeyword) {
          return (
            <span
              key={index}
              style={{
                color: '#FF4D4F',
                fontWeight: 500
              }}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

const PolicyCardExact: React.FC<PolicyCardExactProps> = ({
  policy,
  searchKeywords = [],
  onOrgClick,
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <Card
      className={`policy-card-exact ${className}`}
      style={{
        marginBottom: '12px',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
      styles={{ body: { padding: '16px 20px' } }}
      hoverable
    >
      {/* 主标题 */}
      <div style={{ marginBottom: '12px' }}>
        <Title 
          level={5} 
          style={{ 
            margin: 0, 
            fontSize: '16px',
            fontWeight: 600,
            color: '#1890ff',
            lineHeight: '24px',
            cursor: 'pointer'
          }}
        >
          {highlightKeywords(policy.title, searchKeywords)}
        </Title>
      </div>

      {/* 标签行 */}
      <div style={{ marginBottom: '12px' }}>
        <Space size={[8, 8]} wrap>
          {policy.tags.map((tag, index) => (
            <Tag
              key={index}
              style={{
                color: tag.color,
                backgroundColor: tag.bgColor,
                border: `1px solid ${tag.color}`,
                borderRadius: '4px',
                fontSize: '12px',
                padding: '2px 8px',
                margin: 0,
                fontWeight: 500
              }}
            >
              {tag.text}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 资助信息行 */}
      <div style={{ marginBottom: '12px' }}>
        <Space size={24} wrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>资助总额:</Text>
            <Text style={{ fontSize: '13px', fontWeight: 500, color: '#262626' }}>
              {policy.fundingAmount}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>最高奖励:</Text>
            <Text style={{ fontSize: '13px', fontWeight: 500, color: '#262626' }}>
              {policy.maxReward}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TeamOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
            <Text style={{ fontSize: '13px', fontWeight: 500, color: '#52c41a' }}>
              已获批企业 {policy.approvedCompanies}
            </Text>
          </div>
        </Space>
      </div>

      {/* 适用行业 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '6px' }}>
          <Text type="secondary" style={{ fontSize: '13px' }}>适用行业:</Text>
        </div>
        <div style={{ lineHeight: '20px' }}>
          <Text style={{ fontSize: '13px', color: '#595959' }}>
            {highlightKeywords(policy.applicableIndustries.join('，'), searchKeywords)}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* 底部信息行 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Space size={16} wrap>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {policy.publishDate}
            </Text>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              cursor: onOrgClick ? 'pointer' : 'default'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onOrgClick?.(policy.publishOrg);
            }}
          >
            <BankOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
            <Text 
              style={{ 
                fontSize: '13px', 
                color: onOrgClick ? '#1890ff' : '#595959',
                textDecoration: onOrgClick ? 'underline' : 'none'
              }}
            >
              {highlightKeywords(policy.publishOrg, searchKeywords)}
            </Text>
          </div>
        </Space>
      </div>
    </Card>
  );
};

export default PolicyCardExact;
