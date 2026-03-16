/**
 * 时效性管理模块 - 主入口
 * 创建时间: 2026-01-14
 */

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Tabs,
  Badge,
  Timeline,
  Alert,
  List,
  Avatar,
  Statistic,
  Progress,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import {
  ClockCircleOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  HistoryOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SyncOutlined,
  FileTextOutlined,
  CalendarOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { RegulationStatus, AlertRule } from "./types";
import {
  mockRegulationData,
  mockAlertRules,
  recentChanges,
  statistics,
} from "./config";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const TimelinessManagement: React.FC = () => {
  const [loading] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [, setSelectedRegulation] = useState<RegulationStatus | null>(null);
  const [alertForm] = Form.useForm();

  // 表格列配置
  const columns: ColumnsType<RegulationStatus> = [
    {
      title: "法规名称",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text: string, record: RegulationStatus) => (
        <div>
          <Button
            type="link"
            style={{ padding: 0, height: "auto", fontWeight: 500 }}
            onClick={() => setSelectedRegulation(record)}
          >
            {text}
          </Button>
          {record.changeType && (
            <div style={{ marginTop: 4 }}>
              <Tag
                color={
                  record.changeType === "new"
                    ? "green"
                    : record.changeType === "modified"
                    ? "orange"
                    : "red"
                }
              >
                {record.changeType === "new"
                  ? "新增"
                  : record.changeType === "modified"
                  ? "已修订"
                  : "已废止"}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "当前状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          effective: {
            color: "success",
            text: "有效",
            icon: <CheckCircleOutlined />,
          },
          revised: {
            color: "warning",
            text: "已修订",
            icon: <AlertOutlined />,
          },
          abolished: {
            color: "error",
            text: "已废止",
            icon: <ExclamationCircleOutlined />,
          },
          pending: {
            color: "processing",
            text: "待生效",
            icon: <ClockCircleOutlined />,
          },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Badge
            status={config.color as any}
            text={
              <Space size={4}>
                {config.icon}
                {config.text}
              </Space>
            }
          />
        );
      },
    },
    { title: "版本", dataIndex: "version", key: "version", width: 80 },
    {
      title: "最后更新",
      dataIndex: "lastUpdateDate",
      key: "lastUpdateDate",
      width: 100,
    },
    {
      title: "下次复审",
      dataIndex: "nextReviewDate",
      key: "nextReviewDate",
      width: 100,
      render: (date: string) => {
        const isNearDue = dayjs(date).diff(dayjs(), "days") <= 30;
        return (
          <span style={{ color: isNearDue ? "#ff4d4f" : undefined }}>
            {date}
            {isNearDue && (
              <AlertOutlined style={{ marginLeft: 4, color: "#ff4d4f" }} />
            )}
          </span>
        );
      },
    },
    {
      title: "风险等级",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 100,
      render: (level: string) => {
        const colors = { high: "red", medium: "orange", low: "green" };
        const texts = { high: "高风险", medium: "中风险", low: "低风险" };
        return (
          <Tag color={colors[level as keyof typeof colors]}>
            {texts[level as keyof typeof texts]}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<HistoryOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  // 预警规则表格列
  const alertColumns: ColumnsType<AlertRule> = [
    { title: "规则名称", dataIndex: "name", key: "name" },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const typeMap = {
          status_change: "状态变更",
          version_update: "版本更新",
          review_due: "复审到期",
          new_regulation: "新法规发布",
        };
        return typeMap[type as keyof typeof typeMap];
      },
    },
    {
      title: "状态",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={(checked) => {
            notification.success({
              message: `预警规则已${checked ? "启用" : "禁用"}`,
              description: record.name,
            });
          }}
        />
      ),
    },
    {
      title: "最后触发",
      dataIndex: "lastTriggered",
      key: "lastTriggered",
      render: (time: string) => time || "-",
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          时效性管理
        </Title>
        <Paragraph
          style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}
        >
          法规状态标注，自动预警机制，版本控制管理
        </Paragraph>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{
                  color:
                    stat.status === "success"
                      ? "#52c41a"
                      : stat.status === "warning"
                      ? "#fa8c16"
                      : stat.status === "error"
                      ? "#ff4d4f"
                      : "#1890ff",
                }}
                prefix={
                  stat.status === "success" ? (
                    <CheckCircleOutlined />
                  ) : stat.status === "warning" ? (
                    <AlertOutlined />
                  ) : stat.status === "error" ? (
                    <ExclamationCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* 左侧主要内容 */}
        <Col xs={24} lg={16}>
          <Tabs
            defaultActiveKey="status"
            items={[
              {
                key: "status",
                label: (
                  <Space>
                    <FileTextOutlined />
                    法规状态管理
                  </Space>
                ),
                children: (
                  <Card
                    title="法规状态监控"
                    extra={
                      <Space>
                        <Button icon={<SyncOutlined />}>同步更新</Button>
                        <Button type="primary" icon={<PlusOutlined />}>
                          添加监控
                        </Button>
                      </Space>
                    }
                  >
                    <Table
                      columns={columns}
                      dataSource={mockRegulationData}
                      rowKey="id"
                      loading={loading}
                      pagination={{
                        total: mockRegulationData.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                      }}
                    />
                  </Card>
                ),
              },
              {
                key: "alerts",
                label: (
                  <Space>
                    <BellOutlined />
                    预警规则
                  </Space>
                ),
                children: (
                  <Card
                    title="预警规则管理"
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAlertModalVisible(true)}
                      >
                        新增规则
                      </Button>
                    }
                  >
                    <Table
                      columns={alertColumns}
                      dataSource={mockAlertRules}
                      rowKey="id"
                      pagination={false}
                    />
                  </Card>
                ),
              },
              {
                key: "history",
                label: (
                  <Space>
                    <HistoryOutlined />
                    变更历史
                  </Space>
                ),
                children: (
                  <Card title="法规变更历史">
                    <Timeline>
                      {recentChanges.map((change) => (
                        <Timeline.Item
                          key={change.id}
                          color={
                            change.changeType === "new"
                              ? "green"
                              : change.changeType === "modified"
                              ? "orange"
                              : "red"
                          }
                          dot={
                            change.changeType === "new" ? (
                              <PlusOutlined />
                            ) : change.changeType === "modified" ? (
                              <EditOutlined />
                            ) : (
                              <DeleteOutlined />
                            )
                          }
                        >
                          <div>
                            <Text strong>{change.title}</Text>
                            <Tag
                              color={
                                change.impactLevel === "high"
                                  ? "red"
                                  : change.impactLevel === "medium"
                                  ? "orange"
                                  : "green"
                              }
                              style={{ marginLeft: 8 }}
                            >
                              {change.impactLevel === "high"
                                ? "高影响"
                                : change.impactLevel === "medium"
                                ? "中影响"
                                : "低影响"}
                            </Tag>
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary">{change.description}</Text>
                            </div>
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                <CalendarOutlined /> {change.changeDate}
                              </Text>
                            </div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Card>
                ),
              },
            ]}
          />
        </Col>

        {/* 右侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 风险提醒 */}
          <Card
            title={
              <Space>
                <WarningOutlined />
                风险提醒
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Alert
              message="即将到期复审"
              description="3个法规将在30天内到期复审，请及时关注"
              type="warning"
              showIcon
              style={{ marginBottom: 12 }}
            />
            <Alert
              message="高风险法规"
              description="8个法规被标记为高风险，建议优先处理"
              type="error"
              showIcon
            />
          </Card>

          {/* 最近变更 */}
          <Card
            title={
              <Space>
                <HistoryOutlined />
                最近变更
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={recentChanges.slice(0, 3)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.changeType === "new" ? (
                            <PlusOutlined />
                          ) : item.changeType === "modified" ? (
                            <EditOutlined />
                          ) : (
                            <DeleteOutlined />
                          )
                        }
                        style={{
                          backgroundColor:
                            item.changeType === "new"
                              ? "#52c41a"
                              : item.changeType === "modified"
                              ? "#fa8c16"
                              : "#ff4d4f",
                        }}
                      />
                    }
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.description}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.changeDate}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 系统状态 */}
          <Card
            title={
              <Space>
                <SettingOutlined />
                系统状态
              </Space>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text>数据同步进度</Text>
                <Text>85%</Text>
              </div>
              <Progress percent={85} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text>预警规则运行</Text>
                <Badge status="success" text="正常" />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text>最后同步时间</Text>
                <Text type="secondary">2024-01-15 14:30</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 新增预警规则弹窗 */}
      <Modal
        title="新增预警规则"
        open={alertModalVisible}
        onCancel={() => setAlertModalVisible(false)}
        onOk={() => {
          alertForm.validateFields().then(() => {
            notification.success({
              message: "预警规则创建成功",
              description: "新的预警规则已添加到系统中",
            });
            setAlertModalVisible(false);
            alertForm.resetFields();
          });
        }}
      >
        <Form form={alertForm} layout="vertical">
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: "请输入规则名称" }]}
          >
            <Input placeholder="输入预警规则名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="预警类型"
            rules={[{ required: true, message: "请选择预警类型" }]}
          >
            <Select placeholder="选择预警类型">
              <Option value="status_change">状态变更</Option>
              <Option value="version_update">版本更新</Option>
              <Option value="review_due">复审到期</Option>
              <Option value="new_regulation">新法规发布</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="recipients"
            label="通知对象"
            rules={[{ required: true, message: "请输入通知邮箱" }]}
          >
            <Input placeholder="输入邮箱地址，多个用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimelinessManagement;
