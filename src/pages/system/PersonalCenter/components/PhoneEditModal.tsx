/**
 * 修改手机号弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

interface PhoneEditModalProps {
  visible: boolean;
  form: FormInstance;
  loading: boolean;
  sendingCode: boolean;
  countdown: number;
  onClose: () => void;
  onSendCode: () => void;
  onSubmit: () => void;
}

const PhoneEditModal: React.FC<PhoneEditModalProps> = ({
  visible,
  form,
  loading,
  sendingCode,
  countdown,
  onClose,
  onSendCode,
  onSubmit,
}) => {
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="修改手机号"
      open={visible}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="新手机号"
          name="newPhone"
          rules={[
            { required: true, message: "请输入新手机号" },
            { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入新手机号"
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          label="短信验证码"
          name="code"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="请输入验证码"
              maxLength={6}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              onClick={onSendCode}
              loading={sendingCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}秒后重发` : "获取验证码"}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={onSubmit} loading={loading}>
              确认修改
            </Button>
            <Button onClick={handleClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhoneEditModal;
