/**
 * 首页页面头部组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的标题和欢迎信息
 */

import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

interface PageHeaderProps {
  username: string;
}

/**
 * 页面头部组件
 * 组件创建时间: 2026-01-13
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ username }) => {
  const [currentDate, setCurrentDate] = React.useState<string>("");

  React.useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div style={{ marginBottom: "24px" }}>
      <Title
        level={2}
        style={{ margin: 0, color: "#1890ff" }}
        className="page-header-welcome"
      >
        中小企业政策申报管理系统
      </Title>
      <div style={{ marginTop: "8px" }}>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          欢迎回来，<Text strong>{username}</Text>！
          {currentDate && (
            <Text type="secondary">今天是 {currentDate}，祝您工作愉快。</Text>
          )}
        </Text>
      </div>
    </div>
  );
};
