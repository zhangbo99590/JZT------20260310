/**
 * 快捷工具集合组件
 * 创建时间: 2026-02-26
 * 功能: 提供常用工具如计算器、汇率转换、政策搜索等实用功能
 */

import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Modal, Typography, message } from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined,
  ToolOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface QuickTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const QuickToolsSection: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const tools: QuickTool[] = [
    {
      id: 'search',
      title: '政策搜索',
      description: '快速查找相关政策',
      icon: <SearchOutlined style={{ fontSize: 24 }} />,
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    {
      id: 'template',
      title: '模板下载',
      description: '申报表格模板',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      color: '#eb2f96',
      bgColor: '#fff0f6'
    },
    {
      id: 'links',
      title: '常用链接',
      description: '政府官网快速访问',
      icon: <LinkOutlined style={{ fontSize: 24 }} />,
      color: '#13c2c2',
      bgColor: '#e6fffb'
    }
  ];

  const handlePolicySearch = () => {
    if (searchKeyword.trim()) {
      message.info(`正在搜索"${searchKeyword}"相关政策...`);
      // 这里可以集成实际的搜索功能
    }
  };

  const commonLinks = [
    { name: '国家政务服务平台', url: 'https://www.gov.cn' },
    { name: '中小企业公共服务平台', url: '#' },
    { name: '科技部政策查询', url: '#' },
    { name: '税务局官网', url: '#' },
    { name: '工商局企业信息', url: '#' }
  ];

  const templates = [
    { name: '高新技术企业认定申请书', size: '2.5MB' },
    { name: '研发费用加计扣除明细表', size: '1.8MB' },
    { name: '小微企业补贴申报表', size: '1.2MB' },
    { name: '创新券申请表', size: '0.9MB' }
  ];

  const renderModalContent = () => {
    switch (activeModal) {
      case 'search':
        return (
          <div>
            <Input.Search
              placeholder="输入关键词搜索政策"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handlePolicySearch}
              enterButton="搜索"
              size="large"
            />
            <div style={{ marginTop: '16px' }}>
              <Text strong>热门搜索:</Text>
              <div style={{ marginTop: '8px' }}>
                {['高新技术企业', '研发费用', '小微企业', '创新券', '人才补贴'].map(keyword => (
                  <Button 
                    key={keyword}
                    size="small" 
                    type="link"
                    onClick={() => setSearchKeyword(keyword)}
                    style={{ padding: '0 8px' }}
                  >
                    {keyword}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'template':
        return (
          <div>
            <Text strong>常用申报模板:</Text>
            <div style={{ marginTop: '16px' }}>
              {templates.map((template, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  <div>
                    <Text strong>{template.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      文件大小: {template.size}
                    </Text>
                  </div>
                  <Button type="primary" size="small">
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'links':
        return (
          <div>
            <Text strong>政府服务网站:</Text>
            <div style={{ marginTop: '16px' }}>
              {commonLinks.map((link, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  <Text>{link.name}</Text>
                  <Button type="link" size="small" onClick={() => window.open(link.url, '_blank')}>
                    访问 <LinkOutlined />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ToolOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
            快捷工具
          </div>
        }
      >
        <Row gutter={[12, 12]}>
          {tools.map((tool) => (
            <Col xs={12} sm={8} md={6} lg={4} key={tool.id}>
              <Card
                size="small"
                className="hover-card"
                style={{
                  cursor: 'pointer',
                  backgroundColor: tool.bgColor,
                  border: `1px solid ${tool.color}30`,
                  height: '100px'
                }}
                onClick={() => setActiveModal(tool.id)}
                styles={{
                  body: {
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                  }
                }}
              >
                <div style={{ color: tool.color, marginBottom: '8px' }}>
                  {tool.icon}
                </div>
                <Text strong style={{ fontSize: '12px', color: tool.color }}>
                  {tool.title}
                </Text>
                <Text type="secondary" style={{ fontSize: '10px', marginTop: '2px' }}>
                  {tool.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={tools.find(t => t.id === activeModal)?.title}
        open={!!activeModal}
        onCancel={() => setActiveModal(null)}
        footer={null}
        width={600}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};
