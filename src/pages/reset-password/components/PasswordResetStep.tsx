/**
 * 密码重置步骤组件
 * 创建时间: 2026-01-13
 * 功能: 处理新密码设置和确认
 */

import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { validationRules } from "../config/stepConfig";
import type { FormInstance } from "antd";
import type { ResetFormValues } from "../types";

interface PasswordResetStepProps {
  form: FormInstance;
  loading: boolean;
  onSubmit: (values: ResetFormValues) => void;
  onPrevious: () => void;
}

/**
 * 密码重置步骤组件
 * 组件创建时间: 2026-01-13
 */
const PasswordResetStep: React.FC<PasswordResetStepProps> = ({
  form,
  loading,
  onSubmit,
  onPrevious,
}) => {
  /**
   * 确认密码验证规则
   * 规则创建时间: 2026-01-13
   */
  const confirmPasswordRules = [
    ...validationRules.confirmPassword,
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue("newPassword") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("两次输入的密码不一致"));
      },
    }),
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
    >
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={validationRules.newPassword}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入新密码（6-20位）"
          maxLength={20}
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认新密码"
        dependencies={["newPassword"]}
        rules={confirmPasswordRules}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请再次输入新密码"
          maxLength={20}
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          确认重置
        </Button>
      </Form.Item>

      <Form.Item>
        <Button onClick={onPrevious} block size="large">
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordResetStep;
