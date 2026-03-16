/**
 * 我的收藏页面主组件
 * 创建时间: 2026-01-13
 * 功能: 我的收藏页面主入口，整合所有拆分的模块
 */

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Space,
  Empty,
  Typography,
  Divider,
  Tabs,
  List,
  Checkbox,
  DatePicker,
  Alert,
  Breadcrumb,
} from "antd";
import PageWrapper from "../../../components/PageWrapper";
import {
  SearchOutlined,
  BookOutlined,
  DeleteOutlined,
  ExportOutlined,
  FilterOutlined,
  DollarOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { FavoriteListItem, ExportModal } from "./components/index.ts";
import { useFavorites } from "./hooks/useFavorites.ts";
import type { FavoriteItem } from "./types/index.ts";

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

/**
 * 我的收藏页面组件
 * 组件创建时间: 2026-01-13 14:20:00
 */
const MyFavorites: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredFavorites,
    searchKeyword,
    setSearchKeyword,
    activeTab,
    setActiveTab,
    selectedItems,
    setSelectedItems,
    setDateRange,
    exportModalVisible,
    setExportModalVisible,
    handleSelectAll,
    handleSelectItem,
    handleBatchDelete,
    handleBatchExport,
    confirmExport,
    handleRemoveFavorite,
  } = useFavorites();

  // 查看详情
  const handleViewDetail = useCallback(
    (item: FavoriteItem) => {
      navigate(item.url);
    },
    [navigate],
  );

  // 渲染收藏项目
  const renderFavoriteItem = useCallback(
    (item: FavoriteItem) => {
      return (
        <FavoriteListItem
          key={item.id}
          item={item}
          isSelected={selectedItems.includes(item.id)}
          onSelect={handleSelectItem}
          onViewDetail={handleViewDetail}
          onRemove={handleRemoveFavorite}
        />
      );
    },
    [selectedItems, handleSelectItem, handleViewDetail, handleRemoveFavorite],
  );

  return (
    <PageWrapper module="system">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "系统管理" }, { title: "我的收藏" }]}
      />

      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          我的收藏
        </Title>
        <Paragraph
          style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}
        >
          跨模块收藏内容汇总，支持批量管理和数据分析
        </Paragraph>
      </div>

      <Card>
        {/* 搜索和筛选栏 */}
        <div style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索收藏内容、标签或来源模块..."
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ width: "100%" }}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                }
              />
            </Col>
            <Col>
              <Space>
                <RangePicker
                  placeholder={["开始日期", "结束日期"]}
                  onChange={(dates) => {
                    if (dates) {
                      setDateRange([
                        dates[0]!.format("YYYY-MM-DD"),
                        dates[1]!.format("YYYY-MM-DD"),
                      ]);
                    } else {
                      setDateRange(null);
                    }
                  }}
                />
              </Space>
            </Col>
          </Row>
        </div>

        {/* 批量操作栏 */}
        {selectedItems.length > 0 && (
          <Alert
            message={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>已选择 {selectedItems.length} 项</span>
                <Space>
                  <Button size="small" onClick={() => setSelectedItems([])}>
                    取消选择
                  </Button>
                  <Button
                    size="small"
                    icon={<ExportOutlined />}
                    onClick={handleBatchExport}
                  >
                    批量导出
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleBatchDelete}
                  >
                    批量取消收藏
                  </Button>
                </Space>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />
        )}

        <Divider />

        {/* 分类标签页 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: 16 }}
          tabBarExtraContent={
            <Space>
              <Checkbox
                indeterminate={
                  selectedItems.length > 0 &&
                  selectedItems.length < filteredFavorites.length
                }
                checked={
                  selectedItems.length === filteredFavorites.length &&
                  filteredFavorites.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
              <Button size="small" icon={<FilterOutlined />}>
                筛选
              </Button>
            </Space>
          }
          items={[
            { key: "all", label: "全部" },
            {
              key: "policy",
              label: (
                <Space>
                  <BookOutlined />
                  政策
                </Space>
              ),
            },
            {
              key: "opportunity",
              label: (
                <Space>
                  <SendOutlined />
                  商机
                </Space>
              ),
            },
            {
              key: "financing",
              label: (
                <Space>
                  <DollarOutlined />
                  融资
                </Space>
              ),
            },
          ]}
        />

        {/* 收藏列表 */}
        <div style={{ marginTop: 16 }}>
          {filteredFavorites.length > 0 ? (
            <List
              dataSource={filteredFavorites}
              renderItem={renderFavoriteItem}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 项收藏`,
                style: { marginTop: 24 },
              }}
            />
          ) : (
            <Empty
              description={
                searchKeyword
                  ? "未找到匹配的收藏内容"
                  : "暂无收藏内容，快去收藏感兴趣的资源吧～"
              }
              style={{ padding: "60px 0" }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </Card>

      {/* 导出确认弹窗 */}
      <ExportModal
        visible={exportModalVisible}
        selectedCount={selectedItems.length}
        onClose={() => setExportModalVisible(false)}
        onExport={confirmExport}
      />
    </PageWrapper>
  );
};

export default MyFavorites;
