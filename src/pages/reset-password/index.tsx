/**
 * 重置密码主页面
 * 创建时间: 2026-01-13
 * 功能: 重置密码流程主入口页面
 */

import React, { useState } from "react";
import { Form, Steps, message } from "antd";
import { authService } from "../../services/authService";
import {
  PhoneVerificationStep,
  PasswordResetStep,
  CompletionStep,
} from "./components";
import { resetSteps } from "./config/stepConfig";
import { ResetStep } from "./types";
import type { ResetFormValues } from "./types";
import "./styles/reset-password.css";

/**
 * 重置密码主页面组件
 * 最后更新时间: 2026-01-13
 */
const ResetPassword: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ResetStep>(
    ResetStep.VERIFY_PHONE,
  );
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [form] = Form.useForm();

  /**
   * 处理步骤前进
   * 函数创建时间: 2026-01-13
   */
  const handleNextStep = () => {
    setCurrentStep(ResetStep.SET_PASSWORD);
  };

  /**
   * 处理步骤后退
   * 函数创建时间: 2026-01-13
   */
  const handlePreviousStep = () => {
    setCurrentStep(ResetStep.VERIFY_PHONE);
  };

  /**
   * 处理手机号变更
   * 函数创建时间: 2026-01-13
   */
  const handlePhoneChange = (phoneValue: string) => {
    setPhone(phoneValue);
  };

  /**
   * 重置密码处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleResetPassword = async (values: ResetFormValues) => {
    setLoading(true);
    try {
      await authService.resetPassword({
        phone: phone || values.phone,
        code: values.code,
        newPassword: values.newPassword,
      });

      setCurrentStep(ResetStep.COMPLETE);
    } catch (error: any) {
      message.error(error.message || "重置密码失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回登录处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: 500 }}>
        <div className="login-right" style={{ width: "100%" }}>
          <div className="login-header">
            <h2>重置密码</h2>
            <p>通过手机验证码重置您的登录密码</p>
          </div>

          {/* 步骤指示器  */}
          <Steps
            current={currentStep}
            items={resetSteps}
            style={{ marginBottom: 32 }}
          />

          {/* 手机验证步骤  */}
          {currentStep === ResetStep.VERIFY_PHONE && (
            <PhoneVerificationStep
              form={form}
              onNext={handleNextStep}
              onPhoneChange={handlePhoneChange}
            />
          )}

          {/* 密码重置步骤  */}
          {currentStep === ResetStep.SET_PASSWORD && (
            <PasswordResetStep
              form={form}
              loading={loading}
              onSubmit={handleResetPassword}
              onPrevious={handlePreviousStep}
            />
          )}

          {/* 完成步骤  */}
          {currentStep === ResetStep.COMPLETE && (
            <CompletionStep onBackToLogin={handleBackToLogin} />
          )}

          {/* 底部链接 */}
          {currentStep !== ResetStep.COMPLETE && (
            <div className="login-footer">
              想起密码了？<a href="/login">返回登录</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
