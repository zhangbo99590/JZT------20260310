import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Progress, 
  Statistic, 
  Table, 
  Tag, 
  Alert,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Divider,
  Typography,
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SafetyOutlined, 
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface RiskAssessmentProps {}

interface RiskScore {
  category: string;
  score: number;
  level: 'low' | 'medium' | 'high';
  description: string;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('input');

  // 模拟风险评估数据
  const riskScores: RiskScore[] = [
    { category: '信用风险', score: 85, level: 'low', description: '企业信用记录良好，违约概率较低' },
    { category: '财务风险', score: 72, level: 'medium', description: '财务状况稳定，但需关注现金流' },
    { category: '行业风险', score: 68, level: 'medium', description: '所处行业竞争激烈，市场波动较大' },
    { category: '经营风险', score: 78, level: 'low', description: '经营模式成熟，管理团队经验丰富' },
    { category: '政策风险', score: 90, level: 'low', description: '符合国家产业政策导向，政策支持力度大' }
  ];

  const financialIndicators = [
    { name: '资产负债率', value: '45.2%', trend: 'down', status: 'good' },
    { name: '流动比率', value: '2.1', trend: 'up', status: 'good' },
    { name: '速动比率', value: '1.8', trend: 'up', status: 'good' },
    { name: '净资产收益率', value: '15.6%', trend: 'up', status: 'excellent' },
    { name: '毛利率', value: '28.3%', trend: 'stable', status: 'good' },
    { name: '净利率', value: '12.1%', trend: 'up', status: 'good' }
  ];

  const industryComparison = [
    { metric: '营收增长率', company: '18.5%', industry: '12.3%', status: 'above' },
    { metric: '利润率', company: '12.1%', industry: '8.7%', status: 'above' },
    { metric: '资产周转率', company: '1.2', industry: '1.0', status: 'above' },
    { metric: '负债率', company: '45.2%', industry: '52.1%', status: 'below' }
  ];

