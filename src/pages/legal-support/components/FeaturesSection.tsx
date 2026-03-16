/**
 * 法律护航功能模块组件
 * 创建时间: 2026-01-13
 * 功能: 渲染法律护航页面的功能模块卡片
 */

import React from "react";
import { Card, Row, Col, Button, Typography, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { featuresConfig } from "../config/featuresConfig.tsx";

const { Paragraph } = Typography;

/**
 * 功能模块组件
 * 组件创建时间: 2026-01-13
 */
export const FeaturesSection: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      {featuresConfig.map((feature, index) => (
        <Col xs={24} lg={8} key={index}>
          <Card
            hoverable
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            styles={{
              body: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
              },
            }}
            actions={[
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={feature.onClick}
              >
                {feature.buttonText}
              </Button>,
            ]}
          >
            <Card.Meta
              avatar={feature.icon}
              title={feature.title}
              description={
                <div>
                  <Paragraph>{feature.description}</Paragraph>
                  <Space direction="vertical" size="small">
                    {feature.features.map((item, featureIndex) => (
                      <div key={featureIndex}>• {item}</div>
                    ))}
                  </Space>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
