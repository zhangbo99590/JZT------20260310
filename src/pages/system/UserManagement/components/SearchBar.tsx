/**
 * 用户管理搜索栏组件
 * 创建时间: 2026-01-13
 * 功能: 提供用户搜索和新增按钮
 */

import React from "react";
import { Card, Row, Col, Input, Button, Select } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

/**
 * 搜索栏组件Props
 * 类型定义时间: 2026-01-13
 */
interface SearchBarProps {
  searchText: string;
  status: string | undefined;
  onSearchTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onSearch: () => void;
  onAdd: () => void;
}

/**
 * 搜索栏组件
 * 组件创建时间: 2026-01-13
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  status,
  onSearchTextChange,
  onStatusChange,
  onSearch,
  onAdd,
}) => {
  return (
    <Card style={{ marginBottom: "16px" }}>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Input.Search
            placeholder="搜索用户名、邮箱或用户 ID..."
            allowClear
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            onSearch={onSearch}
            enterButton={<Button icon={<SearchOutlined />} />}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="账号状态"
            allowClear
            style={{ width: "100%" }}
            value={status}
            onChange={onStatusChange}
          >
            <Select.Option value={undefined}>全部状态</Select.Option>
            <Select.Option value="0">已启用</Select.Option>
            <Select.Option value="1">已禁用</Select.Option>
          </Select>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            新增用户
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
