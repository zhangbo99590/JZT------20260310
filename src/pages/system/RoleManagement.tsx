import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Checkbox,
  Breadcrumb,
  Divider,
  Typography
} from 'antd';

const { Text } = Typography;
import { 
  SafetyOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  TeamOutlined,
  HomeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Role {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  createTime: string;
  visibleModules?: string[];
}

interface ModuleField {
  key: string;
  label: string;
  category: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isUserListModalVisible, setIsUserListModalVisible] = useState(false);
  const [selectedRoleForUsers, setSelectedRoleForUsers] = useState<Role | null>(null);

  const availableModules: ModuleField[] = [
    { key: 'policy_center', label: '政策中心', category: '业务模块' },
    { key: 'policy_list', label: '政策列表', category: '业务模块' },
    { key: 'policy_detail', label: '政策详情', category: '业务模块' },
    { key: 'smart_matching', label: '智能匹配', category: '业务模块' },
    { key: 'application_manage', label: '申报管理', category: '业务模块' },
    { key: 'my_applications', label: '我的申报', category: '业务模块' },
    { key: 'legal_support', label: '法律护航', category: '业务模块' },
    { key: 'contract_manage', label: '合同管理', category: '业务模块' },
    { key: 'judicial_cases', label: '司法案例', category: '业务模块' },
    { key: 'ai_assistant', label: 'AI智能问答', category: '业务模块' },
    { key: 'industry_hall', label: '产业大厅', category: '业务模块' },
    { key: 'supply_demand', label: '商机大厅', category: '业务模块' },
    { key: 'financing_service', label: '金融服务', category: '业务模块' },
    { key: 'financing_diagnosis', label: '融资诊断', category: '业务模块' },
    { key: 'data_visualization', label: '数据可视化', category: '业务模块' },
    { key: 'system_manage', label: '系统管理', category: '系统模块' },
    { key: 'user_manage', label: '用户管理', category: '系统模块' },
    { key: 'role_manage', label: '角色管理', category: '系统模块' },
    { key: 'permission_manage', label: '权限管理', category: '系统模块' },
    { key: 'personal_center', label: '个人中心', category: '系统模块' },
  ];

  // 可选权限列表
  const availablePermissions = [
    '用户管理',
    '角色管理',
    '权限管理',
    '系统设置',
    '数据导入',
    '日志查看'
  ];

  // 模拟角色数据
  const mockRoles: Role[] = [
    {
      id: '1',
      roleName: '超级管理员',
      roleCode: 'SUPER_ADMIN',
      description: '拥有系统所有权限的超级管理员角色',
      userCount: 2,
      permissions: availablePermissions,
      status: 'active',
      createTime: '2024-01-01 10:00:00',
      visibleModules: ['system_manage', 'user_manage', 'role_manage', 'permission_manage', 'policy_center']
    },
    {
      id: '2',
      roleName: '系统管理员',
      roleCode: 'SYSTEM_ADMIN',
      description: '负责系统管理和用户管理的管理员角色',
      userCount: 5,
      permissions: ['用户管理', '角色管理', '权限管理', '系统设置', '日志查看'],
      status: 'active',
      createTime: '2024-01-15 14:30:00'
    },
    {
      id: '3',
      roleName: '访客用户',
      roleCode: 'GUEST_USER',
      description: '只能查看基本信息的访客用户角色',
      userCount: 12,
      permissions: [],
      status: 'inactive',
      createTime: '2024-03-01 11:20:00'
    }
  ];

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    setLoading(true);
    setTimeout(() => {
      setRoles(mockRoles);
      setLoading(false);
    }, 1000);
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      'active': { color: 'success', text: '启用' },
      'inactive': { color: 'error', text: '禁用' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: Role) => {
    setRoles(roles.filter(role => role.id !== record.id));
    message.success('删除成功');
  };

  const handleViewDetail = (record: Role) => {
    setSelectedRole(record);
    setIsDetailModalVisible(true);
  };

  const handleAssignModules = (record: Role) => {
    setCurrentRole(record);
    setSelectedModules(record.visibleModules || []);
    setIsModuleModalVisible(true);
  };

  const handleSaveModules = () => {
    if (currentRole) {
      setRoles(roles.map(role => 
        role.id === currentRole.id 
          ? { ...role, visibleModules: selectedModules }
          : role
      ));
      message.success('模块分配成功');
      setIsModuleModalVisible(false);
    }
  };

  const getModulesByCategory = (category: string) => {
    return availableModules.filter(m => m.category === category);
  };

  const handleViewUsers = (record: Role) => {
    setSelectedRoleForUsers(record);
    setIsUserListModalVisible(true);
  };

  const mockUsersForRole = [
    { id: '1', name: '张三', email: 'zhangsan@example.com', status: 'active' },
    { id: '2', name: '李四', email: 'lisi@example.com', status: 'active' },
    { id: '3', name: '王五', email: 'wangwu@example.com', status: 'inactive' },
  ];

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        // 编辑角色
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values }
            : role
        ));
        message.success('编辑成功');
      } else {
        // 新增角色
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          userCount: 0,
          createTime: new Date().toLocaleString('zh-CN')
        };
        setRoles([...roles, newRole]);
        message.success('新增成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
    role.roleCode.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 150,
      align: 'center',
      render: (text: string) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <SafetyOutlined style={{ color: '#722ed1', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    {
      title: '可见模块',
      dataIndex: 'visibleModules',
      key: 'visibleModules',
      width: 150,
      align: 'center',
      render: (modules: string[] | undefined, record: Role) => {
        const count = modules?.length || 0;
        return (
          <Tag 
            color={count > 0 ? 'blue' : 'default'}
            style={{ cursor: 'pointer' }}
            icon={count > 0 ? <AppstoreOutlined /> : undefined}
            onClick={() => handleAssignModules(record)}
          >
            {count > 0 ? `${count} 个模块` : '未分配'}
          </Tag>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: Role) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} size="small">
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: 'transparent' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '系统管理',
            href: '/system',
          },
          {
            title: '角色管理',
          },
        ]}
      />
      
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索角色名称、代码或描述..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增角色
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据列表区 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 新增/编辑角色模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', permissions: [] }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="角色名称"
                rules={[
                  { required: true, message: '请输入角色名称' },
                  { min: 2, max: 20, message: '角色名称长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Checkbox.Group>
              <Checkbox value="active">启用</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限分配"
          >
            <Checkbox.Group>
              <Row gutter={[16, 8]}>
                {availablePermissions.map(permission => (
                  <Col span={8} key={permission}>
                    <Checkbox value={permission}>{permission}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色详情模态框 */}
      <Modal
        title="角色详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedRole && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="角色名称" span={2}>{selectedRole.roleName}</Descriptions.Item>
              <Descriptions.Item label="用户数量">
                <Space>
                  <TeamOutlined style={{ color: '#1890ff' }} />
                  <span>{selectedRole.userCount}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedRole.status)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {selectedRole.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="角色描述" span={2}>
                {selectedRole.description}
              </Descriptions.Item>
            </Descriptions>
            
            <div>
              <h4 style={{ marginBottom: 12 }}>权限列表：</h4>
              <div>
                {selectedRole.permissions.length > 0 ? (
                  selectedRole.permissions.map(permission => (
                    <Tag key={permission} color="blue" style={{ marginBottom: 8 }}>
                      {permission}
                    </Tag>
                  ))
                ) : (
                  <span style={{ color: '#8c8c8c' }}>暂无权限</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 模块分配模态框 */}
      <Modal
        title={
          <Space>
            <AppstoreOutlined />
            <span>管理可见模块 - {currentRole?.roleName}</span>
          </Space>
        }
        open={isModuleModalVisible}
        onOk={handleSaveModules}
        onCancel={() => setIsModuleModalVisible(false)}
        width={900}
        okText="保存更改"
        cancelText="取消"
      >
        <div>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 操作栏 */}
            <div style={{ padding: '12px 16px', background: '#f0f5ff', borderRadius: 6 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space size="large">
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>已选择</Text>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                        {selectedModules.length}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>个模块</Text>
                    </div>
                    <Divider type="vertical" style={{ height: 40 }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>可用模块</Text>
                      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                        {availableModules.length}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>个</Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button 
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => setSelectedModules(availableModules.map(m => m.key))}
                    >
                      全选
                    </Button>
                    <Button 
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => setSelectedModules([])}
                    >
                      清空
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* 已选择的模块 */}
            {selectedModules.length > 0 && (
              <Card 
                size="small" 
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>已选择的模块</span>
                  </Space>
                }
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    点击标签可快速移除
                  </Text>
                }
              >
                <Space wrap>
                  {selectedModules.map(moduleKey => {
                    const module = availableModules.find(m => m.key === moduleKey);
                    return module ? (
                      <Tag
                        key={moduleKey}
                        color="blue"
                        closable
                        onClose={() => {
                          setSelectedModules(selectedModules.filter(k => k !== moduleKey));
                        }}
                        style={{ marginBottom: 4 }}
                      >
                        {module.label}
                      </Tag>
                    ) : null;
                  })}
                </Space>
              </Card>
            )}

            {/* 业务模块 */}
            <Card 
              size="small"
              title={
                <Space>
                  <AppstoreOutlined style={{ color: '#1890ff' }} />
                  <span>业务模块</span>
                  <Tag color="blue">
                    {getModulesByCategory('业务模块').filter(m => selectedModules.includes(m.key)).length} / {getModulesByCategory('业务模块').length}
                  </Tag>
                </Space>
              }
            >
              <Checkbox.Group 
                value={selectedModules}
                onChange={(values) => setSelectedModules(values as string[])}
                style={{ width: '100%' }}
              >
                <Row gutter={[12, 12]}>
                  {getModulesByCategory('业务模块').map(module => (
                    <Col span={8} key={module.key}>
                      <Checkbox value={module.key} style={{ width: '100%' }}>
                        <Space>
                          <span>{module.label}</span>
                        </Space>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Card>

            {/* 系统模块 */}
            <Card 
              size="small"
              title={
                <Space>
                  <SettingOutlined style={{ color: '#fa8c16' }} />
                  <span>系统模块</span>
                  <Tag color="orange">
                    {getModulesByCategory('系统模块').filter(m => selectedModules.includes(m.key)).length} / {getModulesByCategory('系统模块').length}
                  </Tag>
                </Space>
              }
            >
              <Checkbox.Group 
                value={selectedModules}
                onChange={(values) => setSelectedModules(values as string[])}
                style={{ width: '100%' }}
              >
                <Row gutter={[12, 12]}>
                  {getModulesByCategory('系统模块').map(module => (
                    <Col span={8} key={module.key}>
                      <Checkbox value={module.key} style={{ width: '100%' }}>
                        <Space>
                          <span>{module.label}</span>
                        </Space>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Card>
          </Space>
        </div>
      </Modal>

      {/* 用户列表模态框 */}
      <Modal
        title={
          <Space>
            <TeamOutlined />
            <span>角色用户列表 - {selectedRoleForUsers?.roleName}</span>
          </Space>
        }
        open={isUserListModalVisible}
        onCancel={() => setIsUserListModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsUserListModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            该角色共有 <Text strong style={{ color: '#1890ff' }}>{selectedRoleForUsers?.userCount}</Text> 个用户
          </Text>
        </div>
        <Table
          dataSource={mockUsersForRole}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            {
              title: '用户名',
              dataIndex: 'name',
              key: 'name',
              render: (text: string) => (
                <Space>
                  <UserOutlined style={{ color: '#1890ff' }} />
                  <span>{text}</span>
                </Space>
              )
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                  {status === 'active' ? '启用' : '禁用'}
                </Tag>
              )
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;