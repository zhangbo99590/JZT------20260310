/**
 * 个性化推荐引擎组件
 * 创建时间: 2026-02-26
 * 功能: 基于企业画像的智能政策匹配和个性化推荐
 */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Avatar,
  List,
  Divider,
  Badge,
  Tooltip,
  Descriptions,
  Space,
  Empty,
  Spin,
} from "antd";
import ApplyButton from "../../../components/common/ApplyButton";
import {
  StarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  CheckCircleOutlined,
  FireFilled,
  ThunderboltFilled,
  BellFilled,
} from "@ant-design/icons";
import { useCompanyProfileContext } from "../../../context/CompanyProfileContext";

const { Text, Title, Paragraph } = Typography;

interface CompanyProfile {
  industry: string;
  size: string;
  revenue: number;
  techLevel: string;
  location: string;
  establishedYear: number;
}

interface PolicyRecommendation {
  id: number;
  title: string;
  description: string;
  matchScore: number;
  category: string;
  deadline: string;
  maxAmount: number;
  difficulty: "easy" | "medium" | "hard";
  requirements: string[];
  benefits: string[];
  isHot: boolean;
  isUrgent: boolean;
  type: "policy" | "service" | "finance"; // 新增 finance 类型
  provider?: string; // 服务商（仅服务类有）
  score?: number; // 评分（仅服务类有）
  matchReasons?: string[]; // 新增：动态匹配理由
  updateTag?: {
    // 新增：更新标签类型
    text: string;
    type: "hot" | "urgent" | "new";
  };
}

