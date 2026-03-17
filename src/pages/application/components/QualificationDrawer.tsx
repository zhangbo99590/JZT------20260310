/**
 * 抽屉式资质类型选择器
 * 创建时间: 2026-03-04
 * 功能: 抽屉式交互，左侧分组导航+右侧选项列表，支持搜索、多选、详情查看
 */

import React, { useState, useMemo } from "react";
import {
  Drawer,
  Input,
  Space,
  Button,
  Tag,
  Checkbox,
  Tooltip,
  Badge,
  Card,
  Row,
  Col,
  Divider,
  Empty,
  Typography,
  Collapse,
  Alert,
} from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  FireOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { QUALIFICATION_DATA } from "./QualificationSelector";
import type {
  QualificationType,
  QualificationGroup,
} from "./QualificationSelector";

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface QualificationDrawerProps {
  visible: boolean;
  value?: string[];
  onClose: () => void;
  onConfirm: (selectedValues: string[]) => void;
}

const QualificationDrawer: React.FC<QualificationDrawerProps> = ({
  visible,
  value = [],
  onClose,
  onConfirm,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("high_frequency");
  const [searchText, setSearchText] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>(value);
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);

  // 重置临时选择状态
  React.useEffect(() => {
    if (visible) {
      setTempSelected(value);
      setSearchText("");
      setExpandedDetailId(null);
    }
  }, [visible, value]);

  // 获取所有资质的扁平列表
  const allQualifications = useMemo(() => {
    return QUALIFICATION_DATA.flatMap((group) =>
      group.qualifications.map((q) => ({
        ...q,
        groupKey: group.key,
        groupColor: group.color,
      })),
    );
  }, []);

  // 高频资质
  const highFrequencyQualifications = useMemo(() => {
    return allQualifications.filter((q) => q.isHighFrequency);
  }, [allQualifications]);

  // 搜索过滤
  const filteredQualifications = useMemo(() => {
    if (selectedGroup === "high_frequency") {
      if (!searchText) return highFrequencyQualifications;
      const lowerSearch = searchText.toLowerCase();
      return highFrequencyQualifications.filter(
        (q) =>
          q.label.toLowerCase().includes(lowerSearch) ||
          q.pinyin?.includes(lowerSearch) ||
          q.description.toLowerCase().includes(lowerSearch),
      );
    }

    const group = QUALIFICATION_DATA.find((g) => g.key === selectedGroup);
    if (!group) return [];

    if (!searchText)
      return group.qualifications.map((q) => ({
        ...q,
        groupKey: group.key,
        groupColor: group.color,
      }));

    const lowerSearch = searchText.toLowerCase();
    return group.qualifications
      .filter(
        (q) =>
          q.label.toLowerCase().includes(lowerSearch) ||
          q.pinyin?.includes(lowerSearch) ||
          q.description.toLowerCase().includes(lowerSearch),
      )
      .map((q) => ({ ...q, groupKey: group.key, groupColor: group.color }));
  }, [selectedGroup, searchText, highFrequencyQualifications]);

  // 处理选择/取消选择
  const handleToggleSelect = (value: string) => {
    setTempSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  // 处理确认
  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  // 处理取消
  const handleCancel = () => {
    setTempSelected(value);
    onClose();
  };

  // 清空已选
  const handleClearAll = () => {
    setTempSelected([]);
  };

  // 获取资质详细信息
  const getQualificationById = (id: string) => {
    return allQualifications.find((q) => q.value === id);
  };

  // 渲染左侧分组导航
  const renderGroupNav = () => {
    const groups = [
      {
        key: "high_frequency",
        label: "高频资质（推荐）",
        icon: <FireOutlined />,
        color: "#faad14",
        count: highFrequencyQualifications.length,
      },
      ...QUALIFICATION_DATA.map((g) => ({
        key: g.key,
        label: g.label,
        icon: g.icon,
        color: g.color,
        count: g.qualifications.length,
      })),
    ];

    return (
      <div style={{ height: "100%", overflowY: "auto" }}>
        {groups.map((group) => {
          const isActive = selectedGroup === group.key;
          return (
            <div
              key={group.key}
              onClick={() => setSelectedGroup(group.key)}
              style={{
                padding: "16px",
                cursor: "pointer",
                background: isActive ? "#e6f7ff" : "transparent",
                borderLeft: isActive
                  ? "3px solid #1890ff"
                  : "3px solid transparent",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#fafafa";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Space>
                <span style={{ color: group.color, fontSize: 16 }}>
                  {group.icon}
                </span>
                <Text strong={isActive} style={{ fontSize: 14 }}>
                  {group.label}
                </Text>
              </Space>
              <Badge
                count={group.count}
                style={{
                  backgroundColor: isActive ? "#1890ff" : "#d9d9d9",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染资质选项卡片
  const renderQualificationCard = (
    qualification: QualificationType & { groupColor: string },
  ) => {
    const isSelected = tempSelected.includes(qualification.value);
    const isDetailExpanded = expandedDetailId === qualification.value;

    const levelConfig = {
      national: { color: "#ff4d4f", text: "国家级" },
      local: { color: "#1890ff", text: "地方级" },
      industry: { color: "#52c41a", text: "行业级" },
      innovation: { color: "#722ed1", text: "平台级" },
    };

    const config = levelConfig[qualification.level];

    return (
      <Card
        key={qualification.value}
        size="small"
        style={{
          marginBottom: 12,
          border: isSelected ? "2px solid #1890ff" : "1px solid #e8e8e8",
          background: isSelected ? "#f0f8ff" : "#fff",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        bodyStyle={{ padding: "12px 16px" }}
        hoverable
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          {/* 复选框 */}
          <Checkbox
            checked={isSelected}
            onChange={() => handleToggleSelect(qualification.value)}
            style={{ marginTop: 4 }}
          />

          {/* 资质信息 */}
          <div
            style={{ flex: 1 }}
            onClick={() => handleToggleSelect(qualification.value)}
          >
            <Space
              style={{
                marginBottom: 8,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text strong style={{ fontSize: 15 }}>
                {qualification.label}
              </Text>
              <Tag color={config.color}>{config.text}</Tag>
            </Space>

            <Paragraph
              style={{ margin: 0, color: "#666", fontSize: 13 }}
              ellipsis={{ rows: 2 }}
            >
              {qualification.description}
            </Paragraph>

            {qualification.region && (
              <Tag color="blue" style={{ marginTop: 8 }}>
                <EnvironmentOutlined /> {qualification.region}
              </Tag>
            )}
          </div>

          {/* 详情按钮 */}
          <Tooltip title={isDetailExpanded ? "收起详情" : "查看详情"}>
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedDetailId(
                  isDetailExpanded ? null : qualification.value,
                );
              }}
              style={{
                color: isDetailExpanded ? "#1890ff" : "#999",
              }}
            />
          </Tooltip>
        </div>

        {/* 展开的详情卡片 */}
        {isDetailExpanded && (
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid #e8e8e8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {/* 适用行业 */}
              <div>
                <Text
                  strong
                  style={{
                    color: "#1890ff",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  适用行业
                </Text>
                <Space wrap>
                  {qualification.applicableIndustries.map((industry, idx) => (
                    <Tag key={idx} color="blue">
                      {industry}
                    </Tag>
                  ))}
                </Space>
              </div>

              {/* 申报条件 */}
              <div>
                <Text
                  strong
                  style={{
                    color: "#52c41a",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  申报条件
                </Text>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
                  {qualification.conditions.map((condition, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 核心价值 */}
              <div>
                <Text
                  strong
                  style={{
                    color: "#faad14",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  核心价值
                </Text>
                <Space wrap>
                  {qualification.benefits.map((benefit, idx) => (
                    <Tag key={idx} color="gold">
                      {benefit}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Space>
          </div>
        )}
      </Card>
    );
  };

  // 渲染右侧选项列表
  const renderOptionsList = () => {
    if (filteredQualifications.length === 0) {
      return (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <Empty description="未找到匹配的资质类型" />
        </div>
      );
    }

    return (
      <div style={{ padding: "0 24px 24px" }}>
        {filteredQualifications.map((q) => renderQualificationCard(q))}
      </div>
    );
  };

  // 渲染已选资质区域
  const renderSelectedArea = () => {
    if (tempSelected.length === 0) {
      return (
        <div
          style={{ padding: "12px 24px", color: "#999", textAlign: "center" }}
        >
          暂未选择任何资质
        </div>
      );
    }

    return (
      <div style={{ padding: "12px 24px" }}>
        <Space wrap>
          {tempSelected.map((id) => {
            const qualification = getQualificationById(id);
            if (!qualification) return null;

            return (
              <Tag
                key={id}
                closable
                onClose={() => handleToggleSelect(id)}
                color="blue"
                style={{ marginBottom: 4, padding: "4px 8px", fontSize: 13 }}
              >
                {qualification.label}
              </Tag>
            );
          })}
        </Space>
      </div>
    );
  };

  return (
    <Drawer
      title={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <TrophyOutlined style={{ color: "#1890ff" }} />
            <span>选择申报资质类型</span>
          </Space>
          <Badge
            count={tempSelected.length}
            showZero
            style={{ marginRight: 40 }}
          >
            <Text style={{ color: "#666" }}>已选</Text>
          </Badge>
        </Space>
      }
      placement="right"
      width={1000}
      open={visible}
      onClose={handleCancel}
      maskClosable
      destroyOnClose
      styles={{
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClearAll}
            disabled={tempSelected.length === 0}
          >
            清空已选
          </Button>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
            >
              确认选择 ({tempSelected.length})
            </Button>
          </Space>
        </div>
      }
    >
      {/* 顶部搜索区域 */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e8e8e8",
          background: "#fafafa",
        }}
      >
        <Input
          size="large"
          prefix={<SearchOutlined />}
          placeholder="搜索资质名称或拼音首字母（如：gjgxjs）"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        {searchText && (
          <Text
            type="secondary"
            style={{ fontSize: 12, marginTop: 8, display: "block" }}
          >
            找到 {filteredQualifications.length} 个匹配结果
          </Text>
        )}
      </div>

      {/* 主体内容区域 */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* 左侧分组导航 */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #e8e8e8",
            background: "#fafafa",
            overflow: "hidden",
          }}
        >
          {renderGroupNav()}
        </div>

        {/* 右侧选项列表 */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          <div style={{ padding: "16px 24px 0" }}>
            <Alert
              message={
                <Space>
                  <InfoCircleOutlined />
                  <span>
                    点击资质卡片选择，点击 <InfoCircleOutlined />{" "}
                    图标查看详细信息
                  </span>
                </Space>
              }
              type="info"
              showIcon={false}
              style={{ marginBottom: 16 }}
            />
          </div>
          {renderOptionsList()}
        </div>
      </div>

      {/* 底部已选资质区域 */}
      <div
        style={{
          borderTop: "2px solid #e8e8e8",
          background: "#f5f5f5",
          maxHeight: 150,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "8px 24px" }}>
          <Text strong>已选资质 ({tempSelected.length})</Text>
        </div>
        <Divider style={{ margin: "0 0 8px 0" }} />
        {renderSelectedArea()}
      </div>
    </Drawer>
  );
};

export default QualificationDrawer;
