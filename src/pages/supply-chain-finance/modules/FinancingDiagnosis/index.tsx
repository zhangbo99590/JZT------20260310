/**
 * 融资诊断页面主组件
 * 创建时间: 2026-01-13
 */

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Progress,
  Space,
  Tag,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  Breadcrumb,
  Collapse,
} from "antd";
import {
  SaveOutlined,
  ArrowRightOutlined,
  FormOutlined,
} from "@ant-design/icons";

import {
  FUNDING_PURPOSE_OPTIONS,
  INDUSTRY_OPTIONS,
  RISK_FACTOR_OPTIONS,
  USAGE_PERIOD_OPTIONS,
  GUARANTEE_METHOD_OPTIONS,
  CREDIT_RATING_OPTIONS,
} from "./config";
import { useDiagnosisForm } from "./hooks/useDiagnosisForm";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const FinancingDiagnosis: React.FC = () => {
  const { form, saveDraft, handleSubmit } = useDiagnosisForm();
  const [activeKey, setActiveKey] = useState<string[]>(["1"]);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "金融服务" }, { title: "融资诊断" }]}
      />

      {/* 页面标题 */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Title level={2} style={{ marginBottom: "8px" }}>
          <FormOutlined style={{ marginRight: "12px", color: "#1890ff" }} />
          企业融资诊断
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          通过详细的企业信息收集，为您提供专业的融资建议和解决方案
        </Text>
      </div>

      {/* 进度指示 */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <Progress
            percent={50}
            strokeColor="#1890ff"
            format={() => "信息收集阶段"}
          />
          <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
            请填写完整的企业信息，我们将为您生成专业的融资诊断报告
          </Text>
        </div>
      </Card>

      {/* 表单内容 */}
      <Card>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Collapse
            activeKey={activeKey}
            onChange={(keys) => setActiveKey(keys as string[])}
            size="large"
          >
            {/* 融资目标 */}
            <Panel
              header={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tag color="blue">1</Tag>
                  <span style={{ fontWeight: 600, fontSize: "16px" }}>
                    融资目标
                  </span>
                </div>
              }
              key="1"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="融资用途"
                    name="fundingPurpose"
                    rules={[{ required: true, message: "请选择融资用途" }]}
                  >
                    <Select placeholder="请选择融资用途" size="large">
                      {FUNDING_PURPOSE_OPTIONS.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="融资金额（万元）"
                    name="fundingAmount"
                    rules={[{ required: true, message: "请输入融资金额" }]}
                  >
                    <InputNumber
                      placeholder="请输入融资金额"
                      style={{ width: "100%" }}
                      size="large"
                      min={1}
                      max={100000}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="资金使用期限"
                    name="usagePeriod"
                    rules={[{ required: true, message: "请选择使用期限" }]}
                  >
                    <Select placeholder="请选择使用期限" size="large">
                      {USAGE_PERIOD_OPTIONS.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 财务状况 */}
            <Panel
              header={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tag color="orange">2</Tag>
                  <span style={{ fontWeight: 600, fontSize: "16px" }}>
                    财务状况
                  </span>
                </div>
              }
              key="2"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="年营业收入（万元）"
                    name="annualRevenue"
                    rules={[{ required: true, message: "请输入年营业收入" }]}
                  >
                    <InputNumber
                      placeholder="请输入年营业收入"
                      style={{ width: "100%" }}
                      size="large"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="净利润（万元）"
                    name="netProfit"
                    rules={[{ required: true, message: "请输入净利润" }]}
                  >
                    <InputNumber
                      placeholder="请输入净利润"
                      style={{ width: "100%" }}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="总资产（万元）"
                    name="totalAssets"
                    rules={[{ required: true, message: "请输入总资产" }]}
                  >
                    <InputNumber
                      placeholder="请输入总资产"
                      style={{ width: "100%" }}
                      size="large"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="总负债（万元）"
                    name="totalLiabilities"
                    rules={[{ required: true, message: "请输入总负债" }]}
                  >
                    <InputNumber
                      placeholder="请输入总负债"
                      style={{ width: "100%" }}
                      size="large"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            {/* 其他信息 */}
            <Panel
              header={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tag color="cyan">3</Tag>
                  <span style={{ fontWeight: 600, fontSize: "16px" }}>
                    其他信息
                  </span>
                </div>
              }
              key="3"
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="主要风险因素"
                    name="riskFactors"
                    rules={[{ required: true, message: "请选择主要风险因素" }]}
                  >
                    <Checkbox.Group options={RISK_FACTOR_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="担保方式"
                    name="guaranteeMethod"
                    rules={[{ required: true, message: "请选择担保方式" }]}
                  >
                    <Select placeholder="请选择担保方式" size="large">
                      {GUARANTEE_METHOD_OPTIONS.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="抵押物价值（万元）" name="collateralValue">
                    <InputNumber
                      placeholder="如有抵押物，请输入评估价值"
                      style={{ width: "100%" }}
                      size="large"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="是否有过融资经历"
                    name="previousFinancing"
                    rules={[
                      { required: true, message: "请选择是否有过融资经历" },
                    ]}
                  >
                    <Radio.Group size="large">
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="信用等级" name="creditRating">
                    <Select placeholder="如有信用评级，请选择" size="large">
                      {CREDIT_RATING_OPTIONS.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="特殊要求" name="specialRequirements">
                    <TextArea
                      placeholder="如有特殊要求或补充说明，请在此填写"
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Form>

        {/* 底部操作按钮 */}
        <div
          style={{
            marginTop: "32px",
            padding: "24px 0",
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Space size="large">
            <Button size="large" icon={<SaveOutlined />} onClick={saveDraft}>
              保存草稿
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={handleSubmit}
            >
              下一步
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default FinancingDiagnosis;
