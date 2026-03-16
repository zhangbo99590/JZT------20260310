/**
 * 修改昵称弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";

interface NicknameEditModalProps {
  visible: boolean;
  form: FormInstance;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const NicknameEditModal: React.FC<NicknameEditModalProps> = ({
  visible,
  form,
  loading,
  onClose,
  onSubmit,
}) => {
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal title="修改昵称" open={visible} onCancel={handleClose} footer={null}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="新昵称"
          name="nickName"
          rules={[
            { required: true, message: "请输入昵称" },
            { min: 2, max: 20, message: "昵称长度为2-20个字符" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入新昵称（2-20字符）"
            maxLength={20}
          />
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

export default NicknameEditModal;
