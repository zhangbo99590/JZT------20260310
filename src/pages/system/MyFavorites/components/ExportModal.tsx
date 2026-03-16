/**
 * 导出确认弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Modal, Button, Space, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

interface ExportModalProps {
  visible: boolean;
  selectedCount: number;
  onClose: () => void;
  onExport: (format: "excel" | "pdf") => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  selectedCount,
  onClose,
  onExport,
}) => {
  return (
    <Modal
      title="导出收藏列表"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={480}
    >
      <div style={{ padding: "20px 0" }}>
        <Paragraph>
          将导出选中的 <Text strong>{selectedCount}</Text> 项收藏内容
        </Paragraph>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Button
            block
            size="large"
            icon={<DownloadOutlined />}
            onClick={() => onExport("excel")}
            style={{ height: 48 }}
          >
            导出为 Excel 格式
          </Button>
          <Button
            block
            size="large"
            icon={<DownloadOutlined />}
            onClick={() => onExport("pdf")}
            style={{ height: 48 }}
          >
            导出为 PDF 格式
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ExportModal;
