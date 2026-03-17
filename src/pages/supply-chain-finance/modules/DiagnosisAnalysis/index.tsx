/**
 * 融资诊断分析页面主组件
 * 创建时间: 2026-01-13
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Progress,
  Tag,
  Alert,
  Tabs,
  List,
  Avatar,
  Space,
  Typography,
  Steps,
  Timeline,
} from "antd";
import {
  ArrowLeftOutlined,
  SwapOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { FinancingOption, FinancingDiagnosisData } from "./types";
import { FINANCING_OPTIONS, ANALYSIS_STEPS } from "./config";
import { getMatchColor, getFinancingDiagnosisData } from "./utils";
import { EmptyState, OptionCard, ApplyModal, CompareModal } from "./components";

const { Title, Text, Paragraph } = Typography;

const DiagnosisAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recommendation");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [hasFinancingData, setHasFinancingData] = useState(false);
  const [financingData, setFinancingData] =
    useState<FinancingDiagnosisData | null>(null);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FinancingOption | null>(
    null,
  );

  useEffect(() => {
    const { hasData, data } = getFinancingDiagnosisData();
    setHasFinancingData(hasData);
    setFinancingData(data as FinancingDiagnosisData);
  }, []);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleCompare = () => {
    if (selectedOptions.length >= 2) {
      setCompareModalVisible(true);
    }
  };

  const handleApplyOption = (option: FinancingOption) => {
    setSelectedOption(option);
    setApplyModalVisible(true);
  };

  // 如果没有融资诊断数据，显示引导页面
  if (!hasFinancingData) {
    return <EmptyState />;
  }

  const tabItems = [
    {
      key: "recommendation",
      label: "智能推荐方案",
      children: (
        <Row gutter={24}>
          <Col span={18}>
            <div>
              {FINANCING_OPTIONS.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedOptions.includes(option.id)}
                  onSelect={handleSelectOption}
                  onApply={handleApplyOption}
                />
              ))}
            </div>
          </Col>

          <Col span={6}>
            <Card title="推荐依据" style={{ marginBottom: "16px" }}>
              <Timeline
                items={[
                  {
                    dot: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                    children: "企业资质评估：优秀",
                  },
                  {
                    dot: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                    children: "融资需求匹配：高度匹配",
                  },
                  {
                    dot: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
                    children: "风险控制要求：中等",
                  },
                  {
                    dot: <ClockCircleOutlined style={{ color: "#faad14" }} />,
                    children: "时间紧迫性：一般",
                  },
                ]}
              />
            </Card>

            <Card title="专家建议">
              <Alert
                message="融资建议"
                description="基于您的企业情况，建议优先考虑供应链金融方案，具有审批快、成本低的优势。同时可考虑银行贷款作为补充。"
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
              <Button
                type="primary"
                block
                icon={<RocketOutlined />}
                onClick={() =>
                  navigate("/supply-chain-finance/financing-option-detail/1")
                }
              >
                申请推荐方案
              </Button>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "matching",
      label: "匹配度分析",
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="匹配度排名">
              <List
                dataSource={[...FINANCING_OPTIONS].sort(
                  (a, b) => b.matchScore - a.matchScore,
                )}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: getMatchColor(item.matchScore),
                            color: "#fff",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      }
                      title={item.name}
                      description={
                        <Space>
                          <Progress
                            percent={item.matchScore}
                            size="small"
                            strokeColor={getMatchColor(item.matchScore)}
                            style={{ width: 200 }}
                          />
                          <Text>{item.matchScore}%</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="匹配度分析详情">
              <div style={{ marginBottom: "20px" }}>
                <Title level={5}>供应链金融-应收账款融资</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text>资质匹配度</Text>
                      <Progress
                        percent={95}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <Text>需求匹配度</Text>
                      <Progress
                        percent={90}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: "12px" }}>
                      <Text>风险匹配度</Text>
                      <Progress
                        percent={88}
                        size="small"
                        strokeColor="#1890ff"
                      />
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <Text>成本匹配度</Text>
                      <Progress
                        percent={92}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <Alert
                message="匹配分析"
                description="该方案与您的企业情况高度匹配，特别是在应收账款质量和核心客户信用方面具有明显优势。"
                type="success"
                showIcon
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "cases",
      label: "成功案例",
      children: (
        <Row gutter={24}>
          {[1, 2, 3].map((i) => (
            <Col span={8} key={i}>
              <Card
                cover={
                  <div
                    style={{
                      height: "120px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <Title level={3} style={{ color: "#fff", margin: 0 }}>
                      案例 {i}
                    </Title>
                  </div>
                }
                actions={[
                  <Button type="link" key="detail">
                    查看详情
                  </Button>,
                ]}
              >
                <Card.Meta
                  title="某制造企业供应链融资案例"
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        该企业通过应收账款融资成功获得800万资金，解决了生产资金周转问题，
                        整个流程仅用时5个工作日，大大提升了资金使用效率。
                      </Paragraph>
                      <Space>
                        <Tag color="green">融资成功</Tag>
                        <Tag color="blue">800万</Tag>
                        <Tag color="orange">5天</Tag>
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* 顶部导航 */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/supply-chain-finance")}
          >
            返回供应链金融
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            融资诊断分析报告
            {financingData && (
              <Text
                type="secondary"
                style={{ fontSize: "14px", marginLeft: "12px" }}
              >
                基于 {financingData.companyName || "您的企业"} 的融资需求分析
              </Text>
            )}
          </Title>
        </Space>
        <Space>
          <Button
            type="primary"
            disabled={selectedOptions.length < 2}
            onClick={handleCompare}
            icon={<SwapOutlined />}
          >
            方案对比 ({selectedOptions.length})
          </Button>
          <Button type="primary" icon={<RocketOutlined />}>
            立即申请
          </Button>
        </Space>
      </div>

      {/* 诊断进度 */}
      <Card style={{ marginBottom: "24px" }}>
        <Steps current={2} items={ANALYSIS_STEPS} />
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        items={tabItems}
      />

      {/* 方案对比弹窗 */}
      <CompareModal
        visible={compareModalVisible}
        selectedOptions={selectedOptions}
        financingOptions={FINANCING_OPTIONS}
        onClose={() => setCompareModalVisible(false)}
      />

      {/* 申请弹窗 */}
      <ApplyModal
        visible={applyModalVisible}
        option={selectedOption}
        onClose={() => setApplyModalVisible(false)}
      />
    </div>
  );
};

export default DiagnosisAnalysis;
