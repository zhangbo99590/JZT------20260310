import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Statistic,
  Row,
  Col,
  Typography,
  message,
  Alert,
  Divider
} from 'antd';
import {
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ClockCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { templateService, TemplateFile, TemplateCategory } from '../services/templateService';
import { formatFileSize } from '../utils/commonUtils';
import TemplateVersionManager from './TemplateVersionManager';

const { Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface TemplateDownloadProps {
  categoryFilter?: string;
  showStats?: boolean;
  compact?: boolean;
}

const TemplateDownload: React.FC<TemplateDownloadProps> = ({
  categoryFilter,
  showStats = true,
  compact = false
}) => {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFile | null>(null);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [selectedTemplateForVersion, setSelectedTemplateForVersion] = useState<TemplateFile | null>(null);
  const [downloading, setDownloading] = useState<string>('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // 加载模板数据
    const allCategories = templateService.getAllCategories();
    setCategories(allCategories);
    
    // 加载统计信息
    if (showStats) {
      const templateStats = templateService.getTemplateStats();
      setStats(templateStats);
    }

    // 初始化过滤
    filterTemplates(allCategories);
  }, []);

  useEffect(() => {
    filterTemplates(categories);
  }, [selectedCategory, selectedFormat, searchKeyword, categoryFilter]);

  const filterTemplates = (allCategories: TemplateCategory[]) => {
    let allTemplates: TemplateFile[] = [];
    
    // 收集所有模板
    allCategories.forEach(category => {
      allTemplates = [...allTemplates, ...category.templates];
    });

    // 应用过滤条件
    let filtered = allTemplates;

    // 分类过滤
    if (categoryFilter) {
      filtered = filtered.filter(template => template.category === categoryFilter);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // 格式过滤
    if (selectedFormat !== 'all') {
      filtered = filtered.filter(template => template.format === selectedFormat);
    }

    // 关键词搜索
    if (searchKeyword) {
      filtered = templateService.searchTemplates(searchKeyword);
    }

    setFilteredTemplates(filtered);
  };

  const handleDownload = async (template: TemplateFile) => {
    setDownloading(template.id);
    
    try {
      const result = await templateService.downloadTemplate(template.id);
      
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('下载失败，请稍后重试');
    } finally {
      setDownloading('');
    }
  };

  const handleViewVersionHistory = (template: TemplateFile) => {
    setSelectedTemplateForVersion(template);
    setVersionModalVisible(true);
  };

  const showTemplateDetail = (template: TemplateFile) => {
    setSelectedTemplate(template);
    setDetailModalVisible(true);
  };

  const handleDownloadVersion = async (version: string, downloadUrl: string) => {
    try {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${selectedTemplateForVersion?.name}_${version}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success(`${selectedTemplateForVersion?.name} ${version} 下载成功`);
    } catch (error) {
      message.error('下载失败，请稍后重试');
    }
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'docx':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#f5222d' }} />;
      default:
        return <FileTextOutlined />;
    }
  };


  return (
    <div>
      {/* 统计信息 */}
      {showStats && stats && !compact && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="模板总数"
                value={stats.total}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Word文档"
                value={stats.byFormat.docx || 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Excel表格"
                value={stats.byFormat.xlsx || 0}
                prefix={<FileExcelOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 搜索和过滤 */}
      {!compact && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索模板名称、描述或说明..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onSearch={setSearchKeyword}
              />
            </Col>
            {!categoryFilter && (
              <Col>
                <Select
                  style={{ width: 150 }}
                  placeholder="选择分类"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">全部分类</Option>
                  <Option value="application">申请书类</Option>
                  <Option value="financial">财务资料类</Option>
                  <Option value="technical">技术资料类</Option>
                </Select>
              </Col>
            )}
            <Col>
              <Select
                style={{ width: 120 }}
                placeholder="文件格式"
                value={selectedFormat}
                onChange={setSelectedFormat}
              >
                <Option value="all">全部格式</Option>
                <Option value="docx">Word</Option>
                <Option value="xlsx">Excel</Option>
                <Option value="pdf">PDF</Option>
              </Select>
            </Col>
          </Row>
        </Card>
      )}

      {/* 模板列表 */}
      <Card title={compact ? "相关模板" : "模板下载"}>
        {filteredTemplates.length === 0 ? (
          <Alert
            message="暂无模板"
            description="没有找到符合条件的模板文件"
            type="info"
            showIcon
          />
        ) : (
          <List
            itemLayout="vertical"
            size={compact ? "small" : "default"}
            dataSource={filteredTemplates}
            renderItem={(template) => (
              <List.Item
                key={template.id}
                actions={[
                  <Button
                    key="download"
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={downloading === template.id}
                    onClick={() => handleDownload(template)}
                  >
                    下载模板
                  </Button>,
                  <Button
                    key="version"
                    type="default"
                    icon={<HistoryOutlined />}
                    onClick={() => handleViewVersionHistory(template)}
                  >
                    版本历史
                  </Button>,
                  <Button
                    key="detail"
                    type="link"
                    icon={<InfoCircleOutlined />}
                    onClick={() => showTemplateDetail(template)}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={getFileIcon(template.format)}
                  title={
                    <Space>
                      <Text strong>{template.name}</Text>
                      <Tag color="blue">{template.version}</Tag>
                      {template.isRequired && <Tag color="red">必需</Tag>}
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: compact ? 1 : 2 }}>
                        {template.description}
                      </Paragraph>
                      <Space size="middle">
                        <Text type="secondary">
                          <ClockCircleOutlined /> 更新时间：{template.lastUpdated}
                        </Text>
                        <Text type="secondary">
                          文件大小：{formatFileSize(template.size)}
                        </Text>
                        <Text type="secondary">
                          格式：{template.format.toUpperCase()}
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 模板详情模态框 */}
      <Modal
        title={
          <Space>
            {selectedTemplate && getFileIcon(selectedTemplate.format)}
            <span>{selectedTemplate?.name}</span>
            <Tag color="blue">{selectedTemplate?.version}</Tag>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloading === selectedTemplate?.id}
            onClick={() => selectedTemplate && handleDownload(selectedTemplate)}
          >
            下载模板
          </Button>
        ]}
      >
        {selectedTemplate && (
          <div>
            <Alert
              message="模板信息"
              description={selectedTemplate.description}
              type="info"
              style={{ marginBottom: 16 }}
            />

            <Divider orientation="left">文件信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>文件名：</Text>
                <Text>{selectedTemplate.fileName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>文件格式：</Text>
                <Text>{selectedTemplate.format.toUpperCase()}</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Text strong>文件大小：</Text>
                <Text>{formatFileSize(selectedTemplate.size)}</Text>
              </Col>
              <Col span={12}>
                <Text strong>更新时间：</Text>
                <Text>{selectedTemplate.lastUpdated}</Text>
              </Col>
            </Row>

            <Divider orientation="left">填写说明</Divider>
            <Paragraph>{selectedTemplate.instructions}</Paragraph>

            {selectedTemplate.examples.length > 0 && (
              <>
                <Divider orientation="left">填写示例</Divider>
                <List
                  size="small"
                  dataSource={selectedTemplate.examples}
                  renderItem={(example) => (
                    <List.Item>
                      <Text code>{example}</Text>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 版本管理模态框 */}
      <TemplateVersionManager
        templateId={selectedTemplateForVersion?.id || ''}
        templateName={selectedTemplateForVersion?.name || ''}
        currentVersion={selectedTemplateForVersion?.version || ''}
        visible={versionModalVisible}
        onClose={() => {
          setVersionModalVisible(false);
          setSelectedTemplateForVersion(null);
        }}
        onDownloadVersion={handleDownloadVersion}
      />
    </div>
  );
};

export default TemplateDownload;