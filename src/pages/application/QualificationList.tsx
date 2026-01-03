import React, { useState } from 'react';
import { Card, Row, Col, Button, Tag, Input, Select, Space, Typography, Divider, Breadcrumb } from 'antd';
import { 
  SearchOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Qualification {
  id: string;
  title: string;
  category: string;
  level: string;
  deadline: string;
  subsidy: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  requirements: string[];
  tags: string[];
  isHot: boolean;
}

const QualificationList: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟数据
  const [qualifications] = useState<Qualification[]>([
    {
      id: '1',
      title: '高新技术企业认定',
      category: '资质认定',
      level: '国家级',
      deadline: '2024-04-30',
      subsidy: '税收减免15%',
      difficulty: 'medium',
      description: '高新技术企业是指在《国家重点支持的高新技术领域》内，持续进行研究开发与技术成果转化，形成企业核心自主知识产权，并以此为基础开展经营活动的居民企业。',
      requirements: [
        '企业申请认定时须注册成立一年以上',
        '企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权',
        '对企业主要产品（服务）发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定的范围',
        '企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%'
      ],
      tags: ['研发投入', '知识产权', '科技人员'],
      isHot: true
    },
    {
      id: '2',
      title: '科技型中小企业评价',
      category: '资质认定',
      level: '国家级',
      deadline: '2024-05-31',
      subsidy: '研发费用加计扣除100%',
      difficulty: 'easy',
      description: '科技型中小企业是指依托一定数量的科技人员从事科学技术研究开发活动，取得自主知识产权并将其转化为高新技术产品或服务，从而实现可持续发展的中小企业。',
      requirements: [
        '在中国境内（不包括港、澳、台地区）注册的居民企业',
        '职工总数不超过500人、年销售收入不超过2亿元、资产总额不超过2亿元',
        '企业提供的产品和服务不属于国家规定的禁止、限制和淘汰类',
        '企业在填报上一年及当年内未发生重大安全、重大质量事故和严重环境违法、科研严重失信行为'
      ],
      tags: ['中小企业', '科技创新', '税收优惠'],
      isHot: false
    },
    {
      id: '3',
      title: '专精特新企业认定',
      category: '资质认定',
      level: '省级',
      deadline: '2024-06-15',
      subsidy: '最高100万元奖励',
      difficulty: 'hard',
      description: '专精特新企业是指具有"专业化、精细化、特色化、新颖化"特征的中小企业。',
      requirements: [
        '从事特定细分市场时间达到2年以上',
        '上年度研发费用总额不低于100万元，且占营业收入总额比重不低于3%',
        '上年度营业收入总额在1000万元以上',
        '近2年主营业务收入或净利润的平均增长率达到5%以上'
      ],
      tags: ['专业化', '精细化', '特色化'],
      isHot: true
    },
    {
      id: '4',
      title: '研发费用加计扣除',
      category: '税收优惠',
      level: '国家级',
      deadline: '2024-12-31',
      subsidy: '研发费用加计扣除100%',
      difficulty: 'medium',
      description: '企业开展研发活动中实际发生的研发费用，未形成无形资产计入当期损益的，在按规定据实扣除的基础上，再按照实际发生额的100%在税前加计扣除。',
      requirements: [
        '企业为开发新技术、新产品、新工艺发生的研究开发费用',
        '研发活动应当符合《国家重点支持的高新技术领域》',
        '企业应对研发费用进行专账核算',
        '企业应建立研发费用辅助账'
      ],
      tags: ['研发费用', '税收减免', '加计扣除'],
      isHot: false
    }
  ]);

  const [filteredQualifications, setFilteredQualifications] = useState(qualifications);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // 搜索和筛选
  const handleFilter = () => {
    let filtered = qualifications;

    if (searchText) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchText.toLowerCase()) ||
        q.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    setFilteredQualifications(filtered);
  };

  React.useEffect(() => {
    handleFilter();
  }, [searchText, categoryFilter, difficultyFilter]);

  // 难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      easy: 'green',
      medium: 'orange',
      hard: 'red'
    };
    return colorMap[difficulty as keyof typeof colorMap];
  };

  // 难度标签文本
  const getDifficultyText = (difficulty: string) => {
    const textMap = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    };
    return textMap[difficulty as keyof typeof textMap];
  };

  return (
    <PageWrapper module="policy">
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>资质申报</Title>
        <Text type="secondary">选择适合的资质项目进行申报</Text>
      </div>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索资质项目"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择类别"
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              <Option value="all">全部类别</Option>
              <Option value="资质认定">资质认定</Option>
              <Option value="税收优惠">税收优惠</Option>
              <Option value="资金扶持">资金扶持</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="申报难度"
              value={difficultyFilter}
              onChange={setDifficultyFilter}
            >
              <Option value="all">全部难度</Option>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 资质列表 */}
      <Row gutter={[16, 16]}>
        {filteredQualifications.map((qualification) => (
          <Col span={12} key={qualification.id}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => navigate(`/policy-center/application-management/qualification/${qualification.id}`)}
                >
                  查看详情
                </Button>,
                <Button 
                  onClick={() => navigate(`/policy-center/application-management/condition-check/${qualification.id}`)}
                >
                  条件自查
                </Button>
              ]}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                    {qualification.title}
                    {qualification.isHot && <Tag color="red" style={{ marginLeft: '8px' }}>热门</Tag>}
                  </Title>
                  <Space>
                    <Tag color="blue">{qualification.category}</Tag>
                    <Tag color="purple">{qualification.level}</Tag>
                    <Tag color={getDifficultyColor(qualification.difficulty)}>
                      {getDifficultyText(qualification.difficulty)}
                    </Tag>
                  </Space>
                </div>
              </div>

              <Paragraph 
                ellipsis={{ rows: 2, expandable: false }} 
                style={{ color: '#666', marginBottom: '16px' }}
              >
                {qualification.description}
              </Paragraph>

              <div style={{ marginBottom: '16px' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ClockCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                    <Text>申报截止：{qualification.deadline}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DollarOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>政策优惠：{qualification.subsidy}</Text>
                  </div>
                </Space>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div>
                <Text strong style={{ marginBottom: '8px', display: 'block' }}>关键要求：</Text>
                <div>
                  {qualification.tags.map((tag, index) => (
                    <Tag key={index} style={{ marginBottom: '4px' }}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredQualifications.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">暂无符合条件的资质项目</Title>
          <Text type="secondary">请尝试调整搜索条件</Text>
        </Card>
      )}
    </PageWrapper>
  );
};

export default QualificationList;
