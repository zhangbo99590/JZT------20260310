/**
 * 空状态组件 - 无诊断数据时显示
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Card, Row, Col, Button, Result, Steps, Typography } from "antd";
import {
  ArrowLeftOutlined,
  FileSearchOutlined,
  TrophyOutlined,
  RocketOutlined,
  StarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* 顶部导航 */}
      <div
        style={{
          marginBottom: "24px",
          background: "#fff",
          padding: "16px 24px",
          borderRadius: "8px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/supply-chain-finance")}
            >
              返回供应链金融
            </Button>
          </Col>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              融资诊断分析
            </Title>
          </Col>
          <Col style={{ width: "120px" }} />
        </Row>
      </div>

      {/* 空状态页面 */}
      <Card>
        <Result
          icon={<FileSearchOutlined style={{ color: "#1890ff" }} />}
          title="暂无诊断数据"
          subTitle="您还没有进行融资诊断，请先完成融资需求采集以获得个性化的融资方案推荐。"
          extra={[
            <Button
              type="primary"
              key="start-diagnosis"
              icon={<PlusOutlined />}
              size="large"
              onClick={() =>
                navigate("/supply-chain-finance/financing-diagnosis")
              }
            >
              开始融资诊断
            </Button>,
            <Button
              key="view-products"
              size="large"
              onClick={() => navigate("/supply-chain-finance")}
            >
              查看金融产品
            </Button>,
          ]}
        />

        {/* 诊断流程说明 */}
        <div
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "#fafafa",
            borderRadius: "8px",
          }}
        >
          <Title
            level={4}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            <StarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
            融资诊断流程
          </Title>
          <Steps
            direction="horizontal"
            current={-1}
            items={[
              {
                title: "需求采集",
                description: "填写企业基本信息和融资需求",
                icon: <FileSearchOutlined />,
              },
              {
                title: "智能分析",
                description: "系统智能匹配最适合的融资方案",
                icon: <TrophyOutlined />,
              },
              {
                title: "方案推荐",
                description: "获得个性化的融资方案和专业建议",
                icon: <RocketOutlined />,
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};

export default EmptyState;
