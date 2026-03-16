/**
 * 快捷工具集合组件
 * 创建时间: 2026-02-26
 * 功能: 提供常用工具如计算器、汇率转换、政策搜索等实用功能
 */

import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Modal, Select, Typography, Divider, Upload, message, InputNumber } from 'antd';
import { 
  CalculatorOutlined, 
  SearchOutlined, 
  UploadOutlined,
  DollarOutlined,
  FileTextOutlined,
  ToolOutlined,
  SwapOutlined,
  LinkOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [fromCurrency, setFromCurrency] = useState('CNY');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const tools: QuickTool[] = [
    {
      id: 'calculator',
      title: '智能计算器',
      description: '补贴金额、税收计算',
      icon: <CalculatorOutlined style={{ fontSize: 24 }} />,
      color: '#1890ff',
      bgColor: '#e6f7ff'
    },
    {
      id: 'search',
      title: '政策搜索',
      description: '快速查找相关政策',
      icon: <SearchOutlined style={{ fontSize: 24 }} />,
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    {
      id: 'currency',
      title: '汇率转换',
      description: '实时汇率查询转换',
      icon: <DollarOutlined style={{ fontSize: 24 }} />,
      color: '#fa8c16',
      bgColor: '#fff7e6'
    },
    {
      id: 'upload',
      title: '文档上传',
      description: '快速上传申报材料',
      icon: <UploadOutlined style={{ fontSize: 24 }} />,
      color: '#722ed1',
      bgColor: '#f9f0ff'
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

  // 模拟汇率数据
  const exchangeRates: { [key: string]: number } = {
    'CNY-USD': 0.14,
    'USD-CNY': 7.2,
    'CNY-EUR': 0.13,
    'EUR-CNY': 7.8,
    'CNY-JPY': 20.5,
    'JPY-CNY': 0.049
  };

  const handleCalculate = () => {
    try {
      // 使用 Function 构造函数代替 eval，提高安全性
       
      const result = new Function('return ' + calculatorInput.replace(/[^0-9+\-*/.() ]/g, ''))();
      setCalculatorResult(result.toString());
    } catch (error) {
      setCalculatorResult('计算错误');
    }
  };

  const handleCurrencyConvert = () => {
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const rate = exchangeRates[rateKey] || 1;
    setConvertedAmount(amount * rate);
  };

  const handlePolicySearch = () => {
    if (searchKeyword.trim()) {
      message.info(`正在搜索"${searchKeyword}"相关政策...`);
      // 这里可以集成实际的搜索功能
    }
  };

  const handleFileUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
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
      case 'calculator':
        return (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Input
                placeholder="输入计算表达式，如：100000*0.15"
                value={calculatorInput}
                onChange={(e) => setCalculatorInput(e.target.value)}
                onPressEnter={handleCalculate}
                style={{ marginBottom: '8px' }}
              />
              <Button type="primary" onClick={handleCalculate} block>
                计算
              </Button>
            </div>
            {calculatorResult && (
              <div style={{ 
                padding: '16px', 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                  结果: {calculatorResult}
                </Text>
              </div>
            )}
            <Divider />
            <div>
              <Text strong>常用计算:</Text>
              <div style={{ marginTop: '8px' }}>
                <Button size="small" onClick={() => setCalculatorInput('100000*0.15')} style={{ margin: '2px' }}>
                  研发费用扣除(15%)
                </Button>
                <Button size="small" onClick={() => setCalculatorInput('500000*0.25')} style={{ margin: '2px' }}>
                  企业所得税(25%)
                </Button>
                <Button size="small" onClick={() => setCalculatorInput('1000000*0.03')} style={{ margin: '2px' }}>
                  小规模纳税人(3%)
                </Button>
              </div>
            </div>
          </div>
        );

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

      case 'currency':
        return (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text>金额:</Text>
                <InputNumber
                  value={amount}
                  onChange={(value) => setAmount(value || 0)}
                  style={{ width: '100%', marginTop: '4px' }}
                  min={0}
                />
              </Col>
              <Col span={8}>
                <Text>从:</Text>
                <Select value={fromCurrency} onChange={setFromCurrency} style={{ width: '100%', marginTop: '4px' }}>
                  <Option value="CNY">人民币 (CNY)</Option>
                  <Option value="USD">美元 (USD)</Option>
                  <Option value="EUR">欧元 (EUR)</Option>
                  <Option value="JPY">日元 (JPY)</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Text>到:</Text>
                <Select value={toCurrency} onChange={setToCurrency} style={{ width: '100%', marginTop: '4px' }}>
                  <Option value="USD">美元 (USD)</Option>
                  <Option value="CNY">人民币 (CNY)</Option>
                  <Option value="EUR">欧元 (EUR)</Option>
                  <Option value="JPY">日元 (JPY)</Option>
                </Select>
              </Col>
            </Row>
            <Button type="primary" onClick={handleCurrencyConvert} block style={{ margin: '16px 0' }}>
              <SwapOutlined /> 转换
            </Button>
            {convertedAmount > 0 && (
              <div style={{ 
                padding: '16px', 
                background: '#e6f7ff', 
                border: '1px solid #91d5ff',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                  {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
                </Text>
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <div>
            <Upload.Dragger
              name="file"
              multiple
              action="/api/upload"
              onChange={handleFileUpload}
              style={{ marginBottom: '16px' }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持PDF、Word、Excel等格式
              </p>
            </Upload.Dragger>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              * 单个文件不超过10MB，总大小不超过50MB
            </Text>
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
