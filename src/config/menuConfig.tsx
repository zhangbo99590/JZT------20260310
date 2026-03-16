import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyOutlined,
  BookOutlined,
  BankOutlined,
  DollarOutlined,
  FundOutlined,
  AppstoreOutlined,
  HeartOutlined,
  RobotOutlined,
  FormOutlined,
  ContainerOutlined,
  ReadOutlined,
  ScheduleOutlined,
  PieChartOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

/**
 * 菜单配置模块
 *
 * @file menuConfig.tsx
 * @desc 系统侧边栏菜单配置，包括菜单项生成、路由映射和菜单状态管理
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 根据用户角色类型生成菜单项
 * 2. 提供路由与菜单键的映射配置
 * 3. 计算默认展开的菜单项
 * 4. 计算当前路由对应的选中菜单项
 *
 * --- 技术要点 ---
 * - 使用 Ant Design Menu 组件的类型定义
 * - 支持角色权限控制（管理员和普通用户）
 * - 路由前缀匹配实现菜单自动选中
 * - 多级菜单结构支持
 * - 图标使用 @ant-design/icons
 *
 * @note 管理员角色类型为 "0"，普通用户为其他值
 * @warning 修改菜单结构时需同步更新 routeMenuMap 和 parentMenuPaths
 */

/**
 * 获取菜单项配置
 *
 * @param roleType - 用户角色类型，"0"为管理员
 * @returns 菜单项配置数组
 *
 * @description
 * 根据用户角色类型生成对应的菜单配置，管理员可见用户管理页面，
 * 普通用户不可见。菜单包含首页、政策中心、法律护航、企服管理、
 * 金融服务和系统管理六大模块。
 */
export function getMenuItems(roleType?: string): MenuProps["items"] {
  const isAdmin = roleType === "0";

  const systemChildren: MenuProps["items"] = [
    ...(isAdmin
      ? [
          {
            key: "/system/users",
            icon: <UserOutlined />,
            label: "用户管理",
          },
        ]
      : []),
    {
      key: "/system/personal-center",
      icon: <UserOutlined />,
      label: "个人中心",
    },
    {
      key: "/system/my-favorites",
      icon: <HeartOutlined />,
      label: "我的收藏",
    },
    {
      key: "/system/company-management",
      icon: <BankOutlined />,
      label: "企业管理",
    },
  ];

  return [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "首页",
    },
    {
      key: "/policy-center",
      icon: <BookOutlined />,
      label: "政策中心",
      children: [
        {
          key: "/policy-center/main",
          icon: <BookOutlined />,
          label: "智慧政策",
        },
        {
          key: "/application?view=list",
          icon: <FormOutlined />,
          label: "申报管理",
        },
        {
          key: "/application?view=status",
          icon: <ContainerOutlined />,
          label: "我的申报",
        },
      ],
    },
    {
      key: "/legal-support",
      icon: <BankOutlined />,
      label: "法律护航",
      children: [
        {
          key: "/legal-support/ai-lawyer",
          icon: <RobotOutlined />,
          label: "AI 问答",
        },
        {
          key: "/legal-support/regulation-query",
          icon: <SafetyOutlined />,
          label: "法规查询",
        },
        {
          key: "/legal-support/regulation-detail/civil-code-2020",
          icon: <ReadOutlined />,
          label: "法规详情",
        },
      ],
    },
    {
      key: "/industry/service-match",
      icon: <AppstoreOutlined />,
      label: "产业管理",
      children: [
        {
          key: "/industry/service-match/workbench",
          icon: <AppstoreOutlined />,
          label: "业务大厅",
        },
        {
          key: "/industry/service-match/procurement-hall",
          icon: <DollarOutlined />,
          label: "采购大厅",
        },
        {
          key: "/industry/service-match/my-services",
          icon: <ScheduleOutlined />,
          label: "我的业务管理",
        },
      ],
    },
    {
      key: "/supply-chain-finance",
      icon: <DollarOutlined />,
      label: "金融服务",
      children: [
        {
          key: "/supply-chain-finance/financing-diagnosis",
          icon: <FundOutlined />,
          label: "融资诊断",
        },
        {
          key: "/supply-chain-finance/diagnosis-report",
          icon: <PieChartOutlined />,
          label: "诊断分析报告",
        },
      ],
    },
    {
      key: "/system",
      icon: <SettingOutlined />,
      label: "系统管理",
      children: systemChildren,
    },
  ];
}

