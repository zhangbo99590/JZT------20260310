import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Space, 
  Tag, 
  Button, 
  DatePicker, 
  Select, 
  Input,
  Modal,
  Descriptions,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface OperationLog {
  id: string;
  operationTime: string;
  module: string;
  operationType: string;
  operationContent: string;
  ipAddress: string;
  status: 'success' | 'failed';
  failReason?: string;
  details?: string;
}

const OperationLogs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7days');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);

  const mockLogs: OperationLog[] = [
    {
      id: '1',
      operationTime: '2024-12-15 11:30:25',
      module: '政策中心',
      operationType: '查询',
      operationContent: '查看政策详情：《2024年科技创新补贴政策》',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '用户查看了政策详情页面，停留时间3分钟'
    },
    {
      id: '2',
      operationTime: '2024-12-15 10:45:12',
      module: '我的申报',
      operationType: '修改',
      operationContent: '修改申报项目材料：《高新技术企业认定申请》',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '更新了项目申报材料中的财务报表附件'
    },
    {
      id: '3',
      operationTime: '2024-12-15 09:20:33',
      module: '融资诊断',
      operationType: '新增',
      operationContent: '提交融资诊断申请',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '完成融资诊断问卷填写，系统生成诊断报告'
    },
    {
      id: '4',
      operationTime: '2024-12-14 16:55:41',
      module: '商机大厅',
      operationType: '查询',
      operationContent: '搜索供需信息：关键词"芯片"',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '查询到15条相关供需信息'
    },
    {
      id: '5',
      operationTime: '2024-12-14 15:30:18',
      module: '法律护航',
      operationType: '查询',
      operationContent: '查询法规：《公司法》相关条款',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '查看了公司法第三章内容'
    },
    {
      id: '6',
      operationTime: '2024-12-14 14:20:55',
      module: '我的申报',
      operationType: '删除',
      operationContent: '删除草稿：《研发费用加计扣除申请》',
      ipAddress: '192.168.1.100',
      status: 'failed',
      failReason: '权限不足',
      details: '用户尝试删除已提交的申报草稿，但该草稿已进入审核流程，无法删除'
    },
    {
      id: '7',
      operationTime: '2024-12-13 11:15:22',
      module: '政策中心',
      operationType: '新增',
      operationContent: '收藏政策：《小微企业税收优惠政策》',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '将政策添加到收藏夹'
    },
    {
      id: '8',
      operationTime: '2024-12-13 10:05:47',
      module: '商机大厅',
      operationType: '新增',
      operationContent: '发布供需信息：《寻求芯片供应商》',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '成功发布供需信息，待审核'
    },
    {
      id: '9',
      operationTime: '2024-12-12 16:40:33',
      module: '系统管理',
      operationType: '修改',
      operationContent: '修改个人信息：更新联系电话',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '更新了个人联系电话'
    },
    {
      id: '10',
      operationTime: '2024-12-12 09:30:15',
      module: '融资诊断',
      operationType: '查询',
      operationContent: '查看融资诊断报告',
      ipAddress: '192.168.1.100',
      status: 'success',
      details: '查看了2024年12月的融资诊断报告'
    },
  ];

  const [logs, setLogs] = useState<OperationLog[]>(mockLogs);

  const columns: ColumnsType<OperationLog> = [
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      width: 180,
      sorter: (a, b) => new Date(a.operationTime).getTime() - new Date(b.operationTime).getTime(),
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      filters: [
        { text: '政策中心', value: '政策中心' },
        { text: '商机大厅', value: '商机大厅' },
        { text: '融资诊断', value: '融资诊断' },
        { text: '我的申报', value: '我的申报' },
        { text: '法律护航', value: '法律护航' },
        { text: '系统管理', value: '系统管理' },
      ],
      onFilter: (value, record) => record.module === value,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '查询': 'blue',
          '新增': 'green',
          '修改': 'orange',
          '删除': 'red',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
      filters: [
        { text: '查询', value: '查询' },
        { text: '新增', value: '新增' },
        { text: '修改', value: '修改' },
        { text: '删除', value: '删除' },
      ],
      onFilter: (value, record) => record.operationType === value,
    },
    {
      title: '操作内容',
      dataIndex: 'operationContent',
      key: 'operationContent',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: OperationLog) => {
        if (status === 'success') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              成功
            </Tag>
          );
        } else {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              失败
            </Tag>
          );
        }
      },
      filters: [
        { text: '成功', value: 'success' },
        { text: '失败', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  const handleViewDetail = (log: OperationLog) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setSelectedDateRange('7days');
    setSelectedModule('all');
    setSelectedType('all');
    setSearchText('');
    setLogs(mockLogs);
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>时间范围</Text>
                <Select
                  value={selectedDateRange}
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                >
                  <Option value="7days">近7天</Option>
                  <Option value="30days">近30天</Option>
                  <Option value="90days">近90天</Option>
                  <Option value="custom">自定义</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>操作模块</Text>
                <Select
                  value={selectedModule}
                  onChange={setSelectedModule}
                  style={{ width: '100%' }}
                >
                  <Option value="all">全部模块</Option>
                  <Option value="policy">政策中心</Option>
                  <Option value="opportunity">商机大厅</Option>
                  <Option value="financing">融资诊断</Option>
                  <Option value="application">我的申报</Option>
                  <Option value="legal">法律护航</Option>
                  <Option value="system">系统管理</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>操作类型</Text>
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  style={{ width: '100%' }}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="query">查询</Option>
                  <Option value="add">新增</Option>
                  <Option value="edit">修改</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>关键词搜索</Text>
                <Input
                  placeholder="搜索操作内容"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Space>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            total: logs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="操作详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedLog && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="操作时间">
              {selectedLog.operationTime}
            </Descriptions.Item>
            <Descriptions.Item label="操作模块">
              {selectedLog.module}
            </Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={
                selectedLog.operationType === '查询' ? 'blue' :
                selectedLog.operationType === '新增' ? 'green' :
                selectedLog.operationType === '修改' ? 'orange' : 'red'
              }>
                {selectedLog.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作内容">
              {selectedLog.operationContent}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
              {selectedLog.ipAddress}
            </Descriptions.Item>
            <Descriptions.Item label="操作结果">
              {selectedLog.status === 'success' ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  成功
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  失败
                </Tag>
              )}
            </Descriptions.Item>
            {selectedLog.status === 'failed' && selectedLog.failReason && (
              <Descriptions.Item label="失败原因">
                <Text type="danger">{selectedLog.failReason}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="详细信息">
              {selectedLog.details}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OperationLogs;
