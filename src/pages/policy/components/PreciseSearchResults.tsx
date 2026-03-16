/**
 * 精准搜索结果组件
 * 对齐企知道样式，展示搜索结果和右侧辅助模块
 */

import React from 'react';
import { Row, Col, Typography, Space, Tag, Empty, Card, Avatar, Button, List } from 'antd';
import {
  SearchOutlined,
  FireOutlined,
  TrophyOutlined,
  MessageOutlined,
  PhoneOutlined,
  StarOutlined
} from '@ant-design/icons';
import { EnhancedPolicyData } from '../data/enhancedPolicyData';
import { SearchMatchResult } from '../utils/preciseSearchMatcher';
import EnhancedPolicyCard from './EnhancedPolicyCard';

const { Title, Text } = Typography;

interface PreciseSearchResultsProps {
  searchResult: SearchMatchResult;
  searchTerm: string;
  onViewPolicyDetails?: (policyId: string) => void;
  onConsultClick?: (consultantId: string) => void;
}

// 热门政策榜单数据
const hotPolicies = [
  {
    id: 'hot_1',
    title: '北京市高新技术企业认定奖励',
    tag: '信息化',
    tagColor: '#1890ff',
    heat: 98
  },
  {
    id: 'hot_2', 
    title: '丰台区金融业发展专项资金',
    tag: '荣誉资质',
    tagColor: '#52c41a',
    heat: 95
  },
  {
    id: 'hot_3',
    title: '中小企业创新发展专项',
    tag: '资金扶持',
    tagColor: '#faad14',
    heat: 92
  },
  {
    id: 'hot_4',
    title: '科技型企业培育计划',
    tag: '信息化',
    tagColor: '#1890ff',
    heat: 89
  },
  {
    id: 'hot_5',
    title: '产业发展引导基金',
    tag: '资金扶持',
    tagColor: '#faad14',
    heat: 86
  }
];

// 政策申报咨询师数据
const consultants = [
  {
    id: 'consultant_1',
    name: '张政策',
    title: '高级政策分析师',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    description: '专注科技政策申报8年，成功率95%',
    specialties: ['高新技术企业认定', '科技项目申报'],
    consultCount: 1280
  },
  {
    id: 'consultant_2',
    name: '李申报',
    title: '资深政策顾问',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    description: '丰台区政策专家，服务企业500+',
    specialties: ['区域政策解读', '资金申请指导'],
    consultCount: 856
  }
];

