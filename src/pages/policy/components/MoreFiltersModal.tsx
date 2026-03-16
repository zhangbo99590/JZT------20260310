/**
 * 更多筛选弹窗组件
 * 包含级别、机构分类、政策发文机构、补贴类型等详细筛选选项
 */

import React, { useState } from 'react';
import { Modal, Tabs, Checkbox, Button, Space, Divider, Tag } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

// 级别筛选选项
const LEVEL_OPTIONS = [
  { value: 'national', label: '国家级', count: 1250 },
  { value: 'provincial', label: '省级', count: 890 },
  { value: 'municipal', label: '市级', count: 2340 },
  { value: 'district', label: '区县级', count: 1680 }
];

// 机构分类选项
const ORG_TYPE_OPTIONS = [
  { value: 'government', label: '政府部门', count: 3200 },
  { value: 'finance', label: '金融机构', count: 450 },
  { value: 'industry', label: '行业协会', count: 680 },
  { value: 'research', label: '科研院所', count: 320 },
  { value: 'enterprise', label: '企业机构', count: 890 }
];

// 政策发文机构选项
const POLICY_ORG_OPTIONS = [
  { value: 'ndrc', label: '国家发展改革委', count: 280 },
  { value: 'miit', label: '工业和信息化部', count: 450 },
  { value: 'most', label: '科学技术部', count: 380 },
  { value: 'mof', label: '财政部', count: 520 },
  { value: 'mofcom', label: '商务部', count: 320 },
  { value: 'local_gov', label: '地方政府', count: 2100 },
  { value: 'other_ministry', label: '其他部委', count: 890 }
];

// 补贴类型选项
const SUBSIDY_TYPE_OPTIONS = [
  { value: 'direct_subsidy', label: '直接补贴', count: 1200 },
  { value: 'tax_incentive', label: '税收优惠', count: 890 },
  { value: 'loan_discount', label: '贷款贴息', count: 450 },
  { value: 'fund_support', label: '基金支持', count: 320 },
  { value: 'qualification', label: '资质认定', count: 680 },
  { value: 'award_reward', label: '奖励表彰', count: 240 }
];

interface MoreFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (filters: Record<string, string[]>) => void;
  initialFilters?: Record<string, string[]>;
}

const MoreFiltersModal: React.FC<MoreFiltersModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialFilters = {}
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(initialFilters);

  // 处理筛选项变化
  const handleFilterChange = (category: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: values
    }));
  };

  // 重置所有筛选
  const handleReset = () => {
    setSelectedFilters({});
  };

  // 确认筛选
  const handleConfirm = () => {
    onConfirm(selectedFilters);
    onClose();
  };

  // 获取已选筛选条件总数
  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  // 渲染筛选选项组
  const renderFilterGroup = (
    title: string,
    options: Array<{ value: string; label: string; count: number }>,
    category: string
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <span className="text-xs text-gray-400">
          已选 {selectedFilters[category]?.length || 0} 项
        </span>
      </div>
      <Checkbox.Group
        value={selectedFilters[category] || []}
        onChange={(values) => handleFilterChange(category, values as string[])}
        className="w-full"
      >
        <div className="grid grid-cols-2 gap-2">
          {options.map(option => (
            <Checkbox
              key={option.value}
              value={option.value}
              className="flex items-center p-2 rounded hover:bg-gray-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-700">{option.label}</span>
                <span className="text-xs text-gray-400 ml-2">({option.count})</span>
              </div>
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-blue-600" />
          <span>更多筛选条件</span>
          {getTotalSelectedCount() > 0 && (
            <Tag color="blue" className="ml-2">
              已选 {getTotalSelectedCount()} 项
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        <div className="flex items-center justify-between">
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            disabled={getTotalSelectedCount() === 0}
          >
            重置筛选
          </Button>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleConfirm}>
              确定筛选 {getTotalSelectedCount() > 0 && `(${getTotalSelectedCount()})`}
            </Button>
          </Space>
        </div>
      }
      styles={{ body: { maxHeight: '600px', overflowY: 'auto' } }}
    >
      <Tabs defaultActiveKey="level" type="card">
        <TabPane tab="级别筛选" key="level">
          {renderFilterGroup('政策级别', LEVEL_OPTIONS, 'level')}
        </TabPane>
        
        <TabPane tab="机构分类" key="orgType">
          {renderFilterGroup('机构类型', ORG_TYPE_OPTIONS, 'orgType')}
        </TabPane>
        
        <TabPane tab="发文机构" key="policyOrg">
          {renderFilterGroup('政策发文机构', POLICY_ORG_OPTIONS, 'policyOrg')}
        </TabPane>
        
        <TabPane tab="补贴类型" key="subsidyType">
          {renderFilterGroup('补贴支持类型', SUBSIDY_TYPE_OPTIONS, 'subsidyType')}
        </TabPane>
      </Tabs>

      {/* 已选筛选条件预览 */}
      {getTotalSelectedCount() > 0 && (
        <>
          <Divider />
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">已选筛选条件预览</span>
              <span className="text-xs text-blue-600">{getTotalSelectedCount()} 项</span>
            </div>
            <Space wrap>
              {Object.entries(selectedFilters).map(([category, values]) =>
                values.map(value => {
                  const categoryMap: Record<string, string> = {
                    level: '级别',
                    orgType: '机构',
                    policyOrg: '发文',
                    subsidyType: '补贴'
                  };
                  
                  const optionMap: Record<string, any> = {
                    ...LEVEL_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.value]: opt.label }), {}),
                    ...ORG_TYPE_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.value]: opt.label }), {}),
                    ...POLICY_ORG_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.value]: opt.label }), {}),
                    ...SUBSIDY_TYPE_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.value]: opt.label }), {})
                  };

                  return (
                    <Tag
                      key={`${category}-${value}`}
                      color="blue"
                      closable
                      onClose={() => {
                        const newValues = selectedFilters[category].filter(v => v !== value);
                        handleFilterChange(category, newValues);
                      }}
                    >
                      {categoryMap[category]}: {optionMap[value]}
                    </Tag>
                  );
                })
              )}
            </Space>
          </div>
        </>
      )}
    </Modal>
  );
};

export default MoreFiltersModal;
