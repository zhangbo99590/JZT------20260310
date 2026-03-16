/**
 * 完成步骤组件
 * 创建时间: 2026-01-13
 * 功能: 显示重置密码完成状态和返回登录
 */

import React from "react";
import { Button, Result } from "antd";

interface CompletionStepProps {
  onBackToLogin: () => void;
}

/**
 * 完成步骤组件
 * 组件创建时间: 2026-01-13
 */
const CompletionStep: React.FC<CompletionStepProps> = ({ onBackToLogin }) => {
  return (
    <Result
      status="success"
      title="密码重置成功"
      subTitle="您的密码已成功重置，请使用新密码登录"
      extra={[
        <Button type="primary" key="login" onClick={onBackToLogin} size="large">
          返回登录
        </Button>,
      ]}
    />
  );
};

export default CompletionStep;
