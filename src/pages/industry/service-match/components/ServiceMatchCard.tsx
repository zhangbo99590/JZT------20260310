import React, { useState } from "react";
import {
  Card,
  Tag,
  Button,
  Typography,
  Tooltip,
  Rate,
  Checkbox,
  Space,
} from "antd";
import {
  ThunderboltOutlined,
  HeartOutlined,
  StarFilled,
  TagsOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "../styles";

const { Title, Text, Paragraph } = Typography;

interface ServiceMatchCardProps {
  item: any;
  isSelected: boolean;
  isComparing: boolean;
  activeTab: string; // 'business' or 'procurement'
  onSelect: (id: string, checked: boolean) => void;
  onCompare: (item: any) => void;
  onConnect: (item: any) => void;
  navigate: any;
}

const ServiceMatchCard: React.FC<ServiceMatchCardProps> = ({
  item,
  isSelected,
  isComparing,
  activeTab,
  onSelect,
  onCompare,
  onConnect,
  navigate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showConnect = isHovered || item.matchDegree >= 80;

  return (
    <Card
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...COMMON_STYLES.card,
        border: item.score >= 4 ? "1px solid #faad14" : "none",
        marginBottom: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
      }}
      bodyStyle={{ padding: "20px 20px 20px 50px" }}
      onClick={() => navigate(`/industry/service-match/detail/${item.id}`)}
    >
      {/* Selection Checkbox */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "15px",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
        />
      </div>

      {/* Quality Score */}
      <div
        style={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
      >
        <Tooltip title={`质量评分: ${item.score}星`}>
          <Rate
            disabled
            defaultValue={item.score}
            character={<StarFilled style={{ fontSize: "14px" }} />}
            style={{
              color: item.score >= 4 ? "#faad14" : "#ccc",
              fontSize: "14px",
            }}
          />
        </Tooltip>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Header Line: Tags + Name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              paddingRight: "100px",
            }}
          >
            {item.isRecommend && <Tag color="red">推荐</Tag>}
            {item.advantageTags &&
              item.advantageTags.map((tag: string) => (
                <Tag key={tag} style={COMMON_STYLES.advantageTag}>
                  {tag}
                </Tag>
              ))}
            <Title
              level={5}
              style={{ margin: 0, fontSize: "16px", color: THEME.textTitle }}
            >
              {item.name}
            </Title>
            <Text
              style={{
                marginLeft: "12px",
                fontSize: "12px",
                color: THEME.textHint,
              }}
            >
              {item.updateTime}
            </Text>
          </div>

          {/* Scope / Requirement Detail */}
          <div
            style={{
              backgroundColor: "#F9F9F9",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, fontSize: "14px", color: THEME.textBody }}
            >
              <Text strong style={{ color: THEME.primary }}>
                {activeTab === "business" ? "业务供给：" : "采购需求："}
              </Text>
              {item.scope}
            </Paragraph>
            {activeTab === "procurement" && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: THEME.textBody,
                  display: "flex",
                  gap: "16px",
                }}
              >
                <span>
                  预算：<Text strong>{item.budget}</Text>
                </span>
                <span>
                  数量：<Text strong>{item.quantity}</Text>
                </span>
                <span>
                  截止：<Text type="danger">{item.deadline}</Text>
                </span>
              </div>
            )}
          </div>

          {/* Footer Line: Tags + Region + Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space
              size={16}
              style={{ fontSize: "12px", color: THEME.textBody }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <TagsOutlined style={{ marginRight: "4px" }} />
                {item.tags.join(" | ")}
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                <EnvironmentOutlined style={{ marginRight: "4px" }} />
                {item.region}
              </span>
            </Space>

            {/* Hover Actions */}
            <Space size={8} onClick={(e) => e.stopPropagation()}>
              <Button
                type="link"
                size="small"
                icon={<ThunderboltOutlined />}
                onClick={() => onConnect(item)}
                style={{
                  opacity: showConnect ? 1 : 0,
                  pointerEvents: showConnect ? "auto" : "none",
                  transition: "opacity 0.2s",
                  color: THEME.primary,
                  fontWeight: 500,
                }}
              >
                立即对接
              </Button>
              <Button type="text" size="small" icon={<HeartOutlined />} />
              <Checkbox checked={isComparing} onChange={() => onCompare(item)}>
                对比
              </Checkbox>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceMatchCard;
