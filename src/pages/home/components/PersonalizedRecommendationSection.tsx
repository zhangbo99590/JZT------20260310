/**
 * 个性化推荐引擎组件
 * 创建时间: 2026-02-26
 * 功能: 基于企业画像的智能政策匹配和个性化推荐
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Button, Avatar, List, Divider, Badge, Tooltip } from 'antd';
import ApplyButton from '../../../components/common/ApplyButton';
import { 
  StarOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface CompanyProfile {
  industry: string;
  size: string;
  revenue: number;
  techLevel: string;
  location: string;
  establishedYear: number;
}

interface PolicyRecommendation {
  id: number;
  title: string;
  description: string;
  matchScore: number;
  category: string;
  deadline: string;
  maxAmount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  benefits: string[];
  isHot: boolean;
  isUrgent: boolean;
}

export const PersonalizedRecommendationSection: React.FC = () => {
  const navigate = useNavigate();
  const [companyProfile] = useState<CompanyProfile>({
    industry: '软件和信息技术服务业',
    size: '小微企业',
    revenue: 800000,
    techLevel: '高新技术企业',
    location: '北京市海淀区',
    establishedYear: 2020
  });

  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([
    {
      id: 1,
      title: '中关村高新技术企业认定补贴',
      description: '针对高新技术企业的专项资金支持，重点支持技术创新和产业化项目',
      matchScore: 95,
      category: '技术创新',
      deadline: '2026-03-15',
      maxAmount: 500000,
      difficulty: 'medium',
      requirements: ['高新技术企业认定', '近两年研发投入占比>3%', '拥有自主知识产权'],
      benefits: ['最高50万资金支持', '税收优惠政策', '优先推荐上市辅导'],
      isHot: true,
      isUrgent: true
    },
    {
      id: 2,
      title: '小微企业创业创新基地补贴',
      description: '支持小微企业入驻创新创业基地，提供租金补贴和服务支持',
      matchScore: 88,
      category: '创业支持',
      deadline: '2026-04-30',
      maxAmount: 200000,
      difficulty: 'easy',
      requirements: ['注册时间不超过5年', '员工人数少于20人', '入驻认定基地'],
      benefits: ['租金补贴50%', '免费创业辅导', '融资对接服务'],
      isHot: false,
      isUrgent: false
    },
    {
      id: 3,
      title: '软件企业研发费用加计扣除',
      description: '软件企业研发费用可按175%在税前扣除，大幅降低税负',
      matchScore: 92,
      category: '税收优惠',
      deadline: '2026-12-31',
      maxAmount: 0,
      difficulty: 'easy',
      requirements: ['软件企业认定', '有明确的研发项目', '规范的财务核算'],
      benefits: ['研发费用175%扣除', '降低企业所得税', '提升现金流'],
      isHot: true,
      isUrgent: false
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#52c41a';
      case 'medium': return '#fa8c16';
      case 'hard': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '容易';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 企业画像卡片 */}
      <Col xs={24} lg={8}>
        <Card
          className="hover-card"
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              企业画像
            </div>
          }
          style={{ height: '400px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <Title level={4} style={{ marginTop: '12px', marginBottom: '4px' }}>
              智慧科技有限公司
            </Title>
            <Text type="secondary">{companyProfile.industry}</Text>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Tag color="blue">{companyProfile.size}</Tag>
              </Col>
              <Col span={12}>
                <Tag color="green">{companyProfile.techLevel}</Tag>
              </Col>
              <Col span={24}>
                <Tag color="orange">{companyProfile.location}</Tag>
              </Col>
            </Row>
          </div>

          <Divider />
        </Card>
      </Col>

      {/* 智能推荐列表 */}
      <Col xs={24} lg={16}>
        <Card
          className="hover-card"
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StarOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
              智能推荐 ({recommendations.length})
            </div>
          }
          style={{ height: '400px' }}
        >
          <div style={{ height: '320px', overflowY: 'auto' }}>
            <List
              dataSource={recommendations}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <Title level={5} style={{ margin: 0, marginRight: '8px' }}>
                            {item.title}
                          </Title>
                          {item.isHot && (
                            <Badge count="HOT" style={{ backgroundColor: '#ff4d4f' }} />
                          )}
                          {item.isUrgent && (
                            <Badge count="急" style={{ backgroundColor: '#fa8c16', marginLeft: '4px' }} />
                          )}
                        </div>
                        <Paragraph 
                          style={{ margin: 0, fontSize: '13px', color: '#666' }}
                          ellipsis={{ rows: 2 }}
                        >
                          {item.description}
                        </Paragraph>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                            {item.matchScore}%
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          匹配度
                        </Text>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag color="blue">{item.category}</Tag>
                        <Tag color={getDifficultyColor(item.difficulty)}>
                          {getDifficultyText(item.difficulty)}
                        </Tag>
                        {item.maxAmount > 0 && (
                          <Tag color="gold">
                            最高{(item.maxAmount / 10000).toFixed(0)}万
                          </Tag>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ClockCircleOutlined style={{ color: '#fa8c16', marginRight: '4px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.deadline}截止
                        </Text>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ApplyButton 
                          size="small"
                          status="in_progress"
                          onApply={() => navigate(`/application/apply/${item.id}`)}
                        />
                        <Button 
                          size="small"
                          onClick={() => navigate(`/application/detail/${item.id}`)}
                        >
                          查看详情
                        </Button>
                        <Tooltip title="收藏此政策">
                          <Button 
                            size="small" 
                            icon={<HeartOutlined />}
                            type="text"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};
