/**
 * 智慧政策页面 - 重新设计版
 * 还原设计图效果，提供政策搜索、匹配与查询功能
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Tabs,
  Space,
  Input,
  Button,
  Tag,
  Badge,
  List,
  message,
  Breadcrumb,
  Modal,
  AutoComplete,
  Radio,
  Tooltip,
  Progress,
  Spin,
  Collapse,
  Select,
  Slider,
  Form,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  RobotOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  BarChartOutlined,
  RiseOutlined,
  FireOutlined,
  RightOutlined,
  CloseCircleFilled,
  InfoCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  StarFilled,
  ExclamationCircleOutlined,
  DownloadOutlined,
  TeamOutlined,
  MessageOutlined,
  SyncOutlined,
  FilterOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  ArrowLeftRight,
  Trophy,
  Sparkles,
  PencilRuler,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  File as FileIcon,
  Check,
  Pencil,
  Briefcase,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import PageWrapper from "../../components/PageWrapper";
import AIPolicyModal from "./components/AIPolicyModal";
import { Avatar } from "antd";

const { Title, Text, Paragraph } = Typography;

const { Panel } = Collapse;
const { Option } = Select;

// Mock Data
const ASSOCIATED_COMPANIES = [
  "北京积分时代科技有限公司",
  "北京乐益通科技有限公司",
  "深圳创新未来技术有限公司",
];

const COMPANY_INFO_MAP: Record<
  string,
  { tags: string[]; completeness: number; missing: string }
> = {
  北京积分时代科技有限公司: {
    tags: ["北京市", "金融业", "注册资本 1000 万", "专利 14 项"],
    completeness: 75,
    missing: "经营数据缺失近 1 年营收",
  },
  北京乐益通科技有限公司: {
    tags: ["北京市", "科技推广", "注册资本 500 万", "高新企业"],
    completeness: 90,
    missing: "",
  },
  深圳创新未来技术有限公司: {
    tags: ["深圳市", "制造业", "注册资本 2000 万", "专精特新"],
    completeness: 55,
    missing: "缺失核心财务数据、人员结构信息",
  },
};

const DEFAULT_COMPANY = "北京积分时代科技有限公司";

// 模拟数据
const policyData = [
  {
    id: 1,
    tags: [
      { text: "申报通知", color: "bg-orange-50 text-orange-600" },
      { text: "国家级", color: "bg-blue-50 text-blue-600" },
      { text: "荣誉奖励", color: "bg-purple-50 text-purple-600" },
    ],
    titleHtml:
      '工业和信息化部中小企业局关于开展2026年度<span class="highlight text-red-500 font-bold">科技型中小企业</span>评价工作的通知',
    reward: "最高奖励 200万元",
    date: "2026-01-28",
    summary:
      "各省、自治区、直辖市及计划单列市科技型中小企业工作主管部门：为深入贯彻落实党中央、国务院关于推动科技创新和产业创新深度融合，强化企业科技创新主体地位决策部署...",
    industry: "制造业、信息技术服务业...",
    count: 2733,
  },
  {
    id: 2,
    tags: [
      { text: "税收优惠", color: "bg-green-50 text-green-600" },
      { text: "省级", color: "bg-blue-50 text-blue-600" },
    ],
    titleHtml:
      '关于落实2026年<span class="highlight text-red-500 font-bold">高新技术企业</span>所得税减免政策的实施细则',
    reward: "税额减免 15%",
    date: "2026-01-25",
    summary:
      "为进一步鼓励企业加大研发投入，支持高新技术企业发展，根据国家税务总局相关规定，现就我省高新技术企业所得税优惠政策执行过程中的有关事项通知如下...",
    industry: "全行业",
    count: 1542,
  },
];

// --- 子组件: 政策卡片 (带编辑功能) ---
const PolicyCard = ({
  data,
  onClick,
}: {
  data: any;
  onClick?: (id: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div
      className={`group relative py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-4 -mx-4 rounded-xl ${isEditing ? "edit-mode-active" : ""}`}
    >
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2 z-10">
        <button
          className={`p-2 bg-white shadow-md rounded-full transition-colors border border-slate-100 ${isEditing ? "text-green-600" : "text-slate-400 hover:text-blue-600"}`}
          onClick={toggleEdit}
          title={isEditing ? "保存" : "编辑政策"}
        >
          {isEditing ? <Check size={18} /> : <Pencil size={18} />}
        </button>
      </div>

      <div className="flex justify-between items-start mb-2 pr-12">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            {data.tags.map((tag: any, idx: number) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-[10px] rounded font-bold ${tag.color}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
          <h4
            className={`text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-relaxed ${isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : "cursor-pointer"}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onClick={() => !isEditing && onClick && onClick(data.id)}
          >
            {data.titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: data.titleHtml }} />
            ) : (
              data.title
            )}
          </h4>
        </div>
        <div className="flex flex-col items-end shrink-0 ml-4">
          <span
            className={`text-sm font-bold text-red-500 ${isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : ""}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
          >
            {data.reward}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            发布日期: {data.date}
          </span>
        </div>
      </div>

      <p
        className={`text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 ${isEditing ? "cursor-text hover:bg-blue-50/50 p-1 -m-1 rounded" : ""}`}
        contentEditable={isEditing}
        suppressContentEditableWarning
      >
        {data.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center">
            <Briefcase size={14} className="mr-1" />
            适用行业:
            <span
              className={`ml-1 ${isEditing ? "cursor-text hover:bg-blue-50/50 px-1 rounded" : ""}`}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {data.industry}
            </span>
          </span>
          <span className="flex items-center">
            <Check size={14} className="mr-1" />
            已获批企业:
            <span
              className={`ml-1 ${isEditing ? "cursor-text hover:bg-blue-50/50 px-1 rounded" : ""}`}
              contentEditable={isEditing}
              suppressContentEditableWarning
            >
              {data.count}
            </span>
            家
          </span>
        </div>
        <button
          className="text-slate-400 text-sm font-bold flex items-center hover:text-blue-600 transition-colors"
          onClick={() => onClick && onClick(data.id)}
        >
          <Eye size={16} className="mr-1" />
          查看详情
        </button>
      </div>
    </div>
  );
};

const AIPolicySearchV2: React.FC = () => {
  const navigate = useNavigate();

  // Tab State
  const [searchTab, setSearchTab] = useState<
    "search" | "match" | "query" | "compare"
  >("search");

  // Input State for each tab
  const [inputValues, setInputValues] = useState({
    search: "",
    match: "",
    query: "",
    compare: "",
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [regionRange, setRegionRange] = useState<"year" | "threeYear">("year");
  const [showResults, setShowResults] = useState(false);

  // Match Process State
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchPriority, setMatchPriority] = useState("comprehensive");
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchStatusText, setMatchStatusText] = useState("已助力 30 万家企业");
  const [showMatchPreview, setShowMatchPreview] = useState(false);
  const [showInterruptModal, setShowInterruptModal] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const [resultTab, setResultTab] = useState("recommend"); // recommend, more, potential

  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [expertModalVisible, setExpertModalVisible] = useState(false);

  // AI Policy Assistant State
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiModalLoading, setAiModalLoading] = useState(false);

  // Result Optimization State
  const [reportLoading, setReportLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("match");
  const [onlyCompetitor, setOnlyCompetitor] = useState(false);
  const [revenueRange, setRevenueRange] = useState("");
  const [consultants, setConsultants] = useState([
    {
      id: 1,
      name: "张资深",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      title: "高级政策咨询顾问",
      tags: ["企业资质认定", "政策奖励申请"],
      responseTime: "平均5分钟响应",
    },
    {
      id: 2,
      name: "李专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      title: "资深申报规划师",
      tags: ["高新认定", "专精特新"],
      responseTime: "平均10分钟响应",
    },
  ]);
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: "嘉兴干金金融服务有限公司",
      legalPerson: "王*",
      product: "金融服务",
      subsidy: "80万",
    },
    {
      id: 2,
      name: "北京XX科技有限公司",
      legalPerson: "张*",
      product: "软件开发",
      subsidy: "200万",
    },
    {
      id: 3,
      name: "上海YY网络技术有限公司",
      legalPerson: "李*",
      product: "互联网服务",
      subsidy: "150万",
    },
  ]);
  const [subsidyFilter, setSubsidyFilter] = useState("peer"); // peer or nearby
  const [cardLoading, setCardLoading] = useState<number | null>(null);

  // Swap Consultants
  const swapConsultants = () => {
    setConsultants([
      {
        id: 3,
        name: "王金牌",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        title: "金牌规划师",
        tags: ["知识产权", "科技项目"],
        responseTime: "平均3分钟响应",
      },
      {
        id: 4,
        name: "赵资深",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        title: "资深政策顾问",
        tags: ["财税筹划", "高企认定"],
        responseTime: "平均8分钟响应",
      },
    ]);
  };

  // Filter Competitors
  const filterCompetitors = (type: string) => {
    setSubsidyFilter(type);
    if (type === "peer") {
      setCompetitors([
        {
          id: 1,
          name: "嘉兴干金金融服务有限公司",
          legalPerson: "王*",
          product: "金融服务",
          subsidy: "80万",
        },
        {
          id: 2,
          name: "北京XX科技有限公司",
          legalPerson: "张*",
          product: "软件开发",
          subsidy: "200万",
        },
        {
          id: 3,
          name: "上海YY网络技术有限公司",
          legalPerson: "李*",
          product: "互联网服务",
          subsidy: "150万",
        },
      ]);
    } else {
      setCompetitors([
        {
          id: 4,
          name: "周边企业A",
          legalPerson: "赵*",
          product: "餐饮",
          subsidy: "5万",
        },
        {
          id: 5,
          name: "周边企业B",
          legalPerson: "钱*",
          product: "零售",
          subsidy: "2万",
        },
      ]);
    }
  };

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load history
  useEffect(() => {
    try {
      const hist = localStorage.getItem("policySearchHistory");
      if (hist) {
        setSearchHistory(JSON.parse(hist));
      }
    } catch (e) {
      console.error("Failed to parse search history", e);
    }
  }, []);

  // Helper to get current input value
  const currentInputValue = inputValues[searchTab];
  const currentCompanyInfo = COMPANY_INFO_MAP[currentInputValue] || null;

  // 监听路由变化，检查是否有企业信息更新
  useEffect(() => {
    const updated = localStorage.getItem("company_profile_updated");
    if (updated === "true") {
      // 模拟更新数据：如果当前选择了企业，则更新其信息
      if (currentInputValue && COMPANY_INFO_MAP[currentInputValue]) {
        const info = COMPANY_INFO_MAP[currentInputValue];
        // 直接修改引用的对象属性（Mock数据简单处理）
        info.completeness = 95;
        info.missing = "";
        if (!info.tags.includes("高新技术企业")) {
          info.tags.push("高新技术企业");
        }

        // 强制更新视图
        setInputValues((prev) => ({ ...prev }));

        message.success({
          content: "企业信息已同步，匹配精准度已提升至 95%",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
      // 清除标记
      localStorage.removeItem("company_profile_updated");
    }
  }, [location]);

  // Handle Search Action
  const handleSearchAction = (value?: string) => {
    const searchValue = value || inputValues.search;
    if (!searchValue.trim()) return;

    // Save history
    const newHistory = [
      searchValue,
      ...searchHistory.filter((h) => h !== searchValue),
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("policySearchHistory", JSON.stringify(newHistory));
    setHistoryVisible(false);

    setSearchLoading(true);

    // Mock API call simulation
    const mockApiCall = new Promise((resolve) => {
      // Simulate 1.5s - 2.5s delay normally
      setTimeout(resolve, 2000);
    });

    // Timeout race (10s)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), 10000);
    });

    Promise.race([mockApiCall, timeoutPromise])
      .then(() => {
        setSearchLoading(false);
        setShowResults(true);
        // navigate(
        //   `/policy-center/search-results?searchKey=${encodeURIComponent(
        //     searchValue,
        //   )}`,
        // );
      })
      .catch((err) => {
        if (err.message === "timeout") {
          message.warning("搜索超时，请稍后重试");
          setSearchLoading(false);
        } else {
          setSearchLoading(false);
        }
      });
  };

  // Update input value handler
  const handleInputChange = (value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [searchTab]: value,
    }));
    if (searchTab === "search") {
      setHistoryVisible(true);
    }
  };

  // Clear input handler
  const handleClearInput = () => {
    handleInputChange("");
    if (searchTab === "search") {
      setShowResults(false);
    }
    if (searchTab === "match") {
      setMatchComplete(false);
      setIsMatching(false);
      setMatchProgress(0);
      setMatchStatusText("已助力 30 万家企业");
    }
  };

  // Start Match Process
  const startMatchProcess = () => {
    setMatchModalVisible(false);
    setIsMatching(true);
    setMatchProgress(0);
    setMatchComplete(false);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setMatchProgress(progress);

      if (progress <= 20) {
        setMatchStatusText(
          `正在检索政策库（1/5）→已加载 ${Math.floor(
            progress * 100,
          )} 条行业政策`,
        );
      } else if (progress <= 50) {
        setMatchStatusText(
          `正在匹配企业维度→已筛选出 ${Math.floor(progress / 2)} 项适配政策`,
        );
      } else if (progress <= 80) {
        setMatchStatusText(
          `正在参照同行数据→同行业已有 ${
            100 + Math.floor(progress)
          } 家企业获批高适配政策`,
        );
        if (progress === 55) setShowMatchPreview(true);
      } else if (progress < 100) {
        setMatchStatusText(`正在排序结果→即将展示 3 项首选推荐政策`);
      } else {
        clearInterval(interval);
        setMatchStatusText("匹配完成");
        setIsMatching(false);
        setMatchComplete(true);
        setShowMatchPreview(false);
        message.success("智能匹配完成！");
      }
    }, 200);
  };

  // Interrupt Match
  const interruptMatch = () => {
    setShowInterruptModal(true);
  };

  const confirmInterrupt = () => {
    setIsMatching(false);
    setMatchProgress(0);
    setMatchStatusText("已助力 30 万家企业");
    setShowInterruptModal(false);
    setShowMatchPreview(false);
  };

  // Generate Report
  const generateReport = () => {
    setReportLoading(true);
    setTimeout(() => {
      setReportLoading(false);
      message.success("完整报告已生成，请查收");
    }, 1500);
  };

  // Update Company Info
  const updateCompanyInfo = () => {
    message.success("数据已提交，匹配度与同行对比数据已更新");
    // Logic to refresh data would go here
  };

  // Handle Card Click
  const handleCardClick = (id: number) => {
    if (cardLoading !== null) return; // Prevent double click
    setCardLoading(id);
    // Simulate loading state
    setTimeout(() => {
      setCardLoading(null);
      // 跳转到详情页
      navigate(`/policy-center/detail/${id}`);
    }, 800);
  };

  // 模拟数据 - 政策分类
  const policyCategories = [
    { name: "科技创新", value: 15200, color: "#1890ff" },
    { name: "产业扶持", value: 12800, color: "#52c41a" },
    { name: "人才引进", value: 9600, color: "#faad14" },
    { name: "税收优惠", value: 8400, color: "#722ed1" },
    { name: "企业补贴", value: 4000, color: "#f5222d" },
  ];

  // 模拟数据 - 地区分布
  const regionDataThreeYear = [
    { region: "北京", count: 8500 },
    { region: "上海", count: 7200 },
    { region: "深圳", count: 6800 },
    { region: "杭州", count: 4500 },
    { region: "广州", count: 4200 },
  ];
  const regionDataYear = regionDataThreeYear.map((item) => ({
    ...item,
    count: Math.max(1, Math.round(item.count * 0.45)),
  }));
  const regionDataForChart =
    regionRange === "year" ? regionDataYear : regionDataThreeYear;

  // 图表配置 - 分类
  const categoryChartOption = {
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", right: "10%", top: "middle" },
    series: [
      {
        name: "政策数量",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        data: policyCategories.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };

  // 图表配置 - 地区
  const regionChartOption = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: regionDataForChart.map((item) => item.region),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "政策数量",
        type: "bar",
        barWidth: "60%",
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#4A90E2" },
            { offset: 1, color: "#6BB6FF" },
          ]),
        },
        data: regionDataForChart.map((item) => item.count),
      },
    ],
  };

  // 热门搜索
  const hotSearches = [
    { id: 1, text: "高新技术企业认定", tag: "热门", color: "#ff4d4f" },
    { id: 2, text: "专精特新", tag: "推荐", color: "#faad14" },
    { id: 3, text: "研发费用加计扣除", tag: "热门", color: "#ff4d4f" },
    { id: 4, text: "首台套", tag: "新", color: "#52c41a" },
  ];

  // AI Context
  const aiContext = React.useMemo(() => {
    if (searchTab === "match" && currentCompanyInfo) {
      return {
        companyName: currentInputValue,
        completeness: currentCompanyInfo.completeness,
        missingInfo: currentCompanyInfo.missing,
        industry:
          currentCompanyInfo.tags.find((t) => t.includes("业")) || "未知行业",
        location:
          currentCompanyInfo.tags.find((t) => t.includes("市")) || "未知地区",
        matchStatus: matchComplete
          ? "completed"
          : isMatching
            ? "matching"
            : "idle",
      };
    }
    return {
      companyName: currentInputValue || undefined,
    };
  }, [
    searchTab,
    currentInputValue,
    currentCompanyInfo,
    matchComplete,
    isMatching,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 头部区域 - 还原设计图 */}
      <div
        style={{
          background: "transparent",
          padding: "32px 0 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "0 32px",
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* 面包屑 */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Breadcrumb
              items={[{ title: "政策中心" }, { title: "智慧政策" }]}
              style={{ marginBottom: "32px" }}
            />
          </div>

          {/* 标题区域 */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                color: "#0f172a",
                fontSize: "48px",
                fontWeight: 800,
                marginBottom: "12px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              智慧政策
            </h1>
            <div
              style={{
                color: "#64748b",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span>精准匹配，辅助补贴申报</span>
            </div>
          </div>

          {/* Tab 导航 */}
          <div
            style={{
              marginBottom: "24px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: "800px" }}>
              <Space size={32}>
                <div
                  style={{
                    cursor: "pointer",
                    color: searchTab === "search" ? "#2563eb" : "#94a3b8",
                    fontWeight: searchTab === "search" ? 700 : 500,
                    fontSize: "18px",
                    paddingBottom: "8px",
                    borderBottom:
                      searchTab === "search"
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setSearchTab("search")}
                >
                  <SearchOutlined
                    style={{
                      color: searchTab === "search" ? "#2563eb" : "#94a3b8",
                    }}
                  />{" "}
                  政策搜索
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    color: searchTab === "match" ? "#2563eb" : "#94a3b8",
                    fontWeight: searchTab === "match" ? 700 : 500,
                    fontSize: "18px",
                    paddingBottom: "8px",
                    borderBottom:
                      searchTab === "match"
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setSearchTab("match")}
                >
                  <RobotOutlined
                    style={{
                      color: searchTab === "match" ? "#2563eb" : "#94a3b8",
                    }}
                  />{" "}
                  政策匹配
                </div>
                {/* <div
                  style={{
                    cursor: "pointer",
                    color: searchTab === "query" ? "#2563eb" : "#94a3b8",
                    fontWeight: searchTab === "query" ? 700 : 500,
                    fontSize: "14px",
                    paddingBottom: "8px",
                    borderBottom:
                      searchTab === "query"
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setSearchTab("query")}
                >
                  <FileTextOutlined
                    style={{
                      color: searchTab === "query" ? "#2563eb" : "#94a3b8",
                    }}
                  />{" "}
                  政策查询
                </div> */}
                {/* <div
                  style={{
                    cursor: "pointer",
                    color: searchTab === "compare" ? "#2563eb" : "#94a3b8",
                    fontWeight: searchTab === "compare" ? 700 : 500,
                    fontSize: "14px",
                    paddingBottom: "8px",
                    borderBottom:
                      searchTab === "compare"
                        ? "2px solid #2563eb"
                        : "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setSearchTab("compare")}
                >
                  <BarChartOutlined
                    style={{
                      color: searchTab === "compare" ? "#2563eb" : "#94a3b8",
                    }}
                  />{" "}
                  政策对比
                </div> */}
              </Space>
            </div>
          </div>

          <style>{`
            .policy-search-input:hover,
            .policy-search-input:focus,
            .policy-search-input:focus-visible {
              border-color: #3b82f6 !important;
              box-shadow: 0 20px 40px rgba(30, 58, 138, 0.05) !important;
              outline: none !important;
            }
            .policy-search-input::placeholder {
              color: #cbd5e1;
            }
            .history-item:hover {
              background-color: #F5F7FA;
            }
            @keyframes breathe-blue {
              0%,
              100% {
                background-color: rgba(24, 144, 255, 0.05);
                border-color: #e2e8f0;
              }
              50% {
                background-color: rgba(24, 144, 255, 0.15);
                border-color: #1890ff;
              }
            }
            .breathe-tag {
              animation: breathe-blue 1s infinite ease-in-out;
            }
          `}</style>

          {/* 其他 Tab 的搜索框保持原样或根据需求调整 */}

          {/* 搜索框区域 */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "896px",
                  height: "64px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {searchTab === "search" ? (
                    <Input
                      className="policy-search-input"
                      style={{
                        height: 64,
                        fontSize: 18,
                        borderRadius: 16,
                        border: "2px solid #f1f5f9",
                        paddingLeft: 24,
                        paddingRight: 160,
                        boxShadow: "0 20px 40px rgba(30, 58, 138, 0.05)",
                        backgroundColor: "#fff",
                      }}
                      value={currentInputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="请输入政策关键词、发文机构、地域等"
                      onPressEnter={() => {
                        const value = currentInputValue.trim();
                        if (value) handleSearchAction(value);
                        else
                          Modal.warning({
                            title: "提示",
                            content: "请输入搜索内容后重试",
                          });
                      }}
                    />
                  ) : (
                    <AutoComplete
                      style={{ width: "100%" }}
                      options={ASSOCIATED_COMPANIES.map((c) => ({ value: c }))}
                      value={currentInputValue}
                      onChange={handleInputChange}
                      disabled={
                        isMatching || (matchComplete && searchTab === "match")
                      }
                      onSelect={(value) => handleInputChange(value)}
                    >
                      <Input
                        className="policy-search-input"
                        placeholder="请选择/输入已关联企业名称"
                        style={{
                          height: 64,
                          fontSize: 18,
                          borderRadius: 16,
                          border: "2px solid #f1f5f9",
                          paddingLeft: 24,
                          paddingRight: 160,
                          boxShadow: "0 20px 40px rgba(30, 58, 138, 0.05)",
                          backgroundColor: "#fff",
                        }}
                        onPressEnter={() => {
                          const value = currentInputValue.trim();
                          if (searchTab === "match") return;
                          if (value) handleSearchAction(value);
                          else
                            Modal.warning({
                              title: "提示",
                              content: "请输入搜索内容后重试",
                            });
                        }}
                      />
                    </AutoComplete>
                  )}
                </div>

                <div
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Tooltip
                    title={
                      searchTab === "match" &&
                      currentCompanyInfo &&
                      currentCompanyInfo.completeness >= 60 &&
                      currentCompanyInfo.completeness < 80
                        ? `企业信息完整度 ${currentCompanyInfo.completeness}%，匹配精准度约为 80%（完善信息后可提升至 95%）`
                        : searchTab === "match" &&
                            currentCompanyInfo &&
                            currentCompanyInfo.completeness < 60
                          ? "请完善企业信息至 60% 以上再触发匹配"
                          : ""
                    }
                  >
                    <Button
                      type="primary"
                      loading={searchTab === "search" && searchLoading}
                      style={{
                        padding: "0 32px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        height: "48px",
                        background:
                          searchTab === "search" && searchLoading
                            ? "#90CAF9"
                            : searchTab === "match" &&
                                currentCompanyInfo &&
                                currentCompanyInfo.completeness >= 60 &&
                                currentCompanyInfo.completeness < 80
                              ? "#69b1ff"
                              : "#1677ff",
                        border: "none",
                        color: "#fff",
                        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      disabled={
                        searchLoading ||
                        ((searchTab === "query" || searchTab === "compare") &&
                          (!currentInputValue ||
                            !ASSOCIATED_COMPANIES.includes(currentInputValue)))
                      }
                      onClick={() => {
                        if (isMatching) {
                          interruptMatch();
                          return;
                        }
                        if (matchComplete && searchTab === "match") return;

                        const value = currentInputValue.trim();

                        if (searchTab === "search") {
                          if (!value) {
                            Modal.warning({
                              title: "提示",
                              content: "请输入搜索内容后重试",
                            });
                            return;
                          }
                          handleSearchAction(value);
                        } else if (searchTab === "match") {
                          if (!value) {
                            Modal.warning({
                              title: "提示",
                              content: "请选择或输入已关联企业名称",
                            });
                            return;
                          }
                          if (!ASSOCIATED_COMPANIES.includes(value)) {
                            Modal.warning({
                              title: "提示",
                              content: "该企业未完成关联，请先提交授权申请",
                            });
                            return;
                          }
                          if (
                            currentCompanyInfo &&
                            currentCompanyInfo.completeness < 60
                          ) {
                            // 虽然按钮不禁用，但点击时仍需校验完整度（可选，或者允许点击进入匹配但提示）
                            // 这里保持原逻辑：如果不满足条件，前面disabled逻辑去掉了，这里应该拦截吗？
                            // 之前的逻辑是 < 60 则 disabled。现在按钮常亮，点击后应提示去完善。
                            Modal.confirm({
                              title: "企业信息待完善",
                              content:
                                "当前企业信息完整度不足 60%，建议先完善信息以获得更精准的匹配结果。",
                              okText: "去完善",
                              cancelText: "暂不完善",
                              onOk: () => {
                                const section =
                                  currentCompanyInfo.missing &&
                                  currentCompanyInfo.missing.includes("营收")
                                    ? "financial"
                                    : "basic";
                                navigate(
                                  `/system/company-management?action=edit&section=${section}`,
                                );
                              },
                            });
                            return;
                          }
                          setMatchModalVisible(true);
                        } else if (
                          searchTab === "query" ||
                          searchTab === "compare"
                        ) {
                          if (!ASSOCIATED_COMPANIES.includes(value)) {
                            Modal.warning({
                              title: "提示",
                              content: "仅支持查询已关联企业的获批记录",
                            });
                            return;
                          }
                          message.info("该功能还在更新，敬请期待");
                        }
                      }}
                    >
                      {searchTab === "search" && "立即搜索"}
                      {searchTab === "match" && (
                        <>
                          {isMatching && (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 8,
                                  animation: "rotate 1s linear infinite",
                                }}
                                alt="loading"
                              />
                              <style>{`@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                            </div>
                          )}
                          {isMatching ? "匹配中" : "立即匹配"}
                        </>
                      )}
                      {searchTab === "query" && "查询获批记录"}
                      {searchTab === "compare" && "政策对比"}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div
              className="mx-auto mt-2 flex w-full max-w-5xl items-center gap-3 text-sm"
              style={{
                visibility: searchTab === "search" ? "visible" : "hidden",
                height: "32px", // Ensure consistent height
              }}
            >
              <span className="text-slate-400">热门搜索:</span>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map((item) => (
                  <a
                    key={item.id}
                    href="#"
                    className="flex items-center rounded-full border border-slate-100 bg-white px-3 py-1 text-slate-600 transition-all hover:border-blue-300 hover:text-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchTab("search"); // 确保在搜索标签下
                      handleInputChange(item.text); // 更新输入框内容
                      handleSearchAction(item.text); // 触发搜索并在当前页显示结果
                    }}
                  >
                    {item.text}
                    {item.tag && (
                      <span className="ml-1 text-[10px] font-bold text-orange-400">
                        {item.tag === "热门" ? "HOT" : item.tag}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* 企业信息概览浮层 (仅在政策匹配Tab且选择了已关联企业时显示) */}
            {searchTab === "match" && currentCompanyInfo && (
              <div
                style={{
                  marginTop: "16px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #f0f0f0",
                  width: "100%",
                  maxWidth: "800px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                {isMatching ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Space>
                      <Text strong>{matchStatusText}</Text>
                    </Space>
                    {/* 匹配过程实时预览 */}
                    {showMatchPreview && (
                      <Space>
                        <Tag color="default">
                          ‘朝阳区商务发展资金’ 匹配度 92%
                        </Tag>
                        <Tag color="default">‘GB/T 29490’ 匹配度 81%</Tag>
                      </Space>
                    )}
                  </div>
                ) : matchComplete ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text strong style={{ color: "#52c41a" }}>
                      <CheckCircleOutlined /> 匹配完成，已为您推荐 3 项首选政策
                    </Text>
                    <Button type="link" onClick={handleClearInput}>
                      重新匹配
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space size="large">
                      <Space>
                        {currentCompanyInfo.tags.map((tag) => (
                          <Tag key={tag} style={{ borderRadius: "12px" }}>
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                      <Text type="secondary">
                        信息完整度：
                        <span
                          style={{
                            color:
                              currentCompanyInfo.completeness >= 80
                                ? "#52c41a"
                                : currentCompanyInfo.completeness >= 60
                                  ? "#faad14"
                                  : "#ff4d4f",
                            fontWeight: "bold",
                            marginRight: "8px",
                          }}
                        >
                          {currentCompanyInfo.completeness}%
                        </span>
                        {currentCompanyInfo.missing
                          ? `(${currentCompanyInfo.missing})`
                          : "(基本信息已完善)"}
                      </Text>
                    </Space>
                    <Tooltip title="点击完善企业信息，提升匹配精准度">
                      <Button
                        type={
                          currentCompanyInfo.completeness < 60
                            ? "primary"
                            : "default"
                        }
                        danger={currentCompanyInfo.completeness < 60}
                        size="small"
                        onClick={() => {
                          // 根据缺失字段判断跳转参数
                          const section =
                            currentCompanyInfo.missing &&
                            currentCompanyInfo.missing.includes("营收")
                              ? "financial"
                              : "basic";
                          navigate(
                            `/system/company-management?action=edit&section=${section}`,
                          );
                        }}
                      >
                        完善信息
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}

            {/* 匹配结果展示区 - 优化版三栏布局 */}
            {matchComplete && searchTab === "match" && (
              <div
                style={{ marginTop: "24px", width: "100%", maxWidth: "1200px" }}
              >
                <Row gutter={24}>
                  {/* 左侧：企业信息概览区 (25%) */}
                  <Col xs={24} lg={6}>
                    {/* 新增“补贴可申领”可视化组件 */}
                    <div
                      style={{
                        background:
                          "linear-gradient(180deg, #e6f7ff 0%, #bae7ff 100%)",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "16px",
                        textAlign: "center",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate("/policy-center/application-management")
                      }
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#1890ff",
                        }}
                      >
                        <RightOutlined />
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "4px",
                        }}
                      >
                        可申领补贴项
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#1890ff",
                        }}
                      >
                        8{" "}
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          项
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
                          marginTop: "4px",
                        }}
                      >
                        完善企业信息，推荐更精准
                      </div>
                    </div>

                    <Card
                      title="企业信息概览"
                      style={{
                        height: "auto",
                        borderRadius: "12px",
                        marginBottom: "16px",
                      }}
                      bodyStyle={{ padding: "0" }}
                    >
                      <Collapse
                        defaultActiveKey={["1", "2", "3"]}
                        ghost
                        expandIconPosition="start"
                        style={{ background: "#fff" }}
                      >
                        <Panel
                          header={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <span
                                  style={{ color: "#000", fontWeight: 500 }}
                                >
                                  基本信息
                                </span>
                                <CheckCircleOutlined
                                  style={{ color: "#000" }}
                                />
                              </Space>
                            </div>
                          }
                          key="1"
                        >
                          <Space
                            direction="vertical"
                            size={8}
                            style={{
                              width: "100%",
                              paddingLeft: "24px",
                              paddingRight: "16px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text type="secondary">工商注册号</Text>
                              <Text strong style={{ color: "#000" }}>
                                110108000000
                              </Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text type="secondary">成立年限</Text>
                              <Text strong style={{ color: "#000" }}>
                                5年
                              </Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text type="secondary">行业分类</Text>
                              <Text style={{ color: "#999" }}>
                                软件服务{" "}
                                <ExclamationCircleOutlined
                                  style={{ color: "#faad14", fontSize: "12px" }}
                                />
                              </Text>
                            </div>
                          </Space>
                        </Panel>
                        <Panel
                          header={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <span
                                  style={{ color: "#000", fontWeight: 500 }}
                                >
                                  知识产权
                                </span>
                                <CheckCircleOutlined
                                  style={{ color: "#000" }}
                                />
                              </Space>
                            </div>
                          }
                          key="2"
                        >
                          <Row
                            gutter={8}
                            style={{
                              textAlign: "center",
                              paddingLeft: "24px",
                              paddingRight: "16px",
                            }}
                          >
                            <Col span={8}>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                14
                              </div>
                              <div style={{ fontSize: "12px", color: "#999" }}>
                                专利
                              </div>
                            </Col>
                            <Col span={8}>
                              <div
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                5
                              </div>
                              <div style={{ fontSize: "12px", color: "#999" }}>
                                商标
                              </div>
                            </Col>
                            <Col span={8}>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#1890ff",
                                  cursor: "pointer",
                                  lineHeight: "42px",
                                }}
                              >
                                点击补充
                              </div>
                            </Col>
                          </Row>
                        </Panel>
                        <Panel
                          header={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <span
                                  style={{ color: "#000", fontWeight: 500 }}
                                >
                                  经营数据
                                </span>
                                <ExclamationCircleOutlined
                                  style={{ color: "#999" }}
                                />
                              </Space>
                            </div>
                          }
                          key="3"
                        >
                          <div
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "16px",
                            }}
                          >
                            <div
                              style={{
                                height: "100px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f5f5f5",
                                borderRadius: "8px",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <Text type="secondary" style={{ color: "#999" }}>
                                近3年营收数据缺失
                              </Text>
                              <Button type="link" size="small">
                                去完善
                              </Button>
                            </div>
                          </div>
                        </Panel>
                        <Panel
                          header={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Space>
                                <span
                                  style={{ color: "#000", fontWeight: 500 }}
                                >
                                  已获批政策
                                </span>
                                <CheckCircleOutlined
                                  style={{ color: "#000" }}
                                />
                              </Space>
                            </div>
                          }
                          key="4"
                        >
                          <div
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "16px",
                            }}
                          >
                            <List
                              size="small"
                              dataSource={[
                                {
                                  title: "高新认定",
                                  amount: "20万",
                                  year: "2023",
                                },
                                {
                                  title: "科技型中小企业",
                                  amount: "资质",
                                  year: "2022",
                                },
                              ]}
                              renderItem={(item) => (
                                <List.Item style={{ padding: "8px 0" }}>
                                  <Space
                                    style={{
                                      width: "100%",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Text style={{ color: "#000" }}>
                                      {item.title}
                                    </Text>
                                    <Text type="secondary">{item.year}</Text>
                                  </Space>
                                </List.Item>
                              )}
                            />
                          </div>
                        </Panel>
                      </Collapse>

                      {/* 底部查看完整报告按钮 */}
                      <div style={{ padding: "16px" }}>
                        <Button
                          type="primary"
                          block
                          style={{
                            background: "#003a8c",
                            borderColor: "#003a8c",
                            borderRadius: "4px",
                            height: "40px",
                          }}
                          onClick={generateReport}
                          loading={reportLoading}
                        >
                          查看完整报告
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  {/* 中间：推荐结果展示区 (50%) */}
                  <Col xs={24} lg={12}>
                    <Tabs
                      activeKey={resultTab}
                      onChange={setResultTab}
                      items={[
                        {
                          key: "recommend",
                          label: (
                            <span>
                              首选推荐{" "}
                              <Badge
                                count="Beta"
                                style={{
                                  backgroundColor: "#ffca28",
                                  color: "#333",
                                  boxShadow: "none",
                                  transform: "scale(0.8)",
                                }}
                              />
                            </span>
                          ),
                        },
                        {
                          key: "more",
                          label: (
                            <span>
                              更多推荐{" "}
                              <Badge
                                count="Beta"
                                style={{
                                  backgroundColor: "#ffca28",
                                  color: "#333",
                                  boxShadow: "none",
                                  transform: "scale(0.8)",
                                }}
                              />
                            </span>
                          ),
                        },
                        {
                          key: "potential",
                          label: (
                            <span>
                              潜力推荐{" "}
                              <Badge
                                count="Beta"
                                style={{
                                  backgroundColor: "#ffca28",
                                  color: "#333",
                                  boxShadow: "none",
                                  transform: "scale(0.8)",
                                }}
                              />
                            </span>
                          ),
                        },
                      ]}
                      tabBarExtraContent={
                        resultTab === "more" ? (
                          <Select
                            defaultValue="match"
                            style={{ width: 120 }}
                            onChange={setSortOrder}
                          >
                            <Option value="match">匹配度</Option>
                            <Option value="amount">补贴金额</Option>
                            <Option value="date">截止日期</Option>
                          </Select>
                        ) : null
                      }
                    />

                    {resultTab === "recommend" && (
                      <Space
                        direction="vertical"
                        size={16}
                        style={{ width: "100%" }}
                      >
                        <Card
                          style={{
                            background:
                              "linear-gradient(135deg, #FFF5E6 0%, #FFFBF0 100%)",
                            border: "1px solid #FFE7BA",
                            borderRadius: "12px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                          bodyStyle={{ padding: "24px" }}
                          hoverable
                          onClick={() => handleCardClick(1)}
                        >
                          {cardLoading === 1 && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(255, 255, 255, 0.8)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                                borderRadius: "12px",
                              }}
                            >
                              <SyncOutlined
                                spin
                                style={{
                                  fontSize: "24px",
                                  color: "#1890ff",
                                  marginBottom: "8px",
                                }}
                              />
                              <span
                                style={{ color: "#1890ff", fontWeight: 500 }}
                              >
                                跳转中...
                              </span>
                            </div>
                          )}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* 左侧内容区 */}
                            <div style={{ flex: 1, paddingRight: "24px" }}>
                              {/* 标题 */}
                              <div style={{ marginBottom: "8px" }}>
                                <Title
                                  level={4}
                                  style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#333",
                                  }}
                                >
                                  朝阳区促进商务经济高质量发展引导资金
                                </Title>
                              </div>
                              {/* 描述小字 */}
                              <div style={{ marginBottom: "24px" }}>
                                <Text
                                  style={{ fontSize: "14px", color: "#666" }}
                                >
                                  促进产品销售 / 提升企业市场竞争优势 /
                                  企业市场推广补贴 / 最高补贴1000万元
                                </Text>
                              </div>

                              {/* 推荐理由区 */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* 推荐理由标识 */}
                                <div
                                  style={{
                                    marginRight: "24px",
                                    paddingRight: "24px",
                                    borderRight: "1px solid #E8E8E8",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#D46B08",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    推荐
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#D46B08",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    理由
                                  </span>
                                </div>

                                <Row gutter={48} style={{ flex: 1 }}>
                                  <Col>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      {/* 金币图标模拟 */}
                                      <div
                                        style={{
                                          width: 24,
                                          height: 24,
                                          borderRadius: "50%",
                                          background: "#FFF1B8",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#FAAD14",
                                          fontWeight: "bold",
                                          fontSize: "14px",
                                        }}
                                      >
                                        ¥
                                      </div>
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          政策奖励 (最高)
                                        </div>
                                        <div style={{ lineHeight: 1 }}>
                                          <span
                                            style={{
                                              fontSize: "28px",
                                              color: "#FF4D4F",
                                              fontWeight: "bold",
                                              fontFamily: "Arial",
                                            }}
                                          >
                                            3000
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#FF4D4F",
                                              marginLeft: "2px",
                                            }}
                                          >
                                            万
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      {/* 建筑图标模拟 */}
                                      <HomeOutlined
                                        style={{
                                          fontSize: "24px",
                                          color: "#FFEC3D",
                                        }}
                                      />
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          朝阳区获批企业
                                        </div>
                                        <div
                                          style={{
                                            lineHeight: 1,
                                            cursor: "pointer",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(
                                              "/policy-center/approved-list",
                                            );
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "28px",
                                              color: "#333",
                                              fontWeight: "bold",
                                              fontFamily: "Arial",
                                            }}
                                          >
                                            118
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#333",
                                              marginLeft: "2px",
                                            }}
                                          >
                                            家
                                          </span>
                                          <RightOutlined
                                            style={{
                                              fontSize: "12px",
                                              color: "#999",
                                              marginLeft: "4px",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>

                              {/* 受理部门 */}
                              <div
                                style={{
                                  marginTop: "24px",
                                  fontSize: "12px",
                                  color: "#999",
                                }}
                              >
                                受理部门：北京市朝阳区商务局
                              </div>
                            </div>

                            {/* 右侧操作区 */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                minWidth: "200px",
                              }}
                            >
                              {/* 成功率 */}
                              <div style={{ textAlign: "right" }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "4px",
                                  }}
                                >
                                  预估申报成功率
                                </div>
                                <div
                                  style={{ lineHeight: 1, marginBottom: "8px" }}
                                >
                                  <span
                                    style={{
                                      fontSize: "48px",
                                      color: "#8B572A",
                                      fontWeight: "bold",
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    81
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "24px",
                                      color: "#8B572A",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    %
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  完善信息，评估更准确{" "}
                                  <RightOutlined
                                    style={{
                                      fontSize: "10px",
                                      marginLeft: "4px",
                                    }}
                                  />
                                </div>
                              </div>

                              {/* 按钮 */}
                              <Button
                                type="primary"
                                size="large"
                                style={{
                                  height: "48px",
                                  padding: "0 24px",
                                  fontSize: "18px",
                                  background: "#8B572A",
                                  borderColor: "#8B572A",
                                  borderRadius: "4px",
                                  boxShadow:
                                    "0 4px 12px rgba(139, 87, 42, 0.2)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpertModalVisible(true);
                                }}
                              >
                                预约申领3000万
                              </Button>
                            </div>
                          </div>
                        </Card>

                        <Card
                          style={{
                            background:
                              "linear-gradient(135deg, #FFF5E6 0%, #FFFBF0 100%)",
                            border: "1px solid #FFE7BA",
                            borderRadius: "12px",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                          bodyStyle={{ padding: "24px" }}
                          hoverable
                          onClick={() => handleCardClick(2)}
                        >
                          {cardLoading === 2 && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(255, 255, 255, 0.8)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                                borderRadius: "12px",
                              }}
                            >
                              <SyncOutlined
                                spin
                                style={{
                                  fontSize: "24px",
                                  color: "#1890ff",
                                  marginBottom: "8px",
                                }}
                              />
                              <span
                                style={{ color: "#1890ff", fontWeight: 500 }}
                              >
                                跳转中...
                              </span>
                            </div>
                          )}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ flex: 1, paddingRight: "24px" }}>
                              <div style={{ marginBottom: "8px" }}>
                                <Title
                                  level={4}
                                  style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#333",
                                  }}
                                >
                                  北京市高新技术企业认定
                                </Title>
                              </div>
                              <div style={{ marginBottom: "24px" }}>
                                <Text
                                  style={{ fontSize: "14px", color: "#666" }}
                                >
                                  企业荣誉资质 / 税收减免40% / 资金奖励 /
                                  提升品牌价值
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: "24px",
                                    paddingRight: "24px",
                                    borderRight: "1px solid #E8E8E8",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#D46B08",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    推荐
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: "#D46B08",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    理由
                                  </span>
                                </div>

                                <Row gutter={48} style={{ flex: 1 }}>
                                  <Col>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 24,
                                          height: 24,
                                          borderRadius: "50%",
                                          background: "#FFF1B8",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#FAAD14",
                                          fontWeight: "bold",
                                          fontSize: "14px",
                                        }}
                                      >
                                        ¥
                                      </div>
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          政策奖励
                                        </div>
                                        <div style={{ lineHeight: 1 }}>
                                          <span
                                            style={{
                                              fontSize: "28px",
                                              color: "#FF4D4F",
                                              fontWeight: "bold",
                                              fontFamily: "Arial",
                                            }}
                                          >
                                            30-100
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#FF4D4F",
                                              marginLeft: "2px",
                                            }}
                                          >
                                            万
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <HomeOutlined
                                        style={{
                                          fontSize: "24px",
                                          color: "#FFEC3D",
                                        }}
                                      />
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            color: "#666",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          获批企业数
                                        </div>
                                        <div
                                          style={{
                                            lineHeight: 1,
                                            cursor: "pointer",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(
                                              "/policy-center/approved-list",
                                            );
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "28px",
                                              color: "#333",
                                              fontWeight: "bold",
                                              fontFamily: "Arial",
                                            }}
                                          >
                                            5000+
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#333",
                                              marginLeft: "2px",
                                            }}
                                          >
                                            家
                                          </span>
                                          <RightOutlined
                                            style={{
                                              fontSize: "12px",
                                              color: "#999",
                                              marginLeft: "4px",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>

                              <div
                                style={{
                                  marginTop: "24px",
                                  fontSize: "12px",
                                  color: "#999",
                                }}
                              >
                                受理部门：北京市科学技术委员会
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                minWidth: "200px",
                              }}
                            >
                              <div style={{ textAlign: "right" }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "4px",
                                  }}
                                >
                                  预估申报成功率
                                </div>
                                <div
                                  style={{ lineHeight: 1, marginBottom: "8px" }}
                                >
                                  <span
                                    style={{
                                      fontSize: "48px",
                                      color: "#8B572A",
                                      fontWeight: "bold",
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    95
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "24px",
                                      color: "#8B572A",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    %
                                  </span>
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  完善信息，评估更准确{" "}
                                  <RightOutlined
                                    style={{
                                      fontSize: "10px",
                                      marginLeft: "4px",
                                    }}
                                  />
                                </div>
                              </div>

                              <Button
                                type="primary"
                                size="large"
                                style={{
                                  height: "48px",
                                  padding: "0 24px",
                                  fontSize: "18px",
                                  background: "#8B572A",
                                  borderColor: "#8B572A",
                                  borderRadius: "4px",
                                  boxShadow:
                                    "0 4px 12px rgba(139, 87, 42, 0.2)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpertModalVisible(true);
                                }}
                              >
                                预约申领100万
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Space>
                    )}

                    {resultTab === "more" && (
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            marginBottom: "16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={onlyCompetitor}
                            onChange={(e) =>
                              setOnlyCompetitor(e.target.checked)
                            }
                          >
                            仅看同行已获批
                          </Checkbox>
                          <Select
                            defaultValue="match"
                            style={{ width: 150 }}
                            onChange={setSortOrder}
                          >
                            <Option value="match">匹配度排序</Option>
                            <Option value="amount">补贴金额排序</Option>
                            <Option value="rate">成功率排序</Option>
                          </Select>
                        </div>
                        <List
                          dataSource={[1, 2, 3, 4, 5]}
                          renderItem={(item) => (
                            <Card
                              style={{
                                marginBottom: "16px",
                                borderRadius: "8px",
                                position: "relative",
                                overflow: "hidden",
                              }}
                              hoverable
                              bodyStyle={{ padding: "20px" }}
                              onClick={() => handleCardClick(item + 10)}
                            >
                              {cardLoading === item + 10 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "rgba(255, 255, 255, 0.8)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 10,
                                    borderRadius: "8px",
                                  }}
                                >
                                  <SyncOutlined
                                    spin
                                    style={{
                                      fontSize: "24px",
                                      color: "#1890ff",
                                      marginBottom: "8px",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#1890ff",
                                      fontWeight: 500,
                                    }}
                                  >
                                    跳转中...
                                  </span>
                                </div>
                              )}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      marginBottom: "8px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Title
                                      level={5}
                                      style={{ margin: 0, fontSize: "16px" }}
                                    >
                                      {item === 1
                                        ? "【年报】创新型中小企业"
                                        : "企业研发机构建设专项资金"}
                                    </Title>
                                    {item === 2 && (
                                      <Tag
                                        color="red"
                                        style={{ marginLeft: "8px" }}
                                      >
                                        即将截止
                                      </Tag>
                                    )}
                                  </div>
                                  <div style={{ marginBottom: "12px" }}>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: "13px" }}
                                    >
                                      企业荣誉资质 / 科技项目入门条件
                                    </Text>
                                  </div>
                                  <Space size={24}>
                                    <div>
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                      >
                                        政策奖励：
                                      </Text>
                                      <Text
                                        style={{
                                          color: "#ff4d4f",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item === 1 ? "资质认定" : "300万"}
                                      </Text>
                                    </div>
                                    <div>
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                      >
                                        获批企业：
                                      </Text>
                                      <Text>499家</Text>
                                    </div>
                                    <div>
                                      <Text
                                        type="secondary"
                                        style={{ fontSize: "12px" }}
                                      >
                                        申报日期：
                                      </Text>
                                      <Text>
                                        {item === 2
                                          ? "6月1日-9月30日"
                                          : "全年受理"}
                                      </Text>
                                    </div>
                                  </Space>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "16px",
                                  }}
                                >
                                  <Button
                                    type={item === 1 ? "default" : "primary"}
                                    style={{
                                      borderColor:
                                        item === 1 ? "#1890ff" : undefined,
                                      color: item === 1 ? "#1890ff" : undefined,
                                    }}
                                  >
                                    {item === 1 ? "我要年报" : "我要申报"}
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          )}
                        />
                      </div>
                    )}

                    {/* 信息完善引导区 */}
                    <div
                      style={{
                        marginTop: "24px",
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Space>
                        <InfoCircleOutlined style={{ color: "#52c41a" }} />
                        <Text strong>完善年营收，推荐更精准</Text>
                        <Radio.Group
                          value={revenueRange}
                          onChange={(e) => setRevenueRange(e.target.value)}
                        >
                          <Radio value="a">2000万以下</Radio>
                          <Radio value="b">2000万-1亿</Radio>
                          <Radio value="c">1亿以上</Radio>
                        </Radio.Group>
                      </Space>
                      <Button
                        type="primary"
                        onClick={updateCompanyInfo}
                        loading={reportLoading}
                      >
                        提交
                      </Button>
                    </div>

                    {/* 底部申报辅导预约区 */}
                    <div
                      style={{
                        marginTop: "24px",
                        background: "#e6f7ff",
                        border: "1px solid #91d5ff",
                        borderRadius: "8px",
                        padding: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Title
                          level={5}
                          style={{ margin: "0 0 8px 0", color: "#0050b3" }}
                        >
                          如何申报？预约专家上门辅导
                        </Title>
                        <Text type="secondary">
                          全国70座城市立即上门 • 1对1深度诊断 • 全程代办服务
                        </Text>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => setExpertModalVisible(true)}
                      >
                        我要申报
                      </Button>
                    </div>
                  </Col>

                  {/* 右侧：辅助服务联动区 (25%) */}
                  <Col xs={24} lg={6}>
                    <Space
                      direction="vertical"
                      size={24}
                      style={{ width: "100%" }}
                    >
                      {/* 咨询师列表 */}
                      <Card
                        title="政策申报规划咨询"
                        bordered={false}
                        style={{ borderRadius: "12px" }}
                        extra={
                          <Button
                            type="text"
                            icon={<SyncOutlined />}
                            onClick={swapConsultants}
                          >
                            换一换
                          </Button>
                        }
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={consultants}
                          renderItem={(item) => (
                            <List.Item
                              actions={[
                                <Button
                                  size="small"
                                  style={{
                                    borderColor: "#1890ff",
                                    color: "#1890ff",
                                    fontSize: "12px",
                                  }}
                                >
                                  在线咨询
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src={item.avatar} size={40} />}
                                title={
                                  <a href="#" style={{ color: "#333" }}>
                                    {item.name}
                                  </a>
                                }
                                description={
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                  >
                                    {item.responseTime}
                                  </Text>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </Card>

                      {/* 企业补贴速览 */}
                      <Card
                        title="同行补贴速览"
                        bordered={false}
                        style={{ borderRadius: "12px" }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          <Slider range defaultValue={[20, 50]} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              20万
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              50万
                            </Text>
                          </div>
                        </div>
                        <List
                          size="small"
                          dataSource={competitors}
                          renderItem={(item) => (
                            <List.Item>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <Text
                                  ellipsis
                                  style={{ maxWidth: "120px", color: "#333" }}
                                >
                                  {item.name}
                                </Text>
                                <Text
                                  style={{
                                    color: "#faad14",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.subsidy}
                                </Text>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>

                      {/* 申报辅导预约 */}
                      <Card
                        title="申报辅导预约"
                        bordered={false}
                        style={{ borderRadius: "12px", background: "#e6f7ff" }}
                      >
                        <div
                          style={{ textAlign: "center", marginBottom: "16px" }}
                        >
                          <Text type="secondary">北京地区今日剩余名额：</Text>
                          <Text
                            strong
                            style={{ color: "#1890ff", fontSize: "18px" }}
                          >
                            5
                          </Text>
                        </div>
                        <Form layout="vertical" size="small">
                          <Form.Item
                            label="联系人"
                            required
                            style={{ marginBottom: "8px" }}
                          >
                            <Input placeholder="请输入姓名" />
                          </Form.Item>
                          <Form.Item
                            label="联系电话"
                            required
                            style={{ marginBottom: "16px" }}
                          >
                            <Input placeholder="请输入手机号" />
                          </Form.Item>
                          <Button
                            type="primary"
                            block
                            onClick={() =>
                              message.success(
                                "预约成功！专员将在23:59:59内联系",
                              )
                            }
                          >
                            立即预约
                          </Button>
                        </Form>
                      </Card>
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="mx-auto max-w-6xl px-8 pb-10">
        {searchTab === "search" && showResults ? (
          <section
            id="search-result-sections"
            className="max-w-6xl mx-auto space-y-6 animate-fade-in"
          >
            <div className="grid grid-cols-12 gap-5">
              {/* PDF 预览 */}
              <div className="col-span-8 bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>
                    政策深度解读分析
                  </h3>
                  <button className="text-blue-600 text-sm flex items-center hover:underline">
                    全屏预览{" "}
                    <ArrowLeftRight className="ml-1 rotate-45" size={14} />
                  </button>
                </div>
                <div className="bg-slate-100 rounded border border-slate-200 aspect-[16/9] flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-white/90 p-10 flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                    <FileIcon size={60} className="text-red-500 mb-4" />
                    <p className="text-slate-800 font-bold text-xl mb-2">
                      2026年企业研发投入奖补政策白皮书.pdf
                    </p>
                    <p className="text-slate-400 text-sm mb-6">
                      政策类型：科技创新 | 颁布日期：2026-01-15
                    </p>
                    <button className="px-6 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-700 transition-colors">
                      预览第 1/12 页
                    </button>
                  </div>
                </div>
              </div>

              {/* 奖励模块 */}
              <div className="col-span-4 flex flex-col gap-5">
                <div className="flex-1 bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Trophy className="text-orange-600" size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">
                    资金奖励详情
                  </h4>
                  <p className="text-sm text-slate-500">最高可申请补贴额度</p>
                  <p className="text-3xl font-black text-orange-500 mt-2">
                    ¥5,000,000
                  </p>
                </div>
                <div className="flex-1 bg-white p-5 rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="text-indigo-600" size={24} />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">
                    荣誉资质认定
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] rounded border border-indigo-100">
                      省重点项目
                    </span>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] rounded border border-indigo-100">
                      数字标杆企业
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 结果列表 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div className="flex items-center space-x-4">
                  <p className="text-slate-500 text-sm">
                    为您找到相关政策{" "}
                    <span className="font-bold text-slate-800">56</span> 条
                  </p>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <button className="flex items-center text-xs text-slate-600 hover:text-blue-600 font-medium transition-colors">
                    <PencilRuler size={14} className="mr-1" /> 批量编辑
                  </button>
                  <button className="flex items-center text-xs text-slate-600 hover:text-blue-600 font-medium transition-colors">
                    <ArrowUpFromLine size={14} className="mr-1" /> 导出数据
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-400">排序方式：</span>
                  <div className="flex items-center bg-slate-50 rounded-lg p-1">
                    <button className="px-4 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-md shadow-sm">
                      综合排序
                    </button>
                    <button className="px-4 py-1.5 text-slate-500 text-xs hover:text-slate-700">
                      最新发布
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                {policyData.map((item) => (
                  <PolicyCard
                    key={item.id}
                    data={item}
                    onClick={handleCardClick}
                  />
                ))}
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-50">
                <p className="text-sm text-slate-400">
                  显示第 1-10 条结果，共 56 条
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 flex items-center rounded border border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-colors text-sm">
                    <ChevronLeft size={14} className="mr-1" /> 上一页
                  </button>
                  <div className="flex items-center space-x-1">
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-200">
                      1
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                      2
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                      3
                    </button>
                    <span className="px-2 text-slate-300">...</span>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                      6
                    </button>
                  </div>
                  <button className="px-3 py-1.5 flex items-center rounded border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-colors text-sm">
                    下一页 <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          (searchTab === "search" ||
            (searchTab === "match" && !isMatching && !matchComplete)) && (
            <>
              <div className="flex items-center space-x-6 border-b border-slate-200">
                <button
                  className={`pb-3 text-lg ${activeTab === "overview" ? "font-bold text-slate-800 border-b-2 border-slate-800" : "font-medium text-slate-400 hover:text-slate-600"}`}
                  onClick={() => setActiveTab("overview")}
                  type="button"
                >
                  数据概览
                </button>
                <button
                  className={`pb-3 text-lg ${activeTab === "latest" ? "font-bold text-slate-800 border-b-2 border-slate-800" : "font-medium text-slate-400 hover:text-slate-600"}`}
                  onClick={() => setActiveTab("latest")}
                  type="button"
                >
                  最新政策
                </button>
              </div>

              {activeTab === "overview" ? (
                <>
                  <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                      <div className="mb-8 flex items-center justify-between">
                        <h3 className="flex items-center font-bold text-slate-800">
                          <span className="mr-2 h-4 w-1.5 rounded-full bg-blue-500" />
                          政策分类分布
                        </h3>
                        <span className="text-xs text-slate-400">实时更新</span>
                      </div>
                      <ReactECharts
                        option={categoryChartOption}
                        style={{ height: 320 }}
                      />
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                      <div className="mb-8 flex items-center justify-between">
                        <h3 className="flex items-center font-bold text-slate-800">
                          <span className="mr-2 h-4 w-1.5 rounded-full bg-indigo-500" />
                          各地区政策数量
                        </h3>
                        <div className="flex items-center space-x-1 outline outline-1 outline-slate-100 rounded-lg p-0.5">
                          <button
                            className={`px-2 py-0.5 text-[10px] ${regionRange === "year" ? "bg-slate-100 text-slate-600 rounded shadow-sm" : "text-slate-400"}`}
                            onClick={() => setRegionRange("year")}
                            type="button"
                          >
                            近一年
                          </button>
                          <button
                            className={`px-2 py-0.5 text-[10px] ${regionRange === "threeYear" ? "bg-slate-100 text-slate-600 rounded shadow-sm" : "text-slate-400"}`}
                            onClick={() => setRegionRange("threeYear")}
                            type="button"
                          >
                            近三年
                          </button>
                        </div>
                      </div>
                      <ReactECharts
                        option={regionChartOption}
                        style={{ height: 320 }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                      <div className="mb-2 text-indigo-400">
                        <FileTextOutlined style={{ fontSize: 24 }} />
                      </div>
                      <p className="text-2xl font-bold text-indigo-900">
                        1.2W+
                      </p>
                      <p className="mt-1 text-xs text-indigo-600">
                        今日新增政策
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                      <div className="mb-2 text-blue-400">
                        <TeamOutlined style={{ fontSize: 24 }} />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">85W+</p>
                      <p className="mt-1 text-xs text-blue-600">累计匹配企业</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="mb-2 text-emerald-400">
                        <ThunderboltOutlined style={{ fontSize: 24 }} />
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">
                        2.4B
                      </p>
                      <p className="mt-1 text-xs text-emerald-600">
                        申报辅助总额
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="mb-2 text-slate-400">
                        <RobotOutlined style={{ fontSize: 24 }} />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        AI匹配
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        智能分析引擎
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                  <List
                    itemLayout="horizontal"
                    dataSource={[1, 2, 3, 4, 5]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[<Button type="link">查看详情</Button>]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{ backgroundColor: "#1677ff" }}
                              icon={<FileTextOutlined />}
                            />
                          }
                          title={
                            <a href="#">
                              关于开展2024年度高新技术企业认定工作的通知
                            </a>
                          }
                          description="发布日期：2024-01-15 | 发布部门：科技部 | 适用地区：全国"
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* 匹配维度选择弹窗 */}
      <Modal
        title="选择匹配优先级（Beta）"
        open={matchModalVisible}
        onOk={startMatchProcess}
        onCancel={() => setMatchModalVisible(false)}
        okText="确认匹配"
        cancelText="取消"
        width={480}
        bodyStyle={{ padding: "24px" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Radio.Group
            onChange={(e) => setMatchPriority(e.target.value)}
            value={matchPriority}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Radio value="comprehensive">
              <Space direction="vertical" size={0}>
                <Text strong>综合适配优先</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  均衡行业、地区、资质、营收等维度
                </Text>
              </Space>
            </Radio>
            <Radio value="amount">
              <Space direction="vertical" size={0}>
                <Text strong>补贴金额优先</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  优先匹配补贴金额≥100 万的政策
                </Text>
              </Space>
            </Radio>
            <Radio value="difficulty">
              <Space direction="vertical" size={0}>
                <Text strong>申报难度优先</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  优先匹配申报材料≤5 项的政策
                </Text>
              </Space>
            </Radio>
          </Radio.Group>
        </div>
      </Modal>

      {/* 中断确认弹窗 */}
      <Modal
        title="确认中断匹配？"
        open={showInterruptModal}
        onOk={confirmInterrupt}
        onCancel={() => setShowInterruptModal(false)}
        okText="确认中断"
        cancelText="继续匹配"
        okButtonProps={{ danger: true }}
      >
        <p>当前匹配进度 {matchProgress}%，中断后需重新触发匹配，是否确认？</p>
      </Modal>

      {/* 申报材料清单弹窗 */}
      <Modal
        title="申报材料清单"
        open={materialModalVisible}
        onOk={() => {
          setMaterialModalVisible(false);
          message.success("已生成申报预约待办");
        }}
        onCancel={() => setMaterialModalVisible(false)}
        okText="确认下载并创建待办"
        cancelText="取消"
      >
        <List
          dataSource={[
            "营业执照复印件",
            "近三年财务审计报告",
            "纳税证明",
            "知识产权证书",
          ]}
          renderItem={(item) => (
            <List.Item>
              <Space>
                <FileTextOutlined /> {item}
              </Space>
            </List.Item>
          )}
        />
      </Modal>

      {/* 专家预约表单弹窗 - 优化版 */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
              marginTop: "8px",
            }}
          >
            <div
              style={{ fontSize: "26px", fontWeight: "bold", color: "#333" }}
            >
              预约政策专家，帮你成功申报
            </div>
          </div>
        }
        open={expertModalVisible}
        footer={null}
        onCancel={() => setExpertModalVisible(false)}
        width={560}
        centered
        bodyStyle={{ padding: "0 40px 32px" }}
        closeIcon={
          <CloseCircleFilled style={{ fontSize: "20px", color: "#ccc" }} />
        }
      >
        <Form
          layout="vertical"
          size="large"
          initialValues={{
            name: "王佳",
            phone: "15810593655",
            company: "北京积分时代科技有限公司",
          }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "请输入您的姓名" }]}
            style={{ marginBottom: "24px" }}
          >
            <Input
              prefix={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "60px",
                  }}
                >
                  <span style={{ color: "#ff4d4f", marginRight: "4px" }}>
                    *
                  </span>
                  <span style={{ color: "#333", fontSize: "16px" }}>姓名</span>
                </div>
              }
              style={{
                borderRadius: "4px",
                height: "60px",
                fontSize: "16px",
                paddingLeft: "16px",
              }}
              bordered={true}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "请输入您的手机号码" }]}
            style={{ marginBottom: "24px" }}
          >
            <Input
              prefix={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "90px",
                  }}
                >
                  <span style={{ color: "#ff4d4f", marginRight: "4px" }}>
                    *
                  </span>
                  <span style={{ color: "#333", fontSize: "16px" }}>
                    手机号码
                  </span>
                </div>
              }
              style={{
                borderRadius: "4px",
                height: "60px",
                fontSize: "16px",
                paddingLeft: "16px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="company"
            rules={[{ required: true, message: "请输入企业名称" }]}
            style={{ marginBottom: "40px" }}
          >
            <Input
              prefix={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "90px",
                  }}
                >
                  <span style={{ color: "#ff4d4f", marginRight: "4px" }}>
                    *
                  </span>
                  <span style={{ color: "#333", fontSize: "16px" }}>
                    企业名称
                  </span>
                </div>
              }
              style={{
                borderRadius: "4px",
                height: "60px",
                fontSize: "16px",
                paddingLeft: "16px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "32px" }}>
            <Button
              type="primary"
              block
              style={{
                height: "56px",
                fontSize: "20px",
                background: "#3B82F6",
                borderRadius: "6px",
                fontWeight: 500,
                border: "none",
              }}
              onClick={() => {
                setExpertModalVisible(false);
                message.success("预约成功！专员将在1个工作日内联系您");
              }}
            >
              预约
            </Button>
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              color: "#666",
              fontSize: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <MessageOutlined style={{ color: "#3B82F6", fontSize: "20px" }} />{" "}
              在线咨询
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <PhoneOutlined style={{ color: "#3B82F6", fontSize: "20px" }} />{" "}
              4008-000-159{" "}
              <span style={{ color: "#999", cursor: "pointer" }}>复制</span>
            </div>
          </div>
        </Form>
      </Modal>

      {/* 样式覆盖 */}
      <style>{`
        .ant-input-search-button { height: 56px !important; }
        .ant-input-group .ant-input { 
          height: 56px !important; 
          font-size: 16px; 
          border-radius: 8px 0 0 8px !important; 
        }
        .ant-tabs-nav::before { border-bottom: none !important; }
      `}</style>

      {/* AI Policy Assistant Modal */}
      <AIPolicyModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        context={aiContext}
      />
      {searchTab === "search" && searchLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              transform: "translateY(-20px)",
            }}
          >
            <Spin size="large" />
            <div
              style={{
                color: "#1677ff",
                fontSize: "18px",
                fontWeight: 600,
                lineHeight: "24px",
                fontFamily: "NotoSans-regular",
              }}
            >
              正在搜索中...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPolicySearchV2;
