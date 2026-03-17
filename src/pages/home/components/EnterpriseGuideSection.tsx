/**
 * 首页企业画像引导与认证模块
 * 创建时间: 2026-03-17
 * 功能: 
 * 1. 引导企业用户完善核心画像信息
 * 2. 提供企业认证入口与邀请机制
 * 3. 基于画像提供智能推荐
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Modal, Form, Input, Select, Radio, Steps, Typography, Row, Col, Alert, Space, Tag, message, Divider, Slider } from 'antd';
import { 
  UserOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  RightOutlined, 
  CrownOutlined, 
  CheckCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCompanyProfileContext } from '../../../context/CompanyProfileContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface EnterpriseGuideSectionProps {
  loading?: boolean;
}

export const EnterpriseGuideSection: React.FC<EnterpriseGuideSectionProps> = ({ loading = false }) => {
  const navigate = useNavigate();
  const { profile, updateProfile, loading: contextLoading } = useCompanyProfileContext();
  
  const [guideVisible, setGuideVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 新增步骤状态
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  // 模拟首次登录检查
  useEffect(() => {
    // 实际项目中应检查本地存储或API状态
    const hasGuided = localStorage.getItem('has_shown_profile_guide');
    if (!hasGuided && profile.completeness < 50) {
      setGuideVisible(true);
    }
  }, []);

  // 生成邀请码
  const generateInviteCode = () => {
    const code = 'JZT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setInviteCode(code);
    setInviteModalVisible(true);
  };

  // 完善画像表单提交
  const handleProfileSubmit = (values: any) => {
    // 数据校验
    if (!values.industry || !values.scale) {
      message.error('请填写必填项');
      return;
    }
    
    updateProfile({
      ...values,
      completeness: 85
    });
    setGuideVisible(false);
    localStorage.setItem('has_shown_profile_guide', 'true');
    message.success('画像已更新，为您匹配到 12 条新政策！');
  };

  return (
    <Card 
      loading={loading || contextLoading}
      className="enterprise-guide-card"
      bodyStyle={{ padding: '16px 24px' }}
      style={{ marginBottom: 24, borderLeft: '4px solid #1890ff' }}
    >
      <Row align="middle" justify="space-between">
        <Col xs={24} md={14}>
          <Space align="start" size="middle">
            <div style={{ position: 'relative' }}>
              <Progress 
                type="circle" 
                percent={profile.completeness} 
                width={60} 
                strokeColor={profile.completeness < 60 ? '#faad14' : '#52c41a'}
              />
              {profile.isVerified && (
                <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#fff', borderRadius: '50%' }}>
                  <SafetyCertificateOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                </div>
              )}
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {profile.companyName}
                {!profile.isVerified ? (
                  <Tag color="default" style={{ marginLeft: 8, fontSize: 12 }}>未认证</Tag>
                ) : (
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginLeft: 8 }}>已认证</Tag>
                )}
              </Title>
              <div style={{ marginTop: 4 }}>
                {profile.completeness < 100 ? (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    画像完善度较低，影响政策匹配准确率。
                    <a onClick={() => setGuideVisible(true)}>去完善 &gt;</a>
                  </Text>
                ) : (
                  <Text type="secondary">画像已完善，政策匹配精准。</Text>
                )}
              </div>
            </div>
          </Space>
        </Col>

        <Col xs={24} md={10} style={{ textAlign: 'right', marginTop: 10 }}>
          <Space>
            {!profile.isVerified ? (
              <Button 
                type="primary" 
                icon={<CrownOutlined />} 
                onClick={() => setCertModalVisible(true)}
                style={{ background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)', border: 'none' }}
              >
                企业认证
              </Button>
            ) : (
              <Button 
                icon={<TeamOutlined />} 
                onClick={generateInviteCode}
              >
                邀请员工
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* 完善画像引导弹窗 */}
      <Modal
        title="完善企业画像，解锁精准服务"
        open={guideVisible}
        onCancel={() => setGuideVisible(false)}
        footer={null}
        width={700}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Steps.Step title="基础信息" />
          <Steps.Step title="财务数据" />
          <Steps.Step title="资质知识产权" />
        </Steps>

        <Form layout="vertical" onFinish={handleProfileSubmit}>
          {/* 第一步：基础信息 */}
          <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="所属行业" name="industry" rules={[{ required: true }]}>
                  <Select placeholder="请选择主营业务行业">
                    <Option value="IT">软件和信息技术服务业</Option>
                    <Option value="BIO">医药制造业</Option>
                    <Option value="MAN">高端装备制造</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="企业规模" name="scale" rules={[{ required: true }]}>
                  <Select placeholder="请选择企业规模">
                    <Option value="S">小型企业（20人以下）</Option>
                    <Option value="M">中型企业（20-100人）</Option>
                    <Option value="L">大型企业（100人以上）</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="注册资本" name="capital">
                  <Input suffix="万元" placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="注册地区" name="region">
                  <Select placeholder="请选择注册地区">
                    <Option value="BJ">北京市</Option>
                    <Option value="SH">上海市</Option>
                    <Option value="SZ">深圳市</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" block onClick={() => setCurrentStep(1)}>
                下一步
              </Button>
            </Form.Item>
          </div>

          {/* 第二步：财务数据 */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <Alert message="财务数据仅用于政策匹配测算，严格保密" type="warning" showIcon style={{ marginBottom: 16 }} />
            <Form.Item label="上年度营业收入" name="revenue">
              <Radio.Group>
                <Radio value="1">500万以下</Radio>
                <Radio value="2">500-2000万</Radio>
                <Radio value="3">2000万-1亿</Radio>
                <Radio value="4">1亿以上</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="上年度纳税总额" name="tax">
              <Radio.Group>
                <Radio value="1">10万以下</Radio>
                <Radio value="2">10-50万</Radio>
                <Radio value="3">50-100万</Radio>
                <Radio value="4">100万以上</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="研发投入占比" name="rdRatio">
              <Slider marks={{ 0: '0%', 5: '5%', 10: '10%', 20: '20%+' }} min={0} max={20} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Button block onClick={() => setCurrentStep(0)}>上一步</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" block onClick={() => setCurrentStep(2)}>下一步</Button>
              </Col>
            </Row>
          </div>

          {/* 第三步：资质与知产 */}
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <Form.Item label="已获得资质 (多选)" name="qualifications">
              <Select mode="multiple" placeholder="请选择已获得的资质" style={{ width: '100%' }}>
                <Option value="HN">高新技术企业</Option>
                <Option value="SRDI">专精特新</Option>
                <Option value="TSM">科技型中小企业</Option>
                <Option value="ISO">ISO认证</Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="发明专利数量" name="patents">
                  <Input type="number" suffix="项" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="软件著作权数量" name="softwares">
                  <Input type="number" suffix="项" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Button block onClick={() => setCurrentStep(1)}>上一步</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block>提交画像</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

      {/* 企业认证弹窗 */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
            <span>企业实名认证</span>
          </Space>
        }
        open={certModalVisible}
        onCancel={() => setCertModalVisible(false)}
        onOk={() => {
          updateProfile({ isVerified: true, companyName: '璟智通科技有限公司', completeness: 90 });
          setCertModalVisible(false);
          message.success('认证提交成功，已升级为超级管理员！');
        }}
        okText="提交认证"
        width={650}
      >
        <Alert 
          message="认证权益" 
          description="认证通过后，您将自动成为企业超级管理员，可管理组织架构、邀请成员并享受企业级政策匹配服务。" 
          type="info" 
          showIcon 
          style={{ marginBottom: 24 }} 
        />
        
        <Form layout="vertical" initialValues={{ role: 'legal' }}>
          
          <Form.Item label="营业执照上传" required extra="支持JPG/PNG/PDF格式，文件小于5MB">
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                border: '1px dashed #d9d9d9', 
                borderRadius: 4,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', 
                cursor: 'pointer', 
                background: '#fafafa' 
              }}
              onClick={() => message.loading('正在模拟OCR识别...', 1.5).then(() => message.success('识别成功！已自动填充信息'))}
              >
                <SafetyCertificateOutlined style={{ fontSize: 24, color: '#999' }} />
                <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>点击上传</div>
              </div>
              <div style={{ flex: 1, background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12, color: '#666' }}>
                <p style={{ marginBottom: 4 }}>💡 提示：</p>
                <p style={{ marginBottom: 4 }}>1. 请上传最新版营业执照（三证合一）</p>
                <p style={{ marginBottom: 4 }}>2. 确保证件四角完整，文字清晰可见</p>
                <p style={{ marginBottom: 0 }}>3. 上传后系统将自动识别并填充下方信息</p>
              </div>
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="企业全称" required name="enterpriseName">
                <Input placeholder="OCR自动识别填充" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="统一社会信用代码" required name="creditCode">
                <Input placeholder="OCR自动识别填充" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="法人姓名" required name="legalPerson">
                <Input placeholder="请输入法人代表姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="成立日期" name="establishDate">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 邀请员工弹窗 */}
      <Modal
        title="邀请团队成员"
        open={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={2} style={{ color: '#1890ff', letterSpacing: 4, margin: 0 }}>
            {inviteCode}
          </Title>
          <Text type="secondary" style={{ display: 'block', margin: '16px 0' }}>
            该邀请码 24 小时内有效
          </Text>
          <Button 
            type="primary" 
            icon={<CopyOutlined />} 
            onClick={() => {
              message.success('邀请码已复制');
              setInviteModalVisible(false);
            }}
          >
            复制邀请信息
          </Button>
          <Divider />
          <div style={{ textAlign: 'left', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            <Text style={{ fontSize: 12 }}>
              使用说明：<br/>
              1. 将此码发送给员工<br/>
              2. 员工在注册或个人中心输入邀请码<br/>
              3. 验证通过后自动加入【{profile.companyName}】
            </Text>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
