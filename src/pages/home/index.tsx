/**
 * 首页主组件
 * 创建时间: 2026-01-13
 * 更新时间: 2026-02-26
 * 功能: 首页主入口，整合所有拆分的模块，支持个性化设置和用户体验优化
 */

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Divider, FloatButton, Space } from "antd";
import { SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  PageHeader,
  BannerSection,
  DataOverviewSection,
  QuickActionsSection,
  TrendChartSection,
  RecentActivitiesSection,
  ImportantRemindersSection,
  SmartDashboardSection,
  PersonalizedRecommendationSection,
  QuickToolsSection,
  EnterpriseGuideSection,
} from "./components/index";
import { useHomeData } from "./hooks/useHomeData";
import { ErrorBoundary, SimpleErrorBoundary } from "../../components/common/ErrorBoundary";
import { HomePageSkeleton } from "../../components/common/SkeletonLoader";
import { RefreshButton } from "../../components/common/RefreshButton";
import { PersonalizationPanel, usePersonalizationSettings } from "../../components/common/PersonalizationPanel";
import { useKeyboardShortcuts, getHomePageShortcuts } from "../../hooks/useKeyboardShortcuts";
import "./styles/home.css";

/**
 * 首页主组件
 * 组件创建时间: 2026-01-13
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const { homeData, loading, error, fetchHomeData } = useHomeData();
  const { settings, updateSettings } = usePersonalizationSettings();
  const [settingsPanelVisible, setSettingsPanelVisible] = useState(false);

  // 监听错误信息
  React.useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  /**
   * 页面导航处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  /**
   * 消息提示处理函数
   * 函数创建时间: 2026-01-13
   */
  const handleMessage = (text: string) => {
    message.info(text);
  };

  /**
   * 数据刷新处理函数
   */
  const handleRefresh = useCallback(async () => {
    await fetchHomeData();
  }, [fetchHomeData]);

  /**
   * 切换设置面板
   */
  const toggleSettingsPanel = useCallback(() => {
    setSettingsPanelVisible(prev => !prev);
  }, []);

  /**
   * 显示快捷键帮助
   */
  const showShortcutsHelp = useCallback(() => {
    message.info({
      content: (
        <div style={{ textAlign: 'left' }}>
          <strong>键盘快捷键：</strong><br />
          F5 / Ctrl+R: 刷新数据<br />
          Ctrl+,: 打开设置面板<br />
          Shift+?: 显示帮助<br />
        </div>
      ),
      duration: 5
    });
  }, []);

  // 设置键盘快捷键
  const shortcuts = getHomePageShortcuts({
    refresh: handleRefresh,
    toggleSettings: toggleSettingsPanel,
    showHelp: showShortcutsHelp
  });

  useKeyboardShortcuts({ shortcuts });

  // 显示加载状态
  // if (loading) {
  //   return <HomePageSkeleton />;
  // }

  const gutter = settings.compactMode ? [8, 8] : [settings.cardSpacing, settings.cardSpacing];

  return (
    <ErrorBoundary>
      <div style={{ 
        background: "transparent", 
        padding: settings.compactMode ? "12px 0" : "0",
        minHeight: "100vh"
      }}>
        {/* 页面头部 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: settings.compactMode ? "16px" : "24px"
        }}>
          <PageHeader username={username} />
          <Space>
            <RefreshButton 
              onRefresh={handleRefresh}
              loading={loading}
              autoRefresh={settings.autoRefresh}
              refreshInterval={settings.refreshInterval}
              size="small"
            />
          </Space>
        </div>

        {/* 企业画像与认证引导 */}
        <SimpleErrorBoundary>
          <EnterpriseGuideSection loading={loading} />
        </SimpleErrorBoundary>

        {/* 政策申报动态轮播图 */}
        <SimpleErrorBoundary>
          <BannerSection loading={loading} />
        </SimpleErrorBoundary>

        {/* 个性化推荐区域 */}
        <SimpleErrorBoundary>
          <PersonalizedRecommendationSection />
        </SimpleErrorBoundary>

        <Divider style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />

        {/* 快捷工具区域 */}
        {settings.showQuickTools && (
          <>
            <SimpleErrorBoundary>
              <QuickToolsSection />
            </SimpleErrorBoundary>
            <Divider style={{ margin: settings.compactMode ? "16px 0" : "24px 0" }} />
          </>
        )}

        {/* 底部信息区域 */}
        <Row gutter={gutter}>
          {/* 最近活动通知栏 */}
          <Col xs={24} lg={12}>
            <SimpleErrorBoundary>
              <RecentActivitiesSection
                recentActivities={homeData.recentActivities}
                onNavigate={handleNavigate}
                loading={loading}
              />
            </SimpleErrorBoundary>
          </Col>

          {/* 重要提醒模块 */}
          <Col xs={24} lg={12}>
            <SimpleErrorBoundary>
              <ImportantRemindersSection
                importantReminders={homeData.importantReminders}
                onNavigate={handleNavigate}
                onMessage={handleMessage}
                loading={loading}
              />
            </SimpleErrorBoundary>
          </Col>
        </Row>

        {/* 浮动按钮 */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<SettingOutlined />}
        >
          <FloatButton 
            icon={<SettingOutlined />} 
            tooltip="个性化设置"
            onClick={toggleSettingsPanel}
          />
          <FloatButton 
            icon={<QuestionCircleOutlined />} 
            tooltip="快捷键帮助"
            onClick={showShortcutsHelp}
          />
        </FloatButton.Group>

        {/* 个性化设置面板 */}
        <PersonalizationPanel
          visible={settingsPanelVisible}
          onClose={() => setSettingsPanelVisible(false)}
          currentSettings={settings}
          onSettingsChange={updateSettings}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Home;
