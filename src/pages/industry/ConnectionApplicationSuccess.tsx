import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Result, 
  Typography, 
  Steps,
  Timeline,
  Descriptions,
  Space,
  Divider,
  Alert,
  Tag,
  Avatar,
  List,
  Progress
} from 'antd';
import { 
  CheckCircleOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  HomeOutlined,
  ReloadOutlined,
  CustomerServiceOutlined,
  CalendarOutlined,
  MailOutlined,
  MessageOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const PURPOSE_MAP: Record<string, string> = {
  'procurement': '采购合作',
  'supply': '供应合作',
  'technology': '技术合作',
  'investment': '投资合作',
  'strategic': '战略合作',
  'other': '其他'
};

const CONTACT_INFO = [
  {
    title: '客服热线',
    content: '400-888-999',
    icon: <PhoneOutlined />,
    description: '工作时间：9:00-18:00'
  },
  {
    title: '在线客服',
    content: '企规宝官网在线咨询',
    icon: <MessageOutlined />,
    description: '7×24小时在线服务'
  },
  {
    title: '邮箱咨询',
    content: 'service@qiguibao.com',
    icon: <MailOutlined />,
    description: '24小时内回复'
  }
];

const FAQ_ITEMS = [
  '对接申请后多久会有回复？',
  '如何提高对接成功率？',
  '对接失败后能否重新申请？',
  '如何查看对接进展？'
];

interface ConnectionApplicationData {
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  connectionPurpose: string;
  specificRequirements: string;
  applicationId: string;
  submitTime: string;
  publicationTitle: string;
  publisherName: string;
}

const ConnectionApplicationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationData, setApplicationData] = useState<ConnectionApplicationData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const data = location.state?.applicationData || 
                 JSON.parse(localStorage.getItem('latest-connection-application') || '{}');
    
    if (data && data.companyName) {
      setApplicationData({
        ...data,
        contactPhone: '400-888-999'
      });
    } else {
      const mockData: ConnectionApplicationData = {
        companyName: '示例企业有限公司',
        contactPerson: '张先生',
        contactPhone: '400-888-999',
        connectionPurpose: 'procurement',
        specificRequirements: '寻求优质供应商合作',
        applicationId: 'FA' + Date.now().toString().slice(-8),
        submitTime: new Date().toLocaleString(),
        publicationTitle: '智能制造数字化改造商机',
        publisherName: '天津科技创新有限公司'
      };
      setApplicationData(mockData);
    }

    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(timer);
  }, [location.state]);

  const processSteps = useMemo(() => [
    {
      title: '申请提交',
      description: '您的对接申请已成功提交',
      status: 'finish' as const,
      icon: <CheckCircleOutlined />
    },
    {
      title: '信息匹配',
      description: '系统正在进行智能匹配分析',
      status: currentStep >= 1 ? 'finish' as const : 'process' as const,
      icon: <FileTextOutlined />
    },
    {
      title: '企业联系',
      description: '对方企业将收到您的对接请求',
      status: currentStep >= 2 ? 'finish' as const : 'wait' as const,
      icon: <CustomerServiceOutlined />
    }
  ], [currentStep]);

  const nextSteps = useMemo(() => [
    {
      time: '1个工作日内',
      content: '对方企业收到您的对接请求并进行初步评估',
      icon: <PhoneOutlined style={{ color: '#1890ff' }} />
    },
    {
      time: '2-3个工作日',
      content: '双方进行初步沟通，了解合作意向',
      icon: <FileTextOutlined style={{ color: '#52c41a' }} />
    },
    {
      time: '3-5个工作日',
      content: '深入洽谈，确定合作方案和条件',
      icon: <BankOutlined style={{ color: '#faad14' }} />
    },
    {
      time: '5-10个工作日',
      content: '签署合作协议，正式建立合作关系',
      icon: <CheckCircleOutlined style={{ color: '#f5222d' }} />
    }
  ], []);

  const currentStatusText = useMemo(() => {
    if (currentStep === 0) return '申请已提交，正在发送给对方企业';
    if (currentStep === 1) return '信息匹配中，请耐心等待';
    return '申请已送达，对方企业即将联系您';
  }, [currentStep]);

  const getPurposeText = useCallback((purpose: string) => {
    return PURPOSE_MAP[purpose] || '待确定';
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleContinueBrowse = useCallback(() => {
    navigate('/industry/supply-demand');
  }, [navigate]);

  if (!applicationData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: '400px' }}>
          <Result
            icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            title="加载中..."
            subTitle="正在获取申请信息，请稍候"
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* 成功结果页 */}
      <Card style={{ marginBottom: '24px' }}>
        <Result
          status="success"
          title="申请提交成功！"
          subTitle={
            <div>
              <Paragraph style={{ fontSize: '16px', marginBottom: '16px' }}>
                您的商机对接申请已成功提交，申请编号：<Text strong>{applicationData.applicationId}</Text>
              </Paragraph>
              <Alert
                message="重要提醒"
                description={
                  <div>
                    <div>我们已将您的对接请求发送给对方企业，请保持电话畅通。</div>
                    <div style={{ marginTop: '8px' }}>
                      <Text strong>联系电话：</Text>
                      <Text code>{applicationData.contactPhone}</Text>
                    </div>
                  </div>
                }
                type="info"
                showIcon
                style={{ textAlign: 'left', marginBottom: '16px' }}
              />
            </div>
          }
          extra={[
            <Button type="primary" key="home" icon={<HomeOutlined />} onClick={handleNavigateHome}>
              返回首页
            </Button>,
            <Button key="apply-again" icon={<ReloadOutlined />} onClick={handleContinueBrowse}>
              继续浏览商机
            </Button>,
          ]}
        />
      </Card>

      <Row gutter={[24, 24]}>
        {/* 左侧：申请信息和进度 */}
        <Col xs={24} lg={16}>
          {/* 申请信息 */}
          <Card 
            title={<><FileTextOutlined style={{ marginRight: '8px' }} />申请信息</>} 
            style={{ marginBottom: '24px' }}
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item label="申请编号" span={2}>
                <Text strong style={{ color: '#1890ff' }}>{applicationData.applicationId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="对接商机">
                {applicationData.publicationTitle}
              </Descriptions.Item>
              <Descriptions.Item label="发布企业">
                {applicationData.publisherName}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间" span={2}>
                {applicationData.submitTime}
              </Descriptions.Item>
              <Descriptions.Item label="企业名称">
                {applicationData.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {applicationData.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {applicationData.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="对接目的">
                <Tag color="blue">{getPurposeText(applicationData.connectionPurpose)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="具体需求" span={2}>
                {applicationData.specificRequirements}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 处理进度 */}
          <Card 
            title={<><ClockCircleOutlined style={{ marginRight: '8px' }} />处理进度</>} 
            style={{ marginBottom: '24px' }}
          >
            <Steps current={currentStep} items={processSteps} />
            <div style={{ marginTop: '24px', padding: '16px', background: '#fafafa', borderRadius: '6px' }}>
              <Space>
                <Avatar style={{ backgroundColor: '#52c41a' }} icon={<CheckCircleOutlined />} />
                <div>
                  <Text strong>当前状态：</Text>
                  <Text style={{ color: '#52c41a' }}>{currentStatusText}</Text>
                </div>
              </Space>
            </div>
          </Card>

          {/* 后续流程 */}
          <Card title={<><CalendarOutlined style={{ marginRight: '8px' }} />后续流程</>}>
            <Timeline
              items={nextSteps.map((step, index) => ({
                dot: step.icon,
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{step.content}</Text>
                      <Tag color="blue">{step.time}</Tag>
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 右侧：联系方式和帮助 */}
        <Col xs={24} lg={8}>
          {/* 专员信息 */}
          <Card 
            title={
              <Space>
                <CustomerServiceOutlined style={{ color: '#1890ff' }} />
                <span>商机对接专员</span>
              </Space>
            } 
            style={{ marginBottom: '16px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Avatar size={64} style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <div style={{ marginTop: '12px' }}>
                <Title level={4} style={{ margin: 0 }}>李经理</Title>
                <Text type="secondary">高级商机对接专员</Text>
              </div>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="联系电话">400-888-999</Descriptions.Item>
              <Descriptions.Item label="工作时间">周一至周五 9:00-18:00</Descriptions.Item>
              <Descriptions.Item label="服务经验">3年商机对接经验</Descriptions.Item>
            </Descriptions>
            <Alert
              message="温馨提示"
              description="如对接过程中遇到任何问题，可随时联系我们的专业对接专员获得帮助。"
              type="warning"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>

          {/* 联系方式 */}
          <Card title="其他联系方式" style={{ marginBottom: '16px' }}>
            <List
              dataSource={CONTACT_INFO}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#f0f0f0', color: '#1890ff' }} icon={item.icon} />}
                    title={item.title}
                    description={
                      <div>
                        <Text strong>{item.content}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 常见问题 */}
          <Card title="常见问题">
            <List
              size="small"
              dataSource={FAQ_ITEMS}
              renderItem={item => (
                <List.Item>
                  <Button type="link" style={{ padding: 0, height: 'auto', textAlign: 'left' }}>
                    {item}
                  </Button>
                </List.Item>
              )}
            />
            <Button type="primary" ghost block style={{ marginTop: '12px' }}>
              查看更多帮助
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConnectionApplicationSuccess;
