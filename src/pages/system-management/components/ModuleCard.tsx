/**
 * 系统管理模块卡片组件
 * 创建时间: 2026-01-13
 * 功能: 展示单个系统管理模块的信息和入口
 */

import React from "react";
import { Card, Button, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { SystemModule } from "../config/systemModules";

const { Title, Text } = Typography;

interface ModuleCardProps {
  module: SystemModule;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  const IconComponent = module.icon;

  const handleEnterModule = () => {
    navigate(module.path);
  };

  return (
    <Card
      hoverable
      style={{ height: "100%" }}
      actions={[
        <Button
          key="enter"
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={handleEnterModule}
        >
          进入管理
        </Button>,
      ]}
    >
      {/* 模块图标 */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <IconComponent style={{ fontSize: 48, color: module.color }} />
      </div>

      {/* 模块标题 */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          {module.title}
        </Title>
      </div>

      {/* 模块描述 */}
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        {module.description}
      </Text>

      {/* 主要功能列表 */}
      <div>
        <Text strong style={{ fontSize: "12px", color: "#8c8c8c" }}>
          主要功能：
        </Text>
        <div style={{ marginTop: 8 }}>
          {module.features.map((feature, index) => (
            <div
              key={index}
              style={{
                fontSize: "12px",
                color: "#595959",
                marginBottom: 4,
                paddingLeft: 8,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: module.color,
                }}
              >
                •
              </span>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;
