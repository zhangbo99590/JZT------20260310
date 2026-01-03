import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Tag,
  Space,
  List,
  Pagination,
  Empty,
  message,
  Layout,
  Divider,
  Rate,
  Tree,
  Badge,
  Breadcrumb
} from 'antd';
import {
  SearchOutlined,
  RightCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FireOutlined,
  RightOutlined,
  GlobalOutlined,
  FolderOutlined,
  FileOutlined,
  DownOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Publication, PublicationFilter } from '../../types/industry';
import { getPublications } from '../../services/industryService';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;


// 左侧导航树数据 - 移到组件外部避免重复创建
const treeData = [
  {
    title: '商机分类',
    key: 'categories',
    icon: <FolderOutlined />,
    children: [
      {
        title: '产品 (68)',
        key: 'products',
        icon: <FileOutlined />,
        children: [
          { title: '产品供给 (42)', key: 'product-supply' },
          { title: '产品采购 (26)', key: 'product-purchase' },
        ],
      },
      {
        title: '服务 (32)',
        key: 'services',
        icon: <FileOutlined />,
        children: [
          { title: '服务供给 (18)', key: 'service-supply' },
          { title: '服务采购 (14)', key: 'service-purchase' },
        ],
      },
      {
        title: '技术 (28)',
        key: 'technology',
        icon: <FileOutlined />,
        children: [
          { title: '技术转让 (15)', key: 'tech-transfer' },
          { title: '技术合作 (13)', key: 'tech-cooperation' },
        ],
      },
      {
        title: '产能 (22)',
        key: 'capacity',
        icon: <FileOutlined />,
        children: [
          { title: '产能共享 (12)', key: 'capacity-share' },
          { title: '代工服务 (10)', key: 'oem-service' },
        ],
      },
    ],
  },
  {
    title: '行业分类',
    key: 'industries',
    icon: <FolderOutlined />,
    children: [
      { title: '新能源 (45)', key: 'new-energy' },
      { title: '电动车制造 (38)', key: 'ev-manufacturing' },
      { title: '电子电气 (32)', key: 'electronics' },
      { title: '金属加工 (18)', key: 'metal-processing' },
      { title: '橡胶制品 (12)', key: 'rubber-products' },
      { title: '智能制造 (8)', key: 'smart-manufacturing' },
    ],
  },
  {
    title: '地区分类',
    key: 'regions',
    icon: <FolderOutlined />,
    children: [
      { title: '华东地区 (52)', key: 'east-china' },
      { title: '华北地区 (28)', key: 'north-china' },
      { title: '华南地区 (35)', key: 'south-china' },
      { title: '华中地区 (22)', key: 'central-china' },
      { title: '西南地区 (13)', key: 'southwest-china' },
    ],
  },
];

