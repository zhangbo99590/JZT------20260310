/**
 * UserManagement页面表格列配置
 * 创建时间: 2026-01-13
 * 功能: 定义用户管理表格的列配置
 */

import React from "react";
import { Space, Tag, Button, Popconfirm } from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { User } from "../types/index.ts";
import { getStatusTag } from "../utils/statusUtils.tsx";

/**
 * 表格操作回调类型
 * 类型定义时间: 2026-01-13
 */
interface TableActionHandlers {
  onViewDetail: (record: User) => void;
  onEdit: (record: User) => void;
  onDelete: (record: User) => void;
}

/**
 * 创建用户表格列配置
 * 函数创建时间: 2026-01-13
 */
export function createUserColumns(
  handlers: TableActionHandlers,
): ColumnsType<User> {
  return [
    {
      title: "用户ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
      align: "center",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 180,
      align: "center",
      render: (text: string, record: User) => (
        <Space size={4} style={{ whiteSpace: "nowrap" }}>
          <UserOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag style={{ margin: 0, fontSize: "11px", padding: "0 4px" }}>
            {record.userId}
          </Tag>
        </Space>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center",
    },
    {
      title: "角色",
      dataIndex: "roles",
      key: "roles",
      width: 150,
      align: "center",
      render: (roles: Array<{ roleName: string }>) => (
        <Space size={4}>
          {roles?.map((role, index) => (
            <Tag key={index}>{role.roleName}</Tag>
          )) || "无"}
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 160,
      align: "center",
      sorter: (a: User, b: User) => {
        const timeA = a.createTime ? new Date(a.createTime).getTime() : 0;
        const timeB = b.createTime ? new Date(b.createTime).getTime() : 0;
        return timeA - timeB;
      },
      sortDirections: ["descend", "ascend"],
      render: (createTime: string | number) => {
        if (!createTime) return "无";
        // 支持毫秒时间戳和字符串格式
        const timestamp =
          typeof createTime === "number"
            ? createTime
            : new Date(createTime).getTime();
        if (isNaN(timestamp)) return "无效日期";
        return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
      },
    },
    {
      title: "最后登录",
      dataIndex: "lastLoginTime",
      key: "lastLoginTime",
      width: 160,
      align: "center",
      sorter: (a: User, b: User) => {
        const timeA = a.lastLoginTime ? new Date(a.lastLoginTime).getTime() : 0;
        const timeB = b.lastLoginTime ? new Date(b.lastLoginTime).getTime() : 0;
        return timeA - timeB;
      },
      sortDirections: ["descend", "ascend"],
      render: (lastLoginTime?: string | number) => {
        if (!lastLoginTime) return "从未登录";
        // 支持毫秒时间戳和字符串格式
        const timestamp =
          typeof lastLoginTime === "number"
            ? lastLoginTime
            : new Date(lastLoginTime).getTime();
        if (isNaN(timestamp)) return "从未登录";
        return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
      },
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      align: "center",
      render: (_: unknown, record: User) => {
        // 空值保护：新接口可能未返回 roles 字段
        const isSuperAdmin =
          record.roles?.some((role) => role.roleName === "超级管理员") ?? false;
        return (
          <Space size={8}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handlers.onViewDetail(record)}
              size="small"
            >
              详情
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handlers.onEdit(record)}
              size="small"
            >
              编辑
            </Button>
            {isSuperAdmin ? (
              <Button
                type="link"
                disabled
                icon={<DeleteOutlined />}
                size="small"
              >
                删除
              </Button>
            ) : (
              <Popconfirm
                title="确定要删除这个用户吗？"
                onConfirm={() => handlers.onDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];
}
