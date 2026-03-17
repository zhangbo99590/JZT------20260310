/**
 * 优化版申报管理模块 - UI深度优化
 * 创建时间: 2026-02-26
 * 功能: 政务类产品专业、简洁、规整的申报管理页面
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Select,
  Button,
  Tag,
  Space,
  Pagination,
  Empty,
  Typography,
  message,
  Skeleton,
  Cascader,
  Input,
  Modal,
  FloatButton,
  Divider,
  Badge,
  Avatar,
  List,
  Progress,
  DatePicker,
  Popconfirm,
  ConfigProvider,
} from "antd";
import {
  FileTextOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
  SearchOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  VerticalAlignTopOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  SendOutlined,
  AppstoreOutlined,
  StopOutlined,
} from "@ant-design/icons";
import ApplyButton from "../../components/common/ApplyButton";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { DESIGN_TOKENS } from "./config/designTokens";
import OptimizedMyApplications from "./OptimizedMyApplications";
import HighlightText from "../../components/common/HighlightText";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const mockProjects: ProjectItem[] = Array.from({ length: 45 }, (_, i) => {
  const districts = [
    "海淀区",
    "朝阳区",
    "丰台区",
    "西城区",
    "东城区",
    "石景山区",
    "通州区",
    "昌平区",
    "大兴区",
    "顺义区",
  ];
  const policyTypes = [
    "高新技术企业认定",
    "专精特新企业认定",
    "科技创新补贴",
    "人才引进支持",
    "产业升级补贴",
    "绿色发展支持",
    "数字化转型补贴",
    "创新创业支持",
    "研发费用补贴",
    "知识产权支持",
  ];
  const departments = [
    "科技委员会",
    "发改委",
    "经信局",
    "人社局",
    "财政局",
    "商务局",
    "文化委",
    "环保局",
    "交通委",
    "建委",
  ];
  const industries = [
    "高新技术",
    "人工智能",
    "生物医药",
    "新能源",
    "新材料",
    "电子信息",
    "文化创意",
    "现代服务",
    "金融科技",
    "环保技术",
  ];
  const targetAudiences = [
    "中小企业",
    "初创企业",
    "高新技术企业",
    "科技型企业",
    "成长型企业",
    "创新型企业",
    "专精特新企业",
    "高层次人才",
    "技术人才",
    "创业团队",
  ];
  const types = [
    "技术创新",
    "人才引进",
    "产业升级",
    "绿色发展",
    "数字化转型",
    "创新创业",
    "知识产权",
    "其他",
  ];
  const statuses = ["in_progress", "not_started", "ended"];
  const fundingAmounts = [
    "10万元",
    "20万元",
    "30万元",
    "50万元",
    "80万元",
    "100万元",
    "150万元",
    "200万元",
    "300万元",
    "500万元",
  ];

  const district = districts[i % districts.length];
  const policyType = policyTypes[i % policyTypes.length];
  const department = departments[i % departments.length];
  const industry = industries[i % industries.length];
  const targetAudience = targetAudiences[i % targetAudiences.length];
  const type = types[i % types.length];
  const status = statuses[i % statuses.length] as
    | "in_progress"
    | "not_started"
    | "ended";
  const funding = fundingAmounts[i % fundingAmounts.length];

  const year = i < 15 ? "2026" : i < 30 ? "2025" : "2024";
  const month = String((i % 12) + 1).padStart(2, "0");
  const day = String((i % 28) + 1).padStart(2, "0");

  return {
    id: String(i + 1),
    title: `${district}${policyType}项目（${year}年第${Math.floor(i / 10) + 1}批）`,
    description: `面向${targetAudience}的${policyType}支持项目，旨在促进${industry}领域的技术创新和产业升级，提升企业核心竞争力和市场占有率。通过资金支持、政策指导和服务保障，全面推动企业高质量发展。`,
    type,
    region: district,
    funding: `最高${funding}`,
    deadline: `${year}-${month}-${day}`,
    status,
    startTime: `${parseInt(year) - 1}-${month}-01`,
    department: `${district}${department}`,
    industry,
    targetAudience,
    year,
    viewCount: Math.floor(Math.random() * 2000) + 100,
    applyCount: Math.floor(Math.random() * 200) + 10,
    isApplied: Math.random() > 0.8,
  };
});

// 类型定义
interface ProjectItem {
  id: string;
  title: string;
  description: string;
  type: string;
  region: string;
  funding: string;
  deadline: string;
  status: "not_started" | "in_progress" | "ended";
  startTime: string;
  department: string;
  industry: string;
  targetAudience: string;
  year: string;
  viewCount: number;
  applyCount: number;
  isApplied?: boolean;
}

interface FilterState {
  policyLevel: (string | number)[][];
  status: string[];
  department: string[];
  industry: string[];
  targetAudience: string[];
  year: string[];
  projectType: string[];
}

type ViewType = "list" | "status" | "statistics";

const OptimizedApplicationManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const view = searchParams.get("view");
    return (view as ViewType) || "list";
  });

  // 监听路由参数变化
  useEffect(() => {
    const view = searchParams.get("view");
    if (view && view !== currentView) {
      setCurrentView(view as ViewType);
    } else if (location.pathname === "/policy-center/my-applications") {
      // 如果是直接访问我的申报路由，强制切换到 status 视图
      setCurrentView("status");
    }
  }, [searchParams, location.pathname]);

  const [filterExpanded, setFilterExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    policyLevel: [],
    status: [],
    department: [],
    industry: [],
    targetAudience: [],
    year: [],
    projectType: [],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [jumpPage, setJumpPage] = useState("");
  const [searchText, setSearchText] = useState("");

  // 模拟数据

  // 筛选选项配置
  const filterOptions = {
    policyLevel: [
      {
        value: "beijing",
        label: "北京市",
        children: [
          { value: "haidian", label: "海淀区" },
          { value: "chaoyang", label: "朝阳区" },
          { value: "fengtai", label: "丰台区" },
          { value: "dongcheng", label: "东城区" },
          { value: "xicheng", label: "西城区" },
        ],
      },
      {
        value: "shanghai",
        label: "上海市",
        children: [
          { value: "huangpu", label: "黄浦区" },
          { value: "xuhui", label: "徐汇区" },
        ],
      },
    ],
    status: [
      { value: "not_started", label: "未开始" },
      { value: "in_progress", label: "申报中" },
      { value: "ended", label: "已截止" },
    ],
    department: [
      { value: "tech_committee", label: "北京市科技委员会" },
      { value: "talent_office", label: "海淀区人才办" },
      { value: "culture_committee", label: "朝阳区文化委" },
      { value: "fengtai_tech", label: "丰台区科委" },
    ],
    industry: [
      { value: "high_tech", label: "高新技术" },
      { value: "talent_service", label: "人才服务" },
      { value: "culture_creative", label: "文化创意" },
      { value: "tech_service", label: "科技服务" },
    ],
    targetAudience: [
      { value: "sme", label: "中小企业" },
      { value: "high_talent", label: "高层次人才" },
      { value: "culture_enterprise", label: "文创企业" },
      { value: "tech_enterprise", label: "科技型企业" },
    ],
    year: [
      { value: "2026", label: "2026年" },
      { value: "2025", label: "2025年" },
      { value: "2024", label: "2024年" },
    ],
    projectType: [
      { value: "技术创新", label: "技术创新" },
      { value: "人才引进", label: "人才引进" },
      { value: "其他", label: "其他" },
    ],
  };

  // 获取项目状态
  const getProjectStatus = (project: ProjectItem) => {
    const now = new Date();
    const startTime = new Date(project.startTime);
    const endTime = new Date(project.deadline);

    if (now < startTime) return "not_started";
    if (now > endTime) return "ended";
    return "in_progress";
  };

  // 计算倒计时天数
  const getCountdownDays = (deadline: string) => {
    const now = new Date();
    const endTime = new Date(deadline);
    const diffTime = endTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      not_started: { color: "default", text: "未开始" },
      in_progress: { color: "processing", text: "申报中" },
      ended: { color: "error", text: "已截止" },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取类型标签样式
  const getTypeTagStyle = (type: string) => {
    const styleMap = {
      技术创新: DESIGN_TOKENS.colors.tag.tech,
      人才引进: DESIGN_TOKENS.colors.tag.tech,
      其他: DESIGN_TOKENS.colors.tag.funding,
    };
    return (
      styleMap[type as keyof typeof styleMap] || DESIGN_TOKENS.colors.tag.tech
    );
  };

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filteredProjects = [...mockProjects];

      if (filters.status.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.status.includes(getProjectStatus(project)),
        );
      }

      if (filters.projectType.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.projectType.includes(project.type),
        );
      }

      if (filters.year.length > 0) {
        filteredProjects = filteredProjects.filter((project) =>
          filters.year.includes(project.year),
        );
      }

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

      setProjects(paginatedProjects);
      setPagination((prev) => ({
        ...prev,
        total: filteredProjects.length,
      }));
    } catch (error) {
      message.error("数据加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      policyLevel: [],
      status: [],
      department: [],
      industry: [],
      targetAudience: [],
      year: [],
      projectType: [],
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 模拟获取最新项目信息（模拟后端接口）
  const fetchProjectLatestInfo = async (
    id: string,
  ): Promise<ProjectItem | null> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300));
    // 这里应该是API调用，暂时从mock数据获取
    const project = mockProjects.find((p) => p.id === id);
    return project ? { ...project } : null;
  };

  // 统一的项目操作处理（确保详情与申报逻辑一致）
  const handleProjectAction = async (
    project: ProjectItem,
    action: "view" | "apply",
  ) => {
    const hideLoading = message.loading("正在同步项目数据...", 0);

    try {
      // 1. 再次拉取最新数据做二次确认
      const latestProject = await fetchProjectLatestInfo(project.id);
      hideLoading();

      if (!latestProject) {
        message.error("项目不存在或已被删除");
        loadData(); // 刷新列表
        return;
      }

      // 计算实时状态
      const latestStatus = getProjectStatus(latestProject);
      const currentStatus = getProjectStatus(project);

      // 2. 一致性校验：检查状态是否变更
      if (
        latestStatus !== currentStatus ||
        latestProject.isApplied !== project.isApplied
      ) {
        message.warning("项目状态发生变更，已为您自动刷新");
        loadData(); // 重新加载列表
        return;
      }

      // 3. 统一参数与权限校验
      if (action === "apply") {
        if (latestStatus !== "in_progress") {
          message.warning("当前项目不在申报期内");
          return;
        }

        // 跳转申报页 (移除 isApplied 判断，允许重新申报)
        navigate(`/application/apply/${latestProject.id}`, {
          state: {
            projectInfo: latestProject,
            fromList: true,
            isLoggedIn: isLoggedIn,
          },
        });
      } else {
        // 跳转详情页（传递相同的数据源）
        navigate(`/application/detail/${latestProject.id}`, {
          state: {
            filters,
            pagination,
            scrollPosition: window.scrollY,
            projectInfo: latestProject, // 确保详情页使用最新同步的数据
          },
        });
      }
    } catch (error) {
      hideLoading();
      message.error("数据同步失败，请检查网络");
    }
  };

  // 处理申报按钮点击
  const handleApplyClick = (project: ProjectItem) => {
    handleProjectAction(project, "apply");
  };

  // 处理查看详情
  const handleViewDetail = (project: ProjectItem) => {
    handleProjectAction(project, "view");
  };

  // 跳转页面处理
  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (
      page &&
      page > 0 &&
      page <= Math.ceil(pagination.total / pagination.pageSize)
    ) {
      setPagination((prev) => ({ ...prev, current: page }));
      setJumpPage("");
    } else {
      message.warning("请输入有效的页码");
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 渲染筛选区域
  const renderFilterSection = () => {
    const filterLabels = {
      policyLevel: "政策层级",
      status: "申报状态",
      department: "主管部门",
      industry: "行业/主题",
      targetAudience: "审核对象",
      year: "年度",
      projectType: "项目类型",
    };

    const allFilters = [
      "policyLevel",
      "status",
      "department",
      "industry",
      "targetAudience",
      "year",
      "projectType",
    ];

    return (
      <Card
        style={{
          marginBottom: 24,
          background: "#fafafa",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
          boxShadow: "none",
        }}
        styles={{ body: { padding: "24px" } }}
      >
        {/* 筛选条件区域 */}
        {filterExpanded && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              {allFilters.slice(0, 3).map((filterKey) => (
                <Col key={filterKey} xs={24} sm={12} md={8} lg={8}>
                  <div>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#8c8c8c",
                        marginBottom: "6px",
                        display: "block",
                        fontWeight: 500,
                      }}
                    >
                      {filterLabels[filterKey as keyof typeof filterLabels]}
                    </Text>
                    {filterKey === "policyLevel" ? (
                      <Cascader
                        placeholder="请选择"
                        options={filterOptions.policyLevel}
                        multiple
                        maxTagCount={2}
                        showSearch
                        style={{
                          width: "100%",
                          height: "40px",
                        }}
                        value={filters.policyLevel as any}
                        onChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            policyLevel: value as (string | number)[][],
                          }))
                        }
                      />
                    ) : (
                      <Select
                        placeholder="请选择"
                        mode="multiple"
                        allowClear
                        showSearch
                        style={{
                          width: "100%",
                          height: "40px",
                        }}
                        value={filters[filterKey as keyof FilterState]}
                        onChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            [filterKey]: value,
                          }))
                        }
                        maxTagCount={2}
                      >
                        {filterOptions[
                          filterKey as keyof typeof filterOptions
                        ]?.map((option: any) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
            <Row gutter={[16, 16]}>
              {allFilters.slice(3).map((filterKey) => (
                <Col key={filterKey} xs={24} sm={12} md={8} lg={6}>
                  <div>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#8c8c8c",
                        marginBottom: "6px",
                        display: "block",
                        fontWeight: 500,
                      }}
                    >
                      {filterLabels[filterKey as keyof typeof filterLabels]}
                    </Text>
                    <Select
                      placeholder="请选择"
                      mode="multiple"
                      allowClear
                      showSearch
                      style={{
                        width: "100%",
                        height: "40px",
                      }}
                      value={filters[filterKey as keyof FilterState]}
                      onChange={(value) =>
                        setFilters((prev) => ({ ...prev, [filterKey]: value }))
                      }
                      maxTagCount={2}
                    >
                      {filterOptions[
                        filterKey as keyof typeof filterOptions
                      ]?.map((option: any) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* 操作按钮区 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            marginTop: filterExpanded ? 16 : 0,
          }}
        >
          <Button
            onClick={resetFilters}
            style={{
              height: "40px",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            重置
          </Button>
          <Button
            icon={filterExpanded ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setFilterExpanded(!filterExpanded)}
            style={{
              height: "40px",
              borderRadius: "6px",
              fontWeight: 500,
            }}
          >
            {filterExpanded ? "收起" : "展开筛选"}
          </Button>
        </div>
      </Card>
    );
  };

  // 渲染项目卡片
  const renderProjectCard = (project: ProjectItem) => {
    const status = getProjectStatus(project);
    const canApply =
      isLoggedIn && status === "in_progress" && !project.isApplied;
    const countdownDays =
      status === "in_progress" ? getCountdownDays(project.deadline) : 0;
    const typeStyle = getTypeTagStyle(project.type);
    const isExpired = status === "ended";

    return (
      <Card
        key={project.id}
        hoverable={!isExpired}
        style={{
          height: "280px",
          marginBottom: 20,
          border: "1px solid #e8e8e8",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          cursor: isExpired ? "default" : "pointer",
          opacity: isExpired ? 0.7 : 1,
        }}
        styles={{
          body: {
            padding: "20px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
        }}
        onClick={(e) => {
          if (isExpired) return;
          const target = e.target as HTMLElement;
          if (target.closest("button")) {
            return;
          }
          handleViewDetail(project);
        }}
        onMouseEnter={(e) => {
          if (!isExpired) {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpired) {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {/* 顶部：项目名称 */}
        <div style={{ marginBottom: "12px" }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#262626",
              lineHeight: "26px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            onClick={() => !isExpired && handleViewDetail(project)}
          >
            <HighlightText
              text={project.title}
              keywords={searchText || ""}
              highlightStyle={{
                backgroundColor: "#fff2e8",
                color: "#fa541c",
                fontWeight: 600,
                padding: "2px 4px",
                borderRadius: "3px",
              }}
            />
          </Title>
        </div>

        {/* 中部：扶持描述 */}
        <div style={{ flex: 1, marginBottom: "16px" }}>
          <Text
            style={{
              fontSize: "14px",
              color: "#595959",
              lineHeight: "22px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <HighlightText
              text={project.description}
              keywords={searchText || ""}
              highlightStyle={{
                backgroundColor: "#fff7e6",
                color: "#fa8c16",
                fontWeight: 500,
                padding: "1px 3px",
                borderRadius: "2px",
              }}
            />
          </Text>
        </div>

        {/* 下部：标签组 */}
        <div style={{ marginBottom: "16px" }}>
          <Space wrap size={[8, 8]}>
            <Tag
              style={{
                backgroundColor: "#e6f7ff",
                color: "#1890ff",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {project.type}
            </Tag>
            <Tag
              style={{
                backgroundColor: "#f6ffed",
                color: "#52c41a",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {project.region}
            </Tag>
            <Tag
              style={{
                backgroundColor: "#fff7e6",
                color: "#fa8c16",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {project.funding}
            </Tag>
          </Space>
        </div>

        {/* 截止时间（倒计时样式高亮） */}
        <div
          style={{
            background:
              countdownDays <= 7 && status === "in_progress"
                ? "#fff2e8"
                : "#f8f9fa",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: `1px solid ${countdownDays <= 7 && status === "in_progress" ? "#ffbb96" : "#e9ecef"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>截止时间</Text>
            <div style={{ textAlign: "right" }}>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isExpired
                    ? "#ff4d4f"
                    : countdownDays <= 7 && status === "in_progress"
                      ? "#fa541c"
                      : "#262626",
                }}
              >
                {project.deadline}
              </Text>
              {status === "in_progress" && countdownDays > 0 && (
                <div
                  style={{
                    fontSize: "12px",
                    color: countdownDays <= 7 ? "#fa541c" : "#1890ff",
                    marginTop: "2px",
                  }}
                >
                  {countdownDays <= 7 && (
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                  )}
                  还剩 {countdownDays} 天
                </div>
              )}
              {isExpired && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff4d4f",
                    marginTop: "2px",
                  }}
                >
                  <StopOutlined style={{ marginRight: 4 }} />
                  已截止
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部：操作按钮组 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button
            size="middle"
            style={{
              borderRadius: "6px",
              fontWeight: 500,
            }}
            onClick={() => handleViewDetail(project)}
          >
            查看详情
          </Button>

          {isExpired ? (
            <Button
              size="middle"
              disabled
              style={{
                borderRadius: "6px",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
                color: "#bfbfbf",
              }}
            >
              已截止
            </Button>
          ) : (
            <Button
              type="primary"
              size="middle"
              style={{
                borderRadius: "6px",
                fontWeight: 500,
              }}
              onClick={() => handleApplyClick(project)}
            >
              立即申报
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // 渲染项目列表
  const renderProjectList = () => {
    if (loading) {
      return (
        <div>
          {renderFilterSection()}
          <Divider
            style={{
              margin: `${DESIGN_TOKENS.spacing.sm}px 0`,
              borderColor: DESIGN_TOKENS.colors.border,
            }}
          />
          <Row gutter={[20, 0]}>
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} xs={24} lg={12}>
                <Card
                  style={{
                    height: "200px",
                    marginBottom: DESIGN_TOKENS.spacing.md,
                  }}
                >
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div>
          {renderFilterSection()}
          <Divider
            style={{
              margin: `${DESIGN_TOKENS.spacing.sm}px 0`,
              borderColor: DESIGN_TOKENS.colors.border,
            }}
          />
          <Empty
            image={
              <FileTextOutlined
                style={{
                  fontSize: "64px",
                  color: DESIGN_TOKENS.colors.text.disabled,
                }}
              />
            }
            description={
              <div style={{ textAlign: "center" }}>
                <Text
                  strong
                  style={{
                    fontSize: DESIGN_TOKENS.fontSize.lg,
                    color: DESIGN_TOKENS.colors.text.primary,
                    fontFamily: "Microsoft YaHei",
                  }}
                >
                  暂无申报项目
                </Text>
                <br />
                <Text
                  style={{
                    fontSize: DESIGN_TOKENS.fontSize.md,
                    color: DESIGN_TOKENS.colors.text.secondary,
                    fontFamily: "Microsoft YaHei",
                  }}
                >
                  您可调整筛选条件或关注最新政策
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              onClick={resetFilters}
              style={{
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
                fontFamily: "Microsoft YaHei",
              }}
            >
              重置筛选
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div>
        {renderFilterSection()}
        <Divider
          style={{
            margin: `${DESIGN_TOKENS.spacing.sm}px 0`,
            borderColor: DESIGN_TOKENS.colors.border,
          }}
        />

        {/* 项目统计 */}
        <div style={{ marginBottom: DESIGN_TOKENS.spacing.sm }}>
          <Text
            style={{
              fontSize: DESIGN_TOKENS.fontSize.md,
              color: DESIGN_TOKENS.colors.text.secondary,
              fontFamily: "Microsoft YaHei",
            }}
          >
            共 {pagination.total} 条项目
          </Text>
        </div>

        <Row gutter={[20, 0]}>
          {projects.map((project) => (
            <Col key={project.id} xs={24} lg={12}>
              {renderProjectCard(project)}
            </Col>
          ))}
        </Row>

        {/* 分页区布局优化 - 居中对齐 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
            padding: "24px 0",
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <Space size="large" align="center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => (
                <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  共 {total} 条项目，当前显示 {range[0]}-{range[1]} 条
                </Text>
              )}
              pageSizeOptions={["8", "16", "24"]}
              onChange={(page, pageSize) => {
                setPagination((prev) => ({ ...prev, current: page, pageSize }));
              }}
              style={{
                "& .ant-pagination-item": {
                  borderRadius: "6px",
                },
                "& .ant-pagination-item-active": {
                  borderColor: "#1890ff",
                },
              }}
            />
          </Space>
        </div>
      </div>
    );
  };

  // 渲染数据统计
  const renderStatistics = () => {
    const pieChartOption = {
      color: [
        DESIGN_TOKENS.colors.primary,
        DESIGN_TOKENS.colors.success,
        DESIGN_TOKENS.colors.warning,
        DESIGN_TOKENS.colors.tag.funding,
        DESIGN_TOKENS.colors.tag.tech,
      ],
      title: {
        text: "申报项目类型分布",
        left: "center",
        textStyle: {
          fontFamily: "Microsoft YaHei",
          color: DESIGN_TOKENS.colors.text.primary,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "horizontal",
        bottom: "bottom",
        textStyle: {
          fontFamily: "Microsoft YaHei",
        },
      },
      series: [
        {
          name: "项目类型",
          type: "pie",
          radius: "50%",
          data: [
            { value: 45, name: "技术创新" },
            { value: 30, name: "人才引进" },
            { value: 25, name: "其他" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    const barChartOption = {
      color: [DESIGN_TOKENS.colors.primary],
      title: {
        text: "月度申报趋势",
        left: "center",
        textStyle: {
          fontFamily: "Microsoft YaHei",
          color: DESIGN_TOKENS.colors.text.primary,
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "申报数",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 150, 80, 70, 110, 130],
        },
      ],
    };

    return (
      <div style={{ padding: DESIGN_TOKENS.spacing.md }}>
        <Title
          level={3}
          style={{
            fontFamily: "Microsoft YaHei",
            color: DESIGN_TOKENS.colors.text.primary,
            marginBottom: DESIGN_TOKENS.spacing.md,
          }}
        >
          数据统计
        </Title>
        <Row gutter={[DESIGN_TOKENS.spacing.md, DESIGN_TOKENS.spacing.md]}>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.primary,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                156
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                项目总数
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.success,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                1247
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                申报总数
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: DESIGN_TOKENS.colors.warning,
                  fontFamily: "Microsoft YaHei",
                }}
              >
                892
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                成功申报
              </Text>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: DESIGN_TOKENS.borderRadius.sm,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#722ed1",
                  fontFamily: "Microsoft YaHei",
                }}
              >
                71.5%
              </div>
              <Text type="secondary" style={{ fontFamily: "Microsoft YaHei" }}>
                平均成功率
              </Text>
            </Card>
          </Col>

          <Col span={12}>
            <Card style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <ReactECharts
                option={pieChartOption}
                style={{ height: "350px" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}>
              <ReactECharts
                option={barChartOption}
                style={{ height: "350px" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染当前视图内容
  const renderCurrentView = () => {
    switch (currentView) {
      case "list":
        return renderProjectList();
      case "status":
        return <OptimizedMyApplications />;
      case "statistics":
        return renderStatistics();
      default:
        return renderProjectList();
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: DESIGN_TOKENS.colors.background,
      }}
    >
      {/* 主内容区 */}
      <Layout>
        <Content style={{ backgroundColor: DESIGN_TOKENS.colors.background }}>
          {/* 内容区域 */}
          <div
            style={{
              padding: DESIGN_TOKENS.spacing.md,
              minHeight: "100vh",
              backgroundColor: DESIGN_TOKENS.colors.background,
            }}
          >
            {renderCurrentView()}
          </div>
        </Content>
      </Layout>

      {/* 悬浮按钮组 */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton
          icon={<BookOutlined />}
          tooltip="申报指引"
          onClick={() => message.info("申报指引")}
        />
        <FloatButton
          icon={<CustomerServiceOutlined />}
          tooltip="客服支持"
          onClick={() => message.info("客服支持")}
        />
        <FloatButton
          icon={<VerticalAlignTopOutlined />}
          tooltip="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </FloatButton.Group>

      {/* 登录弹窗 */}
      <Modal
        title={<span style={{ fontFamily: "Microsoft YaHei" }}>用户登录</span>}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setLoginModalVisible(false)}
            style={{ fontFamily: "Microsoft YaHei" }}
          >
            取消
          </Button>,
          <Button
            key="login"
            type="primary"
            onClick={() => {
              setIsLoggedIn(true);
              setLoginModalVisible(false);
              message.success("登录成功");
            }}
            style={{ fontFamily: "Microsoft YaHei" }}
          >
            登录
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <UserOutlined
            style={{
              fontSize: "48px",
              color: DESIGN_TOKENS.colors.primary,
              marginBottom: DESIGN_TOKENS.spacing.sm,
            }}
          />
          <p
            style={{
              fontFamily: "Microsoft YaHei",
              color: DESIGN_TOKENS.colors.text.secondary,
            }}
          >
            请登录后继续申报操作
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OptimizedApplicationManagement;
