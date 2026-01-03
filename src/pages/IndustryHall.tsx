import React from 'react';
import { Card, Row, Col, Typography, Button, Statistic, Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  SendOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  LinkOutlined,
  RiseOutlined,
  FallOutlined,
  SwapOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const IndustryHall: React.FC = () => {
  const navigate = useNavigate();

  const entries = [
    {
      key: 'supply-demand',
      title: '商机大厅',
      desc: '浏览和发布商机信息',
      path: '/industry-hall/supply-demand',
      icon: <SendOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    },
    {
      key: 'my-publications',
      title: '我的发布',
      desc: '管理我的商机发布',
      path: '/industry-hall/my-publications',
      icon: <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    },
  ];

  const stats = [
    {
      title: '活跃供给',
      value: 568,
      prefix: <RiseOutlined />,
      valueStyle: { color: '#3f8600' },
      suffix: '条',
    },
    {
      title: '活跃需求',
      value: 679,
      prefix: <FallOutlined />,
      valueStyle: { color: '#cf1322' },
      suffix: '条',
    },
    {
      title: '对接成功率',
      value: 68.5,
      precision: 1,
      prefix: <SwapOutlined />,
      valueStyle: { color: '#1890ff' },
      suffix: '%',
    },
  ];

  return (
    <div className="page-container">

      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          产业大厅
        </Title>
        <Text type="secondary">电动车/自行车行业商机对接平台</Text>
      </div>

      {/* 统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card>
              <Statistic {...stat} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快速入口 */}
      <Card title="功能入口">
        <Row gutter={[16, 16]}>
          {entries.map((entry) => (
            <Col xs={24} sm={12} md={8} key={entry.key}>
              <Card
                hoverable
                onClick={() => navigate(entry.path)}
                style={{ textAlign: 'center' }}
              >
                <div style={{ marginBottom: 16 }}>{entry.icon}</div>
                <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
                  {entry.title}
                </div>
                <Text type="secondary">{entry.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 快捷操作 */}
      <Card title="快捷操作" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => navigate('/industry-hall/new-publication')}
            >
              发布商机信息
            </Button>
          </Col>
          <Col>
            <Button onClick={() => navigate('/industry-hall/supply-demand')}>
              浏览商机大厅
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default IndustryHall;
