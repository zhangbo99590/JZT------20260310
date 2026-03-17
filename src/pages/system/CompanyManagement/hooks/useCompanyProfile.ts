/**
 * 企业画像管理 Hook
 * 创建时间: 2026-01-13
 */

import { useState, useCallback } from "react";
import { message } from "antd";
import { useCompanyProfileContext, CompanyProfile as ContextCompanyProfile } from "../../../../context/CompanyProfileContext";
import { CompanyProfile } from "../types";

// 本地类型定义，扩展 Context 中的类型以包含组件特有的 UI 状态
export interface UICompanyProfile extends ContextCompanyProfile {
  // 扩展 UI 特有字段
  syncStatus?: "success" | "syncing" | "failed";
  dataSource?: {
    business: "success" | "syncing" | "failed";
    tax: "success" | "syncing" | "failed";
    rd: "success" | "syncing" | "failed";
  };
}

// 导出别名以兼容原有代码
export type { CompanyProfile };

export const useCompanyProfile = () => {
  const { profile, updateProfile, loading: contextLoading } = useCompanyProfileContext();
  
  const [loading, setLoading] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // 编辑表单状态
  const [editForm, setEditForm] = useState<Partial<UICompanyProfile>>({});

  // 将 Context 数据映射到本地 UI 数据
  const companyProfile: UICompanyProfile = {
    ...profile,
    syncStatus: "success",
    dataSource: {
      business: "success",
      tax: "success",
      rd: "success"
    }
  };

  // 打开编辑弹窗
  const handleEditProfile = useCallback(() => {
    if (companyProfile) {
      setEditForm({
        ...companyProfile
      });
      setEditMode(true);
      setProfileModalVisible(true);
    }
  }, [companyProfile]);

  // 保存企业画像
  const handleSaveProfile = useCallback(async () => {
    setLoading(true);
    try {
      // 调用 Context 的更新方法
      updateProfile(editForm);
      setEditMode(false);
      setProfileModalVisible(false);
      // message.success 由 Context 处理
    } catch (error) {
      console.error("Failed to save profile:", error);
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [editForm, updateProfile]);

  // 取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setProfileModalVisible(false);
    setEditForm({});
    setCurrentStep(0);
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    if (editMode) {
      // 如果在编辑模式下关闭，提示确认或直接取消编辑
      handleCancelEdit();
    } else {
      setProfileModalVisible(false);
    }
  }, [editMode, handleCancelEdit]);

  // 重试同步
  const handleRetrySync = useCallback(() => {
    message.loading("正在同步数据...", 1).then(() => {
      message.success("同步成功");
    });
  }, []);

  return {
    loading: loading || contextLoading,
    companyProfile,
    profileModalVisible,
    editMode,
    editForm,
    currentStep,
    setEditForm,
    setCurrentStep,
    setEditMode,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleCloseModal,
    handleRetrySync,
  };
};
