import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  Select,
  Button,
  Typography,
  Alert,
  Progress,
  Steps,
  Result,
  Row,
  Col,
  Space,
  Divider,
  Avatar,
  Card,
  message,
} from "antd";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  UserOutlined,
  SafetyCertificateFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "../styles";
import { createConnection } from "../../../../services/industryService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ConnectModalProps {
  open: boolean;
  onCancel: () => void;
  target: any; // Single target or array of targets
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  open,
  onCancel,
  target,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setLoading(false);
      form.resetFields();
      // Generate mock application ID
      setApplicationId(`FA${Math.floor(Math.random() * 100000000)}`);

      // Set default values
      form.setFieldsValue({
        contactName: "当前登录企业", // Mock
        contactPhone: "138****8888", // Mock
        contactEmail: "",
        budgetUnit: "wan",
      });
    }
  }, [open, form]);

  const isBatch = Array.isArray(target);
  const singleTarget = isBatch ? target[0] : target;

  // Calculate match degree color
  const getMatchColor = (score: number) => {
    if (score >= 80) return "#52c41a"; // Green
    if (score >= 60) return "#faad14"; // Yellow
    return "#ff4d4f"; // Red
  };

  // Watch description field for button state
  const description = Form.useWatch("description", form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Call Real API (Service)
      if (isBatch) {
        // Parallel requests for batch
        await Promise.all(
          target.map((t: any) =>
            createConnection(t.id, values.description, applicationId),
          ),
        );
      } else {
        await createConnection(
          singleTarget.id,
          values.description,
          applicationId,
        );
      }

      setLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
      // Only show error if it's not a validation error (validation error is handled by form)
      if (error instanceof Error) {
        message.error("提交失败：" + error.message);
      }
    }
  };

  const handleClose = () => {
    onCancel();
    // Small delay to reset state after animation
    setTimeout(() => {
      setIsSuccess(false);
    }, 300);
  };

  // Render Form Content
  const renderForm = () => (
    <>
      {/* Header Info */}
      <div
        style={{
          background: "#f5f7fa",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #e8e8e8",
        }}
      >
        {isBatch ? (
          <Space align="center">
            <Avatar
              style={{ backgroundColor: THEME.primary }}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong style={{ fontSize: "16px" }}>
                批量对接申请
              </Text>
              <div style={{ fontSize: "12px", color: "#666" }}>
                即将向{" "}
                <Text strong style={{ color: THEME.primary }}>
                  {target.length}
                </Text>{" "}
                家企业发送对接申请
              </div>
            </div>
          </Space>
        ) : (
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                {singleTarget?.name || "目标企业"}
              </Title>
              <Space size={12} style={{ fontSize: "12px", color: "#666" }}>
                <span>
                  <SafetyCertificateFilled style={{ color: "#52c41a" }} />{" "}
                  已认证
                </span>
                <span>{singleTarget?.region || "未知地区"}</span>
                <span>{singleTarget?.tags?.[0] || "行业未知"}</span>
              </Space>
            </Col>
            <Col flex="80px" style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={singleTarget?.matchDegree || 0}
                width={50}
                strokeColor={getMatchColor(singleTarget?.matchDegree || 0)}
                format={(percent) => (
                  <span style={{ fontSize: "12px", color: "#333" }}>
                    {percent}%
                  </span>
                )}
              />
              <div style={{ fontSize: "10px", marginTop: 4, color: "#999" }}>
                匹配度
              </div>
            </Col>
          </Row>
        )}
      </div>

      <Form form={form} layout="vertical" initialValues={{ budgetUnit: "wan" }}>
        {/* Basic Info */}
        <Title
          level={5}
          style={{
            fontSize: "14px",
            marginBottom: "16px",
            borderLeft: `3px solid ${THEME.primary}`,
            paddingLeft: "8px",
          }}
        >
          基础信息
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="申请编号">
              <Input
                value={applicationId}
                disabled
                style={{ color: "#666", background: "#f5f5f5" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="申请企业">
              <Input
                value="杭州示例科技有限公司"
                disabled
                suffix={<a href="#">修改</a>}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="联系电话" name="contactPhone" required>
              <Input disabled suffix={<a href="#">修改</a>} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系邮箱"
              name="contactEmail"
              rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
            >
              <Input placeholder="请输入接收通知的邮箱" />
            </Form.Item>
          </Col>
        </Row>

        {/* Connect Requirements */}
        <Title
          level={5}
          style={{
            fontSize: "14px",
            marginBottom: "16px",
            marginTop: "8px",
            borderLeft: `3px solid ${THEME.primary}`,
            paddingLeft: "8px",
          }}
        >
          对接需求
        </Title>
        <Form.Item
          label="对接目的"
          name="purpose"
          rules={[{ required: true, message: "请选择对接目的" }]}
        >
          <Radio.Group>
            <Radio value="purchase">采购合作</Radio>
            <Radio value="supply">供应合作</Radio>
            <Radio value="tech">技术合作</Radio>
            <Radio value="invest">投资合作</Radio>
            <Radio value="other">其他</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="需求描述"
          name="description"
          rules={[{ required: true, message: "请输入需求描述" }]}
          help="请详细描述您的合作意向，有助于提高对接成功率"
        >
          <TextArea
            rows={4}
            showCount
            maxLength={1000}
            placeholder="请输入您的对接需求说明，例如：我对贵公司的产品很感兴趣，希望能进一步沟通合作细节..."
          />
        </Form.Item>

        {/* Budget (Optional) */}
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="预期预算 (选填)"
              name="budgetAmount"
              style={{ marginBottom: 0 }}
            >
              <Input.Group compact>
                <Form.Item name="budgetAmount" noStyle>
                  <Input
                    style={{ width: "70%" }}
                    placeholder="请输入数字"
                    type="number"
                  />
                </Form.Item>
                <Form.Item name="budgetUnit" noStyle>
                  <Select style={{ width: "30%" }}>
                    <Option value="yuan">元</Option>
                    <Option value="wan">万元</Option>
                    <Option value="usd">美元</Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Notice */}
        <div style={{ marginTop: "24px" }}>
          <Alert
            message="提交须知"
            description="提交申请后，对方企业将收到您的对接请求，请确保联系信息准确有效。平台将保障您的信息安全。"
            type="info"
            showIcon
            style={{ border: "1px solid #91caff", background: "#e6f7ff" }}
          />
        </div>
      </Form>
    </>
  );

  // Render Success Content
  const renderSuccess = () => (
    <div style={{ padding: "20px 0" }}>
      <Result
        status="success"
        title="申请提交成功！"
        subTitle={
          <div
            style={{
              textAlign: "left",
              maxWidth: "400px",
              margin: "0 auto",
              background: "#f9f9f9",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Text type="secondary">申请编号：</Text>
              <Text strong>{applicationId}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Text type="secondary">商机名称：</Text>
              <Text>
                {isBatch
                  ? `批量对接 ${target.length} 家企业`
                  : singleTarget?.name}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">提交时间：</Text>
              <Text>{new Date().toLocaleString()}</Text>
            </div>
          </div>
        }
        extra={[
          <Button type="primary" key="home" onClick={handleClose}>
            返回列表
          </Button>,
          <Button key="buy" onClick={handleClose}>
            继续浏览
          </Button>,
        ]}
      />

      <div style={{ marginTop: "20px", padding: "0 40px" }}>
        <Title
          level={5}
          style={{
            fontSize: "14px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          处理进度跟踪
        </Title>
        <Steps size="small" current={1}>
          <Steps.Step title="提交申请" description="已完成" />
          <Steps.Step
            title="智能匹配"
            description="进行中"
            icon={<LoadingIcon />}
          />
          <Steps.Step title="企业对接" description="待开始" />
        </Steps>
      </div>

      <Divider style={{ margin: "24px 0" }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f0f5ff",
          padding: "12px",
          borderRadius: "8px",
        }}
      >
        <Avatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          size={48}
          style={{ marginRight: "16px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            专属对接员：李经理
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            电话：138-0013-8000 (工作日 9:00-18:00)
          </div>
        </div>
        <Button type="link" size="small">
          联系对接员
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={
        !isSuccess
          ? [
              <Button key="cancel" onClick={handleClose}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                disabled={!description}
              >
                {loading ? "提交中..." : "提交申请"}
              </Button>,
            ]
          : null
      }
      width={600}
      title={isSuccess ? null : "发起对接申请"}
      centered
      maskClosable={false}
      destroyOnClose
    >
      {isSuccess ? renderSuccess() : renderForm()}
    </Modal>
  );
};

const LoadingIcon = () => <ClockCircleOutlined spin />;

export default ConnectModal;
