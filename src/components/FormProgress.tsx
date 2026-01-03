import React from 'react';
import { Card, Progress, Space, Typography, Row, Col } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  completedFields: number;
  totalFields: number;
  style?: React.CSSProperties;
}

const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  completedFields,
  totalFields,
  style
}) => {
  const stepProgress = Math.round(((currentStep + 1) / totalSteps) * 100);
  const fieldProgress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  const overallProgress = Math.round((stepProgress * 0.4 + fieldProgress * 0.6));

  return (
    <Card
      style={{
        ...style,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      }}
      styles={{ body: { padding: '24px' } }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
            申报进度
          </Text>
          <Text style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
            {overallProgress}%
          </Text>
        </div>

        <Progress
          percent={overallProgress}
          strokeColor={{
            '0%': '#fff',
            '100%': '#ffd700'
          }}
          trailColor="rgba(255,255,255,0.2)"
          showInfo={false}
          strokeWidth={12}
          style={{ marginBottom: '8px' }}
        />

        <Row gutter={16}>
          <Col span={12}>
            <div
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Space direction="vertical" size={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircleOutlined style={{ color: '#fff', fontSize: '16px' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                    已完成字段
                  </Text>
                </div>
                <Text style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                  {completedFields}/{totalFields}
                </Text>
              </Space>
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Space direction="vertical" size={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockCircleOutlined style={{ color: '#fff', fontSize: '16px' }} />
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                    当前步骤
                  </Text>
                </div>
                <Text style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                  {currentStep + 1}/{totalSteps}
                </Text>
              </Space>
            </div>
          </Col>
        </Row>

        <div
          style={{
            padding: '12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            borderLeft: '3px solid #ffd700'
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
            💡 提示：完成所有必填项后即可提交申报
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default FormProgress;
