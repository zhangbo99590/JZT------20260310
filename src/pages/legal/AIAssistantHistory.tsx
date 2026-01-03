import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Typography, Button, Space, Input, Select, DatePicker,
  Table, Tag, Rate, Popconfirm, message, Empty, Checkbox, Modal, Tooltip, Breadcrumb,
} from 'antd';
import {
  HistoryOutlined, SearchOutlined, DeleteOutlined, StarOutlined,
  StarFilled, ReloadOutlined, DownloadOutlined, FilterOutlined,
  ArrowLeftOutlined, BankOutlined, RobotOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { QAHistory, QUESTION_TYPES } from '../../types/ai-assistant';
import { getQAHistory, clearQAHistory } from '../../services/aiAssistantService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AIAssistantHistory: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<QAHistory[]>([]);
  const [filteredData, setFilteredData] = useState<QAHistory[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<QAHistory | null>(null);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  // 加载数据
  const loadHistory = () => {
    setLoading(true);
    // 模拟从localStorage或API加载数据
    const mockData: QAHistory[] = [
      {
        id: '1',
        question: '合同违约金上限是多少？',
        answer: '根据《民法典》规定，违约金一般不超过实际损失的30%...',
        questionType: 'contract',
        timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        rating: 5,
        starred: true,
        tags: ['合同', '违约金', '民法典'],
      },
      {
        id: '2',
        question: '员工试用期最长可以设置多久？',
        answer: '根据《劳动合同法》规定，试用期根据合同期限不同而不同...',
        questionType: 'labor',
        timestamp: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        rating: 4,
        starred: false,
        tags: ['劳动法', '试用期'],
      },
      {
        id: '3',
        question: '如何合法解除劳动合同？',
        answer: '劳动合同的解除分为协商解除、法定解除等多种情形...',
        questionType: 'labor',
        timestamp: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
        rating: 5,
        starred: true,
        tags: ['劳动合同', '解除'],
      },
    ];
    
    setDataSource(mockData);
    setFilteredData(mockData);
    setLoading(false);
  };

  // 应用筛选
  useEffect(() => {
    let filtered = [...dataSource];

    // 关键词搜索
    if (searchText) {
      filtered = filtered.filter(
        item =>
          item.question.toLowerCase().includes(searchText.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.some(tag => tag.includes(searchText))
      );
    }

    // 类型筛选
    if (selectedType) {
      filtered = filtered.filter(item => item.questionType === selectedType);
    }

    // 时间范围筛选
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.timestamp);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      });
    }

    setFilteredData(filtered);
  }, [searchText, selectedType, dateRange, dataSource]);

  // 重新提问
  const handleReask = (record: QAHistory) => {
    navigate('/legal-support/ai-assistant', {
      state: { question: record.question, type: record.questionType },
    });
  };

  // 收藏/取消收藏
  const handleToggleStar = (id: string) => {
    const updated = dataSource.map(item =>
      item.id === id ? { ...item, starred: !item.starred } : item
    );
    setDataSource(updated);
    message.success('操作成功');
  };

  // 删除单条记录
  const handleDelete = (id: string) => {
    const updated = dataSource.filter(item => item.id !== id);
    setDataSource(updated);
    message.success('删除成功');
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的记录');
      return;
    }
    const updated = dataSource.filter(item => !selectedRowKeys.includes(item.id));
    setDataSource(updated);
    setSelectedRowKeys([]);
    message.success(`已删除 ${selectedRowKeys.length} 条记录`);
  };

  // 清空所有记录
  const handleClearAll = () => {
    clearQAHistory();
    setDataSource([]);
    setSelectedRowKeys([]);
    message.success('已清空所有历史记录');
  };

  // 查看详情
  const handleViewDetail = (record: QAHistory) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<QAHistory> = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      width: '30%',
      ellipsis: true,
      render: (text: string, record: QAHistory) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: '类型',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 120,
      render: (type: string) => {
        const typeInfo = QUESTION_TYPES.find(t => t.value === type);
        return typeInfo ? <Tag color={typeInfo.color}>{typeInfo.label}</Tag> : null;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} style={{ marginBottom: 4 }}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (rating?: number) => <Rate disabled value={rating || 0} style={{ fontSize: 14 }} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: QAHistory) => (
        <Space size="small">
          <Tooltip title={record.starred ? '取消收藏' : '收藏'}>
            <Button
              type="text"
              size="small"
              icon={record.starred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={() => handleToggleStar(record.id)}
            />
          </Tooltip>
          <Tooltip title="重新提问">
            <Button type="text" size="small" icon={<ReloadOutlined />} onClick={() => handleReask(record)} />
          </Tooltip>
          <Tooltip title="导出">
            <Button type="text" size="small" icon={<DownloadOutlined />} />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { title: <span><BankOutlined style={{ marginRight: 6 }} />法律护航</span>, href: '/legal-support' },
          { title: <span><RobotOutlined style={{ marginRight: 6 }} />AI智能问答</span>, href: '/legal-support/ai-assistant' },
          { title: <span><HistoryOutlined style={{ marginRight: 6 }} />历史记录</span> },
        ]}
      />
      
      {/* 页面标题 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="large">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/legal-support/ai-assistant')}
                  >
                    返回
                  </Button>
                  <div>
                    <Title level={3} style={{ margin: 0 }}>
                      <HistoryOutlined style={{ marginRight: 8 }} />
                      问答历史记录
                    </Title>
                    <Text type="secondary">共 {filteredData.length} 条记录</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 筛选和操作栏 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Input
                    placeholder="搜索问题、答案或标签"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Select
                    placeholder="选择问题类型"
                    style={{ width: '100%' }}
                    value={selectedType || undefined}
                    onChange={setSelectedType}
                    allowClear
                  >
                    {QUESTION_TYPES.map(type => (
                      <Option key={type.value} value={type.value}>
                        <Tag color={type.color}>{type.label}</Tag>
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                    placeholder={['开始日期', '结束日期']}
                  />
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <Space>
                    <Checkbox
                      checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
                      indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRowKeys(filteredData.map(item => item.id));
                        } else {
                          setSelectedRowKeys([]);
                        }
                      }}
                    >
                      全选
                    </Checkbox>
                    {selectedRowKeys.length > 0 && (
                      <Text type="secondary">已选择 {selectedRowKeys.length} 项</Text>
                    )}
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Popconfirm
                      title={`确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`}
                      onConfirm={handleBatchDelete}
                      disabled={selectedRowKeys.length === 0}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        disabled={selectedRowKeys.length === 0}
                      >
                        批量删除
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="确定要清空所有历史记录吗？此操作不可恢复！"
                      onConfirm={handleClearAll}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button icon={<DeleteOutlined />} danger>
                        清空全部
                      </Button>
                    </Popconfirm>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 数据表格 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              locale={{
                emptyText: <Empty description="暂无历史记录" />,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详情模态框 */}
      <Modal
        title="问答详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="reask" type="primary" onClick={() => currentRecord && handleReask(currentRecord)}>
            重新提问
          </Button>,
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>问题：</Text>
              <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {currentRecord.question}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>回答：</Text>
              <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4, maxHeight: 400, overflowY: 'auto' }}>
                {currentRecord.answer}
              </div>
            </div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>类型：</Text>
                <Tag color={QUESTION_TYPES.find(t => t.value === currentRecord.questionType)?.color}>
                  {QUESTION_TYPES.find(t => t.value === currentRecord.questionType)?.label}
                </Tag>
              </div>
              <div>
                <Text strong>标签：</Text>
                {currentRecord.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div>
                <Text strong>时间：</Text>
                <Text>{currentRecord.timestamp}</Text>
              </div>
              <div>
                <Text strong>评分：</Text>
                <Rate disabled value={currentRecord.rating || 0} />
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIAssistantHistory;
