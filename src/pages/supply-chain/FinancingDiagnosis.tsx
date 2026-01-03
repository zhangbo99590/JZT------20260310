import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card, Row, Col, Button, Typography, Progress, Space, Tag, 
  Steps, Form, Input, InputNumber, Select, Radio, Checkbox, message, Modal, Breadcrumb,
  Dropdown, Collapse, Slider,
  MenuProps
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  ArrowRightOutlined,
  DownOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  DollarOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/performance';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface FormData {
  // 融资目标
  fundingPurpose: string;
  fundingAmount: number;
  usagePeriod: string;
  customPeriod?: number;
  
  // 企业基本信息
  companyName: string;
  establishedYear: number;
  registeredCapital: number;
  employeeCount: number;
  industry: string;
  businessScope: string;
  
  // 财务状况
  annualRevenue: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  
  // 经营状况
  mainProducts: string;
  marketPosition: string;
  competitiveAdvantages: string;
  developmentPlans: string;
  
  // 风险评估
  riskFactors: string[];
  guaranteeMethod: string;
  collateralValue?: number;
  
  // 其他信息
  previousFinancing: boolean;
  creditRating?: string;
  specialRequirements: string;
}

const FinancingDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormData>();
  const [activeKey, setActiveKey] = useState<string[]>(['1']);

  // 保存草稿 - 使用useCallback优化
  const saveDraft = useCallback(() => {
    const formData = form.getFieldsValue();
    localStorage.setItem('financing-diagnosis-draft', JSON.stringify({
      ...formData,
      saveTime: new Date().toISOString()
    }));
    message.success('草稿已保存');
  }, [form]);

  // 提交表单 - 使用useCallback优化
  const handleNext = useCallback(async () => {
    try {
      const values = await form.validateFields();
      
      // 保存表单数据到localStorage，供结果页面使用
      localStorage.setItem('financing-diagnosis-data', JSON.stringify({
        ...values,
        submitTime: new Date().toISOString()
      }));
      
      message.success('诊断完成，正在生成报告...');
      
      // 跳转到结果页面
      setTimeout(() => {
        navigate('/supply-chain-finance/diagnosis-report');
      }, 1500);
    } catch (error) {
      message.error('请完善必填信息');
    }
  }, [form, navigate]);

  // 加载草稿数据
  useEffect(() => {
    const draftData = localStorage.getItem('financing-diagnosis-draft');
    if (draftData) {
      try {
        const data = JSON.parse(draftData);
        form.setFieldsValue(data);
        message.info('已加载草稿数据');
      } catch (error) {
        console.error('加载草稿失败:', error);
      }
    }
  }, [form]);

  const fundingPurposeOptions = useMemo(() => [
    { label: '扩大生产规模', value: 'expand_production' },
    { label: '技术研发投入', value: 'rd_investment' },
    { label: '市场拓展', value: 'market_expansion' },
    { label: '设备采购', value: 'equipment_purchase' },
    { label: '流动资金周转', value: 'working_capital' },
    { label: '其他', value: 'other' }
  ], []);

  const industryOptions = useMemo(() => [
    '制造业', '信息技术', '金融服务', '房地产', '批发零售',
    '交通运输', '住宿餐饮', '教育', '卫生医疗', '文化娱乐', '其他'
  ], []);

  const riskFactorOptions = useMemo(() => [
    { label: '市场竞争激烈', value: 'market_competition' },
    { label: '技术更新换代快', value: 'tech_update' },
    { label: '原材料价格波动', value: 'material_price' },
    { label: '政策法规变化', value: 'policy_change' },
    { label: '汇率波动', value: 'exchange_rate' },
    { label: '供应链风险', value: 'supply_chain' },
    { label: '人才流失', value: 'talent_loss' },
    { label: '其他', value: 'other' }
  ], []);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '金融服务',
            href: '/supply-chain-finance',
          },
          {
            title: '融资诊断',
          },
        ]}
      />

      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <FormOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          企业融资诊断
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          通过详细的企业信息收集，为您提供专业的融资建议和解决方案
        </Text>
      </div>

      {/* 进度指示 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <Progress 
            percent={50} 
            strokeColor="#1890ff"
            format={() => '信息收集阶段'}
          />
          <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
            请填写完整的企业信息，我们将为您生成专业的融资诊断报告
          </Text>
        </div>
      </Card>

      {/* 表单内容 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Collapse 
            activeKey={activeKey} 
            onChange={setActiveKey}
            size="large"
          >
            {/* 融资目标 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="blue">1</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>融资目标</span>
                </div>
              } 
              key="1"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="融资用途"
                    name="fundingPurpose"
                    rules={[{ required: true, message: '请选择融资用途' }]}
                  >
                    <Select placeholder="请选择融资用途" size="large">
                      {fundingPurposeOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="融资金额（万元）"
                    name="fundingAmount"
                    rules={[{ required: true, message: '请输入融资金额' }]}
                  >
                    <InputNumber
                      placeholder="请输入融资金额"
                      style={{ width: '100%' }}
                      size="large"
                      min={1}
                      max={100000}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="资金使用期限"
                    name="usagePeriod"
                    rules={[{ required: true, message: '请选择使用期限' }]}
                  >
                    <Select placeholder="请选择使用期限" size="large">
                      <Select.Option value="3months">3个月以内</Select.Option>
                      <Select.Option value="6months">3-6个月</Select.Option>
                      <Select.Option value="1year">6个月-1年</Select.Option>
                      <Select.Option value="2years">1-2年</Select.Option>
                      <Select.Option value="3years">2-3年</Select.Option>
                      <Select.Option value="5years">3-5年</Select.Option>
                      <Select.Option value="longterm">5年以上</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 企业基本信息 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="green">2</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>企业基本信息</span>
                </div>
              } 
              key="2"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="企业名称"
                    name="companyName"
                    rules={[{ required: true, message: '请输入企业名称' }]}
                  >
                    <Input placeholder="请输入企业名称" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="成立年份"
                    name="establishedYear"
                    rules={[{ required: true, message: '请输入成立年份' }]}
                  >
                    <InputNumber
                      placeholder="请输入成立年份"
                      style={{ width: '100%' }}
                      size="large"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="注册资本（万元）"
                    name="registeredCapital"
                    rules={[{ required: true, message: '请输入注册资本' }]}
                  >
                    <InputNumber
                      placeholder="请输入注册资本"
                      style={{ width: '100%' }}
                      size="large"
                      min={1}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="员工人数"
                    name="employeeCount"
                    rules={[{ required: true, message: '请输入员工人数' }]}
                  >
                    <InputNumber
                      placeholder="请输入员工人数"
                      style={{ width: '100%' }}
                      size="large"
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="所属行业"
                    name="industry"
                    rules={[{ required: true, message: '请选择所属行业' }]}
                  >
                    <Select placeholder="请选择所属行业" size="large">
                      {industryOptions.map(industry => (
                        <Select.Option key={industry} value={industry}>
                          {industry}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="经营范围"
                    name="businessScope"
                    rules={[{ required: true, message: '请输入经营范围' }]}
                  >
                    <TextArea
                      placeholder="请详细描述企业的经营范围和主营业务"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 财务状况 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="orange">3</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>财务状况</span>
                </div>
              } 
              key="3"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="年营业收入（万元）"
                    name="annualRevenue"
                    rules={[{ required: true, message: '请输入年营业收入' }]}
                  >
                    <InputNumber
                      placeholder="请输入年营业收入"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="净利润（万元）"
                    name="netProfit"
                    rules={[{ required: true, message: '请输入净利润' }]}
                  >
                    <InputNumber
                      placeholder="请输入净利润"
                      style={{ width: '100%' }}
                      size="large"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="总资产（万元）"
                    name="totalAssets"
                    rules={[{ required: true, message: '请输入总资产' }]}
                  >
                    <InputNumber
                      placeholder="请输入总资产"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="总负债（万元）"
                    name="totalLiabilities"
                    rules={[{ required: true, message: '请输入总负债' }]}
                  >
                    <InputNumber
                      placeholder="请输入总负债"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 经营状况 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="purple">4</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>经营状况</span>
                </div>
              } 
              key="4"
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="主要产品/服务"
                    name="mainProducts"
                    rules={[{ required: true, message: '请输入主要产品或服务' }]}
                  >
                    <TextArea
                      placeholder="请详细描述企业的主要产品或服务"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="市场地位"
                    name="marketPosition"
                    rules={[{ required: true, message: '请描述市场地位' }]}
                  >
                    <TextArea
                      placeholder="请描述企业在行业中的市场地位和竞争优势"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="竞争优势"
                    name="competitiveAdvantages"
                    rules={[{ required: true, message: '请描述竞争优势' }]}
                  >
                    <TextArea
                      placeholder="请详细描述企业的核心竞争优势"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="发展规划"
                    name="developmentPlans"
                    rules={[{ required: true, message: '请描述发展规划' }]}
                  >
                    <TextArea
                      placeholder="请描述企业未来3-5年的发展规划"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 风险评估 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="red">5</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>风险评估</span>
                </div>
              } 
              key="5"
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="主要风险因素"
                    name="riskFactors"
                    rules={[{ required: true, message: '请选择主要风险因素' }]}
                  >
                    <Checkbox.Group options={riskFactorOptions} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="担保方式"
                    name="guaranteeMethod"
                    rules={[{ required: true, message: '请选择担保方式' }]}
                  >
                    <Select placeholder="请选择担保方式" size="large">
                      <Select.Option value="credit">信用担保</Select.Option>
                      <Select.Option value="mortgage">抵押担保</Select.Option>
                      <Select.Option value="pledge">质押担保</Select.Option>
                      <Select.Option value="guarantee">保证担保</Select.Option>
                      <Select.Option value="mixed">混合担保</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="抵押物价值（万元）"
                    name="collateralValue"
                  >
                    <InputNumber
                      placeholder="如有抵押物，请输入评估价值"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 其他信息 */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color="cyan">6</Tag>
                  <span style={{ fontWeight: 600, fontSize: '16px' }}>其他信息</span>
                </div>
              } 
              key="6"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="是否有过融资经历"
                    name="previousFinancing"
                    rules={[{ required: true, message: '请选择是否有过融资经历' }]}
                  >
                    <Radio.Group size="large">
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="信用等级"
                    name="creditRating"
                  >
                    <Select placeholder="如有信用评级，请选择" size="large">
                      <Select.Option value="AAA">AAA</Select.Option>
                      <Select.Option value="AA">AA</Select.Option>
                      <Select.Option value="A">A</Select.Option>
                      <Select.Option value="BBB">BBB</Select.Option>
                      <Select.Option value="BB">BB</Select.Option>
                      <Select.Option value="B">B</Select.Option>
                      <Select.Option value="CCC">CCC以下</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="特殊要求"
                    name="specialRequirements"
                  >
                    <TextArea
                      placeholder="如有特殊要求或补充说明，请在此填写"
                      rows={3}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Form>

        {/* 底部操作按钮 */}
        <div style={{ 
          marginTop: '32px', 
          padding: '24px 0', 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Space size="large">
            <Button 
              size="large"
              icon={<SaveOutlined />}
              onClick={saveDraft}
            >
              保存草稿
            </Button>
            <Button 
              type="primary" 
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={handleNext}
            >
              下一步
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default FinancingDiagnosis;
