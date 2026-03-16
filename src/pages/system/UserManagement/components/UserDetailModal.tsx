/**
 * 用户详情弹窗组件
 * 创建时间: 2026-01-13
 * 功能: 展示用户详细信息的弹窗
 */

import React from "react";
import { Modal, Descriptions, Button } from "antd";
import type { User } from "../types/index.ts";
import { getStatusTag } from "../utils/statusUtils.tsx";

/**
 * 用户详情弹窗Props
 * 类型定义时间: 2026-01-13
 */
interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

/**
 * 用户详情弹窗组件
 * 组件创建时间: 2026-01-13
 */
export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  visible,
  user,
  onClose,
}) => {
  return (
    <Modal
      title="用户详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      width={600}
    >
      {user && (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="用户ID">{user.userId}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="角色">
            {user.roles?.map((role) => role.roleName).join(", ") || "无"}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {getStatusTag(user.status)}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {user.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="最后登录" span={2}>
            {user.lastLoginTime || "从未登录"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};
