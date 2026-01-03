import React, { useState } from 'react';
import { Form, Input, Button, Card, Checkbox, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { StorageUtils } from '../utils/storage';

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      if (values.username === 'admin' && values.password === '123456') {
        message.success('登录成功！');
        StorageUtils.setItem('isLoggedIn', 'true');
        StorageUtils.setItem('username', values.username);
        navigate('/');
      } else {
        message.error('用户名或密码错误！');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            管理系统
          </Title>
          <Text type="secondary">欢迎登录后台管理系统</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#f0f2f5', 
          borderRadius: 6,
          textAlign: 'center'
        }}>
          <Space direction="vertical" size={4}>
            <Text strong>测试账号信息</Text>
            <Text type="secondary">用户名: admin</Text>
            <Text type="secondary">密码: 123456</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;