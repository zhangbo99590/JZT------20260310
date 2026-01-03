import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Tabs,
  Descriptions,
  Space,
  Typography,
  Divider,
  Table,
  Tag,
  Select,
  Row,
  Col,
  Switch,
  Modal,
  List,
  Checkbox,
  Alert,
  Breadcrumb,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  CameraOutlined,
  SaveOutlined,
  HistoryOutlined,
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  LayoutOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { UploadProps, TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface UserInfo {
  username: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
  role: string;
  avatar?: string;
  registeredDate: string;
}

interface OperationLog {
  id: string;
  time: string;
  module: string;
  type: string;
  content: string;
  result: 'success' | 'failed';
  ip: string;
  failReason?: string;
}

interface NotificationSetting {
  type: string;
  label: string;
  systemMessage: boolean;
  sms: boolean;
  email: boolean;
}

interface ModulePreference {
  id: string;
  name: string;
  order: number;
  visible: boolean;
}

const PersonalCenter: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [verifyPasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState('1');
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<'phone' | 'email' | null>(null);
  
  // 用户信息
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: localStorage.getItem('username') || 'Admin',
    email: 'admin@qiguibao.com',
    phone: '13812345678',
    company: '深圳市创新科技有限公司',
    department: '技术部',
    position: '系统管理员',
    role: '超级管理员',
    registeredDate: '2024-01-15',
  });

  // 操作日志
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [logFilter, setLogFilter] = useState({
    dateRange: 'recent7',
    module: 'all',
    type: 'all',
  });
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { type: 'application', label: '申报进度更新', systemMessage: true, sms: true, email: false },
    { type: 'policy', label: '政策更新通知', systemMessage: true, sms: false, email: true },
    { type: 'opportunity', label: '商机推荐', systemMessage: true, sms: false, email: false },
    { type: 'finance', label: '融资诊断结果', systemMessage: true, sms: true, email: true },
    { type: 'system', label: '系统维护通知', systemMessage: true, sms: false, email: false },
  ]);
  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '20:00',
    endTime: '08:00',
  });

  // 模块偏好设置
  const [modulePreferences, setModulePreferences] = useState<ModulePreference[]>([
    { id: 'home', name: '首页', order: 1, visible: true },
    { id: 'policy', name: '政策中心', order: 2, visible: true },
    { id: 'opportunity', name: '商机大厅', order: 3, visible: true },
    { id: 'finance', name: '金融服务', order: 4, visible: true },
    { id: 'legal', name: '法律护航', order: 5, visible: true },
    { id: 'system', name: '系统管理', order: 6, visible: true },
  ]);
  const [defaultHomePage, setDefaultHomePage] = useState('home');

  // 初始化操作日志数据
  useEffect(() => {
    loadOperationLogs();
  }, [logFilter]);

  const loadOperationLogs = () => {
    const mockLogs: OperationLog[] = [
      {
        id: '1',
        time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        module: '政策中心',
        type: '查询',
        content: '查看政策详情：中小企业数字化转型促进政策',
        result: 'success',
        ip: '192.168.1.100',
      },
      {
        id: '2',
        time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        module: '我的申报',
        type: '修改',
        content: '更新申报材料：高新技术企业认定申请书',
        result: 'success',
        ip: '192.168.1.100',
      },
      {
        id: '3',
        time: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        module: '商机大厅',
        type: '新增',
        content: '发布供应信息：智能制造设备',
        result: 'success',
        ip: '192.168.1.100',
      },
      {
        id: '4',
        time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        module: '融资诊断',
        type: '查询',
        content: '提交融资诊断申请',
        result: 'success',
        ip: '192.168.1.100',
      },
      {
        id: '5',
        time: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        module: '系统管理',
        type: '修改',
        content: '尝试修改用户权限',
        result: 'failed',
        ip: '192.168.1.100',
        failReason: '权限不足',
      },
    ];
    setOperationLogs(mockLogs);
  };

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
        return false;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        message.success('头像上传成功！');
      };
      reader.readAsDataURL(file);
      
      return false;
    },
  };

  // 请求编辑信息
  const requestEditInfo = (field: 'phone' | 'email') => {
    setEditingField(field);
    setVerifyModalVisible(true);
  };

  // 验证密码后编辑信息
  const handleVerifyPassword = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setVerifyModalVisible(false);
      verifyPasswordForm.resetFields();
      
      const fieldLabel = editingField === 'phone' ? '手机号' : '邮箱';
      const currentValue = editingField === 'phone' ? userInfo.phone : userInfo.email;
      
      Modal.confirm({
        title: `修改${fieldLabel}`,
        content: (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ [editingField!]: currentValue }}
          >
            <Form.Item
              label={`新${fieldLabel}`}
              name={editingField!}
              rules={[
                { required: true, message: `请输入${fieldLabel}` },
                editingField === 'phone' 
                  ? { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                  : { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input 
                prefix={editingField === 'phone' ? <PhoneOutlined /> : <MailOutlined />} 
                placeholder={`请输入新${fieldLabel}`} 
              />
            </Form.Item>
          </Form>
        ),
        onOk: async () => {
          const values = await form.validateFields();
          setUserInfo({ ...userInfo, [editingField!]: values[editingField!] });
          message.success(`${fieldLabel}修改成功！`);
        },
      });
    } catch (error) {
      message.error('密码验证失败！');
    } finally {
      setLoading(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('密码修改成功！请重新登录');
      passwordForm.resetFields();
      
      setTimeout(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/login');
      }, 1500);
    } catch (error) {
      message.error('密码修改失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 查看操作日志详情
  const viewLogDetail = (log: OperationLog) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  };

  // 保存通知设置
  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('通知设置已保存！');
    } catch (error) {
      message.error('保存失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 保存模块偏好
  const handleSaveModulePreferences = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success('模块偏好已保存！');
    } catch (error) {
      message.error('保存失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // 操作日志表格列
  const logColumns: TableColumnsType<OperationLog> = [
    {
      title: '操作时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '查询': 'default',
          '新增': 'success',
          '修改': 'warning',
          '删除': 'error',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '操作结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => (
        result === 'success' ? (
          <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>
        )
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: OperationLog) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => viewLogDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '系统管理',
            href: '/system',
          },
          {
            title: '个人中心',
          },
        ]}
      />
      
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 180px)' }}>
        {/* 用户头像卡片 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={24} align="middle">
            <Col>
              <Upload {...uploadProps}>
                <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    src={avatarUrl}
                    style={{ border: '4px solid #f0f0f0' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#1890ff',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid white',
                    }}
                  >
                    <CameraOutlined style={{ color: 'white', fontSize: 14 }} />
                  </div>
                </div>
              </Upload>
            </Col>
            <Col flex={1}>
              <Title level={3} style={{ marginBottom: 8 }}>
                {userInfo.username}
              </Title>
              <Space size="large">
                <Text type="secondary">
                  <SafetyOutlined /> {userInfo.role}
                </Text>
                <Text type="secondary">
                  <UserOutlined /> {userInfo.position}
                </Text>
                <Text type="secondary">
                  <BankOutlined /> {userInfo.company}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 主要内容标签页 */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 个人信息标签页 */}
            <Tabs.TabPane 
              tab={<span><UserOutlined /> 个人信息</span>} 
              key="1"
            >
              <Title level={4}>基本信息</Title>
              <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
                <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
                <Descriptions.Item label="角色权限">{userInfo.role}</Descriptions.Item>
                <Descriptions.Item label="所属企业">{userInfo.company}</Descriptions.Item>
                <Descriptions.Item label="部门">{userInfo.department}</Descriptions.Item>
                <Descriptions.Item label="职位">{userInfo.position}</Descriptions.Item>
                <Descriptions.Item label="注册时间">{userInfo.registeredDate}</Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {userInfo.phone}
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => requestEditInfo('phone')}
                  >
                    修改
                  </Button>
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {userInfo.email}
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => requestEditInfo('email')}
                  >
                    修改
                  </Button>
                </Descriptions.Item>
              </Descriptions>

              <Alert
                message="提示"
                description="企业信息（如所属企业）为系统自动关联，不可编辑。修改联系电话和邮箱需要验证当前密码。"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Divider />

              <Title level={4}>密码与安全设置</Title>
              <Card bordered={false} style={{ background: '#fafafa' }}>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                  style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    label="当前密码"
                    name="oldPassword"
                    rules={[{ required: true, message: '请输入当前密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="请输入当前密码"
                    />
                  </Form.Item>

                  <Form.Item
                    label="新密码"
                    name="newPassword"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 8, message: '密码长度至少为8位' },
                      { 
                        pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: '密码必须包含字母、数字和特殊符号'
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="请输入新密码（8位以上，含字母/数字/特殊符号）"
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

                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                        修改密码
                      </Button>
                      <Button onClick={() => passwordForm.resetFields()}>重置</Button>
                    </Space>
                  </Form.Item>
                </Form>

                <Alert
                  message="安全提示"
                  description="修改密码成功后将强制重新登录，请妥善保管您的新密码。"
                  type="warning"
                  showIcon
                />
              </Card>
            </Tabs.TabPane>

            {/* 操作日志标签页 */}
            <Tabs.TabPane 
              tab={<span><HistoryOutlined /> 操作日志</span>} 
              key="2"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="选择时间范围"
                        value={logFilter.dateRange}
                        onChange={(value) => setLogFilter({ ...logFilter, dateRange: value })}
                      >
                        <Option value="recent7">近7天</Option>
                        <Option value="recent30">近30天</Option>
                        <Option value="custom">自定义</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="选择操作模块"
                        value={logFilter.module}
                        onChange={(value) => setLogFilter({ ...logFilter, module: value })}
                      >
                        <Option value="all">全部模块</Option>
                        <Option value="policy">政策中心</Option>
                        <Option value="opportunity">商机大厅</Option>
                        <Option value="finance">融资诊断</Option>
                        <Option value="legal">法律护航</Option>
                        <Option value="system">系统管理</Option>
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="选择操作类型"
                        value={logFilter.type}
                        onChange={(value) => setLogFilter({ ...logFilter, type: value })}
                      >
                        <Option value="all">全部类型</Option>
                        <Option value="query">查询</Option>
                        <Option value="add">新增</Option>
                        <Option value="edit">修改</Option>
                        <Option value="delete">删除</Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                <Table
                  columns={logColumns}
                  dataSource={operationLogs}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              </Space>
            </Tabs.TabPane>

            {/* 个性化设置标签页 */}
            <Tabs.TabPane 
              tab={<span><SettingOutlined /> 个性化设置</span>} 
              key="3"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 页面布局偏好 */}
                <Card title={<><LayoutOutlined /> 页面布局偏好</>}>
                  <Form layout="vertical">
                    <Form.Item label="默认首页模块">
                      <Select
                        style={{ width: 300 }}
                        value={defaultHomePage}
                        onChange={setDefaultHomePage}
                      >
                        {modulePreferences.map(mod => (
                          <Option key={mod.id} value={mod.id}>{mod.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="导航栏模块显示">
                      <List
                        dataSource={modulePreferences}
                        renderItem={(item) => (
                          <List.Item
                            actions={[
                              <Checkbox
                                checked={item.visible}
                                onChange={(e) => {
                                  const updated = modulePreferences.map(m =>
                                    m.id === item.id ? { ...m, visible: e.target.checked } : m
                                  );
                                  setModulePreferences(updated);
                                }}
                              >
                                显示
                              </Checkbox>
                            ]}
                          >
                            <List.Item.Meta
                              title={item.name}
                              description={`排序: ${item.order}`}
                            />
                          </List.Item>
                        )}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={handleSaveModulePreferences}
                        loading={loading}
                      >
                        保存布局设置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* 通知提醒偏好 */}
                <Card title={<><BellOutlined /> 通知提醒偏好</>}>
                  <Table
                    dataSource={notificationSettings}
                    pagination={false}
                    rowKey="type"
                    columns={[
                      {
                        title: '通知类型',
                        dataIndex: 'label',
                        key: 'label',
                      },
                      {
                        title: '系统消息',
                        key: 'systemMessage',
                        render: (_, record) => (
                          <Switch
                            checked={record.systemMessage}
                            onChange={(checked) => {
                              const updated = notificationSettings.map(n =>
                                n.type === record.type ? { ...n, systemMessage: checked } : n
                              );
                              setNotificationSettings(updated);
                            }}
                          />
                        ),
                      },
                      {
                        title: '短信通知',
                        key: 'sms',
                        render: (_, record) => (
                          <Switch
                            checked={record.sms}
                            onChange={(checked) => {
                              const updated = notificationSettings.map(n =>
                                n.type === record.type ? { ...n, sms: checked } : n
                              );
                              setNotificationSettings(updated);
                            }}
                          />
                        ),
                      },
                      {
                        title: '邮件通知',
                        key: 'email',
                        render: (_, record) => (
                          <Switch
                            checked={record.email}
                            onChange={(checked) => {
                              const updated = notificationSettings.map(n =>
                                n.type === record.type ? { ...n, email: checked } : n
                              );
                              setNotificationSettings(updated);
                            }}
                          />
                        ),
                      },
                    ]}
                  />

                  <Divider />

                  <Form layout="inline">
                    <Form.Item label="免打扰时段">
                      <Switch
                        checked={quietHours.enabled}
                        onChange={(checked) => setQuietHours({ ...quietHours, enabled: checked })}
                      />
                    </Form.Item>
                    {quietHours.enabled && (
                      <>
                        <Form.Item label="开始时间">
                          <Input
                            style={{ width: 100 }}
                            value={quietHours.startTime}
                            onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                          />
                        </Form.Item>
                        <Form.Item label="结束时间">
                          <Input
                            style={{ width: 100 }}
                            value={quietHours.endTime}
                            onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                          />
                        </Form.Item>
                      </>
                    )}
                  </Form>

                  <div style={{ marginTop: 16 }}>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />} 
                      onClick={handleSaveNotificationSettings}
                      loading={loading}
                    >
                      保存通知设置
                    </Button>
                  </div>
                </Card>
              </Space>
            </Tabs.TabPane>
          </Tabs>
        </Card>

        {/* 验证密码弹窗 */}
        <Modal
          title="验证密码"
          open={verifyModalVisible}
          onCancel={() => {
            setVerifyModalVisible(false);
            verifyPasswordForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={verifyPasswordForm}
            layout="vertical"
            onFinish={handleVerifyPassword}
          >
            <Form.Item
              label="请输入当前密码以继续"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入当前密码"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  验证
                </Button>
                <Button onClick={() => {
                  setVerifyModalVisible(false);
                  verifyPasswordForm.resetFields();
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 操作日志详情弹窗 */}
        <Modal
          title="操作详情"
          open={logDetailVisible}
          onCancel={() => setLogDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setLogDetailVisible(false)}>
              关闭
            </Button>
          ]}
        >
          {selectedLog && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="操作时间">{selectedLog.time}</Descriptions.Item>
              <Descriptions.Item label="操作模块">
                <Tag color="blue">{selectedLog.module}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作类型">
                <Tag>{selectedLog.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="操作内容">{selectedLog.content}</Descriptions.Item>
              <Descriptions.Item label="操作结果">
                {selectedLog.result === 'success' ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>
                ) : (
                  <Tag icon={<CloseCircleOutlined />} color="error">失败</Tag>
                )}
              </Descriptions.Item>
              {selectedLog.failReason && (
                <Descriptions.Item label="失败原因">
                  <Text type="danger">{selectedLog.failReason}</Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="IP地址">{selectedLog.ip}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PersonalCenter;
