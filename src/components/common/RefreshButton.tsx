/**
 * 数据刷新按钮组件
 * 创建时间: 2026-02-26
 * 功能: 提供数据刷新功能和自动刷新选项
 */

import React, { useState, useEffect } from "react";
import { Button, Dropdown, Space, Badge, Tooltip, message } from "antd";
import type { MenuProps } from "antd";
import {
  ReloadOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  loading?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // 秒
  size?: "small" | "middle" | "large";
  type?: "primary" | "default" | "text";
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  autoRefresh = false,
  refreshInterval = 30,
  size = "middle",
  type = "default",
}) => {
  const [isAutoRefresh, setIsAutoRefresh] = useState(autoRefresh);
  const [countdown, setCountdown] = useState(refreshInterval);

  // 手动刷新
  const handleManualRefresh = async () => {
    try {
      await onRefresh();
      message.success("数据已刷新");
      if (isAutoRefresh) {
        setCountdown(refreshInterval);
      }
    } catch (error) {
      message.error("刷新失败，请重试");
    }
  };

  // 切换自动刷新
  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
    if (!isAutoRefresh) {
      message.info(`已开启自动刷新，每${refreshInterval}秒更新一次`);
    } else {
      message.info("已关闭自动刷新");
    }
  };

  // 设置刷新间隔
  const setRefreshInterval = (interval: number) => {
    setCountdown(interval);
    if (isAutoRefresh) {
      message.info(`刷新间隔已设置为${interval}秒`);
    }
  };

  // 自动刷新逻辑
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (isAutoRefresh && !loading) {
      id = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onRefresh();
            return refreshInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isAutoRefresh, loading, refreshInterval, onRefresh]);

  const items: MenuProps["items"] = [
    {
      key: "toggle",
      onClick: toggleAutoRefresh,
      icon: isAutoRefresh ? <PauseOutlined /> : <PlayCircleOutlined />,
      label: isAutoRefresh ? "关闭自动刷新" : "开启自动刷新",
    },
    {
      type: "divider",
    },
    {
      key: "interval",
      label: "刷新间隔",
      icon: <ClockCircleOutlined />,
      children: [
        {
          key: "10",
          label: "10秒",
          onClick: () => setRefreshInterval(10),
        },
        {
          key: "30",
          label: "30秒",
          onClick: () => setRefreshInterval(30),
        },
        {
          key: "60",
          label: "1分钟",
          onClick: () => setRefreshInterval(60),
        },
        {
          key: "300",
          label: "5分钟",
          onClick: () => setRefreshInterval(300),
        },
      ],
    },
  ];

  const refreshButton = (
    <Button
      type={type}
      size={size}
      loading={loading}
      onClick={handleManualRefresh}
      icon={<ReloadOutlined />}
    >
      刷新
      {isAutoRefresh && !loading && (
        <span style={{ marginLeft: "4px", fontSize: "12px", opacity: 0.7 }}>
          ({countdown}s)
        </span>
      )}
    </Button>
  );

  return (
    <Space.Compact>
      {isAutoRefresh ? (
        <Badge dot color="green">
          <Tooltip title={`自动刷新已开启，${countdown}秒后更新`}>
            {refreshButton}
          </Tooltip>
        </Badge>
      ) : (
        <Tooltip title="点击刷新数据">{refreshButton}</Tooltip>
      )}
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
        <Button type={type} size={size} icon={<SettingOutlined />} />
      </Dropdown>
    </Space.Compact>
  );
};
