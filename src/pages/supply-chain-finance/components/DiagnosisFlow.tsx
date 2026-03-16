/**
 * 供应链金融诊断流程组件
 * 创建时间: 2026-01-13
 * 功能: 展示融资诊断的流程步骤
 */

import React from "react";
import { Card, Steps, Typography } from "antd";
import { diagnosisSteps } from "../config/mockData";

const { Title, Text } = Typography;

/**
 * 诊断流程展示组件
 * 组件创建时间: 2026-01-13
 */
const DiagnosisFlow: React.FC = () => {
  return (
    <Card
      className="professional-card fade-in-up"
      style={{ marginBottom: "24px" }}
    >
      <Title
        level={4}
        style={{ marginBottom: "16px", color: "var(--text-primary)" }}
      >
        诊断流程
      </Title>
      <Steps
        current={-1}
        items={diagnosisSteps}
        className="professional-steps"
        style={{ marginBottom: "20px" }}
      />
      <Text type="secondary">点击"开始新诊断"按钮开始融资需求诊断流程</Text>
    </Card>
  );
};

export default DiagnosisFlow;
