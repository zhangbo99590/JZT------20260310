/**
 * 注册表单配置文件
 * 创建时间: 2026-01-13
 */

/**
 * 表单验证规则配置
 * 配置更新时间: 2026-01-13
 */
export const validationRules = {
  phone: [
    { required: true, message: "请输入手机号" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
  ],
  code: [
    { required: true, message: "请输入验证码" },
    { len: 6, message: "验证码长度为6位" },
  ],
  password: [
    { required: true, message: "请设置密码" },
    { min: 6, max: 20, message: "密码长度6-20个字符" },
  ],
  confirmPwd: [{ required: true, message: "请确认密码" }],
};

/**
 * 表单字段配置
 * 配置更新时间: 2026-01-13
 */
export const fieldConfig = {
  phone: {
    label: "手机号",
    placeholder: "请输入手机号",
    maxLength: 11,
  },
  code: {
    label: "验证码",
    placeholder: "请输入验证码",
    maxLength: 6,
  },
  password: {
    label: "设置密码",
    placeholder: "6-20位密码",
    maxLength: 20,
  },
  confirmPwd: {
    label: "确认密码",
    placeholder: "请再次输入密码",
    maxLength: 20,
  },
  nickName: {
    label: "昵称（选填）",
    placeholder: "请输入昵称",
    maxLength: 50,
  },
  inviteCode: {
    label: "企业邀请码（选填）",
    placeholder: "如有邀请码请输入，注册后自动加入企业",
    maxLength: 8,
  },
};

/**
 * 倒计时配置
 */
export const COUNTDOWN_SECONDS = 60;
