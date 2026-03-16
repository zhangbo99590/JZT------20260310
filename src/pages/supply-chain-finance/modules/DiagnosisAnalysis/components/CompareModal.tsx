/**
 * 方案对比弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import { Modal, Card, Row, Col, Progress, Descriptions, Button } from "antd";
import type { FinancingOption } from "../types";
import { getMatchColor } from "../utils";

interface CompareModalProps {
  visible: boolean;
  selectedOptions: string[];
  financingOptions: FinancingOption[];
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({
  visible,
  selectedOptions,
  financingOptions,
  onClose,
}) => {
  return (
    <Modal
      title="融资方案对比"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          关闭
        </Button>,
        <Button key="apply" type="primary">
          申请选中方案
        </Button>,
      ]}
    >
      {selectedOptions.length >= 2 && (
        <Row gutter={24}>
          {selectedOptions.slice(0, 3).map((optionId) => {
            const option = financingOptions.find((o) => o.id === optionId);
            if (!option) return null;

            return (
              <Col span={8} key={optionId}>
                <Card title={option.name} size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="匹配度">
                      <Progress
                        percent={option.matchScore}
                        size="small"
                        strokeColor={getMatchColor(option.matchScore)}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="利率">
                      {option.interestRate}
                    </Descriptions.Item>
                    <Descriptions.Item label="额度">
                      {option.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label="期限">
                      {option.term}
                    </Descriptions.Item>
                    <Descriptions.Item label="审批时间">
                      {option.processingTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="成功率">
                      {option.successRate}%
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Modal>
  );
};

export default CompareModal;
