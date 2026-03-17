/**
 * 增强版政策详情页
 * 创建时间: 2026-03-04
 * 功能: 完整展示政策详情，包含申报状态、基本信息、竞争力分析、快速申报等模块
 */

import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Skeleton,
  Empty,
  Modal,
  Alert,
  Progress,
  Tooltip,
  Avatar,
  List,
  Descriptions,
  Table,
  Breadcrumb,
  Spin,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  DownloadOutlined,
  EyeOutlined,
  QrcodeOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface PolicyDetailData {
  id: string;
  title: string;
  status: "not_started" | "in_progress" | "ended";
  deadline: string;
  startTime: string;
  department: string;
  region: string;
  funding: string;
  type: string;
  description: string;
  policyBasis: string;
  applicationConditions: string[];
  targetAudience: string;
  materials: Array<{
    name: string;
    required: boolean;
    format: string;
    example?: string;
    note?: string;
  }>;
  process: string[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  currentProgress?: string;
  currentAuditNode?: string;
  remainingDays?: number;
  competitiveness: {
    fundingStrength: number;
    applicationDifficulty: number;
    approvalRate: number;
    competitionLevel: number;
    matchDegree: number;
  };
  applicationTrend: {
    months: string[];
    applicationCount: number[];
    approvalCount: number[];
  };
  expertInfo?: {
    name: string;
    title: string;
    avatar: string;
    expertise: string[];
    responseTime: string;
  };
}

const EnhancedPolicyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<PolicyDetailData | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [consultModalVisible, setConsultModalVisible] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Mock data
  const mockPolicyData: PolicyDetailData = {
    id: id || "1",
    title: "2024-2025年北京市节能技术改造项目奖励",
    status: "in_progress",
    deadline: "2026-06-30",
    startTime: "2026-01-01",
    department: "北京市发展和改革委员会",
    region: "北京市",
    funding: "最高500万元",
    type: "技术创新",
    description:
      "为推动北京市节能减排工作，鼓励企业实施节能技术改造项目，对符合条件的节能改造项目给予资金奖励。支持企业采用先进节能技术和设备，提升能源利用效率，降低能源消耗，促进绿色低碳发展。",
    policyBasis:
      "《北京市节能减排综合工作方案》《北京市促进节能技术改造专项资金管理办法》",
    targetAudience: "在北京市注册的独立法人企业",
    applicationConditions: [
      "在北京市注册的独立法人企业，具有独立法人资格",
      "完成节能技术改造项目并通过验收，项目符合国家和北京市相关标准",
      "节能量达到100吨标准煤以上，经第三方机构审核认定",
      "项目投资额在50万元以上，有完整的财务凭证",
      "企业无重大安全生产事故和环境违法行为",
      "项目技术方案科学合理，节能效果显著",
    ],
    materials: [
      {
        name: "项目申请表",
        required: true,
        format: "电子版（PDF、DOC、DOCX）",
        example: "点击下载模板",
        note: "需加盖企业公章，填写完整准确",
      },
      {
        name: "营业执照副本",
        required: true,
        format: "扫描件（PDF、JPG）",
        note: "需加盖企业公章，确保清晰可见",
      },
      {
        name: "项目可行性研究报告",
        required: true,
        format: "PDF或Word文档",
        example: "点击下载模板",
        note: "需包含技术方案、投资预算、节能效果分析等内容",
      },
      {
        name: "第三方节能量审核报告",
        required: true,
        format: "PDF文档",
        note: "需由具备资质的第三方机构出具，有效期内",
      },
      {
        name: "项目验收报告",
        required: true,
        format: "PDF文档",
        note: "需由主管部门或第三方机构出具",
      },
      {
        name: "财务审计报告",
        required: false,
        format: "PDF文档",
        note: "近两年财务审计报告，由会计师事务所出具",
      },
    ],
    process: [
      "企业在线提交申报材料，确保材料完整准确",
      "主管部门进行形式审查，审核周期5个工作日",
      "组织专家评审，评估项目技术方案和节能效果",
      "公示评审结果，公示期7个工作日",
      "发放奖励资金，通过银行转账方式拨付",
    ],
    contactPhone: "010-12345678",
    contactEmail: "policy@beijing.gov.cn",
    contactAddress: "北京市朝阳区建国路88号",
    currentProgress: "申报材料准备阶段",
    currentAuditNode: "企业准备材料",
    remainingDays: 118,
    competitiveness: {
      fundingStrength: 85,
      applicationDifficulty: 60,
      approvalRate: 75,
      competitionLevel: 70,
      matchDegree: 90,
    },
    applicationTrend: {
      months: ["1月", "2月", "3月", "4月", "5月", "6月"],
      applicationCount: [45, 52, 38, 65, 58, 72],
      approvalCount: [32, 38, 28, 48, 42, 54],
    },
    expertInfo: {
      name: "王资深",
      title: "资深政策专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert",
      expertise: ["节能技术改造", "政策申报辅导", "项目可行性分析"],
      responseTime: "平均5分钟响应",
    },
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Check if policy data was passed from search results
        const passedPolicyData = location.state?.policyData;

        if (passedPolicyData) {
          // Use data from search results and enhance it with additional details
          const enhancedData = {
            ...mockPolicyData,
            id: passedPolicyData.id,
            title: passedPolicyData.title,
            department: passedPolicyData.department,
            publishDate: passedPolicyData.date,
            industry: passedPolicyData.industry,
            status: passedPolicyData.status,
            type: passedPolicyData.type,
            content: passedPolicyData.content,
          };
          setPolicyData(enhancedData);
        } else {
          // Fallback to mock data if no data was passed
          await new Promise((resolve) => setTimeout(resolve, 800));
          setPolicyData(mockPolicyData);
        }
      } catch (error) {
        message.error("数据加载失败");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, location.state]);

  // 计算剩余天数
  const getRemainingDays = (deadline: string) => {
    const now = dayjs();
    const end = dayjs(deadline);
    return end.diff(now, "day");
  };

  // 获取项目状态
  const getProjectStatus = (data: PolicyDetailData) => {
    const now = dayjs();
    const start = dayjs(data.startTime);
    const end = dayjs(data.deadline);

    if (now.isBefore(start)) return "not_started";
    if (now.isAfter(end)) return "ended";
    return "in_progress";
  };

  // 处理收藏
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    message.success(isFavorited ? "已取消收藏" : "收藏成功");
  };

  // 处理分享
  const handleShare = () => {
    setShareModalVisible(true);
  };

  // 复制链接
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success("链接已复制到剪贴板");
    });
  };

  // 处理立即申报
  const handleApply = () => {
    if (!policyData) return;

    const status = getProjectStatus(policyData);
    if (status === "ended") {
      message.warning("申报已截止");
      return;
    }
    if (status === "not_started") {
      message.warning("申报尚未开始");
      return;
    }

    // 自动关联当前政策信息，跳转到申报向导
    navigate(`/application/apply/${policyData.id}`, {
      state: {
        policyInfo: policyData,
        autoFill: true,
      },
    });
  };

  // 处理在线咨询
  const handleConsult = () => {
    setConsultModalVisible(true);
  };

  // 政策竞争力雷达图配置
  const getRadarChartOption = () => {
    if (!policyData) return {};

    return {
      title: {
        text: "政策竞争力分析",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const indicators = [
            "资金力度",
            "申报难度",
            "获批率",
            "竞争程度",
            "匹配度",
          ];
          const index = params.dataIndex;
          return `${indicators[index]}: ${params.value}`;
        },
      },
      radar: {
        indicator: [
          { name: "资金力度", max: 100 },
          { name: "申报难度", max: 100 },
          { name: "获批率", max: 100 },
          { name: "竞争程度", max: 100 },
          { name: "匹配度", max: 100 },
        ],
        radius: "65%",
        splitNumber: 4,
        axisName: {
          color: "#666",
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(24, 144, 255, 0.05)", "rgba(24, 144, 255, 0.1)"],
          },
        },
      },
      series: [
        {
          name: "政策竞争力",
          type: "radar",
          data: [
            {
              value: [
                policyData.competitiveness.fundingStrength,
                policyData.competitiveness.applicationDifficulty,
                policyData.competitiveness.approvalRate,
                policyData.competitiveness.competitionLevel,
                policyData.competitiveness.matchDegree,
              ],
              name: "当前政策",
              itemStyle: {
                color: "#1890ff",
              },
              areaStyle: {
                color: "rgba(24, 144, 255, 0.3)",
              },
              lineStyle: {
                width: 2,
              },
            },
          ],
        },
      ],
    };
  };

  // 申报趋势折线图配置
  const getTrendChartOption = () => {
    if (!policyData) return {};

    return {
      title: {
        text: "近6个月申报趋势",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((item: any) => {
            result += `${item.marker}${item.seriesName}: ${item.value}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ["申报数量", "获批数量"],
        bottom: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: policyData.applicationTrend.months,
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          color: "#666",
        },
      },
      yAxis: {
        type: "value",
        name: "数量",
        nameTextStyle: {
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#e0e0e0",
          },
        },
        axisLabel: {
          color: "#666",
        },
        splitLine: {
          lineStyle: {
            color: "#f0f0f0",
          },
        },
      },
      series: [
        {
          name: "申报数量",
          type: "line",
          data: policyData.applicationTrend.applicationCount,
          smooth: true,
          itemStyle: {
            color: "#1890ff",
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(24, 144, 255, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(24, 144, 255, 0.05)",
                },
              ],
            },
          },
        },
        {
          name: "获批数量",
          type: "line",
          data: policyData.applicationTrend.approvalCount,
          smooth: true,
          itemStyle: {
            color: "#52c41a",
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(82, 196, 26, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(82, 196, 26, 0.05)",
                },
              ],
            },
          },
        },
      ],
    };
  };

  // 材料表格列配置
  const materialColumns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "材料名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.required && <Tag color="red">必填</Tag>}
        </Space>
      ),
    },
    {
      title: "格式要求",
      dataIndex: "format",
      key: "format",
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record: any) => (
        <Space>
          {record.example && (
            <Button type="link" size="small" icon={<DownloadOutlined />}>
              {record.example}
            </Button>
          )}
          {record.note && (
            <Tooltip title={record.note}>
              <InfoCircleOutlined
                style={{ color: "#1890ff", cursor: "pointer" }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </Content>
      </Layout>
    );
  }

  if (!policyData) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Empty description="政策信息不存在" />
          </Card>
        </Content>
      </Layout>
    );
  }

  const status = getProjectStatus(policyData);
  const remainingDays = getRemainingDays(policyData.deadline);
  const isExpired = status === "ended";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* 顶部面包屑 */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
          <Breadcrumb
            items={[
              { title: <Link to="/policy-center">政策中心</Link> },
              { title: <Link to="/application">项目列表</Link> },
              { title: "政策详情" },
            ]}
          />
        </div>
      </div>

      <Content
        style={{
          maxWidth: 1200,
          margin: "24px auto",
          padding: "0 24px",
          width: "100%",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 左侧主内容区 */}
          <Col xs={24} lg={16}>
            {/* 申报状态提醒 */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: `2px solid ${isExpired ? "#ff4d4f" : "#1890ff"}`,
              }}
              styles={{
                header: {
                  backgroundColor: isExpired ? "#fff1f0" : "#e6f7ff",
                  borderBottom: `2px solid ${isExpired ? "#ff4d4f" : "#1890ff"}`,
                },
              }}
              title={
                <Space>
                  <CalendarOutlined
                    style={{
                      fontSize: 18,
                      color: isExpired ? "#ff4d4f" : "#1890ff",
                    }}
                  />
                  <Text strong style={{ fontSize: 16 }}>
                    申报状态提醒
                  </Text>
                  {isExpired && <Tag color="error">已截止</Tag>}
                  {status === "in_progress" && (
                    <Tag color="processing">申报中</Tag>
                  )}
                  {status === "not_started" && (
                    <Tag color="default">未开始</Tag>
                  )}
                </Space>
              }
            >
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">截止时间</Text>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          color: isExpired ? "#ff4d4f" : "#000",
                        }}
                      >
                        {policyData.deadline}
                      </Text>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">剩余天数</Text>
                      <Text
                        strong
                        style={{
                          fontSize: 20,
                          color: isExpired
                            ? "#ff4d4f"
                            : remainingDays <= 7
                              ? "#faad14"
                              : "#52c41a",
                        }}
                      >
                        {isExpired ? "已截止" : `${remainingDays} 天`}
                      </Text>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">当前审核节点</Text>
                      <Text strong style={{ fontSize: 14 }}>
                        {policyData.currentAuditNode || "企业准备材料"}
                      </Text>
                    </Space>
                  </Col>
                </Row>

                <div>
                  <Text
                    type="secondary"
                    style={{ marginBottom: 8, display: "block" }}
                  >
                    申报进度
                  </Text>
                  <Progress
                    percent={
                      isExpired ? 100 : status === "in_progress" ? 50 : 0
                    }
                    status={isExpired ? "exception" : "active"}
                    strokeColor={isExpired ? "#ff4d4f" : "#1890ff"}
                  />
                </div>

                {status === "in_progress" && (
                  <Alert
                    message="当前审核节点"
                    description={
                      policyData.currentProgress ||
                      "政策申报材料准备阶段，请及时提交申报材料"
                    }
                    type="info"
                    showIcon
                    icon={<ClockCircleOutlined />}
                  />
                )}

                {isExpired && (
                  <Alert
                    message="申报已截止"
                    description="该政策申报时间已结束，请关注其他可申报政策"
                    type="error"
                    showIcon
                  />
                )}
              </Space>
            </Card>

            {/* 基本信息 */}
            <Card
              title={
                <Space>
                  <SafetyOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    基本信息
                  </Text>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  onClick={() => message.info("展开更多内容")}
                >
                  查看详情
                </Button>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="实施主体单位" span={2}>
                  <Text strong>{policyData.department}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="申报对象">
                  {policyData.targetAudience}
                </Descriptions.Item>
                <Descriptions.Item label="项目类别">
                  <Tag color="blue">{policyData.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="补贴金额">
                  <Text strong style={{ color: "#faad14", fontSize: 16 }}>
                    {policyData.funding}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="申报时间">
                  {policyData.startTime} 至 {policyData.deadline}
                </Descriptions.Item>
                <Descriptions.Item label="政策依据" span={2}>
                  {policyData.policyBasis}
                </Descriptions.Item>
                <Descriptions.Item label="申报条件" span={2}>
                  <List
                    size="small"
                    dataSource={policyData.applicationConditions}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Text>
                          {index + 1}. {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 申报材料清单 */}
            <Card
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    申报材料清单
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Alert
                message="申报注意事项"
                description="请确保所有必填材料准备齐全，材料格式符合要求。支持在线预览和编辑部分材料。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Table
                columns={materialColumns}
                dataSource={policyData.materials}
                pagination={false}
                rowKey="name"
                size="small"
              />
            </Card>

            {/* 办理流程 */}
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    办理流程
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <List
                dataSource={policyData.process}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space>
                      <Avatar
                        style={{ backgroundColor: "#1890ff" }}
                        size="small"
                      >
                        {index + 1}
                      </Avatar>
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* 联系方式 */}
            <Card
              title={
                <Space>
                  <PhoneOutlined style={{ color: "#1890ff" }} />
                  <Text strong style={{ fontSize: 16 }}>
                    联系方式
                  </Text>
                </Space>
              }
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <Descriptions column={1}>
                <Descriptions.Item label="咨询电话">
                  <Text copyable>{policyData.contactPhone}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="电子邮箱">
                  <Text copyable>{policyData.contactEmail}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="办公地址">
                  {policyData.contactAddress}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* 右侧辅助功能区 */}
          <Col xs={24} lg={8}>
            {/* 快速申报通道 */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              styles={{ body: { padding: 24 } }}
            >
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <RocketOutlined
                    style={{ fontSize: 48, color: "#fff", marginBottom: 16 }}
                  />
                  <Title level={4} style={{ color: "#fff", margin: 0 }}>
                    快速申报通道
                  </Title>
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    一键启动申报流程
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<RocketOutlined />}
                  onClick={handleApply}
                  disabled={isExpired}
                  style={{
                    height: 48,
                    fontSize: 16,
                    fontWeight: "bold",
                    background: "#fff",
                    color: "#667eea",
                    border: "none",
                  }}
                >
                  {isExpired ? "已截止" : "立即申报"}
                </Button>
                <Space style={{ width: "100%", justifyContent: "center" }}>
                  <Button
                    type="text"
                    icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleFavorite}
                    style={{ color: "#fff" }}
                  >
                    {isFavorited ? "已收藏" : "收藏"}
                  </Button>
                  <Divider
                    type="vertical"
                    style={{ background: "rgba(255,255,255,0.3)" }}
                  />
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                    style={{ color: "#fff" }}
                  >
                    分享
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* 分享弹窗 */}
      <Modal
        title="分享政策"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div
            style={{
              textAlign: "center",
              padding: 24,
              background: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <QrcodeOutlined style={{ fontSize: 120, color: "#1890ff" }} />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">扫描二维码分享</Text>
            </div>
          </div>
          <Button block icon={<LinkOutlined />} onClick={handleCopyLink}>
            复制链接
          </Button>
        </Space>
      </Modal>

      {/* 咨询弹窗 */}
      <Modal
        title="在线咨询"
        open={consultModalVisible}
        onCancel={() => setConsultModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Alert
            message="咨询服务"
            description="专家将在5分钟内响应您的咨询，请耐心等待"
            type="info"
            showIcon
          />
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary">正在连接咨询师...</Text>
          </div>
        </Space>
      </Modal>
    </Layout>
  );
};

export default EnhancedPolicyDetail;
