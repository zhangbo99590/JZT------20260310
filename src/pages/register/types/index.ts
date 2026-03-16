/**
 * 注册页面类型定义文件
 * 创建时间: 2026-01-13
 */

/**
 * 注册表单数据接口
 */
export interface RegisterFormValues {
  phone: string;
  code: string;
  password: string;
  confirmPwd: string;
  nickName?: string;
  inviteCode?: string;
  agreement: boolean;
}

/**
 * 功能特性接口
 */
export interface FeatureItem {
  title: string;
  description: string;
}
