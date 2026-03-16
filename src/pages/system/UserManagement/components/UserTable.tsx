/**
 * 用户数据表格组件
 * 创建时间: 2026-01-13
 * 功能: 展示用户列表数据的表格
 */

import React, { useMemo } from "react";
import { Card, Table } from "antd";
import type { User, PaginationState } from "../types/index.ts";
import { createUserColumns } from "../config/tableColumns.tsx";

/**
 * 用户表格组件Props
 * 类型定义时间: 2026-01-13
 */
interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: PaginationState;
  onTableChange: (pagination: { current?: number; pageSize?: number }) => void;
  onViewDetail: (record: User) => void;
  onEdit: (record: User) => void;
  onDelete: (record: User) => void;
}

/**
 * 用户表格组件
 * 组件创建时间: 2026-01-13
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  pagination,
  onTableChange,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  // 使用 useMemo 缓存列配置
  const columns = useMemo(
    () =>
      createUserColumns({
        onViewDetail,
        onEdit,
        onDelete,
      }),
    [onViewDetail, onEdit, onDelete]
  );

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
        loading={loading}
        onChange={onTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        locale={{ emptyText: "暂无匹配的用户信息，请调整搜索条件" }}
      />
    </Card>
  );
};
