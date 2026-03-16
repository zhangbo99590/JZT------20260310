/**
 * 企业画像管理 Hook
 * 创建时间: 2026-01-13
 */

import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import type { CompanyProfile, DataSourceType } from "../types/index.ts";
import { mockCompanyProfile, dataTypeNames } from "../config/mockData.ts";

export function useCompanyProfile() {
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null
  );
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CompanyProfile>>({});
  const [currentStep, setCurrentStep] = useState(0);

  // 初始化数据
  useEffect(() => {
    setCompanyProfile(mockCompanyProfile);
  }, []);

  // 打开编辑模式
  const handleEditProfile = useCallback(() => {
    if (companyProfile) {
      setEditForm({
        // 基础信息
        companyName: companyProfile.companyName,
        creditCode: companyProfile.creditCode,
        legalPerson: companyProfile.legalPerson,
        registeredCapital: companyProfile.registeredCapital,
        establishDate: companyProfile.establishDate,
        industry: companyProfile.industry,
        scale: companyProfile.scale,
        companyType: companyProfile.companyType,
        address: companyProfile.address,
        // 财务数据
        revenue: companyProfile.revenue,
        profit: companyProfile.profit,
        taxAmount: companyProfile.taxAmount,
        assets: companyProfile.assets,
        // 研发数据
        rdInvestment: companyProfile.rdInvestment,
        rdRatio: companyProfile.rdRatio,
        rdPersonnel: companyProfile.rdPersonnel,
        rdProjects: companyProfile.rdProjects,
        // 知识产权
        patents: companyProfile.patents,
        inventionPatents: companyProfile.inventionPatents,
        softwareCopyrights: companyProfile.softwareCopyrights,
        trademarks: companyProfile.trademarks,
        achievements: companyProfile.achievements,
        // 人员信息
        totalEmployees: companyProfile.totalEmployees,
        technicalPersonnel: companyProfile.technicalPersonnel,
        bachelorAbove: companyProfile.bachelorAbove,
        // 资质认证
        qualifications: companyProfile.qualifications,
        certifications: companyProfile.certifications,
        // 经营信息
        mainBusiness: companyProfile.mainBusiness,
        mainProducts: companyProfile.mainProducts,
        marketShare: companyProfile.marketShare,
        exportVolume: companyProfile.exportVolume,
        // 项目经验
        completedProjects: companyProfile.completedProjects,
        ongoingProjects: companyProfile.ongoingProjects,
        governmentProjects: companyProfile.governmentProjects,
        // 荣誉奖项
        awards: companyProfile.awards,
      });
      setEditMode(true);
      setProfileModalVisible(true);
    }
  }, [companyProfile]);

  // 保存企业画像
  const handleSaveProfile = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCompanyProfile((prev) =>
        prev
          ? {
              ...prev,
              ...editForm,
              lastSyncTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            }
          : null
      );

      message.success("企业画像更新成功");
      setProfileModalVisible(false);
      setEditMode(false);
    } catch (error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [editForm]);

  // 取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setEditForm({});
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setProfileModalVisible(false);
    handleCancelEdit();
    setCurrentStep(0);
  }, [handleCancelEdit]);

  // 重试同步
  const handleRetrySync = useCallback(async (dataType: DataSourceType) => {
    message.loading(`正在重新同步${dataTypeNames[dataType]}...`);

    // 模拟同步
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCompanyProfile((prev) =>
      prev
        ? {
            ...prev,
            dataSource: {
              ...prev.dataSource,
              [dataType]: "success",
            },
            lastSyncTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          }
        : null
    );
    message.success(`${dataTypeNames[dataType]}同步成功`);
  }, []);

  return {
    loading,
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
}
