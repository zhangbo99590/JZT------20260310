/**
 * 系统管理页面头部组件
 * 创建时间: 2026-01-13
 * 功能: 展示页面标题和描述信息
 */

import React from "react";
import { Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

const PageHeader: React.FC = () => {
  return (
    <Card style={{ marginBottom: "16px" }}>
      <Space direction="vertical" size={8}>
        <Title level={2} style={{ margin: 0 }}>
          系统管理
        </Title>
        <Text type="secondary">
          管理系统的用户、角色和权限，确保系统安全和功能的正常运行
        </Text>
      </Space>
    </Card>
  );
};

export default PageHeader;
