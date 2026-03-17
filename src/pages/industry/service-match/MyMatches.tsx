import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Tag,
  Button,
  Typography,
  Space,
  Skeleton,
  Dropdown,
  message,
  Alert,
  Empty,
} from "antd";
import {
  EnvironmentOutlined,
  TagsOutlined,
  DownOutlined,
  MessageOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { THEME, COMMON_STYLES } from "./styles";

const { Title, Text, Paragraph } = Typography;

// Mock Data
const MOCK_MATCHES = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name:
    i % 4 === 0
      ? "*****科技有限公司"
      : [
          "上海微电子装备有限公司",
          "北京字节跳动科技有限公司",
          "深圳大疆创新科技有限公司",
          "杭州海康威视数字技术股份有限公司",
        ][i % 4],
  isMasked: i % 4 === 0,
  advantageTags: i % 3 === 0 ? ["全国首家"] : i % 3 === 1 ? ["行业龙头"] : [],
  matchScore: 90 - i * 2,
  tags: ["人工智能", "高端制造", "企业服务"],
  businessScope: [
    "芯片研发, 封装测试",
    "短视频算法, 内容分发",
    "无人机飞控, 影像系统",
    "安防监控, 视频分析",
  ][i % 4],
  region: ["上海", "北京", "深圳", "杭州"][i % 4],
  content:
    "寻求企业数字化转型解决方案，重点关注供应链管理与数据分析模块，预算充裕，期望有成熟案例的服务商...",
  status: i % 3 === 0 ? "new" : i % 3 === 1 ? "contacted" : "cooperating",
}));

const MyMatches: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(MOCK_MATCHES);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id: number, status: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    message.success("状态已更新");
  };

  const getStatusLabel = (status: string) => {
    const map: any = {
      new: "未联系",
      contacted: "已联系",
      cooperating: "合作中",
      rejected: "不合适",
    };
    return map[status];
  };

  const renderStatusButton = (item: any) => {
    const items = [
      { key: "new", label: "未联系" },
      { key: "contacted", label: "已联系" },
      { key: "cooperating", label: "合作中" },
      { key: "rejected", label: "不合适" },
    ];

    return (
      <Dropdown
        menu={{
          items,
          onClick: ({ key }) => handleStatusChange(item.id, key),
        }}
      >
        <Button size="small">
          {getStatusLabel(item.status)} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  return (
    <div style={COMMON_STYLES.pageContainer}>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {/* Header */}
        <div>
          <Title level={4} style={{ margin: 0, ...COMMON_STYLES.title }}>
            我的匹配
          </Title>
          <Alert
            message="匹配规则：基于您的企业画像与发布内容，系统每日24:00自动更新匹配结果，请及时处理。"
            type="info"
            showIcon
            style={{ marginTop: "12px", fontSize: "12px" }}
          />
        </div>

        {/* List */}
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={loading ? Array.from({ length: 3 }) : data}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text type="secondary">暂无匹配结果</Text>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        建议您完善企业画像或更新发布内容以获得更精准的匹配
                      </Text>
                    </div>
                  </div>
                }
              >
                <Button
                  type="primary"
                  onClick={() => navigate("/industry/service-match/publish")}
                >
                  去完善信息
                </Button>
              </Empty>
            ),
          }}
          renderItem={(item: any) => (
            <List.Item>
              {loading ? (
                <Card style={{ borderRadius: THEME.borderRadius }}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </Card>
              ) : (
                <Card
                  hoverable
                  style={{ ...COMMON_STYLES.card, padding: "15px" }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Left: Info */}
                    <div style={{ flex: 1, marginRight: "24px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.advantageTags &&
                          item.advantageTags.map((tag: string) => (
                            <Tag key={tag} style={COMMON_STYLES.advantageTag}>
                              {tag}
                            </Tag>
                          ))}
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            color: THEME.textTitle,
                          }}
                        >
                          {item.name}
                        </Title>
                        <Tag
                          color="#E63946"
                          style={{
                            marginLeft: "12px",
                            borderRadius: "2px",
                            border: "none",
                          }}
                        >
                          匹配度 {item.matchScore}%
                        </Tag>
                      </div>

                      <Space
                        size={16}
                        style={{
                          marginBottom: "12px",
                          fontSize: "12px",
                          color: THEME.textBody,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <Text strong style={{ marginRight: "4px" }}>
                            业务合作：
                          </Text>
                          {item.businessScope}
                        </span>
                      </Space>

                      <Space
                        size={16}
                        style={{
                          marginBottom: "12px",
                          fontSize: "12px",
                          color: THEME.textBody,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <TagsOutlined style={{ marginRight: "4px" }} />
                          主营：{item.tags.join(" | ")}
                        </span>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <EnvironmentOutlined style={{ marginRight: "4px" }} />
                          {item.region}
                        </span>
                      </Space>

                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                          color: THEME.textBody,
                          fontSize: "14px",
                          marginBottom: 0,
                        }}
                      >
                        <Text strong style={{ color: THEME.primary }}>
                          核心需求：
                        </Text>
                        {item.content}
                      </Paragraph>
                    </div>

                    {/* Right: Actions */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        minWidth: "100px",
                      }}
                    >
                      <Button
                        type="primary"
                        ghost
                        icon={<EyeOutlined />}
                        onClick={() =>
                          navigate(`/industry/service-match/detail/${item.id}`)
                        }
                      >
                        查看详情
                      </Button>
                      <Button
                        icon={<MessageOutlined />}
                        onClick={() =>
                          navigate("/industry/service-match/messages")
                        }
                      >
                        发私信
                      </Button>
                      {renderStatusButton(item)}
                    </div>
                  </div>
                </Card>
              )}
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
};

export default MyMatches;
