/**
 * 申报成功页
 * 创建时间: 2026-02-26
 * 功能: 显示申报成功信息和后续操作指引
 */

import React from 'react';
import { 
  Layout, 
  Card, 
  Result, 
  Button, 
  Space, 
  Typography, 
  Descriptions,
  Alert,
  Timeline,
  Row,
  Col
} from 'antd';
import {
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DESIGN_TOKENS } from './config/designTokens';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ApplySuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const applicationId = location.state?.applicationId || 'APP2026872721';

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: DESIGN_TOKENS.colors.background }}>
      <Content style={{ padding: DESIGN_TOKENS.spacing.md }}>
        <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: DESIGN_TOKENS.colors.success }} />}
            title={
              <Title level={2} style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.primary }}>
                申报提交成功！
              </Title>
            }
            subTitle={
              <Space direction="vertical" size={DESIGN_TOKENS.spacing.sm}>
                <Text style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>
                  您的申报已成功提交，我们将在1-3个工作日内完成初审
                </Text>
                <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.md }}>
                  申报编号：<Text strong copyable>{applicationId}</Text>
                </Text>
              </Space>
            }
            extra={[
              <Button 
                type="primary" 
                size="large" 
                key="status"
                onClick={() => navigate('/application?view=status')}
              >
                查看申报进度
              </Button>,
              <Button 
                size="large" 
                key="list"
                onClick={() => navigate('/application')}
              >
                返回项目列表
              </Button>
            ]}
          />

          <Row gutter={DESIGN_TOKENS.spacing.md} style={{ marginTop: DESIGN_TOKENS.spacing.lg }}>
            {/* 重要提示 */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <FileTextOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                    <Text strong>重要提示</Text>
                  </Space>
                }
                size="small"
                style={{ height: '100%' }}
              >
                <Alert
                  message="请保持电话畅通"
                  description="审核期间我们可能会联系您补充材料或进行核实，请注意接听电话。"
                  type="info"
                  showIcon
                  style={{ marginBottom: DESIGN_TOKENS.spacing.sm }}
                />
                
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>审核流程：</Text>
                  <Timeline
                    items={[
                      {
                        children: '材料初审（1-3个工作日）',
                        color: 'green'
                      },
                      {
                        children: '专家评审（5-7个工作日）'
                      },
                      {
                        children: '公示评审结果（7个工作日）'
                      },
                      {
                        children: '发放奖励资金'
                      }
                    ]}
                  />
                </Space>
              </Card>
            </Col>

            {/* 申报信息 */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: DESIGN_TOKENS.colors.success }} />
                    <Text strong>申报信息</Text>
                  </Space>
                }
                size="small"
                style={{ height: '100%' }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="申报编号">
                    <Text strong copyable>{applicationId}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="申报时间">
                    {new Date().toLocaleString('zh-CN')}
                  </Descriptions.Item>
                  <Descriptions.Item label="企业名称">
                    深圳市璟智科技有限公司
                  </Descriptions.Item>
                  <Descriptions.Item label="信用代码">
                    91440300MA5XXXXXXX
                  </Descriptions.Item>
                  <Descriptions.Item label="申报项目">
                    2024-2025年北京市节能技术改造项目奖励
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* 联系我们 */}
            <Col xs={24}>
              <Card 
                title={
                  <Space>
                    <PhoneOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                    <Text strong>联系我们</Text>
                  </Space>
                }
                size="small"
              >
                <Row gutter={DESIGN_TOKENS.spacing.md}>
                  <Col xs={24} sm={8}>
                    <Space>
                      <PhoneOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm, display: 'block' }}>
                          咨询热线
                        </Text>
                        <Text strong>400-888-6666</Text>
                      </div>
                    </Space>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Space>
                      <MailOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm, display: 'block' }}>
                          工作时间
                        </Text>
                        <Text strong>周一至周五 9:00-18:00</Text>
                      </div>
                    </Space>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Space>
                      <MailOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm, display: 'block' }}>
                          电子邮箱
                        </Text>
                        <Text strong>policy@example.com</Text>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 政策推荐 */}
            <Col xs={24}>
              <Card 
                title={
                  <Space>
                    <FileTextOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                    <Text strong>政策推荐</Text>
                  </Space>
                }
                size="small"
              >
                <Paragraph type="secondary">
                  根据您的企业情况，我们为您推荐以下政策项目：
                </Paragraph>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="link" onClick={() => navigate('/application')}>
                    北京市高新技术企业认定
                  </Button>
                  <Button type="link" onClick={() => navigate('/application')}>
                    海淀区人才引进政策
                  </Button>
                  <Button type="link" onClick={() => navigate('/application')}>
                    丰台区科技型企业补贴
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default ApplySuccess;
