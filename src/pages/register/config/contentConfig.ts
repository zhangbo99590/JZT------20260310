/**
 * 注册页面内容配置文件
 * 创建时间: 2026-01-13
 */

import type { FeatureItem } from "../types";

/**
 * 平台介绍配置
 * 配置更新时间: 2026-01-13
 */
export const platformInfo = {
  title: "璟智通",
  description:
    "一站式企业合规服务平台，为企业提供政策解读、法律咨询、产业对接、金融服务等全方位支持。",
};

/**
 * 功能特性列表
 * 配置更新时间: 2026-01-13
 */
export const features: FeatureItem[] = [
  {
    title: "政策中心",
    description: "实时政策推送",
  },
  {
    title: "法律护航",
    description: "专业法律咨询",
  },
  {
    title: "产业大厅",
    description: "资源精准对接",
  },
  {
    title: "金融服务",
    description: "融资一站解决",
  },
];

/**
 * 页面文案配置
 * 配置更新时间: 2026-01-13
 */
export const pageTexts = {
  header: {
    title: "注册账号",
    subtitle: "创建您的门户账号，享受企业服务",
  },
  inviteTip: "没有邀请码可跳过，注册后可在个人中心加入企业",
  agreement: {
    text: "我已阅读并同意",
    userAgreement: "《用户服务协议》",
    privacyPolicy: "《隐私政策》",
  },
  footer: {
    text: "已有账号？",
    linkText: "立即登录",
    linkUrl: "/login",
  },
  submitButton: "注 册",
};
