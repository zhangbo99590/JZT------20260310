import React from 'react';
import { Card, Row, Col, Button, Space, Typography, Breadcrumb } from 'antd';
import { UserOutlined, SafetyOutlined, KeyOutlined, ArrowRightOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const SystemManagement: React.FC = () => {
  const navigate = useNavigate();

  const systemModules = [
    {
      icon: <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: '用户管理',
      description: '管理系统用户信息，包括用户的创建、编辑、删除和权限分配',
      path: '/system/users',
      features: ['用户信息管理', '角色分配', '状态控制', '登录记录']
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      title: '角色管理',
      description: '配置系统角色和权限，定义不同角色的访问范围和操作权限',
      path: '/system/roles',
      features: ['角色定义', '权限分配', '用户关联', '角色继承']
    },
    {
      icon: <KeyOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      title: '权限管理',
      description: '设置系统功能权限，控制用户对不同功能模块的访问权限',
      path: '/system/permissions',
      features: ['权限定义', '菜单权限', '按钮权限', 'API权限']
    },
    {
      icon: <UserOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: '个人中心',
      description: '管理个人信息、查看操作日志、设置个性化偏好',
      path: '/system/personal-center',
      features: ['个人信息管理', '操作日志查询', '页面布局设置', '通知提醒设置']
    }
  ];

  return (
    <div style={{ background: 'transparent' }}>

      {/* 页面标题 */}
      <Card style={{ marginBottom: '16px' }}>
        <Space direction="vertical" size={8}>
          <Title level={2} style={{ margin: 0 }}>
            系统管理
          </Title>
          <Text type="secondary">
            管理系统的用户、角色和权限，确保系统安全和功能的正常运行
          </Text>
        </Space>
      </Card>

      {/* 功能模块 */}
      <Row gutter={[16, 16]}>
        {systemModules.map((module, index) => (
          <Col xs={24} lg={8} key={index}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(module.path)}
                >
                  进入管理
                </Button>
              ]}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                {module.icon}
              </div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {module.title}
                </Title>
              </div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {module.description}
              </Text>
              <div>
                <Text strong style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  主要功能：
                </Text>
                <div style={{ marginTop: 8 }}>
                  {module.features.map((feature, idx) => (
                    <div key={idx} style={{ 
                      fontSize: '12px', 
                      color: '#595959',
                      marginBottom: 4,
                      paddingLeft: 8,
                      position: 'relative'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: 0, 
                        color: '#1890ff' 
                      }}>
                        •
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SystemManagement;