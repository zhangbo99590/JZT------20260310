/**
 * 增强版政策结果列表组件
 * 支持分页、排序、批量操作和详情查看
 */

import React, { useState, useMemo } from "react";
import {
  List,
  Card,
  Tag,
  Space,
  Button,
  Pagination,
  Select,
  Checkbox,
  Typography,
  Tooltip,
  Dropdown,
  message,
  Modal,
  Progress,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
  CalendarOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  ExportOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import * as XLSX from "xlsx";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PolicyItem {
  id: string;
  title: string;
  publishDate: string;
  department: string;
  industry: string[];
  level: string;
  region: string;
  district?: string;
  subsidyAmount?: string;
  status: "active" | "pending" | "expired";
  tags: string[];
  summary: string;
  matchScore?: number;
  isFavorite?: boolean;
  applicableIndustries?: string[];
  deadline?: string;
}

interface PolicyResultsListProps {
  data: PolicyItem[];
  loading?: boolean;
  total: number;
  current: number;
  pageSize: number;
  sortBy: "comprehensive" | "latest" | "deadline" | "amount";
  onPageChange: (page: number, size: number) => void;
  onSortChange: (sortBy: string) => void;
  onViewDetail: (id: string) => void;
  onBatchEdit?: (selectedIds: string[], action: string) => void;
  onExport?: (selectedIds?: string[]) => void;
  showBatchOperations?: boolean;
}

const PolicyResultsList: React.FC<PolicyResultsListProps> = ({
  data,
  loading = false,
  total,
  current,
  pageSize,
  sortBy,
  onPageChange,
  onSortChange,
  onViewDetail,
  onBatchEdit,
  onExport,
  showBatchOperations = true,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [batchEditVisible, setBatchEditVisible] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 排序选项
  const sortOptions = [
    { value: "comprehensive", label: "综合排序" },
    { value: "latest", label: "最新发布" },
    { value: "deadline", label: "截止时间" },
    { value: "amount", label: "补贴金额" },
  ];

  // 状态映射
  const statusConfig = {
    active: { color: "success", icon: <CheckCircleOutlined />, text: "进行中" },
    pending: {
      color: "warning",
      icon: <ClockCircleOutlined />,
      text: "待审核",
    },
    expired: {
      color: "default",
      icon: <ExclamationCircleOutlined />,
      text: "已截止",
    },
  };

  // 批量操作菜单
  const batchMenuItems: MenuProps["items"] = [
    {
      key: "favorite",
      icon: <StarOutlined />,
      label: "添加到收藏",
      onClick: () => handleBatchAction("favorite"),
    },
    {
      key: "tag",
      icon: <EditOutlined />,
      label: "批量标记",
      onClick: () => setBatchEditVisible(true),
    },
    {
      key: "export",
      icon: <ExportOutlined />,
      label: "导出选中项",
      onClick: () => handleExportSelected(),
    },
  ];

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(data.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 处理单项选择
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  // 处理收藏
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        message.success("已取消收藏");
      } else {
        newFavorites.add(id);
        message.success("已添加收藏");
      }
      return newFavorites;
    });
  };

  // 处理批量操作
  const handleBatchAction = (action: string) => {
    if (selectedItems.length === 0) {
      message.warning("请先选择要操作的政策");
      return;
    }
    onBatchEdit?.(selectedItems, action);
    setSelectedItems([]);
  };

  // 导出选中项
  const handleExportSelected = () => {
    if (selectedItems.length === 0) {
      message.warning("请先选择要导出的政策");
      return;
    }

    const selectedData = data.filter((item) => selectedItems.includes(item.id));
    const exportData = selectedData.map((item) => ({
      政策标题: item.title,
      发布日期: item.publishDate,
      发布部门: item.department,
      适用行业: item.industry.join(", "),
      政策级别: item.level,
      适用地区: item.region,
      补贴金额: item.subsidyAmount || "未明确",
      状态: statusConfig[item.status].text,
      政策摘要: item.summary,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "政策列表");
    XLSX.writeFile(
      wb,
      `政策列表_${new Date().toISOString().split("T")[0]}.xlsx`,
    );

    message.success(`已导出 ${selectedItems.length} 条政策数据`);
    setSelectedItems([]);
  };

  // 导出全部
  const handleExportAll = () => {
    onExport?.();
  };

  // 计算选择状态
  const isAllSelected = selectedItems.length === data.length && data.length > 0;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
      {/* 列表头部 */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              您主动搜索到以下政策
            </Title>
            <Text type="secondary">
              共找到 {total} 条政策，当前显示第 {current} 页
            </Text>
          </div>

          <Space>
            {/* 排序选择 */}
            <Select
              value={sortBy}
              onChange={onSortChange}
              style={{ width: 120 }}
              size="small"
            >
              {sortOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>

            {/* 批量操作 */}
            {showBatchOperations && (
              <>
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  全选
                </Checkbox>

                <Dropdown
                  menu={{ items: batchMenuItems }}
                  disabled={selectedItems.length === 0}
                >
                  <Button
                    size="small"
                    icon={<SettingOutlined />}
                    disabled={selectedItems.length === 0}
                  >
                    批量操作 ({selectedItems.length})
                  </Button>
                </Dropdown>

                <Button
                  size="small"
                  icon={<ExportOutlined />}
                  onClick={handleExportAll}
                >
                  导出数据
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>

      {/* 政策列表 */}
      <List
        loading={loading}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f5f5f5",
            }}
            actions={[
              <Tooltip title={favorites.has(item.id) ? "取消收藏" : "添加收藏"}>
                <Button
                  type="text"
                  icon={
                    favorites.has(item.id) ? (
                      <StarFilled style={{ color: "#faad14" }} />
                    ) : (
                      <StarOutlined />
                    )
                  }
                  onClick={() => handleToggleFavorite(item.id)}
                />
              </Tooltip>,
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail(item.id)}
              >
                查看详情
              </Button>,
            ]}
          >
            <div style={{ display: "flex", width: "100%" }}>
              {/* 选择框 */}
              {showBatchOperations && (
                <div style={{ marginRight: 16, paddingTop: 4 }}>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) =>
                      handleSelectItem(item.id, e.target.checked)
                    }
                  />
                </div>
              )}

              {/* 政策内容 */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 12 }}>
                  <Space align="start">
                    <Title level={5} style={{ margin: 0, maxWidth: 600 }}>
                      {item.title}
                    </Title>
                    {item.matchScore && (
                      <Progress
                        type="circle"
                        size={40}
                        percent={item.matchScore}
                        format={(percent) => `${percent}%`}
                        strokeColor="#52c41a"
                      />
                    )}
                  </Space>
                </div>

                <Paragraph
                  style={{
                    color: "#666",
                    marginBottom: 12,
                    lineHeight: 1.6,
                  }}
                  ellipsis={{ rows: 2, expandable: true, symbol: "展开" }}
                >
                  {item.summary}
                </Paragraph>

                <div style={{ marginBottom: 12 }}>
                  <Space wrap>
                    <Tag icon={<CalendarOutlined />} color="blue">
                      {item.publishDate}
                    </Tag>
                    <Tag icon={<BankOutlined />} color="green">
                      {item.department}
                    </Tag>
                    <Tag icon={<TeamOutlined />} color="orange">
                      {item.level}
                    </Tag>
                    <Tag
                      icon={statusConfig[item.status].icon}
                      color={statusConfig[item.status].color}
                    >
                      {statusConfig[item.status].text}
                    </Tag>
                    {item.subsidyAmount && (
                      <Tag color="red">💰 {item.subsidyAmount}</Tag>
                    )}
                  </Space>
                </div>

                <div>
                  <Space wrap>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      适用行业：
                    </Text>
                    {item.industry.map((ind, index) => (
                      <Tag key={index} size="small" style={{ fontSize: 11 }}>
                        {ind}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />

      {/* 分页 */}
      <div
        style={{
          padding: "16px 24px",
          textAlign: "center",
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条政策`
          }
          onChange={onPageChange}
          pageSizeOptions={["10", "20", "50", "100"]}
        />
      </div>

      {/* 批量编辑弹窗 */}
      <Modal
        title="批量编辑政策"
        open={batchEditVisible}
        onCancel={() => setBatchEditVisible(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>已选择 {selectedItems.length} 条政策</Text>
          <Space>
            <Button onClick={() => handleBatchAction("important")}>
              标记为重要
            </Button>
            <Button onClick={() => handleBatchAction("archive")}>归档</Button>
            <Button onClick={() => handleBatchAction("delete")} danger>
              删除
            </Button>
          </Space>
        </Space>
      </Modal>
    </div>
  );
};

export default PolicyResultsList;
