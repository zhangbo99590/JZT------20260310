import React, { useState, useMemo, useEffect } from "react";
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
  Tooltip,
  Modal,
  message,
  Dropdown,
  Alert,
  Breadcrumb,
  Radio,
  Spin,
} from "antd";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import PageWrapper from "../../components/PageWrapper";
import { useDebounce } from "../../hooks/useDebounce";
import {
  DownloadOutlined,
  BookOutlined,
  TeamOutlined,
  BankOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  HeartOutlined,
  HeartFilled,
  RiseOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CloseOutlined,
  CrownOutlined,
  FileTextOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import SafeECharts from "../../components/SafeECharts";
import type { EChartsOption } from "echarts";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// 类型定义
interface RegulationItem {
  id: string;
  title: string;
  level: string; // 效力层级
  field: string;
  scenario: string; // 业务场景
  publishOrg: string;
  publishDate: string;
  effectiveDate: string;
  status: "effective" | "revised" | "abolished";
  tags: string[];
  summary: string;
  keyArticles: string[]; // 核心条款摘要
  viewCount: number;
  downloadCount: number;
  matchScore?: number;
  isNew?: boolean;
}

interface FilterCriteria {
  scenario: string; // 企业场景
  level: string[]; // 效力层级 (Checkbox Group)
  status: "effective" | "revised" | "abolished" | "all"; // 法规状态
  timeRange: string; // 时效性
  keyword: string;
}

interface SavedFilter {
  id: string;
  name: string;
  criteria: FilterCriteria;
}

// 模拟数据
const mockData: RegulationItem[] = [
  {
    id: "5",
    title: "中华人民共和国电子商务法 (2024修订)",
    level: "法律",
    field: "商法",
    scenario: "电商维权",
    publishOrg: "全国人大常委会",
    publishDate: "2024-03-15",
    effectiveDate: "2024-06-01",
    status: "effective",
    tags: ["电商平台", "消费者权益", "二选一"],
    summary: "保障电子商务各方主体合法权益，规范电子商务行为，维护市场秩序。",
    keyArticles: [
      "第十二条：电子商务经营者从事经营活动，依法需要取得相关行政许可的，应当依法取得行政许可。",
      "第十五条：电子商务经营者应当在其首页显著位置，持续公示营业执照信息、与其经营业务有关的行政许可信息...",
    ],
    viewCount: 56700,
    downloadCount: 12300,
    isNew: true,
  },
  {
    id: "1",
    title: "中华人民共和国劳动合同法",
    level: "法律",
    field: "劳动法",
    scenario: "用工合规",
    publishOrg: "全国人大常委会",
    publishDate: "2012-12-28",
    effectiveDate: "2013-07-01",
    status: "effective",
    tags: ["劳动合同", "试用期", "离职补偿"],
    summary: "规范劳动合同制度，保护劳动者合法权益，构建和谐劳动关系。",
    keyArticles: [
      "第十条 建立劳动关系，应当订立书面劳动合同。",
      "第十九条 劳动合同期限三个月以上不满一年的，试用期不得超过一个月。",
      "第三十七条 劳动者提前三十日以书面形式通知用人单位，可以解除劳动合同。",
    ],
    viewCount: 45680,
    downloadCount: 8920,
    isNew: false,
  },
  {
    id: "2",
    title: "企业所得税法实施条例",
    level: "行政法规",
    field: "财税法",
    scenario: "税务合规",
    publishOrg: "国务院",
    publishDate: "2019-04-23",
    effectiveDate: "2019-04-23",
    status: "effective",
    tags: ["企业所得税", "税收优惠", "扣除项目"],
    summary: "详细规定了企业所得税的征收管理、税收优惠等实施细则。",
    keyArticles: [
      "第九条 企业应纳税所得额的计算，以权责发生制为原则。",
      "第三十四条 企业发生的合理的工资薪金支出，准予扣除。",
    ],
    viewCount: 28920,
    downloadCount: 5420,
    isNew: true,
  },
  {
    id: "3",
    title: "网络安全法",
    level: "法律",
    field: "网络安全",
    scenario: "数据合规",
    publishOrg: "全国人大常委会",
    publishDate: "2016-11-07",
    effectiveDate: "2017-06-01",
    status: "effective",
    tags: ["个人信息", "网络运行安全", "数据出境"],
    summary: "保障网络安全，维护网络空间主权和国家安全、社会公共利益。",
    keyArticles: [
      "第二十一条 国家实行网络安全等级保护制度。",
      "第四十一条 网络运营者收集、使用个人信息，应当遵循合法、正当、必要的原则。",
    ],
    viewCount: 35420,
    downloadCount: 6340,
    isNew: false,
  },
  {
    id: "4",
    title: "已废止-旧公司法",
    level: "法律",
    field: "商法",
    scenario: "公司治理",
    publishOrg: "全国人大常委会",
    publishDate: "2013-12-28",
    effectiveDate: "2014-03-01",
    status: "abolished",
    tags: ["公司设立", "股东权益"],
    summary: "规范公司的组织和行为（已废止）。",
    keyArticles: ["..."],
    viewCount: 1200,
    downloadCount: 100,
    isNew: false,
  },
  {
    id: "civil-code-2020",
    title: "中华人民共和国民法典",
    level: "法律",
    field: "民商法",
    scenario: "合同履约",
    publishOrg: "全国人大",
    publishDate: "2020-05-28",
    effectiveDate: "2021-01-01",
    status: "effective",
    tags: ["合同", "侵权责任", "物权", "人格权"],
    summary:
      "新中国第一部以法典命名的法律，被称为“社会生活的百科全书”，是民事权利的宣言书和保障书。",
    keyArticles: [
      "第七条 民事主体从事民事活动，应当遵循诚信原则，秉持诚实，恪守承诺。",
      "第一百八十八条 向人民法院请求保护民事权利的诉讼时效期间为三年。",
      "第四百六十五条 依法成立的合同，受法律保护。",
    ],
    viewCount: 102340,
    downloadCount: 45200,
    isNew: false,
  },
];

// 热门场景
const hotScenarios = [
  { label: "劳动雇佣", icon: <TeamOutlined />, color: "#1890ff" },
  { label: "数据合规", icon: <SafetyCertificateOutlined />, color: "#722ed1" },
  { label: "股权激励", icon: <RiseOutlined />, color: "#52c41a" },
  { label: "反垄断法", icon: <ThunderboltOutlined />, color: "#fa8c16" },
  { label: "电商维权", icon: <BankOutlined />, color: "#eb2f96" },
];

const RegulationQuery: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 筛选状态
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    scenario: "全部",
    level: ["法律", "行政法规", "最高院司法解释", "地方性法规"], // 默认全选
    status: "effective",
    timeRange: "全部",
    keyword: "",
  });

  // 搜索相关
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    { type: string; value: string }[]
  >([]);
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [searchLoading, setSearchLoading] = useState(false);

  // 排序
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "level">(
    "relevance",
  );

  // 保存筛选
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");

  // 模拟数据更新（本月新增）
  // const [newCount, setNewCount] = useState(124);
  // const [expiringCount, setExpiringCount] = useState(8);

  // 风险提示
  const [riskAlertVisible, setRiskAlertVisible] = useState(false);
  const [riskAlertMessage, setRiskAlertMessage] = useState("");

  // 会员弹窗
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [analysisClickCount, setAnalysisClickCount] = useState(0);

  // 收藏状态管理
  const [favorites, setFavorites] = useState<any[]>([]);

  // 加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("my-favorites") || "[]");
        setFavorites(stored);
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    };
    loadFavorites();

    // 监听 storage 事件以同步状态
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "my-favorites") {
        loadFavorites();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 切换收藏状态
  const toggleFavorite = (record: RegulationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const list = [...favorites];
      const index = list.findIndex(
        (item: any) => item.id === record.id && item.type === "regulation",
      );

      if (index > -1) {
        // 取消收藏
        list.splice(index, 1);
        message.success("已取消收藏");
      } else {
        // 添加收藏
        list.unshift({
          id: record.id,
          title: record.title,
          description: record.summary,
          type: "regulation",
          category: record.level,
          addedDate: dayjs().format("YYYY-MM-DD"),
          sourceModule: "合规管理",
          url: `/legal-support/regulation-query/detail/${record.id}`,
          tags: record.tags,
          status: record.status,
          amount: 0,
        });
        message.success("已添加至收藏");
      }

      setFavorites(list);
      localStorage.setItem("my-favorites", JSON.stringify(list));

      // 触发 storage 事件以便其他组件感知
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "my-favorites",
          newValue: JSON.stringify(list),
        }),
      );
    } catch (error) {
      console.error("操作失败:", error);
      message.error("操作失败");
    }
  };

  // 初始化来自 State 的参数
  useEffect(() => {
    const state = location.state as { scenario?: string } | undefined;
    if (state?.scenario) {
      setFilterCriteria((prev) => ({ ...prev, scenario: state.scenario! }));
      setSearchKeyword(state.scenario!);
      // Trigger risk alert for specific scenarios
      if (["电商维权", "数据合规"].includes(state.scenario!)) {
        setRiskAlertVisible(true);
        setRiskAlertMessage(
          `检测到“${state.scenario}”涉及《电子商务法》及《个人信息保护法》交叉影响，近期海关统计要求有新变动，建议重点关注本周更新的红色条款。`,
        );
      }
    }
  }, [location.state]);

  // 搜索联想逻辑
  useEffect(() => {
    if (debouncedKeyword) {
      setSearchLoading(true);
      // 模拟异步联想
      setTimeout(() => {
        const suggestions = [];
        // 场景联想
        hotScenarios.forEach((s) => {
          if (s.label.includes(debouncedKeyword)) {
            suggestions.push({ type: "场景", value: s.label });
          }
        });
        // 扩展联想
        if (debouncedKeyword.includes("电商")) {
          suggestions.push({ type: "场景", value: "跨境电商知识产权侵权" });
          suggestions.push({ type: "场景", value: "跨境电商数据合规" });
        }
        // 法规匹配
        mockData.forEach((d) => {
          if (d.title.includes(debouncedKeyword)) {
            suggestions.push({ type: "法规", value: d.title });
          }
        });
        setSearchSuggestions(suggestions);
        setSearchLoading(false);
      }, 200);
    } else {
      setSearchSuggestions([]);
    }
  }, [debouncedKeyword]);

  // 计算筛选结果
  const filteredData = useMemo(() => {
    let result = [...mockData];

    // 筛选逻辑
    if (filterCriteria.scenario !== "全部") {
      // Fuzzy match for scenario to allow "电商" to match "电商维权"
      result = result.filter(
        (item) =>
          item.scenario.includes(filterCriteria.scenario) ||
          filterCriteria.scenario === "全部",
      );
    }

    // Level Filter (Array check)
    if (filterCriteria.level.length > 0) {
      result = result.filter((item) =>
        filterCriteria.level.includes(item.level),
      );
    } else {
      // If nothing checked, maybe show nothing or all? Usually show nothing.
      // result = [];
    }

    // Status Filter
    if (filterCriteria.status !== "all") {
      result = result.filter((item) => item.status === filterCriteria.status);
    }

    if (filterCriteria.keyword) {
      result = result.filter(
        (item) =>
          item.title.includes(filterCriteria.keyword) ||
          item.scenario.includes(filterCriteria.keyword),
      );
    }

    // 排序逻辑
    if (sortBy === "date") {
      result.sort((a, b) => dayjs(b.publishDate).diff(dayjs(a.publishDate)));
    } else if (sortBy === "level") {
      const levelOrder: Record<string, number> = {
        法律: 3,
        行政法规: 2,
        部门规章: 1,
      };
      result.sort(
        (a, b) => (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0),
      );
    }
    // 'relevance' 简单模拟，默认顺序

    return result;
  }, [filterCriteria, sortBy]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setFilterCriteria((prev) => ({ ...prev, keyword: value }));
    setSearchSuggestions([]); // 关闭联想

    // Check for risk alert trigger based on keyword
    if (value.includes("电商") || value.includes("数据")) {
      setRiskAlertVisible(true);
      setRiskAlertMessage(
        `检测到“${value}”涉及相关法规交叉影响，近期监管要求有变动，建议重点关注红色条款。`,
      );
    } else {
      setRiskAlertVisible(false);
    }
  };

  // 热门场景点击
  const handleScenarioClick = (scenario: string) => {
    // Toggle logic or set? Requirement says "click to trigger search"
    setFilterCriteria((prev) => ({
      ...prev,
      scenario: scenario,
      keyword: scenario,
    }));
    setSearchKeyword(scenario);
    handleSearch(scenario);
  };

  // 保存筛选
  const handleSaveFilter = () => {
    if (!newFilterName) return message.warning("请输入名称");
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      criteria: { ...filterCriteria },
    };
    setSavedFilters([...savedFilters, newFilter]);
    setSaveModalVisible(false);
    setNewFilterName("");
    message.success("筛选条件已保存");
  };

  /*
  // 调用筛选
  const handleApplyFilter = (filter: SavedFilter) => {
    setFilterCriteria(filter.criteria);
    message.success(`已应用“${filter.name}”筛选`);
  };

  // 重置筛选
  const handleResetFilter = () => {
    setFilterCriteria({
      scenario: '全部',
      level: ['法律', '最高院司法解释'], // Default per requirements
      status: 'effective',
      timeRange: '全部',
      keyword: ''
    });
    setSearchKeyword('');
    message.info('筛选已重置');
  };
  */

  // 导出
  const handleExport = () => {
    // If none selected, export all in current list? Requirement says "export current list all regulations"
    const count =
      selectedRowKeys.length > 0 ? selectedRowKeys.length : filteredData.length;
    const date = dayjs().format("YYYYMMDD");
    const scenarioName =
      filterCriteria.scenario !== "全部" ? filterCriteria.scenario : "通用";

    Modal.confirm({
      title: "确认导出",
      icon: <DownloadOutlined />,
      content: `即将打包导出 ${count} 条法规为“璟智通-${scenarioName}法规汇编-${date}.pdf”`,
      onOk: () => {
        message
          .loading("正在生成汇编文件...", 2)
          .then(() => message.success("下载已开始"));
      },
    });
  };

  // 会员弹窗逻辑
  /*
  const handleAnalysisClick = (record: RegulationItem) => {
    // Mock check for membership (assume non-member for demo)
    const isMember = false; 
    if (!isMember) {
      if (analysisClickCount >= 1) {
        setMemberModalVisible(true);
      } else {
        setAnalysisClickCount(prev => prev + 1);
        message.success('已为您生成合规解析预览');
        // Navigate or show preview
        navigate(`/legal-support/regulation-analysis/${record.id}`, { state: { scenario: record.scenario } });
      }
    } else {
       navigate(`/legal-support/regulation-analysis/${record.id}`, { state: { scenario: record.scenario } });
    }
  };
  */

  // 图表点击事件处理
  const handleChartClick = (params: any) => {
    if (params.name) {
      const domain = params.name;
      setFilterCriteria((prev) => ({
        ...prev,
        scenario: domain,
        keyword: domain,
      }));
      setSearchKeyword(domain);
      message.success(`已筛选"${domain}"领域的法规`);
    }
  };

  // 图表配置 - 重点合规领域分布
  const complianceChartOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const data = params[0];
        return `<div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
          <div>法规数量: <span style="color: #1890ff; font-weight: bold;">${data.value}</span></div>
          <div style="color: #999; font-size: 12px; margin-top: 4px;">点击查看该领域法规</div>
        </div>`;
      },
    },
    grid: {
      top: "5%",
      bottom: "5%",
      left: "3%",
      right: "8%",
      containLabel: true,
    },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: ["市场监管", "数据合规", "知识产权", "财税合规", "劳动人事"],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: "#666", fontWeight: "bold" },
    },
    series: [
      {
        name: "法规数量",
        type: "bar",
        data: [45, 60, 75, 98, 120],
        label: { show: true, position: "right", color: "#666" },
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#8ec5fc" },
              { offset: 1, color: "#e0c3fc" },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#1890ff" },
                { offset: 1, color: "#722ed1" },
              ],
            },
          },
        },
        barWidth: 20,
      },
    ],
  };

  // 表格列定义
  const columns: ColumnsType<RegulationItem> = [
    {
      title: "法规内容",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ padding: "8px 0" }}>
          <div style={{ marginBottom: 8 }}>
            <Space>
              <Tag color={record.level === "法律" ? "gold" : "blue"}>
                {record.level}
              </Tag>
              <Tag
                color={record.status === "effective" ? "success" : "default"}
              >
                {record.status === "effective"
                  ? "现行有效"
                  : record.status === "revised"
                    ? "已修订"
                    : "尚未生效"}
              </Tag>
              <a
                onClick={() =>
                  navigate(
                    `/legal-support/regulation-query/detail/${record.id}`,
                    { state: { scenario: record.scenario } },
                  )
                }
                style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
              >
                {text}
              </a>
            </Space>
          </div>

          <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
            <Space size="large">
              <span>
                <BankOutlined /> {record.publishOrg}
              </span>
              <span>
                <HistoryOutlined /> 发布：{record.publishDate}
              </span>
              <span>
                <RocketOutlined /> 实施：{record.effectiveDate}
              </span>
            </Space>
          </div>

          <div
            style={{ background: "#f9f9f9", padding: "12px", borderRadius: 6 }}
          >
            <Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: "展开核心条款" }}
              style={{ margin: 0 }}
            >
              {record.keyArticles.map((article, idx) => (
                <div key={idx} style={{ marginBottom: 4 }}>
                  <Text strong>{article.split("：")[0]}：</Text>
                  <Text>{article.split("：")[1] || article}</Text>
                </div>
              ))}
            </Paragraph>
          </div>
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看全文">
            <Button
              type="text"
              icon={
                <FileTextOutlined
                  style={{ fontSize: "16px", color: "#1890ff" }}
                />
              }
              onClick={() =>
                navigate(
                  `/legal-support/regulation-query/detail/${record.id}`,
                  { state: { scenario: record.scenario } },
                )
              }
            />
          </Tooltip>

          <Tooltip
            title={
              favorites.some(
                (f) => f.id === record.id && f.type === "regulation",
              )
                ? "取消收藏"
                : "收藏"
            }
          >
            <Button
              type="text"
              icon={
                favorites.some(
                  (f) => f.id === record.id && f.type === "regulation",
                ) ? (
                  <HeartFilled style={{ fontSize: "16px", color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined
                    style={{ fontSize: "16px", color: "#ff4d4f" }}
                  />
                )
              }
              onClick={(e) => toggleFavorite(record, e)}
            />
          </Tooltip>

          <Tooltip title="下载">
            <Button
              type="text"
              icon={
                <DownloadOutlined
                  style={{ fontSize: "16px", color: "#52c41a" }}
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                message.success("开始下载法规文件");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageWrapper module="legal">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Breadcrumb
          items={[{ title: "法律护航" }, { title: "法规查询" }]}
          style={{ marginBottom: 16 }}
        />
        {/* 1. 智能法规场景化查询区 */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            智能法规场景化查询
          </Title>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Dropdown
              menu={{
                items: searchSuggestions.map((s) => ({
                  key: s.value,
                  label: (
                    <Space>
                      {s.type === "场景" ? (
                        <EnvironmentOutlined style={{ color: "#1890ff" }} />
                      ) : (
                        <BookOutlined style={{ color: "#52c41a" }} />
                      )}
                      <span>{s.value}</span>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {s.type}
                      </Text>
                    </Space>
                  ),
                  onClick: () => {
                    setSearchKeyword(s.value);
                    handleSearch(s.value);
                  },
                })),
              }}
              open={searchSuggestions.length > 0}
            >
              <Input.Search
                placeholder="请输入如“跨境电商知识产权侵权”或“员工加班费争议”等具体场景..."
                enterButton={
                  <Button type="primary" size="large">
                    场景搜索
                  </Button>
                }
                size="large"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onSearch={handleSearch}
                loading={searchLoading}
                style={{ marginBottom: 16 }}
              />
            </Dropdown>

            <Space
              wrap
              size="middle"
              style={{ justifyContent: "center", width: "100%" }}
            >
              <Text type="secondary">热门场景：</Text>
              {hotScenarios.map((scene) => (
                <Tag.CheckableTag
                  key={scene.label}
                  checked={filterCriteria.scenario === scene.label}
                  onChange={() => handleScenarioClick(scene.label)}
                  style={{
                    padding: "6px 16px",
                    fontSize: 14,
                    borderRadius: 16,
                    border:
                      filterCriteria.scenario === scene.label
                        ? "none"
                        : "1px solid #f0f0f0",
                    backgroundColor:
                      filterCriteria.scenario === scene.label
                        ? scene.color
                        : "#fff",
                    color:
                      filterCriteria.scenario === scene.label ? "#fff" : "#666",
                  }}
                >
                  {scene.icon} {scene.label}
                </Tag.CheckableTag>
              ))}
            </Space>
          </div>
        </Card>

        {/* 2. 当前搜索场景风险提示条 */}
        {riskAlertVisible && (
          <Alert
            message={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Space>
                  <WarningOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
                  <Text strong style={{ color: "#cf1322" }}>
                    当前搜索场景风险提示
                  </Text>
                </Space>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setRiskAlertVisible(false)}
                />
              </div>
            }
            description={
              <div style={{ marginTop: 8 }}>
                <Text>{riskAlertMessage}</Text>
                <div style={{ marginTop: 8 }}>
                  <a style={{ color: "#ff4d4f", textDecoration: "underline" }}>
                    点击查看红色条款 &gt;
                  </a>
                </div>
              </div>
            }
            type="error"
            style={{
              marginBottom: 24,
              border: "1px solid #ffccc7",
              background: "#fff1f0",
              borderRadius: 8,
            }}
          />
        )}

        <Row gutter={24}>
          {/* 左侧筛选区已移除，内容区全宽显示 */}
          <Col span={24}>
            {/* 5. 法规列表区 */}
            <Card styles={{ body: { padding: 0 } }}>
              {/* List Header / Toolbar */}
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Space>
                  <Text>
                    共找到 <Text strong>{filteredData.length}</Text> 条结果
                  </Text>
                </Space>
                <Space>
                  <span style={{ color: "#999" }}>排序：</span>
                  <Radio.Group
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="relevance">匹配度</Radio.Button>
                    <Radio.Button value="date">最新发布</Radio.Button>
                    <Radio.Button value="level">效力层级</Radio.Button>
                  </Radio.Group>
                </Space>
              </div>

              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `共 ${total} 条`,
                  showSizeChanger: true,
                }}
                showHeader={false}
              />

              <div
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  color: "#999",
                }}
              >
                {loading ? (
                  <Space>
                    <Spin /> 正在加载历史法规数据...
                  </Space>
                ) : (
                  "已加载全部数据"
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 6. 会员尊享弹窗 */}
        <Modal
          title={null}
          open={memberModalVisible}
          onCancel={() => setMemberModalVisible(false)} // Can close via X or button
          footer={null}
          width={400}
          bodyStyle={{ textAlign: "center", padding: 40 }}
          centered
        >
          <CrownOutlined
            style={{ fontSize: 48, color: "#faad14", marginBottom: 16 }}
          />
          <Title level={3}>升级尊享会员</Title>
          <Paragraph type="secondary">
            获取法规全文解析、风险对策及实时生效预警。
          </Paragraph>
          <Button
            type="primary"
            size="large"
            shape="round"
            block
            style={{
              background: "#1f1c2c",
              borderColor: "#1f1c2c",
              marginTop: 16,
            }}
            onClick={() => setMemberModalVisible(false)}
          >
            立即升级
          </Button>
        </Modal>

        {/* Global Styles */}
        <style>{`
          .ant-radio-button-wrapper-checked {
            background: #1890ff !important;
            color: #fff !important;
          }
        `}</style>
      </div>
    </PageWrapper>
  );
};

export default RegulationQuery;
