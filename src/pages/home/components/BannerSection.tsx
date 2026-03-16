/**
 * 首页轮播图组件
 * 创建时间: 2026-03-02
 * 功能: 展示重要通知、政策宣传等轮播图片
 */

import React from 'react';
import { Carousel, Card, Button, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const bannerData = [
  {
    id: 1,
    title: '2026年高新技术企业认定申报启动',
    description: '全面解读最新认定标准，助您轻松通过认定，享受税收优惠政策。',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: '#1890ff'
  },
  {
    id: 2,
    title: '中小企业数字化转型专项资金',
    description: '最高补贴500万元，支持企业进行智能化改造和数字化转型。',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: '#52c41a'
  },
  {
    id: 3,
    title: '科技创新券申领指南',
    description: '降低企业研发成本，激发创新活力，创新券申领全流程解析。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: '#722ed1'
  }
];

interface BannerSectionProps {
  loading?: boolean;
}

export const BannerSection: React.FC<BannerSectionProps> = ({ loading = false }) => {
  return (
    <Card 
      loading={loading}
      className="hover-card" 
      bodyStyle={{ padding: 0 }} 
      style={{ marginBottom: '24px', overflow: 'hidden' }}
    >
      <Carousel autoplay effect="fade">
        {bannerData.map(item => (
          <div key={item.id}>
            <div 
              style={{ 
                height: '320px', 
                position: 'relative',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 48px'
                }}
              >
                <div style={{ maxWidth: '600px', color: '#fff' }}>
                  <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '24px' }}>
                    {item.description}
                  </Paragraph>
                  <Button type="primary" size="large" icon={<RightOutlined />}>
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </Card>
  );
};
