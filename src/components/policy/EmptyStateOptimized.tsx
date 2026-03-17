/**
 * 优化的空状态组件
 * 提供友好的引导信息和操作建议
 */

import React from "react";
import { Empty, Button, Space, Typography, Card } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  BulbOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface EmptyStateOptimizedProps {
  type?: "no-results" | "no-search" | "error";
  searchKeyword?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onRetry?: () => void;
  suggestions?: string[];
}

const EmptyStateOptimized: React.FC<EmptyStateOptimizedProps> = ({
  type = "no-results",
  searchKeyword,
  hasFilters = false,
  onClearFilters,
  onRetry,
  suggestions = [],
}) => {
  const renderNoResults = () => (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 120, marginBottom: 16 }}
        description={
          <div>
            <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
              未找到匹配的政策
            </Title>
            <Paragraph
              style={{ color: "#999", fontSize: 14, marginBottom: 24 }}
            >
              {searchKeyword
                ? `没有找到包含"${searchKeyword}"的政策信息`
                : "当前筛选条件下没有匹配的政策"}
              <br />
              请尝试调整筛选条件或更换搜索关键词
            </Paragraph>
          </div>
        }
      />

      <Space
        direction="vertical"
        size={16}
        style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
      >
        {/* 操作建议 */}
        <Card
          size="small"
          style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}
        >
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Text strong style={{ color: "#495057" }}>
              <BulbOutlined /> 搜索建议：
            </Text>
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                color: "#6c757d",
                fontSize: 13,
              }}
            >
              <li>尝试使用更通用的关键词</li>
              <li>检查关键词拼写是否正确</li>
              <li>减少筛选条件的限制</li>
              <li>尝试相关的同义词</li>
            </ul>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <Space>
          {hasFilters && (
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              清空筛选条件
            </Button>
          )}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => window.location.reload()}
          >
            重新搜索
          </Button>
        </Space>

        {/* 热门搜索建议 */}
        {suggestions.length > 0 && (
          <Card
            size="small"
            style={{ background: "#fff7e6", border: "1px solid #ffd591" }}
          >
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong style={{ color: "#d46b08" }}>
                💡 试试这些热门搜索：
              </Text>
              <Space wrap>
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="small"
                    type="link"
                    style={{ padding: "0 8px", height: 24, fontSize: 12 }}
                    onClick={() => {
                      // 触发搜索建议
                      const event = new CustomEvent("searchSuggestion", {
                        detail: { keyword: suggestion },
                      });
                      window.dispatchEvent(event);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Space>
            </Space>
          </Card>
        )}
      </Space>
    </div>
  );

  const renderNoSearch = () => (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <Empty
        image="/images/search-illustration.svg"
        imageStyle={{ height: 160, marginBottom: 24 }}
        description={
          <div>
            <Title level={3} style={{ color: "#666", marginBottom: 12 }}>
              开始搜索政策
            </Title>
            <Paragraph
              style={{ color: "#999", fontSize: 16, marginBottom: 32 }}
            >
              输入关键词或选择筛选条件，发现适合您的政策机会
            </Paragraph>
          </div>
        }
      />

      <Card
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          color: "#fff",
        }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            🎯 智能政策匹配
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.9)" }}>
            基于AI技术，为您精准匹配最适合的政策项目
          </Text>
          <Button type="primary" size="large" ghost>
            立即体验
          </Button>
        </Space>
      </Card>
    </div>
  );

  const renderError = () => (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 120, marginBottom: 16 }}
        description={
          <div>
            <Title level={4} style={{ color: "#ff4d4f", marginBottom: 8 }}>
              搜索出现问题
            </Title>
            <Paragraph
              style={{ color: "#999", fontSize: 14, marginBottom: 24 }}
            >
              网络连接异常或服务暂时不可用
              <br />
              请检查网络连接后重试
            </Paragraph>
          </div>
        }
      />

      <Space>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          重新加载
        </Button>
        <Button onClick={() => window.location.reload()}>刷新页面</Button>
      </Space>
    </div>
  );

  switch (type) {
    case "no-search":
      return renderNoSearch();
    case "error":
      return renderError();
    default:
      return renderNoResults();
  }
};

export default EmptyStateOptimized;
