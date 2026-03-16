import React, { createContext, useContext } from "react";
import { ApplicationProject } from "../data/policyProjects";

/**
 * 政策上下文类型定义和 Hook
 *
 * @file policy.ts
 * @desc 定义政策项目上下文类型及相关 Hook
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 类型定义 ---
 * - PolicyContextType: 政策上下文接口
 *
 * --- 导出函数 ---
 * - usePolicy: 政策上下文 Hook
 *
 * @warning usePolicy 必须在 PolicyProvider 内部使用
 */

/**
 * 政策上下文类型接口
 */
export interface PolicyContextType {
  projects: ApplicationProject[];
  setProjects: React.Dispatch<React.SetStateAction<ApplicationProject[]>>;
  updateProjects: (newProjects: ApplicationProject[]) => void;
  addProject: (project: ApplicationProject) => void;
  searchProjects: (keyword: string) => ApplicationProject[];
}

export const PolicyContext = createContext<PolicyContextType | undefined>(
  undefined,
);

/**
 * 政策上下文 Hook
 *
 * @returns PolicyContextType 政策上下文值
 * @throws Error 当在 PolicyProvider 外部使用时抛出错误
 *
 * @description
 * 用于在组件中访问政策上下文。必须在 PolicyProvider 包裹的组件树中使用。
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { projects, searchProjects, addProject } = usePolicy();
 *   // 使用政策上下文
 * }
 * ```
 */
export const usePolicy = () => {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
};
