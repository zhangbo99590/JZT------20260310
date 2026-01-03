import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Progress, 
  Statistic, 
  Tag, 
  Alert,
  Tabs,
  List,
  Avatar,
  Space,
  Divider,
  Typography,
  Rate,
  Modal,
  Steps,
  Timeline,
  Descriptions,
  Empty,
  Result,
  Form,
  Input,
  InputNumber,
  Select,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  SwapOutlined,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
  FileSearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DiagnosisAnalysisProps {}

interface FinancingOption {
  id: string;
  name: string;
  type: string;
  matchScore: number;
  interestRate: string;
  amount: string;
  term: string;
  requirements: string[];
  advantages: string[];
  risks: string[];
  provider: string;
  processingTime: string;
  successRate: number;
}

const DiagnosisAnalysis: React.FC<DiagnosisAnalysisProps> = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommendation');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [hasFinancingData, setHasFinancingData] = useState(false);
  const [financingData, setFinancingData] = useState<any>(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FinancingOption | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // 检查是否有融资诊断数据
    const storedData = localStorage.getItem('financing-diagnosis-data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFinancingData(data);
        setHasFinancingData(true);
      } catch (error) {
        console.error('解析融资诊断数据失败:', error);
        setHasFinancingData(false);
      }
    } else {
      setHasFinancingData(false);
    }
  }, []);

  // 模拟融资方案数据
  const financingOptions: FinancingOption[] = [
    {
      id: '1',
      name: '供应链金融-应收账款融资',
      type: '供应链金融',
      matchScore: 95,
      interestRate: '6.5%-8.5%',
      amount: '100-2000万',
      term: '3-12个月',
      requirements: ['应收账款真实有效', '核心企业信用良好', '历史交易记录完整'],
      advantages: ['审批快速', '无需抵押', '循环使用', '成本相对较低'],
      risks: ['依赖核心企业信用', '应收账款质量风险'],
      provider: '工商银行',
      processingTime: '3-5个工作日',
      successRate: 85
    },
    {
      id: '2',
      name: '银行流动资金贷款',
      type: '银行贷款',
      matchScore: 88,
      interestRate: '4.5%-6.5%',
      amount: '50-5000万',
      term: '1-3年',
      requirements: ['企业信用良好', '财务状况稳定', '提供担保或抵押'],
      advantages: ['利率较低', '额度较大', '期限灵活'],
      risks: ['审批周期长', '需要担保', '还款压力大'],
      provider: '建设银行',
      processingTime: '15-30个工作日',
      successRate: 70
    },
    {
      id: '3',
      name: '融资租赁',
      type: '融资租赁',
      matchScore: 82,
      interestRate: '7.0%-10.0%',
      amount: '设备价值80%',
      term: '2-5年',
      requirements: ['设备价值评估', '企业经营稳定', '租赁物权属清晰'],
      advantages: ['保留设备使用权', '税收优惠', '提升资产效率'],
      risks: ['成本相对较高', '设备贬值风险'],
      provider: '中信金融租赁',
      processingTime: '10-20个工作日',
      successRate: 75
    },
    {
      id: '4',
      name: '股权融资',
      type: '股权投资',
      matchScore: 65,
      interestRate: '股权稀释',
      amount: '500-5000万',
      term: '长期持有',
      requirements: ['企业成长性好', '商业模式清晰', '管理团队优秀'],
      advantages: ['无还款压力', '获得资源支持', '提升企业价值'],
      risks: ['股权稀释', '决策权分散', '退出不确定'],
      provider: '红杉资本',
      processingTime: '60-120个工作日',
      successRate: 25
    }
  ];

  const analysisSteps = [
    {
      title: '需求分析',
      description: '基于企业提交的融资需求进行深度分析',
      status: 'finish' as const
    },
    {
      title: '风险评估',
      description: '综合评估企业信用、财务、经营等风险',
      status: 'finish' as const
    },
    {
      title: '方案匹配',
      description: '智能匹配最适合的融资方案',
      status: 'process' as const
    },
    {
      title: '方案优化',
      description: '根据企业特点优化融资方案',
      status: 'wait' as const
    }
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleCompare = () => {
    if (selectedOptions.length >= 2) {
      setCompareModalVisible(true);
    }
  };

  const handleApplyOption = (option: FinancingOption) => {
    setSelectedOption(option);
    setApplyModalVisible(true);
  };

  const handleApplySubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 生成申请数据，为可选字段提供默认值
      const applicationData = {
        ...values,
        amount: values.amount || 0, // 如果没有填写金额，默认为0
        purpose: values.purpose || 'other', // 如果没有选择用途，默认为其他
        applicationId: 'FA' + Date.now().toString().slice(-8),
        submitTime: new Date().toLocaleString(),
        productName: selectedOption?.name || '融资产品'
      };
      
      // 保存申请数据
      localStorage.setItem('latest-application', JSON.stringify(applicationData));
      
      message.success('申请提交成功，正在跳转...');
      setApplyModalVisible(false);
      form.resetFields();
      
      // 跳转到申请成功页面
      setTimeout(() => {
        navigate('/supply-chain-finance/application-success', {
          state: { applicationData }
        });
      }, 1000);
    } catch (error) {
      message.error('请完善申请信息');
    }
  };

  // 如果没有融资诊断数据，显示引导页面
  if (!hasFinancingData) {
    return (
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* 顶部导航 */}
        <div style={{ marginBottom: '24px', background: '#fff', padding: '16px 24px', borderRadius: '8px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Button 
                type="text"
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/supply-chain-finance')}
              >
                返回供应链金融
              </Button>
            </Col>
            <Col>
              <Title level={3} style={{ margin: 0 }}>融资诊断分析</Title>
            </Col>
            <Col style={{ width: '120px' }}></Col>
          </Row>
        </div>

        {/* 空状态页面 */}
        <Card>
          <Result
            icon={<FileSearchOutlined style={{ color: '#1890ff' }} />}
            title="暂无诊断数据"
            subTitle="您还没有进行融资诊断，请先完成融资需求采集以获得个性化的融资方案推荐。"
            extra={[
              <Button 
                type="primary" 
                key="start-diagnosis" 
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate('/supply-chain-finance/financing-diagnosis')}
              >
                开始融资诊断
              </Button>,
              <Button 
                key="view-products" 
                size="large"
                onClick={() => navigate('/supply-chain-finance')}
              >
                查看金融产品
              </Button>
            ]}
          />
          
          {/* 诊断流程说明 */}
          <div style={{ marginTop: '40px', padding: '24px', background: '#fafafa', borderRadius: '8px' }}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
              <StarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              融资诊断流程
            </Title>
            <Steps
              direction="horizontal"
              current={-1}
              items={[
                {
                  title: '需求采集',
                  description: '填写企业基本信息和融资需求',
                  icon: <FileSearchOutlined />
                },
                {
                  title: '智能分析',
                  description: '系统智能匹配最适合的融资方案',
                  icon: <TrophyOutlined />
                },
                {
                  title: '方案推荐',
                  description: '获得个性化的融资方案和专业建议',
                  icon: <RocketOutlined />
                }
              ]}
            />
          </div>
        </Card>
      </div>
    );
  }

  const renderOptionCard = (option: FinancingOption) => (
    <Card
      key={option.id}
      style={{ marginBottom: '16px' }}
      actions={[
        <Button 
          type="primary" 
          icon={<RocketOutlined />}
          onClick={() => handleApplyOption(option)}
        >
          立即申请
        </Button>,
        <Button 
          type="link" 
          icon={<HeartOutlined />}
          onClick={() => handleSelectOption(option.id)}
        >
          {selectedOptions.includes(option.id) ? '取消收藏' : '收藏'}
        </Button>,
        <Button 
          type="link" 
          icon={<ShareAltOutlined />}
          onClick={() => {/* 分享 */}}
        >
          分享
        </Button>
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Title level={4} style={{ margin: 0, marginRight: '12px' }}>
              {option.name}
            </Title>
            <Tag color={getMatchColor(option.matchScore)}>
              匹配度 {option.matchScore}%
            </Tag>
          </div>
          
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col span={6}>
              <Statistic
                title="利率/成本"
                value={option.interestRate}
                valueStyle={{ fontSize: '16px' }}
                prefix={<PercentageOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="融资额度"
                value={option.amount}
                valueStyle={{ fontSize: '16px' }}
                prefix={<DollarOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="融资期限"
                value={option.term}
                valueStyle={{ fontSize: '16px' }}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="成功率"
                value={option.successRate}
                suffix="%"
                valueStyle={{ fontSize: '16px' }}
                prefix={<TrophyOutlined />}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <Text strong>主要优势：</Text>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {option.advantages.slice(0, 2).map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>申请条件：</Text>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {option.requirements.slice(0, 2).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <BankOutlined />
              <Text type="secondary">{option.provider}</Text>
              <Divider type="vertical" />
              <ClockCircleOutlined />
              <Text type="secondary">审批时间：{option.processingTime}</Text>
            </Space>
            <Rate disabled defaultValue={Math.floor(option.matchScore / 20)} />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* 顶部导航 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/supply-chain-finance')}
          >
            返回供应链金融
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            融资诊断分析报告
            {financingData && (
              <Text type="secondary" style={{ fontSize: '14px', marginLeft: '12px' }}>
                基于 {financingData.companyName || '您的企业'} 的融资需求分析
              </Text>
            )}
          </Title>
        </Space>
        <Space>
          <Button 
            type="primary" 
            disabled={selectedOptions.length < 2}
            onClick={handleCompare}
            icon={<SwapOutlined />}
          >
            方案对比 ({selectedOptions.length})
          </Button>
          <Button type="primary" icon={<RocketOutlined />}>
            立即申请
          </Button>
        </Space>
      </div>

      {/* 诊断进度 */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps current={2} items={analysisSteps} />
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        {/* 智能推荐 */}
        <TabPane tab="智能推荐方案" key="recommendation">
          <Row gutter={24}>
            <Col span={18}>
              <div>
                {financingOptions.map(option => renderOptionCard(option))}
              </div>
            </Col>
            
            <Col span={6}>
              <Card title="推荐依据" style={{ marginBottom: '16px' }}>
                <Timeline
                  items={[
                    {
                      dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                      children: '企业资质评估：优秀'
                    },
                    {
                      dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                      children: '融资需求匹配：高度匹配'
                    },
                    {
                      dot: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
                      children: '风险控制要求：中等'
                    },
                    {
                      dot: <ClockCircleOutlined style={{ color: '#faad14' }} />,
                      children: '时间紧迫性：一般'
                    }
                  ]}
                />
              </Card>

              <Card title="专家建议">
                <Alert
                  message="融资建议"
                  description="基于您的企业情况，建议优先考虑供应链金融方案，具有审批快、成本低的优势。同时可考虑银行贷款作为补充。"
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
                <Button 
                  type="primary" 
                  block 
                  icon={<RocketOutlined />}
                  onClick={() => navigate('/supply-chain-finance/financing-option-detail/1')}
                >
                  申请推荐方案
                </Button>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 匹配度分析 */}
        <TabPane tab="匹配度分析" key="matching">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="匹配度排名">
                <List
                  dataSource={financingOptions.sort((a, b) => b.matchScore - a.matchScore)}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: getMatchColor(item.matchScore),
                              color: '#fff'
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        }
                        title={item.name}
                        description={
                          <Space>
                            <Progress 
                              percent={item.matchScore} 
                              size="small" 
                              strokeColor={getMatchColor(item.matchScore)}
                              style={{ width: 200 }}
                            />
                            <Text>{item.matchScore}%</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="匹配度分析详情">
                <div style={{ marginBottom: '20px' }}>
                  <Title level={5}>供应链金融-应收账款融资</Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: '12px' }}>
                        <Text>资质匹配度</Text>
                        <Progress percent={95} size="small" strokeColor="#52c41a" />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <Text>需求匹配度</Text>
                        <Progress percent={90} size="small" strokeColor="#52c41a" />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: '12px' }}>
                        <Text>风险匹配度</Text>
                        <Progress percent={88} size="small" strokeColor="#1890ff" />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <Text>成本匹配度</Text>
                        <Progress percent={92} size="small" strokeColor="#52c41a" />
                      </div>
                    </Col>
                  </Row>
                </div>

                <Alert
                  message="匹配分析"
                  description="该方案与您的企业情况高度匹配，特别是在应收账款质量和核心客户信用方面具有明显优势。"
                  type="success"
                  showIcon
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 成功案例 */}
        <TabPane tab="成功案例" key="cases">
          <Row gutter={24}>
            {[1, 2, 3].map(i => (
              <Col span={8} key={i}>
                <Card
                  cover={
                    <div style={{ 
                      height: '120px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <Title level={3} style={{ color: '#fff', margin: 0 }}>
                        案例 {i}
                      </Title>
                    </div>
                  }
                  actions={[
                    <Button type="link">查看详情</Button>
                  ]}
                >
                  <Card.Meta
                    title={`某制造企业供应链融资案例`}
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 2 }}>
                          该企业通过应收账款融资成功获得800万资金，解决了生产资金周转问题，
                          整个流程仅用时5个工作日，大大提升了资金使用效率。
                        </Paragraph>
                        <Space>
                          <Tag color="green">融资成功</Tag>
                          <Tag color="blue">800万</Tag>
                          <Tag color="orange">5天</Tag>
                        </Space>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>

      {/* 方案对比弹窗 */}
      <Modal
        title="融资方案对比"
        visible={compareModalVisible}
        onCancel={() => setCompareModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setCompareModalVisible(false)}>
            关闭
          </Button>,
          <Button key="apply" type="primary">
            申请选中方案
          </Button>
        ]}
      >
        {selectedOptions.length >= 2 && (
          <div>
            <Row gutter={24}>
              {selectedOptions.slice(0, 3).map(optionId => {
                const option = financingOptions.find(o => o.id === optionId);
                if (!option) return null;
                
                return (
                  <Col span={8} key={optionId}>
                    <Card title={option.name} size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="匹配度">
                          <Progress 
                            percent={option.matchScore} 
                            size="small" 
                            strokeColor={getMatchColor(option.matchScore)}
                          />
                        </Descriptions.Item>
                        <Descriptions.Item label="利率">{option.interestRate}</Descriptions.Item>
                        <Descriptions.Item label="额度">{option.amount}</Descriptions.Item>
                        <Descriptions.Item label="期限">{option.term}</Descriptions.Item>
                        <Descriptions.Item label="审批时间">{option.processingTime}</Descriptions.Item>
                        <Descriptions.Item label="成功率">{option.successRate}%</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
      </Modal>

      {/* 申请弹窗 */}
      <Modal
        title={`申请 ${selectedOption?.name || '融资产品'}`}
        visible={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        onOk={handleApplySubmit}
        width={600}
        okText="提交申请"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="企业名称"
                name="companyName"
                rules={[{ required: true, message: '请输入企业名称' }]}
              >
                <Input placeholder="请输入企业名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="contactPerson"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="申请金额"
                name="amount"
              >
                <InputNumber
                  placeholder="请输入申请金额（选填）"
                  addonAfter="万元"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="资金用途"
            name="purpose"
          >
            <Select placeholder="请选择资金用途（选填）">
              <Select.Option value="equipment">设备采购</Select.Option>
              <Select.Option value="working-capital">流动资金</Select.Option>
              <Select.Option value="expansion">业务扩张</Select.Option>
              <Select.Option value="rd">研发投入</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="备注说明"
            name="remarks"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请简要说明您的融资需求和企业情况"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiagnosisAnalysis;