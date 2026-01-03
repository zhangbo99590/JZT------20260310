import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography,
  Tag,
  Space,
  Button, 
  Divider, 
  Descriptions,
  Timeline,
  Tabs,
  Badge,
  Tooltip,
  Progress,
  Statistic,
  Alert,
  List,
  Drawer,
  Modal,
  Table,
  Collapse,
  Rate,
  FloatButton,
  Affix,
  Empty,
} from 'antd';
import PageWrapper from '../../components/PageWrapper';
import { 
  ArrowLeftOutlined, 
  FileTextOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  BankOutlined,
  UserOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  TagsOutlined,
  LinkOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
  LikeOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SafeECharts from '../../components/SafeECharts';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// 案例详情数据接口
interface CaseDetailData {
  id: string;
  title: string;
  caseNumber: string;
  caseType: string;
  court: string;
  courtLevel: string;
  judge: string;
  trialDate: string;
  verdict: '企业胜诉' | '个人胜诉' | '调解结案';
  parties: {
    plaintiff: string;
    defendant: string;
    thirdParty?: string;
  };
  contractInfo: {
    contractType: string;
    contractAmount: string;
    contractSubject: string;
    paymentTerms: string;
    performancePeriod: string;
    disputeType: string;
    keyIssues: string[];
  };
  caseAnalysis: {
    disputeFocus: string[];
    keyFindings: string[];
    judgmentPoints: string[];
    legalBasis: string[];
  };
  relatedStatutes: Array<{
    title: string;
    level: string;
    article: string;
    content: string;
    applicability: string;
  }>;
  caseTimeline: Array<{
    date: string;
    event: string;
    description: string;
    status: 'completed' | 'processing' | 'pending';
  }>;
  similarCases: Array<{
    id: string;
    title: string;
    similarity: number;
    verdict: string;
    court: string;
  }>;
  documents: Array<{
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  statistics: {
    viewCount: number;
    downloadCount: number;
    favoriteCount: number;
    shareCount: number;
    rating: number;
    ratingCount: number;
  };
}

// 模拟案例详情数据库
const mockCaseDetails: Record<string, CaseDetailData> = {
  'C202501': {
    id: 'C202501',
    title: '华盛科技与启航制造买卖合同违约纠纷',
    caseNumber: '(2025)京01民初123号',
    caseType: '合同纠纷',
    court: '北京市第一中级人民法院',
    courtLevel: '中级法院',
    judge: '张法官',
    trialDate: '2025-01-15',
    verdict: '企业胜诉',
    parties: {
      plaintiff: '华盛科技有限公司',
      defendant: '启航制造集团有限公司',
    },
  contractInfo: {
    contractType: '买卖合同',
    contractAmount: '500万元',
    contractSubject: '精密机械设备及配套系统',
    paymentTerms: '合同签订后30日内支付30%，设备验收合格后支付余款',
    performancePeriod: '合同签订后90日内完成交付',
    disputeType: '逾期交付违约',
    keyIssues: ['逾期交付', '违约金计算', '损失赔偿', '合同解除'],
  },
  caseAnalysis: {
    disputeFocus: ['交付时间认定', '不可抗力抗辩', '违约金调整', '实际损失计算'],
    keyFindings: [
      '被告未能在约定期限内交付设备构成违约',
      '疫情影响不构成不可抗力免责事由',
      '原告因设备延期交付遭受的停工损失应予赔偿',
      '合同约定的违约金过高，应予适当调整',
    ],
    judgmentPoints: [
      '合同履行中的时间要求应严格执行',
      '违约金调整应综合考虑违约程度和实际损失',
      '企业经营损失的举证责任和认定标准',
    ],
    legalBasis: [
      '《民法典》第五百七十七条',
      '《民法典》第五百八十五条',
      '《民法典》第五百九十条',
      '《最高人民法院关于审理买卖合同纠纷案件适用法律问题的解释》',
    ],
  },
  relatedStatutes: [
    {
      title: '《民法典》第五百七十七条',
      level: '法律',
      article: '第五百七十七条',
      content: '当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。',
      applicability: '适用于合同违约责任的基本认定',
    },
    {
      title: '《民法典》第五百八十五条',
      level: '法律',
      article: '第五百八十五条',
      content: '当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金，也可以约定因违约产生的损失赔偿额的计算方法。',
      applicability: '适用于违约金条款的效力认定和调整',
    },
    {
      title: '《民法典》第五百九十条',
      level: '法律',
      article: '第五百九十条',
      content: '当事人一方因不可抗力不能履行合同的，根据不可抗力的影响，部分或者全部免除责任，但是法律另有规定的除外。',
      applicability: '适用于不可抗力免责事由的认定',
    },
  ],
  caseTimeline: [
    {
      date: '2024-03-15',
      event: '合同签订',
      description: '双方签订设备采购合同，约定90日内交付',
      status: 'completed',
    },
    {
      date: '2024-06-15',
      event: '交付期限届满',
      description: '约定交付期限届满，被告未能按时交付设备',
      status: 'completed',
    },
    {
      date: '2024-07-01',
      event: '催告履行',
      description: '原告书面催告被告履行交付义务',
      status: 'completed',
    },
    {
      date: '2024-08-15',
      event: '提起诉讼',
      description: '原告向法院提起违约责任诉讼',
      status: 'completed',
    },
    {
      date: '2025-01-15',
      event: '一审判决',
      description: '法院作出一审判决，支持原告主要诉讼请求',
      status: 'completed',
    },
  ],
  similarCases: [
    {
      id: 'C202502',
      title: '恒信物流与远航电商平台服务费争议',
      similarity: 85,
      verdict: '调解结案',
      court: '上海市浦东新区人民法院',
    },
    {
      id: 'C202503',
      title: '星辰传媒与创意制作团队著作权使用纠纷',
      similarity: 78,
      verdict: '企业胜诉',
      court: '广东省高级人民法院',
    },
  ],
  documents: [
    {
      name: '起诉状.pdf',
      type: 'PDF',
      size: '2.3MB',
      url: '/documents/complaint.pdf',
    },
    {
      name: '买卖合同.pdf',
      type: 'PDF',
      size: '1.8MB',
      url: '/documents/contract.pdf',
    },
    {
      name: '一审判决书.pdf',
      type: 'PDF',
      size: '3.2MB',
      url: '/documents/judgment.pdf',
    },
  ],
    statistics: {
      viewCount: 1542,
      downloadCount: 324,
      favoriteCount: 89,
      shareCount: 45,
      rating: 4.6,
      ratingCount: 23,
    },
  },
  'CASE001': {
    id: 'CASE001',
    title: '某科技公司与供应商买卖合同纠纷案',
    caseNumber: '(2024)京01民初1234号',
    caseType: '合同纠纷',
    court: '北京市第一中级人民法院',
    courtLevel: '中级法院',
    judge: '李法官',
    trialDate: '2024-11-15',
    verdict: '企业胜诉',
    parties: {
      plaintiff: '某科技有限公司',
      defendant: '某供应商有限公司',
    },
    contractInfo: {
      contractType: '买卖合同',
      contractAmount: '50万元',
      contractSubject: '电子元器件及配套设备',
      paymentTerms: '合同签订后15日内支付50%，货物验收合格后支付余款',
      performancePeriod: '合同签订后60日内完成交付',
      disputeType: '逾期交货',
      keyIssues: ['逾期交货', '违约金', '经济损失'],
    },
    caseAnalysis: {
      disputeFocus: ['交货时间认定', '违约责任承担', '损失赔偿范围'],
      keyFindings: [
        '被告未能在约定期限内交付货物构成违约',
        '原告因货物延期交付遭受的生产延误损失应予赔偿',
        '违约金计算符合合同约定',
      ],
      judgmentPoints: [
        '合同履行中的时间要求应严格执行',
        '违约金应综合考虑违约程度和实际损失',
      ],
      legalBasis: [
        '《民法典》第五百七十七条',
        '《民法典》第五百八十五条',
      ],
    },
    relatedStatutes: [
      {
        title: '《民法典》第五百七十七条',
        level: '法律',
        article: '第五百七十七条',
        content: '当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。',
        applicability: '适用于合同违约责任的基本认定',
      },
    ],
    caseTimeline: [
      {
        date: '2024-03-15',
        event: '合同签订',
        description: '双方签订采购合同，约定60日内交付',
        status: 'completed',
      },
      {
        date: '2024-05-15',
        event: '交付期限届满',
        description: '约定交付期限届满，被告未能按时交付货物',
        status: 'completed',
      },
      {
        date: '2024-08-15',
        event: '提起诉讼',
        description: '原告向法院提起违约责任诉讼',
        status: 'completed',
      },
      {
        date: '2024-11-15',
        event: '一审判决',
        description: '法院作出一审判决，支持原告诉讼请求',
        status: 'completed',
      },
    ],
    similarCases: [
      {
        id: 'CASE002',
        title: '制造企业劳动合同竞业限制纠纷案',
        similarity: 75,
        verdict: '企业败诉',
        court: '上海市第二中级人民法院',
      },
    ],
    documents: [
      {
        name: '起诉状.pdf',
        type: 'PDF',
        size: '1.5MB',
        url: '/documents/complaint.pdf',
      },
      {
        name: '买卖合同.pdf',
        type: 'PDF',
        size: '1.2MB',
        url: '/documents/contract.pdf',
      },
    ],
    statistics: {
      viewCount: 1245,
      downloadCount: 280,
      favoriteCount: 65,
      shareCount: 32,
      rating: 4.8,
      ratingCount: 18,
    },
  },
  'CASE002': {
    id: 'CASE002',
    title: '制造企业劳动合同竞业限制纠纷案',
    caseNumber: '(2024)沪02民终5678号',
    caseType: '劳动争议',
    court: '上海市第二中级人民法院',
    courtLevel: '中级法院',
    judge: '王法官',
    trialDate: '2024-10-20',
    verdict: '个人胜诉',
    parties: {
      plaintiff: '某制造企业',
      defendant: '张某（前员工）',
    },
    contractInfo: {
      contractType: '劳动合同',
      contractAmount: '20万元',
      contractSubject: '竞业限制补偿金',
      paymentTerms: '离职后按月支付竞业限制补偿金',
      performancePeriod: '竞业限制期限5年',
      disputeType: '竞业限制',
      keyIssues: ['竞业限制期限', '条款效力', '补偿金标准'],
    },
    caseAnalysis: {
      disputeFocus: ['竞业限制期限是否合法', '补偿金是否合理'],
      keyFindings: [
        '企业约定的5年竞业限制期限超过法定上限',
        '竞业限制条款部分无效',
        '补偿金标准符合法律规定',
      ],
      judgmentPoints: [
        '竞业限制期限不得超过2年',
        '超过法定期限的约定无效',
      ],
      legalBasis: [
        '《劳动合同法》第二十四条',
      ],
    },
    relatedStatutes: [
      {
        title: '《劳动合同法》第二十四条',
        level: '法律',
        article: '第二十四条',
        content: '竞业限制的人员限于用人单位的高级管理人员、高级技术人员和其他负有保密义务的人员。竞业限制的范围、地域、期限由用人单位与劳动者约定，竞业限制的期限不得超过二年。',
        applicability: '适用于竞业限制期限的认定',
      },
    ],
    caseTimeline: [
      {
        date: '2022-01-10',
        event: '劳动合同签订',
        description: '双方签订劳动合同，约定竞业限制条款',
        status: 'completed',
      },
      {
        date: '2024-03-15',
        event: '员工离职',
        description: '张某从企业离职',
        status: 'completed',
      },
      {
        date: '2024-06-01',
        event: '提起诉讼',
        description: '企业发现张某违反竞业限制，提起诉讼',
        status: 'completed',
      },
      {
        date: '2024-10-20',
        event: '二审判决',
        description: '法院作出二审判决，认定竞业限制期限过长',
        status: 'completed',
      },
    ],
    similarCases: [
      {
        id: 'CASE001',
        title: '某科技公司与供应商买卖合同纠纷案',
        similarity: 65,
        verdict: '企业胜诉',
        court: '北京市第一中级人民法院',
      },
    ],
    documents: [
      {
        name: '劳动合同.pdf',
        type: 'PDF',
        size: '0.8MB',
        url: '/documents/labor-contract.pdf',
      },
      {
        name: '二审判决书.pdf',
        type: 'PDF',
        size: '2.1MB',
        url: '/documents/judgment2.pdf',
      },
    ],
    statistics: {
      viewCount: 892,
      downloadCount: 156,
      favoriteCount: 42,
      shareCount: 18,
      rating: 4.5,
      ratingCount: 12,
    },
  },
  'CASE003': {
    id: 'CASE003',
    title: '软件开发服务外包合同纠纷案',
    caseNumber: '(2024)粤03民初9012号',
    caseType: '合同纠纷',
    court: '深圳市中级人民法院',
    courtLevel: '中级法院',
    judge: '刘法官',
    trialDate: '2024-09-10',
    verdict: '调解结案',
    parties: {
      plaintiff: '某科技公司',
      defendant: '某软件开发团队',
    },
    contractInfo: {
      contractType: '服务合同',
      contractAmount: '80万元',
      contractSubject: '企业管理系统开发',
      paymentTerms: '分阶段支付，验收合格后支付尾款',
      performancePeriod: '合同签订后6个月内完成开发',
      disputeType: '验收标准',
      keyIssues: ['质量不达标', '验收标准不明', '责任划分'],
    },
    caseAnalysis: {
      disputeFocus: ['验收标准的认定', '质量问题的责任承担'],
      keyFindings: [
        '双方对验收标准约定不明确',
        '软件存在部分功能缺陷',
        '双方均有过错',
      ],
      judgmentPoints: [
        '合同约定应明确具体',
        '双方应承担相应责任',
      ],
      legalBasis: [
        '《民法典》第五百一十条',
        '《民法典》第五百九十二条',
      ],
    },
    relatedStatutes: [
      {
        title: '《民法典》第五百一十条',
        level: '法律',
        article: '第五百一十条',
        content: '合同生效后，当事人就质量、价款或者报酬、履行地点等内容没有约定或者约定不明确的，可以协议补充。',
        applicability: '适用于合同约定不明的情形',
      },
    ],
    caseTimeline: [
      {
        date: '2023-12-01',
        event: '合同签订',
        description: '双方签订软件开发合同',
        status: 'completed',
      },
      {
        date: '2024-06-01',
        event: '项目交付',
        description: '开发团队交付软件系统',
        status: 'completed',
      },
      {
        date: '2024-07-15',
        event: '提起诉讼',
        description: '原告认为软件质量不达标，提起诉讼',
        status: 'completed',
      },
      {
        date: '2024-09-10',
        event: '调解结案',
        description: '双方达成调解协议',
        status: 'completed',
      },
    ],
    similarCases: [],
    documents: [
      {
        name: '服务合同.pdf',
        type: 'PDF',
        size: '1.0MB',
        url: '/documents/service-contract.pdf',
      },
    ],
    statistics: {
      viewCount: 1567,
      downloadCount: 298,
      favoriteCount: 78,
      shareCount: 45,
      rating: 4.6,
      ratingCount: 15,
    },
  },
  'CASE004': {
    id: 'CASE004',
    title: '商铺租赁合同提前解除纠纷案',
    caseNumber: '(2024)浙01民初3456号',
    caseType: '合同纠纷',
    court: '杭州市西湖区人民法院',
    courtLevel: '基层法院',
    judge: '陈法官',
    trialDate: '2024-08-25',
    verdict: '调解结案',
    parties: {
      plaintiff: '某商业地产公司',
      defendant: '某零售企业',
    },
    contractInfo: {
      contractType: '租赁合同',
      contractAmount: '15万元',
      contractSubject: '商铺租赁',
      paymentTerms: '按季度支付租金',
      performancePeriod: '租赁期限3年',
      disputeType: '合同解除',
      keyIssues: ['提前解约', '违约责任', '押金退还'],
    },
    caseAnalysis: {
      disputeFocus: ['是否构成法定解除条件', '押金如何处理'],
      keyFindings: [
        '疫情影响构成情势变更',
        '双方协商解除合同',
        '出租方同意退还部分押金',
      ],
      judgmentPoints: [
        '情势变更原则的适用',
        '合同解除的法律后果',
      ],
      legalBasis: [
        '《民法典》第五百三十三条',
      ],
    },
    relatedStatutes: [
      {
        title: '《民法典》第五百三十三条',
        level: '法律',
        article: '第五百三十三条',
        content: '合同成立后，合同的基础条件发生了当事人在订立合同时无法预见的、不属于商业风险的重大变化，继续履行合同对于当事人一方明显不公平的，受不利影响的当事人可以与对方重新协商。',
        applicability: '适用于情势变更的情形',
      },
    ],
    caseTimeline: [
      {
        date: '2022-01-01',
        event: '租赁合同签订',
        description: '双方签订商铺租赁合同',
        status: 'completed',
      },
      {
        date: '2024-03-01',
        event: '提出解约',
        description: '承租方因疫情影响要求提前解除合同',
        status: 'completed',
      },
      {
        date: '2024-06-15',
        event: '提起诉讼',
        description: '双方协商未果，提起诉讼',
        status: 'completed',
      },
      {
        date: '2024-08-25',
        event: '调解结案',
        description: '法院主持调解，双方达成协议',
        status: 'completed',
      },
    ],
    similarCases: [],
    documents: [
      {
        name: '租赁合同.pdf',
        type: 'PDF',
        size: '0.9MB',
        url: '/documents/lease-contract.pdf',
      },
    ],
    statistics: {
      viewCount: 678,
      downloadCount: 124,
      favoriteCount: 35,
      shareCount: 15,
      rating: 4.2,
      ratingCount: 8,
    },
  },
  'CASE005': {
    id: 'CASE005',
    title: '建筑工程施工合同质量纠纷案',
    caseNumber: '(2024)川01民初7890号',
    caseType: '合同纠纷',
    court: '成都市中级人民法院',
    courtLevel: '中级法院',
    judge: '赵法官',
    trialDate: '2024-07-30',
    verdict: '企业胜诉',
    parties: {
      plaintiff: '某房地产开发公司',
      defendant: '某建筑工程公司',
    },
    contractInfo: {
      contractType: '建设工程合同',
      contractAmount: '200万元',
      contractSubject: '住宅楼建设工程',
      paymentTerms: '按工程进度分期支付',
      performancePeriod: '合同签订后18个月内完工',
      disputeType: '工程质量',
      keyIssues: ['质量缺陷', '修复费用', '损害赔偿'],
    },
    caseAnalysis: {
      disputeFocus: ['质量缺陷的认定', '修复费用的承担', '赔偿范围'],
      keyFindings: [
        '工程质量存在严重缺陷',
        '承包方应承担修复责任',
        '发包方的损失应予赔偿',
      ],
      judgmentPoints: [
        '工程质量标准的认定',
        '质量缺陷的责任承担',
      ],
      legalBasis: [
        '《民法典》第八百零一条',
        '《建筑法》第六十条',
      ],
    },
    relatedStatutes: [
      {
        title: '《民法典》第八百零一条',
        level: '法律',
        article: '第八百零一条',
        content: '因施工人的原因致使建设工程质量不符合约定的，发包人有权请求施工人在合理期限内无偿修理或者返工、改建。',
        applicability: '适用于工程质量问题的处理',
      },
    ],
    caseTimeline: [
      {
        date: '2022-06-01',
        event: '合同签订',
        description: '双方签订建设工程施工合同',
        status: 'completed',
      },
      {
        date: '2023-12-01',
        event: '工程竣工',
        description: '工程完工并交付',
        status: 'completed',
      },
      {
        date: '2024-03-15',
        event: '发现质量问题',
        description: '发包方发现工程存在质量缺陷',
        status: 'completed',
      },
      {
        date: '2024-05-01',
        event: '提起诉讼',
        description: '发包方提起质量纠纷诉讼',
        status: 'completed',
      },
      {
        date: '2024-07-30',
        event: '一审判决',
        description: '法院判决承包方承担修复费用及赔偿金',
        status: 'completed',
      },
    ],
    similarCases: [],
    documents: [
      {
        name: '建设工程合同.pdf',
        type: 'PDF',
        size: '2.5MB',
        url: '/documents/construction-contract.pdf',
      },
      {
        name: '质量鉴定报告.pdf',
        type: 'PDF',
        size: '3.8MB',
        url: '/documents/quality-report.pdf',
      },
    ],
    statistics: {
      viewCount: 2134,
      downloadCount: 456,
      favoriteCount: 112,
      shareCount: 67,
      rating: 4.9,
      ratingCount: 28,
    },
  },
};

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statuteDrawerVisible, setStatuteDrawerVisible] = useState(false);
  const [selectedStatute, setSelectedStatute] = useState<any>(null);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // 根据 ID 从数据库中获取对应的案例数据
      const data = id ? mockCaseDetails[id] : null;
      setCaseData(data || null);
      setLoading(false);
    }, 800);
  }, [id]);

  // 相似度分布图表配置
  const similarityChartOption = useMemo(() => {
    if (!caseData) return {};
    
    const data = caseData.similarCases.map(item => ({
      name: item.title.substring(0, 15) + '...',
      value: item.similarity,
      court: item.court,
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>相似度: {c}%<br/>法院: {d}',
      },
      series: [
        {
          name: '案例相似度',
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
            formatter: '{b}: {c}%',
          },
          data,
        },
      ],
    };
  }, [caseData]);

  // 案例统计图表配置
  const statisticsChartOption = useMemo(() => {
    if (!caseData) return {};

    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['浏览量', '下载量', '收藏量'] },
      xAxis: {
        type: 'category',
        data: ['本月', '上月', '前月'],
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '浏览量',
          type: 'bar',
          data: [caseData.statistics.viewCount, 1200, 980],
          itemStyle: { color: '#1890ff' },
        },
        {
          name: '下载量',
          type: 'bar',
          data: [caseData.statistics.downloadCount, 280, 220],
          itemStyle: { color: '#52c41a' },
        },
        {
          name: '收藏量',
          type: 'bar',
          data: [caseData.statistics.favoriteCount, 65, 45],
          itemStyle: { color: '#fa8c16' },
        },
      ],
    };
  }, [caseData]);

  const handleBack = () => {
    navigate('/legal-support/judicial-cases');
  };

  const handleStatuteClick = (statute: any) => {
    setSelectedStatute(statute);
    setStatuteDrawerVisible(true);
  };

  const handleCompare = () => {
    setCompareModalVisible(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <div style={{ padding: '50px 0' }}>
            <Text>正在加载案例详情...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty
            description={
              <Space direction="vertical">
                <Text>未找到该案例</Text>
                <Text type="secondary">案例ID: {id}</Text>
              </Space>
            }
          >
            <Button type="primary" onClick={() => navigate('/legal-support/judicial-cases')}>
              返回案例库
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'overview',
      label: (
        <Space>
          <FileTextOutlined />
          案例概览
        </Space>
      ),
      children: (
        <Row gutter={24}>
          <Col span={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 基本信息 */}
              <Card title="基本信息" bordered>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="案号">{caseData.caseNumber}</Descriptions.Item>
                  <Descriptions.Item label="案由">{caseData.caseType}</Descriptions.Item>
                  <Descriptions.Item label="审理法院">{caseData.court}</Descriptions.Item>
                  <Descriptions.Item label="审判员">{caseData.judge}</Descriptions.Item>
                  <Descriptions.Item label="审理日期">{caseData.trialDate}</Descriptions.Item>
                  <Descriptions.Item label="判决结果">
                    <Tag color={caseData.verdict === '企业胜诉' ? 'success' : 'warning'}>
                      {caseData.verdict}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="原告" span={2}>
                    {caseData.parties.plaintiff}
                  </Descriptions.Item>
                  <Descriptions.Item label="被告" span={2}>
                    {caseData.parties.defendant}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 合同关键信息 */}
              <Card 
                title={
                  <Space>
                    <BankOutlined />
                    合同关键信息提取
                  </Space>
                }
                extra={
                  <Button type="primary" onClick={handleCompare}>
                    对比分析
                  </Button>
                }
                bordered
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" title="合同基本信息" style={{ background: '#f6ffed' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>合同类型：</Text>
                          <Tag color="blue">{caseData.contractInfo.contractType}</Tag>
                        </div>
                        <div>
                          <Text strong>合同金额：</Text>
                          <Text style={{ color: '#f5222d', fontWeight: 'bold' }}>
                            {caseData.contractInfo.contractAmount}
                          </Text>
                        </div>
                        <div>
                          <Text strong>合同标的：</Text>
                          <Text>{caseData.contractInfo.contractSubject}</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="履行条款" style={{ background: '#e6f7ff' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>支付条款：</Text>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {caseData.contractInfo.paymentTerms}
                          </Paragraph>
                        </div>
                        <div>
                          <Text strong>履行期限：</Text>
                          <Text>{caseData.contractInfo.performancePeriod}</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <div>
                  <Text strong>争议类型：</Text>
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    {caseData.contractInfo.disputeType}
                  </Tag>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Text strong>关键争议点：</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      {caseData.contractInfo.keyIssues.map(issue => (
                        <Tag key={issue} color="orange">
                          {issue}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              </Card>

              {/* 案例分析 */}
              <Card title="案例核心分析" bordered>
                <Collapse ghost>
                  <Panel header="争议焦点" key="focus">
                    <List
                      dataSource={caseData.caseAnalysis.disputeFocus}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Space>
                            <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                            <Text>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header="关键认定" key="findings">
                    <List
                      dataSource={caseData.caseAnalysis.keyFindings}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <Text>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  <Panel header="判决要点" key="points">
                    <List
                      dataSource={caseData.caseAnalysis.judgmentPoints}
                      renderItem={(item) => (
                        <List.Item>
                          <Space>
                            <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
                            <Text strong>{item}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              </Card>
            </Space>
          </Col>

          <Col span={8}>
            <Affix offsetTop={24}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 案例统计 */}
                <Card title="案例统计" size="small">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="浏览量"
                        value={caseData.statistics.viewCount}
                        prefix={<EyeOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="下载量"
                        value={caseData.statistics.downloadCount}
                        prefix={<DownloadOutlined />}
                      />
                    </Col>
                  </Row>
                  <Divider style={{ margin: '12px 0' }} />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="收藏量"
                        value={caseData.statistics.favoriteCount}
                        prefix={<StarOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, color: '#8c8c8c' }}>用户评分</div>
                        <div>
                          <Rate disabled defaultValue={caseData.statistics.rating} />
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            ({caseData.statistics.ratingCount}人评价)
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* 操作按钮 */}
                <Card title="操作" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" block icon={<StarOutlined />}>
                      收藏案例
                    </Button>
                    <Button block icon={<ShareAltOutlined />}>
                      分享案例
                    </Button>
                    <Button block icon={<DownloadOutlined />}>
                      下载文档
                    </Button>
                    <Button block icon={<PrinterOutlined />}>
                      打印案例
                    </Button>
                  </Space>
                </Card>

                {/* 数据可视化 */}
                <Card title="统计图表" size="small">
                  <SafeECharts
                    option={statisticsChartOption}
                    style={{ height: 200 }}
                    notMerge
                    lazyUpdate
                  />
                </Card>
              </Space>
            </Affix>
          </Col>
        </Row>
      ),
    },
    {
      key: 'statutes',
      label: (
        <Space>
          <BookOutlined />
          关联法条
        </Space>
      ),
      children: (
        <Card>
          <Alert
            message="智能法条匹配"
            description="基于案例争议焦点自动匹配相关法律条文，点击查看详细内容"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <List
            dataSource={caseData.relatedStatutes}
            renderItem={(statute) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleStatuteClick(statute)}
                  >
                    查看详情
                  </Button>,
                  <Button
                    type="link"
                    onClick={() => navigate('/legal-support/regulation-query')}
                  >
                    跳转法规查询
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Tag color="blue" style={{ margin: 0 }}>
                      {statute.level}
                    </Tag>
                  }
                  title={
                    <Space>
                      <Text strong>{statute.title}</Text>
                      <Tag color="green">{statute.article}</Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        {statute.content}
                      </Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        适用场景：{statute.applicability}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: 'timeline',
      label: (
        <Space>
          <ClockCircleOutlined />
          案件时间线
        </Space>
      ),
      children: (
        <Card>
          <Timeline>
            {caseData.caseTimeline.map((item, index) => (
              <Timeline.Item
                key={index}
                color={
                  item.status === 'completed'
                    ? 'green'
                    : item.status === 'processing'
                    ? 'blue'
                    : 'gray'
                }
                dot={
                  item.status === 'completed' ? (
                    <CheckCircleOutlined style={{ fontSize: 16 }} />
                  ) : item.status === 'processing' ? (
                    <ClockCircleOutlined style={{ fontSize: 16 }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ fontSize: 16 }} />
                  )
                }
              >
                <div>
                  <Text strong>{item.event}</Text>
                  <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 4 }}>
                    {dayjs(item.date).format('YYYY年MM月DD日')}
                  </div>
                  <Text type="secondary">{item.description}</Text>
      </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      ),
    },
    {
      key: 'similar',
      label: (
        <Space>
          <LinkOutlined />
          相似案例
        </Space>
      ),
      children: (
        <Row gutter={24}>
          <Col span={16}>
            <Card title="相似案例列表">
              <List
                dataSource={caseData.similarCases}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/legal-support/judicial-cases/detail/${item.id}`)}
                      >
                        查看详情
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{item.title}</Text>
                          <Progress
                            percent={item.similarity}
                            size="small"
                            style={{ width: 100 }}
                          />
                        </Space>
                      }
                      description={
                        <Space>
                          <Tag color="blue">{item.court}</Tag>
                          <Tag color={item.verdict === '企业胜诉' ? 'success' : 'warning'}>
                            {item.verdict}
                          </Tag>
                          <Text type="secondary">相似度: {item.similarity}%</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="相似度分布">
              <SafeECharts
                option={similarityChartOption}
                style={{ height: 300 }}
                notMerge
                lazyUpdate
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'documents',
      label: (
        <Space>
          <FileTextOutlined />
          相关文档
        </Space>
      ),
      children: (
        <Card>
          <Table
            dataSource={caseData.documents}
            columns={[
              {
                title: '文档名称',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                  <Space>
                    <FileTextOutlined />
                    <Text>{text}</Text>
                  </Space>
                ),
              },
              {
                title: '文件类型',
                dataIndex: 'type',
                key: 'type',
                render: (type) => <Tag>{type}</Tag>,
              },
              {
                title: '文件大小',
                dataIndex: 'size',
                key: 'size',
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Space>
                    <Button type="link" size="small" icon={<EyeOutlined />}>
                      预览
                    </Button>
                    <Button type="link" size="small" icon={<DownloadOutlined />}>
                      下载
                    </Button>
                  </Space>
                ),
              },
            ]}
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <PageWrapper module="legal">
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
                返回案例库
              </Button>
              <Divider type="vertical" />
              <Title level={3} style={{ margin: 0 }}>
            {caseData.title}
              </Title>
        </Space>
        
        <Row justify="space-between" align="middle">
          <Col>
            <Space wrap>
              <Tag color="blue">{caseData.contractInfo.contractType}</Tag>
              <Tag color="green">{caseData.caseType}</Tag>
              <Tag>{caseData.courtLevel}</Tag>
              <Tag color={caseData.verdict === '企业胜诉' ? 'success' : 'warning'}>
                {caseData.verdict}
              </Tag>
              <Text type="secondary">
                审理日期：{dayjs(caseData.trialDate).format('YYYY年MM月DD日')}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title="案例热度">
                <Space>
                  <FireOutlined style={{ color: '#fa541c' }} />
                  <Text>热度 92</Text>
                </Space>
              </Tooltip>
              <Tooltip title="用户好评">
                <Space>
                  <LikeOutlined style={{ color: '#52c41a' }} />
                  <Text>好评 {caseData.statistics.rating}</Text>
                </Space>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 主要内容 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>

      {/* 法条详情抽屉 */}
      <Drawer
        title="法条详情"
        placement="right"
        width={600}
        open={statuteDrawerVisible}
        onClose={() => setStatuteDrawerVisible(false)}
      >
        {selectedStatute && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card size="small">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="法条名称">
                  {selectedStatute.title}
              </Descriptions.Item>
                <Descriptions.Item label="效力层级">
                  <Tag color="blue">{selectedStatute.level}</Tag>
              </Descriptions.Item>
                <Descriptions.Item label="条文编号">
                  {selectedStatute.article}
              </Descriptions.Item>
            </Descriptions>
          </Card>

            <Card title="条文内容" size="small">
              <Paragraph>{selectedStatute.content}</Paragraph>
          </Card>

            <Card title="适用说明" size="small">
              <Text>{selectedStatute.applicability}</Text>
          </Card>

            <Button
              type="primary"
              block
              onClick={() => {
                setStatuteDrawerVisible(false);
                navigate('/legal-support/regulation-query');
              }}
            >
              跳转到法规查询模块
            </Button>
          </Space>
        )}
      </Drawer>

      {/* 对比分析模态框 */}
      <Modal
        title="合同对比分析"
        open={compareModalVisible}
        onCancel={() => setCompareModalVisible(false)}
        width={800}
        footer={null}
      >
            <Alert 
          message="合同对比功能"
          description="上传您的合同文件，系统将自动提取关键信息并与当前案例进行对比分析"
              type="info" 
              showIcon 
          style={{ marginBottom: 16 }}
        />
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">此功能正在开发中，敬请期待...</Text>
                  </div>
      </Modal>

      <FloatButton.BackTop />
    </PageWrapper>
  );
};

export default CaseDetail;


