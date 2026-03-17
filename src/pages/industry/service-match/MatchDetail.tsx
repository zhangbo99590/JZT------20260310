import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  message,
  Modal,
  QRCode,
} from "antd";
import {
  ArrowLeftOutlined,
  MessageOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  TagsOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { THEME, COMMON_STYLES } from "./styles";

const { Title, Text, Paragraph } = Typography;

const MatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  // Mock Data (In real app, fetch by ID)
  const detail = {
    id,
    name: "上海微电子装备有限公司",
    matchScore: 92,
    tags: ["高端制造", "集成电路", "国家高新"],
    businessScope: "芯片研发, 封装测试",
    region: "上海市浦东新区",
    contact: "张经理 13800138000",
    description:
      "上海微电子装备（集团）股份有限公司（SMEE）主要致力于半导体装备、泛半导体装备、高端智能装备的开发、设计、制造、销售及技术服务。公司设备广泛应用于集成电路前道、后道、先进封装、MEMS、LED、Power Devices、FPD/OLED等制造领域。",
    requirements:
      "1. 数字化供应链管理系统：需要支持多级供应商管理，具备风险预警功能。\n2. 数据分析平台：集成ERP、MES等多源数据，实现生产经营可视化。\n3. 定制化开发服务：需驻场开发，响应时间<2小时。",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("联系方式已复制");
  };

  return (
    <div style={COMMON_STYLES.pageContainer}>
      <Space direction="vertical" style={{ width: "100%" }} size={24}>
        {/* Header (Top Nav) */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            style={{ marginRight: "8px" }}
          />
          <Title level={4} style={{ margin: 0, ...COMMON_STYLES.title }}>
            匹配对象详情
          </Title>
        </div>

        {/* Top: Basic Info */}
        <Card
          style={{
            ...COMMON_STYLES.card,
            borderTop: `4px solid ${THEME.primary}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <div>
              <Title level={3} style={{ marginBottom: "8px" }}>
                {detail.name}
              </Title>
              <Space>
                {detail.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: THEME.textHint }}>
                匹配度
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: THEME.danger,
                }}
              >
                {detail.matchScore}%
              </div>
            </div>
          </div>

          <Descriptions column={2}>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <EnvironmentOutlined /> 所在地区
                </span>
              }
            >
              {detail.region}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <TagsOutlined /> 业务合作
                </span>
              }
            >
              {detail.businessScope}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span style={{ color: THEME.textBody }}>
                  <SafetyCertificateOutlined /> 认证资质
                </span>
              }
            >
              ISO9001, 高新技术企业
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">
              <Space>
                <Text strong>{detail.contact}</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(detail.contact)}
                >
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Middle: Core Content */}
        <Card title="核心需求/内容" bordered={false} style={COMMON_STYLES.card}>
          <Title level={5} style={{ fontSize: "15px", marginTop: 0 }}>
            企业简介
          </Title>
          <Paragraph style={{ color: THEME.textBody, lineHeight: "24px" }}>
            {detail.description}
          </Paragraph>

          <Divider />

          <Title level={5} style={{ fontSize: "15px" }}>
            具体需求
          </Title>
          <Paragraph
            style={{
              color: THEME.textBody,
              whiteSpace: "pre-line",
              lineHeight: "24px",
            }}
          >
            {detail.requirements}
          </Paragraph>
        </Card>

        {/* Bottom: Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <Button
            size="large"
            style={{ minWidth: "120px" }}
            onClick={() => navigate(-1)}
          >
            返回列表
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<MessageOutlined />}
            style={{ minWidth: "120px" }}
            onClick={() => setIsContactModalVisible(true)}
          >
            发起私信
          </Button>
        </div>

        <Modal
          title="联系企业负责人"
          open={isContactModalVisible}
          onCancel={() => setIsContactModalVisible(false)}
          footer={null}
          width={360}
          centered
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 0",
              textAlign: "center",
            }}
          >
            <QRCode
              value={`https://example.com/contact/${detail.id}`}
              size={200}
            />
            <Text strong style={{ marginTop: "16px", fontSize: "16px" }}>
              {detail.contact.split(" ")[0]}
            </Text>
            <Text type="secondary" style={{ marginTop: "4px" }}>
              扫码添加企业负责人微信
            </Text>
            <Text
              type="secondary"
              style={{ marginTop: "4px", fontSize: "12px" }}
            >
              {detail.name}
            </Text>
          </div>
        </Modal>
      </Space>
    </div>
  );
};

export default MatchDetail;
