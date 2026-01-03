/**
 * 合同详情页面 - 优化版
 * 采用文档风格布局：左侧合同内容，右侧操作和信息栏
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Spin,
  Empty,
  Typography,
  Divider,
  Alert,
  message,
  Breadcrumb,
} from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { contractService } from '../../services/contractService';
import type { ContractDetail as ContractDetailType } from '../../types/contract';
import { ContractCategoryLabels } from '../../types/contract';

const { Title, Paragraph, Text } = Typography;

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ContractDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 加载合同详情
  useEffect(() => {
    const loadDetail = async () => {
      if (!id) {
        setError('合同ID不存在');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await contractService.getContractDetail(id);
        if (data) {
          setDetail(data);
        } else {
          setError('合同不存在或已被删除');
        }
      } catch (err) {
        console.error('加载合同详情失败:', err);
        setError('加载合同详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  // 返回列表
  const handleBack = () => {
    navigate('/legal-support/contract-management');
  };

  // 下载Word文档
  const handleDownloadWord = () => {
    if (detail) {
      message.loading({ content: '正在准备Word文档...', key: 'download' });
      setTimeout(() => {
        message.success({ content: `${detail.title}.docx 下载成功！`, key: 'download', duration: 2 });
      }, 1000);
    }
  };

  // 下载PDF文档
  const handleDownloadPDF = () => {
    if (detail) {
      message.loading({ content: '正在准备PDF文档...', key: 'download' });
      setTimeout(() => {
        message.success({ content: `${detail.title}.pdf 下载成功！`, key: 'download', duration: 2 });
      }, 1000);
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Spin spinning={true} size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>加载合同详情中...</div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !detail) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        <Card>
          <Empty
            description={error || '合同不存在'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleBack}>
              返回列表
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 主要内容 */}
      <Row gutter={24}>
        {/* 左侧：合同内容 */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              background: '#fff',
              minHeight: '800px',
              padding: '40px 60px',
            }}
          >
            {/* 合同编号 */}
            <div style={{ marginBottom: 40 }}>
              <Text strong style={{ fontSize: 16 }}>
                {detail.id}
              </Text>
            </div>

            {/* 合同标题 */}
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <Title level={2} style={{ margin: 0, fontSize: 32, fontWeight: 'bold' }}>
                {detail.title.replace(/示例.*$/, '')}
              </Title>
              <Text type="secondary" style={{ fontSize: 16, marginTop: 16, display: 'block' }}>
                （示范文本）
              </Text>
            </div>

            {/* 制定单位和日期 */}
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                {detail.partyA}
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                制定
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                {detail.signDate.replace(/-/g, '年').replace(/年(\d+)$/, '年$1月')}
              </Paragraph>
            </div>

            <Divider />

            {/* 使用说明 */}
            <div style={{ marginBottom: 40 }}>
              <Title level={3} style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>
                使用说明
              </Title>
              <Paragraph style={{ fontSize: 14, lineHeight: 2, textIndent: '2em' }}>
                一、本合同文本为示范文本，供赠与人将自己的财产无偿给予受赠人时参照使用。
              </Paragraph>
              <Paragraph style={{ fontSize: 14, lineHeight: 2, textIndent: '2em' }}>
                二、双方当事人在签约之前应当仔细阅读本合同文本全部内容，结合具体情况确定具有选择性、补充性、填充性、修改性的条款，并承担合同订立、履行所产生的法律后果。
              </Paragraph>
              <Paragraph style={{ fontSize: 14, lineHeight: 2, textIndent: '2em' }}>
                三、本合同文本的相关条款中留有空白位置，供当事人自行约定或者补充约定。双方当事人可以选择文本条款中所提供的选择项，同意的在选择项前的□中画√，双方缺少事人可以对文本条款的内容进行修改、增补或者删减。
              </Paragraph>
            </div>

            {/* 合同正文 */}
            {detail.sections?.map((section, index) => (
              <div key={index} style={{ marginBottom: 40 }}>
                <Title level={4} style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
                  {section.title}
                </Title>
                {section.clauses?.map((clause, cIndex) => (
                  <div key={cIndex} style={{ marginBottom: 20 }}>
                    <Paragraph style={{ fontSize: 14, lineHeight: 2, textIndent: '2em' }}>
                      <Text strong>{clause.number}、</Text>
                      {clause.content}
                    </Paragraph>
                    {clause.important && (
                      <Alert
                        message={clause.note}
                        type="warning"
                        showIcon
                        style={{ marginTop: 8, marginLeft: 32 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* 签署信息 */}
            <div style={{ marginTop: 80 }}>
              <Row gutter={[48, 32]}>
                <Col span={12}>
                  <Paragraph style={{ fontSize: 14, lineHeight: 2 }}>
                    <Text strong>甲方（赠与人）：</Text>
                    {detail.partyA}
                  </Paragraph>
                  <Paragraph style={{ fontSize: 14, lineHeight: 2 }}>
                    <Text strong>签订日期：</Text>
                    {detail.signDate}
                  </Paragraph>
                </Col>
                <Col span={12}>
                  <Paragraph style={{ fontSize: 14, lineHeight: 2 }}>
                    <Text strong>乙方（受赠人）：</Text>
                    {detail.partyB}
                  </Paragraph>
                  <Paragraph style={{ fontSize: 14, lineHeight: 2 }}>
                    <Text strong>签订日期：</Text>
                    {detail.signDate}
                  </Paragraph>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* 右侧：操作和信息栏 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 返回按钮 */}
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              block
              size="large"
            >
              返回列表
            </Button>

            {/* 下载按钮 */}
            <Card size="small">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                  type="primary"
                  danger
                  icon={<FileWordOutlined />}
                  onClick={handleDownloadWord}
                  block
                  size="large"
                  style={{ height: 48 }}
                >
                  ↓ 下载Word文档
                </Button>
                <Button
                  danger
                  icon={<FilePdfOutlined />}
                  onClick={handleDownloadPDF}
                  block
                  size="large"
                  style={{ height: 48, background: '#fff', borderColor: '#ff4d4f', color: '#ff4d4f' }}
                >
                  ↓ 下载PDF文档
                </Button>
              </Space>
            </Card>

            {/* 发布信息 */}
            <Card title="发布信息" size="small">
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                  <Text type="secondary">发布机关：</Text>
                  <Text>{detail.partyA}</Text>
                </div>
                <div>
                  <Text type="secondary">发布年份：</Text>
                  <Text>{detail.year}年</Text>
                </div>
                <div>
                  <Text type="secondary">发布编号：</Text>
                  <Text>{detail.id}</Text>
                </div>
              </Space>
            </Card>

            {/* 风险提示 */}
            <Card
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  <Text strong style={{ color: '#ff4d4f' }}>
                    风险提示
                  </Text>
                </Space>
              }
              size="small"
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                  message="向股东以外的人赠与股权时，需考虑是否先购买权问题"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                        如果是向股东以外的人赠与股权（即受让元转让），则其他股东应优先购买...
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          展开
                        </Button>
                      </Paragraph>
                    </div>
                  }
                  type="warning"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />

                <Alert
                  message="受赠人可以是未成年人"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                        《民法典》第19条规定，限制民事行为能力人可以独立实施纯获利益...
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          展开
                        </Button>
                      </Paragraph>
                    </div>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />

                <Alert
                  message="应注意签名盖章手续的处理"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                        1.审查公司签名盖章手续时，一般而言，公司或合同专用章即可...
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          展开
                        </Button>
                      </Paragraph>
                    </div>
                  }
                  type="warning"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />

                <Alert
                  message="注意如下优先选择法院管辖的情形"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                        1.对于合同中约定的权利义务涉及第三方主体的，优先选择法院...
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          展开
                        </Button>
                      </Paragraph>
                    </div>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />

                <Alert
                  message="注意如下可优先选择仲裁的情形"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                        1.涉及保密的，不宜公开披露的合同、交易...
                        <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
                          展开
                        </Button>
                      </Paragraph>
                    </div>
                  }
                  type="warning"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />
              </Space>
            </Card>

            {/* 统计信息 */}
            <Card title="统计信息" size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {detail.viewCount}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>浏览次数</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {detail.downloadCount}
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>下载次数</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ContractDetail;
