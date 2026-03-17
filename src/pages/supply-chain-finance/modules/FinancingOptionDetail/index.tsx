/**
 * 融资方案详情页面主组件
 * 创建时间: 2026-01-13
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Tag,
  Alert,
  Tabs,
  List,
  Space,
  Divider,
  Typography,
  Rate,
  Descriptions,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import type { FinancingOption } from "./types";
import { getFinancingOptionDetail, PURPOSE_OPTIONS } from "./config";
import { getMatchColor, generateApplicationId } from "./utils";
import { StorageUtils } from "../../../../utils/storage";

const { Title, Text, Paragraph } = Typography;

const FinancingOptionDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [optionDetail, setOptionDetail] = useState<FinancingOption | null>(
    null,
  );
  const [dynamicAmount, setDynamicAmount] = useState<string>("");

  useEffect(() => {
    if (id) {
      const detail = getFinancingOptionDetail(id);
      setOptionDetail(detail);

      // 检查是否为页面刷新操作
      // 如果是刷新，则不显示动态额度，恢复默认显示（100-2000万）
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
          // 1: TYPE_RELOAD
          if (window.performance.navigation.type === 1) {
            isReload = true;
          }
        }
      } catch (e) {
        console.warn("Navigation timing check failed", e);
      }

      if (isReload) {
        return;
      }

      const locationState = location.state as { useDiagnosisData?: boolean };

      if (!locationState?.useDiagnosisData) {
        return;
      }

      // 从本地存储获取诊断数据并计算融资额度
      let diagnosisDataStr = localStorage.getItem("financing-diagnosis-data");
      if (diagnosisDataStr) {
        try {
          const data = JSON.parse(diagnosisDataStr);
          const annualRevenue = Number(data.annualRevenue) || 0;

          if (annualRevenue > 0) {
            // 计算公式：
            // 下限 = Max(年营业收入 * 30%, 100万)
            // 上限 = Min(年营业收入 * 80%, 2000万)
            const minAmount = Math.floor(Math.max(annualRevenue * 0.3, 100));
            const maxAmount = Math.floor(Math.min(annualRevenue * 0.8, 2000));

            // 确保下限不超过上限
            const finalMin = Math.min(minAmount, maxAmount);

            setDynamicAmount(`${finalMin}-${maxAmount}万`);
          }
        } catch (error) {
          console.error("计算动态融资额度失败:", error);
        }
      }
    }
  }, [id, location.state]);

  // 独立的 useEffect 用于组件卸载时清除诊断数据
  // 这样无论用户如何进入页面，离开时都会清除数据，融资额度会重置为 100-2000万
  useEffect(() => {
    return () => {
      setDynamicAmount("");
      localStorage.removeItem("financing-diagnosis-data");
    };
  }, []);

  const handleApply = () => {
    setApplyModalVisible(true);
  };

  const handleApplySubmit = async () => {
    try {
      const values = await form.validateFields();

      const applicationData = {
        ...values,
        amount: values.amount || 0,
        purpose: values.purpose || "other",
        applicationId: generateApplicationId(),
        submitTime: new Date().toLocaleString(),
        productName: optionDetail?.name || "融资产品",
      };

      StorageUtils.setItem("latest-application", applicationData);

      message.success("申请提交成功，正在跳转...");
      setApplyModalVisible(false);
      form.resetFields();

      setTimeout(() => {
        navigate("/supply-chain-finance/application-success", {
          state: { applicationData },
        });
      }, 1000);
    } catch {
      message.error("请完善申请信息");
    }
  };

  if (!optionDetail) {
    return <div>加载中...</div>;
  }

  const processColumns = [
    {
      title: "步骤",
      dataIndex: "step",
      key: "step",
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#1890ff",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {index + 1}
        </div>
      ),
    },
    {
      title: "流程说明",
      dataIndex: "description",
      key: "description",
    },
  ];

  const processData = optionDetail.applicationProcess.map((process, index) => ({
    key: index,
    description: process,
  }));

  const tabItems = [
    {
      key: "overview",
      label: "方案详情",
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="主要优势" style={{ marginBottom: "16px" }}>
              <List
                dataSource={optionDetail.advantages}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="风险提示" style={{ marginBottom: "16px" }}>
              <List
                dataSource={optionDetail.risks}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="申请条件">
              <List
                dataSource={optionDetail.requirements}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
                      <Text>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "process",
      label: "申请流程",
      children: (
        <>
          <Card title="办理流程">
            <Table
              columns={processColumns}
              dataSource={processData}
              pagination={false}
              showHeader={false}
            />
          </Card>
          <Card title="所需材料" style={{ marginTop: "16px" }}>
            <Row gutter={[16, 16]}>
              {optionDetail.requiredDocuments.map((doc, index) => (
                <Col span={8} key={index}>
                  <Card size="small" style={{ textAlign: "center" }}>
                    <FileTextOutlined
                      style={{
                        fontSize: "24px",
                        color: "#1890ff",
                        marginBottom: "8px",
                      }}
                    />
                    <div>{doc}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      ),
    },
    {
      key: "cases",
      label: "成功案例",
      children: (
        <Row gutter={24}>
          {optionDetail.caseStudies.map((caseItem, index) => (
            <Col span={8} key={index}>
              <Card
                title={caseItem.companyName}
                extra={<Tag color="green">成功案例</Tag>}
                style={{ marginBottom: "16px" }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="所属行业">
                    {caseItem.industry}
                  </Descriptions.Item>
                  <Descriptions.Item label="融资金额">
                    {caseItem.amount}
                  </Descriptions.Item>
                  <Descriptions.Item label="融资期限">
                    {caseItem.term}
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Paragraph style={{ fontSize: "14px" }}>
                  <Text strong>案例结果：</Text>
                  {caseItem.result}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: "contact",
      label: "联系方式",
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="联系信息">
              <Descriptions column={1}>
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined />
                      联系人
                    </Space>
                  }
                >
                  {optionDetail.contactInfo.contactPerson}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined />
                      联系电话
                    </Space>
                  }
                >
                  {optionDetail.contactInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined />
                      邮箱地址
                    </Space>
                  }
                >
                  {optionDetail.contactInfo.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <EnvironmentOutlined />
                      办公地址
                    </Space>
                  }
                >
                  {optionDetail.contactInfo.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="快速咨询">
              <Alert
                message="专业服务"
                description="我们的专业团队将为您提供一对一的融资咨询服务，帮助您选择最适合的融资方案。"
                type="info"
                showIcon
                style={{ marginBottom: "16px" }}
              />
              <Button type="primary" block size="large" onClick={handleApply}>
                立即咨询
              </Button>
            </Card>
          </Col>
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
          background: "#fff",
          padding: "16px 24px",
          borderRadius: "8px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {optionDetail.name} - 详情
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={handleApply}
            >
              立即申请
            </Button>
          </Col>
        </Row>
      </div>

      {/* 方案概览卡片 */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={24}>
          <Col span={16}>
            <div style={{ marginBottom: "16px" }}>
              <Space align="center">
                <Title level={2} style={{ margin: 0 }}>
                  {optionDetail.name}
                </Title>
                <Tag
                  color={getMatchColor(optionDetail.matchScore)}
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {optionDetail.matchLevel}
                </Tag>
                <Rate disabled value={optionDetail.rating} />
              </Space>
            </div>
            <Paragraph
              style={{ fontSize: "16px", color: "#666", marginBottom: "20px" }}
            >
              {optionDetail.description}
            </Paragraph>
            <Row gutter={[24, 16]}>
              <Col span={6}>
                <Statistic
                  title="利率/成本"
                  value={optionDetail.interestRate}
                  prefix={<PercentageOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff", fontSize: "20px" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="融资额度"
                  value={dynamicAmount || optionDetail.amount}
                  prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a", fontSize: "20px" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="融资期限"
                  value={optionDetail.term}
                  prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                  valueStyle={{ color: "#faad14", fontSize: "20px" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="成功率"
                  value={optionDetail.successRate}
                  suffix="%"
                  prefix={<TrophyOutlined style={{ color: "#ff4d4f" }} />}
                  valueStyle={{ color: "#ff4d4f", fontSize: "20px" }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Card
              title={
                <Space>
                  <BankOutlined style={{ color: "#1890ff" }} />
                  <span>机构信息</span>
                </Space>
              }
              size="small"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="提供机构">
                  {optionDetail.provider}
                </Descriptions.Item>
                <Descriptions.Item label="审批时间">
                  {optionDetail.processingTime}
                </Descriptions.Item>
                <Descriptions.Item label="联系人">
                  {optionDetail.contactInfo.contactPerson}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {optionDetail.contactInfo.phone}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 详细信息标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        tabBarStyle={{
          background: "#fff",
          padding: "0 24px",
          marginBottom: "0",
        }}
        items={tabItems}
      />

      {/* 申请弹窗 */}
      <Modal
        title="融资申请"
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        onOk={handleApplySubmit}
        width={600}
        okText="提交申请"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="企业名称"
                name="companyName"
                rules={[{ required: true, message: "请输入企业名称" }]}
              >
                <Input placeholder="请输入企业名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="contactPerson"
                rules={[{ required: true, message: "请输入联系人" }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="phone"
                rules={[{ required: true, message: "请输入联系电话" }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申请金额" name="amount">
                <InputNumber
                  placeholder="请输入申请金额（选填）"
                  addonAfter="万元"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="资金用途" name="purpose">
            <Select placeholder="请选择资金用途（选填）">
              {PURPOSE_OPTIONS.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="备注说明" name="remarks">
            <Input.TextArea
              rows={3}
              placeholder="请简要说明您的融资需求和企业情况"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinancingOptionDetail;
