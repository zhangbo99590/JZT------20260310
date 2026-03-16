import React, { useState, ReactNode } from "react";
import {
  ApplicationProject,
  policyProjects as initialProjects,
} from "../data/policyProjects";
import { PolicyContext, PolicyContextType } from "./policy";

/**
 * PolicyProvider 政策上下文提供者
 *
 * @file PolicyContext.tsx
 * @desc 提供政策项目数据的管理和操作功能
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 管理政策项目列表状态
 * 2. 提供项目增删改查操作
 * 3. 支持项目搜索功能
 *
 * --- 技术要点 ---
 * - 使用 React Context API 提供全局状态
 * - 初始数据从 policyProjects 导入
 * - 搜索功能支持标题、描述、需求匹配
 *
 * @warning 必须在应用根节点使用此Provider包裹
 */

export const PolicyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] =
    useState<ApplicationProject[]>(initialProjects);

  /**
   * 更新项目列表
   *
   * @param newProjects - 新的项目列表
   *
   * @description
   * 使用新项目列表替换当前项目列表。
   */
  const updateProjects = (newProjects: ApplicationProject[]) => {
    setProjects(newProjects);
  };

  /**
   * 添加新项目
   *
   * @param project - 要添加的项目
   *
   * @description
   * 向项目列表中添加一个新项目。
   */
  const addProject = (project: ApplicationProject) => {
    setProjects((prev) => [...prev, project]);
  };

  /**
   * 搜索项目
   *
   * @param keyword - 搜索关键词
   * @returns 匹配的项目列表
   *
   * @description
   * 根据关键词搜索项目，匹配规则：
   * - 项目标题包含关键词（不区分大小写）
   * - 项目描述包含关键词（不区分大小写）
   * - 项目需求列表中的任一需求包含关键词（不区分大小写）
   * 关键词为空时返回所有项目。
   */
  const searchProjects = (keyword: string): ApplicationProject[] => {
    if (!keyword.trim()) return projects;

    const lowerKeyword = keyword.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(lowerKeyword) ||
        project.description.toLowerCase().includes(lowerKeyword) ||
        project.requirements.some((req) =>
          req.toLowerCase().includes(lowerKeyword),
        ),
    );
  };

  const contextValue: PolicyContextType = {
    projects,
    setProjects,
    updateProjects,
    addProject,
    searchProjects,
  };

  return (
    <PolicyContext.Provider value={contextValue}>
      {children}
    </PolicyContext.Provider>
  );
};
