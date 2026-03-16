/**
 * 融资方案卡片组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Space,
  Divider,
  Typography,
  Rate,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  HeartOutlined,
  HeartFilled,
  FileTextOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { FinancingOption } from "../types";
import { getMatchTag } from "../utils";

const { Title, Text } = Typography;

import { useNavigate } from "react-router-dom";

interface OptionCardProps {
  option: FinancingOption;
  isFavorite: boolean;
  onToggleFavorite: (optionId: string) => void;
  onApply: (option: FinancingOption) => void;
  onViewReport: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isFavorite,
  onToggleFavorite,
  onApply,
  onViewReport,
}) => {
  const matchTag = getMatchTag(option.matchScore);

  // 动态计算融资额度
  const [dynamicAmount, setDynamicAmount] = React.useState<string>("");

  React.useEffect(() => {
    // 检查是否为页面刷新操作
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const navTiming = navEntries[0] as PerformanceNavigationTiming;
        if (navTiming.type === "reload") {
          isReload = true;
        }
      } else if (window.performance && window.performance.navigation) {
        // 兼容旧版 API
        if (window.performance.navigation.type === 1) {
          isReload = true;
        }
      }
    } catch (e) {
      console.warn("Navigation timing check failed", e);
    }

    // 如果是页面刷新，清除诊断数据，使用默认融资额度
    if (isReload) {
      localStorage.removeItem("financing-diagnosis-data");
      return;
    }

    // 从本地存储获取诊断数据
    const diagnosisDataStr = localStorage.getItem("financing-diagnosis-data");
    if (diagnosisDataStr) {
      try {
        const data = JSON.parse(diagnosisDataStr);
        const annualRevenue = Number(data.annualRevenue) || 0;

        // 只有当年营业收入大于 0 时才计算动态额度
        if (annualRevenue > 0) {
          // 计算公式：
          // 下限 = Max(年营业收入 * 30%, 100万)
          // 上限 = Min(年营业收入 * 80%, 2000万)
          const minAmount = Math.floor(Math.max(annualRevenue * 0.3, 100));
          const maxAmount = Math.floor(Math.min(annualRevenue * 0.8, 2000));

          // 确保计算出的额度有效（上限必须大于 0）
          if (maxAmount > 0) {
            const finalMin = Math.min(minAmount, maxAmount);
            setDynamicAmount(`${finalMin}-${maxAmount}万`);
          }
          // 如果 maxAmount <= 0，不设置 dynamicAmount，使用默认值
        }
        // 如果 annualRevenue <= 0，不设置 dynamicAmount，使用默认的 option.amount
      } catch (error) {
        console.error("计算动态融资额度失败:", error);
      }
    }
  }, []);

  const navigate = useNavigate();

  // 覆盖传入的 onApply 方法，以便控制导航行为
  const handleApply = (option: FinancingOption) => {
    // 传递 useDiagnosisData 标志，告知详情页可以使用本地诊断数据
    navigate(`/supply-chain-finance/option/${option.id}`, {
      state: { useDiagnosisData: true },
    });
  };

  return (
    <Card
      style={{
        marginBottom: "24px",
        minHeight: "600px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
      }}
    >
      <div style={{ flex: 1 }}>
        {/* 标题和匹配度 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <Title
              level={4}
              style={{ margin: 0, marginBottom: "12px", fontSize: "18px" }}
            >
              {option.name}
            </Title>
            <Tag
              color={matchTag.color}
              style={{ fontSize: "14px", padding: "6px 16px" }}
            >
              {matchTag.text}
            </Tag>
          </div>
          <Rate disabled value={option.rating} style={{ fontSize: "20px" }} />
        </div>

        {/* 关键指标 */}
        <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
          <Col span={6}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                利率/成本
              </Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <PercentageOutlined style={{ color: "#1890ff" }} />
                <span style={{ color: "#000000" }}>{option.interestRate}</span>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                融资额度
              </Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <DollarOutlined style={{ color: "#1890ff" }} />
                <span style={{ color: "#000000" }}>
                  {dynamicAmount || option.amount}
                </span>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                融资期限
              </Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <span style={{ color: "#000000" }}>{option.term}</span>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                成功率
              </Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <TrophyOutlined style={{ color: "#1890ff" }} />
                <span style={{ color: "#000000" }}>{option.successRate}%</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* 主要优势和申请条件 */}
        <Row gutter={24} style={{ marginBottom: "24px" }}>
          <Col span={12}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                主要优势：
              </Text>
              <div style={{ marginTop: "8px" }}>
                {option.advantages.map((advantage, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    • {advantage}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                申请条件：
              </Text>
              <div style={{ marginTop: "8px" }}>
                {option.requirements.map((req, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    • {req}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* 底部信息和操作 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingTop: "24px",
            marginTop: "auto",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Space size="middle">
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => handleApply(option)}
              size="large"
              style={{
                height: "60px",
                padding: "0 24px",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              立即申请
            </Button>
            <Button
              icon={
                isFavorite ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => onToggleFavorite(option.id)}
              size="large"
              style={{ height: "60px", padding: "0 24px", fontSize: "15px" }}
            >
              {isFavorite ? "已收藏" : "收藏"}
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default OptionCard;