export const PersonalizedRecommendationSection: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useCompanyProfileContext();
  const [loading, setLoading] = useState(false);

  // 模拟全量推荐库数据 (基础数据，没有动态理由和动态分数)
  const allRecommendations: PolicyRecommendation[] = useMemo(
    () => [
      // 政策数据
      {
        id: 1,
        title: "中关村高新技术企业认定补贴",
        description:
          "针对高新技术企业的专项资金支持，重点支持技术创新和产业化项目",
        matchScore: 0,
        category: "技术创新",
        deadline: "2026-03-15",
        maxAmount: 500000,
        difficulty: "medium",
        requirements: [
          "高新技术企业认定",
          "近两年研发投入占比>3%",
          "拥有自主知识产权",
        ],
        benefits: ["最高50万资金支持", "税收优惠政策", "优先推荐上市辅导"],
        isHot: true,
        isUrgent: true,
        type: "policy",
      },
      {
        id: 2,
        title: "小微企业创业创新基地补贴",
        description: "支持小微企业入驻创新创业基地，提供租金补贴和服务支持",
        matchScore: 0,
        category: "创业支持",
        deadline: "2026-04-30",
        maxAmount: 200000,
        difficulty: "easy",
        requirements: ["注册时间不超过5年", "员工人数少于20人", "入驻认定基地"],
        benefits: ["租金补贴50%", "免费创业辅导", "融资对接服务"],
        isHot: false,
        isUrgent: false,
        type: "policy",
      },
      {
        id: 3,
        title: "软件企业研发费用加计扣除",
        description: "软件企业研发费用可按175%在税前扣除，大幅降低税负",
        matchScore: 0,
        category: "税收优惠",
        deadline: "2026-12-31",
        maxAmount: 0,
        difficulty: "easy",
        requirements: ["软件企业认定", "有明确的研发项目", "规范的财务核算"],
        benefits: ["研发费用175%扣除", "降低企业所得税", "提升现金流"],
        isHot: true,
        isUrgent: false,
        type: "policy",
      },
      // 服务数据
      {
        id: 101,
        title: "高新技术企业认定全程代办",
        description:
          "专业团队提供高新认定辅导，包含材料整理、财务审计、专利申请全流程服务",
        matchScore: 0,
        category: "企业服务",
        deadline: "",
        maxAmount: 0,
        difficulty: "easy",
        requirements: [],
        benefits: [],
        isHot: true,
        isUrgent: false,
        type: "service",
        provider: "知产无忧服务有限公司",
        score: 4.9,
      },
      {
        id: 102,
        title: "软件著作权加急登记服务",
        description: "最快3个工作日下证，专业撰写申请材料，不成功全额退款",
        matchScore: 0,
        category: "知识产权",
        deadline: "",
        maxAmount: 0,
        difficulty: "easy",
        requirements: [],
        benefits: [],
        isHot: false,
        isUrgent: false,
        type: "service",
        provider: "权大师知识产权代理",
        score: 4.8,
      },
      // 金融服务
      {
        id: 201,
        title: "科技创新无抵押信用贷",
        description: "专为科技型中小企业打造的低息信用贷款，随借随还",
        matchScore: 0,
        category: "金融服务",
        deadline: "",
        maxAmount: 5000000,
        difficulty: "easy",
        requirements: [],
        benefits: [],
        isHot: true,
        isUrgent: false,
        type: "finance",
        provider: "北京银行",
        score: 4.7,
      },
    ],
    [],
  );

  const [currentList, setCurrentList] = useState<PolicyRecommendation[]>([]);

  // 动态匹配引擎
  useEffect(() => {
    // 模拟数据加载
    setLoading(true);
    const timer = setTimeout(() => {
      // 只有当企业至少填写了名称或者行业时，才进行推荐
      if (!profile.companyName && !profile.industry) {
        setCurrentList([]);
        setLoading(false);
        return;
      }

      const matchedList = allRecommendations
        .map((item) => {
          let score = 50; // 基础分
          const reasons: string[] = [];

          // 匹配逻辑 1: 行业匹配
          if (profile.industry && profile.industry.includes("软件")) {
            if (item.title.includes("软件") || item.category === "知识产权") {
              score += 20;
              reasons.push(`行业符合：${profile.industry}`);
            }
          }

          // 匹配逻辑 2: 规模匹配
          if (profile.size && profile.size.includes("小微")) {
            if (item.title.includes("小微") || item.category === "创业支持") {
              score += 25;
              reasons.push(`规模符合：${profile.size}`);
            }
          }

          // 匹配逻辑 3: 资质/科技属性匹配 (简单通过名称判断)
          if (profile.companyName && profile.companyName.includes("科技")) {
            if (item.title.includes("科技") || item.category === "技术创新") {
              score += 15;
              reasons.push(`匹配科技型企业属性`);
            }
          }

          // 匹配逻辑 4: 营收相关 (金融服务匹配)
          if (
            profile.revenue &&
            parseInt(profile.revenue.replace(/[^0-9]/g, "")) > 100
          ) {
            if (item.type === "finance") {
              score += 30;
              reasons.push(`营收规模满足信贷要求`);
            }
          }

          // 封顶 99 分，增加一些随机浮动显得真实
          const finalScore = Math.min(
            99,
            score + Math.floor(Math.random() * 5),
          );

          // 补充通用匹配理由如果上面没命中
          if (reasons.length === 0) {
            reasons.push("符合企业基础发展诉求");
          }

          // 动态分配更新标签
          let updateTag;
          const randomSeed = Math.random();
          if (item.isHot && item.isUrgent) {
            updateTag = { text: "🔥 今日首发", type: "hot" as const };
          } else if (randomSeed > 0.7) {
            updateTag = { text: "⚡ 刚刚更新", type: "urgent" as const };
          } else {
            updateTag = { text: "🆕 本周新增", type: "new" as const };
          }

          return {
            ...item,
            matchScore: finalScore,
            matchReasons: reasons,
            updateTag,
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore); // 按分数从高到低排序

      setCurrentList(matchedList);
      setLoading(false);
    }, 600); // 模拟网络延迟

    return () => clearTimeout(timer);
  }, [profile, allRecommendations]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#52c41a";
      case "medium":
        return "#fa8c16";
      case "hard":
        return "#ff4d4f";
      default:
        return "#1890ff";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "容易";
      case "medium":
        return "中等";
      case "hard":
        return "困难";
      default:
        return "未知";
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 企业画像卡片 */}
      <Col xs={24} lg={8}>
        <Card
          className="hover-card"
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              企业画像
            </div>
          }
          style={{ height: "100%", minHeight: "480px" }}
          bodyStyle={{
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 58px)",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Avatar
                size={56}
                icon={<BankOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
              <Title
                level={5}
                style={{ marginTop: "12px", marginBottom: "4px" }}
              >
                {profile.companyName || "未认证企业"}
              </Title>
              <Space>
                <Tag color="blue">{profile.industry || "行业未填"}</Tag>
                <Tag color="green">{profile.size || "规模未填"}</Tag>
              </Space>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ marginBottom: "16px" }}>
              <Descriptions
                column={1}
                size="small"
                labelStyle={{ color: "#8c8c8c" }}
                contentStyle={{ fontWeight: 500 }}
              >
                <Descriptions.Item label="信用代码">
                  {profile.creditCode || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="法定代表人">
                  {profile.legalPerson || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="成立日期">
                  {profile.establishDate || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="注册资本">
                  {profile.registeredCapital || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="注册地址">
                  {profile.address || "--"}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider style={{ margin: "12px 0" }} dashed />
          </div>
        </Card>
      </Col>

      {/* 智能推荐列表 */}
      <Col xs={24} lg={16}>
        <Card
          className="hover-card"
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <StarOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
              智能推荐 ({currentList.length})
            </div>
          }
          style={{ height: "100%", minHeight: "480px" }}
        >
          <Spin spinning={loading}>
            <div style={{ height: "400px", overflowY: "auto" }}>
              {currentList.length === 0 ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span>
                        暂无推荐内容
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          请先在左侧完善企业名称、行业或规模等画像信息，解锁为您量身定制的政策与服务。
                        </Text>
                      </span>
                    }
                  />
                </div>
              ) : (
                <List
                  dataSource={currentList}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: "16px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "8px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "4px",
                              }}
                            >
                              <Title
                                level={5}
                                style={{ margin: 0, marginRight: "8px" }}
                              >
                                {item.title}
                              </Title>
                              {item.isHot && (
                                <Badge
                                  count="HOT"
                                  style={{ backgroundColor: "#ff4d4f" }}
                                />
                              )}
                              {item.isUrgent && (
                                <Badge
                                  count="急"
                                  style={{
                                    backgroundColor: "#fa8c16",
                                    marginLeft: "4px",
                                  }}
                                />
                              )}
                            </div>
                            <Paragraph
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                color: "#666",
                                marginBottom: "8px",
                              }}
                              ellipsis={{ rows: 2 }}
                            >
                              {item.description}
                            </Paragraph>

                            {/* 动态匹配理由展示区 */}
                            {item.matchReasons &&
                              item.matchReasons.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  {item.matchReasons.map((reason, idx) => (
                                    <Text
                                      key={idx}
                                      type="success"
                                      style={{
                                        fontSize: "12px",
                                        background: "#f6ffed",
                                        padding: "2px 8px",
                                        borderRadius: "4px",
                                        border: "1px solid #b7eb8f",
                                      }}
                                    >
                                      <CheckCircleOutlined
                                        style={{ marginRight: "4px" }}
                                      />
                                      {reason}
                                    </Text>
                                  ))}
                                </div>
                              )}
                          </div>
                          <div
                            style={{ textAlign: "right", marginLeft: "16px" }}
                          >
                            {item.updateTag && (
                              <div style={{ marginBottom: "8px" }}>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "4px 8px",
                                    background:
                                      item.updateTag.type === "hot"
                                        ? "#fff1f0"
                                        : item.updateTag.type === "urgent"
                                          ? "#fff7e6"
                                          : "#e6f7ff",
                                    color:
                                      item.updateTag.type === "hot"
                                        ? "#f5222d"
                                        : item.updateTag.type === "urgent"
                                          ? "#fa8c16"
                                          : "#1890ff",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    border: `1px solid ${item.updateTag.type === "hot" ? "#ffa39e" : item.updateTag.type === "urgent" ? "#ffd591" : "#91d5ff"}`,
                                  }}
                                >
                                  {item.updateTag.text}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {/* 标签区分服务类型 */}
                            <Tag
                              color={
                                item.type === "policy"
                                  ? "blue"
                                  : item.type === "finance"
                                    ? "gold"
                                    : "purple"
                              }
                            >
                              {item.type === "policy"
                                ? "政策补贴"
                                : item.type === "finance"
                                  ? "金融服务"
                                  : "企业服务"}
                            </Tag>

                            {item.type === "policy" ? (
                              <>
                                <Tag
                                  color={getDifficultyColor(item.difficulty)}
                                >
                                  {getDifficultyText(item.difficulty)}
                                </Tag>
                                {item.maxAmount > 0 && (
                                  <Tag color="gold">
                                    最高{(item.maxAmount / 10000).toFixed(0)}万
                                  </Tag>
                                )}
                              </>
                            ) : (
                              <>
                                <Tag color="cyan">{item.provider}</Tag>
                                {item.score && (
                                  <Tag color="orange" icon={<StarOutlined />}>
                                    {item.score}
                                  </Tag>
                                )}
                              </>
                            )}
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {item.type === "policy" && item.deadline && (
                              <>
                                <ClockCircleOutlined
                                  style={{
                                    color: "#fa8c16",
                                    marginRight: "4px",
                                  }}
                                />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {item.deadline}截止
                                </Text>
                              </>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ display: "flex", gap: "8px" }}>
                            {item.type === "policy" ? (
                              <>
                                <ApplyButton
                                  size="small"
                                  status="in_progress"
                                  onApply={() =>
                                    navigate(`/application/apply/${item.id}`)
                                  }
                                />
                                <Button
                                  size="small"
                                  onClick={() =>
                                    navigate(`/application/detail/${item.id}`)
                                  }
                                >
                                  查看详情
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() =>
                                  message.success("已发起对接请求")
                                }
                              >
                                立即对接
                              </Button>
                            )}
                            <Tooltip title="收藏">
                              <Button
                                size="small"
                                icon={<HeartOutlined />}
                                type="text"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};
