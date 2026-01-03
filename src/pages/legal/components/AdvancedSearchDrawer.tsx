/**
 * 高级检索抽屉组件
 * 提供多维度筛选功能：年份、地区、分类
 */

import React, { useState, useEffect } from 'react';
import { Drawer, Form, Select, Button, Space, Divider, DatePicker, Cascader, message } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { SearchParams, Region } from '../../../types/contract';
import { ContractCategory, ContractCategoryLabels } from '../../../types/contract';
import { contractService } from '../../../services/contractService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AdvancedSearchDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (params: SearchParams) => void;
  currentParams: SearchParams;
}

const AdvancedSearchDrawer: React.FC<AdvancedSearchDrawerProps> = ({
  visible,
  onClose,
  onSearch,
  currentParams,
}) => {
  const [form] = Form.useForm();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载地区数据
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await contractService.getRegions();
        setRegions(data);
      } catch (error) {
        console.error('加载地区数据失败:', error);
      }
    };
    if (visible) {
      loadRegions();
    }
  }, [visible]);

  // 初始化表单值
  useEffect(() => {
    if (visible && currentParams) {
      form.setFieldsValue({
        category: currentParams.category,
        year: currentParams.year,
        yearRange: currentParams.yearRange
          ? [dayjs().year(currentParams.yearRange[0]), dayjs().year(currentParams.yearRange[1])]
          : undefined,
      });
    }
  }, [visible, currentParams, form]);

  // 提交搜索
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const params: SearchParams = {
        ...currentParams,
      };

      // 处理分类
      if (values.category) {
        params.category = values.category;
      }

      // 处理年份
      if (values.year) {
        params.year = values.year;
        delete params.yearRange;
      } else if (values.yearRange) {
        params.yearRange = [
          values.yearRange[0].year(),
          values.yearRange[1].year(),
        ];
        delete params.year;
      }

      // 处理地区
      if (values.region && values.region.length > 0) {
        params.province = regions.find(r => r.code === values.region[0])?.name;
        if (values.region.length > 1) {
          const province = regions.find(r => r.code === values.region[0]);
          params.city = province?.children?.find(c => c.code === values.region[1])?.name;
        }
      }

      onSearch(params);
    } catch (error) {
      message.error('请完善筛选条件');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  // 转换地区数据为Cascader格式
  const regionOptions = regions.map(province => ({
    value: province.code,
    label: province.name,
    children: province.children?.map(city => ({
      value: city.code,
      label: city.name,
    })),
  }));

  // 生成年份选项（最近10年）
  const currentYear = dayjs().year();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Drawer
      title={
        <Space>
          <FilterOutlined />
          高级检索
        </Space>
      }
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            应用筛选
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Divider orientation="left">合同分类</Divider>
        <Form.Item name="category" label="选择分类">
          <Select placeholder="请选择合同分类" allowClear>
            {Object.entries(ContractCategoryLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider orientation="left">年份筛选</Divider>
        <Form.Item name="year" label="单个年份">
          <Select placeholder="请选择年份" allowClear>
            {yearOptions.map(year => (
              <Option key={year} value={year}>
                {year}年
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="yearRange" label="年份范围">
          <RangePicker
            picker="year"
            style={{ width: '100%' }}
            placeholder={['开始年份', '结束年份']}
          />
        </Form.Item>

        <Divider orientation="left">地区筛选</Divider>
        <Form.Item name="region" label="选择地区">
          <Cascader
            options={regionOptions}
            placeholder="请选择省份/城市"
            changeOnSelect
            showSearch
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AdvancedSearchDrawer;
