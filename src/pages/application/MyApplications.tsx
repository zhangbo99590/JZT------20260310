import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';
import { 
  Layout, Card, Row, Col, Input, Select, DatePicker, Button, Space, 
  Tag, Pagination, Modal, message, Popconfirm, Tooltip, Empty, 
  Drawer, Steps, Alert, Result,
  List, Checkbox, Dropdown, MenuProps, Avatar, Typography, Progress, Badge, Divider
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, ReloadOutlined, 
  DeleteOutlined, ExportOutlined, EditOutlined, 
  EyeOutlined, SendOutlined, UndoOutlined, 
  MoreOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, 
  ClockCircleOutlined, ExclamationCircleOutlined,
  StopOutlined, UserOutlined, UploadOutlined,
  BarChartOutlined, AppstoreOutlined, FormOutlined,
  BellOutlined, MailOutlined, MessageOutlined, MobileOutlined
} from '@ant-design/icons';

import { DownloadOutlined } from '@ant-design/icons';

import ReactECharts from 'echarts-for-react';
import { DESIGN_TOKENS } from './config/designTokens';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// --- 接口定义 ---
export interface MyApplicationItem {
  id: string;
  projectId: string;
  projectName: string;
  policyType: string;
  status: 'draft' | 'to_submit' | 'under_review' | 'needs_revision' | 'approved' | 'rejected' | 'expired';
  submitTime?: string;
  updateTime: string;
  deadline: string;
  department: string;
  applicant: string;
  batch: string;
  thumbnail?: string;
  progress?: number;
  currentNode?: string;
  missingMaterials?: string[];
  correctionDeadline?: string;
  isOverdue?: boolean;
  subsidyAmount?: string;
  rejectionReason?: string;
}

// --- 模拟数据 ---
const mockMyApplications: MyApplicationItem[] = [
  {
    id: 'a1',
    projectId: '2',
    projectName: '2026年度高新技术企业认定',
    policyType: '高新技术企业认定',
    status: 'under_review',
    submitTime: '2026-01-15 10:30:00',
    updateTime: '2026-02-16 09:15:00',
    batch: '2026第一批',
    department: '北京市科学技术委员会',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-03-31',
    currentNode: '专家评审中',
    progress: 60,
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
  },
  {
    id: 'a2',
    projectId: '1',
    projectName: '科技型中小企业评价',
    policyType: '科技型中小企业',
    status: 'approved',
    submitTime: '2025-12-10 14:20:00',
    updateTime: '2026-01-05 16:00:00',
    batch: '2026年度',
    department: '科技部火炬中心',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-12-31',
    subsidyAmount: '资质认定',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
  },
  {
    id: 'a3',
    projectId: '3',
    projectName: '企业研发费用加计扣除',
    policyType: '税收优惠',
    status: 'needs_revision',
    submitTime: '2026-01-20 09:00:00',
    updateTime: '2026-02-18 16:45:00',
    batch: '2025年度',
    department: '北京税务局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-05-31',
    correctionDeadline: '2026-02-20',
    missingMaterials: ['营业执照', '合同', '财务报表'],
    isOverdue: true,
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png'
  },
  {
    id: 'a4',
    projectId: '4',
    projectName: '专精特新中小企业认定',
    policyType: '专精特新',
    status: 'to_submit',
    updateTime: '2026-02-08 10:00:00',
    batch: '2026年度',
    department: '北京市经济和信息化局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-04-15',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
  },
  {
    id: 'a5',
    projectId: '5',
    projectName: '首台（套）重大技术装备保险补偿',
    policyType: '资金补贴',
    status: 'draft',
    updateTime: '2026-03-01 09:30:00',
    batch: '2026年度',
    department: '工信部装备工业司',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-11-05',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
  },
  {
    id: 'a6',
    projectId: '6',
    projectName: '朝阳区文化产业发展资金',
    policyType: '专项资金',
    status: 'rejected',
    submitTime: '2025-11-15 11:20:00',
    updateTime: '2025-12-01 10:00:00',
    batch: '2025第四季度',
    department: '朝阳区文创办',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-12-31',
    rejectionReason: '申报材料不完整，缺少近三年财务审计报告',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
  },
  {
    id: 'a7',
    projectId: '7',
    projectName: '海淀区创业支持计划',
    policyType: '人才支持',
    status: 'expired',
    updateTime: '2025-09-01 10:00:00',
    batch: '2025年度',
    department: '海淀园管委会',
    applicant: '北京积分时代科技有限公司',
    deadline: '2025-10-01',
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
  },
  {
    id: 'a8',
    projectId: '8',
    projectName: '北京市知识产权试点示范单位',
    policyType: '资质认定',
    status: 'under_review',
    submitTime: '2026-02-25 14:30:00',
    updateTime: '2026-02-26 09:00:00',
    batch: '2026年度',
    department: '北京市知识产权局',
    applicant: '北京积分时代科技有限公司',
    deadline: '2026-06-30',
    currentNode: '初审通过',
    progress: 40,
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'
  }
];

