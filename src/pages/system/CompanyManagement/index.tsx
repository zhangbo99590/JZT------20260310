/**
 * 企业管理页面主组件
 * 创建时间: 2026-01-13
 * 功能: 企业管理页面主入口，整合所有拆分的模块
 */

import React from "react";
import { Row, Col, Typography, Button, Breadcrumb } from "antd";
import { EditOutlined, BankOutlined } from "@ant-design/icons";
import { ProfileOverviewCard, ProfileEditModal } from "./components/index.ts";
import {
  useCompanyProfile,
  UICompanyProfile,
  CompanyProfile,
} from "./hooks/useCompanyProfile.ts";

const { Title, Text } = Typography;

/**
 * 企业管理页面组件
 * 组件创建时间: 2026-01-13
 */
const CompanyManagement: React.FC = () => {
  const {
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
  } = useCompanyProfile();

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: "系统管理",
          },
          {
            title: "企业管理",
          },
        ]}
      />

      {/* 页面头部 */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              marginBottom: "8px",
              color: "#262626",
              fontSize: "24px",
              fontWeight: 500,
            }}
          >
            <BankOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            企业管理
          </Title>
          <Text
            type="secondary"
            style={{
              color: "#8c8c8c",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            管理企业画像信息，包含40+个字段，涵盖基础信息、财务、研发、知识产权、人员、资质、经营、项目、荣誉等全方位数据
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
          >
            编辑企业画像
          </Button>
        </Col>
      </Row>

      {/* 企业画像概览卡片 */}
      <ProfileOverviewCard
        companyProfile={companyProfile}
        onRetrySync={handleRetrySync}
      />

      {/* 企业画像编辑弹窗 */}
      <ProfileEditModal
        visible={profileModalVisible}
        editMode={editMode}
        loading={loading}
        companyProfile={companyProfile as unknown as CompanyProfile}
        editForm={editForm as Partial<CompanyProfile>}
        currentStep={currentStep}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        onCancelEdit={handleCancelEdit}
        onEditModeChange={setEditMode}
        onStepChange={setCurrentStep}
        onFormChange={(form) => setEditForm(form as Partial<UICompanyProfile>)}
      />
    </div>
  );
};

export default CompanyManagement;
