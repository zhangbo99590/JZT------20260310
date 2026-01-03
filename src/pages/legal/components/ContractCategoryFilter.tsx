/**
 * 合同分类筛选组件
 * 支持树状导航和标签式筛选，显示分类统计数量
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Tree,
  Tag,
  Space,
  Badge,
  Radio,
  Spin,
  Empty,
  Typography,
  Divider,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { ContractCategory, ContractCategoryLabels } from '../../../types/contract';
import { contractService } from '../../../services/contractService';

const { Text } = Typography;

interface CategoryCount {
  category: ContractCategory;
  count: number;
  percentage: number;
}

interface ContractCategoryFilterProps {
  selectedCategory?: ContractCategory;
  onCategoryChange: (category?: ContractCategory) => void;
  mode?: 'tree' | 'tag';
}

const ContractCategoryFilter: React.FC<ContractCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  mode: initialMode = 'tag',
}) => {
  const [loading, setLoading] = useState(false);
  const [categoryStats, setCategoryStats] = useState<CategoryCount[]>([]);
  const [viewMode, setViewMode] = useState<'tree' | 'tag'>(initialMode);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['all']);

  // 加载分类统计数据
  useEffect(() => {
    const loadCategoryStats = async () => {
      setLoading(true);
      try {
        const statistics = await contractService.getStatistics();
        setCategoryStats(statistics.categoryDistribution);
      } catch (error) {
        console.error('加载分类统计失败:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryStats();
  }, []);

  // 构建树状数据
  const treeData: DataNode[] = [
    {
      title: (
        <Space>
          <Text strong>全部合同</Text>
          <Badge
            count={categoryStats.reduce((sum, item) => sum + item.count, 0)}
            style={{ backgroundColor: '#1890ff' }}
          />
        </Space>
      ),
      key: 'all',
      icon: <FolderOpenOutlined style={{ color: '#1890ff' }} />,
      children: categoryStats.map(stat => ({
        title: (
          <Space>
            <Text>{ContractCategoryLabels[stat.category]}</Text>
            <Badge count={stat.count} style={{ backgroundColor: '#52c41a' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({stat.percentage.toFixed(1)}%)
            </Text>
          </Space>
        ),
        key: stat.category,
        icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
      })),
    },
  ];

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) return;
    
    const key = selectedKeys[0] as string;
    if (key === 'all') {
      onCategoryChange(undefined);
    } else {
      onCategoryChange(key as ContractCategory);
    }
  };

  // 处理标签点击
  const handleTagClick = (category?: ContractCategory) => {
    onCategoryChange(category);
  };

  // 获取分类颜色
  const getCategoryColor = (category: ContractCategory): string => {
    const colorMap: Record<ContractCategory, string> = {
      [ContractCategory.LIFE_CONSUMPTION]: '#1890ff',
      [ContractCategory.COMPANY_ESTABLISHMENT]: '#52c41a',
      [ContractCategory.COMPANY_OPERATION]: '#fa8c16',
      [ContractCategory.ECONOMIC_TRADE]: '#eb2f96',
      [ContractCategory.PERSONAL_CONTRACT]: '#722ed1',
    };
    return colorMap[category] || '#1890ff';
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Spin spinning={true} />
          <div style={{ marginTop: 16, color: '#666' }}>加载分类数据中...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <FolderOutlined />
          <Text strong>合同分类</Text>
        </Space>
      }
      extra={
        <Radio.Group
          value={viewMode}
          onChange={e => setViewMode(e.target.value)}
          size="small"
          optionType="button"
        >
          <Radio.Button value="tag">
            <AppstoreOutlined /> 标签
          </Radio.Button>
          <Radio.Button value="tree">
            <UnorderedListOutlined /> 树状
          </Radio.Button>
        </Radio.Group>
      }
      styles={{ body: { padding: '16px' } }}
    >
      {categoryStats.length === 0 ? (
        <Empty description="暂无分类数据" />
      ) : viewMode === 'tree' ? (
        // 树状导航模式
        <Tree
          showIcon
          defaultExpandAll
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={selectedCategory ? [selectedCategory] : ['all']}
          onSelect={handleTreeSelect}
          treeData={treeData}
          style={{ background: 'transparent' }}
        />
      ) : (
        // 标签式筛选模式
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 全部合同 */}
          <div>
            <Tag
              color={!selectedCategory ? 'blue' : 'default'}
              style={{
                cursor: 'pointer',
                padding: '8px 16px',
                fontSize: 14,
                borderRadius: 6,
                transition: 'all 0.3s ease',
                border: !selectedCategory ? '2px solid #1890ff' : '1px solid #d9d9d9',
                fontWeight: !selectedCategory ? 600 : 400,
              }}
              onClick={() => handleTagClick(undefined)}
            >
              <Space>
                <FolderOpenOutlined />
                <Text strong={!selectedCategory}>全部合同</Text>
                <Badge
                  count={categoryStats.reduce((sum, item) => sum + item.count, 0)}
                  style={{
                    backgroundColor: !selectedCategory ? '#1890ff' : '#d9d9d9',
                  }}
                />
              </Space>
            </Tag>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          {/* 分类标签 */}
          <Row gutter={[12, 12]}>
            {categoryStats.map(stat => {
              const isSelected = selectedCategory === stat.category;
              const color = getCategoryColor(stat.category);
              
              return (
                <Col xs={24} sm={12} key={stat.category}>
                  <Tooltip
                    title={`${ContractCategoryLabels[stat.category]} - ${stat.percentage.toFixed(1)}%`}
                  >
                    <Tag
                      color={isSelected ? color : 'default'}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 16px',
                        fontSize: 14,
                        borderRadius: 6,
                        width: '100%',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        border: isSelected ? `2px solid ${color}` : '1px solid #d9d9d9',
                        fontWeight: isSelected ? 600 : 400,
                        boxShadow: isSelected ? `0 2px 8px ${color}40` : 'none',
                      }}
                      onClick={() => handleTagClick(stat.category)}
                    >
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Space>
                          <FileTextOutlined />
                          <Text strong={isSelected}>
                            {ContractCategoryLabels[stat.category]}
                          </Text>
                        </Space>
                        <Space size="large">
                          <Badge
                            count={stat.count}
                            style={{
                              backgroundColor: isSelected ? color : '#d9d9d9',
                            }}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {stat.percentage.toFixed(1)}%
                          </Text>
                        </Space>
                      </Space>
                    </Tag>
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
        </Space>
      )}
    </Card>
  );
};

export default ContractCategoryFilter;
