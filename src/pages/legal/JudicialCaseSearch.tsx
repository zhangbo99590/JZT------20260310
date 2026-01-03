import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  List,
  Badge,
  Divider,
  Radio,
  Checkbox,
  Tooltip,
  Statistic,
  Alert,
  Breadcrumb,
} from 'antd';
import PageWrapper from '../../components/PageWrapper';
import {
  SearchOutlined,
  FilterOutlined,
  FireOutlined,
  StarOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BankOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useNavigate } from 'react-router-dom';

dayjs.extend(isBetween);

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 案例数据接口
interface CaseItem {
  id: string;
  title: string;
  caseNumber: string;
  court: string;
  courtLevel: '基层法院' | '中级法院' | '高级法院' | '最高法院';
  judgmentDate: string;
  caseType: string;
  contractType: string;
  disputeType: string;
  disputeFocus: string;
  industry: string;
  verdict: '企业胜诉' | '企业败诉' | '部分支持' | '调解结案';
  victoryParty: '原告' | '被告';
  amount: number;
  summary: string;
  viewCount: number;
  rating: number;
  tags: string[];
}

// 模拟案例数据
const mockCases: CaseItem[] = [
  {
    id: 'CASE001',
    title: '某科技公司与供应商买卖合同纠纷案',
    caseNumber: '(2024)京01民初1234号',
    court: '北京市第一中级人民法院',
    courtLevel: '中级法院',
    judgmentDate: '2024-11-15',
    caseType: '合同纠纷',
    contractType: '买卖合同',
    disputeType: '违约责任',
    disputeFocus: '逾期交货',
    industry: '制造业',
    verdict: '企业胜诉',
    victoryParty: '原告',
    amount: 500000,
    summary: '原告科技公司与被告供应商签订采购合同，约定交货期为2024年6月30日。被告逾期交货导致原告生产延误，造成经济损失。法院判决被告承担违约责任，支付违约金50万元。',
    viewCount: 1245,
    rating: 4.8,
    tags: ['逾期交货', '违约金', '经济损失'],
  },
  {
    id: 'CASE002',
    title: '制造企业劳动合同竞业限制纠纷案',
    caseNumber: '(2024)沪02民终5678号',
    court: '上海市第二中级人民法院',
    courtLevel: '中级法院',
    judgmentDate: '2024-10-20',
    caseType: '劳动争议',
    contractType: '劳动合同',
    disputeType: '竞业限制',
    disputeFocus: '竞业限制期限',
    industry: '制造业',
    verdict: '企业败诉',
    victoryParty: '被告',
    amount: 200000,
    summary: '企业与员工签订劳动合同时约定竞业限制期限为5年，法院认定该期限超过法定上限（2年），判决竞业限制条款部分无效。',
    viewCount: 892,
    rating: 4.5,
    tags: ['竞业限制', '劳动合同', '条款无效'],
  },
  {
    id: 'CASE003',
    title: '软件开发服务外包合同纠纷案',
    caseNumber: '(2024)粤03民初9012号',
    court: '深圳市中级人民法院',
    courtLevel: '中级法院',
    judgmentDate: '2024-09-10',
    caseType: '合同纠纷',
    contractType: '服务合同',
    disputeType: '验收标准',
    disputeFocus: '质量不达标',
    industry: '科技',
    verdict: '部分支持',
    victoryParty: '原告',
    amount: 800000,
    summary: '原告委托被告开发软件系统，双方对验收标准约定不明确。法院认定双方均有过错，判决被告返还部分款项并承担相应责任。',
    viewCount: 1567,
    rating: 4.6,
    tags: ['验收标准', '质量纠纷', '软件开发'],
  },
  {
    id: 'CASE004',
    title: '商铺租赁合同提前解除纠纷案',
    caseNumber: '(2024)浙01民初3456号',
    court: '杭州市西湖区人民法院',
    courtLevel: '基层法院',
    judgmentDate: '2024-08-25',
    caseType: '合同纠纷',
    contractType: '租赁合同',
    disputeType: '合同解除',
    disputeFocus: '提前解约',
    industry: '零售',
    verdict: '调解结案',
    victoryParty: '原告',
    amount: 150000,
    summary: '因疫情影响，承租方要求提前解除租赁合同。经法院调解，双方达成协议，出租方退还部分押金。',
    viewCount: 678,
    rating: 4.2,
    tags: ['租赁合同', '提前解约', '疫情影响'],
  },
  {
    id: 'CASE005',
    title: '建筑工程施工合同质量纠纷案',
    caseNumber: '(2024)川01民初7890号',
    court: '成都市中级人民法院',
    courtLevel: '中级法院',
    judgmentDate: '2024-07-30',
    caseType: '合同纠纷',
    contractType: '建设工程合同',
    disputeType: '工程质量',
    disputeFocus: '质量缺陷',
    industry: '建筑',
    verdict: '企业胜诉',
    victoryParty: '原告',
    amount: 2000000,
    summary: '发包方诉称承包方施工质量存在严重缺陷，要求赔偿损失。法院经鉴定认定质量缺陷属实，判决承包方承担修复费用及赔偿金200万元。',
    viewCount: 2134,
    rating: 4.9,
    tags: ['工程质量', '质量缺陷', '损害赔偿'],
  },
];

const JudicialCaseSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'heat' | 'rating'>('relevance');
  const [selectedContractType, setSelectedContractType] = useState<string>('');
  const [selectedCourtLevel, setSelectedCourtLevel] = useState<string>('');
  const [selectedDisputeType, setSelectedDisputeType] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('');
  const [victoryParty, setVictoryParty] = useState<string>('');
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);

  // 筛选案例
  const filteredCases = useMemo(() => {
    return mockCases.filter((item) => {
      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        if (
          !item.title.toLowerCase().includes(keyword) &&
          !item.summary.toLowerCase().includes(keyword) &&
          !item.tags.some((tag) => tag.toLowerCase().includes(keyword))
        ) {
          return false;
        }
      }

      // 合同类型筛选
      if (selectedContractType && item.contractType !== selectedContractType) {
        return false;
      }

      // 法院层级筛选
      if (selectedCourtLevel && item.courtLevel !== selectedCourtLevel) {
        return false;
      }

      // 争议类型筛选
      if (selectedDisputeType && item.disputeType !== selectedDisputeType) {
        return false;
      }

      // 行业筛选
      if (selectedIndustry && item.industry !== selectedIndustry) {
        return false;
      }

      // 判决结果筛选
      if (selectedVerdict && item.verdict !== selectedVerdict) {
        return false;
      }

      // 胜诉方筛选
      if (victoryParty && item.victoryParty !== victoryParty) {
        return false;
      }

      // 时间范围筛选
      if (timeRange) {
        const [start, end] = timeRange;
        const caseDate = dayjs(item.judgmentDate);
        if (!caseDate.isBetween(start, end, 'day', '[]')) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchKeyword,
    selectedContractType,
    selectedCourtLevel,
    selectedDisputeType,
    selectedIndustry,
    selectedVerdict,
    victoryParty,
    timeRange,
  ]);

  // 排序
  const sortedCases = useMemo(() => {
    const cases = [...filteredCases];
    switch (sortBy) {
      case 'heat':
        return cases.sort((a, b) => b.viewCount - a.viewCount);
      case 'rating':
        return cases.sort((a, b) => b.rating - a.rating);
      case 'relevance':
      default:
        return cases;
    }
  }, [filteredCases, sortBy]);

  // 热度趋势图表数据
  const heatTrendOption = useMemo(() => {
    const monthlyData = [
      { month: '7月', count: 156 },
      { month: '8月', count: 189 },
      { month: '9月', count: 234 },
      { month: '10月', count: 278 },
      { month: '11月', count: 312 },
    ];

    return {
      tooltip: {
        trigger: 'axis' as const,
      },
      xAxis: {
        type: 'category' as const,
        data: monthlyData.map((d) => d.month),
      },
      yAxis: {
        type: 'value' as const,
        name: '查看量',
      },
      series: [
        {
          name: '案例查看量',
          type: 'line',
          data: monthlyData.map((d) => d.count),
          smooth: true,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.1)',
          },
        },
      ],
    };
  }, []);

  // 争议类型分布图表
  const disputeTypeOption = useMemo(() => {
    const typeCount: Record<string, number> = {};
    mockCases.forEach((item) => {
      typeCount[item.disputeType] = (typeCount[item.disputeType] || 0) + 1;
    });

    const data = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

    return {
      tooltip: {
        trigger: 'item' as const,
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '争议类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          data,
        },
      ],
    };
  }, []);

  // 重置筛选
  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedContractType('');
    setSelectedCourtLevel('');
    setSelectedDisputeType('');
    setSelectedIndustry('');
    setSelectedVerdict('');
    setVictoryParty('');
    setTimeRange(null);
  };

  return (
    <PageWrapper module="legal">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '法律护航',
          },
          {
            title: '司法案例库',
          },
        ]}
      />
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              司法案例库
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
              AI智能检索 · 多维度筛选 · 专业案例分析
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Statistic
                title="案例总数"
                value={mockCases.length}
                prefix={<FileTextOutlined />}
              />
              <Divider type="vertical" style={{ height: 40 }} />
              <Statistic
                title="筛选结果"
                value={filteredCases.length}
                prefix={<FilterOutlined />}
              />
            </Space>
          </Col>
        </Row>
      </div>

      {/* AI语义检索 */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="AI智能检索"
            description="支持自然语言描述合同纠纷场景，AI将自动提取关键要素并精准匹配案例"
            type="info"
            showIcon
            icon={<ThunderboltOutlined />}
          />
          <Row gutter={16}>
            <Col span={18}>
              <Input
                size="large"
                placeholder="请描述案例场景，如：采购合同对方逾期交货违约金纠纷"
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Space>
                <Button type="primary" size="large" icon={<SearchOutlined />}>
                  智能检索
                </Button>
                <Button size="large" onClick={resetFilters}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      <Row gutter={16}>
        {/* 左侧筛选区 */}
        <Col span={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 合同类型筛选 */}
            <Card title="合同类型" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={selectedContractType}
                onChange={(e) => setSelectedContractType(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="买卖合同">买卖合同</Radio>
                  <Radio value="劳动合同">劳动合同</Radio>
                  <Radio value="服务合同">服务合同</Radio>
                  <Radio value="租赁合同">租赁合同</Radio>
                  <Radio value="建设工程合同">建设工程合同</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 法院层级 */}
            <Card title="法院层级" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={selectedCourtLevel}
                onChange={(e) => setSelectedCourtLevel(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="基层法院">基层法院</Radio>
                  <Radio value="中级法院">中级法院</Radio>
                  <Radio value="高级法院">高级法院</Radio>
                  <Radio value="最高法院">最高法院</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 争议类型 */}
            <Card title="争议类型" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={selectedDisputeType}
                onChange={(e) => setSelectedDisputeType(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="违约责任">违约责任</Radio>
                  <Radio value="竞业限制">竞业限制</Radio>
                  <Radio value="验收标准">验收标准</Radio>
                  <Radio value="合同解除">合同解除</Radio>
                  <Radio value="工程质量">工程质量</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 行业筛选 */}
            <Card title="行业" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="制造业">制造业</Radio>
                  <Radio value="科技">科技</Radio>
                  <Radio value="零售">零售</Radio>
                  <Radio value="建筑">建筑</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 判决结果 */}
            <Card title="判决结果" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={selectedVerdict}
                onChange={(e) => setSelectedVerdict(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="企业胜诉">企业胜诉</Radio>
                  <Radio value="企业败诉">企业败诉</Radio>
                  <Radio value="部分支持">部分支持</Radio>
                  <Radio value="调解结案">调解结案</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 胜诉方 */}
            <Card title="胜诉方" size="small">
              <Radio.Group
                style={{ width: '100%' }}
                value={victoryParty}
                onChange={(e) => setVictoryParty(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="">全部</Radio>
                  <Radio value="原告">原告</Radio>
                  <Radio value="被告">被告</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {/* 判决时间 */}
            <Card title="判决时间" size="small">
              <RangePicker
                style={{ width: '100%' }}
                value={timeRange}
                onChange={(dates) => setTimeRange(dates as [Dayjs, Dayjs] | null)}
                format="YYYY-MM-DD"
              />
            </Card>
          </Space>
        </Col>

        {/* 右侧内容区 */}
        <Col span={18}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 数据可视化 */}
            <Row gutter={16}>
              <Col span={12}>
                <Card title="案例热度趋势" size="small">
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c8c8c' }}>
                    <div style={{ textAlign: 'center' }}>
                      <BarChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                      <div>热度趋势图表</div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="争议类型分布" size="small">
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c8c8c' }}>
                    <div style={{ textAlign: 'center' }}>
                      <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                      <div>争议类型分布图</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 排序选项 */}
            <Card>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Text>排序方式：</Text>
                    <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <Radio.Button value="relevance">相关性</Radio.Button>
                      <Radio.Button value="heat">
                        <FireOutlined /> 热度
                      </Radio.Button>
                      <Radio.Button value="rating">
                        <StarOutlined /> 评分
                      </Radio.Button>
                    </Radio.Group>
                  </Space>
                </Col>
                <Col>
                  <Text type="secondary">
                    共找到 <Text strong>{sortedCases.length}</Text> 个案例
                  </Text>
                </Col>
              </Row>
            </Card>

            {/* 案例列表 */}
            <List
              dataSource={sortedCases}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              renderItem={(item) => (
                <Card
                  style={{ marginBottom: 16 }}
                  hoverable
                  bodyStyle={{ padding: '20px 24px' }}
                >
                  <Row gutter={16}>
                    <Col span={18}>
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <div>
                          <Button
                            type="link"
                            style={{ padding: 0, height: 'auto', fontSize: 16, fontWeight: 'bold' }}
                            onClick={() => navigate(`/legal-support/judicial-cases/detail/${item.id}`)}
                          >
                            {item.title}
                          </Button>
                        </div>
                        <Space wrap>
                          <Tag color="blue">{item.contractType}</Tag>
                          <Tag color="green">{item.disputeType}</Tag>
                          <Tag color="orange">{item.courtLevel}</Tag>
                          <Tag
                            color={
                              item.verdict === '企业胜诉'
                                ? 'success'
                                : item.verdict === '企业败诉'
                                ? 'error'
                                : 'default'
                            }
                          >
                            {item.verdict}
                          </Tag>
                          {item.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                          {item.summary}
                        </Paragraph>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary">
                            <SafetyOutlined /> {item.caseNumber}
                          </Text>
                          <Text type="secondary">{item.court}</Text>
                          <Text type="secondary">{item.judgmentDate}</Text>
                          <Text type="secondary">
                            <EyeOutlined /> {item.viewCount}
                          </Text>
                        </Space>
                      </Space>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Statistic
                          title="涉案金额"
                          value={item.amount}
                          precision={0}
                          prefix="¥"
                          valueStyle={{ fontSize: 18 }}
                        />
                        <div>
                          <Badge
                            count={
                              <Space>
                                <StarOutlined style={{ color: '#faad14' }} />
                                <Text strong>{item.rating}</Text>
                              </Space>
                            }
                            style={{ backgroundColor: '#fff' }}
                          />
                        </div>
                        <Button
                          type="primary"
                          block
                          onClick={() => navigate(`/legal-support/judicial-cases/detail/${item.id}`)}
                        >
                          查看详情
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              )}
            />
          </Space>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default JudicialCaseSearch;