export const menuItems: MenuProps["items"] = getMenuItems("0");

/**
 * 路由与菜单键映射配置
 *
 * @description
 * 用于将页面路径映射到对应的菜单项键值，实现菜单选中状态和高亮显示。
 * 格式：路由路径 -> 菜单键值
 *
 * @note 添加新路由时需在此配置中添加对应的映射关系
 */
export const routeMenuMap: Record<string, string> = {
  // 首页路由映射
  "/": "/",

  // 政策中心模块路由映射（包含迁移后的申报管理子模块）
  "/policy-center": "/policy-center/main",
  "/policy-center/main": "/policy-center/main", // 政策查询主页面
  "/policy-center/detail": "/policy-center/main", // 政策详情页面
  "/policy-center/approved-list": "/policy-center/main", // 已通过政策列表
  "/policy-center/my-applications": "/application?view=status", // 我的申请

  // 申报管理模块路由映射（已迁移至政策中心下）- 2026-03-03
  "/application": "/application?view=list", // 项目列表页面
  "/application/detail": "/application?view=status", // 申报详情页面
  "/application/apply": "/application?view=list", // 申报申请页面
  "/application/success": "/application?view=status", // 申报成功页面

  // 法律护航模块路由映射
  "/legal-support": "/legal-support/ai-lawyer",
  "/legal-support/regulation-query": "/legal-support/regulation-query", // 法规查询页面
  "/legal-support/regulation-detail": "/legal-support/regulation-detail/civil-code-2020", // 法规详情页面
  "/legal-support/ai-lawyer": "/legal-support/ai-lawyer", // AI律师页面

  // 产业管理模块路由映射
  "/industry/service-match": "/industry/service-match/workbench",
  "/industry/service-match/workbench": "/industry/service-match/workbench", // 业务大厅
  "/industry/service-match/procurement-hall": "/industry/service-match/procurement-hall", // 采购大厅
  "/industry/service-match/my-services": "/industry/service-match/my-services", // 我的业务管理
  "/industry/service-match/publish": "/industry/service-match/my-services", // 发布业务
  "/industry/service-match/detail": "/industry/service-match/procurement-hall", // 业务详情
  "/industry/service-match/my-matches": "/industry/service-match/my-services", // 我的匹配
  "/industry/service-match/my-messages": "/industry/service-match/my-services", // 我的消息

  // 金融服务模块路由映射
  "/supply-chain-finance": "/supply-chain-finance/financing-diagnosis",
  "/supply-chain-finance/financing-diagnosis": "/supply-chain-finance/financing-diagnosis", // 融资诊断页面
  "/supply-chain-finance/financing-diagnosis-result": "/supply-chain-finance/diagnosis-report", // 诊断结果
  "/supply-chain-finance/diagnosis-report": "/supply-chain-finance/diagnosis-report", // 诊断报告页面
  "/supply-chain-finance/financing-option-detail": "/supply-chain-finance/financing-diagnosis", // 融资方案详情
  "/supply-chain-finance/application-success": "/supply-chain-finance/financing-diagnosis", // 申请成功
  "/supply-chain-finance/diagnosis-analysis": "/supply-chain-finance/diagnosis-report", // 诊断分析

  // 系统管理模块路由映射
  "/system": "/system/personal-center",
  "/system/users": "/system/users", // 用户管理页面
  "/system/personal-center": "/system/personal-center", // 个人中心页面
  "/system/my-favorites": "/system/my-favorites", // 我的收藏页面
  "/system/company-management": "/system/company-management", // 企业管理页面
};

