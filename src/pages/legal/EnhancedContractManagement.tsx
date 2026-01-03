/**
 * 增强的合同管理页面
 * 功能：合同上传、编辑、高级筛选、列表管理
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  Alert,
  Upload,
  message,
  Tooltip,
  Typography,
  Drawer,
  Popconfirm,
  Dropdown,
  Menu,
  Breadcrumb,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  MoreOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import dayjs from 'dayjs';
import PageWrapper from '../../components/PageWrapper';

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 合同状态枚举
enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

// 合同类型枚举
enum ContractType {
  PURCHASE = 'purchase',
  SALES = 'sales',
  SERVICE = 'service',
  EMPLOYMENT = 'employment',
  LEASE = 'lease',
  PARTNERSHIP = 'partnership',
  OTHER = 'other',
}

// 合同接口
interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  counterparty: string;
  amount?: number;
  currency: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  description?: string;
  attachments: string[];
}

const EnhancedContractManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const module = location.pathname.startsWith('/system') ? 'system' : 'legal';
  const pageTitle = module === 'system' ? '我的合同' : '合同管理';
  const detailPathPrefix =
    module === 'system'
      ? '/system/my-contracts/detail'
      : '/legal-support/contract-management/detail';

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  // 模态框状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  
  // 筛选状态
  const [filters, setFilters] = useState<any>({});
  const [quickFilters, setQuickFilters] = useState({
    status: '',
    type: '',
  });

  // 上传文件列表
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 模拟数据 - 使用useMemo避免每次渲染重新创建
  const mockContracts: Contract[] = useMemo(() => [
    {
      id: '1',
      title: '软件开发服务合同',
      type: ContractType.SERVICE,
      status: ContractStatus.ACTIVE,
      counterparty: '北京科技有限公司',
      amount: 500000,
      currency: 'CNY',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: '张三',
      tags: ['软件开发', '技术服务'],
      description: '企业管理系统开发服务合同',
      attachments: ['contract.pdf', 'attachment1.doc'],
    },
    {
      id: '2',
      title: '设备采购合同',
      type: ContractType.PURCHASE,
      status: ContractStatus.PENDING,
      counterparty: '上海设备供应商',
      amount: 200000,
      currency: 'CNY',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      createdBy: '李四',
      tags: ['设备采购', '硬件'],
      description: '办公设备采购合同',
      attachments: ['purchase_contract.pdf'],
    },
  ], []);

  // 合同状态标签配置 - 使用useMemo缓存
  const statusConfig = useMemo(() => ({
    [ContractStatus.DRAFT]: { color: 'default', text: '草稿' },
    [ContractStatus.PENDING]: { color: 'processing', text: '待审批' },
    [ContractStatus.ACTIVE]: { color: 'success', text: '生效中' },
    [ContractStatus.EXPIRED]: { color: 'warning', text: '已过期' },
    [ContractStatus.TERMINATED]: { color: 'error', text: '已终止' },
  }), []);

  // 合同类型配置 - 使用useMemo缓存
  const typeConfig = useMemo(() => ({
    [ContractType.PURCHASE]: '采购合同',
    [ContractType.SALES]: '销售合同',
    [ContractType.SERVICE]: '服务合同',
    [ContractType.EMPLOYMENT]: '劳动合同',
    [ContractType.LEASE]: '租赁合同',
    [ContractType.PARTNERSHIP]: '合作合同',
    [ContractType.OTHER]: '其他合同',
  }), []);

  // 加载合同列表
  const loadContracts = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredContracts = [...mockContracts];
      
      // 应用筛选条件
      if (filters.keyword) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.title.includes(filters.keyword!) ||
          contract.counterparty.includes(filters.keyword!) ||
          contract.description?.includes(filters.keyword!)
        );
      }
      
      if (filters.status) {
        filteredContracts = filteredContracts.filter(contract => contract.status === filters.status);
      }
      
      if (filters.type) {
        filteredContracts = filteredContracts.filter(contract => contract.type === filters.type);
      }

      setContracts(filteredContracts);
      setTotal(filteredContracts.length);
    } catch (error) {
      message.error('加载合同列表失败');
    } finally {
      setLoading(false);
    }
  }, [filters, mockContracts]);

  // 初始化数据 - 优化依赖
  useEffect(() => {
    loadContracts();
  }, [loadContracts, currentPage, pageSize]);

  // 搜索处理 - 使用useCallback优化
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, keyword: value }));
    setCurrentPage(1);
  }, []);

  // 快速筛选 - 使用useCallback优化
  const handleQuickFilter = useCallback((key: string, value: string) => {
    setQuickFilters(prev => ({ ...prev, [key]: value }));
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
    setCurrentPage(1);
  }, []);

  // 新建合同 - 使用useCallback优化
  const handleCreateContract = useCallback(() => {
    try {
      setCurrentContract(null);
      form.resetFields();
      setFileList([]);
      setEditModalVisible(true);
      message.info('正在打开新建合同对话框...');
    } catch (error) {
      message.error('打开新建合同对话框失败');
    }
  }, [form]);

  // 编辑合同 - 使用useCallback优化
  const handleEditContract = useCallback((contract: Contract) => {
    try {
      setCurrentContract(contract);
      form.setFieldsValue({
        ...contract,
        startDate: dayjs(contract.startDate),
        endDate: dayjs(contract.endDate),
      });
      setFileList([]);
      setEditModalVisible(true);
      message.info('正在打开编辑对话框...');
    } catch (error) {
      message.error('打开编辑对话框失败');
    }
  }, [form]);

  // 保存合同
  const handleSaveContract = async (values: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentContract) {
        message.success('合同更新成功');
      } else {
        message.success('合同创建成功');
      }
      
      setEditModalVisible(false);
      loadContracts();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除合同 - 使用useCallback优化
  const handleDeleteContract = useCallback(async (contractId: string) => {
    try {
      setLoading(true);
      // 模拟删除操作
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 从合同列表中移除该合同
      setContracts(prevContracts => prevContracts.filter(contract => contract.id !== contractId));
      setTotal(prevTotal => prevTotal - 1);
      
      message.success('合同删除成功');
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 高级筛选应用
  const handleApplyAdvancedFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      setFilters({ ...filters, ...values });
      setCurrentPage(1);
      setFilterDrawerVisible(false);
      message.success('筛选条件已应用');
    } catch (error) {
    }
  };

  // 批量导入状态
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importFileList, setImportFileList] = useState<UploadFile[]>([]);
  
  // 批量导入
  const handleBatchImport = () => {
    try {
      setImportFileList([]);
      setImportModalVisible(true);
      message.info('正在打开批量导入对话框...');
    } catch (error) {
      message.error('打开批量导入对话框失败');
    }
  };

  // 批量导入提交逻辑 - 超级简化版
  const handleImportSubmit = () => {
    if (importFileList.length === 0) {
      message.warning('请先选择要导入的文件');
      return;
    }

    setUploading(true);
    
    // 直接添加模拟合同数据
    try {
      // 添加新合同
      const newContracts = [
        {
          id: `import-${Date.now()}-1`,
          title: '测试导入合同1',
          status: ContractStatus.DRAFT,
          type: ContractType.SERVICE,
          counterparty: '北京科技有限公司',
          amount: 50000,
          currency: 'CNY',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          createdBy: '当前用户',
          tags: ['已导入', '测试'],
          description: '测试导入的合同数据',
          attachments: ['合同文件.pdf'],
        },
        {
          id: `import-${Date.now()}-2`,
          title: '测试导入合同2',
          status: ContractStatus.DRAFT,
          type: ContractType.PURCHASE,
          counterparty: '上海贸易有限公司',
          amount: 75000,
          currency: 'CNY',
          startDate: '2025-02-01',
          endDate: '2025-12-31',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          createdBy: '当前用户',
          tags: ['已导入', '采购'],
          description: '测试导入的采购合同',
          attachments: ['采购合同.pdf'],
        }
      ];
      
      // 直接将新合同添加到列表开头
      setContracts(prevContracts => [...newContracts, ...prevContracts]);
      setTotal(prevTotal => prevTotal + newContracts.length);
      
      message.success(`成功导入 ${importFileList.length} 个合同文件`);
      setImportModalVisible(false);
      setImportFileList([]);
    } catch (error) {
      message.error('导入失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 批量导入上传配置 - 超级简化版
  const importUploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    accept: '*/*',
    fileList: importFileList,
    customRequest: ({ onSuccess }) => {
      // 模拟成功上传
      setTimeout(() => {
        onSuccess?.("ok");
      }, 0);
    },
    onChange: (info) => {
      setImportFileList(info.fileList);
    },
    listType: "text",
    showUploadList: true
  };

  // 编辑合同上传配置
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 检查文件类型
      const isValidType = file.type === 'application/pdf' || 
                          file.type === 'application/msword' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isValidType) {
        message.error(`${file.name} 不是支持的文件格式 (PDF, Word)`);
        return Upload.LIST_IGNORE;
      }
      // 检查文件大小 (10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // 阻止自动上传
    },
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    fileList,
  };

  // 批量导出
  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的合同');
      return;
    }

    const selectedContracts = contracts.filter(contract => selectedRowKeys.includes(contract.id));
    const header = ['合同标题', '合同类型', '合同状态', '对方当事人', '开始日期', '结束日期'];
    const rows = selectedContracts.map(contract => ([
      contract.title,
      typeConfig[contract.type],
      statusConfig[contract.status].text,
      contract.counterparty,
      contract.startDate,
      contract.endDate,
    ]));

    const csv = [header, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contracts_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success(`已导出 ${selectedRowKeys.length} 个合同`);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的合同');
      return;
    }
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`成功删除 ${selectedRowKeys.length} 个合同`);
      setSelectedRowKeys([]);
      loadContracts();
    } catch (error) {
      message.error('批量删除失败');
    } finally {
      setLoading(false);
    }
  };



  // 表格列配置 - 使用useMemo避免每次渲染重新创建
  const columns: ColumnsType<Contract> = useMemo(() => [
    {
      title: '合同标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <div>
          <Text 
            strong 
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              try {
                navigate(`${detailPathPrefix}/${record.id}`);
                message.info('正在跳转到合同详情页...');
              } catch (error) {
                message.error('跳转到详情页失败');
              }
            }}
          >
            {text}
          </Text>
          {record.tags.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.tags.map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: ContractType) => (
        <Tag color="geekblue">{typeConfig[type]}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ContractStatus) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '对方当事人',
      dataIndex: 'counterparty',
      key: 'counterparty',
      width: 150,
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        amount ? `¥${amount.toLocaleString()}` : '-'
      ),
    },
    {
      title: '合同期限',
      key: 'period',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.startDate} 至</div>
          <div>{record.endDate}</div>
        </div>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                try {
                  navigate(`${detailPathPrefix}/${record.id}`);
                  message.info('正在跳转到合同详情页...');
                } catch (error) {
                  message.error('跳转到详情页失败');
                }
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleEditContract(record);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个合同吗？"
            onConfirm={(e) => {
              handleDeleteContract(record.id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                danger 
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ], [navigate, handleEditContract, handleDeleteContract, statusConfig, typeConfig, detailPathPrefix]);

  return (
    <PageWrapper module={module}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: module === 'system' ? '系统管理' : '法律护航',
            href: module === 'system' ? '/system' : '/legal-support',
          },
          {
            title: module === 'system' ? '我的合同' : '合同管理',
          },
        ]}
      />
      {/* 页面标题 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              {pageTitle}
            </Title>
            <Text type="secondary">管理和维护所有合同文档，支持上传、编辑和高级筛选</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ImportOutlined />} onClick={handleBatchImport}>批量导入</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateContract}>
                新建合同
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 批量导入弹窗 */}
      <Modal
        title={
          <Space>
            <ImportOutlined />
            <span>批量导入合同</span>
          </Space>
        }
        open={importModalVisible}
        onCancel={() => {
          if (!uploading) {
            setImportModalVisible(false);
            setImportFileList([]);
          }
        }}
        footer={[
          <Button key="cancel" onClick={() => setImportModalVisible(false)} disabled={uploading}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={uploading} 
            onClick={handleImportSubmit}
            disabled={importFileList.length === 0}
          >
            {uploading ? '导入中...' : '开始导入'}
          </Button>,
        ]}
        width={600}
      >
        <Alert
          message="导入说明"
          description={
            <ul>
              <li>支持批量上传 PDF、Word、Excel 格式的合同文件</li>
              <li>单个文件大小不超过 10MB，一次最多上传 5 个文件</li>
              <li>系统将自动解析文件名作为合同标题</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <div style={{ padding: '20px 0', border: '1px dashed #d9d9d9', borderRadius: '4px', backgroundColor: '#fafafa', textAlign: 'center' }}>
          <Upload.Dragger 
            {...importUploadProps} 
            style={{ border: 'none', background: 'transparent' }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              选择任意文件即可测试导入功能
            </p>
          </Upload.Dragger>
        </div>
      </Modal>

      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索合同标题、对方当事人或描述..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="状态筛选"
                style={{ width: 120 }}
                allowClear
                value={quickFilters.status}
                onChange={(value) => handleQuickFilter('status', value)}
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
              <Select
                placeholder="类型筛选"
                style={{ width: 120 }}
                allowClear
                value={quickFilters.type}
                onChange={(value) => handleQuickFilter('type', value)}
              >
                {Object.entries(typeConfig).map(([key, text]) => (
                  <Option key={key} value={key}>{text}</Option>
                ))}
              </Select>
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setFilterDrawerVisible(true)}
              >
                高级筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {contracts.length}
              </div>
              <div style={{ color: '#666' }}>总合同数</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {contracts.filter(c => c.status === ContractStatus.ACTIVE).length}
              </div>
              <div style={{ color: '#666' }}>生效中</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {contracts.filter(c => c.status === ContractStatus.PENDING).length}
              </div>
              <div style={{ color: '#666' }}>待审批</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {contracts.filter(c => c.status === ContractStatus.EXPIRED).length}
              </div>
              <div style={{ color: '#666' }}>已过期</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 合同列表 */}
      <Card>
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: '8px 16px', backgroundColor: '#e6f7ff', borderRadius: 4 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Text>已选择 {selectedRowKeys.length} 项</Text>
              </Col>
              <Col>
                <Space>
                  <Button icon={<ExportOutlined />} onClick={handleBatchExport}>导出选中</Button>
                  <Popconfirm
                    title={`确定要删除选中的 ${selectedRowKeys.length} 个合同吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button icon={<DeleteOutlined />} danger>批量删除</Button>
                  </Popconfirm>
                </Space>
              </Col>
            </Row>
          </div>
        )}
        
        <Table
          columns={columns}
          dataSource={contracts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* 合同编辑模态框 */}
      <Modal
        title={currentContract ? '编辑合同' : '新建合同'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveContract}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="合同标题"
                rules={[{ required: true, message: '请输入合同标题' }]}
              >
                <Input placeholder="请输入合同标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="合同类型"
                rules={[{ required: true, message: '请选择合同类型' }]}
              >
                <Select placeholder="请选择合同类型">
                  {Object.entries(typeConfig).map(([key, text]) => (
                    <Option key={key} value={key}>{text}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="counterparty"
                label="对方当事人"
                rules={[{ required: true, message: '请输入对方当事人' }]}
              >
                <Input placeholder="请输入对方当事人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="合同状态"
                rules={[{ required: true, message: '请选择合同状态' }]}
              >
                <Select placeholder="请选择合同状态">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <Option key={key} value={key}>{config.text}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="合同金额">
                <Input type="number" placeholder="请输入合同金额" addonAfter="元" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label="币种" initialValue="CNY">
                <Select>
                  <Option value="CNY">人民币</Option>
                  <Option value="USD">美元</Option>
                  <Option value="EUR">欧元</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="请输入标签，按回车添加">
              <Option value="软件开发">软件开发</Option>
              <Option value="技术服务">技术服务</Option>
              <Option value="设备采购">设备采购</Option>
              <Option value="硬件">硬件</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="合同描述">
            <Input.TextArea rows={3} placeholder="请输入合同描述" />
          </Form.Item>

          <Form.Item label="合同附件">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
              支持 PDF、Word 格式，单个文件不超过 10MB
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentContract ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
      >
        <Form form={filterForm} layout="vertical">
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="搜索合同标题、描述等" />
          </Form.Item>
          <Form.Item name="type" label="合同类型">
            <Select placeholder="请选择合同类型" allowClear>
              {Object.entries(typeConfig).map(([key, text]) => (
                <Option key={key} value={key}>{text}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="合同状态">
            <Select placeholder="请选择合同状态" allowClear>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Option key={key} value={key}>{config.text}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="counterparty" label="对方当事人">
            <Input placeholder="请输入对方当事人" />
          </Form.Item>
          <Form.Item name="dateRange" label="合同期限">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => filterForm.resetFields()}>重置</Button>
              <Button type="primary" onClick={handleApplyAdvancedFilter}>应用筛选</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </PageWrapper>
  );
};

export default EnhancedContractManagement;