const SupplyDemandHall: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filter, setFilter] = useState<PublicationFilter>({});

  const loadPublications = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilter = { ...filter };
      const data = await getPublications(currentFilter);
      setPublications(data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleSearch = useCallback((value: string) => {
    setFilter(prev => ({ ...prev, keyword: value }));
  }, []);

  // 计算剩余天数 - 使用useCallback优化
  const getDaysLeft = useCallback((expiryDate: string) => {
    const days = dayjs(expiryDate).diff(dayjs(), 'day');
    return days > 0 ? days : 0;
  }, []);

  // 渲染列表项
  const renderListItem = (item: Publication) => {
    const daysLeft = getDaysLeft(item.expiryDate);
    const isUrgent = daysLeft <= 5;

    return (
      <List.Item
        key={item.id}
        style={{
          padding: '12px 20px',
          backgroundColor: '#fff',
          border: 'none',
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
        }}
        onClick={() => navigate(`/industry-hall/supply-demand/detail/${item.id}`)}
      >
        <Row style={{ width: '100%' }} align="top">
          {/* 左侧主要信息 */}
          <Col flex="auto">
            <div>
              {/* 标题行 */}
              <div style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff', marginRight: 16 }}>
                  {item.title}
                </Text>
              </div>
              
              {/* 标签行 */}
              <div style={{ marginBottom: 4 }}>
                <Space size={12}>
                  <Tag color="blue" style={{ margin: 0, fontSize: 12 }}>1批</Tag>
                  <span style={{ color: '#1890ff', fontSize: 13 }}>
                    卖产品
                  </span>
                  <span style={{ color: '#52c41a', fontSize: 13 }}>
                    最小起订量 {item.details?.minOrderQuantity || 100}{item.details?.quantityUnit || '件'}
                  </span>
                  <span style={{ color: '#fa8c16', fontSize: 13 }}>
                    现货 {item.details?.stockQuantity || 5000}{item.details?.quantityUnit || '件'}
                  </span>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    {dayjs(item.expiryDate).format('YYYY年MM月DD日')}截止
                  </span>
                </Space>
              </div>

              {/* 评级行 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tag color="gold" style={{ margin: 0, fontSize: 12 }}>
                  {item.rating && item.rating >= 4.5 ? '金牌商机' : '银牌商机'}
                </Tag>
                <Rate 
                  disabled 
                  defaultValue={item.rating || 4} 
                  style={{ fontSize: 12, color: '#fa8c16', marginLeft: 8 }} 
                />
              </div>
            </div>
          </Col>

          {/* 右侧辅助信息 */}
          <Col flex="260px" style={{ textAlign: 'right', paddingLeft: 16 }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: '#333', marginBottom: 2 }}>
                  {item.publisherName}
                </div>
                <div style={{ color: '#999', fontSize: 12 }}>
                  发布于 {dayjs(item.publishTime).format('YYYY年MM月DD日')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  距结束剩余{daysLeft}天
                </Text>
                <RightCircleOutlined style={{ fontSize: 16, color: '#ccc' }} />
              </div>
            </div>
          </Col>
        </Row>
      </List.Item>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Layout style={{ background: '#f0f2f5' }}>
        {/* 面包屑导航 */}
        <div style={{ padding: '16px 24px 0' }}>
          <Breadcrumb
            style={{ marginBottom: '16px' }}
            items={[
              {
                title: '产业大厅',
              },
              {
                title: '商机大厅',
              },
            ]}
          />
        </div>
        {/* 顶部搜索区域 */}
        <div style={{ 
          background: '#fff', 
          padding: '16px 24px',
          borderBottom: '1px solid #e8e8e8'
        }}>
          {/* 搜索栏 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col flex="auto">
              <Space.Compact style={{ width: '100%' }}>
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">产品类别</Option>
                  <Option value="supply">供给</Option>
                  <Option value="demand">需求</Option>
                </Select>
                <Input.Search
                  placeholder="搜索产品名称、公司名称"
                  style={{ flex: 1 }}
                  onSearch={handleSearch}
                  allowClear
                />
              </Space.Compact>
            </Col>
          </Row>


          {/* 筛选条件 */}
          <Row gutter={16}>
            <Col span={3}>
              <Select placeholder="商机" style={{ width: '100%' }} size="small">
                <Option value="supply">供给</Option>
                <Option value="demand">需求</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select placeholder="需求分类" style={{ width: '100%' }} size="small">
                <Option value="purchase">采购</Option>
                <Option value="cooperation">合作</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select placeholder="发布日期" style={{ width: '100%' }} size="small">
                <Option value="3">最近3天</Option>
                <Option value="7">最近7天</Option>
                <Option value="30">最近30天</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select placeholder="截止日期" style={{ width: '100%' }} size="small">
                <Option value="7">7天内截止</Option>
                <Option value="30">30天内截止</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select placeholder="采购预算" style={{ width: '100%' }} size="small">
                <Option value="10">10万以下</Option>
                <Option value="50">10-50万</Option>
                <Option value="100">50-100万</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select placeholder="买机质量" style={{ width: '100%' }} size="small">
                <Option value="gold">金牌</Option>
                <Option value="silver">银牌</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Content style={{ margin: 0 }}>
          <Row style={{ height: '100%' }}>
            {/* 主要内容区域 */}
            <Col flex="auto" style={{ background: '#fff', minHeight: 'calc(100vh - 140px)' }}>
              <List
                loading={loading}
                dataSource={publications}
                renderItem={renderListItem}
                locale={{ emptyText: <Empty description="暂无相关商机" /> }}
                split={false}
                style={{ padding: 0 }}
              />
              <div style={{ textAlign: 'center', padding: '16px', borderTop: '1px solid #f0f0f0' }}>
                <Pagination 
                  defaultCurrent={1} 
                  total={150} 
                  pageSize={15}
                  showSizeChanger 
                  showQuickJumper 
                  size="small"
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
                />
              </div>
            </Col>

            {/* 右侧服务栏 */}
            <Col flex="320px" style={{ background: '#f0f2f5', padding: '16px' }}>
              {/* 立即发布按钮 */}
              <Card 
                size="small" 
                bodyStyle={{ padding: '16px' }} 
                style={{ marginBottom: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                    免费发布，立即找到合作伙伴
                  </div>
                  <Button 
                    type="primary" 
                    size="large"
                    block
                    onClick={() => navigate('/industry-hall/new-publication')}
                    style={{ 
                      height: 44,
                      fontSize: 16,
                      fontWeight: 'bold',
                      background: '#fff',
                      color: '#667eea',
                      border: 'none'
                    }}
                  >
                    立即发布
                  </Button>
                  <div style={{ fontSize: 12, marginTop: 8, opacity: 0.9 }}>
                    发布您的供需信息，快速对接优质资源
                  </div>
                </div>
              </Card>

              {/* 推广图 */}
              <Card size="small" bodyStyle={{ padding: 0 }} style={{ marginBottom: 16 }}>
                <div style={{ 
                  height: 120, 
                  background: 'linear-gradient(135deg, #4096ff 0%, #1677ff 100%)',
                  padding: 16,
                  color: '#fff',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>智采中国</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>全国产业链区域化路演活动</div>
                  <Button 
                    ghost 
                    size="small" 
                    style={{ position: 'absolute', bottom: 12, right: 12 }}
                  >
                    查看详情
                  </Button>
                </div>
              </Card>

              {/* 平台统计 */}
              <Card size="small" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 12 }}>平台数据</Title>
                <Row gutter={8}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>1,248</div>
                      <div style={{ fontSize: 11, color: '#999' }}>今日新增</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>85.6%</div>
                      <div style={{ fontSize: 11, color: '#999' }}>对接成功率</div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={8} style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fa8c16' }}>12,567</div>
                      <div style={{ fontSize: 11, color: '#999' }}>活跃企业</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#722ed1' }}>¥2.8亿</div>
                      <div style={{ fontSize: 11, color: '#999' }}>月成交额</div>
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* 热门标签 */}
              <Card size="small" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 12 }}>热门标签</Title>
                <div style={{ lineHeight: '24px' }}>
                  <Tag color="blue" style={{ margin: '2px' }}>锂电池</Tag>
                  <Tag color="green" style={{ margin: '2px' }}>充电桩</Tag>
                  <Tag color="orange" style={{ margin: '2px' }}>电机控制</Tag>
                  <Tag color="red" style={{ margin: '2px' }}>BMS系统</Tag>
                  <Tag color="purple" style={{ margin: '2px' }}>智能防盗</Tag>
                  <Tag color="cyan" style={{ margin: '2px' }}>轮毂电机</Tag>
                  <Tag color="geekblue" style={{ margin: '2px' }}>车架焊接</Tag>
                  <Tag color="magenta" style={{ margin: '2px' }}>技术转让</Tag>
                  <Tag color="volcano" style={{ margin: '2px' }}>代工服务</Tag>
                  <Tag color="gold" style={{ margin: '2px' }}>整车测试</Tag>
                </div>
              </Card>

              {/* 热门服务 */}
              <Card size="small">
                <Title level={5} style={{ marginBottom: 12 }}>增值服务</Title>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div style={{ fontSize: 12 }}>
                    <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                    <span style={{ fontWeight: 'bold' }}>热门服务：</span>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: '20px' }}>
                    <a href="#" style={{ display: 'block', marginBottom: 4 }}>• 企业认证服务</a>
                    <a href="#" style={{ display: 'block', marginBottom: 4 }}>• 商机推广服务</a>
                    <a href="#" style={{ display: 'block', marginBottom: 4 }}>• 供应链金融</a>
                    <a href="#" style={{ display: 'block', marginBottom: 4 }}>• 技术对接服务</a>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>客服热线</div>
                    <div style={{ color: '#1890ff', fontSize: 14, fontWeight: 'bold' }}>400-888-1234</div>
                    <div style={{ color: '#999', fontSize: 11 }}>周一至周日 9:00-18:00</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    在线客服：24小时服务
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SupplyDemandHall;
