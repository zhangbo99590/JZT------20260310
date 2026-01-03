import React, { useState } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Avatar
} from 'antd';
import { 
  EditOutlined, 
  LockOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { StorageUtils } from '../../../utils/storage';

const { Title, Text } = Typography;

interface UserInfo {
  username: string;
  company: string;
  role: string;
  phone: string;
  email: string;
  createTime: string;
  lastLogin: string;
}

const PersonalInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: StorageUtils.getItem('username', 'Admin'),
    company: '示例科技有限公司',
    role: '系统管理员',
    phone: '138****8888',
    email: 'admin@example.com',
    createTime: '2024-01-15 10:30:00',
    lastLogin: '2024-12-15 11:32:00'
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleEditInfo = () => {
    editForm.setFieldsValue({
      phone: userInfo.phone,
      email: userInfo.email
    });
    setIsEditModalVisible(true);
  };

  const handleSaveInfo = async () => {
    try {
      const values = await editForm.validateFields();
      const currentPassword = values.currentPassword;
      
      if (!currentPassword) {
        message.error('请输入当前密码以验证身份');
        return;
      }

      setUserInfo({
        ...userInfo,
        phone: values.phone,
        email: values.email
      });
      
      message.success('个人信息更新成功');
      setIsEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  const handleSavePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的新密码不一致');
        return;
      }

      message.success('密码修改成功，请重新登录');
      passwordForm.resetFields();
      setIsPasswordModalVisible(false);
      
      setTimeout(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入新密码');
    }
    if (value.length < 8) {
      return Promise.reject('密码长度至少为8位');
    }
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return Promise.reject('密码必须包含字母、数字和特殊符号');
    }
    return Promise.resolve();
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: '16px 0 8px' }}>
                {userInfo.username}
              </Title>
              <Text type="secondary">{userInfo.role}</Text>
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ textAlign: 'left' }}>
                  <Text type="secondary">所属企业</Text>
                  <div style={{ marginTop: 4 }}>
                    <BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <Text>{userInfo.company}</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <Text type="secondary">注册时间</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text>{userInfo.createTime}</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <Text type="secondary">最后登录</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text>{userInfo.lastLogin}</Text>
                  </div>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>基本信息</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEditInfo}
              >
                编辑信息
              </Button>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="用户名">
                {userInfo.username}
              </Descriptions.Item>
              <Descriptions.Item label="所属企业">
                <Space>
                  {userInfo.company}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    (系统自动关联，不可编辑)
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="角色权限">
                {userInfo.role}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <PhoneOutlined />
                  {userInfo.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱地址">
                <Space>
                  <MailOutlined />
                  {userInfo.email}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card 
            title={
              <Space>
                <SafetyOutlined />
                <span>密码与安全</span>
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space direction="vertical" size={0}>
                      <Text strong>登录密码</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        定期修改密码可以提高账号安全性
                      </Text>
                    </Space>
                  </Col>
                  <Col>
                    <Button 
                      icon={<LockOutlined />}
                      onClick={handleChangePassword}
                    >
                      修改密码
                    </Button>
                  </Col>
                </Row>
              </div>
              
              <Divider style={{ margin: 0 }} />
              
              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space direction="vertical" size={0}>
                      <Text strong>手机号绑定</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {userInfo.phone} (已绑定)
                      </Text>
                    </Space>
                  </Col>
                  <Col>
                    <Button disabled>更换手机号</Button>
                  </Col>
                </Row>
              </div>
              
              <Divider style={{ margin: 0 }} />
              
              <div>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space direction="vertical" size={0}>
                      <Text strong>邮箱绑定</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {userInfo.email} (已绑定)
                      </Text>
                    </Space>
                  </Col>
                  <Col>
                    <Button disabled>更换邮箱</Button>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="编辑个人信息"
        open={isEditModalVisible}
        onOk={handleSaveInfo}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            label="邮箱地址"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码以验证身份' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入当前密码以验证身份" 
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onOk={handleSavePassword}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入原密码" 
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ validator: validatePassword }]}
            extra="密码长度至少8位，必须包含字母、数字和特殊符号"
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入新密码" 
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请再次输入新密码" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonalInfo;
