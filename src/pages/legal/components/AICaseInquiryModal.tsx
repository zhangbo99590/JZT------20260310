import React from 'react';
import { Modal, Steps, Input, Button, Space, Typography, Progress } from 'antd';
import { QuestionCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { CaseInquiry } from '../../../types/ai-assistant';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface AICaseInquiryModalProps {
  visible: boolean;
  inquiries: CaseInquiry[];
  onUpdate: (inquiries: CaseInquiry[]) => void;
  onComplete: (inquiries: CaseInquiry[]) => void;
  onCancel: () => void;
}

const AICaseInquiryModal: React.FC<AICaseInquiryModalProps> = ({
  visible,
  inquiries,
  onUpdate,
  onComplete,
  onCancel,
}) => {
  // 更新答案
  const handleAnswerChange = (step: number, answer: string) => {
    const updated = inquiries.map(item =>
      item.step === step
        ? { ...item, answer, completed: answer.trim().length > 0 }
        : item
    );
    onUpdate(updated);
  };

  // 计算完成进度
  const completedCount = inquiries.filter(item => item.completed).length;
  const progress = inquiries.length > 0 ? (completedCount / inquiries.length) * 100 : 0;

  return (
    <Modal
      title={
        <Space>
          <QuestionCircleOutlined style={{ color: '#1890ff' }} />
          <span>引导式案情挖掘</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="complete"
          type="primary"
          onClick={() => onComplete(inquiries)}
          disabled={completedCount < inquiries.length}
        >
          完成并生成回答
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 24 }}>
        <Paragraph type="secondary">
          为了给您提供更精准的法律建议，请回答以下问题。这些信息将帮助AI更好地理解您的情况。
        </Paragraph>
        <div style={{ marginTop: 16 }}>
          <Text>完成进度：</Text>
          <Progress
            percent={Math.round(progress)}
            status={progress === 100 ? 'success' : 'active'}
            style={{ marginBottom: 0 }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            已完成 {completedCount} / {inquiries.length} 个问题
          </Text>
        </div>
      </div>

      <Steps
        direction="vertical"
        current={inquiries.findIndex(item => !item.completed)}
        items={inquiries.map(inquiry => ({
          title: (
            <Space>
              <Text strong>步骤 {inquiry.step}</Text>
              {inquiry.completed && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
            </Space>
          ),
          description: (
            <div style={{ marginTop: 12 }}>
              <Paragraph style={{ marginBottom: 12 }}>
                <QuestionCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                {inquiry.question}
              </Paragraph>
              <TextArea
                value={inquiry.answer}
                onChange={e => handleAnswerChange(inquiry.step, e.target.value)}
                placeholder="请详细填写..."
                autoSize={{ minRows: 3, maxRows: 6 }}
                maxLength={500}
                showCount
                style={{
                  borderColor: inquiry.completed ? '#52c41a' : undefined,
                }}
              />
              {inquiry.completed && (
                <div style={{ marginTop: 8 }}>
                  <Text type="success" style={{ fontSize: 12 }}>
                    <CheckCircleOutlined /> 已完成
                  </Text>
                </div>
              )}
            </div>
          ),
          status: inquiry.completed ? 'finish' : 'wait',
        }))}
      />

      <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f0f7ff', borderRadius: 4 }}>
        <Text strong style={{ color: '#1890ff' }}>
          💡 温馨提示：
        </Text>
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20, color: '#666' }}>
          <li>请尽可能详细地描述相关信息，这将帮助AI提供更准确的法律建议</li>
          <li>您提供的信息将被严格保密，仅用于本次咨询</li>
          <li>完成所有问题后，系统将生成结构化的案情摘要并提供专业分析</li>
        </ul>
      </div>
    </Modal>
  );
};

export default AICaseInquiryModal;
