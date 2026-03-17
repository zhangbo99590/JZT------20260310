/**
 * 个性化设置面板组件
 * 创建时间: 2026-02-26
 * 功能: 提供首页布局和显示选项的个性化设置
 */

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Switch,
  Slider,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Space,
  ColorPicker,
  message,
} from "antd";
import {
  SettingOutlined,
  EyeOutlined,
  BgColorsOutlined,
  LayoutOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface PersonalizationSettings {
  showWeather: boolean;
  showCalendar: boolean;
  showSmartDashboard: boolean;
  showQuickTools: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: "light" | "dark" | "auto";
  primaryColor: string;
  compactMode: boolean;
  cardSpacing: number;
}

interface PersonalizationPanelProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange: (settings: PersonalizationSettings) => void;
  currentSettings: PersonalizationSettings;
}

const defaultSettings: PersonalizationSettings = {
  showWeather: true,
  showCalendar: true,
  showSmartDashboard: true,
  showQuickTools: true,
  autoRefresh: false,
  refreshInterval: 30,
  theme: "light",
  primaryColor: "#1890ff",
  compactMode: false,
  cardSpacing: 16,
};

export const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({
  visible,
  onClose,
  onSettingsChange,
  currentSettings,
}) => {
  const [settings, setSettings] =
    useState<PersonalizationSettings>(currentSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSettings(currentSettings);
    setHasChanges(false);
  }, [currentSettings, visible]);

  const handleSettingChange = (
    key: keyof PersonalizationSettings,
    value: any,
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange(settings);
    localStorage.setItem("homePageSettings", JSON.stringify(settings));
    setHasChanges(false);
    message.success("设置已保存");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    message.info("已重置为默认设置");
  };

  const handleApply = () => {
    onSettingsChange(settings);
    message.success("设置已应用");
  };

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          个性化设置
        </Space>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button size="small" onClick={handleReset}>
            重置
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            保存
          </Button>
        </Space>
      }
    >
      <div style={{ padding: "0 0 20px 0" }}>
        {/* 显示模块设置 */}
        <Card size="small" style={{ marginBottom: "16px" }}>
          <Title level={5}>
            <EyeOutlined style={{ marginRight: "8px" }} />
            显示模块
          </Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Text>天气信息</Text>
              <Switch
                checked={settings.showWeather}
                onChange={(checked) =>
                  handleSettingChange("showWeather", checked)
                }
              />
            </Row>
            <Row justify="space-between" align="middle">
              <Text>日程管理</Text>
              <Switch
                checked={settings.showCalendar}
                onChange={(checked) =>
                  handleSettingChange("showCalendar", checked)
                }
              />
            </Row>
            <Row justify="space-between" align="middle">
              <Text>智能看板</Text>
              <Switch
                checked={settings.showSmartDashboard}
                onChange={(checked) =>
                  handleSettingChange("showSmartDashboard", checked)
                }
              />
            </Row>
            <Row justify="space-between" align="middle">
              <Text>快捷工具</Text>
              <Switch
                checked={settings.showQuickTools}
                onChange={(checked) =>
                  handleSettingChange("showQuickTools", checked)
                }
              />
            </Row>
          </Space>
        </Card>

        {/* 刷新设置 */}
        <Card size="small" style={{ marginBottom: "16px" }}>
          <Title level={5}>
            <ReloadOutlined style={{ marginRight: "8px" }} />
            数据刷新
          </Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Text>自动刷新</Text>
              <Switch
                checked={settings.autoRefresh}
                onChange={(checked) =>
                  handleSettingChange("autoRefresh", checked)
                }
              />
            </Row>
            {settings.autoRefresh && (
              <div>
                <Text type="secondary">刷新间隔 (秒)</Text>
                <Slider
                  min={10}
                  max={300}
                  step={10}
                  value={settings.refreshInterval}
                  onChange={(value) =>
                    handleSettingChange("refreshInterval", value)
                  }
                  marks={{
                    10: "10s",
                    30: "30s",
                    60: "1m",
                    180: "3m",
                    300: "5m",
                  }}
                />
              </div>
            )}
          </Space>
        </Card>

        {/* 外观设置 */}
        <Card size="small" style={{ marginBottom: "16px" }}>
          <Title level={5}>
            <BgColorsOutlined style={{ marginRight: "8px" }} />
            外观设置
          </Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Text>主题模式</Text>
              <Select
                value={settings.theme}
                style={{ width: 100 }}
                onChange={(value) => handleSettingChange("theme", value)}
              >
                <Option value="light">浅色</Option>
                <Option value="dark">深色</Option>
                <Option value="auto">自动</Option>
              </Select>
            </Row>
            <Row justify="space-between" align="middle">
              <Text>主色调</Text>
              <ColorPicker
                value={settings.primaryColor}
                onChange={(color) =>
                  handleSettingChange("primaryColor", color.toHexString())
                }
                presets={[
                  { label: "蓝色", colors: ["#1890ff", "#096dd9", "#0050b3"] },
                  { label: "绿色", colors: ["#52c41a", "#389e0d", "#237804"] },
                  { label: "橙色", colors: ["#fa8c16", "#d46b08", "#ad4e00"] },
                  { label: "紫色", colors: ["#722ed1", "#531dab", "#391085"] },
                ]}
              />
            </Row>
            <Row justify="space-between" align="middle">
              <Text>紧凑模式</Text>
              <Switch
                checked={settings.compactMode}
                onChange={(checked) =>
                  handleSettingChange("compactMode", checked)
                }
              />
            </Row>
          </Space>
        </Card>

        {/* 布局设置 */}
        <Card size="small" style={{ marginBottom: "16px" }}>
          <Title level={5}>
            <LayoutOutlined style={{ marginRight: "8px" }} />
            布局设置
          </Title>
          <div>
            <Text type="secondary">卡片间距</Text>
            <Slider
              min={8}
              max={32}
              step={4}
              value={settings.cardSpacing}
              onChange={(value) => handleSettingChange("cardSpacing", value)}
              marks={{
                8: "紧密",
                16: "标准",
                24: "宽松",
                32: "超宽",
              }}
            />
          </div>
        </Card>

        <Divider />

        {/* 操作按钮 */}
        <Space style={{ width: "100%", justifyContent: "center" }}>
          <Button onClick={handleApply} disabled={!hasChanges}>
            预览效果
          </Button>
          <Button type="primary" onClick={handleSave} disabled={!hasChanges}>
            保存设置
          </Button>
        </Space>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f6f6f6",
            borderRadius: "6px",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            💡
            提示：设置会自动保存到本地存储，下次访问时会自动应用您的个性化配置。
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

// Hook for managing personalization settings
export const usePersonalizationSettings = () => {
  const [settings, setSettings] =
    useState<PersonalizationSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("homePageSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  const updateSettings = (newSettings: PersonalizationSettings) => {
    setSettings(newSettings);
    localStorage.setItem("homePageSettings", JSON.stringify(newSettings));
  };

  return {
    settings,
    updateSettings,
  };
};
