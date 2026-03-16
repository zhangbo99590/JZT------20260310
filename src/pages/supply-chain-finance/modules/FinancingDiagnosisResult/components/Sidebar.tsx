/**
 * 侧边栏组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Alert,
  Divider,
  Progress,
  Space,
  Typography,
  Button,
} from "antd";
import {
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface SidebarProps {
  onConsult: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onConsult }) => {
  return (
    <div
      style={{
        height: "584px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 推荐理由 */}
      <Card
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
            <span>推荐理由</span>
          </Space>
        }
        style={{ marginBottom: "16px" }}
      >
        <Alert
          message="专业建议"
          description="基于您的企业情况，建议优先选择流动资金贷款方案，具有额度高、成本低的优势。该方案审批快速，无需抵押，非常适合您的融资需求。"
          type="success"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      </Card>

      {/* 立即咨询 */}
      <Card>
        <div style={{ textAlign: "center" }}>
          <CustomerServiceOutlined
            style={{
              fontSize: "48px",
              color: "#1890ff",
              marginBottom: "16px",
            }}
          />
          <Title level={5}>需要专业指导？</Title>
          <Paragraph type="secondary" style={{ fontSize: "13px" }}>
            联系金融服务顾问，获取1对1方案解读、材料准备指导
          </Paragraph>
          <Button
            type="primary"
            block
            size="large"
            icon={<CustomerServiceOutlined />}
            onClick={onConsult}
            style={{ height: "60px" }}
          >
            立即咨询
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;
