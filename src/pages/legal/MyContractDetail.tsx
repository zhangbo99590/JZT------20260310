/**
 * 我的合同详情页面
 * 功能：合同信息展示、文件管理、操作记录、权限化操作
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Descriptions,
  Timeline,
  Upload,
  Table,
  Modal,
  message,
  Spin,
  Typography,
  Divider,
  Badge,
  Progress,
  Tooltip,
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Alert,
  Popconfirm,
} from 'antd';
import PageWrapper from '../../components/PageWrapper';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  BellOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  WarningOutlined,
  SendOutlined,
  SettingOutlined,
  TeamOutlined,
  LineChartOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd/es/upload';
import dayjs from 'dayjs';
import type { MyContractDetail as MyContractDetailType, ContractFile, ContractOperation, PerformanceNode } from '../../types/myContract';
import { MyContractStatus, MyContractType, SignStatus, UserRole } from '../../types/myContract';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// 状态标签映射
const statusLabels = {
  [MyContractStatus.PENDING_APPROVAL]: '待我审批',
  [MyContractStatus.INITIATED_BY_ME]: '我发起的',
  [MyContractStatus.RESPONSIBLE_BY_ME]: '我负责的',
  [MyContractStatus.COMPLETED]: '已完成',
  [MyContractStatus.TERMINATED]: '已终止',
  [MyContractStatus.DRAFT]: '草稿箱',
};

const statusColors = {
  [MyContractStatus.PENDING_APPROVAL]: 'warning',
  [MyContractStatus.INITIATED_BY_ME]: 'processing',
  [MyContractStatus.RESPONSIBLE_BY_ME]: 'success',
  [MyContractStatus.COMPLETED]: 'default',
  [MyContractStatus.TERMINATED]: 'error',
  [MyContractStatus.DRAFT]: 'default',
};

const typeLabels = {
  [MyContractType.SERVICE]: '服务合同',
  [MyContractType.PURCHASE]: '采购合同',
  [MyContractType.SALES]: '销售合同',
  [MyContractType.LEASE]: '租赁合同',
  [MyContractType.COOPERATION]: '合作合同',
  [MyContractType.EMPLOYMENT]: '劳动合同',
  [MyContractType.OTHER]: '其他',
};

const MyContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<MyContractDetailType | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [approvalForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [reminderForm] = Form.useForm();

  // 模拟数据加载
  useEffect(() => {
    const loadContractDetail = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockContract: MyContractDetailType = {
          id: id || '1',
          title: '软件开发服务合同',
          contractNumber: 'CT2024001',
          type: MyContractType.SERVICE,
          status: MyContractStatus.RESPONSIBLE_BY_ME,
          signStatus: SignStatus.FULLY_SIGNED,
          amount: 500000,
          currency: 'CNY',
          partnerName: '科技有限公司',
          partnerType: 'company',
          createdBy: '张三',
          createdAt: '2024-11-01',
          signedAt: '2024-11-15',
          expiryAt: '2025-05-15',
          updatedAt: '2024-12-20',
          effectiveDate: '2024-11-15',
          userRole: UserRole.RESPONSIBLE,
          tags: ['重要合同', '技术服务'],
          priority: 'high',
          isUrgent: false,
          daysToExpiry: 146,
          description: '为客户提供软件系统开发和技术支持服务',
          partyAName: '我方公司',
          partyBName: '科技有限公司',
          partyAContact: '李经理 13800138000',
          partyBContact: '王总监 13900139000',
          terminationReason: undefined,
          files: [
            {
              id: '1',
              name: '软件开发合同-原始版.pdf',
              type: 'original',
              version: 'v1.0',
              size: 2048000,
              url: '/files/contract-original.pdf',
              uploadedBy: '张三',
              uploadedAt: '2024-11-01',
              isPersonalUpload: true,
            },
            {
              id: '2',
              name: '软件开发合同-签署版.pdf',
              type: 'signed',
              version: 'v1.0',
              size: 2150000,
              url: '/files/contract-signed.pdf',
              uploadedBy: '系统',
              uploadedAt: '2024-11-15',
              isPersonalUpload: false,
            },
            {
              id: '3',
              name: '补充协议.pdf',
              type: 'supplement',
              version: 'v1.0',
              size: 512000,
              url: '/files/supplement.pdf',
              uploadedBy: '李四',
              uploadedAt: '2024-12-01',
              isPersonalUpload: false,
            },
          ],
          operations: [
            {
              id: '1',
              contractId: id || '1',
              action: 'create',
              description: '创建合同',
              operatorId: 'user1',
              operatorName: '张三',
              timestamp: '2024-11-01 09:00:00',
              comment: '初始创建合同',
            },
            {
              id: '2',
              contractId: id || '1',
              action: 'approve',
              description: '审批通过',
              operatorId: 'user2',
              operatorName: '李经理',
              timestamp: '2024-11-05 14:30:00',
              comment: '合同条款确认无误，同意签署',
            },
            {
              id: '3',
              contractId: id || '1',
              action: 'sign',
              description: '合同签署',
              operatorId: 'user1',
              operatorName: '张三',
              timestamp: '2024-11-15 16:00:00',
              comment: '双方完成签署',
            },
            {
              id: '4',
              contractId: id || '1',
              action: 'update_progress',
              description: '更新履约进度',
              operatorId: 'user1',
              operatorName: '张三',
              timestamp: '2024-12-20 10:00:00',
              comment: '项目第一阶段完成',
            },
          ],
          performanceNodes: [
            {
              id: '1',
              title: '合同签署',
              type: 'signing',
              status: 'completed',
              responsiblePerson: '张三',
              dueDate: '2024-11-15',
              completedAt: '2024-11-15',
              isPersonalResponsible: true,
              description: '双方签署正式合同',
            },
            {
              id: '2',
              title: '首期付款',
              type: 'payment',
              status: 'completed',
              responsiblePerson: '财务部',
              dueDate: '2024-11-30',
              completedAt: '2024-11-28',
              isPersonalResponsible: false,
              description: '支付合同金额的30%',
            },
            {
              id: '3',
              title: '第一阶段交付',
              type: 'delivery',
              status: 'completed',
              responsiblePerson: '张三',
              dueDate: '2024-12-31',
              completedAt: '2024-12-20',
              isPersonalResponsible: true,
              description: '完成系统基础功能开发',
            },
            {
              id: '4',
              title: '第二阶段交付',
              type: 'delivery',
              status: 'in_progress',
              responsiblePerson: '张三',
              dueDate: '2025-03-31',
              isPersonalResponsible: true,
              description: '完成系统高级功能开发',
            },
            {
              id: '5',
              title: '最终验收',
              type: 'milestone',
              status: 'pending',
              responsiblePerson: '客户方',
              dueDate: '2025-05-15',
              isPersonalResponsible: false,
              description: '系统最终验收和交付',
            },
          ],
          relatedContracts: [
            {
              id: '2',
              title: '技术支持服务合同',
              relation: '后续合同',
            },
          ],
          reminderSettings: {
            expiryReminder: 30,
            overdueAlert: true,
            smsNotification: true,
          },
        };
        
        setContract(mockContract);
      } catch (error) {
        message.error('加载合同详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadContractDetail();
    }
  }, [id]);

  // 处理审批
  const handleApproval = async (action: 'approve' | 'reject') => {
    try {
      const values = await approvalForm.validateFields();
      message.success(`${action === 'approve' ? '同意' : '驳回'}审批成功`);
      setApprovalModalVisible(false);
      approvalForm.resetFields();
      // 重新加载数据
    } catch (error) {
      console.error('审批失败:', error);
    }
  };

  // 处理付款申请
  const handlePaymentRequest = async () => {
    try {
      const values = await paymentForm.validateFields();
      message.success('付款申请提交成功');
      setPaymentModalVisible(false);
      paymentForm.resetFields();
    } catch (error) {
      console.error('付款申请失败:', error);
    }
  };

  // 处理提醒设置
  const handleReminderSettings = async () => {
    try {
      const values = await reminderForm.validateFields();
      message.success('提醒设置保存成功');
      setReminderModalVisible(false);
    } catch (error) {
      console.error('保存提醒设置失败:', error);
    }
  };

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  // 文件表格列配置
  const fileColumns: ColumnsType<ContractFile> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <FileTextOutlined />
          <span>{text}</span>
          {record.isPersonalUpload && <Tag color="blue">本人上传</Tag>}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          original: '原始稿',
          signed: '签署终稿',
          supplement: '补充协议',
        };
        return <Tag>{typeMap[type as keyof typeof typeMap]}</Tag>;
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '上传人',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />}>
            预览
          </Button>
          <Button type="text" size="small" icon={<DownloadOutlined />}>
            下载
          </Button>
        </Space>
      ),
    },
  ];

  // 操作记录表格列配置
  const operationColumns: ColumnsType<ContractOperation> = [
    {
      title: '操作时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 100,
    },
    {
      title: '操作类型',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
  ];

  // 渲染履约进度
  const renderPerformanceTimeline = () => {
    const getNodeIcon = (node: PerformanceNode) => {
      switch (node.status) {
        case 'completed':
          return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'in_progress':
          return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
        case 'overdue':
          return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
        default:
          return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      }
    };

    const getNodeColor = (node: PerformanceNode) => {
      switch (node.status) {
        case 'completed':
          return '#52c41a';
        case 'in_progress':
          return '#1890ff';
        case 'overdue':
          return '#ff4d4f';
        default:
          return '#d9d9d9';
      }
    };

    return (
      <Timeline>
        {contract?.performanceNodes.map((node) => (
          <Timeline.Item
            key={node.id}
            dot={getNodeIcon(node)}
            color={getNodeColor(node)}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Text strong>{node.title}</Text>
                {node.isPersonalResponsible && (
                  <Tag color="red" style={{ marginLeft: 8 }}>我负责</Tag>
                )}
              </div>
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary">
                  负责人：{node.responsiblePerson} · 
                  截止：{node.dueDate}
                  {node.completedAt && ` · 完成：${node.completedAt}`}
                </Text>
              </div>
              {node.description && (
                <Text type="secondary">{node.description}</Text>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!contract) {
    return <div>合同不存在</div>;
  }

  const module = location.pathname.startsWith('/system/') ? 'system' : 'legal';

  return (
    <PageWrapper module={module}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            {contract.title}
          </Title>
          <Tag color={statusColors[contract.status]}>
            {statusLabels[contract.status]}
          </Tag>
          {contract.isUrgent && <Badge status="error" text="紧急" />}
        </Space>
      </div>

      <Row gutter={24}>
        {/* 主要内容 */}
        <Col span={18}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 合同信息结构化展示 */}
            <TabPane tab="合同信息" key="info">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 1. 基础信息区 */}
                <Card title={<><FileTextOutlined /> 基础信息区</>} size="small">
                  <Descriptions column={3} bordered size="small">
                    <Descriptions.Item label="合同名称" span={2}>
                      <Text strong style={{ fontSize: 16 }}>{contract.title}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="当前状态">
                      <Tag color={statusColors[contract.status]} style={{ fontSize: 12 }}>
                        {statusLabels[contract.status]}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="合同编号">{contract.contractNumber}</Descriptions.Item>
                    <Descriptions.Item label="合作方">{contract.partyBName}</Descriptions.Item>
                    <Descriptions.Item label="合同类型">
                      <Tag color="blue">{typeLabels[contract.type]}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="合同金额">
                      <Text strong style={{ color: '#1890ff', fontSize: 14 }}>
                        ¥{contract.amount?.toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="签署日期">{contract.signedAt}</Descriptions.Item>
                    <Descriptions.Item label="到期日期">
                      <Text type={contract.daysToExpiry && contract.daysToExpiry <= 30 ? 'warning' : 'secondary'}>
                        {contract.expiryAt}
                        {contract.daysToExpiry && contract.daysToExpiry <= 30 && (
                          <Tag color="warning" style={{ marginLeft: 8 }}>
                            剩余{contract.daysToExpiry}天
                          </Tag>
                        )}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* 2. 个人关联信息区 */}
                <Card title={<><UserOutlined /> 个人关联信息区</>} size="small">
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="当前用户角色">
                      <Tag color="green" icon={<EditOutlined />}>
                        合同负责人
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="参与节点及时间">
                      创建时间：{contract.createdAt}
                    </Descriptions.Item>
                    <Descriptions.Item label="优先级">
                      <Tag color={contract.priority === 'high' ? 'red' : contract.priority === 'medium' ? 'orange' : 'default'}>
                        {contract.priority === 'high' ? '高优先级' : contract.priority === 'medium' ? '中优先级' : '低优先级'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="个人责任">
                      <Text type="secondary">
                        作为合同负责人，需要跟进履约进度和关键节点
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Space>
            </TabPane>

            {/* 3. 履约进度区 - 时间轴展示 */}
            <TabPane tab="履约进度" key="progress">
              <Card title={<><CalendarOutlined /> 履约进度区 - 时间轴展示</>}>
                <Alert
                  message="个人负责项标红突出"
                  description="以下显示签署、付款、交付等关键节点，您负责的项目已红色标记"
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                {renderPerformanceTimeline()}
              </Card>
            </TabPane>

            {/* 合同文件管理 */}
            <TabPane tab="合同文件" key="files">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 文件管理功能 */}
                <Card 
                  title={<><FileTextOutlined /> 合同文件管理</>}
                  extra={
                    <Space>
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                      </Upload>
                      <Button icon={<DownloadOutlined />}>批量下载</Button>
                      <Button icon={<PrinterOutlined />}>批量打印</Button>
                    </Space>
                  }
                >
                  <Alert
                    message="文件分类说明"
                    description="分类展示合同全版本文件：原始稿、签署终稿、补充协议。个人上传文件已标注“本人上传”。"
                    type="info"
                    style={{ marginBottom: 16 }}
                  />
                  <Table
                    columns={fileColumns}
                    dataSource={contract.files}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
                
                {/* 文件操作日志 */}
                <Card title={<><FileSearchOutlined /> 文件操作日志</>} size="small">
                  <Timeline>
                    {contract.files.map((file) => (
                      <Timeline.Item key={file.id}>
                        <div>
                          <Text strong>{file.name}</Text>
                          {file.isPersonalUpload && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>本人上传</Tag>
                          )}
                        </div>
                        <div>
                          <Text type="secondary">
                            {file.uploadedAt} 由 {file.uploadedBy} 上传
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </Space>
            </TabPane>

            {/* 个人操作记录追溯 */}
            <TabPane tab="操作记录" key="operations">
              <Card title={<><UserOutlined /> 个人操作记录追溯</>}>
                <Alert
                  message="个人工作复盘与追溯"
                  description="单独展示当前用户在该合同中的所有操作（发起、审批、上传附件等），每条记录标注操作时间、内容及关联文件。"
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                <Timeline>
                  {contract.operations.filter(op => op.operatorName === '张三').map((operation) => (
                    <Timeline.Item
                      key={operation.id}
                      color={operation.action === 'create' ? 'blue' : operation.action === 'approve' ? 'green' : 'orange'}
                    >
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>{operation.description}</Text>
                        <Tag color="blue" style={{ marginLeft: 8 }}>本人操作</Tag>
                      </div>
                      <div style={{ marginBottom: 4 }}>
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {operation.timestamp}
                        </Text>
                      </div>
                      {operation.comment && (
                        <div style={{ marginBottom: 4 }}>
                          <Text type="secondary">备注：{operation.comment}</Text>
                        </div>
                      )}
                      {operation.attachments && operation.attachments.length > 0 && (
                        <div>
                          <Text type="secondary">关联文件：</Text>
                          {operation.attachments.map((file, index) => (
                            <Tag key={index} style={{ marginLeft: 4 }}>{file}</Tag>
                          ))}
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </TabPane>
          </Tabs>
        </Col>

        {/* 右侧权限化操作工具组 */}
        <Col span={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 根据用户角色显示操作 */}
            <Card title={<><SettingOutlined /> 权限化操作工具组</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* 待审批合同操作 */}
                {contract.status === MyContractStatus.PENDING_APPROVAL && (
                  <>
                    <Alert
                      message="待审批操作"
                      description="您有权限审批此合同"
                      type="warning"
                      showIcon
                      style={{ marginBottom: 12 }}
                    />
                    <Button type="primary" block icon={<CheckCircleOutlined />} onClick={() => setApprovalModalVisible(true)}>
                      同意/驳回（需填理由）
                    </Button>
                    <Button block icon={<TeamOutlined />}>
                      转审他人
                    </Button>
                  </>
                )}
                
                {/* 负责的合同操作 */}
                {contract.status === MyContractStatus.RESPONSIBLE_BY_ME && (
                  <>
                    <Alert
                      message="负责人操作"
                      description="您是此合同的负责人"
                      type="info"
                      showIcon
                      style={{ marginBottom: 12 }}
                    />
                    <Button type="primary" block icon={<DollarOutlined />} onClick={() => setPaymentModalVisible(true)}>
                      发起付款申请
                    </Button>
                    <Button block icon={<FileTextOutlined />}>
                      提交交付凭证
                    </Button>
                    <Button block icon={<LineChartOutlined />}>
                      更新进度
                    </Button>
                  </>
                )}
                
                <Divider style={{ margin: '12px 0' }} />
                
                {/* 通用操作 */}
                <Button block icon={<BellOutlined />} onClick={() => setReminderModalVisible(true)}>
                  设置到期提醒
                </Button>
                <Button block icon={<SendOutlined />}>
                  向合作方发送催办提醒
                </Button>
                <Button block icon={<PrinterOutlined />}>
                  导出全套合同材料PDF
                </Button>
                <Button block icon={<ShareAltOutlined />}>
                  分享合同
                </Button>
              </Space>
            </Card>

            {/* 相关合同 */}
            {contract.relatedContracts.length > 0 && (
              <Card title={<><LinkOutlined /> 相关合同</>} size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {contract.relatedContracts.map(related => (
                    <Button
                      key={related.id}
                      type="link"
                      block
                      style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid #f0f0f0', borderRadius: 6 }}
                      onClick={() => navigate(`/system/my-contracts/detail/${related.id}`)}
                    >
                      <div>
                        <Text strong>{related.title}</Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            关系：{related.relation}
                          </Text>
                        </div>
                      </div>
                    </Button>
                  ))}
                </Space>
              </Card>
            )}
          </Space>
        </Col>
      </Row>

      {/* 审批模态框 */}
      <Modal
        title="合同审批"
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        footer={[
          <Button key="reject" onClick={() => handleApproval('reject')}>
            驳回
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleApproval('approve')}>
            同意
          </Button>,
        ]}
      >
        <Form form={approvalForm} layout="vertical">
          <Form.Item
            label="审批意见"
            name="comment"
            rules={[{ required: true, message: '请填写审批意见' }]}
          >
            <TextArea rows={4} placeholder="请填写审批意见..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 付款申请模态框 */}
      <Modal
        title="发起付款申请"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        onOk={handlePaymentRequest}
      >
        <Form form={paymentForm} layout="vertical">
          <Form.Item
            label="付款金额"
            name="amount"
            rules={[{ required: true, message: '请输入付款金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
              placeholder="请输入付款金额"
            />
          </Form.Item>
          <Form.Item
            label="付款事由"
            name="reason"
            rules={[{ required: true, message: '请填写付款事由' }]}
          >
            <TextArea rows={3} placeholder="请描述付款事由..." />
          </Form.Item>
          <Form.Item
            label="预计付款日期"
            name="paymentDate"
            rules={[{ required: true, message: '请选择预计付款日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 提醒设置模态框 */}
      <Modal
        title="到期提醒设置"
        open={reminderModalVisible}
        onCancel={() => setReminderModalVisible(false)}
        onOk={handleReminderSettings}
      >
        <Form form={reminderForm} layout="vertical" initialValues={contract.reminderSettings}>
          <Form.Item
            label="到期提醒提前天数"
            name="expiryReminder"
          >
            <Select>
              <Option value={3}>3天</Option>
              <Option value={7}>7天</Option>
              <Option value={15}>15天</Option>
              <Option value={30}>30天</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="逾期预警"
            name="overdueAlert"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="短信通知"
            name="smsNotification"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageWrapper>
  );
};

export default MyContractDetail;
