/**
 * 收藏列表项组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  List,
  Avatar,
  Tag,
  Space,
  Button,
  Checkbox,
  Tooltip,
  Popconfirm,
  Typography,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TagOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { FavoriteItem } from "../types/index.ts";
import { typeConfig, getAvatarBgColor } from "../config/typeConfig.tsx";

const { Text, Paragraph } = Typography;

interface FavoriteListItemProps {
  item: FavoriteItem;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onViewDetail: (item: FavoriteItem) => void;
  onRemove: (id: string) => void;
}

const FavoriteListItem: React.FC<FavoriteListItemProps> = ({
  item,
  isSelected,
  onSelect,
  onViewDetail,
  onRemove,
}) => {
  const config = typeConfig[item.type];

  // 格式化金额显示
  const formatAmount = (amount: number): string => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}亿元`;
    }
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}万元`;
    }
    return `${amount}元`;
  };

  return (
    <List.Item
      style={{
        backgroundColor: isSelected ? "#f0f8ff" : "white",
        border: isSelected ? "2px solid #1890ff" : "1px solid #f0f0f0",
        borderRadius: 8,
        marginBottom: 12,
        padding: "16px 20px",
      }}
      actions={[
        <Checkbox
          key="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
        />,
        <Tooltip key="view" title="查看详情">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(item)}
          />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="确定要取消收藏吗？"
          onConfirm={() => onRemove(item.id)}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="取消收藏">
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Tooltip>
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            icon={config.icon}
            style={{
              backgroundColor: getAvatarBgColor(item.type),
              width: 48,
              height: 48,
              fontSize: 20,
            }}
          />
        }
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#1890ff",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onClick={() => onViewDetail(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {item.title}
            </span>
            <Tag color={config.color} style={{ margin: 0, fontWeight: 500 }}>
              {config.label}
            </Tag>
            <Tag color="default" style={{ margin: 0 }}>
              {item.sourceModule}
            </Tag>
          </div>
        }
        description={
          <div>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{
                margin: "0 0 12px 0",
                color: "#666",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {item.description}
            </Paragraph>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 12,
              }}
            >
              <Space size={6}>
                <CalendarOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  收藏于 {item.addedDate}
                </Text>
              </Space>
              <Space size={6}>
                <TagOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {item.category}
                </Text>
              </Space>
              {item.amount && (
                <Space size={6}>
                  <DollarOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {formatAmount(item.amount)}
                  </Text>
                </Space>
              )}
            </div>

            {item.tags && (
              <div style={{ marginTop: 8 }}>
                {item.tags.map((tag) => (
                  <Tag
                    key={tag}
                    style={{ margin: "2px 6px 2px 0", fontSize: 12 }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        }
      />
    </List.Item>
  );
};

export default FavoriteListItem;