  const handleAssessment = async (values: any) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setAssessmentResult({
        overallScore: 78,
        riskLevel: 'medium',
        recommendation: '企业整体风险可控，建议采用银行贷款+供应链金融组合方案'
      });
      setActiveTab('result');
      setLoading(false);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#52c41a';
      case 'medium': return '#faad14';
      case 'high': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'warning': return '#faad14';
      case 'danger': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const columns = [
    {
      title: '风险类别',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '风险评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: RiskScore) => (
        <Space>
          <Progress 
            percent={score} 
            size="small" 
            strokeColor={getRiskColor(record.level)}
            style={{ width: 100 }}
          />
          <Text>{score}</Text>
        </Space>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const config = {
          low: { color: 'green', text: '低风险' },
          medium: { color: 'orange', text: '中风险' },
          high: { color: 'red', text: '高风险' }
        };
        return <Tag color={config[level as keyof typeof config]?.color}>
          {config[level as keyof typeof config]?.text}
        </Tag>;
      }
    },
    {
      title: '风险描述',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/supply-chain-finance')}
          >
            返回
          </Button>
          <Title level={2} style={{ margin: 0 }}>供应链金融风险评估</Title>
        </Space>
        <Space>
          <Button type="primary" icon={<BarChartOutlined />}>
            导出报告
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        {/* 信息录入 */}
        <TabPane tab="企业信息录入" key="input">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAssessment}
              initialValues={{
                companyType: 'private',
                industry: 'manufacturing',
                establishYear: 2018
              }}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <Title level={4}>基本信息</Title>
                  <Form.Item label="企业名称" name="companyName" rules={[{ required: true }]}>
                    <Input placeholder="请输入企业名称" />
                  </Form.Item>
                  <Form.Item label="企业类型" name="companyType" rules={[{ required: true }]}>
                    <Select>
                      <Option value="private">民营企业</Option>
                      <Option value="state">国有企业</Option>
                      <Option value="foreign">外资企业</Option>
                      <Option value="joint">合资企业</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="所属行业" name="industry" rules={[{ required: true }]}>
                    <Select>
                      <Option value="manufacturing">制造业</Option>
                      <Option value="technology">科技行业</Option>
                      <Option value="retail">零售业</Option>
                      <Option value="finance">金融业</Option>
                      <Option value="real-estate">房地产</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="成立年份" name="establishYear" rules={[{ required: true }]}>
                    <InputNumber min={1990} max={2024} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Title level={4}>财务数据</Title>
                  <Form.Item label="年营业收入（万元）" name="revenue" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入年营业收入" />
                  </Form.Item>
                  <Form.Item label="净利润（万元）" name="profit" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} placeholder="请输入净利润" />
                  </Form.Item>
                  <Form.Item label="总资产（万元）" name="assets" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入总资产" />
                  </Form.Item>
                  <Form.Item label="总负债（万元）" name="debt" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入总负债" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Title level={4}>经营情况</Title>
                  <Form.Item label="员工人数" name="employees" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入员工人数" />
                  </Form.Item>
                  <Form.Item label="主要客户数量" name="customers" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入主要客户数量" />
                  </Form.Item>
                  <Form.Item label="供应商数量" name="suppliers" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入供应商数量" />
                  </Form.Item>
                  <Form.Item label="核心产品/服务" name="coreProduct">
                    <Input.TextArea rows={3} placeholder="请简述核心产品或服务" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={loading}
                  icon={<SafetyOutlined />}
                >
                  开始风险评估
                </Button>
              </div>
            </Form>
          </Card>
        </TabPane>

        {/* 评估结果 */}
        <TabPane tab="风险评估结果" key="result">
          {assessmentResult && (
            <>
              {/* 总体评估 */}
              <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="综合风险评分"
                      value={assessmentResult.overallScore}
                      suffix="/ 100"
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<TrophyOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="风险等级"
                      value={assessmentResult.riskLevel === 'low' ? '低风险' : 
                             assessmentResult.riskLevel === 'medium' ? '中风险' : '高风险'}
                      valueStyle={{ 
                        color: assessmentResult.riskLevel === 'low' ? '#52c41a' : 
                               assessmentResult.riskLevel === 'medium' ? '#faad14' : '#ff4d4f' 
                      }}
                      prefix={<SafetyOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <div>
                      <Text type="secondary">融资建议</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Text>{assessmentResult.recommendation}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* 详细风险分析 */}
              <Card title="详细风险分析" style={{ marginBottom: '24px' }}>
                <Table 
                  dataSource={riskScores} 
                  columns={columns} 
                  pagination={false}
                  rowKey="category"
                />
              </Card>

              {/* 财务指标分析 */}
              <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={12}>
                  <Card title="关键财务指标">
                    <Row gutter={16}>
                      {financialIndicators.map((indicator, index) => (
                        <Col span={12} key={index} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>{indicator.name}</Text>
                            <Space>
                              <Badge color={getStatusColor(indicator.status)} />
                              <Text strong>{indicator.value}</Text>
                              {indicator.trend === 'up' && <RiseOutlined style={{ color: '#52c41a' }} />}
                              {indicator.trend === 'down' && <FallOutlined style={{ color: '#ff4d4f' }} />}
                            </Space>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card title="行业对比分析">
                    {industryComparison.map((item, index) => (
                      <div key={index} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>{item.metric}</Text>
                          <Space>
                            <Text type="secondary">行业均值: {item.industry}</Text>
                            <Text strong>企业: {item.company}</Text>
                            {item.status === 'above' ? 
                              <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                            }
                          </Space>
                        </div>
                        <Progress 
                          percent={item.status === 'above' ? 75 : 45} 
                          strokeColor={item.status === 'above' ? '#52c41a' : '#faad14'}
                          size="small"
                        />
                      </div>
                    ))}
                  </Card>
                </Col>
              </Row>

              {/* 风险提示和建议 */}
              <Card title="风险提示与改进建议">
                <Row gutter={24}>
                  <Col span={12}>
                    <Alert
                      message="风险提示"
                      description={
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>现金流管理需要加强，建议优化应收账款回收</li>
                          <li>行业竞争加剧，需关注市场份额变化</li>
                          <li>供应链集中度较高，建议分散供应商风险</li>
                        </ul>
                      }
                      type="warning"
                      showIcon
                    />
                  </Col>
                  <Col span={12}>
                    <Alert
                      message="改进建议"
                      description={
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>建立完善的财务预警机制</li>
                          <li>加强与核心客户的战略合作</li>
                          <li>提升数字化管理水平</li>
                          <li>考虑引入专业风险管理顾问</li>
                        </ul>
                      }
                      type="info"
                      showIcon
                    />
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </TabPane>

        {/* 历史记录 */}
        <TabPane tab="历史评估记录" key="history">
          <Card>
            <Table
              dataSource={[
                {
                  key: '1',
                  date: '2024-01-15',
                  score: 78,
                  level: 'medium',
                  status: 'completed'
                },
                {
                  key: '2',
                  date: '2023-07-20',
                  score: 72,
                  level: 'medium',
                  status: 'completed'
                },
                {
                  key: '3',
                  date: '2023-01-10',
                  score: 68,
                  level: 'medium',
                  status: 'completed'
                }
              ]}
              columns={[
                {
                  title: '评估日期',
                  dataIndex: 'date',
                  key: 'date'
                },
                {
                  title: '综合评分',
                  dataIndex: 'score',
                  key: 'score',
                  render: (score: number) => <Text strong>{score}</Text>
                },
                {
                  title: '风险等级',
                  dataIndex: 'level',
                  key: 'level',
                  render: (level: string) => {
                    const config = {
                      low: { color: 'green', text: '低风险' },
                      medium: { color: 'orange', text: '中风险' },
                      high: { color: 'red', text: '高风险' }
                    };
                    return <Tag color={config[level as keyof typeof config]?.color}>
                      {config[level as keyof typeof config]?.text}
                    </Tag>;
                  }
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Badge 
                      status={status === 'completed' ? 'success' : 'processing'} 
                      text={status === 'completed' ? '已完成' : '进行中'} 
                    />
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space>
                      <Button type="link" size="small">查看详情</Button>
                      <Button type="link" size="small">下载报告</Button>
                    </Space>
                  )
                }
              ]}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RiskAssessment;