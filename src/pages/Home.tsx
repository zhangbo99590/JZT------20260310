import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Button, 
  List, 
  Avatar, 
  Tag, 
  Alert,
  Progress,
  Divider,
  message,
  Breadcrumb,
  Badge
} from 'antd';
import { 
  FileTextOutlined,
  FormOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  AuditOutlined,
  CalculatorOutlined,
  SafetyOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  RightOutlined,
  TrophyOutlined,
  NotificationOutlined,
  HomeOutlined
} from '@ant-design/icons';
import SafeECharts from '../components/SafeECharts';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  // 数据概览统计
  const dataOverview = [
    {
      title: '政策总数',
      value: 128,
      growth: 15,
      growthRate: '+13.3%',
      icon: <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff',
      description: '可申请政策'
    },
    {
      title: '申报项目',
      value: 23,
      growth: 5,
      growthRate: '+27.8%',
      icon: <FormOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
      description: '当前申报中'
    },
    {
      title: '补贴金额',
      value: 2450000,
      growth: 1180000,
      growthRate: '+118.5%',
      icon: <DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#722ed1',
      description: '累计获得补贴',
      prefix: '¥'
    },
    {
      title: '申报通过率',
      value: 85.6,
      growth: 3.2,
      growthRate: '+3.9%',
      icon: <PercentageOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fa8c16',
      description: '当前通过率',
      suffix: '%'
    }
  ];

  // 核心功能快捷入口
  const quickActions = [
    {
      title: '政策中心',
      description: '浏览最新政策，智能匹配推荐',
      icon: <BankOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      color: '#1890ff',
      path: '/policy-center',
      bgColor: '#e6f7ff'
    },
    {
      title: '申报管理',
      description: '提交申报材料，跟踪审核进度',
      icon: <AuditOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      color: '#52c41a',
      path: '/policy-center/application-management',
      bgColor: '#f6ffed'
    },
    {
      title: '金融服务',
      description: '融资诊断，供应链金融服务',
      icon: <CalculatorOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      color: '#722ed1',
      path: '/supply-chain-finance',
      bgColor: '#f9f0ff'
    },
    {
      title: '法律护航',
      description: 'AI智能问答，法规查询服务',
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      color: '#fa8c16',
      path: '/legal-support',
      bgColor: '#fff7e6'
    }
  ];

  // 最近活动通知
  const recentActivities = [
    {
      id: 1,
      title: '技术创新补贴申报结果',
      description: '恭喜！您的技术创新补贴申报已通过审核',
      amount: '50万元',
      status: 'success',
      time: '2小时前',
      type: 'result'
    },
    {
      id: 2,
      title: '2024年小微企业税收优惠政策更新',
      description: '新政策已发布，建议及时了解相关优惠条件',
      status: 'info',
      time: '1天前',
      type: 'policy'
    },
    {
      id: 3,
      title: '财务报表补充材料待办',
      description: '请在3个工作日内补充完善相关财务材料',
      status: 'warning',
      time: '2天前',
      type: 'todo'
    }
  ];

  // 重要提醒
  const importantReminders = [
    {
      id: 1,
      title: '申报截止提醒',
      content: '中小企业技术创新补贴申报剩余 3 天',
      type: 'deadline',
      urgency: 'high',
      action: '立即申报'
    },
    {
      id: 2,
      title: '政策匹配推荐',
      content: '基于您的企业画像，为您推荐了 5 项适合的政策',
      type: 'recommendation',
      urgency: 'medium',
      action: '查看详情'
    }
  ];

  // 获取活动图标
  const getActivityIcon = (type: string, status: string) => {
    if (type === 'result') {
      return status === 'success' ? 
        <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    } else if (type === 'policy') {
      return <NotificationOutlined style={{ color: '#1890ff' }} />;
    } else {
      return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
    }
  };

  // 获取活动标签颜色
  const getActivityTagColor = (status: string) => {
    const colorMap = {
      success: 'success',
      info: 'blue',
      warning: 'warning',
      error: 'error'
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  // ECharts配置 - 政策申报趋势图
  const getTrendChartOption = () => {
    return {
      title: {
        text: '近6个月政策申报趋势',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['申报数量', '通过数量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '申报数量',
          type: 'line',
          data: [12, 15, 18, 20, 25, 23],
          itemStyle: { color: '#1890ff' }
        },
        {
          name: '通过数量',
          type: 'line',
          data: [10, 13, 15, 17, 21, 20],
          itemStyle: { color: '#52c41a' }
        }
      ]
    };
  };

  return (
    <div style={{ background: 'transparent', padding: '0' }}>

      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          中小企业政策申报管理系统
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          欢迎回来，{username}！为您提供一站式政策申报服务
        </Text>
      </div>

      {/* 数据概览区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {dataOverview.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              hoverable
              style={{ 
                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                border: `1px solid ${item.color}30`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    {item.icon}
                    <Text strong style={{ marginLeft: '8px', fontSize: '14px' }}>
                      {item.title}
                    </Text>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>
                      {item.prefix}{item.value.toLocaleString()}{item.suffix}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.description}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                      <Text style={{ color: '#52c41a', fontSize: '12px', marginLeft: '2px' }}>
                        {item.growthRate}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 核心功能快捷入口 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TrophyOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                核心功能
              </div>
            }
            style={{ height: '100%' }}
          >
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={index}>
                  <Card 
                    size="small" 
                    hoverable
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: action.bgColor,
                      border: `1px solid ${action.color}30`,
                      height: '120px'
                    }}
                    onClick={() => navigate(action.path)}
                    styles={{ 
                       body: {
                         padding: '16px',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         justifyContent: 'center',
                         height: '100%'
                       }
                     }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {action.icon}
                      <div style={{ marginTop: '8px' }}>
                        <Text strong style={{ fontSize: '14px', color: action.color }}>
                          {action.title}
                        </Text>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {action.description}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 政策申报趋势图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BellOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                申报趋势分析
              </div>
            }
            style={{ height: '100%' }}
          >
            <SafeECharts 
              option={getTrendChartOption()} 
              style={{ height: '280px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部信息区域 */}
      <Row gutter={[16, 16]}>
        {/* 最近活动通知栏 */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <NotificationOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                最近活动
              </div>
            }
            extra={
              <Button 
                type="link" 
                size="small"
                onClick={() => navigate('/policy-center/my-applications')}
              >
                查看全部 <RightOutlined />
              </Button>
            }
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item 
                  style={{ padding: '12px 0', cursor: 'pointer' }}
                  onClick={() => {
                    if (item.type === 'result' || item.type === 'todo') {
                      navigate('/policy-center/my-applications');
                    } else if (item.type === 'policy') {
                      navigate('/policy-center/main');
                    }
                  }}
                  className="activity-item-hover"
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getActivityIcon(item.type, item.status)}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong>{item.title}</Text>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {item.amount && (
                            <Tag color="success" style={{ marginRight: '8px' }}>
                              {item.amount}
                            </Tag>
                          )}
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.time}
                          </Text>
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph 
                          style={{ margin: 0, fontSize: '13px' }}
                          ellipsis={{ rows: 1 }}
                        >
                          {item.description}
                        </Paragraph>
                        <Tag 
                          color={getActivityTagColor(item.status)} 
                          style={{ marginTop: '4px' }}
                        >
                          {item.status === 'success' ? '已完成' : 
                           item.status === 'info' ? '通知' : 
                           item.status === 'warning' ? '待办' : '其他'}
                        </Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 重要提醒模块 */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ExclamationCircleOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                重要提醒
              </div>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {importantReminders.map((reminder) => (
                <Alert
                  key={reminder.id}
                  message={reminder.title}
                  description={
                    <div>
                      <Paragraph style={{ margin: '8px 0', fontSize: '13px' }}>
                        {reminder.content}
                      </Paragraph>
                      <Button 
                        type={reminder.urgency === 'high' ? 'primary' : 'default'}
                        size="small"
                        danger={reminder.urgency === 'high'}
                        onClick={() => {
                          if (reminder.type === 'deadline') {
                            navigate('/policy-center/application-management');
                          } else if (reminder.type === 'recommendation') {
                            navigate('/policy-center/smart-matching');
                          } else {
                            message.info('功能开发中...');
                          }
                        }}
                      >
                        {reminder.action}
                      </Button>
                    </div>
                  }
                  type={reminder.urgency === 'high' ? 'error' : 'info'}
                  showIcon
                  style={{ marginBottom: '12px' }}
                />
              ))}
              
            </Space>
          </Card>
          
          {/* 待办提醒模块 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BellOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                待办提醒
              </div>
            }
            style={{ marginTop: '16px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                type="text"
                block
                onClick={() => navigate('/policy-center/my-applications')}
                style={{ 
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  <div>
                    <div><Text strong>需补正项目</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>请及时补充相关材料</Text></div>
                  </div>
                </Space>
                <Badge count={2} style={{ backgroundColor: '#faad14' }} />
              </Button>
              
              <Button 
                type="text"
                block
                onClick={() => navigate('/policy-center/my-applications')}
                style={{ 
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <ClockCircleOutlined style={{ color: '#ff4d4f' }} />
                  <div>
                    <div><Text strong>即将过期项目</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>3个项目即将截止</Text></div>
                  </div>
                </Space>
                <Badge count={3} style={{ backgroundColor: '#ff4d4f' }} />
              </Button>
              
              <Button 
                type="text"
                block
                onClick={() => navigate('/policy-center/my-applications')}
                style={{ 
                  textAlign: 'left',
                  height: 'auto',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <div>
                    <div><Text strong>审核结果更新</Text></div>
                    <div><Text type="secondary" style={{ fontSize: '12px' }}>有新的审核结果</Text></div>
                  </div>
                </Space>
                <Badge count={1} style={{ backgroundColor: '#52c41a' }} />
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;