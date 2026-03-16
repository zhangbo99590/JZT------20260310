/**
 * 智能数据看板组件
 * 创建时间: 2026-02-26
 * 功能: 提供丰富的数据分析图表和政策热力图
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Tabs, Typography, Progress, message, Button } from 'antd';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined,
  HeatMapOutlined,
  TrophyOutlined,
  RiseOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SafeECharts from '../../../components/SafeECharts';
import { 
  getSmartTrendOption, 
  getPolicyDistributionOption, 
  getFundFlowOption 
} from '../config/chartConfig';
import { removeElement } from '../../../utils/domUtils';

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// 模拟政策申报趋势数据
const applicationTrendData = [
  { month: '1月', applications: 45, success: 38, amount: 2800000 },
  { month: '2月', applications: 52, success: 44, amount: 3200000 },
  { month: '3月', applications: 38, success: 32, amount: 2400000 },
  { month: '4月', applications: 65, success: 58, amount: 4100000 },
  { month: '5月', applications: 71, success: 62, amount: 4800000 },
  { month: '6月', applications: 58, success: 51, amount: 3900000 }
];

// 政策类型分布数据
const policyTypeData = [
  { name: '技术创新', value: 35, color: '#1890ff' },
  { name: '人才引进', value: 25, color: '#52c41a' },
  { name: '税收优惠', value: 20, color: '#fa8c16' },
  { name: '融资支持', value: 12, color: '#722ed1' },
  { name: '其他', value: 8, color: '#eb2f96' }
];

// 资金流向分析数据
const fundFlowData = [
  { category: '研发投入', Q1: 1200000, Q2: 1500000, Q3: 1800000, Q4: 2100000 },
  { category: '设备采购', Q1: 800000, Q2: 950000, Q3: 1100000, Q4: 1300000 },
  { category: '人才培养', Q1: 600000, Q2: 720000, Q3: 850000, Q4: 980000 },
  { category: '市场推广', Q1: 400000, Q2: 480000, Q3: 560000, Q4: 640000 }
];

// 政策热力图数据
const policyHeatmapData = [
  { policy: '高新技术企业认定', heat: 95, applications: 128, successRate: 87 },
  { policy: '科技创新券', heat: 88, applications: 96, successRate: 92 },
  { policy: '研发费用加计扣除', heat: 82, applications: 156, successRate: 78 },
  { policy: '小微企业税收优惠', heat: 76, applications: 203, successRate: 85 },
  { policy: '创业担保贷款', heat: 71, applications: 67, successRate: 73 },
  { policy: '人才引进补贴', heat: 68, applications: 89, successRate: 81 }
];

interface SmartDashboardSectionProps {
  loading?: boolean;
}

export const SmartDashboardSection: React.FC<SmartDashboardSectionProps> = ({ loading = false }) => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [activeTab, setActiveTab] = useState('trend');
  const [isVisible, setIsVisible] = useState(true);

  // 如果组件已被删除，则不渲染任何内容
  if (!isVisible) {
    return null;
  }

  const handleDelete = async () => {
    // 查找目标元素 - 这里我们给外层 Card 添加一个特定的 ID 以便精确查找
    const targetId = 'smart-dashboard-card';
    const element = document.getElementById(targetId);
    
    if (!element) {
      message.error('未找到目标元素');
      return;
    }

    const result = await removeElement(element, {
      sync: false,
      beforeDelete: async () => {
        // 模拟一些清理工作或确认对话框
        return new Promise<boolean>((resolve) => {
          // 这里可以添加确认弹窗逻辑
          const confirmed = window.confirm('确定要删除这个智能数据看板吗？此操作不可逆。');
          resolve(confirmed);
        });
      },
      afterDelete: () => {
        // 更新组件状态以触发 React 重新渲染（虽然 DOM 已经被删除了，但为了保持 React 状态一致性）
        setIsVisible(false);
        message.success('智能数据看板已成功删除');
      }
    });

    if (!result.success && result.message !== '删除操作被 beforeDelete 钩子取消') {
      message.error(result.message);
    }
  };

  const getHeatColor = (heat: number) => {
    if (heat >= 90) return '#ff4d4f';
    if (heat >= 80) return '#fa8c16';
    if (heat >= 70) return '#fadb14';
    if (heat >= 60) return '#52c41a';
    return '#1890ff';
  };

  const handleChartClick = (params: any) => {
    if (params.componentType === 'series') {
      const monthData = applicationTrendData[params.dataIndex];
      message.info(`查看 ${monthData.month} 的申报记录`);
    }
  };

  const items = [
    {
      key: 'trend',
      label: (
        <span>
          <LineChartOutlined />
          申报趋势
        </span>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <div style={{ height: '300px' }}>
              <SafeECharts 
                option={getSmartTrendOption(applicationTrendData)} 
                style={{ height: '100%', width: '100%' }}
                onEvents={{
                  click: handleChartClick
                }}
              />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div style={{ padding: '20px 0' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>
                <TrophyOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                关键指标
              </Title>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary">平均成功率</Text>
                <div style={{ marginTop: '8px' }}>
                  <Progress 
                    percent={87} 
                    strokeColor="#52c41a"
                    format={() => '87%'}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary">月均申报量</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text strong style={{ fontSize: '24px', color: '#1890ff' }}>
                    55
                  </Text>
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    <RiseOutlined style={{ color: '#52c41a' }} /> +12%
                  </Text>
                </div>
              </div>
              <div>
                <Text type="secondary">累计获得资金</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text strong style={{ fontSize: '20px', color: '#722ed1' }}>
                    ¥2,130万
                  </Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ),
    },
    {
      key: 'distribution',
      label: (
        <span>
          <PieChartOutlined />
          政策分布
        </span>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div style={{ height: '300px' }}>
              <SafeECharts option={getPolicyDistributionOption(policyTypeData)} style={{ height: '100%', width: '100%' }} />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div style={{ height: '300px' }}>
              <SafeECharts option={getFundFlowOption(fundFlowData)} style={{ height: '100%', width: '100%' }} />
            </div>
          </Col>
        </Row>
      ),
    },
    {
      key: 'heatmap',
      label: (
        <span>
          <HeatMapOutlined />
          政策热度
        </span>
      ),
      children: (
        <div style={{ padding: '16px 0' }}>
          <Title level={4} style={{ marginBottom: '20px' }}>
            政策申报热力排行
          </Title>
          <Row gutter={[16, 12]}>
            {policyHeatmapData.map((item, index) => (
              <Col span={24} key={index}>
                <Card 
                  size="small" 
                  style={{ 
                    background: `linear-gradient(90deg, ${getHeatColor(item.heat)}15 0%, transparent 100%)`,
                    border: `1px solid ${getHeatColor(item.heat)}30`
                  }}
                >
                  <Row align="middle">
                    <Col span={8}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div 
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: getHeatColor(item.heat),
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginRight: '12px'
                          }}
                        >
                          {index + 1}
                        </div>
                        <Text strong>{item.policy}</Text>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: getHeatColor(item.heat) }}>
                          {item.heat}
                        </Text>
                        <div style={{ fontSize: '11px', color: '#999' }}>热度</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong>{item.applications}</Text>
                        <div style={{ fontSize: '11px', color: '#999' }}>申报量</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: item.successRate > 80 ? '#52c41a' : '#fa8c16' }}>
                          {item.successRate}%
                        </Text>
                        <div style={{ fontSize: '11px', color: '#999' }}>成功率</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
  ];

  return (
    <Card
      id="smart-dashboard-card"
      loading={loading}
      className="hover-card"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BarChartOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            智能数据看板
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="3months">近3个月</Option>
              <Option value="6months">近6个月</Option>
              <Option value="1year">近1年</Option>
            </Select>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={handleDelete}
              title="删除此看板"
            />
          </div>
        </div>
      }
      style={{ marginBottom: '24px' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </Card>
  );
};
