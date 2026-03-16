/**
 * 操作日志标签页组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Table,
  Select,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Popconfirm,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import type { OperationLog, LogFilter } from "../types/index.ts";

const { Option } = Select;

interface OperationLogTabProps {
  operationLogs: OperationLog[];
  logFilter: LogFilter;
  onFilterChange: (filter: LogFilter) => void;
  onViewDetail: (log: OperationLog) => void;
  onDeleteLog: (id: string) => void;
}

const OperationLogTab: React.FC<OperationLogTabProps> = ({
  operationLogs,
  logFilter,
  onFilterChange,
  onViewDetail,
  onDeleteLog,
}) => {
  // 操作日志表格列
  const logColumns: TableColumnsType<OperationLog> = [
    {
      title: "操作时间",
      dataIndex: "time",
      key: "time",
      width: 170,
    },
    {
      title: "操作模块",
      dataIndex: "module",
      key: "module",
      width: 120,
      align: "center",
      render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: "操作类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      align: "center",
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          查询: "default",
          新增: "success",
          修改: "warning",
          删除: "error",
        };
        return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "操作内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      align: "center",
    },
    {
      title: "操作结果",
      dataIndex: "result",
      key: "result",
      width: 100,
      align: "center",
      render: (result: string) =>
        result === "success" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            成功
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            失败
          </Tag>
        ),
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 140,
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      align: "center",
      render: (_: unknown, record: OperationLog) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定要删除这条日志吗？"
            onConfirm={() => onDeleteLog(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="选择时间范围"
              value={logFilter.dateRange}
              onChange={(value) =>
                onFilterChange({ ...logFilter, dateRange: value })
              }
            >
              <Option value="recent7">近7天</Option>
              <Option value="recent30">近30天</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="选择操作模块"
              value={logFilter.module}
              onChange={(value) =>
                onFilterChange({ ...logFilter, module: value })
              }
            >
              <Option value="all">全部模块</Option>
              <Option value="policy">政策中心</Option>
              <Option value="opportunity">商机大厅</Option>
              <Option value="finance">融资诊断</Option>
              <Option value="legal">法律护航</Option>
              <Option value="system">系统管理</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="选择操作类型"
              value={logFilter.type}
              onChange={(value) =>
                onFilterChange({ ...logFilter, type: value })
              }
            >
              <Option value="all">全部类型</Option>
              <Option value="query">查询</Option>
              <Option value="add">新增</Option>
              <Option value="edit">修改</Option>
              <Option value="delete">删除</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        columns={logColumns}
        dataSource={operationLogs}
        rowKey="id"
        size="middle"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </Space>
  );
};

export default OperationLogTab;
