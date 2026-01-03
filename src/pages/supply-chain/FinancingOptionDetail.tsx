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
  Space,
  Divider,
  Typography,
  Rate,
  Steps,
  Timeline,
  Descriptions,
  Table,
  Modal,
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
  StarOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface FinancingOption {
  id: string;
  name: string;
  type: string;
  matchScore: number;
  matchLevel: string;
  interestRate: string;
  amount: string;
  term: string;
  requirements: string[];
  advantages: string[];
  risks: string[];
  provider: string;
  processingTime: string;
  successRate: number;
  rating: number;
  description: string;
  applicationProcess: string[];
  requiredDocuments: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
  };
  caseStudies: Array<{
    companyName: string;
    industry: string;
    amount: string;
    term: string;
    result: string;
  }>;
}

const FinancingOptionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟融资方案详细数据
  const getFinancingOptionDetail = (optionId: string): FinancingOption => {
    const options: Record<string, FinancingOption> = {
      '1': {
        id: '1',
        name: '供应链金融-应收账款融资',
        type: '供应链金融',
        matchScore: 95,
        matchLevel: '极度推荐',
        interestRate: '6.5%-8.5%',
        amount: '100-2000万',
        term: '3-12个月',
        description: '基于企业真实贸易背景，以应收账款为质押的融资产品。适合有稳定核心客户、应收账款质量良好的企业。审批快速，无需传统抵押担保，可循环使用。',
        requirements: [
          '应收账款真实有效，有完整的贸易合同和发票',
          '核心企业信用良好，为知名企业或上市公司',
          '历史交易记录完整，合作关系稳定',
          '企业成立满2年，经营状况良好',
          '无重大违法违规记录'
        ],
        advantages: [
          '审批快速，最快3个工作日放款',
          '无需抵押担保，降低融资门槛',
          '可循环使用，提高资金使用效率',
          '成本相对较低，利率优惠',
          '手续简便，线上化操作',
          '灵活还款，支持多种还款方式'
        ],
        risks: [
          '依赖核心企业信用状况',
          '应收账款质量直接影响融资额度',
          '贸易背景真实性审核严格',
          '核心企业付款延迟风险'
        ],
        provider: '工商银行',
        processingTime: '3-5个工作日',
        successRate: 85,
        rating: 5,
        applicationProcess: [
          '提交申请材料，包括营业执照、财务报表等',
          '银行初步审核，评估企业基本情况',
          '应收账款真实性核查，确认贸易背景',
          '核心企业信用调查，评估付款能力',
          '综合评估，确定融资额度和利率',
          '签署融资协议，办理相关手续',
          '资金放款，开始使用融资资金'
        ],
        requiredDocuments: [
          '营业执照副本',
          '组织机构代码证',
          '税务登记证',
          '近三年财务报表',
          '应收账款明细表',
          '贸易合同原件',
          '发票复印件',
          '核心企业资信证明',
          '企业征信报告',
          '法人身份证明'
        ],
        contactInfo: {
          phone: '400-888-9999',
          email: 'scf@icbc.com.cn',
          address: '北京市西城区复兴门内大街55号',
          contactPerson: '张经理'
        },
        caseStudies: [
          {
            companyName: '某制造企业',
            industry: '机械制造',
            amount: '800万',
            term: '6个月',
            result: '成功获得融资，解决了生产资金周转问题，订单按时交付'
          },
          {
            companyName: '某贸易公司',
            industry: '进出口贸易',
            amount: '1200万',
            term: '3个月',
            result: '快速获得资金支持，扩大了进货规模，提升了市场竞争力'
          },
          {
            companyName: '某科技公司',
            industry: '软件开发',
            amount: '500万',
            term: '12个月',
            result: '获得研发资金支持，成功推出新产品，实现业务突破'
          }
        ]
      },
      '2': {
        id: '2',
        name: '银行流动资金贷款',
        type: '银行贷款',
        matchScore: 88,
        matchLevel: '匹配度 88%',
        interestRate: '4.5%-6.5%',
        amount: '50-5000万',
        term: '1-3年',
        description: '传统银行信贷产品，适合有稳定经营收入、良好信用记录的企业。利率相对较低，额度较大，但审批周期较长，需要提供担保或抵押。',
        requirements: [
          '企业信用良好，无不良征信记录',
          '财务状况稳定，盈利能力强',
          '提供足值担保或抵押物',
          '企业成立满3年，经营稳定',
          '符合国家产业政策导向'
        ],
        advantages: [
          '利率较低，融资成本优势明显',
          '额度较大，可满足大额资金需求',
          '期限灵活，支持中长期融资',
          '银行信誉保障，资金安全可靠',
          '可享受银行综合金融服务'
        ],
        risks: [
          '审批周期长，资金到账时间较慢',
          '需要担保或抵押，增加融资成本',
          '还款压力大，需按期还本付息',
          '审批条件严格，门槛相对较高'
        ],
        provider: '建设银行',
        processingTime: '15-30个工作日',
        successRate: 70,
        rating: 4,
        applicationProcess: [
          '企业提交贷款申请及相关材料',
          '银行受理申请，进行初步审查',
          '实地调研，了解企业经营状况',
          '财务分析，评估还款能力',
          '担保物评估，确定担保方式',
          '信贷审批，确定贷款条件',
          '签署合同，办理担保手续',
          '放款到账，开始计息'
        ],
        requiredDocuments: [
          '贷款申请书',
          '营业执照等证照',
          '近三年审计报告',
          '最近月度财务报表',
          '贷款卡或征信报告',
          '担保物权属证明',
          '担保物评估报告',
          '企业章程',
          '董事会决议',
          '法人身份证明'
        ],
        contactInfo: {
          phone: '400-820-0588',
          email: 'loan@ccb.com',
          address: '北京市西城区金融大街25号',
          contactPerson: '李经理'
        },
        caseStudies: [
          {
            companyName: '某房地产企业',
            industry: '房地产开发',
            amount: '3000万',
            term: '2年',
            result: '获得开发资金支持，项目顺利推进，实现预期收益'
          },
          {
            companyName: '某零售连锁',
            industry: '零售业',
            amount: '1500万',
            term: '3年',
            result: '扩大门店规模，提升市场占有率，营收大幅增长'
          }
        ]
      },
      '3': {
        id: '3',
        name: '融资租赁',
        type: '融资租赁',
        matchScore: 82,
        matchLevel: '匹配度 82%',
        interestRate: '7.0%-10.0%',
        amount: '设备价值80%',
        term: '2-5年',
        description: '以设备为载体的融资方式，企业可以在不占用银行授信额度的情况下获得设备使用权和资金支持。适合需要更新设备、扩大生产的企业。',
        requirements: [
          '设备价值评估合理，权属清晰',
          '企业经营稳定，有持续盈利能力',
          '租赁物权属清晰，无争议',
          '企业信用良好，无重大违约记录',
          '符合融资租赁公司准入标准'
        ],
        advantages: [
          '保留设备使用权，不影响生产经营',
          '享受税收优惠政策',
          '提升资产使用效率',
          '不占用银行授信额度',
          '灵活的还款安排'
        ],
        risks: [
          '融资成本相对较高',
          '设备贬值风险',
          '租赁期间设备所有权归租赁公司',
          '提前终止成本较高'
        ],
        provider: '中信金融租赁',
        processingTime: '10-20个工作日',
        successRate: 75,
        rating: 4,
        applicationProcess: [
          '提交租赁申请及企业资料',
          '设备评估，确定租赁价值',
          '企业资信调查',
          '制定租赁方案',
          '签署租赁合同',
          '设备交付使用',
          '按期支付租金'
        ],
        requiredDocuments: [
          '租赁申请书',
          '企业营业执照',
          '财务报表',
          '设备购买合同',
          '设备技术资料',
          '设备评估报告',
          '企业征信报告',
          '法人身份证明'
        ],
        contactInfo: {
          phone: '400-600-1818',
          email: 'leasing@citicfl.com',
          address: '北京市朝阳区光华路2号',
          contactPerson: '王经理'
        },
        caseStudies: [
          {
            companyName: '某印刷企业',
            industry: '印刷包装',
            amount: '600万',
            term: '3年',
            result: '更新生产设备，提升产能和产品质量，订单量显著增加'
          }
        ]
      }
    };

    return options[optionId] || options['1'];
  };

  const [optionDetail, setOptionDetail] = useState<FinancingOption | null>(null);

  useEffect(() => {
    if (id) {
      const detail = getFinancingOptionDetail(id);
      setOptionDetail(detail);
    }
  }, [id]);

  const handleApply = () => {
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
        productName: optionDetail?.name || '融资产品'
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

  if (!optionDetail) {
    return <div>加载中...</div>;
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const processColumns = [
    {
      title: '步骤',
      dataIndex: 'step',
      key: 'step',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: '#1890ff', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {index + 1}
        </div>
      )
    },
    {
      title: '流程说明',
      dataIndex: 'description',
      key: 'description',
    }
  ];

  const processData = optionDetail.applicationProcess.map((process, index) => ({
    key: index,
    description: process
  }));

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <div style={{ marginBottom: '24px', background: '#fff', padding: '16px 24px', borderRadius: '8px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button 
              type="text"
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>{optionDetail.name} - 详情</Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              icon={<RocketOutlined />}
              onClick={handleApply}
            >
              立即申请
            </Button>
          </Col>
        </Row>
      </div>

      {/* 方案概览卡片 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24}>
          <Col span={16}>
            <div style={{ marginBottom: '16px' }}>
              <Space align="center">
                <Title level={2} style={{ margin: 0 }}>{optionDetail.name}</Title>
                <Tag color={getMatchColor(optionDetail.matchScore)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {optionDetail.matchLevel}
                </Tag>
                <Rate disabled value={optionDetail.rating} />
              </Space>
            </div>
            <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              {optionDetail.description}
            </Paragraph>
            <Row gutter={[24, 16]}>
              <Col span={6}>
                <Statistic
                  title="利率/成本"
                  value={optionDetail.interestRate}
                  prefix={<PercentageOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="融资额度"
                  value={optionDetail.amount}
                  prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="融资期限"
                  value={optionDetail.term}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14', fontSize: '20px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="成功率"
                  value={optionDetail.successRate}
                  suffix="%"
                  prefix={<TrophyOutlined style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Card 
              title={
                <Space>
                  <BankOutlined style={{ color: '#1890ff' }} />
                  <span>机构信息</span>
                </Space>
              }
              size="small"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="提供机构">{optionDetail.provider}</Descriptions.Item>
                <Descriptions.Item label="审批时间">{optionDetail.processingTime}</Descriptions.Item>
                <Descriptions.Item label="联系人">{optionDetail.contactInfo.contactPerson}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{optionDetail.contactInfo.phone}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="large"
        tabBarStyle={{ background: '#fff', padding: '0 24px', marginBottom: '0' }}
      >
        {/* 方案详情 */}
        <Tabs.TabPane tab="方案详情" key="overview">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="主要优势" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={optionDetail.advantages}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="风险提示" style={{ marginBottom: '16px' }}>
                <List
                  dataSource={optionDetail.risks}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space>
                        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
          <Card title="申请条件">
            <List
              dataSource={optionDetail.requirements}
              renderItem={(item, index) => (
                <List.Item>
                  <Space>
                    <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Tabs.TabPane>

        {/* 申请流程 */}
        <Tabs.TabPane tab="申请流程" key="process">
          <Card title="办理流程">
            <Table
              columns={processColumns}
              dataSource={processData}
              pagination={false}
              showHeader={false}
            />
          </Card>
          <Card title="所需材料" style={{ marginTop: '16px' }}>
            <Row gutter={[16, 16]}>
              {optionDetail.requiredDocuments.map((doc, index) => (
                <Col span={8} key={index}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>{doc}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Tabs.TabPane>

        {/* 成功案例 */}
        <Tabs.TabPane tab="成功案例" key="cases">
          <Row gutter={24}>
            {optionDetail.caseStudies.map((caseItem, index) => (
              <Col span={8} key={index}>
                <Card
                  title={caseItem.companyName}
                  extra={<Tag color="green">成功案例</Tag>}
                  style={{ marginBottom: '16px' }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="所属行业">{caseItem.industry}</Descriptions.Item>
                    <Descriptions.Item label="融资金额">{caseItem.amount}</Descriptions.Item>
                    <Descriptions.Item label="融资期限">{caseItem.term}</Descriptions.Item>
                  </Descriptions>
                  <Divider />
                  <Paragraph style={{ fontSize: '14px' }}>
                    <Text strong>案例结果：</Text>
                    {caseItem.result}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>

        {/* 联系方式 */}
        <Tabs.TabPane tab="联系方式" key="contact">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="联系信息">
                <Descriptions column={1}>
                  <Descriptions.Item 
                    label={<Space><UserOutlined />联系人</Space>}
                  >
                    {optionDetail.contactInfo.contactPerson}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<Space><PhoneOutlined />联系电话</Space>}
                  >
                    {optionDetail.contactInfo.phone}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<Space><MailOutlined />邮箱地址</Space>}
                  >
                    {optionDetail.contactInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<Space><EnvironmentOutlined />办公地址</Space>}
                  >
                    {optionDetail.contactInfo.address}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="快速咨询">
                <Alert
                  message="专业服务"
                  description="我们的专业团队将为您提供一对一的融资咨询服务，帮助您选择最适合的融资方案。"
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
                <Button type="primary" block size="large" onClick={handleApply}>
                  立即咨询
                </Button>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      {/* 申请弹窗 */}
      <Modal
        title="融资申请"
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

export default FinancingOptionDetail;
