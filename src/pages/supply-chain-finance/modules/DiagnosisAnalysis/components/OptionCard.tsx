/**
 * 融资方案卡片组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  Tag,
  Space,
  Divider,
  Typography,
  Rate,
} from "antd";
import {
  RocketOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  HeartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { FinancingOption } from "../types";
import { getMatchColor } from "../utils";

const { Text } = Typography;

interface OptionCardProps {
  option: FinancingOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  onApply: (option: FinancingOption) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  onApply,
}) => {
  return (
    <Card
      style={{ marginBottom: "16px" }}
      actions={[
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={() => onApply(option)}
        >
          立即申请
        </Button>,
        <Button
          type="link"
          icon={<HeartOutlined />}
          onClick={() => onSelect(option.id)}
        >
          {isSelected ? "取消收藏" : "收藏"}
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Text strong style={{ fontSize: "18px", marginRight: "12px" }}>
              {option.name}
            </Text>
            <Tag color={getMatchColor(option.matchScore)}>
              匹配度 {option.matchScore}%
            </Tag>
          </div>

          <Row gutter={16} style={{ marginBottom: "16px" }}>
            <Col span={6}>
              <Statistic
                title="利率/成本"
                value={option.interestRate}
                valueStyle={{ fontSize: "16px" }}
                prefix={<PercentageOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="融资额度"
                value={option.amount}
                valueStyle={{ fontSize: "16px" }}
                prefix={<DollarOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="融资期限"
                value={option.term}
                valueStyle={{ fontSize: "16px" }}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="成功率"
                value={option.successRate}
                suffix="%"
                valueStyle={{ fontSize: "16px" }}
                prefix={<TrophyOutlined />}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <Text strong>主要优势：</Text>
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  {option.advantages.slice(0, 2).map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>申请条件：</Text>
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  {option.requirements.slice(0, 2).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <BankOutlined />
              <Text type="secondary">{option.provider}</Text>
            </Space>
            <Rate disabled defaultValue={Math.floor(option.matchScore / 20)} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OptionCard;
