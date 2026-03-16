/**
 * 重置密码页面类型定义文件
 * 创建时间: 2026-01-13
 */

/**
 * 重置密码表单数据接口
 */
export interface ResetFormValues {
  phone: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 步骤配置接口
 */
export interface StepConfig {
  title: string;
  icon: React.ReactNode;
}

/**
 * 重置密码步骤枚举
 */
export enum ResetStep {
  VERIFY_PHONE = 0,
  SET_PASSWORD = 1,
  COMPLETE = 2,
}
