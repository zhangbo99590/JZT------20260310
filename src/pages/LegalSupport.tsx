import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Space, Divider } from 'antd';
import { 
  SearchOutlined, 
  BulbOutlined, 
  ClockCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
  AlertOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const { Title, Paragraph } = Typography;

const LegalSupport: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageWrapper module="legal">
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <SafetyOutlined style={{ marginRight: '8px' }} />
          法律护航
        </Title>
        <Paragraph style={{ marginTop: '8px', color: '#666' }}>
          为企业提供全方位的法律法规支持，确保合规经营，降低法律风险
        </Paragraph>
      </div>

      {/* 统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="法规总数"
              value={15680}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日更新"
              value={23}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="智能解读"
              value={1256}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="预警提醒"
              value={8}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能模块 */}
      <Row gutter={[24, 24]}>
        {/* 法规查询 */}
        <Col xs={24} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%' }}
            actions={[
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => handleNavigate('/legal-support/regulation-query')}
              >
                立即查询
              </Button>
            ]}
          >
            <Card.Meta
              avatar={<SearchOutlined style={{ fontSize: '32px', color: '#1890ff' }} />}
              title="法规查询"
              description={
                <div>
                  <Paragraph>
                    多维度法规库，整合国家、地方及行业全量法律法规
                  </Paragraph>
                  <Space direction="vertical" size="small">
                    <div>• 效力层级分类：法律/行政法规/部门规章</div>
                    <div>• 领域分类：财税、劳动、知识产权、环保</div>
                    <div>• 行业分类：制造、科技、服务等</div>
                    <div>• 高级检索：关键词、条款号、发布机关</div>
                  </Space>
                </div>
              }
            />
          </Card>
        </Col>

        {/* 智能法律解读 */}
        <Col xs={24} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%' }}
            actions={[
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => handleNavigate('/legal-support/legal-interpretation')}
              >
                智能解读
              </Button>
            ]}
          >
            <Card.Meta
              avatar={<BulbOutlined style={{ fontSize: '32px', color: '#faad14' }} />}
              title="智能法律解读"
              description={
                <div>
                  <Paragraph>
                    专业法条场景化解析，用通俗语言解释法律条款
                  </Paragraph>
                  <Space direction="vertical" size="small">
                    <div>• 法条通俗化解释</div>
                    <div>• 业务场景智能匹配</div>
                    <div>• 政策申报指导</div>
                    <div>• 合同签订建议</div>
                    <div>• 用工管理提醒</div>
                  </Space>
                </div>
              }
            />
          </Card>
        </Col>

        {/* 时效性管理 */}
        <Col xs={24} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%' }}
            actions={[
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => handleNavigate('/legal-support/timeliness-management')}
              >
                管理中心
              </Button>
            ]}
          >
            <Card.Meta
              avatar={<ClockCircleOutlined style={{ fontSize: '32px', color: '#f5222d' }} />}
              title="时效性管理"
              description={
                <div>
                  <Paragraph>
                    确保企业使用的法规均为最新有效版本
                  </Paragraph>
                  <Space direction="vertical" size="small">
                    <div>• 法规状态标注：生效/废止/修订</div>
                    <div>• 自动预警机制</div>
                    <div>• 新法规发布提醒</div>
                    <div>• 旧法规变更通知</div>
                    <div>• 版本控制管理</div>
                  </Space>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 快速入口 */}
      <Card title="快速入口" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => handleNavigate('/legal-support/regulation-query')}
            >
              <SearchOutlined />
              法规搜索
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => handleNavigate('/legal-support/legal-interpretation')}
            >
              <BulbOutlined />
              AI解读
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => handleNavigate('/legal-support/timeliness-management')}
            >
              <ClockCircleOutlined />
              时效管理
            </Button>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Button block size="large">
              <AlertOutlined />
              预警中心
            </Button>
          </Col>
        </Row>
      </Card>
    </PageWrapper>
  );
};

export default LegalSupport;
