/**
 * 法律护航页面头部组件
 * 创建时间: 2026-01-13
 * 功能: 渲染法律护航页面的标题和描述
 */

import React from "react";
import { Typography } from "antd";
import { SafetyOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * 页面头部组件
 * 组件创建时间: 2026-01-13
 */
export const PageHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
        <SafetyOutlined style={{ marginRight: "8px" }} />
        法律护航
      </Title>
      <Paragraph style={{ marginTop: "8px", color: "#666" }}>
        为企业提供全方位的法律法规支持，确保合规经营，降低法律风险
      </Paragraph>
    </div>
  );
};
