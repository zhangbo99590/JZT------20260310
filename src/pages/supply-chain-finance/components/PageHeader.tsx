/**
 * 供应链金融页面头部组件
 * 创建时间: 2026-01-13
 * 功能: 展示页面标题、描述和主要操作按钮
 */

import React from "react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

/**
 * 页面头部组件
 * 组件创建时间: 2026-01-13
 */
const PageHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleStartDiagnosis = () => {
    navigate("/supply-chain-finance/financing-diagnosis");
  };

  return (
    <div className="page-header">
      <div>
        <Title level={2} className="page-title">
          供应链金融
        </Title>
        <Paragraph className="page-description">
          为企业提供全方位的供应链金融服务，包括融资诊断、诊断分析、数据可视化等专业功能
        </Paragraph>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="btn-primary-enhanced"
        onClick={handleStartDiagnosis}
        size="large"
      >
        开始新诊断
      </Button>
    </div>
  );
};

export default PageHeader;
