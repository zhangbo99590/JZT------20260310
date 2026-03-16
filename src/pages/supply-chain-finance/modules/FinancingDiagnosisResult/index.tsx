/**
 * 融资诊断结果页面主组件
 * 创建时间: 2026-01-13
 */

import React, { useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Steps,
  Breadcrumb,
  message,
} from "antd";
import { FileTextOutlined, CustomerServiceOutlined } from "@ant-design/icons";

import type { FinancingOption } from "./types";
import { FINANCING_OPTIONS, ANALYSIS_STEPS } from "./config";
import { OptionCard, ReportModal, ApplyModal, Sidebar } from "./components";

const { Title, Paragraph } = Typography;

const FinancingDiagnosisResult: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FinancingOption | null>(
    null,
  );
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const handleToggleFavorite = useCallback((optionId: string) => {
    setFavorites((prev) => {
      if (prev.includes(optionId)) {
        message.success("已取消收藏");
        return prev.filter((id) => id !== optionId);
      } else {
        message.success("已添加到收藏");
        return [...prev, optionId];
      }
    });
  }, []);

  const handleConsult = useCallback(() => {
    message.info("客服咨询功能开发中...");
  }, []);

  const handleViewReport = useCallback(() => {
    setReportModalVisible(true);
  }, []);

  const handleApplyOption = useCallback((option: FinancingOption) => {
    setSelectedOption(option);
    setApplyModalVisible(true);
  }, []);

  // 预先渲染所有选项卡片
  const optionCards = FINANCING_OPTIONS.map((option) => (
    <OptionCard
      key={option.id}
      option={option}
      isFavorite={favorites.includes(option.id)}
      onToggleFavorite={handleToggleFavorite}
      onApply={handleApplyOption}
      onViewReport={handleViewReport}
    />
  ));

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "金融服务" }, { title: "诊断分析报告" }]}
      />

      {/* 页面标题 */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: "#262626" }}>
              <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              诊断分析报告
            </Title>
            <Paragraph
              style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}
            >
              融资需求分析 · 企业资质评估 · 专业融资方案
            </Paragraph>
          </Col>
          <Col>
            <Button icon={<CustomerServiceOutlined />} onClick={handleConsult}>
              立即咨询
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 诊断进度 */}
      <Card style={{ marginBottom: "24px" }}>
        <Steps current={2} items={ANALYSIS_STEPS} />
      </Card>

      {/* 主内容区 - 融资方案展示 */}
      <Row gutter={24} align="top">
        <Col span={18}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {optionCards}
          </div>
        </Col>

        <Col span={6}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Sidebar onConsult={handleConsult} />
          </div>
        </Col>
      </Row>

      {/* 诊断报告弹窗 */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
      />

      {/* 申请弹窗 */}
      <ApplyModal
        visible={applyModalVisible}
        option={selectedOption}
        onClose={() => setApplyModalVisible(false)}
      />
    </div>
  );
};

export default FinancingDiagnosisResult;
