import React, { useState, useEffect } from 'react';
import {
  Modal,
  Timeline,
  Tag,
  Button,
  Alert,
  Descriptions,
  List,
  Typography,
  Space,
  Divider,
  Badge,
  Card,
  Row,
  Col,
  message
} from 'antd';
import {
  HistoryOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { templateService, TemplateVersionHistory, TemplateVersion } from '../services/templateService';
import { formatFileSize } from '../utils/commonUtils';
import TemplateVersionCompare from './TemplateVersionCompare';

const { Text, Paragraph, Title } = Typography;

interface TemplateVersionManagerProps {
  templateId: string;
  templateName: string;
  currentVersion: string;
  visible: boolean;
  onClose: () => void;
  onDownloadVersion?: (version: string, downloadUrl: string) => void;
}

const TemplateVersionManager: React.FC<TemplateVersionManagerProps> = ({
  templateId,
  templateName,
  currentVersion,
  visible,
  onClose,
  onDownloadVersion
}) => {
  const [versionHistory, setVersionHistory] = useState<TemplateVersionHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<TemplateVersion | null>(null);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  useEffect(() => {
    if (visible && templateId) {
      loadVersionHistory();
    }
  }, [visible, templateId]);

  const loadVersionHistory = async () => {
    setLoading(true);
    try {
      const history = templateService.getTemplateVersionHistory(templateId);
      setVersionHistory(history);
      
      // 检查更新
      const updateCheck = templateService.checkForUpdates(templateId, currentVersion);
      if (updateCheck.hasUpdate) {
        message.info(updateCheck.updateInfo);
      }
    } catch (error) {
      message.error('加载版本历史失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVersion = async (version: TemplateVersion) => {
    try {
      if (onDownloadVersion) {
        onDownloadVersion(version.version, version.downloadUrl);
      }
      message.success(`开始下载 ${templateName} ${version.version}`);
    } catch (error) {
      message.error('下载失败，请稍后重试');
    }
  };

  const getVersionStatus = (version: TemplateVersion) => {
    if (version.isLatest) {
      return <Tag color="green" icon={<CheckCircleOutlined />}>最新版本</Tag>;
    }
    if (version.isDeprecated) {
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>已废弃</Tag>;
    }
    return <Tag color="blue" icon={<ClockCircleOutlined />}>历史版本</Tag>;
  };


  const renderVersionTimeline = () => {
    if (!versionHistory) return null;

    const timelineItems = versionHistory.versions.map((version) => ({
      color: version.isLatest ? 'green' : version.isDeprecated ? 'red' : 'blue',
      dot: version.isLatest ? <CheckCircleOutlined /> : 
           version.isDeprecated ? <ExclamationCircleOutlined /> : 
           <ClockCircleOutlined />,
      children: (
        <div key={version.version}>
          <div style={{ marginBottom: 8 }}>
            <Space>
              <Text strong>{version.version}</Text>
              {getVersionStatus(version)}
              <Text type="secondary">{version.releaseDate}</Text>
            </Space>
          </div>
          
          <Card 
            size="small" 
            style={{ marginBottom: 16 }}
            actions={[
              <Button
                key="download"
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadVersion(version)}
                disabled={version.isDeprecated}
              >
                下载
              </Button>,
              <Button
                key="detail"
                type="link"
                icon={<InfoCircleOutlined />}
                onClick={() => setSelectedVersion(version)}
              >
                详情
              </Button>,
              <Button
                key="compare"
                type="link"
                icon={<SwapOutlined />}
                onClick={() => setCompareModalVisible(true)}
              >
                比较
              </Button>
            ]}
          >
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="文件大小">
                {formatFileSize(version.fileSize)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {version.isLatest ? '最新' : version.isDeprecated ? '已废弃' : '可用'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <div>
              <Text strong style={{ fontSize: '12px' }}>更新内容：</Text>
              <List
                size="small"
                dataSource={version.changelog}
                renderItem={(item) => (
                  <List.Item style={{ padding: '4px 0', border: 'none' }}>
                    <Text style={{ fontSize: '12px' }}>• {item}</Text>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </div>
      )
    }));

    return <Timeline items={timelineItems} />;
  };

  const renderVersionDetail = () => {
    if (!selectedVersion) return null;

    return (
      <Modal
        title={`版本详情 - ${selectedVersion.version}`}
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setSelectedVersion(null)}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              handleDownloadVersion(selectedVersion);
              setSelectedVersion(null);
            }}
            disabled={selectedVersion.isDeprecated}
          >
            下载此版本
          </Button>
        ]}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="版本号">{selectedVersion.version}</Descriptions.Item>
          <Descriptions.Item label="发布日期">{selectedVersion.releaseDate}</Descriptions.Item>
          <Descriptions.Item label="文件大小">{formatFileSize(selectedVersion.fileSize)}</Descriptions.Item>
          <Descriptions.Item label="状态">{getVersionStatus(selectedVersion)}</Descriptions.Item>
          <Descriptions.Item label="下载地址">
            <Text code copyable>{selectedVersion.downloadUrl}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Title level={5}>更新日志</Title>
        <List
          dataSource={selectedVersion.changelog}
          renderItem={(item, index) => (
            <List.Item>
              <Text>{index + 1}. {item}</Text>
            </List.Item>
          )}
        />
      </Modal>
    );
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            <span>{templateName} - 版本历史</span>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        width={800}
        footer={[
          <Button key="close" onClick={onClose}>
            关闭
          </Button>,
          <Button
            key="compare"
            type="primary"
            icon={<SwapOutlined />}
            onClick={() => setCompareModalVisible(true)}
            disabled={!versionHistory || versionHistory.versions.length < 2}
          >
            版本比较
          </Button>
        ]}
        loading={loading}
      >
        {versionHistory && (
          <>
            {/* 版本概览 */}
            <Alert
              message="版本信息"
              description={
                <Row gutter={16}>
                  <Col span={8}>
                    <Text strong>当前版本：</Text>
                    <Badge 
                      count={currentVersion} 
                      style={{ backgroundColor: '#52c41a' }} 
                    />
                  </Col>
                  <Col span={8}>
                    <Text strong>最新版本：</Text>
                    <Badge 
                      count={versionHistory.currentVersion} 
                      style={{ backgroundColor: '#1890ff' }} 
                    />
                  </Col>
                  <Col span={8}>
                    <Text strong>历史版本：</Text>
                    <Badge 
                      count={versionHistory.versions.length} 
                      style={{ backgroundColor: '#722ed1' }} 
                    />
                  </Col>
                </Row>
              }
              type="info"
              style={{ marginBottom: 24 }}
            />

            {/* 版本时间线 */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {renderVersionTimeline()}
            </div>
          </>
        )}

        {!versionHistory && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <Paragraph type="secondary">暂无版本历史记录</Paragraph>
          </div>
        )}
      </Modal>

      {/* 版本详情模态框 */}
      {renderVersionDetail()}

      {/* 版本比较模态框 */}
      <TemplateVersionCompare
        templateId={templateId}
        templateName={templateName}
        visible={compareModalVisible}
        onClose={() => setCompareModalVisible(false)}
        onDownloadVersion={(version) => {
          if (onDownloadVersion) {
            const versionInfo = versionHistory?.versions.find(v => v.version === version);
            if (versionInfo) {
              onDownloadVersion(version, versionInfo.downloadUrl);
            }
          }
        }}
      />
    </>
  );
};

export default TemplateVersionManager;