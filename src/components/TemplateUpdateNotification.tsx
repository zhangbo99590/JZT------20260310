import React, { useState, useEffect } from "react";
import {
  notification,
  Button,
  Space,
  Badge,
  Popover,
  List,
  Typography,
  Tag,
  Card,
  Avatar,
  Divider,
} from "antd";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { templateService } from "../services/templateService";

const { Text, Paragraph } = Typography;

interface UpdateNotification {
  templateId: string;
  templateName: string;
  currentVersion: string;
  latestVersion: string;
  updateInfo: string;
  isImportant: boolean;
  releaseDate: string;
  changelog: string[];
}

interface TemplateUpdateNotificationProps {
  templateIds?: string[];
  onDownloadUpdate?: (templateId: string, version: string) => void;
  onViewDetails?: (templateId: string) => void;
}

const TemplateUpdateNotification: React.FC<TemplateUpdateNotificationProps> = ({
  templateIds = [],
  onDownloadUpdate,
  onViewDetails,
}) => {
  const [updates, setUpdates] = useState<UpdateNotification[]>([]);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = React.useCallback(
    (templateId: string) => {
      setDismissed((prev) => new Set([...prev, templateId]));
      setUpdates((prev) =>
        prev.filter((update) => update.templateId !== templateId),
      );
    },
    [setDismissed, setUpdates],
  );

  const handleDownloadUpdate = React.useCallback(
    (update: UpdateNotification) => {
      if (onDownloadUpdate) {
        onDownloadUpdate(update.templateId, update.latestVersion);
      }
      // 直接调用setDismissed和setUpdates，避免循环依赖
      setDismissed((prev) => new Set([...prev, update.templateId]));
      setUpdates((prev) =>
        prev.filter((item) => item.templateId !== update.templateId),
      );
    },
    [onDownloadUpdate, setDismissed, setUpdates],
  );

  const handleViewDetails = React.useCallback(
    (update: UpdateNotification) => {
      if (onViewDetails) {
        onViewDetails(update.templateId);
      }
      setVisible(false);
    },
    [onViewDetails, setVisible],
  );

  const showImportantUpdateNotification = React.useCallback(
    (update: UpdateNotification) => {
      notification.warning({
        message: "重要模板更新",
        description: (
          <div>
            <Text strong>{update.templateName}</Text> 有重要更新可用
            <br />
            <Text type="secondary">
              版本：{update.currentVersion} → {update.latestVersion}
            </Text>
            <br />
            <Text>{update.updateInfo}</Text>
          </div>
        ),
        icon: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
        duration: 0, // 不自动关闭
        btn: (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                handleDownloadUpdate(update);
                notification.destroy();
              }}
            >
              立即更新
            </Button>
            <Button
              size="small"
              onClick={() => {
                handleDismiss(update.templateId);
                notification.destroy();
              }}
            >
              稍后提醒
            </Button>
          </Space>
        ),
        placement: "topRight",
      });
    },
    [handleDownloadUpdate, handleDismiss],
  );

  const checkForUpdates = React.useCallback(() => {
    const availableUpdates: UpdateNotification[] = [];

    templateIds.forEach((templateId) => {
      const updateCheck = templateService.checkForUpdates(
        templateId,
        "current",
      );

      if (updateCheck.hasUpdate) {
        const versionHistory =
          templateService.getTemplateVersionHistory(templateId);
        if (versionHistory) {
          const latestVersion = versionHistory.versions.find((v) => v.isLatest);

          if (latestVersion && !dismissed.has(templateId)) {
            availableUpdates.push({
              templateId,
              templateName: `模板 ${templateId}`,
              currentVersion: "current",
              latestVersion: latestVersion.version,
              updateInfo: updateCheck.updateInfo || "",
              isImportant: latestVersion.changelog.some(
                (change) =>
                  change.includes("重要") ||
                  change.includes("安全") ||
                  change.includes("必须"),
              ),
              releaseDate: latestVersion.releaseDate,
              changelog: latestVersion.changelog,
            });
          }
        }
      }
    });

    setUpdates(availableUpdates);

    // 显示重要更新的系统通知
    availableUpdates.forEach((update) => {
      if (update.isImportant && !dismissed.has(update.templateId)) {
        showImportantUpdateNotification(update);
      }
    });
  }, [templateIds, dismissed, setUpdates, showImportantUpdateNotification]);

  useEffect(() => {
    checkForUpdates();

    // 定期检查更新（每30分钟）
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkForUpdates]);

  const getUpdateIcon = (update: UpdateNotification) => {
    if (update.isImportant) {
      return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
    }
    return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
  };

  const getUpdateTag = (update: UpdateNotification) => {
    if (update.isImportant) {
      return <Tag color="orange">重要更新</Tag>;
    }
    return <Tag color="blue">可选更新</Tag>;
  };

  const renderUpdateList = () => (
    <Card
      title="模板更新通知"
      style={{ width: 400, maxHeight: 500, overflowY: "auto" }}
      extra={null}
    >
      {updates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <CheckCircleOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
          <Paragraph style={{ marginTop: 8 }}>所有模板都是最新版本</Paragraph>
        </div>
      ) : (
        <List
          dataSource={updates}
          renderItem={(update) => (
            <List.Item
              actions={[
                <Button
                  key="download"
                  type="primary"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadUpdate(update)}
                >
                  更新
                </Button>,
                <Button
                  key="detail"
                  type="link"
                  size="small"
                  icon={<InfoCircleOutlined />}
                  onClick={() => handleViewDetails(update)}
                >
                  详情
                </Button>,
                <Button
                  key="dismiss"
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleDismiss(update.templateId)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getUpdateIcon(update)} />}
                title={
                  <Space>
                    <Text strong>{update.templateName}</Text>
                    {getUpdateTag(update)}
                  </Space>
                }
                description={
                  <div>
                    <Text type="secondary">
                      {update.currentVersion} → {update.latestVersion}
                    </Text>
                    <br />
                    <Text style={{ fontSize: "12px" }}>
                      <ClockCircleOutlined /> {update.releaseDate}
                    </Text>
                    <Divider type="vertical" />
                    <Text style={{ fontSize: "12px" }}>
                      {update.changelog[0]}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  return null;
};

export default TemplateUpdateNotification;
