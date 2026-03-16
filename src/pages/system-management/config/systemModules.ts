/**
 * 系统管理模块配置文件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { UserOutlined, SafetyOutlined, KeyOutlined } from "@ant-design/icons";

export interface SystemModule {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  path: string;
  features: string[];
  color: string;
}

/**
 * 系统管理模块配置
 * 集中管理所有系统管理相关的模块信息
 */
export const systemModules: SystemModule[] = [
  {
    icon: UserOutlined,
    title: "用户管理",
    description: "管理系统用户信息，包括用户的创建、编辑、删除和权限分配",
    path: "/system/users",
    features: ["用户信息管理", "角色分配", "状态控制", "登录记录"],
    color: "#1890ff",
  },
  // {
  //   icon: SafetyOutlined,
  //   title: "角色管理",
  //   description: "配置系统角色和权限，定义不同角色的访问范围和操作权限",
  //   path: "/system/roles",
  //   features: ["角色定义", "权限分配", "用户关联", "角色继承"],
  //   color: "#722ed1",
  // },
  // {
  //   icon: KeyOutlined,
  //   title: "权限管理",
  //   description: "设置系统功能权限，控制用户对不同功能模块的访问权限",
  //   path: "/system/permissions",
  //   features: ["权限定义", "菜单权限", "按钮权限", "API权限"],
  //   color: "#fa8c16",
  // },
  {
    icon: UserOutlined,
    title: "个人中心",
    description: "管理个人信息、查看操作日志、设置个性化偏好",
    path: "/system/personal-center",
    features: ["个人信息管理", "操作日志查询", "页面布局设置", "通知提醒设置"],
    color: "#52c41a",
  },
];
