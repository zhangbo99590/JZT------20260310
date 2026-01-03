/**
 * AI政策搜索页面
 * 用户搜索政策，AI匹配展示结果
 */

import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Card,
  Tag,
  Space,
  Drawer,
  Divider,
  message,
  Spin,
  Empty,
  Badge,
  Tooltip,
  Checkbox,
  Select,
  Collapse,
  FloatButton,
  Dropdown,
  Modal,
  Table,
  DatePicker,
  Slider,
  Radio,
} from 'antd';
import {
  SearchOutlined,
  AudioOutlined,
  FireOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  RightOutlined,
  ThunderboltOutlined,
  FilterOutlined,
  HistoryOutlined,
  CompressOutlined,
  BarChartOutlined,
  DownOutlined,
  UpOutlined,
  ClearOutlined,
  StarOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import PageWrapper from '../../components/PageWrapper';
import SafeECharts from '../../components/SafeECharts';
import styles from './AIPolicySearch.module.css';

const { Search } = Input;

interface PolicyResult {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  level: string;
  region: string;
  deadline?: string;
  subsidy?: string;
  matchScore: number;
  isHot?: boolean;
  sources: PolicySource[];
  content: PolicyContent;
}

interface PolicySource {
  name: string;
  url: string;
}

interface PolicyContent {
  overview: string;
  eligibility: string[];
  subsidyDetails: string[];
  policyBasis: string[];
  applicationProcess: string[];
  relatedPolicies: string[];
}

const AIPolicySearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<PolicyResult[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyResult | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // 新增功能状态
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    regions: [] as string[],
    levels: [] as string[],
    categories: [] as string[],
    subsidyRange: [0, 100] as [number, number],
    matchScoreMin: 0,
  });

  // 模拟AI搜索
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索内容');
      return;
    }

    setSearching(true);
    setHasSearched(false);

    // 添加到搜索历史
    if (!searchHistory.includes(value)) {
      setSearchHistory([value, ...searchHistory.slice(0, 9)]);
      localStorage.setItem('policySearchHistory', JSON.stringify([value, ...searchHistory.slice(0, 9)]));
    }

    // 模拟API调用
    setTimeout(() => {
      const mockResults: PolicyResult[] = [
        {
          id: '1',
          title: '北京市丰台区高新技术企业复审给多钱，再附上相关政策',
          summary: '北京市丰台区的国家高新技术企业在复审（重新认定）通过后，目前区级一次性奖励标准为10万元人民币。',
          tags: ['补贴', '高新技术企业', '丰台区'],
          level: '区级',
          region: '北京市丰台区',
          deadline: '长期有效',
          subsidy: '10万元',
          matchScore: 95,
          isHot: true,
          sources: [
            { name: 'bita', url: '#' },
            { name: 'beijing', url: '#' },
            { name: 'seo.huaxialake', url: '#' },
            { name: 'ncati', url: '#' },
            { name: 'qgrdw', url: '#' },
          ],
          content: {
            overview: '北京市丰台区的国家高新技术企业在复审（重新认定）通过后，目前区级一次性奖励标准为10万元人民币。',
            eligibility: [
              '对新认定或新入区（迁入）的国家高新技术企业，丰台区一次性给予30万元扶持资金。',
              '对成功重新认定（即高企证书到期后通过复审/重次认定）的国家高新技术企业，一次性给予10万元扶持资金。',
            ],
            subsidyDetails: [
              '对新认定或新入区（迁入）的国家高新技术企业，一次性给予30万元扶持；',
              '对成功重新认定的国家高新技术企业，一次性给予10万元扶持。',
            ],
            policyBasis: [
              '《丰台区支持高新技术企业发展的若干措施》明确提出：',
              '在各类北京市及各区高新技术企业奖励政策汇总中，也将丰台区"复审奖励10万元"的标准作为现行执行口径进行了统一引用。',
            ],
            applicationProcess: [
              '企业需在通过国家高新技术企业重新认定后，按丰台区科信局等部门当时发布的申报通知，准备材料并在规定时间内申请完现奖励资金。',
              '政策有可能根据年度财政安排进行微调，建议在具体申报前，查询丰台区科信局官网或当年"高新技术企业扶持/奖励资金申报通知"，输入当年最新执行标准与申报流程。',
            ],
            relatedPolicies: [
              '丰台区高新复审补贴申请流程及材料清单',
              '丰台区高新技术企业补贴问时到账及时限要求',
              '丰台区高新技术企业复审资金如何与税收挂钩',
              '高新复审未通过是否可补中申或争议处理方式',
              '丰台区高新技术企业迁入奖励与首次认定差异解释',
            ],
          },
        },
        {
          id: '2',
          title: '专精特新企业认定',
          summary: '支持中小企业走专业化、精细化、特色化、新颖化发展道路，提升企业核心竞争力。',
          tags: ['资质认定', '专精特新', '中小企业'],
          level: '国家级',
          region: '全国',
          deadline: '2024-06-30',
          matchScore: 78,
          sources: [
            { name: '工信部', url: '#' },
            { name: '中小企业局', url: '#' },
          ],
          content: {
            overview: '专精特新企业是指具有"专业化、精细化、特色化、新颖化"特征的中小企业。',
            eligibility: [
              '从事特定细分市场时间达到2年以上',
              '上年度研发费用总额不低于100万元，且占营业收入总额比重不低于3%',
              '上年度营业收入总额在1000万元以上，或上年度营业收入总额在1000万元以下，但近2年新增股权融资总额（合格机构投资者的实缴额）达到2000万元以上',
            ],
            subsidyDetails: [
              '获得专精特新称号后，可享受多项政策支持',
              '优先获得政府采购支持',
              '融资便利化支持',
            ],
            policyBasis: [
              '《优质中小企业梯度培育管理暂行办法》',
              '各地方配套政策文件',
            ],
            applicationProcess: [
              '企业自主申报',
              '地方主管部门审核推荐',
              '省级主管部门复核',
              '工信部认定公示',
            ],
            relatedPolicies: [
              '专精特新"小巨人"企业认定',
              '制造业单项冠军企业认定',
            ],
          },
        },
        {
          id: '3',
          title: '企业数字化转型补贴',
          summary: '支持企业进行数字化、智能化改造升级，提升企业信息化水平。',
          tags: ['补贴', '数字化', '智能制造'],
          level: '省级',
          region: '北京市',
          deadline: '2024-12-31',
          subsidy: '最高30万元',
          matchScore: 72,
          sources: [
            { name: '北京市经信局', url: '#' },
          ],
          content: {
            overview: '支持企业开展数字化转型，提升智能制造水平。',
            eligibility: [
              '在北京市注册的企业',
              '数字化改造投入不低于20万元',
              '有明确的数字化转型方案',
            ],
            subsidyDetails: [
              '按照实际投入的30%给予补贴',
              '单个企业最高补贴30万元',
            ],
            policyBasis: [
              '《北京市支持企业数字化转型若干措施》',
            ],
            applicationProcess: [
              '企业提交申请材料',
              '专家评审',
              '公示',
              '拨付资金',
            ],
            relatedPolicies: [
              '智能制造示范项目',
              '工业互联网平台建设',
            ],
          },
        },
      ];

      setResults(mockResults);
      setSearching(false);
      setHasSearched(true);
      message.success(`找到 ${mockResults.length} 个相关政策`);
    }, 1500);
  };

  // 加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('policySearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 查看政策详情
  const handleViewDetail = (policy: PolicyResult) => {
    setSelectedPolicy(policy);
    setDrawerVisible(true);
  };

  // 获取匹配度颜色
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#ff4d4f';
    if (score >= 80) return '#faad14';
    if (score >= 70) return '#52c41a';
    return '#1890ff';
  };

  // 政策多选
  const handlePolicySelect = (policyId: string) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId));
    } else {
      if (selectedPolicies.length >= 5) {
        message.warning('最多只能选择5个政策进行对比');
        return;
      }
      setSelectedPolicies([...selectedPolicies, policyId]);
    }
  };

  // 清空选择
  const handleClearSelection = () => {
    setSelectedPolicies([]);
    message.success('已清空选择');
  };

  // 政策对比
  const handleCompare = () => {
    if (selectedPolicies.length < 2) {
      message.warning('请至少选择2个政策进行对比');
      return;
    }
    setCompareModalVisible(true);
  };

  // 应用筛选
  const handleApplyFilters = () => {
    let filtered = [...results];
    
    if (filters.regions.length > 0) {
      filtered = filtered.filter(p => filters.regions.includes(p.region));
    }
    if (filters.levels.length > 0) {
      filtered = filtered.filter(p => filters.levels.includes(p.level));
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => p.tags.some(tag => filters.categories.includes(tag)));
    }
    if (filters.matchScoreMin > 0) {
      filtered = filtered.filter(p => p.matchScore >= filters.matchScoreMin);
    }
    
    setResults(filtered);
    message.success(`已应用筛选条件，找到${filtered.length}个政策`);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      regions: [],
      levels: [],
      categories: [],
      subsidyRange: [0, 100],
      matchScoreMin: 0,
    });
    message.success('已重置筛选条件');
  };

  // 导出结果
  const handleExport = () => {
    message.success('导出功能开发中...');
  };

  // 收藏政策
  const handleFavorite = (policyId: string) => {
    message.success('已添加到收藏');
  };

  // 分享政策
  const handleShare = (policyId: string) => {
    const policy = results.find(p => p.id === policyId);
    if (policy) {
      // 复制分享链接到剪贴板
      const shareUrl = `${window.location.origin}/policy/${policyId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        message.success('分享链接已复制到剪贴板');
      }).catch(() => {
        message.error('复制失败，请手动复制');
      });
    }
  };

  // 点击标签筛选
  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
    handleSearch(tag);
  };

  // 点击来源查看详情并搜索相关链接
  const handleSourceClick = async (source: PolicySource, policy: PolicyResult, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 显示加载中的Modal
    const modal = Modal.info({
      title: `来源：${source.name}`,
      content: (
        <div>
          <Spin tip="正在全网搜索相关政策链接...">
            <div style={{ padding: '20px 0' }}>
              <p>正在搜索与"{policy.title}"相关的链接...</p>
            </div>
          </Spin>
        </div>
      ),
      okText: '关闭',
    });

    // 模拟全网搜索（实际应用中这里应该调用搜索API）
    setTimeout(() => {
      // 构建搜索关键词
      const searchKeywords = `${source.name} ${policy.title}`;
      
      // 模拟搜索结果
      const searchResults = [
        {
          title: `${source.name} - ${policy.title}`,
          url: source.url !== '#' ? source.url : `https://www.baidu.com/s?wd=${encodeURIComponent(searchKeywords)}`,
          snippet: `${policy.summary}`,
          source: source.name,
        },
        {
          title: `${policy.title} - 官方政策文件`,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(policy.title + ' 官方文件')}`,
          snippet: '查看官方发布的完整政策文件和申报指南',
          source: '百度搜索',
        },
        {
          title: `${policy.title} - 解读分析`,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(policy.title + ' 政策解读')}`,
          snippet: '专业解读政策要点、申报条件和注意事项',
          source: '百度搜索',
        },
        {
          title: `${policy.region} 政府官网`,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(policy.region + ' 政府官网')}`,
          snippet: '访问地方政府官网查看最新政策动态',
          source: '政府官网',
        },
      ];

      // 更新Modal内容显示搜索结果
      modal.update({
        title: (
          <div>
            <span>来源：{source.name}</span>
            <Tag color="green" style={{ marginLeft: 12 }}>
              找到 {searchResults.length} 个相关链接
            </Tag>
          </div>
        ),
        content: (
          <div>
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>搜索关键词：</div>
              <Tag color="blue">{searchKeywords}</Tag>
            </div>

            <Divider orientation="left">搜索结果</Divider>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {searchResults.map((result, idx) => (
                <Card
                  key={idx}
                  size="small"
                  hoverable
                  onClick={() => window.open(result.url, '_blank')}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1890ff', marginBottom: 8 }}>
                        {idx + 1}. {result.title}
                      </div>
                      <div style={{ color: '#595959', fontSize: 13, marginBottom: 8 }}>
                        {result.snippet}
                      </div>
                      <Space size={8}>
                        <Tag icon={<FileTextOutlined />} color="default">
                          {result.source}
                        </Tag>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ fontSize: 12 }}
                        >
                          {result.url.length > 50 ? result.url.substring(0, 50) + '...' : result.url}
                        </a>
                      </Space>
                    </div>
                    <RightOutlined style={{ color: '#8c8c8c' }} />
                  </div>
                </Card>
              ))}
            </Space>

            <div style={{ marginTop: 16, padding: 12, background: '#e6f7ff', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: '#1890ff' }}>
                💡 提示：点击任意搜索结果卡片可在新窗口打开链接
              </div>
            </div>
          </div>
        ),
        width: 800,
        okText: '关闭',
      });
    }, 1500); // 模拟搜索延迟
  };

  // 查看所有来源
  const handleViewAllSources = (policy: PolicyResult, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.info({
      title: `${policy.title} - 所有来源`,
      width: 700,
      content: (
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>共 {policy.sources.length} 个来源</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              点击来源名称可在全网搜索相关政策链接
            </div>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {policy.sources.map((source, idx) => (
              <Card
                key={idx}
                size="small"
                hoverable
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSourceClick(source, policy, e);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1890ff', marginBottom: 4 }}>
                      {idx + 1}. {source.name}
                    </div>
                    {source.url && source.url !== '#' && (
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        原文链接：
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {source.url.length > 40 ? source.url.substring(0, 40) + '...' : source.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <Space>
                    <Button
                      type="link"
                      size="small"
                      icon={<SearchOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSourceClick(source, policy, e);
                      }}
                    >
                      搜索
                    </Button>
                    <RightOutlined style={{ color: '#8c8c8c' }} />
                  </Space>
                </div>
              </Card>
            ))}
          </Space>
        </div>
      ),
    });
  };

  // 获取图表配置
  const getChartOption = () => {
    const categoryData = results.reduce((acc, policy) => {
      policy.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      title: {
        text: '政策类别分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          data: Object.entries(categoryData).map(([name, value]) => ({
            name,
            value,
          })),
        },
      ],
    };
  };

  // 获取对比的政策
  const getComparedPolicies = () => {
    return results.filter(p => selectedPolicies.includes(p.id));
  };

  return (
    <PageWrapper title="">
      <div className={styles.searchPage}>
        {/* 搜索区域 */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <h1 className={styles.searchTitle}>AI政策智能搜索</h1>
            <p className={styles.searchSubtitle}>
              用自然语言描述您的需求，AI将为您匹配最合适的政策
            </p>
            
            <div className={styles.searchBox}>
              <Search
                placeholder="例如：北京市丰台区高新技术企业复审给多钱，再附上相关政策"
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />} size="large">
                    AI搜索
                  </Button>
                }
                loading={searching}
              />
            </div>

            {/* 高级搜索和搜索历史 */}
            <div style={{ maxWidth: 800, margin: '16px auto', display: 'flex', gap: 12 }}>
              <Button
                icon={advancedSearchVisible ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}
              >
                高级搜索
              </Button>
              
              {searchHistory.length > 0 && (
                <Dropdown
                  menu={{
                    items: searchHistory.map((item, index) => ({
                      key: index,
                      label: (
                        <div onClick={() => {
                          setSearchValue(item);
                          handleSearch(item);
                        }}>
                          <HistoryOutlined style={{ marginRight: 8 }} />
                          {item}
                        </div>
                      ),
                    })),
                  }}
                  trigger={['click']}
                >
                  <Button icon={<HistoryOutlined />}>
                    搜索历史 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            </div>

            {/* 高级搜索面板 */}
            {advancedSearchVisible && (
              <div className={styles.advancedSearch}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <div style={{ marginBottom: 8, color: 'white' }}>地区：</div>
                    <Select
                      mode="multiple"
                      placeholder="选择地区"
                      style={{ width: '100%' }}
                      value={filters.regions}
                      onChange={(value) => setFilters({ ...filters, regions: value })}
                      options={[
                        { label: '北京市', value: '北京市' },
                        { label: '上海市', value: '上海市' },
                        { label: '广东省', value: '广东省' },
                        { label: '浙江省', value: '浙江省' },
                      ]}
                    />
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: 8, color: 'white' }}>级别：</div>
                    <Checkbox.Group
                      value={filters.levels}
                      onChange={(value) => setFilters({ ...filters, levels: value as string[] })}
                    >
                      <Space wrap>
                        <Checkbox value="国家级" style={{ color: 'white' }}>国家级</Checkbox>
                        <Checkbox value="省级" style={{ color: 'white' }}>省级</Checkbox>
                        <Checkbox value="市级" style={{ color: 'white' }}>市级</Checkbox>
                        <Checkbox value="区级" style={{ color: 'white' }}>区级</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </div>

                  <div>
                    <div style={{ marginBottom: 8, color: 'white' }}>
                      最低匹配度：{filters.matchScoreMin}%
                    </div>
                    <Slider
                      value={filters.matchScoreMin}
                      onChange={(value) => setFilters({ ...filters, matchScoreMin: value })}
                      marks={{ 0: '0%', 50: '50%', 80: '80%', 100: '100%' }}
                    />
                  </div>

                  <Space>
                    <Button type="primary" onClick={handleApplyFilters}>
                      应用筛选
                    </Button>
                    <Button onClick={handleResetFilters}>
                      重置
                    </Button>
                  </Space>
                </Space>
              </div>
            )}

            {/* 热门搜索 */}
            <div className={styles.hotSearches}>
              <Space size={[8, 8]} wrap>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <FireOutlined /> 热门搜索：
                </span>
                <Tag
                  className={styles.hotTag}
                  onClick={() => {
                    setSearchValue('北京市高新技术企业补贴政策');
                    handleSearch('北京市高新技术企业补贴政策');
                  }}
                >
                  高新技术企业补贴
                </Tag>
                <Tag
                  className={styles.hotTag}
                  onClick={() => {
                    setSearchValue('专精特新企业认定条件');
                    handleSearch('专精特新企业认定条件');
                  }}
                >
                  专精特新认定
                </Tag>
                <Tag
                  className={styles.hotTag}
                  onClick={() => {
                    setSearchValue('企业研发费用补贴');
                    handleSearch('企业研发费用补贴');
                  }}
                >
                  研发费用补贴
                </Tag>
              </Space>
            </div>
          </div>
        </div>

        {/* 搜索结果区域 */}
        {hasSearched && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsContainer}>
              {searching ? (
                <div className={styles.loadingContainer}>
                  <Spin size="large" tip="AI正在分析您的需求..." />
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className={styles.resultsHeader}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2>
                        为您找到 <span className={styles.resultCount}>{results.length}</span> 个相关政策
                      </h2>
                      <Space>
                        <Button
                          icon={<BarChartOutlined />}
                          onClick={() => setChartVisible(!chartVisible)}
                        >
                          {chartVisible ? '隐藏' : '显示'}图表
                        </Button>
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={handleExport}
                        >
                          导出结果
                        </Button>
                      </Space>
                    </div>
                  </div>

                  {/* 数据可视化图表 */}
                  {chartVisible && results.length > 0 && (
                    <Card style={{ marginBottom: 24 }}>
                      <div style={{ height: 300 }}>
                        <SafeECharts option={getChartOption()} />
                      </div>
                    </Card>
                  )}

                  {/* 多选工具栏 */}
                  {selectedPolicies.length > 0 && (
                    <Card className={styles.selectionToolbar}>
                      <Space>
                        <span>
                          已选择 <strong>{selectedPolicies.length}</strong> 个政策
                        </span>
                        <Button
                          type="primary"
                          icon={<CompressOutlined />}
                          onClick={handleCompare}
                          disabled={selectedPolicies.length < 2}
                        >
                          对比分析
                        </Button>
                        <Button
                          icon={<ClearOutlined />}
                          onClick={handleClearSelection}
                        >
                          清空选择
                        </Button>
                      </Space>
                    </Card>
                  )}

                  <div className={styles.resultsList}>
                    {results.map((policy) => (
                      <Card
                        key={policy.id}
                        className={`${styles.policyCard} ${selectedPolicies.includes(policy.id) ? styles.selected : ''}`}
                        hoverable
                      >
                        <div className={styles.cardHeader}>
                          <Checkbox
                            checked={selectedPolicies.includes(policy.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handlePolicySelect(policy.id);
                            }}
                            style={{ marginRight: 12 }}
                          />
                          <div className={styles.cardTitle}>
                            {policy.isHot && (
                              <Badge
                                count="热门"
                                style={{
                                  backgroundColor: '#ff4d4f',
                                  marginRight: 8,
                                }}
                              />
                            )}
                            <span className={styles.titleText}>{policy.title}</span>
                          </div>
                          <div
                            className={styles.matchScore}
                            style={{
                              background: getMatchScoreColor(policy.matchScore),
                            }}
                          >
                            {policy.matchScore}% 匹配
                          </div>
                        </div>

                        <div className={styles.cardContent}>
                          <p className={styles.summary}>{policy.summary}</p>

                          <div className={styles.cardMeta}>
                            <Space size={[12, 8]} wrap>
                              {policy.tags.map((tag) => (
                                <Tag
                                  key={tag}
                                  color="blue"
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTagClick(tag);
                                  }}
                                >
                                  {tag}
                                </Tag>
                              ))}
                              <Tag icon={<EnvironmentOutlined />}>{policy.region}</Tag>
                              <Tag>{policy.level}</Tag>
                              {policy.subsidy && (
                                <Tag icon={<DollarOutlined />} color="red">
                                  {policy.subsidy}
                                </Tag>
                              )}
                              {policy.deadline && (
                                <Tag icon={<ClockCircleOutlined />}>
                                  截止：{policy.deadline}
                                </Tag>
                              )}
                            </Space>
                          </div>

                          {policy.sources.length > 0 && (
                            <div className={styles.sources}>
                              <FileTextOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
                              <span
                                style={{ color: '#1890ff', marginRight: 8, cursor: 'pointer' }}
                                onClick={(e) => handleViewAllSources(policy, e)}
                              >
                                {policy.sources.length} 个来源
                              </span>
                              <Space size={4}>
                                {policy.sources.slice(0, 3).map((source, idx) => (
                                  <Tag
                                    key={idx}
                                    size="small"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => handleSourceClick(source, policy, e)}
                                  >
                                    {source.name}
                                  </Tag>
                                ))}
                                {policy.sources.length > 3 && (
                                  <Tag
                                    size="small"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => handleViewAllSources(policy, e)}
                                  >
                                    +{policy.sources.length - 3}
                                  </Tag>
                                )}
                              </Space>
                            </div>
                          )}
                        </div>

                        <div className={styles.cardActions}>
                          <Button
                            type="primary"
                            icon={<ThunderboltOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(policy);
                            }}
                          >
                            查看详情
                          </Button>
                          <Tooltip title="收藏">
                            <Button
                              icon={<StarOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFavorite(policy.id);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="分享">
                            <Button
                              icon={<ShareAltOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(policy.id);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Empty
                  description="未找到相关政策"
                  style={{ marginTop: 60 }}
                />
              )}
            </div>
          </div>
        )}

        {/* 悬浮按钮组 */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24, bottom: 24 }}
          icon={<FilterOutlined />}
        >
          <FloatButton
            icon={<BarChartOutlined />}
            tooltip="数据统计"
            onClick={() => setChartVisible(!chartVisible)}
          />
          <FloatButton
            icon={<CompressOutlined />}
            tooltip="政策对比"
            onClick={handleCompare}
            badge={{ count: selectedPolicies.length }}
          />
          <FloatButton
            icon={<DownloadOutlined />}
            tooltip="导出结果"
            onClick={handleExport}
          />
        </FloatButton.Group>

        {/* 政策对比Modal */}
        <Modal
          title="政策对比分析"
          open={compareModalVisible}
          onCancel={() => setCompareModalVisible(false)}
          width={1000}
          footer={[
            <Button key="close" onClick={() => setCompareModalVisible(false)}>
              关闭
            </Button>,
            <Button key="export" type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出对比结果
            </Button>,
          ]}
        >
          <Table
            dataSource={getComparedPolicies()}
            columns={[
              {
                title: '政策名称',
                dataIndex: 'title',
                key: 'title',
                width: 200,
                fixed: 'left',
              },
              {
                title: '匹配度',
                dataIndex: 'matchScore',
                key: 'matchScore',
                width: 100,
                render: (score: number) => (
                  <Tag color={getMatchScoreColor(score)}>{score}%</Tag>
                ),
                sorter: (a, b) => a.matchScore - b.matchScore,
              },
              {
                title: '地区',
                dataIndex: 'region',
                key: 'region',
                width: 120,
              },
              {
                title: '级别',
                dataIndex: 'level',
                key: 'level',
                width: 100,
              },
              {
                title: '补贴金额',
                dataIndex: 'subsidy',
                key: 'subsidy',
                width: 120,
                render: (subsidy?: string) => subsidy || '-',
              },
              {
                title: '截止时间',
                dataIndex: 'deadline',
                key: 'deadline',
                width: 120,
                render: (deadline?: string) => deadline || '-',
              },
            ]}
            scroll={{ x: 800 }}
            pagination={false}
          />
        </Modal>

        {/* 政策详情抽屉 */}
        <Drawer
          title={selectedPolicy?.title}
          placement="right"
          width={720}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          {selectedPolicy && (
            <div className={styles.policyDetail}>
              {/* 基本信息 */}
              <div className={styles.detailSection}>
                <Space size={[8, 8]} wrap>
                  {selectedPolicy.tags.map((tag) => (
                    <Tag
                      key={tag}
                      color="blue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleTagClick(tag);
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  <Tag icon={<EnvironmentOutlined />}>{selectedPolicy.region}</Tag>
                  <Tag>{selectedPolicy.level}</Tag>
                  {selectedPolicy.subsidy && (
                    <Tag icon={<DollarOutlined />} color="red">
                      {selectedPolicy.subsidy}
                    </Tag>
                  )}
                </Space>
              </div>

              <Divider />

              {/* 政策概述 */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>
                  <FileTextOutlined /> 政策概述
                </h3>
                <p className={styles.sectionContent}>{selectedPolicy.content.overview}</p>
              </div>

              {/* 奖励金额说明 */}
              {selectedPolicy.content.subsidyDetails.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>
                    <DollarOutlined /> 奖励金额说明
                  </h3>
                  <ul className={styles.listContent}>
                    {selectedPolicy.content.subsidyDetails.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 主要政策依据 */}
              {selectedPolicy.content.policyBasis.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>
                    <FileTextOutlined /> 主要政策依据
                  </h3>
                  <ul className={styles.listContent}>
                    {selectedPolicy.content.policyBasis.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 实务操作提醒 */}
              {selectedPolicy.content.applicationProcess.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>
                    <CheckCircleOutlined /> 实务操作提醒
                  </h3>
                  <ul className={styles.listContent}>
                    {selectedPolicy.content.applicationProcess.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 相关政策 */}
              {selectedPolicy.content.relatedPolicies.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>
                    <RightOutlined /> 相关政策
                  </h3>
                  <div className={styles.relatedPolicies}>
                    {selectedPolicy.content.relatedPolicies.map((item, idx) => (
                      <div key={idx} className={styles.relatedItem}>
                        <RightOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 来源 */}
              {selectedPolicy.sources.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>
                    <FileTextOutlined /> {selectedPolicy.sources.length} 个来源
                  </h3>
                  <Space size={[8, 8]} wrap>
                    {selectedPolicy.sources.map((source, idx) => (
                      <Tag
                        key={idx}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => handleSourceClick(source, selectedPolicy, e)}
                      >
                        {source.name}
                      </Tag>
                    ))}
                  </Space>
                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={(e) => handleViewAllSources(selectedPolicy, e)}
                    >
                      查看所有来源详情
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer>
      </div>
    </PageWrapper>
  );
};

export default AIPolicySearch;
