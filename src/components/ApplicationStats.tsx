import React from 'react';
import { Row, Col, Card, Statistic, Progress, Space, Typography } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface ApplicationStatsProps {
  totalApplications?: number;
  completedApplications?: number;
  averageRating?: number;
  averageProcessTime?: number;
  style?: React.CSSProperties;
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({
  totalApplications = 12,
  completedApplications = 156,
  averageRating = 4.7,
  averageProcessTime = 2.3,
  style
}) => {
  const completionRate = totalApplications > 0 
    ? Math.round((completedApplications / (completedApplications + totalApplications)) * 100) 
    : 0;

  return (
    <Row gutter={[16, 16]} style={style}>
      <Col xs={12} sm={6}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                申报项目
              </Text>
              <FileTextOutlined style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px' }} />
            </div>
            <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 }}>
              {totalApplications}
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              进行中项目
            </Text>
          </Space>
        </Card>
      </Col>

      <Col xs={12} sm={6}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)'
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                累计通过
              </Text>
              <CheckCircleOutlined style={{ color: 'rgba(255,255,255,0.8)', fontSize: '20px' }} />
            </div>
            <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 }}>
              {completedApplications}
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              成功案例
            </Text>
          </Space>
        </Card>
      </Col>

      <Col xs={12} sm={6}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(252, 182, 159, 0.3)'
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#8b4513', fontSize: '14px' }}>
                评分
              </Text>
              <StarOutlined style={{ color: '#ff9800', fontSize: '20px' }} />
            </div>
            <div style={{ color: '#8b4513', fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 }}>
              {averageRating}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarOutlined
                  key={star}
                  style={{
                    color: star <= averageRating ? '#ff9800' : 'rgba(139, 69, 19, 0.3)',
                    fontSize: '12px'
                  }}
                />
              ))}
            </div>
          </Space>
        </Card>
      </Col>

      <Col xs={12} sm={6}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(168, 237, 234, 0.3)'
          }}
          styles={{ body: { padding: '20px' } }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#006064', fontSize: '14px' }}>
                处理时长
              </Text>
              <ClockCircleOutlined style={{ color: '#00acc1', fontSize: '20px' }} />
            </div>
            <div style={{ color: '#006064', fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 }}>
              {averageProcessTime}
              <Text style={{ fontSize: '16px', fontWeight: 'normal', marginLeft: '4px' }}>
                个月
              </Text>
            </div>
            <Text style={{ color: 'rgba(0, 96, 100, 0.7)', fontSize: '12px' }}>
              平均处理周期
            </Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default ApplicationStats;