const PreciseSearchResults: React.FC<PreciseSearchResultsProps> = ({
  searchResult,
  searchTerm,
  onViewPolicyDetails,
  onConsultClick
}) => {
  const { policies, totalCount, searchKeywords, matchedFields } = searchResult;

  // 空状态展示
  if (totalCount === 0) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text style={{ fontSize: '16px', color: '#666' }}>
                未找到与「{searchTerm}」相关的政策
              </Text>
              <br />
              <Text style={{ fontSize: '14px', color: '#999' }}>
                请调整关键词后重试
              </Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <Row gutter={24}>
        {/* 左侧搜索结果 */}
        <Col xs={24} lg={16}>
          {/* 搜索结果提示栏 */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 20
          }}>
            <Space align="center">
              <SearchOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              <Text style={{ fontSize: '15px', fontWeight: 500 }}>
                您主动搜索到以下政策
              </Text>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  搜索关键词:
                </Text>
                {searchKeywords.map((keyword, index) => (
                  <Tag 
                    key={index}
                    color="blue"
                    style={{ 
                      fontSize: '13px',
                      padding: '2px 8px',
                      borderRadius: 4
                    }}
                  >
                    「{keyword}」
                  </Tag>
                ))}
                <Text style={{ fontSize: '14px', color: '#666' }}>
                  | 共找到 <span style={{ color: '#1890ff', fontWeight: 600 }}>{totalCount}</span> 条相关政策
                </Text>
              </Space>
            </div>
          </div>

          {/* 政策列表 */}
          <div>
            {policies.map((policy) => (
              <EnhancedPolicyCard
                key={policy.id}
                policy={policy}
                searchKeywords={searchKeywords}
                matchedFields={matchedFields[policy.id] || []}
                onViewDetails={onViewPolicyDetails}
              />
            ))}
          </div>

          {/* 结果统计 */}
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
            borderTop: '1px solid #f0f0f0',
            marginTop: 20
          }}>
            <Text style={{ color: '#666', fontSize: '14px' }}>
              为您找到相关政策 <span style={{ color: '#1890ff', fontWeight: 600 }}>{totalCount}</span> 条
            </Text>
          </div>
        </Col>

        {/* 右侧辅助模块 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            {/* 热门政策榜单 */}
            <Card
              title={
                <Space>
                  <FireOutlined style={{ color: '#ff4d4f' }} />
                  <span>热门政策榜单</span>
                </Space>
              }
              size="small"
              style={{ borderRadius: 8 }}
              headStyle={{ 
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '15px',
                fontWeight: 600
              }}
            >
              <List
                size="small"
                dataSource={hotPolicies}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: '8px 0', border: 'none' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{
                          backgroundColor: index < 3 ? '#ff4d4f' : '#999',
                          color: 'white',
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 600,
                          marginRight: 8,
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text 
                            style={{ 
                              fontSize: '13px', 
                              fontWeight: 500,
                              lineHeight: '18px',
                              display: 'block'
                            }}
                            ellipsis={{ tooltip: item.title }}
                          >
                            {item.title}
                          </Text>
                          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Tag 
                              color={item.tagColor}
                              size="small"
                              style={{ 
                                fontSize: '11px',
                                margin: 0,
                                padding: '1px 6px'
                              }}
                            >
                              {item.tag}
                            </Tag>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <FireOutlined style={{ color: '#ff4d4f', fontSize: '11px', marginRight: 2 }} />
                              <Text style={{ fontSize: '11px', color: '#666' }}>
                                {item.heat}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* 政策申报规划咨询 */}
            <Card
              title={
                <Space>
                  <MessageOutlined style={{ color: '#52c41a' }} />
                  <span>政策申报规划咨询</span>
                </Space>
              }
              size="small"
              style={{ borderRadius: 8 }}
              headStyle={{ 
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '15px',
                fontWeight: 600
              }}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {consultants.map((consultant) => (
                  <div key={consultant.id} style={{
                    padding: '12px',
                    backgroundColor: '#fafafa',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Avatar 
                        src={consultant.avatar}
                        size={40}
                        style={{ marginRight: 12, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                          <Text style={{ fontSize: '14px', fontWeight: 600, marginRight: 8 }}>
                            {consultant.name}
                          </Text>
                          <StarOutlined style={{ color: '#faad14', fontSize: '12px' }} />
                        </div>
                        <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: 4 }}>
                          {consultant.title}
                        </Text>
                        <Text style={{ fontSize: '12px', color: '#999', lineHeight: '16px' }}>
                          {consultant.description}
                        </Text>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 8 }}>
                      <Space wrap size={[4, 4]}>
                        {consultant.specialties.map((specialty, index) => (
                          <Tag 
                            key={index}
                            size="small"
                            style={{ 
                              fontSize: '11px',
                              margin: 0,
                              backgroundColor: '#e6f7ff',
                              color: '#1890ff',
                              border: '1px solid #91d5ff'
                            }}
                          >
                            {specialty}
                          </Tag>
                        ))}
                      </Space>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '11px', color: '#999' }}>
                        已服务 {consultant.consultCount} 家企业
                      </Text>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PhoneOutlined />}
                        style={{
                          fontSize: '12px',
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: '#52c41a',
                          borderColor: '#52c41a'
                        }}
                        onClick={() => onConsultClick?.(consultant.id)}
                      >
                        在线咨询
                      </Button>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default PreciseSearchResults;
