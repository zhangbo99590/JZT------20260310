/**
 * UserManagement页面表单管理Hook
 * 创建时间: 2026-01-13
 * 功能: 管理用户表单的状态和提交逻辑
 */

import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { userService } from "../../../../services/userService";
import { apiClient } from "../../../../services/apiClient";
import type { User, UserFormData } from "../types/index.ts";

/**
 * 用户表单管理Hook
 * Hook创建时间: 2026-01-13
 */
export function useUserForm(
  onSuccess: () => void,
  setStatus?: (status: string | undefined) => void,
) {
  const [form] = Form.useForm<UserFormData>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submittable, setSubmittable] = useState(false);

  // 监听表单值变化，更新提交按钮状态
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setSubmittable(true),
      () => setSubmittable(false),
    );
  }, [values, form]);

  /**
   * 打开新增用户弹窗
   * 函数创建时间: 2026-01-13
   */
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  /**
   * 打开编辑用户弹窗
   * 函数创建时间: 2026-01-13
   */
  const handleEdit = (record: User) => {
    setEditingUser(record);

    // 角色映射：取第一个角色名称
    const mappedRecord = {
      username: record.username || "",
      email: record.email || "",
      roles: record.roles?.[0]?.roleName || "user", // 取第一个角色
      status: record.status || "0",
    };

    form.setFieldsValue(mappedRecord as unknown as UserFormData);
    setIsModalVisible(true);
  };

  /**
   * 关闭弹窗
   * 函数创建时间: 2026-01-13
   */
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  /**
   * 提交表单
   * 函数创建时间: 2026-01-13
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 状态映射：前端表单的 "ENABLE"/"DISABLE" 映射到后端需要的 "0"/"1" (0启用 1禁用)
      // 角色映射：将角色字符串映射为 roleIds，0 为管理员，1 为普通成员
      const mappedValues: Partial<User> = {
        username: values.username,
        nickname: values.username, // 默认昵称等于用户名
        email: values.email,
        phone: values.username, // 暂时用用户名填充手机号，或者也可以单独添加手机号字段
        status: values.status, // 现在表单直接使用 "0" 或 "1"
        roleIds: [
          values.roles === "enterprise_admin" || values.roles === "admin"
            ? 0
            : 1,
        ],
      };

      if (editingUser) {
        await userService.updateUser(editingUser.userId, mappedValues);
        message.success("编辑成功");
      } else {
        await userService.createUser(mappedValues);
        message.success("新增成功");
      }

      // 清除成员列表缓存，确保列表获取最新数据
      apiClient.clearCache("/qgb/portal/enterprise/members");

      setIsModalVisible(false);
      form.resetFields();

      // 稍微延迟刷新，给后端数据库一点同步时间
      setTimeout(() => {
        // 如果用户被禁用，先切换筛选条件到"全部状态"，再刷新列表
        if (editingUser && values.status === "1" && setStatus) {
          setStatus(undefined); // undefined 表示"全部状态"
        }
        // 等待 React 状态更新后再刷新列表
        setTimeout(() => {
          onSuccess();
        }, 100);
      }, 500);
    } catch (error: any) {
      console.error("Failed to save user:", error);
      const errorMsg = error?.message || error?.msg || "保存用户失败";
      message.error(errorMsg);
    }
  };

  return {
    form,
    isModalVisible,
    editingUser,
    submittable,
    handleAdd,
    handleEdit,
    handleCancel,
    handleSubmit,
  };
}
