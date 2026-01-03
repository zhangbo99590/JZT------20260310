import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Row, Col, Typography, Button, Space, Input, Select, Tag, Rate,
  Modal, message, Tooltip, Spin, Avatar, Empty, Badge, Divider,
} from 'antd';
import {
  SendOutlined, AudioOutlined, HistoryOutlined, StarOutlined, StarFilled,
  DownloadOutlined, UserOutlined, RobotOutlined, ThunderboltOutlined,
  SafetyOutlined, CheckCircleOutlined, FileTextOutlined, BankOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AIQuestionInput from './components/AIQuestionInput';
import AIMessageList from './components/AIMessageList';
import AICaseInquiryModal from './components/AICaseInquiryModal';
import { Message, QuestionType, CaseInquiry } from '../../types/ai-assistant';
import { generateAIResponse, QuestionProcessor, generateFollowUpQuestions } from '../../services/aiAssistantService';

const { Title, Text } = Typography;

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'system',
      content: '您好！我是申报向导智能助手，可以为您提供专业的政策申报指导服务。请描述您的申报需求，我会为您提供详细的申报指引。',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<CaseInquiry[]>([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // 统计数据
  const [stats, setStats] = useState({
    todayQuestions: 0,
    totalQuestions: 0,
    avgRating: 0,
    responseTime: '0s',
  });

  // 发送消息
  const handleSendMessage = async (question: string, types: string[]) => {
    if (!question.trim()) {
      message.warning('请输入您的问题');
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      questionType: types.join(','),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // 检测是否需要追问
    if (QuestionProcessor.detectVagueQuestion(question)) {
      const inquiries = generateFollowUpQuestions(question);
      setCurrentInquiry(inquiries);
      setShowInquiryModal(true);
      setLoading(false);
      return;
    }

    try {
      // 获取AI回答
      const aiResponse = await generateAIResponse(question, types);
      setMessages(prev => [...prev, aiResponse]);

      // 更新统计数据
      setStats(prev => ({
        ...prev,
        todayQuestions: prev.todayQuestions + 1,
        totalQuestions: prev.totalQuestions + 1,
      }));
    } catch (error) {
      message.error('获取回答失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 收藏/取消收藏
  const handleToggleStar = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
    message.success('操作成功');
  };

  // 评价回答
  const handleRateAnswer = (messageId: string, rating: number) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
    message.success('感谢您的评价');
  };

  // 导出文档
  const handleExportDoc = (messageId: string) => {
    message.info('文档生成功能开发中...');
  };

  // 咨询人工律师
  const handleConsultLawyer = () => {
    message.info('正在跳转至律师咨询平台...');
  };

  // 完成案情挖掘
  const handleCompleteInquiry = async (inquiries: CaseInquiry[]) => {
    const allCompleted = inquiries.every(item => item.completed);
    if (!allCompleted) {
      message.warning('请完成所有问题');
      return;
    }

    // 生成结构化案情摘要
    const summary = `
**结构化案情摘要**

**主体信息：** ${inquiries[0].answer}
**事实经过：** ${inquiries[1].answer}
**具体诉求：** ${inquiries[2].answer}
**证据材料：** ${inquiries[3].answer}
    `.trim();

    const summaryMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: summary,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    setMessages(prev => [...prev, summaryMessage]);
    setShowInquiryModal(false);
    
    // 继续生成AI回答
    setLoading(true);
    try {
      const response = await generateAIResponse(summary, selectedTypes);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      message.error('获取回答失败');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: '0' }}>
      
      {/* 页面标题和统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="large">
                  <RobotOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <div>
                    <Title level={3} style={{ margin: 0 }}>申报向导</Title>
                    <Text type="secondary">专业的政策申报指导服务，助力企业发展</Text>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space size="large">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{stats.todayQuestions}</div>
                    <Text type="secondary">今日指导</Text>
                  </div>
                  <Divider type="vertical" style={{ height: 40 }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{stats.totalQuestions}</div>
                    <Text type="secondary">累计指导</Text>
                  </div>
                  <Divider type="vertical" style={{ height: 40 }} />
                  <div style={{ textAlign: 'center' }}>
                    <Rate disabled defaultValue={Math.floor(stats.avgRating)} style={{ fontSize: 16 }} />
                    <div><Text type="secondary">评分 {stats.avgRating}</Text></div>
                  </div>
                  <Divider type="vertical" style={{ height: 40 }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>{stats.responseTime}</div>
                    <Text type="secondary">响应时间</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Row gutter={[16, 16]}>
        {/* 对话区 */}
        <Col span={24}>
          <Card
            title={<Space><RobotOutlined /><span>申报指导</span></Space>}
            extra={
              <Button icon={<HistoryOutlined />} onClick={() => navigate('/policy-center/application-guide/history')}>
                历史记录
              </Button>
            }
            style={{ height: 'calc(100vh - 280px)', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
          >
            <AIMessageList
              messages={messages}
              loading={loading}
              onToggleStar={handleToggleStar}
              onRateAnswer={handleRateAnswer}
              onExportDoc={handleExportDoc}
              onConsultLawyer={handleConsultLawyer}
              navigate={navigate}
            />
            <AIQuestionInput
              value={inputValue}
              onChange={setInputValue}
              selectedTypes={selectedTypes}
              onSelectedTypesChange={setSelectedTypes}
              onSend={handleSendMessage}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* 案情挖掘模态框 */}
      <AICaseInquiryModal
        visible={showInquiryModal}
        inquiries={currentInquiry}
        onUpdate={setCurrentInquiry}
        onComplete={handleCompleteInquiry}
        onCancel={() => setShowInquiryModal(false)}
      />
    </div>
  );
};

export default AIAssistant;
