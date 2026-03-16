/**
 * 用户表单弹窗组件
 * 创建时间: 2026-01-13
 * 功能: 提供新增/编辑用户的表单弹窗
 */

import React from "react";
import { Modal, Form, Input, Select, Row, Col, Button, Tooltip } from "antd";
import type { FormInstance } from "antd";
import type { User, UserFormData } from "../types/index.ts";

/**
 * 用户表单弹窗Props
 * 类型定义时间: 2026-01-13
 */
interface UserFormModalProps {
  visible: boolean;
  editingUser: User | null;
  form: FormInstance<UserFormData>;
  submittable: boolean;
  onOk: () => void;
  onCancel: () => void;
}

/**
 * 用户表单弹窗组件
 * 组件创建时间: 2026-01-13
 */
export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  editingUser,
  form,
  submittable,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={editingUser ? "编辑用户" : "新增用户"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Tooltip title={!submittable ? "请填写所有必填项" : ""} key="submit">
          <span style={{ display: "inline-block", marginLeft: 8 }}>
            <Button type="primary" onClick={onOk} disabled={!submittable}>
              OK
            </Button>
          </span>
        </Tooltip>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ status: "0" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="手机号 / 用户名"
              extra="请确保该用户已在系统中注册"
              rules={[
                { required: true, message: "请输入手机号或用户名" },
                { min: 2, max: 20, message: "长度为2-20个字符" },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ type: "email", message: "请输入正确的邮箱格式" }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="roles" label="角色" rules={[]}>
              <Select placeholder="请选择角色">
                <Select.Option value="admin">管理员</Select.Option>
                <Select.Option value="user">普通成员</Select.Option>
                <Select.Option value="enterprise_admin">
                  企业管理员
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="状态" rules={[]}>
              <Select>
                <Select.Option value="0">启用</Select.Option>
                <Select.Option value="1">禁用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
