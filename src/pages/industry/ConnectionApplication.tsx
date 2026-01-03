import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Steps,
  Alert,
  Checkbox,
  Radio,
  Tag,
  Avatar,
  Progress,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  FileTextOutlined,
  SendOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  StarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { Publication } from '../../types/industry';
import { createConnection } from '../../services/industryService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

interface ConnectionApplicationProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  publication: Publication | null;
}

interface ApplicationForm {
  // 申请编号
  applicationId: string;
  
  // 基本信息
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  position: string;
  
  // 企业信息
  companyAddress: string;
  businessScope: string;
  registeredCapital: number;
  establishedYear: number;
  employeeCount: string;
  
  // 对接需求
  connectionPurpose: string;
  cooperationMode: string;
  expectedBudget: number;
  budgetUnit: string;
  timeframe: string;
  specificRequirements: string;
  
  // 企业实力
  annualRevenue: number;
  revenueUnit: string;
  mainProducts: string;
  certifications: string[];
  previousExperience: string;
  
  // 附加信息
  attachments: any[];
  additionalInfo: string;
  urgencyLevel: string;
  preferredContactTime: string;
}

const ConnectionApplication: React.FC<ConnectionApplicationProps> = ({
  visible,
  onCancel,
  onSuccess,
  publication,
}) => {
  const [form] = Form.useForm<ApplicationForm>();
  const navigate = useNavigate();
  // 移除步骤状态，改为单页表单
  const [loading, setLoading] = useState(false);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [applicationId, setApplicationId] = useState<string>('');

  useEffect(() => {
    if (visible && publication) {
      // 模拟计算匹配度
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      setMatchScore(score);
      
      // 生成申请编号
      const newApplicationId = 'FA' + Date.now().toString().slice(-8);
      setApplicationId(newApplicationId);
      
      // 重置表单并设置申请编号
      form.resetFields();
      form.setFieldsValue({
        applicationId: newApplicationId
      });
    }
  }, [visible, publication, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (!publication) {
        message.error('商机信息不存在');
        return;
      }

      // 构建对接申请消息
      const applicationMessage = `
【对接申请】
企业名称：${values.companyName}
联系人：${values.contactPerson}
联系电话：${values.contactPhone}
对接目的：${values.connectionPurpose}
合作模式：${values.cooperationMode}
预期预算：${values.expectedBudget}${values.budgetUnit}
具体需求：${values.specificRequirements}
      `.trim();

      await createConnection(publication.id, applicationMessage, values.applicationId);
      
      // 准备申请数据用于成功页面显示
      const applicationData = {
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
        connectionPurpose: values.connectionPurpose,
        specificRequirements: values.specificRequirements,
        applicationId: values.applicationId,
        submitTime: new Date().toLocaleString(),
        publicationTitle: publication.title,
        publisherName: publication.publisherName
      };

      // 保存申请数据到localStorage
      localStorage.setItem('latest-connection-application', JSON.stringify(applicationData));
      
      // 关闭弹窗
      onCancel();
      form.resetFields();
      
      // 跳转到成功页面
      navigate('/industry/connection-application-success', {
        state: { applicationData }
      });
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 简化为单页表单内容
  const renderFormContent = () => {
    return (
      <div>
        {/* 匹配度显示 */}
        <Card style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <Row align="middle">
            <Col span={4}>
              <div style={{ textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={matchScore}
                  width={60}
                  strokeColor={matchScore >= 80 ? '#52c41a' : '#1890ff'}
                />
              </div>
            </Col>
            <Col span={20}>
              <Title level={5} style={{ margin: 0, color: '#52c41a' }}>
                <StarOutlined /> 匹配度评估：{matchScore}%
              </Title>
              <Text type="secondary">
                基于商机信息，系统评估匹配度为 {matchScore}%，
                {matchScore >= 90 ? '匹配度极高，强烈推荐对接！' :
                 matchScore >= 80 ? '匹配度很高，推荐对接！' :
                 matchScore >= 70 ? '匹配度良好，可以尝试对接。' :
                 '匹配度一般，建议优化需求描述。'}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* 基本信息 */}
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="applicationId"
                label="申请编号"
              >
                <Input disabled style={{ color: '#000', fontWeight: 'bold' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="企业名称"
                rules={[{ required: true, message: '请输入企业名称' }]}
              >
                <Input placeholder="请输入企业全称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 对接需求 */}
        <Card title="对接需求" style={{ marginBottom: 16 }}>
          <Form.Item
            name="connectionPurpose"
            label="对接目的"
            rules={[{ required: true, message: '请选择对接目的' }]}
          >
            <Radio.Group>
              <Radio value="procurement">采购合作</Radio>
              <Radio value="supply">供应合作</Radio>
              <Radio value="technology">技术合作</Radio>
              <Radio value="investment">投资合作</Radio>
              <Radio value="strategic">战略合作</Radio>
              <Radio value="other">其他</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="specificRequirements"
            label="具体需求描述"
            rules={[{ required: true, message: '请详细描述您的需求' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述您的具体需求、技术要求、质量标准等..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expectedBudget"
                label="预期预算"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预算金额"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budgetUnit"
                label="预算单位"
              >
                <Select placeholder="请选择单位">
                  <Option value="元">元</Option>
                  <Option value="万元">万元</Option>
                  <Option value="美元">美元</Option>
                  <Option value="欧元">欧元</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>


        <Alert
          message="提交须知"
          description="提交申请后，对方企业将收到您的对接请求，请确保联系信息准确有效。"
          type="info"
          showIcon
        />
      </div>
    );
  };

  return (
    <Modal
      title={
        <div>
          <SendOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          商机对接申请
          {publication && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {publication.type === 'supply' ? '供给' : '需求'}
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnClose
    >
      {publication && (
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Row align="middle">
            <Col span={2}>
              <Avatar size={40} icon={<BankOutlined />} />
            </Col>
            <Col span={22}>
              <Title level={5} style={{ margin: 0 }}>
                {publication.title}
              </Title>
              <Space>
                <Text type="secondary">{publication.publisherName}</Text>
                <Text type="secondary">•</Text>
                <Text type="secondary">{publication.region}</Text>
                <Text type="secondary">•</Text>
                <Text type="secondary">{publication.industry}</Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        {renderFormContent()}
      </Form>

      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            icon={<SendOutlined />}
            size="large"
          >
            提交申请
          </Button>
          
          <Button onClick={onCancel} size="large">
            取消
          </Button>
        </Space>
      </div>
    </Modal>
  );
};


export default ConnectionApplication;
