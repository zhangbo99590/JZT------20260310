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
  Breadcrumb
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  HomeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createTime: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: '1',
      userId: 'U001',
      userName: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
      createTime: '2024-01-15 10:30:00',
      lastLogin: '2024-07-30 09:15:00'
    },
    {
      id: '2',
      userId: 'U002',
      userName: '李四',
      email: 'lisi@example.com',
      role: '超级管理员',
      status: 'active',
      createTime: '2024-02-20 14:20:00',
      lastLogin: '2024-07-29 16:45:00'
    },
    {
      id: '3',
      userId: 'U003',
      userName: '王五',
      email: 'wangwu@example.com',
      role: '访客用户',
      status: 'inactive',
      createTime: '2024-03-10 09:15:00',
      lastLogin: '2024-07-25 11:30:00'
    },
    {
      id: '4',
      userId: 'U004',
      userName: '赵六',
      email: 'zhaoliu@example.com',
      role: '超级管理员',
      status: 'active',
      createTime: '2024-04-05 16:45:00',
      lastLogin: '2024-07-30 08:20:00'
    },
    {
      id: '5',
      userId: 'U005',
      userName: '钱七',
      email: 'qianqi@example.com',
      role: '访客用户',
      status: 'active',
      createTime: '2024-05-12 11:30:00',
      lastLogin: '2024-07-28 14:10:00'
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: User) => {
    setUsers(users.filter(user => user.id !== record.id));
    message.success('删除成功');
  };

  const handleViewDetail = (record: User) => {
    setSelectedUser(record);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ));
        message.success('编辑成功');
      } else {
        // 新增用户
        const newUser: User = {
          id: Date.now().toString(),
          userId: `U${String(users.length + 1).padStart(3, '0')}`,
          ...values,
          createTime: new Date().toLocaleString('zh-CN'),
          lastLogin: '-'
        };
        setUsers([...users, newUser]);
        message.success('新增成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<User> = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      align: 'center',
      render: (text: string, record: User) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '14px' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: '11px', padding: '0 4px' }}>
            {record.userId}
          </Tag>
        </Space>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      align: 'center',
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
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 160,
      align: 'center',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: any, record: User) => (
        <Space size={8}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} size="small">
            详情
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
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
            title: '用户管理',
          },
        ]}
      />
      
      {/* 筛选操作区 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input.Search
              placeholder="搜索用户名、邮箱或用户ID..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 400 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增用户
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据列表区 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
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

      {/* 新增/编辑用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userName"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 2, max: 20, message: '用户名长度为2-20个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Select.Option value="管理员">管理员</Select.Option>
                  <Select.Option value="超级管理员">超级管理员</Select.Option>
                  <Select.Option value="访客用户">访客用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Select.Option value="active">启用</Select.Option>
                  <Select.Option value="inactive">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 用户详情模态框 */}
      <Modal
        title="用户详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="用户ID">{selectedUser.userId}</Descriptions.Item>
            <Descriptions.Item label="用户名">{selectedUser.userName}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="角色">{selectedUser.role}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {getStatusTag(selectedUser.status)}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedUser.createTime}</Descriptions.Item>
            <Descriptions.Item label="最后登录" span={2}>{selectedUser.lastLogin}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;