// --- 状态配置 ---
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  all: { label: '全部项目', color: 'default', icon: <AppstoreOutlined /> },
  draft: { label: '我的草稿', color: 'default', icon: <FileTextOutlined /> },
  to_submit: { label: '待提交', color: 'blue', icon: <SendOutlined /> },
  under_review: { label: '审核中', color: 'processing', icon: <ClockCircleOutlined /> },
  needs_revision: { label: '需补正', color: 'warning', icon: <ExclamationCircleOutlined /> },
  approved: { label: '已通过', color: 'success', icon: <CheckCircleOutlined /> },
  rejected: { label: '已驳回', color: 'error', icon: <CloseCircleOutlined /> },
  expired: { label: '已过期', color: 'default', icon: <StopOutlined /> }
};


// --- 消息通知接口 ---
interface NotificationLog {
  id: string;
  time: string;
  title: string;
  content: string;
  channels: {
    site: 'success' | 'failed' | 'pending';
    email: 'success' | 'failed' | 'pending';
    sms: 'success' | 'failed' | 'pending';
  };
  retryCount: number;
  status: 'sent' | 'retrying' | 'failed';
}

const MyApplications: React.FC = () => {
  const navigate = useNavigate();

  // --- State ---
  const [data, setData] = useState<MyApplicationItem[]>(mockMyApplications);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 消息通知状态
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 批量操作状态
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // 筛选状态
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterDept, setFilterDept] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [sortOrder, setSortOrder] = useState<'updateTime_desc' | 'submitTime_desc' | 'deadline_asc'>('updateTime_desc');

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // --- 衍生数据 ---
  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. 状态筛选
    if (activeTab !== 'all') {
      result = result.filter(item => item.status === activeTab);
    }

    // 2. 文本搜索
    if (searchText) {
      const lowerText = searchText.toLowerCase();
      result = result.filter(item => 
        item.projectName.toLowerCase().includes(lowerText) || 
        item.policyType.toLowerCase().includes(lowerText) ||
        item.department.toLowerCase().includes(lowerText)
      );
    }

    // 3. 类型筛选
    if (filterType) {
      result = result.filter(item => item.policyType === filterType);
    }

    // 4. 部门筛选
    if (filterDept) {
      result = result.filter(item => item.department === filterDept);
    }

    // 5. 日期筛选
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day').valueOf();
      const end = dateRange[1].endOf('day').valueOf();
      result = result.filter(item => {
        const time = new Date(item.updateTime).getTime();
        return time >= start && time <= end;
      });
    }

    // 6. 排序
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'updateTime_desc':
          return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
        case 'submitTime_desc':
          return new Date(b.submitTime || 0).getTime() - new Date(a.submitTime || 0).getTime();
        case 'deadline_asc':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [data, activeTab, searchText, filterType, filterDept, dateRange, sortOrder]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // 更新总数
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, total: filteredData.length }));
  }, [filteredData.length]);

  // --- Actions ---


  // 模拟发送通知（三通道 + 重试机制）
  const sendNotification = (title: string, content: string) => {
    const newLog: NotificationLog = {
      id: Date.now().toString(),
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      title,
      content,
      channels: { site: 'pending', email: 'pending', sms: 'pending' },
      retryCount: 0,
      status: 'pending' as any
    };

    setNotifications(prev => [newLog, ...prev]);
    setUnreadCount(prev => prev + 1);

    // 模拟异步发送过程
    setTimeout(() => {
      // 随机模拟失败和重试
      const simulateChannel = (channel: string) => {
        const success = Math.random() > 0.1; // 90% 成功率
        return success ? 'success' : 'failed';
      };

      setNotifications(prev => prev.map(log => {
        if (log.id === newLog.id) {
          const site = 'success'; // 站内信通常成功
          const email = simulateChannel('email');
          const sms = simulateChannel('sms');
          
          let status: any = 'sent';
          let retry = log.retryCount;

          if (email === 'failed' || sms === 'failed') {
             if (retry < 3) {
               status = 'retrying';
               retry++;
               // 触发重试逻辑 (模拟)
               setTimeout(() => {
                 message.info(`消息推送失败，正在进行第 ${retry} 次重试...`);
               }, 1000);
             } else {
               status = 'failed';
             }
          }

          return {
            ...log,
            channels: { site, email: email as any, sms: sms as any },
            status,
            retryCount: retry
          };
        }
        return log;
      }));
    }, 1500);
  };

  // 刷新
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData([...mockMyApplications]); // 重置为 mock 数据
      setLoading(false);
      message.success('数据已刷新');
    }, 800);
  };

  // 删除单个
  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    message.success('删除成功');
  };

  // 批量删除 (带模拟失败和错误日志导出)
  const handleBatchDelete = async () => {
    // 只能删除 draft 或 to_submit 状态
    const deletableIds = data
      .filter(item => selectedRowKeys.includes(item.id) && ['draft', 'to_submit'].includes(item.status))
      .map(item => item.id);
    
    if (deletableIds.length === 0) {
      message.warning('选中的项目中没有可删除的项（仅草稿和待提交状态可删除）');
      return;
    }

    Modal.confirm({
      title: `确认删除这 ${deletableIds.length} 个项目吗？`,
      content: '删除后无法恢复，请谨慎操作。',
      okType: 'danger',
      onOk: async () => {
        setBatchProcessing(true);
        setBatchProgress(0);

        // 模拟进度条
        for (let i = 0; i <= 100; i += 10) {
          setBatchProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }

        // 模拟部分失败 (20% 概率出现失败)
        const hasFailures = Math.random() > 0.8; 
        
        if (hasFailures) {
           const successIds = deletableIds.slice(0, Math.floor(deletableIds.length * 0.8));
           const failIds = deletableIds.filter(id => !successIds.includes(id));
           
           setData(prev => prev.filter(item => !successIds.includes(item.id)));
           setBatchProcessing(false);
           
           Modal.error({
             title: '批量删除完成，但有部分失败',
             content: (
               <div>
                 <p>成功: {successIds.length} 条</p>
                 <p style={{ color: 'red' }}>失败: {failIds.length} 条</p>
                 <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={() => {
                   // 导出错误日志
                   const headers = ['项目ID', '错误原因', '时间'];
                   const content = failIds.map(id => `${id},系统繁忙/网络波动,${dayjs().format('YYYY-MM-DD HH:mm:ss')}`).join('\n');
                   const blob = new Blob([headers.join(',') + '\n' + content], { type: 'text/csv' });
                   const url = URL.createObjectURL(blob);
                   const link = document.createElement('a');
                   link.href = url;
                   link.download = 'failure_log.csv';
                   link.click();
                 }}>
                   下载失败明细
                 </Button>
               </div>
             )
           });
        } else {
           setData(prev => prev.filter(item => !deletableIds.includes(item.id)));
           setBatchProcessing(false);
           setSelectedRowKeys([]);
           message.success(`成功删除 ${deletableIds.length} 个项目`);
        }
      }
    });
  };

  // 撤回申报
  const handleWithdraw = (id: string) => {
    Modal.confirm({
      title: '确认撤回该申报申请？',
      content: '撤回后，该申请将变为"待提交"状态，您可以修改后重新提交。',
      onOk: () => {
        setData(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'to_submit', updateTime: new Date().toLocaleString() } : item
        ));
        sendNotification('申报撤回提醒', `您的项目（ID:${id}）已成功撤回，请及时修改。`);
        message.success('撤回成功，项目已变更为待提交状态');
      }
    });
  };

  // 提交申报
  const handleSubmit = (id: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'under_review', submitTime: new Date().toLocaleString(), updateTime: new Date().toLocaleString() } : item
    ));
    sendNotification('申报提交成功', `您的项目（ID:${id}）已提交审核，请耐心等待。`);
    message.success('提交成功，进入审核流程');
  };


  // 批量导出
  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的项目');
      return;
    }
    const exportData = data.filter(item => selectedRowKeys.includes(item.id));
    // 模拟导出 CSV
    const headers = ['项目名称', '政策类型', '状态', '申请时间', '更新时间'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(item => [
        item.projectName,
        item.policyType,
        statusConfig[item.status]?.label || item.status,
        item.submitTime || '-',
        item.updateTime
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `申报导出_${dayjs().format('YYYYMMDDHHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success(`成功导出 ${exportData.length} 条记录`);
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const config = statusConfig[status] || statusConfig['draft'];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // 渲染图表
  const renderChart = () => {
    const statusCounts = data.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartOption = {
      tooltip: { trigger: 'item' },
      legend: { 
        orient: 'vertical', 
        left: 'left', 
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, overflow: 'truncate', width: 80 }
      },
      series: [
        {
          name: '申报状态',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['65%', '50%'], // 向右偏移，给legend留空间
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: Object.entries(statusCounts).map(([status, count]) => ({
            value: count,
            name: statusConfig[status]?.label || status,
            itemStyle: { color: statusConfig[status]?.color === 'processing' ? '#1890ff' : undefined }
          }))
        }
      ]
    };

    return <ReactECharts option={chartOption} style={{ height: '220px', width: '100%' }} />;
  };

  // 菜单项
  const menuItems = Object.keys(statusConfig)
    .filter(key => key !== 'all')
    .map(key => ({
      key,
      label: (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>
            {statusConfig[key].icon}
            <span style={{ marginLeft: 8 }}>{statusConfig[key].label}</span>
          </span>
          <Badge 
            count={data.filter(i => i.status === key).length} 
            style={{ backgroundColor: activeTab === key ? '#fff' : '#f0f0f0', color: activeTab === key ? '#1890ff' : '#999', boxShadow: 'none' }} 
          />
        </Space>
      )
    }));

  // 渲染通知抽屉
  const renderNotificationDrawer = () => (
    <Drawer
      title={
        <Space>
          <BellOutlined />
          消息通知中心
          <Tag color="red">{unreadCount} 未读</Tag>
        </Space>
      }
      placement="right"
      onClose={() => {
        setNotificationVisible(false);
        setUnreadCount(0);
      }}
      open={notificationVisible}
      width={400}
    >
      <List
        dataSource={notifications}
        renderItem={item => (
          <List.Item>
            <Card 
              size="small" 
              style={{ width: '100%', background: item.status === 'failed' ? '#fff1f0' : '#f6ffed' }}
              title={
                <Space>
                  {item.status === 'sent' ? <CheckCircleOutlined style={{ color: 'green' }} /> : 
                   item.status === 'retrying' ? <SyncOutlined spin style={{ color: 'blue' }} /> :
                   <CloseCircleOutlined style={{ color: 'red' }} />}
                  <Text strong>{item.title}</Text>
                </Space>
              }
              extra={<Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>}
            >
              <Paragraph style={{ marginBottom: 8 }}>{item.content}</Paragraph>
              <Space split={<Divider type="vertical" />}>
                <Tooltip title="站内信">
                  <Tag icon={<MessageOutlined />} color={item.channels.site === 'success' ? 'green' : 'red'}>Site</Tag>
                </Tooltip>
                <Tooltip title="邮件通知">
                  <Tag icon={<MailOutlined />} color={item.channels.email === 'success' ? 'green' : item.channels.email === 'pending' ? 'default' : 'red'}>Email</Tag>
                </Tooltip>
                <Tooltip title="短信通知">
                  <Tag icon={<MobileOutlined />} color={item.channels.sms === 'success' ? 'green' : item.channels.sms === 'pending' ? 'default' : 'red'}>SMS</Tag>
                </Tooltip>
                {item.retryCount > 0 && <Tag color="orange">重试: {item.retryCount}</Tag>}
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </Drawer>
  );

  return (
    <div className="my-applications-container" style={{ padding: '0 12px' }}>
      {renderNotificationDrawer()}
      <Modal
        title="正在批量处理"
        open={batchProcessing}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Progress type="circle" percent={batchProgress} />
          <p style={{ marginTop: 16 }}>正在处理选中的项目，请稍候...</p>
        </div>
      </Modal>

      <Row gutter={[24, 24]}>
        {/* 左侧菜单 - 响应式处理: 小屏置顶或隐藏，中大屏侧边栏 */}
        <Col xs={24} md={6} lg={5}>
          <Card 
            bordered={false} 
            className="card-shadow"
            styles={{ body: { padding: '16px 12px' } }}
            style={{ height: '100%', minHeight: 600 }}
          >
            <div style={{ padding: '0 8px 12px', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>申报概览</Title>
            </div>
            
            {/* 嵌入图表 - 确保容器有高度 */}
            <div style={{ padding: '0 4px', marginBottom: 24, minHeight: 220 }}>
               {renderChart()}
            </div>

            <div style={{ padding: '0 8px 12px', borderBottom: '1px solid #f0f0f0', marginBottom: 12 }}>
              <Title level={5} style={{ margin: 0 }}>申报状态</Title>
            </div>
            
            <div className="status-menu" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button 
                type={activeTab === 'all' ? 'primary' : 'text'} 
                block 
                style={{ 
                  textAlign: 'left', 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0 16px'
                }}
                icon={<AppstoreOutlined />}
                onClick={() => setActiveTab('all')}
              >
                <span>全部项目</span>
                <Badge 
                  count={data.length} 
                  style={{ 
                    backgroundColor: activeTab === 'all' ? '#fff' : '#f0f0f0', 
                    color: activeTab === 'all' ? '#1890ff' : '#999',
                    boxShadow: 'none' 
                  }} 
                />
              </Button>
              {menuItems.map(item => (
                <Button
                  key={item.key}
                  type={activeTab === item.key ? 'primary' : 'text'}
                  block
                  style={{ 
                    textAlign: 'left', 
                    height: 40,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0 16px'
                  }}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        {/* 右侧列表 */}
        <Col xs={24} md={18} lg={19}>
          <Card bordered={false} className="card-shadow" style={{ minHeight: 600 }}>
            {/* 筛选区 - 响应式 Grid */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
              <Col xs={24} sm={12} md={8} lg={8}>
                <Input 
                  placeholder="搜索项目名称、政策编号、部门" 
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Select 
                  placeholder="全部类型" 
                  style={{ width: '100%' }}
                  allowClear
                  value={filterType}
                  onChange={setFilterType}
                >
                  {Array.from(new Set(data.map(a => a.policyType))).map(t => (
                    <Option key={t} value={t}>{t}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={10} lg={6}>
                <RangePicker 
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={4}>
                 <Select 
                    defaultValue="updateTime_desc"
                    style={{ width: '100%' }}
                    onChange={(val: any) => setSortOrder(val)}
                    options={[
                      { label: '按更新时间倒序', value: 'updateTime_desc' },
                      { label: '按提交时间倒序', value: 'submitTime_desc' },
                      { label: '按截止时间正序', value: 'deadline_asc' },
                    ]}
                 />
              </Col>
              <Col xs={24} sm={24} md={16} lg={2} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                 <Space>
                   <Badge count={unreadCount} dot>
                     <Button icon={<BellOutlined />} onClick={() => setNotificationVisible(true)} />
                   </Badge>
                   <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                 </Space>
              </Col>
            </Row>
            
            {/* 工具栏 */}
            <Row 
              justify="space-between" 
              align="middle" 
              style={{ 
                marginBottom: 16, 
                background: '#fafafa', 
                padding: '12px 16px', 
                borderRadius: 8,
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <Space wrap>
                <Checkbox 
                  indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedRowKeys.length === filteredData.length}
                  onChange={e => setSelectedRowKeys(e.target.checked ? filteredData.map(i => i.id) : [])}
                >
                  全选
                </Checkbox>
                <Divider type="vertical" />
                <Button 
                  danger 
                  disabled={selectedRowKeys.length === 0} 
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                >
                  批量删除
                </Button>
                <Button 
                  disabled={selectedRowKeys.length === 0}
                  icon={<ExportOutlined />}
                  onClick={handleBatchExport}
                >
                  导出选中
                </Button>
              </Space>
              <Space wrap>
                <Text type="secondary">共 {pagination.total} 条记录</Text>
                <Button type="primary" icon={<FormOutlined />} onClick={() => navigate('/application/wizard')}>
                  新建申报
                </Button>
              </Space>
            </Row>

            {/* 列表内容 */}
            <List
              loading={loading}
              itemLayout="vertical"
              dataSource={paginatedData}
              renderItem={item => (
                <Card 
                   hoverable 
                   style={{ 
                     marginBottom: 16, 
                     border: selectedRowKeys.includes(item.id) ? '1px solid #1890ff' : '1px solid #f0f0f0',
                     overflow: 'hidden' // 防止内容溢出
                   }}
                   styles={{ body: { padding: '24px' } }}
                >
                   <Row gutter={[16, 16]} align="top">
                     {/* Checkbox & Thumbnail */}
                     <Col flex="40px">
                       <Checkbox 
                         checked={selectedRowKeys.includes(item.id)}
                         onChange={e => {
                           if (e.target.checked) {
                             setSelectedRowKeys([...selectedRowKeys, item.id]);
                           } else {
                             setSelectedRowKeys(selectedRowKeys.filter(k => k !== item.id));
                           }
                         }}
                         style={{ marginTop: 4 }}
                       />
                     </Col>
                     
                     <Col flex="60px" xs={0} sm={60}>
                        <Avatar 
                          shape="square" 
                          size={48} 
                          src={item.thumbnail} 
                          icon={<FileTextOutlined />} 
                          style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                        />
                     </Col>

                     {/* Main Content */}
                     <Col flex="auto" style={{ minWidth: 0 }}> {/* minWidth 0 for text truncate */}
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                         <div style={{ flex: 1, minWidth: 200 }}>
                           <Space align="start" wrap>
                             <Title level={5} style={{ margin: 0, lineHeight: '24px' }} ellipsis={{ tooltip: item.projectName }}>
                               <a onClick={() => navigate(`/application/detail/${item.id}`, { state: { projectInfo: item } })}>
                                 {item.projectName}
                               </a>
                             </Title>
                             <Tag color="blue">{item.policyType}</Tag>
                             {item.isOverdue && <Tag color="error">已逾期</Tag>}
                           </Space>
                           <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 13 }}>
                             <Space split={<Divider type="vertical" />} wrap>
                               <span><ClockCircleOutlined /> 更新: {item.updateTime.split(' ')[0]}</span>
                               {item.submitTime && <span><SendOutlined /> 提交: {item.submitTime.split(' ')[0]}</span>}
                             </Space>
                           </div>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                           {renderStatusTag(item.status)}
                         </div>
                       </div>

                       {/* Info Grid */}
                       <div style={{ background: '#fafafa', padding: '12px', borderRadius: 6, marginBottom: 12 }}>
                         <Row gutter={[16, 8]}>
                           <Col xs={24} sm={12} md={8}>
                             <Text type="secondary" style={{ fontSize: 12 }}>截止日期</Text>
                             <div style={{ color: '#262626' }}>{item.deadline}</div>
                           </Col>
                           <Col xs={24} sm={12} md={8}>
                             <Text type="secondary" style={{ fontSize: 12 }}>主管部门</Text>
                             <div style={{ color: '#262626' }} className="text-truncate">{item.department}</div>
                           </Col>
                           <Col xs={24} sm={12} md={8}>
                             <Text type="secondary" style={{ fontSize: 12 }}>当前批次</Text>
                             <div style={{ color: '#262626' }}>{item.batch}</div>
                           </Col>
                         </Row>
                         
                         {/* Progress Bar if active */}
                         {['under_review', 'approved'].includes(item.status) && (
                           <div style={{ marginTop: 12 }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                               <Text type="secondary" style={{ fontSize: 12 }}>当前节点: {item.currentNode || '审核中'}</Text>
                               <Text type="secondary" style={{ fontSize: 12 }}>{item.progress}%</Text>
                             </div>
                             <Progress percent={item.progress} size="small" showInfo={false} strokeColor="#1890ff" />
                           </div>
                         )}

                         {/* Correction Info */}
                         {item.status === 'needs_revision' && (
                           <Alert 
                             type="warning" 
                             showIcon 
                             style={{ marginTop: 12, padding: '4px 12px' }}
                             message={
                               <Space size="large">
                                 <Text type="warning" style={{ fontSize: 12 }}>补正截止: {item.correctionDeadline}</Text>
                                 <Text type="warning" style={{ fontSize: 12 }}>需补正材料: {item.missingMaterials?.join('、')}</Text>
                               </Space>
                             }
                           />
                         )}
                       </div>

                       {/* Actions */}
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                         <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/application/detail/${item.id}`, { state: { projectInfo: item } })}>
                           查看详情
                         </Button>
                         
                         {['draft', 'to_submit', 'needs_revision'].includes(item.status) && (
                           <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate('/application/wizard')}>
                             {item.status === 'needs_revision' ? '补正材料' : '编辑'}
                           </Button>
                         )}

                         {['draft', 'to_submit'].includes(item.status) && (
                           <Popconfirm title="确认提交？" onConfirm={() => handleSubmit(item.id)}>
                             <Button type="link" size="small" icon={<SendOutlined />}>提交</Button>
                           </Popconfirm>
                         )}

                         {['under_review'].includes(item.status) && (
                           <Button type="link" size="small" icon={<UndoOutlined />} onClick={() => handleWithdraw(item.id)}>
                             撤回申报
                           </Button>
                         )}

                         {['draft', 'to_submit'].includes(item.status) && (
                           <Popconfirm title="确认删除？" onConfirm={() => handleDelete(item.id)} okText="删除" okType="danger">
                             <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
                           </Popconfirm>
                         )}
                       </div>
                     </Col>
                   </Row>
                </Card>
              )}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({ ...prev, current: page, pageSize }));
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyApplications;
