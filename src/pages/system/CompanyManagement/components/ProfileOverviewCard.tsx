/**
 * 企业画像概览卡片组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Divider,
  Descriptions,
  Statistic,
  Button,
} from "antd";
import { BankOutlined, ReloadOutlined } from "@ant-design/icons";
import type { CompanyProfile, DataSourceType } from "../types/index.ts";
import { getSyncStatusIcon, getSyncStatusText } from "../utils/syncStatus.ts";

const { Text } = Typography;

interface ProfileOverviewCardProps {
  companyProfile: CompanyProfile | null;
  onRetrySync: (dataType: DataSourceType) => void;
}

const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  companyProfile,
  onRetrySync,
}) => {
  if (!companyProfile) {
    return (
      <Card
        style={{ marginBottom: "24px" }}
        title={
          <Space>
            <BankOutlined />
            <span>企业画像</span>
          </Space>
        }
      >
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text type="secondary">暂无企业画像数据</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{ marginBottom: "24px" }}
      title={
        <Space>
          <BankOutlined />
          <span>企业画像</span>
        </Space>
      }
    >
      {/* 关键指标统计 */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Statistic
            title="年度营收"
            value={companyProfile.revenue}
            valueStyle={{ color: "#3f8600" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="研发投入占比"
            value={companyProfile.rdRatio}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="知识产权总数"
            value={companyProfile.patents}
            suffix="项"
            valueStyle={{ color: "#cf1322" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="员工总数"
            value={companyProfile.totalEmployees}
            suffix="人"
          />
        </Col>
      </Row>

      <Divider />

      {/* 详细信息 */}
      <Row gutter={24}>
        <Col span={18}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="企业名称">
              {companyProfile.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="信用代码">
              {companyProfile.creditCode}
            </Descriptions.Item>
            <Descriptions.Item label="法定代表人">
              {companyProfile.legalPerson}
            </Descriptions.Item>
            <Descriptions.Item label="注册资本">
              {companyProfile.registeredCapital}
            </Descriptions.Item>
            <Descriptions.Item label="成立日期">
              {companyProfile.establishDate}
            </Descriptions.Item>
            <Descriptions.Item label="企业规模">
              {companyProfile.scale}
            </Descriptions.Item>
            <Descriptions.Item label="行业分类" span={2}>
              {companyProfile.industry}
            </Descriptions.Item>
            <Descriptions.Item label="注册地址" span={2}>
              {companyProfile.address}
            </Descriptions.Item>
            <Descriptions.Item label="企业资质" span={2}>
              {companyProfile.qualifications.map((q, i) => (
                <Tag key={i} color="blue">
                  {q}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="认证证书" span={2}>
              {companyProfile.certifications.map((c, i) => (
                <Tag key={i} color="green">
                  {c}
                </Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">数据同步状态</Text>
            <div style={{ marginTop: "16px" }}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                {/* 工商数据 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Space>
                    {getSyncStatusIcon(companyProfile.dataSource.business)}
                    <span>工商数据</span>
                    <Text
                      type={
                        companyProfile.dataSource.business === "failed"
                          ? "danger"
                          : "secondary"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {getSyncStatusText(companyProfile.dataSource.business)}
                    </Text>
                  </Space>
                  {companyProfile.dataSource.business === "failed" && (
                    <Button
                      type="link"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => onRetrySync("business")}
                    >
                      重试
                    </Button>
                  )}
                </div>
                {/* 税务数据 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Space>
                    {getSyncStatusIcon(companyProfile.dataSource.tax)}
                    <span>税务数据</span>
                    <Text
                      type={
                        companyProfile.dataSource.tax === "failed"
                          ? "danger"
                          : "secondary"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {getSyncStatusText(companyProfile.dataSource.tax)}
                    </Text>
                  </Space>
                  {companyProfile.dataSource.tax === "failed" && (
                    <Button
                      type="link"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => onRetrySync("tax")}
                    >
                      重试
                    </Button>
                  )}
                </div>
                {/* 研发数据 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Space>
                    {getSyncStatusIcon(companyProfile.dataSource.rd)}
                    <span>研发数据</span>
                    <Text
                      type={
                        companyProfile.dataSource.rd === "failed"
                          ? "danger"
                          : "secondary"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {getSyncStatusText(companyProfile.dataSource.rd)}
                    </Text>
                  </Space>
                  {companyProfile.dataSource.rd === "failed" && (
                    <Button
                      type="link"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => onRetrySync("rd")}
                    >
                      重试
                    </Button>
                  )}
                </div>
              </Space>
            </div>
            <div
              style={{
                marginTop: "16px",
                fontSize: "12px",
                color: "#8c8c8c",
              }}
            >
              最后同步: {companyProfile.lastSyncTime}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileOverviewCard;
