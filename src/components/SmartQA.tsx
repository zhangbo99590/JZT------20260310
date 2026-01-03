import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Tag, Divider, Avatar, Spin, Tooltip } from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import './SmartQA.module.css';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface SmartQAProps {
  style?: React.CSSProperties;
}

const SmartQA: React.FC<SmartQAProps> = ({ style }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '您好！我是申报向导智能助手，可以为您解答企业资质申报相关问题。请问有什么可以帮助您的？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 常见问题 - 分类展示
  const quickQuestions = [
    { text: '认定条件', icon: '📋', fullText: '高新技术企业认定的条件是什么？' },
    { text: '研发费用', icon: '💰', fullText: '研发费用占比要求是多少？' },
    { text: '申报材料', icon: '📄', fullText: '申报需要准备哪些材料？' },
    { text: '流程时间', icon: '⏰', fullText: '申报流程需要多长时间？' },
    { text: '知识产权', icon: '🔐', fullText: '知识产权有什么要求？' },
    { text: '科技人员', icon: '👥', fullText: '科技人员占比要求是多少？' },
    { text: '财务审计', icon: '📊', fullText: '财务审计报告如何准备？' },
    { text: '政策优惠', icon: '🎁', fullText: '认定后有哪些政策优惠？' }
  ];

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (question: string): string => {
    // 简单的关键词匹配回复
    if (question.includes('条件') || question.includes('要求')) {
      return '高新技术企业认定主要条件包括：\n1. 企业申请认定时须注册成立一年以上\n2. 企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权\n3. 对企业主要产品（服务）发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定的范围\n4. 企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%\n5. 企业近三个会计年度的研究开发费用总额占同期销售收入总额的比例符合要求';
    } else if (question.includes('研发费用')) {
      return '研发费用占比要求如下：\n• 最近一年销售收入小于5,000万元（含）的企业，比例不低于5%\n• 最近一年销售收入在5,000万元至2亿元（含）的企业，比例不低于4%\n• 最近一年销售收入在2亿元以上的企业，比例不低于3%\n\n研发费用包括：人员人工费用、直接投入费用、折旧费用与长期待摊费用、无形资产摊销费用、设计费用、装备调试费用与试验费用、委托外部研究开发费用等。';
    } else if (question.includes('材料') || question.includes('文件')) {
      return '申报需要准备的主要材料包括：\n1. 高新技术企业认定申请书\n2. 企业营业执照副本\n3. 知识产权相关材料（专利证书、软件著作权等）\n4. 科研项目立项证明\n5. 科技成果转化证明材料\n6. 研发组织管理水平相关材料\n7. 近三年财务审计报告\n8. 近三年研发费用专项审计报告\n9. 近一年高新技术产品（服务）收入专项审计报告\n\n建议提前准备好所有材料的电子版，确保文件清晰完整。';
    } else if (question.includes('时间') || question.includes('流程')) {
      return '申报流程及时间安排：\n1. 企业自我评价（1-2周）\n2. 准备申报材料（2-4周）\n3. 网上填报（1周）\n4. 提交纸质材料（1周）\n5. 专家评审（2-3个月）\n6. 认定机构审查（1个月）\n7. 公示（15个工作日）\n8. 颁发证书（公示后1个月内）\n\n整个流程通常需要4-6个月，建议企业提前规划，预留充足时间准备材料。';
    } else {
      return '感谢您的提问。我已记录您的问题，如需更详细的解答，建议您：\n1. 查看相关政策文件\n2. 咨询专业的申报服务机构\n3. 联系当地科技主管部门\n\n您还有其他问题吗？我会尽力为您解答。';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    // 自动聚焦到输入框
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      textarea?.focus();
    }, 100);
  };

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 横向滚动控制
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card
      title={
        <Space>
          <RobotOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          <span>智能问答</span>
        </Space>
      }
      style={{
        ...style,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderRadius: '8px'
      }}
      extra={
        <Tag color="processing" icon={<BulbOutlined />}>
          AI助手
        </Tag>
      }
    >
      {/* 消息列表 */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          marginBottom: '16px',
          padding: '12px',
          background: '#fafafa',
          borderRadius: '6px'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                maxWidth: '80%',
                gap: '8px'
              }}
            >
              <Avatar
                icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                style={{
                  backgroundColor: message.type === 'user' ? '#1890ff' : '#52c41a',
                  flexShrink: 0
                }}
              />
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: message.type === 'user' ? '#1890ff' : '#fff',
                  color: message.type === 'user' ? '#fff' : '#333',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                <Paragraph
                  style={{
                    margin: 0,
                    color: message.type === 'user' ? '#fff' : '#333',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  {message.content}
                </Paragraph>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    display: 'block',
                    color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#999'
                  }}
                >
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Spin size="small" />
              <Text style={{ marginLeft: '8px', color: '#999' }}>正在思考...</Text>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 快捷问题 - 优化后的布局 */}
      {showQuickQuestions && (
        <div 
          style={{ 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e8e8f0',
            position: 'relative',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px' 
          }}>
            <Space size={4}>
              <ThunderboltOutlined style={{ color: '#667eea', fontSize: '16px' }} />
              <Text strong style={{ fontSize: '13px', color: '#667eea' }}>
                快速提问
              </Text>
            </Space>
            <Button 
              type="text" 
              size="small"
              onClick={() => setShowQuickQuestions(false)}
              style={{ fontSize: '12px', color: '#999' }}
            >
              收起
            </Button>
          </div>

          {/* 横向滚动容器 */}
          <div style={{ position: 'relative' }}>
            {/* 左侧滚动按钮 */}
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />

            {/* 标签滚动区域 */}
            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '4px 0',
                WebkitOverflowScrolling: 'touch'
              }}
              className="quick-questions-scroll"
            >
              {quickQuestions.map((question, index) => (
                <Tooltip key={index} title={question.fullText} placement="top">
                  <Tag
                    style={{
                      cursor: 'pointer',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onClick={() => handleQuickQuestion(question.fullText)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{question.icon}</span>
                    <span>{question.text}</span>
                  </Tag>
                </Tooltip>
              ))}
            </div>

            {/* 右侧滚动按钮 */}
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>

          {/* 提示文字 */}
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '11px', 
              display: 'block', 
              marginTop: '8px',
              textAlign: 'center',
              color: '#999'
            }}
          >
            💡 点击标签快速提问，或左右滑动查看更多
          </Text>
        </div>
      )}

      {/* 显示快捷问题按钮（收起后） */}
      {!showQuickQuestions && (
        <Button
          type="dashed"
          size="small"
          icon={<ThunderboltOutlined />}
          onClick={() => setShowQuickQuestions(true)}
          style={{ 
            marginBottom: '16px',
            width: '100%',
            borderRadius: '6px',
            color: '#667eea'
          }}
        >
          显示快速提问
        </Button>
      )}

      <Divider style={{ margin: '16px 0' }} />

      {/* 输入区域 */}
      <Space.Compact style={{ width: '100%' }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入您的问题..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ borderRadius: '6px 0 0 6px' }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{
            height: 'auto',
            borderRadius: '0 6px 6px 0',
            minHeight: '60px'
          }}
        >
          发送
        </Button>
      </Space.Compact>

      <Text type="secondary" style={{ fontSize: '11px', marginTop: '8px', display: 'block' }}>
        按 Enter 发送，Shift + Enter 换行
      </Text>
    </Card>
  );
};

export default SmartQA;
