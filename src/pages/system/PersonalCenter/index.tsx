/**
 * 个人中心页面主组件
 * 创建时间: 2026-01-13
 * 功能: 个人中心页面主入口，整合所有拆分的模块
 */

import React from "react";
import { Card, Tabs, Breadcrumb, Spin, Alert, Button } from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  // SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  UserProfileCard,
  PersonalInfoTab,
  OperationLogTab,
  // SettingsTab,
  LogDetailModal,
  PhoneEditModal,
  NicknameEditModal,
} from "./components/index.ts";
import { usePersonalCenter } from "./hooks/usePersonalCenter.ts";

/**
 * 个人中心页面组件
 * 组件创建时间: 2026-01-13 14:20:00
 */
const PersonalCenter: React.FC = () => {
  const {
    // 表单
    passwordForm,
    phoneForm,
    nicknameForm,
    // 状态
    loading,
    avatarUrl,
    activeTab,
    setActiveTab,
    userInfo,
    apiLoading,
    apiError,
    // 操作日志
    operationLogs,
    logFilter,
    setLogFilter,
    selectedLog,
    logDetailVisible,
    setLogDetailVisible,
    // 通知设置 (个性化设置相关 - 已注释)
    // notificationSettings,
    // setNotificationSettings,
    // quietHours,
    // setQuietHours,
    // 模块偏好 (个性化设置相关 - 已注释)
    // modulePreferences,
    // setModulePreferences,
    // defaultHomePage,
    // setDefaultHomePage,
    // 手机号修改
    phoneModalVisible,
    setPhoneModalVisible,
    sendingCode,
    countdown,
    // 昵称修改
    nicknameModalVisible,
    setNicknameModalVisible,
    // 方法
    handleLogout,
    handleAvatarUpload,
    handleEditPhone,
    handleSendPhoneCode,
    handleSubmitPhone,
    handleEditNickname,
    handleSubmitNickname,
    handleDeleteLog,
    handleChangePassword,
    viewLogDetail,
    // 个性化设置相关方法 (已注释)
    // handleSaveNotificationSettings,
    // handleSaveModulePreferences,
  } = usePersonalCenter();

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[{ title: "系统管理" }, { title: "个人中心" }]}
      />

      <div
        style={{
          padding: "24px",
          background: "#f0f2f5",
          minHeight: "calc(100vh - 180px)",
        }}
      >
        {/* 加载中状态 */}
        {apiLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        )}

        {/* 错误状态 */}
        {apiError && !apiLoading && (
          <div style={{ padding: "50px" }}>
            <Alert
              message="获取用户信息失败"
              description={apiError}
              type="error"
              showIcon
              action={
                <Button
                  type="primary"
                  size="small"
                  onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              }
            />
          </div>
        )}

        {/* 正常状态 */}
        {userInfo && !apiLoading && !apiError && (
          <>
            {/* 用户头像卡片 */}
            <UserProfileCard
              userInfo={userInfo}
              avatarUrl={avatarUrl}
              onAvatarUpload={handleAvatarUpload}
              onLogout={handleLogout}
            />

            {/* 主要内容标签页 */}
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                  // 切换离开"个人信息"标签时，清空密码表单（安全考虑）
                  if (activeTab === "1" && key !== "1") {
                    passwordForm.resetFields();
                  }
                  setActiveTab(key);
                }}
                items={[
                  {
                    key: "1",
                    label: (
                      <span>
                        <UserOutlined /> 个人信息
                      </span>
                    ),
                    children: (
                      <PersonalInfoTab
                        userInfo={userInfo}
                        passwordForm={passwordForm}
                        loading={loading}
                        onEditPhone={handleEditPhone}
                        onEditNickname={handleEditNickname}
                        onChangePassword={handleChangePassword}
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <span>
                        <HistoryOutlined /> 操作日志
                      </span>
                    ),
                    children: (
                      <OperationLogTab
                        operationLogs={operationLogs}
                        logFilter={logFilter}
                        onFilterChange={setLogFilter}
                        onViewDetail={viewLogDetail}
                        onDeleteLog={handleDeleteLog}
                      />
                    ),
                  },
                  // {
                  //   key: "3",
                  //   label: (
                  //     <span>
                  //       <SettingOutlined /> 个性化设置
                  //     </span>
                  //   ),
                  //   children: (
                  //     <SettingsTab
                  //       modulePreferences={modulePreferences}
                  //       defaultHomePage={defaultHomePage}
                  //       notificationSettings={notificationSettings}
                  //       quietHours={quietHours}
                  //       loading={loading}
                  //       onModulePreferencesChange={setModulePreferences}
                  //       onDefaultHomePageChange={setDefaultHomePage}
                  //       onNotificationSettingsChange={setNotificationSettings}
                  //       onQuietHoursChange={setQuietHours}
                  //       onSaveModulePreferences={handleSaveModulePreferences}
                  //       onSaveNotificationSettings={handleSaveNotificationSettings}
                  //     />
                  //   ),
                  // },
                ]}
              />
            </Card>
          </>
        )}

        {/* 操作日志详情弹窗 */}
        <LogDetailModal
          visible={logDetailVisible}
          log={selectedLog}
          onClose={() => setLogDetailVisible(false)}
        />

        {/* 修改手机号弹窗 */}
        <PhoneEditModal
          visible={phoneModalVisible}
          form={phoneForm}
          loading={loading}
          sendingCode={sendingCode}
          countdown={countdown}
          onClose={() => setPhoneModalVisible(false)}
          onSendCode={handleSendPhoneCode}
          onSubmit={handleSubmitPhone}
        />

        {/* 修改昵称弹窗 */}
        <NicknameEditModal
          visible={nicknameModalVisible}
          form={nicknameForm}
          loading={loading}
          onClose={() => setNicknameModalVisible(false)}
          onSubmit={handleSubmitNickname}
        />
      </div>
    </div>
  );
};

export default PersonalCenter;
