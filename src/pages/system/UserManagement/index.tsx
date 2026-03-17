/**
 * 用户管理页面主组件
 * 创建时间: 2026-01-13
 * 功能: 用户管理页面主入口，整合所有拆分的模块
 *
 * 权限控制更新: 2026-01-15
 * - 只有企业管理员（roleType === "0"）才能访问此页面
 * - 普通成员访问时显示 403 无权限页面
 */

import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import {
  SearchBar,
  UserTable,
  UserFormModal,
  UserDetailModal,
} from "./components/index.ts";
import { useUserManagement } from "./hooks/useUserManagement.ts";
import { useUserForm } from "./hooks/useUserForm.ts";
import type { User } from "./types/index.ts";

/**
 * 用户管理页面组件
 * 组件创建时间: 2026-01-13
 */
const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  // 权限检查：获取用户角色类型
  const isAdmin = useMemo(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // roleType === "0" 为企业管理员
        return userInfo.roleType === "0";
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  // 用户详情弹窗状态
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 用户数据管理
  const {
    users,
    loading,
    searchText,
    setSearchText,
    status,
    setStatus,
    pagination,
    loadUsers,
    handleSearch,
    handleTableChange,
    deleteUser,
    getUserDetail,
  } = useUserManagement();

  // 用户表单管理
  const {
    form,
    isModalVisible,
    editingUser,
    submittable,
    handleAdd,
    handleEdit,
    handleCancel,
    handleSubmit,
  } = useUserForm(loadUsers, setStatus);

  /**
   * 查看用户详情
   * 函数创建时间: 2026-01-13
   */
  const handleViewDetail = useCallback(
    async (record: User) => {
      const detailedUser = await getUserDetail(record.userId);
      setSelectedUser(detailedUser || record);
      setIsDetailModalVisible(true);
    },
    [getUserDetail],
  );

  /**
   * 删除用户
   * 函数创建时间: 2026-01-13
   */
  const handleDelete = useCallback(
    (record: User) => {
      deleteUser(record.userId);
    },
    [deleteUser],
  );

  /**
   * 关闭详情弹窗
   * 函数创建时间: 2026-01-13
   */
  const handleCloseDetail = useCallback(() => {
    setIsDetailModalVisible(false);
  }, []);

  // 权限检查：非企业管理员显示 403 页面
  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="权限不足"
        subTitle="只有企业管理员才能访问用户管理页面，如需访问请联系管理员授权。"
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            返回首页
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ background: "transparent" }}>
      {/* 搜索栏 */}
      <SearchBar
        searchText={searchText}
        status={status}
        onSearchTextChange={setSearchText}
        onStatusChange={setStatus}
        onSearch={handleSearch}
        onAdd={handleAdd}
      />

      {/* 用户表格 */}
      <UserTable
        users={users}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 新增/编辑用户弹窗 */}
      <UserFormModal
        visible={isModalVisible}
        editingUser={editingUser}
        form={form}
        submittable={submittable}
        onOk={handleSubmit}
        onCancel={handleCancel}
      />

      {/* 用户详情弹窗 */}
      <UserDetailModal
        visible={isDetailModalVisible}
        user={selectedUser}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default UserManagement;
