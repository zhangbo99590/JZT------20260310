import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Tabs, 
  DatePicker, 
  Form,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Collapse,
  Radio,
  Checkbox,
  message,
  Drawer,
  List,
  Affix,
  Statistic,
  AutoComplete,
  Popover,
  Timeline,
  Descriptions,
  FloatButton,
  Progress,
  TreeSelect,
  Empty,
  Carousel,
  Alert,
  Steps,
  Breadcrumb,
} from 'antd';
import PageWrapper from '../../components/PageWrapper';
import { debounce } from '../../utils/performance';
import { 
  SearchOutlined, 
  FilterOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  BookOutlined,
  CalendarOutlined,
  BankOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  SafetyOutlined,
  StarOutlined,
  ShareAltOutlined,
  BellOutlined,
  RobotOutlined,
  GlobalOutlined,
  SortAscendingOutlined,
  TranslationOutlined,
  SendOutlined,
  FileTextOutlined,
  TeamOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  ApartmentOutlined,
  CloseOutlined,
  BulbOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  HeartOutlined,
  QuestionCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  HighlightOutlined,
  LinkOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import type { Dayjs } from 'dayjs';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { Title, Paragraph, Text, Link } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Step } = Steps;

// 类型定义
interface RegulationItem {
  id: string;
  title: string;
  level: string;
  field: string;
  industry: string;
  publishOrg: string;
  publishDate: string;
  effectiveDate: string;
  lastRevisionDate?: string;
  status: 'effective' | 'revised' | 'abolished';
  tags: string[];
  summary: string;
  content?: string;
  viewCount: number;
  downloadCount: number;
  favoriteCount: number;
  hasEnglish: boolean;
  category: string;
  subcategory: string;
  relatedRegulations?: string[];
  revisionHistory?: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
  articleNumber?: number;
  matchScore?: number;
  isNew?: boolean;
}

interface FilterCriteria {
  effectLevel: string;
  fields: string[];
  industries: string[];
  dateRange?: [Dayjs, Dayjs] | null;
  keyword: string;
  showNewOnly?: boolean;
}

interface SearchHistoryItem {
  id: string;
  keyword: string;
  criteria: FilterCriteria;
  timestamp: number;
  resultCount: number;
}

interface SavedFilter {
  id: string;
  name: string;
  criteria: FilterCriteria;
  createdAt: number;
  isFavorite: boolean;
}

const RegulationQuery: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRegulation, setSelectedRegulation] = useState<RegulationItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'latest' | 'viewCount'>('relevance');
  
  // 筛选相关状态
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    effectLevel: '全部',
    fields: [],
    industries: [],
    dateRange: null,
    keyword: '',
    showNewOnly: false
  });
  
  // 搜索相关状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  
  // 保存筛选组合
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [saveFilterVisible, setSaveFilterVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  
  // 对比功能
  const [compareList, setCompareList] = useState<RegulationItem[]>([]);
  const [compareVisible, setCompareVisible] = useState(false);
  
  // 详情页相关
  const [relatedVisible, setRelatedVisible] = useState(false);
  const [versionVisible, setVersionVisible] = useState(false);
  const [highlightText, setHighlightText] = useState<string>('');
  
  // 行业专区
  const [industryStats, setIndustryStats] = useState<any[]>([]);
  

  // 法规分类导航数据
  const categoryTabs = [
    { key: 'all', label: '全部法规', icon: <BookOutlined />, count: 11287 },
    { key: 'labor', label: '劳动法规', icon: <TeamOutlined />, count: 342 },
    { key: 'tax', label: '财税法规', icon: <BankOutlined />, count: 567 },
    { key: 'ip', label: '知识产权', icon: <SafetyOutlined />, count: 198 },
    { key: 'environment', label: '环保法规', icon: <EnvironmentOutlined />, count: 289 },
    { key: 'finance', label: '金融法规', icon: <GlobalOutlined />, count: 423 }
  ];

  // 效力层级选项
  const effectLevelOptions = [
    { value: '全部', label: '全部效力层级' },
    { value: '法律', label: '法律', color: '#ff4d4f' },
    { value: '行政法规', label: '行政法规', color: '#1890ff' },
    { value: '部门规章', label: '部门规章', color: '#52c41a' },
    { value: '地方性法规', label: '地方性法规', color: '#fa8c16' }
  ];

  // 领域分类选项（带统计）
  const fieldOptions = [
    { value: '劳动', label: '劳动法', count: 342 },
    { value: '财税', label: '财税法', count: 567 },
    { value: '知识产权', label: '知识产权', count: 198 },
    { value: '环保', label: '环保法', count: 289 },
    { value: '金融', label: '金融法', count: 423 },
    { value: '建筑', label: '建筑法', count: 156 },
    { value: '食品', label: '食品法', count: 234 },
    { value: '交通', label: '交通法', count: 178 }
  ];

  // 行业分类树形数据
  const industryTreeData = [
    {
      title: '制造业',
      value: 'manufacturing',
      children: [
        { title: '机械制造', value: 'manufacturing-machinery' },
        { title: '电子制造', value: 'manufacturing-electronics' },
        { title: '汽车制造', value: 'manufacturing-automotive' }
      ]
    },
    {
      title: '科技业',
      value: 'technology',
      children: [
        { title: '软件开发', value: 'technology-software' },
        { title: '互联网', value: 'technology-internet' },
        { title: '人工智能', value: 'technology-ai' }
      ]
    },
    {
      title: '零售业',
      value: 'retail',
      children: [
        { title: '线上零售', value: 'retail-online' },
        { title: '线下零售', value: 'retail-offline' }
      ]
    },
    {
      title: '服务业',
      value: 'service',
      children: [
        { title: '金融服务', value: 'service-finance' },
        { title: '医疗服务', value: 'service-medical' },
        { title: '教育服务', value: 'service-education' }
      ]
    }
  ];

  // 时间快捷选项
  const timeShortcuts = [
    { label: '近1年', value: [dayjs().subtract(1, 'year'), dayjs()] },
    { label: '近3年', value: [dayjs().subtract(3, 'year'), dayjs()] },
    { label: '近5年', value: [dayjs().subtract(5, 'year'), dayjs()] },
    { label: '近10年', value: [dayjs().subtract(10, 'year'), dayjs()] }
  ];

  // 模拟法规数据
  const mockData: RegulationItem[] = [
    {
      id: '1',
      title: '中华人民共和国劳动合同法',
      level: '法律',
      field: '劳动',
      industry: 'manufacturing',
      publishOrg: '全国人大常委会',
      publishDate: '2007-06-29',
      effectiveDate: '2008-01-01',
      lastRevisionDate: '2012-12-28',
      status: 'effective',
      tags: ['劳动合同', '劳动关系', '劳动保护'],
      summary: '为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务，保护劳动者的合法权益，构建和发展和谐稳定的劳动关系，制定本法。',
      content: '第一章 总则\n第一条 为了完善劳动合同制度，明确劳动合同双方当事人的权利和义务，保护劳动者的合法权益，构建和发展和谐稳定的劳动关系，制定本法。\n第三十六条 用人单位与劳动者协商一致，可以解除劳动合同。',
      viewCount: 45680,
      downloadCount: 8920,
      favoriteCount: 2345,
      hasEnglish: true,
      category: 'labor',
      subcategory: 'law',
      relatedRegulations: ['2', '3'],
      revisionHistory: [
        { version: '1.0', date: '2007-06-29', changes: '初次发布' },
        { version: '2.0', date: '2012-12-28', changes: '第一次修订：增加劳务派遣相关条款' }
      ],
      articleNumber: 36,
      isNew: false
    },
    {
      id: '2',
      title: '中华人民共和国公司法',
      level: '法律',
      field: '财税',
      industry: 'technology',
      publishOrg: '全国人大常委会',
      publishDate: '2023-12-29',
      effectiveDate: '2024-07-01',
      lastRevisionDate: '2023-12-29',
      status: 'effective',
      tags: ['公司治理', '股东权利', '企业运营'],
      summary: '为了规范公司的组织和行为，保护公司、股东和债权人的合法权益，维护社会经济秩序，促进社会主义市场经济的发展，制定本法。',
      content: '第一章 总则\n第一条 为了规范公司的组织和行为，保护公司、股东和债权人的合法权益，维护社会经济秩序，促进社会主义市场经济的发展，制定本法。',
      viewCount: 28920,
      downloadCount: 5420,
      favoriteCount: 1234,
      hasEnglish: true,
      category: 'tax',
      subcategory: 'law',
      relatedRegulations: ['1', '3'],
      revisionHistory: [
        { version: '7.0', date: '2023-12-29', changes: '第六次修订：全面修订公司治理结构' }
      ],
      isNew: true
    },
    {
      id: '3',
      title: '中华人民共和国民法典',
      level: '法律',
      field: '劳动',
      industry: 'service',
      publishOrg: '全国人大',
      publishDate: '2020-05-28',
      effectiveDate: '2021-01-01',
      status: 'effective',
      tags: ['民事权利', '合同', '侵权责任', '婚姻家庭'],
      summary: '为了保护民事主体的合法权益，调整民事关系，维护社会和经济秩序，适应中国特色社会主义发展要求，弘扬社会主义核心价值观，根据宪法，制定本法。',
      viewCount: 65420,
      downloadCount: 12340,
      favoriteCount: 3456,
      hasEnglish: true,
      category: 'all',
      subcategory: 'law',
      relatedRegulations: ['1', '2'],
      revisionHistory: [
        { version: '1.0', date: '2020-05-28', changes: '初次发布，整合九部法律' }
      ],
      isNew: false
    },
    {
      id: '4',
      title: '企业信息公示暂行条例',
      level: '行政法规',
      field: '财税',
      industry: 'retail',
      publishOrg: '国务院',
      publishDate: '2024-02-20',
      effectiveDate: '2024-04-01',
      lastRevisionDate: '2024-02-20',
      status: 'effective',
      tags: ['企业信息', '公示制度', '市场监管'],
      summary: '为了规范企业信息公示，加强对企业的监督管理，保护交易安全，维护交易秩序，制定本条例。',
      viewCount: 12430,
      downloadCount: 3240,
      favoriteCount: 856,
      hasEnglish: false,
      category: 'tax',
      subcategory: 'regulation',
      relatedRegulations: ['2'],
      revisionHistory: [
        { version: '1.0', date: '2024-02-20', changes: '初次发布' }
      ],
      isNew: true
    },
    {
      id: '5',
      title: '知识产权保护条例',
      level: '部门规章',
      field: '知识产权',
      industry: 'technology',
      publishOrg: '国家知识产权局',
      publishDate: '2023-08-15',
      effectiveDate: '2023-10-01',
      status: 'effective',
      tags: ['专利保护', '商标权', '著作权'],
      summary: '为了加强知识产权保护，促进科技创新和文化繁荣，维护权利人的合法权益，制定本条例。',
      viewCount: 18750,
      downloadCount: 4560,
      favoriteCount: 1123,
      hasEnglish: true,
      category: 'ip',
      subcategory: 'regulation',
      relatedRegulations: [],
      revisionHistory: [
        { version: '1.0', date: '2023-08-15', changes: '初次发布' }
      ],
      isNew: false
    }
  ];

  // 计算筛选后的数据
  const filteredData = useMemo(() => {
    let result = [...mockData];

    // 效力层级筛选
    if (filterCriteria.effectLevel && filterCriteria.effectLevel !== '全部') {
      result = result.filter(item => item.level === filterCriteria.effectLevel);
    }

    // 领域筛选
    if (filterCriteria.fields && filterCriteria.fields.length > 0) {
      result = result.filter(item => filterCriteria.fields.includes(item.field));
    }

    // 行业筛选
    if (filterCriteria.industries && filterCriteria.industries.length > 0) {
      result = result.filter(item => 
        filterCriteria.industries.some(ind => item.industry.startsWith(ind))
      );
    }

    // 时间范围筛选
    if (filterCriteria.dateRange && filterCriteria.dateRange.length === 2) {
      const [start, end] = filterCriteria.dateRange;
      result = result.filter(item => {
        const effectiveDate = dayjs(item.effectiveDate);
        return effectiveDate.isAfter(start) && effectiveDate.isBefore(end);
      });
    }

    // 新增法规筛选
    if (filterCriteria.showNewOnly) {
      result = result.filter(item => item.isNew);
    }

    // 关键词搜索
    if (filterCriteria.keyword) {
      const keyword = filterCriteria.keyword.toLowerCase();
      
      // 检测法条号格式（如：劳动法第36条）
      const articleMatch = keyword.match(/([\u4e00-\u9fa5]+)第(\d+)条/);
      
      if (articleMatch) {
        const [, lawName, articleNum] = articleMatch;
        result = result.filter(item => 
          item.title.includes(lawName) && 
          item.content?.includes(`第${articleNum}条`)
        );
      } else {
        // 常规搜索
        result = result.filter(item => 
          item.title.toLowerCase().includes(keyword) ||
          item.summary.toLowerCase().includes(keyword) ||
          item.content?.toLowerCase().includes(keyword) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword))
        );
      }

      // 计算匹配度
      result = result.map(item => {
        let score = 0;
        const title = item.title.toLowerCase();
        
        // 前缀匹配优先
        if (title.startsWith(keyword)) {
          score += 60;
        } else if (title.includes(keyword)) {
          score += 25;
        }
        
        if (item.summary.toLowerCase().includes(keyword)) {
          score += 15;
        }
        
        // 时效性加分（2020年后）
        if (dayjs(item.publishDate).isAfter('2020-01-01')) {
          score += 10;
        }
        
        return { ...item, matchScore: score };
      });
    }

    // 排序
    if (sortBy === 'relevance' && filterCriteria.keyword) {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => 
        dayjs(b.lastRevisionDate || b.effectiveDate).diff(
          dayjs(a.lastRevisionDate || a.effectiveDate)
        )
      );
    } else if (sortBy === 'viewCount') {
      result.sort((a, b) => b.viewCount - a.viewCount);
    }

    // 置顶3个月内修订的法规
    const threeMonthsAgo = dayjs().subtract(3, 'month');
    const newItems = result.filter(item => 
      item.lastRevisionDate && dayjs(item.lastRevisionDate).isAfter(threeMonthsAgo)
    );
    const oldItems = result.filter(item => 
      !item.lastRevisionDate || dayjs(item.lastRevisionDate).isBefore(threeMonthsAgo)
    );

    return [...newItems, ...oldItems];
  }, [filterCriteria, sortBy]);

  // 搜索建议（防抖）
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        const suggestions = mockData
          .filter(item => item.title.includes(value))
          .slice(0, 5)
          .map(item => item.title);
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchKeyword(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // 执行搜索
  const handleSearch = useCallback((values: any) => {
    setLoading(true);
    setProgress(30);

    const newCriteria: FilterCriteria = {
      effectLevel: values.effectLevel || '全部',
      fields: values.fields || [],
      industries: values.industries || [],
      dateRange: values.dateRange || null,
      keyword: values.keyword || ''
    };

    setFilterCriteria(newCriteria);

    // 保存搜索历史
    if (values.keyword) {
      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        keyword: values.keyword,
        criteria: newCriteria,
        timestamp: Date.now(),
        resultCount: filteredData.length
      };
      
      const newHistory = [historyItem, ...searchHistory].slice(0, 100);
      setSearchHistory(newHistory);
      localStorage.setItem('regulation_search_history', JSON.stringify(newHistory));
    }

    setTimeout(() => {
      setProgress(100);
      setLoading(false);
    }, 500);
  }, [searchHistory, filteredData.length]);

  // 重置筛选
  const handleReset = useCallback(() => {
    searchForm.resetFields();
    setFilterCriteria({
      effectLevel: '全部',
      fields: [],
      industries: [],
      dateRange: null,
      keyword: '',
      showNewOnly: false
    });
    setSearchKeyword('');
    message.success('筛选条件已重置');
  }, [searchForm]);

  // 保存筛选组合
  const handleSaveFilter = useCallback(() => {
    if (!filterName || filterName.length > 20) {
      message.warning('请输入不超过20字符的组合名称');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      criteria: filterCriteria,
      createdAt: Date.now(),
      isFavorite: false
    };

    const newSavedFilters = [newFilter, ...savedFilters];
    setSavedFilters(newSavedFilters);
    localStorage.setItem('regulation_saved_filters', JSON.stringify(newSavedFilters));
    
    setSaveFilterVisible(false);
    setFilterName('');
    message.success('筛选组合已保存');
  }, [filterName, filterCriteria, savedFilters]);

  // 应用保存的筛选
  const handleApplySavedFilter = useCallback((filter: SavedFilter) => {
    setFilterCriteria(filter.criteria);
    searchForm.setFieldsValue({
      effectLevel: filter.criteria.effectLevel,
      fields: filter.criteria.fields,
      industries: filter.criteria.industries,
      dateRange: filter.criteria.dateRange,
      keyword: filter.criteria.keyword
    });
    message.success(`已应用筛选组合：${filter.name}`);
  }, [searchForm]);

  // 查看详情
  const handleViewDetail = useCallback((record: RegulationItem) => {
    setSelectedRegulation(record);
    setDetailVisible(true);
  }, []);

  // 添加到对比
  const handleAddToCompare = useCallback((record: RegulationItem) => {
    if (compareList.find(item => item.id === record.id)) {
      message.warning('该法规已在对比列表中');
      return;
    }
    if (compareList.length >= 3) {
      message.warning('最多只能对比3个法规');
      return;
    }
    setCompareList([...compareList, record]);
    message.success(`已添加到对比列表（${compareList.length + 1}/3）`);
  }, [compareList]);

  // 删除搜索历史
  const handleDeleteHistory = useCallback((id: string) => {
    const newHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(newHistory);
    localStorage.setItem('regulation_search_history', JSON.stringify(newHistory));
    message.success('已删除');
  }, [searchHistory]);

  // 清空搜索历史
  const handleClearHistory = useCallback(() => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有搜索历史吗？',
      onOk: () => {
        setSearchHistory([]);
        localStorage.removeItem('regulation_search_history');
        message.success('搜索历史已清空');
      }
    });
  }, []);

  // 高亮文本
  const handleHighlight = useCallback((text: string) => {
    setHighlightText(text);
    message.success('已标记');
  }, []);

  // 表格列配置
  const columns: ColumnsType<RegulationItem> = [
    {
      title: '法规名称',
      dataIndex: 'title',
      key: 'title',
      width: 350,
      fixed: 'left',
      render: (text: string, record: RegulationItem) => (
        <div>
          <Space>
            <Button 
              type="link" 
              onClick={() => handleViewDetail(record)}
              style={{ padding: 0, height: 'auto', fontWeight: 500 }}
            >
              {text}
            </Button>
            {record.isNew && (
              <Badge count="NEW" style={{ backgroundColor: '#52c41a' }} />
            )}
            {record.hasEnglish && (
              <Tag color="blue" icon={<TranslationOutlined />}>EN</Tag>
            )}
          </Space>
          {record.matchScore && record.matchScore > 0 && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                匹配度：{record.matchScore}%
              </Text>
          </div>
          )}
          <div style={{ marginTop: 4 }}>
            <Space size={4}>
              {record.tags.slice(0, 3).map(tag => (
                <Tag key={tag} style={{ fontSize: 11 }}>{tag}</Tag>
              ))}
            </Space>
          </div>
        </div>
      )
    },
    {
      title: '效力层级',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: string) => {
        const colors: Record<string, string> = {
          '法律': 'red',
          '行政法规': 'blue',
          '部门规章': 'green',
          '地方性法规': 'orange'
        };
        return <Tag color={colors[level] || 'default'}>{level}</Tag>;
      }
    },
    {
      title: '领域',
      dataIndex: 'field',
      key: 'field',
      width: 100
    },
    {
      title: '发布机关',
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      width: 150
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120
    },
    {
      title: '最后修订',
      dataIndex: 'lastRevisionDate',
      key: 'lastRevisionDate',
      width: 120,
      render: (date: string, record: RegulationItem) => {
        if (!date) return '-';
        const isRecent = dayjs(date).isAfter(dayjs().subtract(3, 'month'));
        return (
          <Space>
            <Text>{date}</Text>
            {isRecent && (
              <Tooltip title="3个月内修订">
                <Badge status="success" />
              </Tooltip>
            )}
          </Space>
        );
      }
    },
    {
      title: '统计',
      key: 'stats',
      width: 120,
      render: (_: any, record: RegulationItem) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <EyeOutlined /> {record.viewCount}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <DownloadOutlined /> {record.downloadCount}
          </Text>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusConfig = {
          effective: { color: 'success', text: '有效' },
          revised: { color: 'warning', text: '修订' },
          abolished: { color: 'error', text: '废止' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge status={config.color as any} text={config.text} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: RegulationItem) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="加入对比">
            <Button 
              type="text" 
              size="small" 
              icon={<SwapOutlined />}
              onClick={() => handleAddToCompare(record)}
              disabled={compareList.length >= 3 || compareList.some(item => item.id === record.id)}
            />
          </Tooltip>
          <Tooltip title="下载">
            <Button 
              type="text" 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={() => message.success(`开始下载：${record.title}`)}
            />
          </Tooltip>
          <Tooltip title="收藏">
            <Button 
              type="text" 
              size="small" 
              icon={<HeartOutlined />}
              onClick={() => message.success(`已收藏：${record.title}`)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 组件挂载时加载数据
  useEffect(() => {
    // 加载搜索历史
    const savedHistory = localStorage.getItem('regulation_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // 加载保存的筛选组合
    const savedFiltersData = localStorage.getItem('regulation_saved_filters');
    if (savedFiltersData) {
      setSavedFilters(JSON.parse(savedFiltersData));
    }

    // 清理超过90天的历史记录
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const validHistory = searchHistory.filter(item => item.timestamp >= ninetyDaysAgo);
    if (validHistory.length !== searchHistory.length) {
      setSearchHistory(validHistory);
      localStorage.setItem('regulation_search_history', JSON.stringify(validHistory));
    }
  }, [searchHistory]);


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
            title: '法规查询',
          },
        ]}
      />
      <FloatButton.BackTop />


      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <BookOutlined style={{ marginRight: 12 }} />
              法规检索
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
              提供全面的法律法规检索服务，支持多维度筛选、精准搜索和智能分析
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<HistoryOutlined />}
                onClick={() => setHistoryVisible(true)}
              >
                搜索历史
              </Button>
              <Button 
                icon={<SaveOutlined />}
                onClick={() => setSaveFilterVisible(true)}
              >
                保存筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            bodyStyle={{ padding: '20px' }}
            onClick={() => {
              handleReset();
              message.info('已显示全部法规');
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>法规总数</span>}
              value={mockData.length}
              prefix={<BookOutlined style={{ color: '#fff', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#fff', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {value?.toLocaleString()}
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>条</Text>
                </span>
              )}
            />
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <RiseOutlined style={{ marginRight: '4px' }} />
              较上月增长 12%
            </div>
            <div style={{ 
              marginTop: '4px', 
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center'
            }}>
              点击查看全部法规
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(240, 147, 251, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            bodyStyle={{ padding: '20px' }}
            onClick={() => {
              if (filteredData.length === mockData.length) {
                message.info('当前已显示全部法规，无需筛选');
              } else {
                message.success(`当前筛选结果：${filteredData.length} 条法规`);
              }
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>筛选结果</span>}
              value={filteredData.length}
              prefix={<FilterOutlined style={{ color: '#fff', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#fff', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {value?.toLocaleString()}
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>条</Text>
                </span>
              )}
            />
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <SearchOutlined style={{ marginRight: '4px' }} />
              匹配度 {filteredData.length > 0 ? Math.round((filteredData.length / mockData.length) * 100) : 0}%
            </div>
            <div style={{ 
              marginTop: '4px', 
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center'
            }}>
              点击查看筛选详情
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 12,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            bodyStyle={{ padding: '20px' }}
            onClick={() => {
              const newItems = mockData.filter(item => item.isNew);
              if (newItems.length > 0) {
                setFilterCriteria({
                  effectLevel: '全部',
                  fields: [],
                  industries: [],
                  dateRange: null,
                  keyword: '',
                  showNewOnly: true
                });
                message.success(`已筛选出 ${newItems.length} 条新增法规`);
              } else {
                message.info('暂无新增法规');
              }
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>本月新增</span>}
              value={mockData.filter(item => item.isNew).length}
              prefix={<RiseOutlined style={{ color: '#fff', fontSize: '20px' }} />}
              valueStyle={{ 
                color: '#fff', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>条</span>}
            />
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <CalendarOutlined style={{ marginRight: '4px' }} />
              最新更新：{dayjs().format('MM-DD')}
            </div>
            <div style={{ 
              marginTop: '4px', 
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'center'
            }}>
              点击筛选新增法规
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ 
              borderRadius: 12,
              background: compareList.length > 0 
                ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
              border: 'none',
              boxShadow: compareList.length > 0 
                ? '0 4px 20px rgba(250, 112, 154, 0.15)'
                : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              cursor: compareList.length > 0 ? 'pointer' : 'default'
            }}
            bodyStyle={{ padding: '20px' }}
            onClick={() => compareList.length > 0 && setCompareVisible(true)}
          >
            <Statistic
              title={
                <span style={{ 
                  color: compareList.length > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)', 
                  fontSize: '14px', 
                  fontWeight: 500 
                }}>
                  对比中
                </span>
              }
              value={compareList.length}
              prefix={
                <SwapOutlined style={{ 
                  color: compareList.length > 0 ? '#fff' : '#999', 
                  fontSize: '20px' 
                }} />
              }
              valueStyle={{ 
                color: compareList.length > 0 ? '#fff' : '#666', 
                fontSize: '28px', 
                fontWeight: 'bold',
                textShadow: compareList.length > 0 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              suffix={
                <span style={{ 
                  color: compareList.length > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)', 
                  fontSize: '16px' 
                }}>
                  / 3
                </span>
              }
            />
            <div style={{ 
              marginTop: '8px', 
              padding: '4px 8px', 
              background: compareList.length > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)', 
              borderRadius: '6px',
              fontSize: '12px',
              color: compareList.length > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
            }}>
              {compareList.length > 0 ? (
                <>
                  <EyeOutlined style={{ marginRight: '4px' }} />
                  点击查看对比
                </>
              ) : (
                <>
                  <SwapOutlined style={{ marginRight: '4px' }} />
                  暂无对比项目
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 法规分类导航 */}
      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          items={categoryTabs.map(tab => ({
            key: tab.key,
            label: (
              <Space>
                {tab.icon}
                <span>{tab.label}</span>
                <Badge count={tab.count} style={{ backgroundColor: '#1890ff' }} />
              </Space>
            )
          }))}
        />
      </Card>

      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: 24 }} title="多维度筛选">
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={16}>
            {/* 关键词搜索 */}
            <Col xs={24} md={8}>
              <Form.Item 
                label={
                  <Space>
                    <span>关键词搜索</span>
                    <Tooltip title='支持法规名称、条款内容、法条号（如"劳动法第36条"）'>
                      <QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Space>
                }
                name="keyword"
              >
                <AutoComplete
                  options={searchSuggestions.map(s => ({ value: s }))}
                  onChange={handleSearchChange}
                  placeholder="输入法规名称或法条号..."
                >
                <Input 
                  prefix={<SearchOutlined />}
                    suffix={
                      searchKeyword && (
                        <CloseOutlined 
                          onClick={() => {
                            setSearchKeyword('');
                            setSearchSuggestions([]);
                            searchForm.setFieldValue('keyword', '');
                          }}
                          style={{ cursor: 'pointer', color: '#8c8c8c' }}
                        />
                      )
                    }
                />
                </AutoComplete>
              </Form.Item>
            </Col>

            {/* 效力层级 */}
            <Col xs={12} md={4}>
              <Form.Item label="效力层级" name="effectLevel" initialValue="全部">
                <Select>
                  {effectLevelOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        {option.color && (
                          <Badge color={option.color} />
                        )}
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* 领域分类 */}
            <Col xs={12} md={4}>
              <Form.Item label="领域分类" name="fields">
                <Select 
                  mode="multiple"
                  placeholder="选择领域"
                  maxTagCount={2}
                  showSearch
                  optionFilterProp="children"
                >
                  {fieldOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <span>{option.label}</span>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {option.count}
                        </Text>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* 行业分类 */}
            <Col xs={12} md={4}>
              <Form.Item label="行业分类" name="industries">
                <TreeSelect
                  treeData={industryTreeData}
                  placeholder="选择行业"
                  multiple
                  maxTagCount={2}
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                />
              </Form.Item>
            </Col>

            {/* 生效时间 */}
            <Col xs={12} md={4}>
              <Form.Item label="生效时间" name="dateRange">
                <RangePicker 
                  style={{ width: '100%' }}
                  presets={timeShortcuts.map(item => ({
                    label: item.label,
                    value: item.value as [Dayjs, Dayjs]
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          
          {/* 操作按钮 */}
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                  搜索
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button icon={<SaveOutlined />} onClick={() => setSaveFilterVisible(true)}>
                  保存筛选
                </Button>
              </Space>
            </Col>
            <Col>
                          <Space>
                <Text type="secondary">排序方式：</Text>
                <Select value={sortBy} onChange={setSortBy} style={{ width: 140 }}>
                  <Option value="relevance">
                    <Space>
                      <SortAscendingOutlined />
                      相关性优先
                          </Space>
                  </Option>
                  <Option value="latest">
                    <Space>
                      <ClockCircleOutlined />
                      最新修订
                    </Space>
                  </Option>
                  <Option value="viewCount">
                    <Space>
                      <EyeOutlined />
                      浏览量
                    </Space>
                  </Option>
                </Select>
              </Space>
            </Col>
                          </Row>

          {/* 进度条 */}
          {loading && (
            <div style={{ marginTop: 16 }}>
              <Progress percent={progress} status="active" showInfo={false} />
            </div>
          )}
        </Form>

        {/* 保存的筛选组合 */}
        {savedFilters.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Space style={{ marginBottom: 8 }}>
              <SaveOutlined style={{ color: '#1890ff' }} />
              <Text strong>常用筛选组合：</Text>
            </Space>
            <Space wrap>
              {savedFilters.map(filter => (
                <Tag
                  key={filter.id}
                  color="blue"
                  style={{ cursor: 'pointer', padding: '4px 12px' }}
                  onClick={() => handleApplySavedFilter(filter)}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    const newFilters = savedFilters.filter(f => f.id !== filter.id);
                    setSavedFilters(newFilters);
                    localStorage.setItem('regulation_saved_filters', JSON.stringify(newFilters));
                  }}
                >
                  {filter.isFavorite && <StarOutlined />} {filter.name}
                </Tag>
                      ))}
                    </Space>
          </div>
        )}
            </Card>

      {/* 搜索结果 */}
          <Card
            title={
              <Space>
                <Text>搜索结果</Text>
            <Badge count={filteredData.length} showZero style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
          >
        {filteredData.length === 0 ? (
          <Empty 
            description="暂无符合条件的法规"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleReset}>重置筛选条件</Button>
          </Empty>
        ) : (
            <Table
              columns={columns}
            dataSource={filteredData}
              loading={loading}
            scroll={{ x: 1400 }}
              pagination={{
              total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            rowKey="id"
            />
        )}
          </Card>

      {/* 对比浮动按钮 */}
      {compareList.length > 0 && (
        <Affix style={{ position: 'fixed', bottom: 24, right: 24 }}>
          <Badge count={compareList.length} offset={[-5, 5]}>
            <Button 
              type="primary" 
              size="large"
              icon={<SwapOutlined />}
              onClick={() => setCompareVisible(true)}
              style={{
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
                height: 56
              }}
            >
              对比法规
            </Button>
          </Badge>
        </Affix>
      )}

      {/* 搜索历史抽屉 */}
      <Drawer
        title={
          <Space>
            <HistoryOutlined />
            搜索历史
            <Text type="secondary" style={{ fontSize: 14 }}>
              （最近90天，最多100条）
            </Text>
          </Space>
        }
        placement="right"
        width={500}
        open={historyVisible}
        onClose={() => setHistoryVisible(false)}
        extra={
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleClearHistory}
          >
            清空全部
          </Button>
        }
      >
        {searchHistory.length === 0 ? (
          <Empty description="暂无搜索历史" />
            ) : (
              <List
            dataSource={searchHistory}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => {
                      searchForm.setFieldsValue({
                        keyword: item.keyword,
                        effectLevel: item.criteria.effectLevel,
                        fields: item.criteria.fields,
                        industries: item.criteria.industries,
                        dateRange: item.criteria.dateRange
                      });
                      setFilterCriteria(item.criteria);
                      setHistoryVisible(false);
                      message.success('已恢复搜索条件');
                    }}
                  >
                    重新执行
                  </Button>,
                  <Button 
                    type="link" 
                    size="small"
                    danger
                    onClick={() => handleDeleteHistory(item.id)}
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <SearchOutlined />
                      <Text strong>{item.keyword || '筛选条件'}</Text>
                      <Tag color="blue">{item.resultCount} 条结果</Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined /> {dayjs(item.timestamp).fromNow()}
                      </Text>
                      {item.criteria.fields.length > 0 && (
                        <Space size={4}>
                          {item.criteria.fields.map(field => (
                            <Tag key={field} style={{ fontSize: 11 }}>{field}</Tag>
                          ))}
                        </Space>
                      )}
                    </Space>
                  }
                />
                  </List.Item>
                )}
              />
            )}
      </Drawer>
          
      {/* 保存筛选组合弹窗 */}
      <Modal
        title="保存筛选组合"
        open={saveFilterVisible}
        onOk={handleSaveFilter}
        onCancel={() => {
          setSaveFilterVisible(false);
          setFilterName('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item 
            label="组合名称" 
            required
            help="限20字符以内"
          >
              <Input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="例如：制造业劳动法规"
              maxLength={20}
              showCount
            />
          </Form.Item>
          <Alert
            message="当前筛选条件"
            description={
              <Space direction="vertical" size={4}>
                <Text>效力层级：{filterCriteria.effectLevel}</Text>
                {filterCriteria.fields.length > 0 && (
                  <Text>领域：{filterCriteria.fields.join('、')}</Text>
                )}
                {filterCriteria.industries.length > 0 && (
                  <Text>行业：{filterCriteria.industries.length} 个</Text>
                )}
                {filterCriteria.keyword && (
                  <Text>关键词：{filterCriteria.keyword}</Text>
                )}
              </Space>
            }
            type="info"
            showIcon
          />
        </Form>
      </Modal>

      {/* 法规对比弹窗 */}
      <Modal
        title={
          <Space>
            <SwapOutlined />
            <span>法规对比</span>
            <Badge count={compareList.length} />
          </Space>
        }
        open={compareVisible}
        onCancel={() => setCompareVisible(false)}
        width={1200}
        footer={
          <Space>
            <Button onClick={() => setCompareList([])}>清空对比</Button>
            <Button type="primary" onClick={() => setCompareVisible(false)}>
              关闭
            </Button>
          </Space>
        }
      >
        <Row gutter={16}>
          {compareList.map((item, index) => (
            <Col span={8} key={item.id}>
              <Card 
                size="small" 
                title={
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>对比项 {index + 1}</span>
                    <Button 
                      type="text" 
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => setCompareList(compareList.filter(c => c.id !== item.id))}
                    />
        </div>
                }
              >
                <Title level={5} ellipsis={{ rows: 2 }}>{item.title}</Title>
                <Divider style={{margin: '12px 0'}} />
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="效力层级">
                    <Tag color="blue">{item.level}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="领域">{item.field}</Descriptions.Item>
                  <Descriptions.Item label="发布机关">{item.publishOrg}</Descriptions.Item>
                  <Descriptions.Item label="生效日期">{item.effectiveDate}</Descriptions.Item>
                  <Descriptions.Item label="浏览量">{item.viewCount}</Descriptions.Item>
                </Descriptions>
              </Card>
              </Col>
            ))}
          </Row>
      </Modal>

      {/* 法规详情弹窗 */}
      <Modal
        title={
          <Space>
            <BookOutlined />
            法规详情
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1000}
        footer={
          <Space>
            <Button onClick={() => setRelatedVisible(true)}>
              <LinkOutlined /> 关联法规
            </Button>
            {selectedRegulation?.revisionHistory && selectedRegulation.revisionHistory.length > 1 && (
              <Button onClick={() => setVersionVisible(true)}>
                <HistoryOutlined /> 版本历史
              </Button>
            )}
            <Button onClick={() => message.success('开始下载')}>
              <DownloadOutlined /> 下载
            </Button>
            <Button type="primary" onClick={() => setDetailVisible(false)}>
              关闭
            </Button>
          </Space>
        }
      >
        {selectedRegulation && (
          <div>
            {/* 基本信息 */}
            <Row gutter={[16, 16]} style={{marginBottom: 16}}>
              <Col span={24}>
                <Title level={4} style={{marginBottom: 8}}>{selectedRegulation.title}</Title>
                <Space wrap>
                  <Tag color="blue">{selectedRegulation.level}</Tag>
                <Badge 
                  status={selectedRegulation.status === 'effective' ? 'success' : 'warning'} 
                  text={selectedRegulation.status === 'effective' ? '有效' : '修订'}
                  />
                  {selectedRegulation.isNew && (
                    <Badge count="NEW" style={{ backgroundColor: '#52c41a' }} />
                  )}
                  {selectedRegulation.hasEnglish && (
                    <Tag color="blue"><TranslationOutlined /> 提供英文版本</Tag>
                  )}
                </Space>
              </Col>
            </Row>
            
            {/* 元数据 */}
            <Descriptions bordered column={2} size="small" style={{marginBottom: 16}}>
              <Descriptions.Item label="领域">{selectedRegulation.field}</Descriptions.Item>
              <Descriptions.Item label="行业">{selectedRegulation.industry}</Descriptions.Item>
              <Descriptions.Item label="发布机关">{selectedRegulation.publishOrg}</Descriptions.Item>
              <Descriptions.Item label="发布日期">{selectedRegulation.publishDate}</Descriptions.Item>
              <Descriptions.Item label="生效日期">{selectedRegulation.effectiveDate}</Descriptions.Item>
              <Descriptions.Item label="最后修订">
                {selectedRegulation.lastRevisionDate || '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 统计数据 */}
            <Row gutter={16} style={{marginBottom: 16}}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="浏览量"
                    value={selectedRegulation.viewCount}
                    prefix={<EyeOutlined />}
                    valueStyle={{fontSize: 20}}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="下载量"
                    value={selectedRegulation.downloadCount}
                    prefix={<DownloadOutlined />}
                    valueStyle={{fontSize: 20}}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="收藏量"
                    value={selectedRegulation.favoriteCount}
                    prefix={<HeartOutlined />}
                    valueStyle={{fontSize: 20}}
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider />
            
            {/* 标签 */}
            <div style={{marginBottom: 16}}>
              <Text strong>标签：</Text>
              <div style={{marginTop: 8}}>
                <Space wrap>
                  {selectedRegulation.tags.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </div>
            </div>
            
            {/* 内容摘要 */}
            <div style={{marginBottom: 16}}>
              <Text strong>内容摘要：</Text>
              <Paragraph style={{marginTop: 8, background: '#f5f5f5', padding: 16, borderRadius: 6}}>
                {selectedRegulation.summary}
              </Paragraph>
            </div>

            {/* 原文展示 */}
            {selectedRegulation.content && (
              <div>
                <Space style={{marginBottom: 8}}>
                  <Text strong>法规原文：</Text>
                  <Tooltip title="黄色高亮">
                    <Button 
                      size="small" 
                      icon={<HighlightOutlined />}
                      style={{ backgroundColor: '#fff59d' }}
                      onClick={() => handleHighlight('yellow')}
                    />
                  </Tooltip>
                  <Tooltip title="蓝色高亮">
                    <Button 
                      size="small" 
                      icon={<HighlightOutlined />}
                      style={{ backgroundColor: '#90caf9' }}
                      onClick={() => handleHighlight('blue')}
                    />
                  </Tooltip>
                  <Tooltip title="红色高亮">
                    <Button 
                      size="small" 
                      icon={<HighlightOutlined />}
                      style={{ backgroundColor: '#ef9a9a' }}
                      onClick={() => handleHighlight('red')}
                    />
                  </Tooltip>
                </Space>
                <Paragraph 
                  style={{
                    marginTop: 8, 
                    background: '#fff', 
                    padding: 16, 
                    borderRadius: 6,
                    border: '1px solid #d9d9d9',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 2
                  }}
                >
                  {selectedRegulation.content}
                </Paragraph>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 关联法规弹窗 */}
      <Modal
        title={
          <Space>
            <LinkOutlined />
            关联法规
          </Space>
        }
        open={relatedVisible}
        onCancel={() => setRelatedVisible(false)}
        width={800}
        footer={
          <Button type="primary" onClick={() => setRelatedVisible(false)}>
            关闭
          </Button>
        }
      >
        {selectedRegulation && selectedRegulation.relatedRegulations && (
          <List
            dataSource={mockData.filter(item => 
              selectedRegulation.relatedRegulations?.includes(item.id)
            )}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => {
                    setRelatedVisible(false);
                    handleViewDetail(item);
                  }}>
                    查看详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {item.title}
                      <Tag color="red">{item.level}</Tag>
                    </Space>
                  }
                  description={
                    <Space>
                      <Text type="secondary">{item.publishOrg}</Text>
                      <Text type="secondary">{item.effectiveDate}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* 版本历史弹窗 */}
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            版本历史
          </Space>
        }
        open={versionVisible}
        onCancel={() => setVersionVisible(false)}
        width={700}
        footer={
          <Button type="primary" onClick={() => setVersionVisible(false)}>
            关闭
          </Button>
        }
      >
        {selectedRegulation && selectedRegulation.revisionHistory && (
          <Timeline
            items={selectedRegulation.revisionHistory.map((revision, index) => ({
              color: index === 0 ? 'green' : 'blue',
              children: (
                <div>
                  <div style={{marginBottom: 8}}>
                    <Space>
                      <Tag color={index === 0 ? 'green' : 'blue'}>{revision.version}</Tag>
                      <Text strong>{revision.date}</Text>
                    </Space>
                  </div>
                  <Paragraph>{revision.changes}</Paragraph>
                </div>
              )
            }))}
          />
        )}
      </Modal>
    </PageWrapper>
  );
};

export default RegulationQuery;
