import React, { useState, useEffect } from 'react';
import {
  Modal,
  Select,
  Row,
  Col,
  Card,
  Typography,
  List,
  Tag,
  Space,
  Button,
  Alert,
  Descriptions,
  Collapse
} from 'antd';
import {
  SwapOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { templateService, TemplateVersion } from '../services/templateService';

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface VersionDiff {
  type: 'added' | 'removed' | 'modified';
  section: string;
  content: string;
  oldContent?: string;
}

interface TemplateVersionCompareProps {
  templateId: string;
  templateName: string;
  visible: boolean;
  onClose: () => void;
  defaultVersions?: [string, string];
  onDownloadVersion?: (version: string) => void;
}

const TemplateVersionCompare: React.FC<TemplateVersionCompareProps> = ({
  templateId,
  templateName,
  visible,
  onClose,
  defaultVersions,
  onDownloadVersion
}) => {
  const [availableVersions, setAvailableVersions] = useState<TemplateVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(
    defaultVersions || ['', '']
  );
  const [versionDiffs, setVersionDiffs] = useState<VersionDiff[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && templateId) {
      loadAvailableVersions();
    }
  }, [visible, templateId]);

  useEffect(() => {
    if (selectedVersions[0] && selectedVersions[1] && selectedVersions[0] !== selectedVersions[1]) {
      compareVersions();
    }
  }, [selectedVersions]);

  const loadAvailableVersions = () => {
    try {
      const versionHistory = templateService.getTemplateVersionHistory(templateId);
      if (versionHistory) {
        setAvailableVersions(versionHistory.versions);
        
        // 如果没有默认版本，设置最新版本和前一个版本
        if (!defaultVersions && versionHistory.versions.length >= 2) {
          setSelectedVersions([
            versionHistory.versions[0].version, // 最新版本
            versionHistory.versions[1].version  // 前一个版本
          ]);
        }
      }
    } catch (error) {
      console.error('加载版本列表失败:', error);
    }
  };

  const compareVersions = () => {
    setLoading(true);
    try {
      // 模拟版本比较逻辑
      const comparison = templateService.compareTemplateVersions(
        templateId,
        selectedVersions[0],
        selectedVersions[1]
      );
      
      setVersionDiffs(comparison.differences);
    } catch (error) {
      console.error('版本比较失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiffIcon = (type: VersionDiff['type']) => {
    switch (type) {
      case 'added':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'removed':
        return <MinusOutlined style={{ color: '#ff4d4f' }} />;
      case 'modified':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getDiffColor = (type: VersionDiff['type']) => {
    switch (type) {
      case 'added':
        return 'success';
      case 'removed':
        return 'error';
      case 'modified':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getDiffText = (type: VersionDiff['type']) => {
    switch (type) {
      case 'added':
        return '新增';
      case 'removed':
        return '删除';
      case 'modified':
        return '修改';
      default:
        return '未知';
    }
  };

  const getVersionInfo = (version: string) => {
    return availableVersions.find(v => v.version === version);
  };

  const renderVersionSelector = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={10}>
        <Card size="small" title="版本 A">
          <Select
            style={{ width: '100%' }}
            placeholder="选择版本 A"
            value={selectedVersions[0]}
            onChange={(value) => setSelectedVersions([value, selectedVersions[1]])}
          >
            {availableVersions.map(version => (
              <Option key={version.version} value={version.version}>
                <Space>
                  <Text>{version.version}</Text>
                  {version.isLatest && <Tag color="green">最新</Tag>}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {version.releaseDate}
                  </Text>
                </Space>
              </Option>
            ))}
          </Select>
          
          {selectedVersions[0] && (
            <div style={{ marginTop: 8 }}>
              {(() => {
                const versionInfo = getVersionInfo(selectedVersions[0]);
                return versionInfo ? (
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="发布日期">
                      {versionInfo.releaseDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="文件大小">
                      {(versionInfo.fileSize / 1024).toFixed(1)} KB
                    </Descriptions.Item>
                  </Descriptions>
                ) : null;
              })()}
            </div>
          )}
        </Card>
      </Col>
      
      <Col span={4} style={{ textAlign: 'center', paddingTop: 40 }}>
        <SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />
      </Col>
      
      <Col span={10}>
        <Card size="small" title="版本 B">
          <Select
            style={{ width: '100%' }}
            placeholder="选择版本 B"
            value={selectedVersions[1]}
            onChange={(value) => setSelectedVersions([selectedVersions[0], value])}
          >
            {availableVersions.map(version => (
              <Option key={version.version} value={version.version}>
                <Space>
                  <Text>{version.version}</Text>
                  {version.isLatest && <Tag color="green">最新</Tag>}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {version.releaseDate}
                  </Text>
                </Space>
              </Option>
            ))}
          </Select>
          
          {selectedVersions[1] && (
            <div style={{ marginTop: 8 }}>
              {(() => {
                const versionInfo = getVersionInfo(selectedVersions[1]);
                return versionInfo ? (
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="发布日期">
                      {versionInfo.releaseDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="文件大小">
                      {(versionInfo.fileSize / 1024).toFixed(1)} KB
                    </Descriptions.Item>
                  </Descriptions>
                ) : null;
              })()}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );

  const renderDiffSummary = () => {
    const addedCount = versionDiffs.filter(d => d.type === 'added').length;
    const removedCount = versionDiffs.filter(d => d.type === 'removed').length;
    const modifiedCount = versionDiffs.filter(d => d.type === 'modified').length;

    return (
      <Alert
        message="版本差异概览"
        description={
          <Space size="large">
            <Text>
              <PlusOutlined style={{ color: '#52c41a' }} /> 新增: {addedCount} 项
            </Text>
            <Text>
              <MinusOutlined style={{ color: '#ff4d4f' }} /> 删除: {removedCount} 项
            </Text>
            <Text>
              <EditOutlined style={{ color: '#1890ff' }} /> 修改: {modifiedCount} 项
            </Text>
          </Space>
        }
        type="info"
        style={{ marginBottom: 16 }}
      />
    );
  };

  const renderDiffDetails = () => (
    <Collapse defaultActiveKey={['1']} ghost>
      <Panel header="详细差异对比" key="1">
        <List
          dataSource={versionDiffs}
          renderItem={(diff, index) => (
            <List.Item key={index}>
              <Card 
                size="small" 
                style={{ width: '100%' }}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    {getDiffIcon(diff.type)}
                    <Tag color={getDiffColor(diff.type)}>
                      {getDiffText(diff.type)}
                    </Tag>
                    <Text strong>{diff.section}</Text>
                  </Space>
                  
                  {diff.type === 'modified' && diff.oldContent && (
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>原内容:</Text>
                      <Paragraph 
                        style={{ 
                          background: '#fff2f0', 
                          padding: '8px', 
                          margin: '4px 0',
                          borderLeft: '3px solid #ff4d4f'
                        }}
                      >
                        {diff.oldContent}
                      </Paragraph>
                      <Text type="secondary" style={{ fontSize: '12px' }}>新内容:</Text>
                    </div>
                  )}
                  
                  <Paragraph 
                    style={{ 
                      background: diff.type === 'added' ? '#f6ffed' : 
                                 diff.type === 'removed' ? '#fff2f0' : 
                                 '#e6f7ff',
                      padding: '8px',
                      margin: '4px 0',
                      borderLeft: `3px solid ${
                        diff.type === 'added' ? '#52c41a' :
                        diff.type === 'removed' ? '#ff4d4f' :
                        '#1890ff'
                      }`
                    }}
                  >
                    {diff.content}
                  </Paragraph>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Panel>
    </Collapse>
  );

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          <span>{templateName} - 版本对比</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        selectedVersions[0] && onDownloadVersion && (
          <Button
            key="download-a"
            icon={<DownloadOutlined />}
            onClick={() => onDownloadVersion(selectedVersions[0])}
          >
            下载版本 {selectedVersions[0]}
          </Button>
        ),
        selectedVersions[1] && onDownloadVersion && (
          <Button
            key="download-b"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => onDownloadVersion(selectedVersions[1])}
          >
            下载版本 {selectedVersions[1]}
          </Button>
        )
      ].filter(Boolean)}
      loading={loading}
    >
      {renderVersionSelector()}
      
      {versionDiffs.length > 0 && (
        <>
          {renderDiffSummary()}
          {renderDiffDetails()}
        </>
      )}
      
      {selectedVersions[0] && selectedVersions[1] && 
       selectedVersions[0] === selectedVersions[1] && (
        <Alert
          message="请选择不同的版本进行比较"
          type="warning"
          style={{ marginTop: 16 }}
        />
      )}
      
      {versionDiffs.length === 0 && selectedVersions[0] && selectedVersions[1] && 
       selectedVersions[0] !== selectedVersions[1] && !loading && (
        <Alert
          message="这两个版本之间没有发现差异"
          type="success"
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  );
};

export default TemplateVersionCompare;