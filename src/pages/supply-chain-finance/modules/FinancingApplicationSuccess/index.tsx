/**
 * 融资申请成功页面主组件
 * 创建时间: 2026-01-13
 */

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Result,
  Typography,
  Steps,
  Timeline,
  Descriptions,
  Space,
  Alert,
  Tag,
  Avatar,
  List,
} from "antd";
import {
  CheckCircleOutlined,
  UserOutlined,
  HomeOutlined,
  ReloadOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import type { ApplicationData } from "./types";
import {
  NEXT_STEPS,
  CONTACT_INFO,
  getPurposeText,
  getProcessSteps,
} from "./config";

const { Title, Text, Paragraph } = Typography;

const FinancingApplicationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 从路由状态或localStorage获取申请数据
    const data =
      location.state?.applicationData ||
      JSON.parse(localStorage.getItem("latest-application") || "{}");

    if (data && data.companyName) {
      setApplicationData(data);
    } else {
      // 如果没有数据，生成模拟数据
      const mockData: ApplicationData = {
        companyName: "示例企业有限公司",
        contactPerson: "张先生",
        phone: "138****8888",
        amount: 500,
        purpose: "equipment",
        applicationId: "FA" + Date.now().toString().slice(-8),
        submitTime: new Date().toLocaleString(),
        productName: "供应链金融-应收账款融资",
      };
      setApplicationData(mockData);
    }

    // 模拟进度更新
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 2) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [location.state]);

  if (!applicationData) {
    return <div>加载中...</div>;
  }

  const processSteps = getProcessSteps(currentStep);

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* 成功结果页 */}
      <Card style={{ marginBottom: "24px" }}>
        <Result
          status="success"
          title="申请提交成功！"
          subTitle={
            <div>
              <Paragraph style={{ fontSize: "16px", marginBottom: "16px" }}>
                您的融资申请已成功提交，申请编号：
                <Text strong>{applicationData.applicationId}</Text>
              </Paragraph>
              <Alert
                message="重要提醒"
                description={
                  <div>
                    <div>
                      我们的专业客户经理将在1个工作日内主动联系您，请保持电话畅通。
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <Text strong>联系电话：</Text>
                      <Text code>{applicationData.phone}</Text>
                    </div>
                  </div>
                }
                type="info"
                showIcon
                style={{ textAlign: "left", marginBottom: "16px" }}
              />
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="home"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              返回首页
            </Button>,
            <Button
              key="apply-again"
              icon={<ReloadOutlined />}
              onClick={() =>
                navigate("/supply-chain-finance/financing-diagnosis")
              }
            >
              再次申请
            </Button>,
          ]}
        />
      </Card>

      <Row gutter={24}>
        {/* 左侧：申请信息和进度 */}
        <Col span={16}>
          {/* 申请信息 */}
          <Card title="申请信息" style={{ marginBottom: "24px" }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="申请编号" span={2}>
                <Text strong style={{ color: "#1890ff" }}>
                  {applicationData.applicationId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="申请产品">
                {applicationData.productName}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {applicationData.submitTime}
              </Descriptions.Item>
              <Descriptions.Item label="企业名称">
                {applicationData.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {applicationData.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {applicationData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="申请金额">
                <Text strong style={{ color: "#f5222d" }}>
                  {applicationData.amount && applicationData.amount > 0
                    ? `${applicationData.amount}万元`
                    : "待商议"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="资金用途">
                <Tag color="blue">
                  {getPurposeText(applicationData.purpose)}
                </Tag>
              </Descriptions.Item>
              {applicationData.remarks && (
                <Descriptions.Item label="备注说明" span={2}>
                  {applicationData.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* 处理进度 */}
          <Card title="处理进度" style={{ marginBottom: "24px" }}>
            <Steps current={currentStep} items={processSteps} />
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                background: "#fafafa",
                borderRadius: "6px",
              }}
            >
              <Space>
                <Avatar
                  style={{ backgroundColor: "#52c41a" }}
                  icon={<CheckCircleOutlined />}
                />
                <div>
                  <Text strong>当前状态：</Text>
                  <Text style={{ color: "#52c41a" }}>
                    {currentStep === 0 && "申请已提交，等待系统审核"}
                    {currentStep === 1 && "初步审核中，请耐心等待"}
                    {currentStep >= 2 && "审核完成，客户经理即将联系您"}
                  </Text>
                </div>
              </Space>
            </div>
          </Card>

          {/* 后续流程 */}
          <Card title="后续流程">
            <Timeline
              items={NEXT_STEPS.map((step) => ({
                dot: step.icon,
                children: (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text strong>{step.content}</Text>
                    <Tag color="blue">{step.time}</Tag>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* 右侧：联系方式和帮助 */}
        <Col span={8}>
          {/* 专员信息 */}
          <Card
            title={
              <Space>
                <CustomerServiceOutlined style={{ color: "#1890ff" }} />
                <span>专属客户经理</span>
              </Space>
            }
            style={{ marginBottom: "16px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Avatar
                size={64}
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: "12px" }}>
                <Title level={4} style={{ margin: 0 }}>
                  张经理
                </Title>
                <Text type="secondary">高级客户经理</Text>
              </div>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="联系电话">
                400-888-9999
              </Descriptions.Item>
              <Descriptions.Item label="工作时间">
                周一至周五 9:00-18:00
              </Descriptions.Item>
              <Descriptions.Item label="服务经验">
                5年金融服务经验
              </Descriptions.Item>
            </Descriptions>
            <Alert
              message="温馨提示"
              description="客户经理将在1个工作日内主动联系您，如有紧急情况可直接拨打客服热线。"
              type="warning"
              showIcon
              style={{ marginTop: "16px" }}
            />
          </Card>

          {/* 联系方式 */}
          <Card title="其他联系方式" style={{ marginBottom: "16px" }}>
            <List
              dataSource={CONTACT_INFO}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: "#f0f0f0", color: "#1890ff" }}
                        icon={item.icon}
                      />
                    }
                    title={item.title}
                    description={
                      <div>
                        <Text strong>{item.content}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item.description}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 常见问题 */}
          <Card title="常见问题">
            <List
              size="small"
              dataSource={[
                "申请后多久会有人联系我？",
                "需要准备哪些材料？",
                "审批需要多长时间？",
                "利率是如何确定的？",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Button
                    type="link"
                    style={{ padding: 0, height: "auto", textAlign: "left" }}
                  >
                    {item}
                  </Button>
                </List.Item>
              )}
            />
            <Button type="primary" ghost block style={{ marginTop: "12px" }}>
              查看更多帮助
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancingApplicationSuccess;
