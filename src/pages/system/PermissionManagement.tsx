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
  Select,
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Tree,
  Checkbox,
  Divider,
  Popover,
  Typography,
  Breadcrumb
} from 'antd';
import { 
  KeyOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  MenuOutlined,
  ApiOutlined,
  ControlOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  HomeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface Permission {
  id: string;
  permissionName: string;
  permissionCode: string;
  permissionType: 'menu' | 'button' | 'api';
  parentId: string | null;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
  visibleModules?: string[];
}

interface ModuleField {
  key: string;
  label: string;
  category: string;
}

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [form] = Form.useForm();
  const [isModuleModalVisible, setIsModuleModalVisible] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

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

  // 模拟权限数据
  const mockPermissions: Permission[] = [
    {
      id: '1',
      permissionName: '系统管理',
      permissionCode: 'SYSTEM_MANAGE',
      permissionType: 'menu',
      parentId: null,
      description: '系统管理模块的访问权限',
      status: 'active',
      createTime: '2024-01-01 10:00:00',
      visibleModules: ['system_manage', 'user_manage', 'role_manage', 'permission_manage']
    },
    {
      id: '2',
      permissionName: '用户管理',
      permissionCode: 'USER_MANAGE',
      permissionType: 'menu',
      parentId: '1',
      description: '用户管理页面的访问权限',
      status: 'active',
      createTime: '2024-01-01 10:05:00',
      visibleModules: ['user_manage']
    },
    {
      id: '3',
      permissionName: '新增用户',
      permissionCode: 'USER_ADD',
      permissionType: 'button',
      parentId: '2',
      description: '新增用户按钮的操作权限',
      status: 'active',
      createTime: '2024-01-01 10:10:00',
      visibleModules: ['user_manage']
    },
    {
      id: '4',
      permissionName: '编辑用户',
      permissionCode: 'USER_EDIT',
      permissionType: 'button',
      parentId: '2',
      description: '编辑用户按钮的操作权限',
      status: 'active',
      createTime: '2024-01-01 10:15:00'
    },
    {
      id: '5',
      permissionName: '删除用户',
      permissionCode: 'USER_DELETE',
      permissionType: 'button',
      parentId: '2',
      description: '删除用户按钮的操作权限',
      status: 'active',
      createTime: '2024-01-01 10:20:00'
    },
    {
      id: '6',
      permissionName: '用户列表API',
      permissionCode: 'API_USER_LIST',
      permissionType: 'api',
      parentId: '2',
      description: '获取用户列表的API权限',
      status: 'active',
      createTime: '2024-01-01 10:25:00'
    },
    {
      id: '7',
      permissionName: '角色管理',
      permissionCode: 'ROLE_MANAGE',
      permissionType: 'menu',
      parentId: '1',
      description: '角色管理页面的访问权限',
      status: 'active',
      createTime: '2024-01-01 10:30:00',
      visibleModules: ['role_manage']
    },
    {
      id: '8',
      permissionName: '权限管理',
      permissionCode: 'PERMISSION_MANAGE',
      permissionType: 'menu',
      parentId: '1',
      description: '权限管理页面的访问权限',
      status: 'active',
      createTime: '2024-01-01 10:35:00',
      visibleModules: ['permission_manage']
    }
  ];

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = () => {
    setLoading(true);
    setTimeout(() => {
      setPermissions(mockPermissions);
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

  const getTypeTag = (type: string) => {
    const typeMap = {
      'menu': { color: 'blue', text: '菜单', icon: <MenuOutlined /> },
      'button': { color: 'orange', text: '按钮', icon: <ControlOutlined /> },
      'api': { color: 'green', text: 'API', icon: <ApiOutlined /> }
    };
    const config = typeMap[type as keyof typeof typeMap] || { color: 'default', text: '未知', icon: null };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    const parent = permissions.find(p => p.id === parentId);
    return parent ? parent.permissionName : '-';
  };

  const handleAdd = () => {
    try {
      setEditingPermission(null);
      form.resetFields();
      setSelectedModules([]);
      setIsModalVisible(true);
      message.info('正在打开新增权限对话框...');
    } catch (error) {
      message.error('打开新增权限对话框失败');
    }
  };

  const handleEdit = (record: Permission) => {
    try {
      setEditingPermission(record);
      form.setFieldsValue(record);
      setSelectedModules(record.visibleModules || []);
      setIsModalVisible(true);
      message.info('正在打开编辑权限对话框...');
    } catch (error) {
      message.error('打开编辑权限对话框失败');
    }
  };

  const handleDelete = (record: Permission) => {
    setPermissions(permissions.filter(permission => permission.id !== record.id));
    message.success('删除成功');
  };

  const handleViewDetail = (record: Permission) => {
    try {
      setSelectedPermission(record);
      setIsDetailModalVisible(true);
      message.info('正在打开权限详情...');
    } catch (error) {
      message.error('打开权限详情失败');
    }
  };

  const handleAssignModules = (record: Permission) => {
    try {
      setCurrentPermission(record);
      setSelectedModules(record.visibleModules || []);
      setIsModuleModalVisible(true);
      message.info('正在打开模块分配对话框...');
    } catch (error) {
      message.error('打开模块分配对话框失败');
    }
  };

  const handleSaveModules = () => {
    if (currentPermission) {
      setPermissions(permissions.map(permission => 
        permission.id === currentPermission.id 
          ? { ...permission, visibleModules: selectedModules }
          : permission
      ));
      message.success('模块分配成功');
      setIsModuleModalVisible(false);
    }
  };

  const getModulesByCategory = (category: string) => {
    return availableModules.filter(m => m.category === category);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingPermission) {
        // 编辑权限
        setPermissions(permissions.map(permission => 
          permission.id === editingPermission.id 
            ? { ...permission, ...values }
            : permission
        ));
        message.success('编辑成功');
      } else {
        // 新增权限
        const newPermission: Permission = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString('zh-CN')
        };
        setPermissions([...permissions, newPermission]);
        message.success('新增成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.permissionCode.toLowerCase().includes(searchText.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 构建树形数据
  const buildTreeData = (permissions: Permission[]) => {
    const tree: any[] = [];
    const map: { [key: string]: any } = {};

    // 创建节点映射
    permissions.forEach(permission => {
      map[permission.id] = {
        key: permission.id,
        title: permission.permissionName,
        children: []
      };
    });

    // 构建树形结构
    permissions.forEach(permission => {
      if (permission.parentId && map[permission.parentId]) {
        map[permission.parentId].children.push(map[permission.id]);
      } else {
        tree.push(map[permission.id]);
      }
    });

    return tree;
  };

  const columns: ColumnsType<Permission> = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: 150,
      align: 'center',
      render: (text: string) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <KeyOutlined style={{ color: '#fa8c16', fontSize: '14px' }} />
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
      render: (modules: string[] | undefined, record: Permission) => {
        const count = modules?.length || 0;
        return (
          <Tag 
            color={count > 0 ? 'blue' : 'default'}
            style={{ cursor: 'pointer' }}
            icon={count > 0 ? <AppstoreOutlined /> : undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleAssignModules(record);
            }}
          >
            {count > 0 ? `${count} 个模块` : '未分配'}
          </Tag>
        );
      }
    },
    {
      title: '父级权限',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 120,
      align: 'center',
      render: (parentId: string | null) => getParentName(parentId)
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
      width: 250,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: Permission) => (
        <Space size={4}>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(record);
            }} 
            size="small"
          >
            详情
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }} 
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个权限吗？"
            onConfirm={(e) => {
              handleDelete(record);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              onClick={(e) => e.stopPropagation()}
            >
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
            title: '权限管理',
          },
        ]}
      />
      
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索权限名称、代码或描述..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增权限
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPermissions}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredPermissions.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>
      
      {/* 新增/编辑权限对话框 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新增权限'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPermission(null);
          form.resetFields();
        }}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'active',
            type: 'menu'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="权限名称"
                name="permissionName"
                rules={[{ required: true, message: '请输入权限名称' }]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="权限代码"
                name="permissionCode"
                rules={[{ required: true, message: '请输入权限代码' }]}
              >
                <Input placeholder="请输入权限代码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="权限类型"
                name="type"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型">
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                  <Select.Option value="api">API</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Select.Option value="active">启用</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="上级权限"
            name="parentId"
          >
            <Select placeholder="请选择上级权限（可为空）" allowClear>
              {permissions.filter(p => p.permissionType === 'menu').map(p => (
                <Select.Option key={p.id} value={p.id}>
                  {p.permissionName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
          </Form.Item>
          
          <Divider orientation="left">可见模块设置</Divider>
          
          <Form.Item
            label="选择可见模块"
            name="visibleModules"
          >
            <div>
              {['policy', 'legal', 'industry', 'finance', 'system'].map(category => (
                <div key={category} style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    {category === 'policy' && '政策中心'}
                    {category === 'legal' && '法律护航'}
                    {category === 'industry' && '产业大厅'}
                    {category === 'finance' && '金融服务'}
                    {category === 'system' && '系统管理'}
                  </Text>
                  <Checkbox.Group
                    value={selectedModules}
                    onChange={setSelectedModules}
                  >
                    <Row>
                      {getModulesByCategory(category).map(module => (
                        <Col span={8} key={module.key}>
                          <Checkbox value={module.key}>
                            {module.label}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              ))}
            </div>
          </Form.Item>
          
          <Form.Item>
            <Text type="secondary">已选择模块：</Text>
            <div style={{ marginTop: '8px' }}>
              <Space wrap>
                {selectedModules.map(moduleKey => {
                  const module = availableModules.find(m => m.key === moduleKey);
                  return module ? (
                    <Tag
                      key={moduleKey}
                      color="blue"
                      closable
                      onClose={() => {
                        setSelectedModules(prev => prev.filter(k => k !== moduleKey));
                      }}
                    >
                      {module.label}
                    </Tag>
                  ) : null;
                })}
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 模块分配对话框 */}
      <Modal
        title={
          <Space>
            <AppstoreOutlined />
            <span>管理可见模块 - {currentPermission?.permissionName}</span>
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
      
      {/* 权限详情对话框 */}
      <Modal
        title="权限详情"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedPermission(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsDetailModalVisible(false);
            setSelectedPermission(null);
          }}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedPermission && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="权限名称">
              {selectedPermission.permissionName}
            </Descriptions.Item>
            <Descriptions.Item label="权限代码">
              <Tag color="blue">{selectedPermission.permissionCode}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="权限类型">
              {getTypeTag(selectedPermission.permissionType)}
            </Descriptions.Item>
            <Descriptions.Item label="上级权限">
              {getParentName(selectedPermission.parentId)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(selectedPermission.status)}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {selectedPermission.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="可见模块">
              <div style={{ marginTop: '8px' }}>
                <Space wrap>
                  {(selectedPermission.visibleModules || []).map(moduleKey => {
                    const module = availableModules.find(m => m.key === moduleKey);
                    return module ? (
                      <Tag key={moduleKey} color="blue">{module.label}</Tag>
                    ) : null;
                  })}
                  {(!selectedPermission.visibleModules || selectedPermission.visibleModules.length === 0) && (
                    <Text type="secondary">暂无分配模块</Text>
                  )}
                </Space>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {selectedPermission.createTime}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PermissionManagement;
