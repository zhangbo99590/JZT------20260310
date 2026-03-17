import React from "react";

/**
 * 面包屑导航配置
 * 定义所有页面的面包屑路径和标题
 */

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbConfig {
  [key: string]: BreadcrumbItem[];
}

// 面包屑配置映射
export const breadcrumbConfig: BreadcrumbConfig = {
  // 首页
  "/": [],

  // 政策中心模块
  "/policy-center": [{ title: "政策中心" }],
  "/policy-center/main": [
    { title: "政策中心", path: "/policy-center" },
    { title: "智慧政策" },
  ],
  "/policy-center/detail": [
    { title: "政策中心", path: "/policy-center" },
    { title: "智慧政策", path: "/policy-center/main" },
    { title: "政策详情" },
  ],
  "/policy-center/approved-list": [
    { title: "政策中心", path: "/policy-center" },
    { title: "获批名单" },
  ],

  // 申报管理模块（已迁移至政策中心下）- 2026-03-04
  "/application": [
    { title: "政策中心", path: "/policy-center" },
    { title: "我的申报" },
  ],
  "/application/detail": [
    { title: "政策中心", path: "/policy-center" },
    { title: "我的申报", path: "/application" },
    { title: "申报详情" },
  ],
  "/application/apply": [
    { title: "政策中心", path: "/policy-center" },
    { title: "我的申报", path: "/application" },
    { title: "申报向导" },
  ],
  "/application/success": [
    { title: "政策中心", path: "/policy-center" },
    { title: "我的申报", path: "/application" },
    { title: "提交成功" },
  ],

  // 法律护航模块
  "/legal-support": [{ title: "法律护航" }],
  "/legal-support/regulation-query": [
    { title: "法律护航", path: "/legal-support" },
    { title: "法规查询" },
  ],
  "/legal-support/regulation-detail": [
    { title: "法律护航", path: "/legal-support" },
    { title: "法规查询", path: "/legal-support/regulation-query" },
    { title: "法规详情" },
  ],
  "/legal-support/regulation-query/detail": [
    { title: "法律护航", path: "/legal-support" },
    { title: "法规查询", path: "/legal-support/regulation-query" },
    { title: "法规详情" },
  ],
  "/legal-support/ai-lawyer": [
    { title: "法律护航", path: "/legal-support" },
    { title: "AI法律顾问" },
  ],

  // 企服管理模块
  "/industry/service-match/workbench": [
    { title: "企服管理" },
    { title: "工作台" },
  ],
  "/industry/service-match/procurement-hall": [
    { title: "企服管理" },
    { title: "采购大厅" },
  ],
  "/industry/service-match/my-services": [
    { title: "企服管理" },
    { title: "我的服务" },
  ],
  "/industry/service-match/publish": [
    { title: "企服管理" },
    { title: "发布服务" },
  ],
  "/industry/service-match/detail": [
    { title: "企服管理" },
    { title: "服务详情" },
  ],
  "/industry/service-match/my-matches": [
    { title: "企服管理" },
    { title: "我的匹配" },
  ],
  "/industry/service-match/my-messages": [
    { title: "企服管理" },
    { title: "消息中心" },
  ],

  // 金融服务模块
  "/supply-chain-finance": [{ title: "金融服务" }],
  "/supply-chain-finance/financing-diagnosis": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "融资诊断" },
  ],
  "/supply-chain-finance/financing-diagnosis-result": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "融资诊断", path: "/supply-chain-finance/financing-diagnosis" },
    { title: "诊断结果" },
  ],
  "/supply-chain-finance/diagnosis-report": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "融资诊断", path: "/supply-chain-finance/financing-diagnosis" },
    { title: "诊断报告" },
  ],
  "/supply-chain-finance/financing-option-detail": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "融资方案详情" },
  ],
  "/supply-chain-finance/application-success": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "申请成功" },
  ],
  "/supply-chain-finance/diagnosis-analysis": [
    { title: "金融服务", path: "/supply-chain-finance" },
    { title: "诊断分析" },
  ],

  // 系统管理模块
  "/system": [{ title: "系统管理" }],
  "/system/users": [
    { title: "系统管理", path: "/system" },
    { title: "用户管理" },
  ],
  "/system/roles": [
    { title: "系统管理", path: "/system" },
    { title: "角色管理" },
  ],
  "/system/permissions": [
    { title: "系统管理", path: "/system" },
    { title: "权限管理" },
  ],
  "/system/personal-center": [
    { title: "系统管理", path: "/system" },
    { title: "个人中心" },
  ],
  "/system/company-management": [
    { title: "系统管理", path: "/system" },
    { title: "企业管理" },
  ],
  "/system/my-favorites": [
    { title: "系统管理", path: "/system" },
    { title: "我的收藏" },
  ],
};

/**
 * 根据当前路径获取面包屑配置
 * @param pathname 当前路径
 * @returns 面包屑项目数组
 */
export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  // 1. 精确匹配
  if (breadcrumbConfig[pathname]) {
    return breadcrumbConfig[pathname];
  }

  // 2. 动态路由匹配 (处理 :id 等参数)
  // 移除最后的 ID 部分 (假设 ID 不包含斜杠)
  const dynamicPatterns = [
    // 政策中心
    {
      pattern: /\/policy-center\/detail\/[^/]+$/,
      key: "/policy-center/detail",
    },

    // 申报管理
    { pattern: /\/application\/detail\/[^/]+$/, key: "/application/detail" },
    { pattern: /\/application\/apply\/[^/]+$/, key: "/application/apply" },
    { pattern: /\/application\/success\/[^/]+$/, key: "/application/success" },

    // 法律护航
    {
      pattern: /\/legal-support\/regulation-detail\/[^/]+$/,
      key: "/legal-support/regulation-detail",
    },
    {
      pattern: /\/legal-support\/regulation-query\/detail\/[^/]+$/,
      key: "/legal-support/regulation-query/detail",
    },

    // 企服管理
    {
      pattern: /\/industry\/service-match\/detail\/[^/]+$/,
      key: "/industry/service-match/detail",
    },

    // 金融服务
    {
      pattern: /\/supply-chain-finance\/financing-option-detail\/[^/]+$/,
      key: "/supply-chain-finance/financing-option-detail",
    },
  ];

  for (const { pattern, key } of dynamicPatterns) {
    if (pattern.test(pathname)) {
      return breadcrumbConfig[key] || [];
    }
  }

  // 3. 默认返回空数组或首页
  return [];
};