/**
 * 父级菜单路径列表
 *
 * @description
 * 包含所有具有子菜单的父级菜单路径，用于计算默认展开的菜单项。
 *
 * @note 添加新的多级菜单时需在此数组中添加对应的父路径
 */
export const parentMenuPaths = [
  "/policy-center",
  "/legal-support",
  "/industry/service-match",
  "/supply-chain-finance",
  "/system",
];

/**
 * 获取默认展开的菜单键值
 *
 * @param pathname - 当前路由路径
 * @returns 应该展开的菜单键值数组
 *
 * @description
 * 根据当前路由路径，判断应该展开哪个父级菜单。如果路由以某个父级菜单路径开头，
 * 则返回该父级菜单的键值，使其展开状态。按照最长匹配优先的原则。
 *
 * @example
 * // 输入："/policy-center/main"
 * // 返回：["/policy-center"]
 *
 * // 输入："/industry/service-match/workbench"
 * // 返回：["/industry/service-match"]
 */
export function getDefaultOpenKeys(pathname: string): string[] {
  // 按路径长度降序排列，确保最长匹配优先
  const sortedPaths = [...parentMenuPaths].sort((a, b) => b.length - a.length);
  
  for (const parentPath of sortedPaths) {
    if (pathname.startsWith(parentPath)) {
      return [parentPath];
    }
  }
  
  // 特殊处理：如果是根路径，不展开任何菜单
  if (pathname === "/") {
    return [];
  }
  
  return [];
}

/**
 * 获取选中的菜单键值
 *
 * @param pathname - 当前路由路径
 * @returns 选中的菜单键值数组
 *
 * @description
 * 根据当前路由路径，计算应该高亮的菜单项。优先使用 routeMenuMap 中的精确匹配，
 * 支持动态路由参数和查询参数的处理，如果没有匹配则根据路由前缀匹配对应的父级菜单。
 *
 * @example
 * // 输入："/policy-center/detail/123"
 * // 返回：["/policy-center/main"]
 *
 * // 输入："/application?view=status"
 * // 返回：["/application?view=status"]
 */
export function getSelectedKeys(pathname: string): string[] {
  // 处理查询参数
  const fullPath = window.location.pathname + window.location.search;
  
  // 首先尝试完整路径匹配（包含查询参数）
  if (routeMenuMap[fullPath]) {
    return [routeMenuMap[fullPath]];
  }
  
  // 精确路径匹配
  if (routeMenuMap[pathname]) {
    return [routeMenuMap[pathname]];
  }
  
  // 动态路由匹配 - 按最长匹配优先
  const sortedRoutes = Object.keys(routeMenuMap).sort((a, b) => b.length - a.length);
  
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return [routeMenuMap[route]];
    }
  }
  
  // 处理特殊的查询参数路由
  if (pathname === "/application") {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get("view");
    
    switch (view) {
      case "list":
        return ["/application?view=list"];
      case "status":
        return ["/application?view=status"];
      case "statistics":
        return ["/application?view=statistics"];
      default:
        return ["/application?view=list"];
    }
  }
  
  // 模块级别的回退匹配
  const moduleMatches = [
    { prefix: "/application", defaultKey: "/application?view=list" }, // 申报管理已迁移至政策中心，但路由保持不变
    { prefix: "/policy-center", defaultKey: "/policy-center/main" },
    { prefix: "/legal-support", defaultKey: "/legal-support/ai-lawyer" },
    { prefix: "/industry/service-match", defaultKey: "/industry/service-match/workbench" },
    { prefix: "/supply-chain-finance", defaultKey: "/supply-chain-finance/financing-diagnosis" },
    { prefix: "/system", defaultKey: "/system/personal-center" },
  ];
  
  for (const { prefix, defaultKey } of moduleMatches) {
    if (pathname.startsWith(prefix)) {
      return [defaultKey];
    }
  }
  
  // 默认返回首页
  return ["/"];
}
