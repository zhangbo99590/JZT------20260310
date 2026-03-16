/**
 * 操作日志详情弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Modal, Button, Descriptions, Tag, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { OperationLog } from "../types/index.ts";

const { Text } = Typography;

interface LogDetailModalProps {
  visible: boolean;
  log: OperationLog | null;
  onClose: () => void;
}

const LogDetailModal: React.FC<LogDetailModalProps> = ({
  visible,
  log,
  onClose,
}) => {
  if (!log) return null;

  return (
    <Modal
      title="操作详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="操作时间">{log.time}</Descriptions.Item>
        <Descriptions.Item label="操作模块">
          <Tag color="blue">{log.module}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="操作类型">
          <Tag>{log.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="操作内容">{log.content}</Descriptions.Item>
        <Descriptions.Item label="操作结果">
          {log.result === "success" ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              成功
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              失败
            </Tag>
          )}
        </Descriptions.Item>
        {log.failReason && (
          <Descriptions.Item label="失败原因">
            <Text type="danger">{log.failReason}</Text>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="IP地址">{log.ip}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default LogDetailModal;
