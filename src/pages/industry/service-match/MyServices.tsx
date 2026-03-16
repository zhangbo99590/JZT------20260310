import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Modal, 
  message, 
  Empty
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  UndoOutlined, 
  VerticalAlignBottomOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { THEME, COMMON_STYLES } from './styles';
import { getMyPublications, deletePublication, offlinePublication, updatePublication } from '../../../services/industryService';

const { Title } = Typography;

const MyServices: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMyPublications(activeTab === 'all' ? undefined : activeTab);
      setDataSource(data.map((item: any, index: number) => ({
        key: index + 1,
        id: item.id,
        title: item.title,
        type: item.type,
        visibility: item.visibilityScope === 'public' ? 'public' : 'match',
        status: item.status,
        updateTime: item.publishTime || item.createTime || '刚刚',
      })));
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePublication(id);
          message.success('删除成功');
          fetchData();
        } catch (e) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleOffline = (id: string) => {
    Modal.confirm({
      title: '确认下架',
      content: '下架后信息将不再展示，确定要下架吗？',
      onOk: async () => {
        try {
          await offlinePublication(id, 'user_action');
          message.success('已下架');
          fetchData();
        } catch (e) {
          message.error('下架失败');
        }
      }
    });
  };

  const handleWithdraw = (id: string) => {
    Modal.confirm({
      title: '确认撤回',
      content: '撤回后将回到草稿状态，确定要撤回吗？',
      onOk: async () => {
        try {
          await updatePublication(id, { status: 'draft' });
          message.success('已撤回');
          fetchData();
        } catch (e) {
          message.error('撤回失败');
        }
      }
    });
  };

  const handleRepublish = (id: string) => {
    Modal.confirm({
      title: '确认重新发布',
      content: '重新发布后将直接上线，确定要重新发布吗？',
      onOk: async () => {
        try {
          await updatePublication(id, { status: 'published', publishTime: new Date().toLocaleString() });
          message.success('发布成功');
          fetchData();
        } catch (e) {
          message.error('发布失败');
        }
      }
    });
  };

  const getTypeTag = (type: string) => {
    const map: any = {
      supply: <Tag color="blue">业务供给</Tag>,
      demand: <Tag color="orange">采购需求</Tag>
    };
    return map[type] || <Tag>{type}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const map: any = {
      draft: <Tag>草稿</Tag>,
      auditing: <Tag color="processing">审核中</Tag>,
      published: <Tag color="success">已发布</Tag>,
      active: <Tag color="success">已发布</Tag>, // 兼容 active 状态
      offline: <Tag color="default">已下架</Tag>
    };
    return map[status] || <Tag>{status}</Tag>;
  };

  const renderActions = (record: any) => {
    const size = "small";
    const style = { fontSize: '12px', padding: '0 4px' };
    
    switch (record.status) {
      case 'draft':
        return (
          <Space size={4}>
            <Button type="link" size={size} style={style} icon={<EditOutlined />} onClick={() => navigate(`/industry/service-match/publish?id=${record.id}`)}>编辑</Button>
            <Button type="link" danger size={size} style={style} icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
          </Space>
        );
      case 'auditing':
        return (
          <Space size={4}>
            <Button type="link" size={size} style={style} icon={<EyeOutlined />} onClick={() => navigate(`/industry/service-match/detail/${record.id}`)}>查看</Button>
            <Button type="link" size={size} style={{...style, color: THEME.textHint}} icon={<UndoOutlined />} onClick={() => handleWithdraw(record.id)}>撤回</Button>
          </Space>
        );
      case 'published':
      case 'active': // 兼容 active 状态
        return (
          <Space size={4}>
            <Button type="link" size={size} style={style} icon={<EyeOutlined />} onClick={() => navigate(`/industry/service-match/detail/${record.id}`)}>查看</Button>
            <Button type="link" size={size} style={style} icon={<EditOutlined />} onClick={() => navigate(`/industry/service-match/publish?id=${record.id}`)}>修改</Button>
            <Button type="link" danger size={size} style={style} icon={<VerticalAlignBottomOutlined />} onClick={() => handleOffline(record.id)}>下架</Button>
          </Space>
        );
      case 'offline':
        return (
          <Space size={4}>
            <Button type="link" size={size} style={style} icon={<EyeOutlined />} onClick={() => navigate(`/industry/service-match/detail/${record.id}`)}>查看</Button>
            <Button type="link" size={size} style={style} icon={<ReloadOutlined />} onClick={() => handleRepublish(record.id)}>重新发布</Button>
          </Space>
        );
      default:
        return null;
    }
  };

  const columns = [
    { title: '序号', dataIndex: 'key', width: 60, align: 'center' as const },
    { 
      title: '信息标题', 
      dataIndex: 'title',
      render: (text: string) => <span style={{ fontWeight: 500, color: THEME.textTitle }}>{text}</span>
    },
    { title: '类型', dataIndex: 'type', width: 80, render: getTypeTag },
    { 
      title: '展示范围', 
      dataIndex: 'visibility', 
      width: 120,
      render: (v: string) => v === 'match' ? '仅匹配可见' : '公开' 
    },
    { title: '状态', dataIndex: 'status', width: 100, render: getStatusTag },
    { title: '更新时间', dataIndex: 'updateTime', width: 160, style: { color: THEME.textHint, fontSize: '12px' } },
    { title: '操作', key: 'action', width: 180, render: (_: any, record: any) => renderActions(record) },
  ];

  const filteredData = activeTab === 'all' 
    ? dataSource 
    : dataSource.filter(item => item.status === activeTab);

  return (
    <div style={COMMON_STYLES.pageContainer}>
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Title level={4} style={{ margin: 0, ...COMMON_STYLES.title }}>我的信息</Title>
        
        <div style={COMMON_STYLES.card}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              { label: '全部', key: 'all' },
              { label: '草稿箱', key: 'draft' },
              { label: '审核中', key: 'auditing' },
              { label: '已发布', key: 'published' },
              { label: '已下架', key: 'offline' },
            ]}
          />
          
          <Table 
            dataSource={filteredData} 
            columns={columns} 
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty description="暂无相关信息" /> }}
          />
        </div>
      </Space>
    </div>
  );
};

export default MyServices;
