/**
 * 智能匹配页面
 * 基于企业信息智能推荐适合的政策项目
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Row,
  Col,
  Progress,
  Tag,
  List,
  Avatar,
  Typography,
  Space,
  Divider,
  Alert,
  Badge,
  Tooltip,
  Modal,
  message
} from 'antd';
import {
  BulbOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  RocketOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

interface CompanyInfo {
  name: string;
  industry: string;
  scale: string;
  revenue: string;
  employees: number;
  location: string;
  businessScope: string;
  techLevel: string;
}

interface PolicyRecommendation {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  fundingAmount: string;
  deadline: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  benefits: string[];
  description: string;
  applicationCount: number;
  successRate: number;
}

const SmartMatching: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecommendation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 清空推荐数据
  const mockRecommendations: PolicyRecommendation[] = [];

  const handleCompanyInfoSubmit = async (values: CompanyInfo) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCompanyInfo(values);
      setRecommendations(mockRecommendations);
      setCurrentStep(1);
      message.warning('智能匹配功能暂时不可用，系统正在维护中...');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePolicyDetail = (policy: PolicyRecommendation) => {
    setSelectedPolicy(policy);
    setModalVisible(true);
  };

  const handleApplyPolicy = (policyId: string) => {
    message.success('跳转到申报页面...');
    navigate(`/policy-center/application-management/apply/${policyId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '容易';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  const renderCompanyInfoForm = () => (
    <Card title="企业基本信息" style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCompanyInfoSubmit}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="企业名称"
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input placeholder="请输入企业全称" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="industry"
              label="所属行业"
              rules={[{ required: true, message: '请选择所属行业' }]}
            >
              <Select placeholder="请选择行业">
                <Option value="软件和信息技术服务业">软件和信息技术服务业</Option>
                <Option value="制造业">制造业</Option>
                <Option value="批发和零售业">批发和零售业</Option>
                <Option value="科学研究和技术服务业">科学研究和技术服务业</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="scale"
              label="企业规模"
              rules={[{ required: true, message: '请选择企业规模' }]}
            >
              <Select placeholder="请选择企业规模">
                <Option value="微型企业">微型企业</Option>
                <Option value="小型企业">小型企业</Option>
                <Option value="中型企业">中型企业</Option>
                <Option value="大型企业">大型企业</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="revenue"
              label="年营业收入"
              rules={[{ required: true, message: '请选择年营业收入' }]}
            >
              <Select placeholder="请选择年营业收入">
                <Option value="100万以下">100万以下</Option>
                <Option value="100-500万">100-500万</Option>
                <Option value="500-2000万">500-2000万</Option>
                <Option value="2000万-4亿">2000万-4亿</Option>
                <Option value="4亿以上">4亿以上</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="employees"
              label="员工人数"
              rules={[{ required: true, message: '请输入员工人数' }]}
            >
              <Input type="number" placeholder="请输入员工人数" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label="企业所在地"
              rules={[{ required: true, message: '请选择企业所在地' }]}
            >
              <Select placeholder="请选择所在地区">
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="广东省">广东省</Option>
                <Option value="浙江省">浙江省</Option>
                <Option value="江苏省">江苏省</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="businessScope"
              label="主营业务"
              rules={[{ required: true, message: '请描述主营业务' }]}
            >
              <TextArea 
                rows={3} 
                placeholder="请简要描述企业的主营业务和产品服务" 
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="techLevel"
              label="技术水平"
              rules={[{ required: true, message: '请选择技术水平' }]}
            >
              <Select placeholder="请选择企业技术水平">
                <Option value="传统技术">传统技术</Option>
                <Option value="一般技术">一般技术</Option>
                <Option value="先进技术">先进技术</Option>
                <Option value="高新技术">高新技术</Option>
                <Option value="前沿技术">前沿技术</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            开始智能匹配
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderRecommendations = () => (
    <div>
      <Alert
        message="智能匹配暂不可用"
        description="智能匹配功能正在维护升级中，暂时无法为您推荐政策项目。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
        <BulbOutlined style={{ fontSize: '64px', marginBottom: '24px' }} />
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>智能匹配功能维护中</div>
        <div>系统正在升级，请稍后再试</div>
      </div>
    </div>
  );

  return (
    <PageWrapper title="">
      <div style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '120px', opacity: 0.3 }}>🔒</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SmartMatching;
