/**
 * 我的收藏页面 - 跨模块收藏内容汇总
 * 功能：展示用户在各模块的收藏内容，支持批量操作和数据可视化
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Tag,
  Empty,
  Typography,
  Divider,
  Tabs,
  List,
  Avatar,
  Tooltip,
  message,
  Popconfirm,
  Checkbox,
  Select,
  DatePicker,
  Statistic,
  Progress,
  Modal,
  Table,
  Alert,
  Breadcrumb,
} from 'antd';
import PageWrapper from '../../components/PageWrapper';
import {
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  FileTextOutlined,
  BankOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  TagOutlined,
  ExportOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  PieChartOutlined,
  BarChartOutlined,
  DollarOutlined,
  SendOutlined,
  ClearOutlined,
  DownloadOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 收藏项目类型定义
interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  type: 'policy' | 'opportunity' | 'financing';
  category: string;
  addedDate: string;
  sourceModule: string;
  url: string;
  tags?: string[];
  status?: string;
  amount?: number;
}

// 统计数据类型
interface FavoriteStats {
  total: number;
  policy: number;
  opportunity: number;
  financing: number;
  thisMonth: number;
  lastMonth: number;
}

const MyFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [stats, setStats] = useState<FavoriteStats>({
    total: 0,
    policy: 0,
    opportunity: 0,
    financing: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  // 从localStorage加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('my-favorites') || '[]');
      setFavorites(storedFavorites);
      
      // 计算统计数据
      const newStats: FavoriteStats = {
        total: storedFavorites.length,
        policy: storedFavorites.filter((item: FavoriteItem) => item.type === 'policy').length,
        opportunity: storedFavorites.filter((item: FavoriteItem) => item.type === 'opportunity').length,
        financing: storedFavorites.filter((item: FavoriteItem) => item.type === 'financing').length,
        thisMonth: storedFavorites.filter((item: FavoriteItem) => 
          new Date(item.addedDate).getMonth() === new Date().getMonth()
        ).length,
        lastMonth: storedFavorites.filter((item: FavoriteItem) => 
          new Date(item.addedDate).getMonth() === new Date().getMonth() - 1
        ).length,
      };
      setStats(newStats);
    };

    loadFavorites();

    // 监听localStorage变化，实现实时同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'my-favorites') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 定期检查localStorage变化（用于同一页面内的更新）
    const interval = setInterval(loadFavorites, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 类型配置
  const typeConfig = {
    policy: { 
      label: '政策', 
      color: 'blue', 
      icon: <BookOutlined />,
      bgColor: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    opportunity: { 
      label: '商机', 
      color: 'green', 
      icon: <SendOutlined />,
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    financing: { 
      label: '融资', 
      color: 'orange', 
      icon: <DollarOutlined />,
      bgColor: '#fff7e6',
      borderColor: '#ffd591'
    },
  };

  // 筛选收藏项目
  const filteredFavorites = favorites
    .filter(item => {
      const matchesSearch = !searchKeyword || 
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase())));
      
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      
      const matchesDate = !dateRange || (
        new Date(item.addedDate) >= new Date(dateRange[0]) &&
        new Date(item.addedDate) <= new Date(dateRange[1])
      );
      
      return matchesSearch && matchesTab && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.addedDate).getTime();
      const dateB = new Date(b.addedDate).getTime();
      return dateB - dateA; // Always sort by newest first
    });

  // 批量选择处理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredFavorites.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // 批量删除收藏
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) {
      message.warning('请选择要删除的收藏项');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedItems.length} 项收藏吗？`,
      onOk: () => {
        const updatedFavorites = favorites.filter(item => !selectedItems.includes(item.id));
        setFavorites(updatedFavorites);
        localStorage.setItem('my-favorites', JSON.stringify(updatedFavorites));
        setSelectedItems([]);
        message.success(`已删除 ${selectedItems.length} 项收藏`);
      },
    });
  };

  // 批量导出
  const handleBatchExport = () => {
    if (selectedItems.length === 0) {
      message.warning('请选择要导出的收藏项');
      return;
    }
    setExportModalVisible(true);
  };

  // 确认导出
  const confirmExport = (format: 'excel' | 'pdf') => {
    const selectedFavorites = favorites.filter(item => selectedItems.includes(item.id));
    
    // 模拟导出过程
    message.loading('正在导出...', 2);
    setTimeout(() => {
      message.success(`已导出 ${selectedFavorites.length} 项收藏为 ${format.toUpperCase()} 格式`);
      setExportModalVisible(false);
      setSelectedItems([]);
    }, 2000);
  };

  // 删除单个收藏
  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('my-favorites', JSON.stringify(updatedFavorites));
    message.success('已取消收藏');
  };

  // 查看详情
  const handleViewDetail = (item: FavoriteItem) => {
    // 直接跳转到政策中心
    if (item.type === 'policy') {
      navigate('/policy-center');
    } else {
      navigate(item.url);
    }
  };

  // 获取统计图表数据
  const getChartData = () => {
    return [
      { type: '政策', count: stats.policy, color: '#1890ff' },
      { type: '商机', count: stats.opportunity, color: '#52c41a' },
      { type: '融资', count: stats.financing, color: '#fa8c16' },
    ];
  };

  // 渲染收藏项目
  const renderFavoriteItem = (item: FavoriteItem) => {
    const config = typeConfig[item.type];
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <List.Item
        key={item.id}
        style={{
          backgroundColor: isSelected ? '#f0f8ff' : 'white',
          border: isSelected ? '2px solid #1890ff' : '1px solid #f0f0f0',
          borderRadius: 8,
          marginBottom: 12,
          padding: '16px 20px',
        }}
        actions={[
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
          />,
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(item)}
            />
          </Tooltip>,
          <Popconfirm
            title="确定要取消收藏吗？"
            onConfirm={() => handleRemoveFavorite(item.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="取消收藏">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                danger
              />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar 
              icon={config.icon} 
              style={{ 
                backgroundColor: config.color === 'blue' ? '#1890ff' : 
                                 config.color === 'green' ? '#52c41a' : '#fa8c16',
                width: 48,
                height: 48,
                fontSize: 20
              }}
            />
          }
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span 
                style={{ 
                  fontWeight: 600, 
                  fontSize: 16, 
                  color: '#1890ff', 
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onClick={() => handleViewDetail(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {item.title}
              </span>
              <Tag color={config.color} style={{ margin: 0, fontWeight: 500 }}>
                {config.label}
              </Tag>
              <Tag color="default" style={{ margin: 0 }}>
                {item.sourceModule}
              </Tag>
            </div>
          }
          description={
            <div>
              <Paragraph 
                ellipsis={{ rows: 2 }} 
                style={{ margin: '0 0 12px 0', color: '#666', fontSize: 14, lineHeight: 1.6 }}
              >
                {item.description}
              </Paragraph>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
                <Space size={6}>
                  <CalendarOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    收藏于 {item.addedDate}
                  </Text>
                </Space>
                <Space size={6}>
                  <TagOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {item.category}
                  </Text>
                </Space>
                {item.amount && (
                  <Space size={6}>
                    <DollarOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {item.amount >= 100000000 ? `${(item.amount / 100000000).toFixed(1)}亿元` :
                       item.amount >= 10000 ? `${(item.amount / 10000).toFixed(0)}万元` : 
                       `${item.amount}元`}
                    </Text>
                  </Space>
                )}
              </div>
              
              {item.tags && (
                <div style={{ marginTop: 8 }}>
                  {item.tags.map(tag => (
                    <Tag key={tag} style={{ margin: '2px 6px 2px 0', fontSize: 12 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  };


  return (
    <PageWrapper module="system">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '系统管理',
            href: '/system',
          },
          {
            title: '我的收藏',
          },
        ]}
      />
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          我的收藏
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
          跨模块收藏内容汇总，支持批量管理和数据分析
        </Paragraph>
      </div>


      <Card>
        {/* 搜索和筛选栏 */}
        <div style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索收藏内容、标签或来源模块..."
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ width: '100%' }}
                enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
              />
            </Col>
            <Col>
              <Space>
                <RangePicker
                  placeholder={['开始日期', '结束日期']}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange([dates[0]!.format('YYYY-MM-DD'), dates[1]!.format('YYYY-MM-DD')]);
                    } else {
                      setDateRange(null);
                    }
                  }}
                />
              </Space>
            </Col>
          </Row>
        </div>

        {/* 批量操作栏 */}
        {selectedItems.length > 0 && (
          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>已选择 {selectedItems.length} 项</span>
                <Space>
                  <Button size="small" onClick={() => setSelectedItems([])}>
                    取消选择
                  </Button>
                  <Button 
                    size="small" 
                    icon={<ExportOutlined />} 
                    onClick={handleBatchExport}
                  >
                    批量导出
                  </Button>
                  <Button 
                    size="small" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={handleBatchDelete}
                  >
                    批量删除
                  </Button>
                </Space>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        <Divider />

        {/* 分类标签页 */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginTop: 16 }}
          tabBarExtraContent={
            <Space>
              <Checkbox
                indeterminate={selectedItems.length > 0 && selectedItems.length < filteredFavorites.length}
                checked={selectedItems.length === filteredFavorites.length && filteredFavorites.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
              <Button size="small" icon={<FilterOutlined />}>
                筛选
              </Button>
            </Space>
          }
        >
          <TabPane 
            tab="全部"
            key="all" 
          />
          <TabPane 
            tab={
              <Space>
                <BookOutlined />
                政策
              </Space>
            } 
            key="policy" 
          />
          <TabPane 
            tab={
              <Space>
                <SendOutlined />
                商机
              </Space>
            } 
            key="opportunity" 
          />
          <TabPane 
            tab={
              <Space>
                <DollarOutlined />
                融资
              </Space>
            } 
            key="financing" 
          />
        </Tabs>

        {/* 收藏列表 */}
        <div style={{ marginTop: 16 }}>
          {filteredFavorites.length > 0 ? (
            <List
              dataSource={filteredFavorites}
              renderItem={renderFavoriteItem}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 项收藏`,
                style: { marginTop: 24 }
              }}
            />
          ) : (
            <Empty 
              description={
                searchKeyword || dateRange ? "未找到匹配的收藏内容" : "暂无收藏内容"
              }
              style={{ padding: '60px 0' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </Card>

      {/* 导出确认弹窗 */}
      <Modal
        title="导出收藏列表"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        width={480}
      >
        <div style={{ padding: '20px 0' }}>
          <Paragraph>
            将导出选中的 <Text strong>{selectedItems.length}</Text> 项收藏内容
          </Paragraph>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Button
              block
              size="large"
              icon={<DownloadOutlined />}
              onClick={() => confirmExport('excel')}
              style={{ height: 48 }}
            >
              导出为 Excel 格式
            </Button>
            <Button
              block
              size="large"
              icon={<DownloadOutlined />}
              onClick={() => confirmExport('pdf')}
              style={{ height: 48 }}
            >
              导出为 PDF 格式
            </Button>
          </Space>
        </div>
      </Modal>

    </PageWrapper>
  );
};

export default MyFavorites;
