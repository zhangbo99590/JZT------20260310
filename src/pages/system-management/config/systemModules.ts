/**
 * 系统管理模块配置文件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { UserOutlined } from "@ant-design/icons";

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
  {
    icon: UserOutlined,
    title: "个人中心",
    description: "管理个人信息、查看操作日志、设置个性化偏好",
    path: "/system/personal-center",
    features: ["个人信息管理", "操作日志查询", "页面布局设置", "通知提醒设置"],
    color: "#52c41a",
  },
];
