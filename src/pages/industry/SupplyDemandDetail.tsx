import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Divider,
  Rate,
  Badge,
  Descriptions,
  Timeline,
  Avatar,
  Tooltip,
  Modal,
  message,
  Breadcrumb,
  Statistic,
  Progress,
  Image,
  List
} from 'antd';
import {
  ArrowLeftOutlined,
  StarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SafeECharts from '../../components/SafeECharts';
import dayjs from 'dayjs';
import type { Publication } from '../../types/industry';
import { getPublicationById } from '../../services/industryService';
import ConnectionApplication from './ConnectionApplication';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const SupplyDemandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      loadPublicationDetail(id);
      checkIfFavorited(id);
    }
  }, [id]);

  // 检查是否已收藏
  const checkIfFavorited = (publicationId: string) => {
    const favorites = JSON.parse(localStorage.getItem('my-favorites') || '[]');
    const isFav = favorites.some((fav: any) => fav.id === publicationId && fav.type === 'opportunity');
    setIsFavorited(isFav);
  };

  // 切换收藏状态
  const handleToggleFavorite = () => {
    if (!publication) return;

    const favorites = JSON.parse(localStorage.getItem('my-favorites') || '[]');
    const favoriteItem = {
      id: publication.id,
      title: publication.title,
      description: publication.description,
      type: 'opportunity',
      category: publication.subType,
      addedDate: new Date().toISOString(),
      sourceModule: '产业大厅',
      url: `/industry-hall/supply-demand/detail/${publication.id}`,
      tags: [publication.type === 'supply' ? '供给' : '需求', publication.subType],
      status: publication.status,
    };

    if (isFavorited) {
      // 取消收藏
      const newFavorites = favorites.filter((fav: any) => !(fav.id === publication.id && fav.type === 'opportunity'));
      localStorage.setItem('my-favorites', JSON.stringify(newFavorites));
      setIsFavorited(false);
      message.success('已取消收藏');
    } else {
      // 添加收藏
      favorites.push(favoriteItem);
      localStorage.setItem('my-favorites', JSON.stringify(favorites));
      setIsFavorited(true);
      message.success('收藏成功');
    }
  };

  const loadPublicationDetail = async (publicationId: string) => {
    setLoading(true);
    try {
      // 从服务获取实际数据，如果没有则使用模拟数据
      let detail = await getPublicationById(publicationId);
      
      if (!detail) {
        // 模拟供给方详情数据
        detail = {
          id: 'pub-001',
          title: 'Z41H-16C铸钢WCB明杆硬密封楔形法兰式手动闸阀',
          type: 'supply',
          subType: 'product',
          description: `我公司专业生产各类工业阀门，现供应Z41H-16C铸钢WCB明杆硬密封楔形法兰式手动闸阀。

产品特点：
1. 材质优良：采用优质WCB铸钢材质，耐腐蚀性强
2. 密封可靠：硬密封设计，密封性能优异
3. 操作便捷：明杆设计，开关状态一目了然
4. 规格齐全：DN15-DN600多种规格可选
5. 质量保证：通过ISO9001质量体系认证

我们拥有完善的生产线和质检体系，产品广泛应用于石油、化工、电力、冶金等行业。`,
          status: 'active',
          publisherId: 'company-001',
          publisherName: '北京异想天开有限责任公司',
          publisherAvatar: '',
          publishTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          expiryDate: dayjs().add(25, 'day').format('YYYY-MM-DD'),
          validityDays: 30,
          visibilityScope: 'public',
          viewCount: 1256,
          connectionCount: 28,
          productImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600',
          attachments: [
            {
              id: 'att-001',
              name: '产品规格书.pdf',
              size: 2048000,
              type: 'application/pdf',
              url: '/files/spec-001.pdf',
              uploadTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              id: 'att-002',
              name: '质量认证证书.pdf',
              size: 1024000,
              type: 'application/pdf',
              url: '/files/quality-001.pdf',
              uploadTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
            }
          ],
          tags: ['闸阀', '铸钢', '手动', 'WCB', '法兰式'],
          region: '上海市',
          industry: '智能制造',
          rating: 4.5,
          isCertified: true,
          successRate: 88,
          budget: 199,
          budgetUnit: '元',
          details: {
            productName: 'Z41H-16C铸钢闸阀',
            specifications: 'DN15-DN600，PN16',
            capacity: 5000,
            capacityUnit: '台/月',
            priceRange: { min: 199, max: 298 },
            deliveryCycle: 15,
            material: 'WCB铸钢',
            sealingType: '硬密封',
            connectionType: '法兰连接',
            workingPressure: '1.6MPa',
            workingTemperature: '-29°C ~ 425°C',
            applicableMedia: '水、蒸汽、油品等'
          }
        } as any;
      }

      setPublication(detail);
    } catch (error) {
      message.error('加载详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取评星说明
  const getRatingDescription = (rating: number, isCertified: boolean, successRate: number) => {
    const descriptions = [];
    if (isCertified) descriptions.push('企业已认证');
    if (rating >= 4) descriptions.push('产品优质');
    if (successRate >= 80) descriptions.push('交付率高');
    return descriptions.join(' + ');
  };

  // 获取剩余天数
  const getDaysLeft = (expiryDate: string) => {
    return dayjs(expiryDate).diff(dayjs(), 'day');
  };

  // 企业信誉度图表配置
  const getReputationChartOption = () => {
    return {
      title: {
        text: '企业信誉度',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: [
            { value: 88, name: '对接成功率', itemStyle: { color: '#52c41a' } },
            { value: 12, name: '其他', itemStyle: { color: '#f0f0f0' } }
          ],
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 产品趋势图表配置
  const getDemandTrendOption = () => {
    return {
      title: {
        text: '同类产品趋势',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(24, 144, 255, 0.3)'
              }, {
                offset: 1, color: 'rgba(24, 144, 255, 0.1)'
              }]
            }
          }
        }
      ]
    };
  };

  if (!publication) {
    return <div>加载中...</div>;
  }

  const daysLeft = getDaysLeft(publication.expiryDate);
  const isUrgent = daysLeft <= 5;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>

        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          返回列表
        </Button>

        <Row gutter={24}>
          {/* 左侧主要内容 */}
          <Col span={16}>
            {/* 头部信息卡片 */}
            <Card style={{ marginBottom: 24 }}>
              <Row align="middle" justify="space-between">
                <Col flex="auto">
                  <Space direction="vertical" size={12}>
                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                      {publication.title}
                    </Title>
                    <Space size={16}>
                      <Space>
                        <Rate disabled value={publication.rating} style={{ fontSize: 16 }} />
                        <Text type="secondary">
                          {publication.rating} 星：{getRatingDescription(publication.rating || 4, publication.isCertified || false, publication.successRate || 88)}
                        </Text>
                      </Space>
                      {publication.isCertified && (
                        <Badge 
                          count={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />} 
                          title="企业已认证"
                        >
                          <Tag color="success">已认证</Tag>
                        </Badge>
                      )}
                    </Space>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button 
                      size="large"
                      icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
                      onClick={handleToggleFavorite}
                      style={{ color: isFavorited ? '#ff4d4f' : undefined }}
                    >
                      {isFavorited ? '已收藏' : '收藏'}
                    </Button>
                    <Button type="primary" size="large" onClick={() => setContactModalVisible(true)}>
                      立即对接
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 产品图片展示 */}
            {publication.productImage && (
              <Card style={{ marginBottom: 24 }}>
                <Image
                  src={publication.productImage}
                  alt={publication.title}
                  style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
                  preview={true}
                />
              </Card>
            )}

            {/* 基础信息区 */}
            <Card title="基础信息" style={{ marginBottom: 24 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="发布企业">
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Text strong>{publication.publisherName.replace(/(.{2})(.+)(.{3})/, '$1***$3')}</Text>
                    {publication.isCertified && <SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="发布时间">
                  <Space>
                    <CalendarOutlined />
                    {dayjs(publication.publishTime).format('YYYY年MM月DD日')}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="截止日期">
                  <Space>
                    <ClockCircleOutlined style={{ color: isUrgent ? '#ff4d4f' : '#1890ff' }} />
                    <Text type={isUrgent ? 'danger' : 'secondary'}>
                      {dayjs(publication.expiryDate).format('YYYY年MM月DD日')} 
                      ({daysLeft}天后截止)
                    </Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="商机类型">
                  <Tag color="blue">
                    供给
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="行业分类">
                  <Tag color="purple">{publication.industry}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="所在地区">
                  <Space>
                    <EnvironmentOutlined />
                    {publication.region}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 核心产品信息 */}
            <Card title="核心产品信息" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Statistic
                    title="供应能力"
                    value={publication.details?.capacity || 5000}
                    suffix={publication.details?.capacityUnit || '台/月'}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="产品价格"
                    value={publication.budget}
                    suffix={publication.budgetUnit}
                    prefix="¥"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="交付成功率"
                    value={publication.successRate}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
              
              <Divider />
              
              <Descriptions column={1} bordered>
                <Descriptions.Item label="产品材质">
                  <Space>
                    <Text strong>{publication.details?.material || 'WCB铸钢'}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="产品规格">
                  <Space>
                    <Text>{publication.details?.specifications || 'DN15-DN600，PN16'}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="交付周期">
                  <Space>
                    <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                    <Text>{publication.details?.deliveryCycle || 15}天</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="价格区间">
                  <Space>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <Text>¥{publication.details?.priceRange?.min || 199} - ¥{publication.details?.priceRange?.max || 298}</Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 产品详情与重点标注 */}
            <Card title="详细产品描述" style={{ marginBottom: 24 }}>
              <Paragraph style={{ fontSize: 14, lineHeight: 1.8 }}>
                {publication.description}
              </Paragraph>
              
              <Divider orientation="left">技术参数</Divider>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="工作压力">{publication.details?.workingPressure || '1.6MPa'}</Descriptions.Item>
                <Descriptions.Item label="工作温度">{publication.details?.workingTemperature || '-29°C ~ 425°C'}</Descriptions.Item>
                <Descriptions.Item label="密封类型">{publication.details?.sealingType || '硬密封'}</Descriptions.Item>
                <Descriptions.Item label="连接方式">{publication.details?.connectionType || '法兰连接'}</Descriptions.Item>
                <Descriptions.Item label="适用介质">{publication.details?.applicableMedia || '水、蒸汽、油品等'}</Descriptions.Item>
                <Descriptions.Item label="产品名称">{publication.details?.productName || 'Z41H-16C铸钢闸阀'}</Descriptions.Item>
              </Descriptions>

              {publication.tags && publication.tags.length > 0 && (
                <>
                  <Divider orientation="left">相关标签</Divider>
                  <Space wrap>
                    {publication.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </>
              )}
            </Card>

            {/* 附件下载 */}
            {publication.attachments && publication.attachments.length > 0 && (
              <Card title="产品资料" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {publication.attachments.map(attachment => (
                    <Card key={attachment.id} size="small" style={{ background: '#fafafa' }}>
                      <Row align="middle" justify="space-between">
                        <Col>
                          <Space>
                            <Text strong>{attachment.name}</Text>
                            <Text type="secondary">({(attachment.size / 1024 / 1024).toFixed(2)} MB)</Text>
                          </Space>
                        </Col>
                        <Col>
                          <Button type="primary" size="small">下载</Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>
            )}
          </Col>

          {/* 右侧信息栏 */}
          <Col span={8}>
            {/* 企业信息卡片 */}
            <Card title="发布企业" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Row align="middle">
                  <Col flex="auto">
                    <Space direction="vertical" size={4}>
                      <Text strong style={{ fontSize: 16 }}>{publication.publisherName}</Text>
                      <Space>
                        <Tag color="success">已认证</Tag>
                        <Text type="secondary">成立5年</Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col>
                    <Avatar size={64} icon={<UserOutlined />} />
                  </Col>
                </Row>
                
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="企业规模">
                    <Space>
                      <TeamOutlined />
                      <Text>100-500人</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="注册资本">¥1000万</Descriptions.Item>
                  <Descriptions.Item label="主营业务">电动车研发制造</Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>

            {/* 企业信誉度图表 */}
            <Card title="企业信誉度" style={{ marginBottom: 24 }}>
              <SafeECharts 
                option={getReputationChartOption()} 
                style={{ height: 200 }}
              />
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Statistic
                    title="历史对接"
                    value={156}
                    suffix="次"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="成功率"
                    value={88}
                    suffix="%"
                    valueStyle={{ fontSize: 16, color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 同类产品趋势 */}
            <Card title="同类产品分析" style={{ marginBottom: 24 }}>
              <SafeECharts 
                option={getDemandTrendOption()} 
                style={{ height: 200 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                近6个月同类产品供应趋势，当前产品需求热度较高
              </Text>
            </Card>

            {/* 浏览统计 */}
            <Card title="浏览统计" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Text>总浏览量</Text>
                  <Text strong>{publication.viewCount}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>今日浏览</Text>
                  <Text strong>89</Text>
                </Row>
                <Row justify="space-between">
                  <Text>对接次数</Text>
                  <Text strong>{publication.connectionCount}</Text>
                </Row>
                <Progress 
                  percent={75} 
                  size="small" 
                  status="active"
                  format={() => '热度指数 75%'}
                />
              </Space>
            </Card>

            {/* 相关推荐 */}
            <Card title="相关产品推荐" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {[
                  { title: '智能制造数字化转型咨询服务', price: '20万', region: '北京市' },
                  { title: '工业机器人集成应用服务', price: '20万', region: '江苏省' },
                  { title: '高精度检测设备租赁服务', price: '80万', region: '广东省' }
                ].map((item, index) => (
                  <Card key={index} size="small" hoverable style={{ background: '#fafafa' }}>
                    <Text strong style={{ fontSize: 12 }}>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>价格: ¥{item.price} | {item.region}</Text>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 对接申请弹窗 */}
        <ConnectionApplication
          visible={contactModalVisible}
          onCancel={() => setContactModalVisible(false)}
          onSuccess={() => {
            setContactModalVisible(false);
            message.success('对接申请提交成功！您可以在对接管理中查看申请状态。');
          }}
          publication={publication}
        />
      </Content>
    </Layout>
  );
};

export default SupplyDemandDetail;
