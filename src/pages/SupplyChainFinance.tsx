import React from 'react';
import { Card, Row, Col, Button, Typography, Steps, List, Tag, Space, Breadcrumb } from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FundOutlined,
  BarChartOutlined,
  SettingOutlined,
  ApartmentOutlined,
  LineChartOutlined,
  HomeOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface DiagnosisRecord {
  id: string;
  title: string;
  createTime: string;
  status: 'completed' | 'processing' | 'draft';
  amount: string;
  type: string;
}

const SupplyChainFinance: React.FC = () => {
  const navigate = useNavigate();

  // 模拟历史诊断记录数据
  const diagnosisRecords: DiagnosisRecord[] = [
    {
      id: '1',
      title: '设备采购融资需求诊断',
      createTime: '2024-01-15',
      status: 'completed',
      amount: '500万',
      type: '设备贷款'
    },
    {
      id: '2', 
      title: '流动资金融资需求诊断',
      createTime: '2024-01-10',
      status: 'processing',
      amount: '200万',
      type: '信用贷款'
    },
    {
      id: '3',
      title: '供应链融资需求诊断',
      createTime: '2024-01-05',
      status: 'draft',
      amount: '300万',
      type: '保理业务'
    }
  ];

  // 诊断流程步骤
  const diagnosisSteps = [
    {
      title: '需求采集',
      description: '收集企业融资基本信息'
    },
    {
      title: '数据补全',
      description: '完善企业经营数据'
    },
    {
      title: '画像生成',
      description: '生成企业融资画像'
    },
    {
      title: '方案推荐',
      description: '推荐最优融资方案'
    }
  ];

  // 快捷入口配置
  const quickEntries = [
    {
      key: 'financing-diagnosis',
      icon: <FundOutlined />,
      title: '融资诊断',
      description: '智能分析融资需求',
      path: '/supply-chain-finance/financing-diagnosis'
    },
    {
      key: 'diagnosis-analysis',
      icon: <LineChartOutlined />,
      title: '诊断分析',
      description: '融资诊断深度分析',
      path: '/supply-chain-finance/diagnosis-analysis'
    },
    {
      key: 'data-visualization',
      icon: <BarChartOutlined />,
      title: '数据可视化',
      description: '数据图表可视化展示',
      path: '/supply-chain-finance/data-visualization'
    },
        {
      key: 'scheme-config',
      icon: <SettingOutlined />,
      title: '方案配置',
      description: '融资方案配置管理',
      path: '/supply-chain-finance/scheme-config'
    }
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>;
      case 'processing':
        return <Tag color="processing" icon={<ClockCircleOutlined />}>进行中</Tag>;
      case 'draft':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>草稿</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  return (
    <div className="page-container">

      {/* 顶部返回按钮和标题 */}
      <div className="page-header">
        <div>
          <Title level={2} className="page-title">供应链金融</Title>
          <Paragraph className="page-description">
            为企业提供全方位的供应链金融服务，包括融资诊断、诊断分析、数据可视化等专业功能
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="btn-primary-enhanced"
          onClick={() => navigate('/supply-chain-finance/financing-diagnosis')}
          size="large"
        >
          开始新诊断
        </Button>
      </div>

      {/* 诊断流程导航 */}
      <Card className="professional-card fade-in-up" style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>诊断流程</Title>
        <Steps
          current={-1}
          items={diagnosisSteps}
          className="professional-steps"
          style={{ marginBottom: '20px' }}
        />
        <Text type="secondary">点击"开始新诊断"按钮开始融资需求诊断流程</Text>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 左侧快捷入口 */}
        <Col xs={24} lg={16}>
          <Card title="功能模块" className="professional-card slide-in-right">
            <Row gutter={[16, 16]}>
              {quickEntries.map(entry => (
                <Col xs={24} sm={12} md={8} key={entry.key}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => navigate(entry.path)}
                    className="professional-card"
                    style={{ 
                      cursor: 'pointer',
                      textAlign: 'center',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="icon-enhanced" style={{ margin: '0 auto 12px' }}>
                      {entry.icon}
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: '4px', color: 'var(--text-primary)' }}>
                      {entry.title}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {entry.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 右侧历史记录 */}
        <Col xs={24} lg={8}>
          <Card 
            title="最近诊断记录" 
            className="professional-card slide-in-right"
            extra={
              <Button type="link" onClick={() => navigate('/supply-chain-finance/history')}>
                查看全部
              </Button>
            }
          >
            <List
              dataSource={diagnosisRecords}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/supply-chain-finance/record/${item.id}`)}
                    >
                      查看
                    </Button>
                  ]}
                  style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.createTime} | {item.amount} | {item.type}
                        </Text>
                        {getStatusTag(item.status)}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupplyChainFinance;