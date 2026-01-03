import React, { useRef, useEffect } from 'react';
import { Avatar, Space, Button, Tooltip, Rate, Tag, Typography, Spin } from 'antd';
import {
  UserOutlined, RobotOutlined, SafetyOutlined, StarOutlined, StarFilled,
  DownloadOutlined, FileTextOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { Message } from '../../../types/ai-assistant';
import { NavigateFunction } from 'react-router-dom';

const { Text, Paragraph } = Typography;

interface AIMessageListProps {
  messages: Message[];
  loading: boolean;
  onToggleStar: (messageId: string) => void;
  onRateAnswer: (messageId: string, rating: number) => void;
  onExportDoc: (messageId: string) => void;
  onConsultLawyer: () => void;
  navigate: NavigateFunction;
}

const AIMessageList: React.FC<AIMessageListProps> = ({
  messages,
  loading,
  onToggleStar,
  onRateAnswer,
  onExportDoc,
  onConsultLawyer,
  navigate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 渲染消息内容
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={idx} style={{ fontWeight: 'bold', marginTop: idx > 0 ? 12 : 0, marginBottom: 4 }}>
            {line.replace(/\*\*/g, '')}
          </div>
        );
      } else if (line.startsWith('- ')) {
        return (
          <div key={idx} style={{ paddingLeft: 16, marginTop: 4 }}>
            • {line.substring(2)}
          </div>
        );
      } else if (line.trim()) {
        return (
          <div key={idx} style={{ marginTop: 4 }}>
            {line}
          </div>
        );
      }
      return <div key={idx} style={{ height: 8 }} />;
    });
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f5f5f5',
      }}
    >
      {messages.map(msg => (
        <div
          key={msg.id}
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          {/* 左侧头像 */}
          {msg.type !== 'user' && (
            <Avatar
              icon={msg.type === 'assistant' ? <RobotOutlined /> : <SafetyOutlined />}
              style={{
                backgroundColor: msg.type === 'assistant' ? '#1890ff' : '#52c41a',
                marginRight: 8,
                flexShrink: 0,
              }}
            />
          )}

          {/* 消息气泡 */}
          <div
            style={{
              maxWidth: '70%',
              backgroundColor: msg.type === 'user' ? '#1890ff' : '#fff',
              color: msg.type === 'user' ? '#fff' : '#000',
              padding: '12px 16px',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {/* 消息内容 */}
            <div style={{ marginBottom: 8 }}>
              {renderMessageContent(msg.content)}
            </div>

            {/* AI回答的额外信息 */}
            {msg.type === 'assistant' && (
              <>
                {/* 法条援引 */}
                {msg.legalArticles && msg.legalArticles.length > 0 && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f0f7ff', borderRadius: 4, borderLeft: '3px solid #1890ff' }}>
                    <Text strong style={{ color: '#1890ff' }}>
                      <FileTextOutlined /> 法条援引
                    </Text>
                    {msg.legalArticles.map((article, idx) => (
                      <div key={idx} style={{ marginTop: 8 }}>
                        <Space>
                          <Text strong>{article.name} {article.article}</Text>
                          <Tag color="green">{article.status}</Tag>
                        </Space>
                        <Paragraph style={{ marginTop: 4, marginBottom: 0, color: '#666', fontSize: 13 }}>
                          {article.content}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          生效日期：{article.effectiveDate}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}

                {/* 案例参考 */}
                {msg.caseReferences && msg.caseReferences.length > 0 && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: '#fff7e6', borderRadius: 4, borderLeft: '3px solid #fa8c16' }}>
                    <Text strong style={{ color: '#fa8c16' }}>
                      <SafetyOutlined /> 案例参考
                    </Text>
                    {msg.caseReferences.map((caseRef, idx) => (
                      <div key={idx} style={{ marginTop: 8 }}>
                        <Button
                          type="link"
                          onClick={() => navigate(`/legal-support/judicial-cases/detail/${caseRef.caseId}`)}
                          style={{ padding: 0, height: 'auto' }}
                        >
                          {caseRef.title}
                        </Button>
                        <Tag color="orange" style={{ marginLeft: 8 }}>
                          相似度 {caseRef.similarity}%
                        </Tag>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {caseRef.court}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 操作建议 */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f6ffed', borderRadius: 4, borderLeft: '3px solid #52c41a' }}>
                    <Text strong style={{ color: '#52c41a' }}>
                      <CheckCircleOutlined /> 操作建议
                    </Text>
                    <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                      {msg.suggestions.map((suggestion, idx) => (
                        <li key={idx} style={{ color: '#666', marginTop: 4 }}>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 交互按钮 */}
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size="small">
                    <Tooltip title={msg.starred ? '取消收藏' : '收藏'}>
                      <Button
                        type="text"
                        size="small"
                        icon={msg.starred ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                        onClick={() => onToggleStar(msg.id)}
                      />
                    </Tooltip>
                    <Tooltip title="导出文档">
                      <Button
                        type="text"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => onExportDoc(msg.id)}
                      />
                    </Tooltip>
                    <Tooltip title="咨询人工律师">
                      <Button
                        type="text"
                        size="small"
                        icon={<UserOutlined />}
                        onClick={onConsultLawyer}
                      />
                    </Tooltip>
                  </Space>
                  <Space size="small">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      评价：
                    </Text>
                    <Rate
                      value={msg.rating || 0}
                      onChange={rating => onRateAnswer(msg.id, rating)}
                      style={{ fontSize: 14 }}
                    />
                  </Space>
                </div>
              </>
            )}

            {/* 时间戳 */}
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  color: msg.type === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                }}
              >
                {msg.timestamp}
              </Text>
            </div>
          </div>

          {/* 右侧头像 */}
          {msg.type === 'user' && (
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: '#87d068', marginLeft: 8, flexShrink: 0 }}
            />
          )}
        </div>
      ))}

      {loading && (
        <div style={{ textAlign: 'center', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Spin spinning={true} />
          <div style={{ marginTop: 16, color: '#666' }}>AI正在思考中，请稍候...</div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default AIMessageList;
