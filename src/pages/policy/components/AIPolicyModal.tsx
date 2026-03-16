/**
 * AI政策通模态窗口组件
 * 提供AI辅助政策咨询功能，包含预设问题模板
 */

import React, { useState } from 'react';
import { Modal, Input, Button, Space, Card, Typography, List, message } from 'antd';
import { RobotOutlined, SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface AIPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  context?: {
    companyName?: string;
    completeness?: number;
    industry?: string;
    location?: string;
    missingInfo?: string;
    matchStatus?: string; // e.g., 'matching', 'completed', 'idle'
  };
}

// 预设问题模板
const PRESET_QUESTIONS = [
  {
    id: 1,
    question: '我的企业符合高新技术企业认定条件吗？',
    category: '资质认定'
  },
  {
    id: 2,
    question: '当前企业的政策匹配维度有哪些？',
    category: '匹配分析'
  },
  {
    id: 3,
    question: '智能匹配的维度有哪些？',
    category: '功能咨询'
  },
  {
    id: 4,
    question: '如何提高申报成功率？',
    category: '申报指导'
  }
];

const AIPolicyModal: React.FC<AIPolicyModalProps> = ({ visible, onClose, context }) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // 模拟错误状态
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // 监听 visible 变化，重置状态
  React.useEffect(() => {
    if (visible) {
      // 模拟每次打开时的一点点初始化延迟或检查
      setError(false);
    }
  }, [visible]);

  // 处理预设问题点击
  const handlePresetClick = (question: string) => {
    setInputValue(question);
  };

  // 处理发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) {
      message.warning('请输入您的问题');
      return;
    }

    if (inputValue.length > 50) {
      message.warning('问题描述不能超过50字');
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(false);
    
    // 添加用户消息到历史
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    
    // 模拟AI响应（实际应调用后端API）
    // 模拟 5% 的概率失败
    const shouldFail = Math.random() < 0.05;

    setTimeout(() => {
      if (shouldFail) {
        setLoading(false);
        setError(true);
        setChatHistory(prev => [...prev, { role: 'assistant', content: 'AI政策通临时故障，请点击重试。' }]);
      } else {
        const mockResponse = generateMockResponse(userMessage);
        setChatHistory(prev => [...prev, { role: 'assistant', content: mockResponse }]);
        setLoading(false);
      }
    }, 1500);
  };

  // 重新发送（用于错误恢复）
  const handleRetry = () => {
     // 获取上一条用户消息
     const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');
     if (lastUserMsg) {
         setInputValue(lastUserMsg.content);
         // 移除最后一条错误消息
         setChatHistory(prev => prev.filter((_, i) => i !== prev.length - 1));
         // 稍微延迟一下触发发送，以便状态更新
         setTimeout(() => handleSend(), 100);
     }
  };

  // 生成模拟响应
  const generateMockResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    // 关联企业上下文
    if (context) {
        if (q.includes('完整度') || q.includes('补充')) {
            if (context.completeness && context.completeness < 100) {
                return `您的企业（${context.companyName}）当前信息完整度为 ${context.completeness}%。${context.missingInfo ? `主要缺失：${context.missingInfo}。` : ''} 补充近1年营收数据和人员结构信息可显著提升匹配精准度。`;
            } else {
                return `您的企业（${context.companyName}）信息已非常完善（${context.completeness}%），匹配结果精准度极高。`;
            }
        }
        
        if (q.includes('匹配维度') || q.includes('维度')) {
             return `智能匹配主要基于以下维度对您的企业（${context.companyName}）进行分析：\n\n1. **注册地**：${context.location || '未知'}\n2. **所属行业**：${context.industry || '未知'}\n3. **信息完整度**：${context.completeness || 0}%\n4. **知识产权**：专利、商标等储备情况\n5. **经营数据**：营收规模、增长率等\n\n系统会综合这些信息，在政策库中筛选出最适合您的申报项目。`;
        }

        if (q.includes('高新') || q.includes('认定')) {
            return `基于${context.companyName}目前的行业（${context.industry}）和注册地（${context.location}），申请高新技术企业认定是提升竞争力的好选择。建议您重点关注知识产权数量和研发费用占比是否达标。`;
        }
    }

    if (q.includes('高新技术企业')) {
      return '根据《高新技术企业认定管理办法》，企业申请高新技术企业认定需要满足以下条件：\n\n1. 企业申请认定时须注册成立一年以上\n2. 企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权\n3. 对企业主要产品（服务）发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定的范围\n4. 企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%\n5. 企业近三个会计年度的研究开发费用总额占同期销售收入总额的比例符合要求\n\n建议您准备相关材料后，通过我们的智能匹配功能进行详细评估。';
    } else if (q.includes('研发费用')) {
      return '根据最新政策，企业研发费用加计扣除比例如下：\n\n1. 制造业企业：研发费用可按100%加计扣除\n2. 科技型中小企业：研发费用可按100%加计扣除\n3. 其他企业：研发费用可按75%加计扣除\n\n注意事项：\n- 研发费用需符合税务总局规定的范围\n- 需建立研发费用辅助账\n- 年度汇算清缴时申报\n\n如需了解更多详情，建议咨询专业税务顾问。';
    } else if (q.includes('专精特新')) {
      return '专精特新企业申报需要准备以下材料：\n\n必备材料：\n1. 企业营业执照副本\n2. 企业基本情况表\n3. 专精特新企业自评表\n4. 近两年财务审计报告\n5. 知识产权证明材料\n6. 研发投入证明材料\n7. 主导产品或服务说明\n\n补充材料：\n- 质量管理体系认证证书\n- 获奖证书或荣誉证明\n- 产品检测报告\n\n建议提前3个月开始准备材料，确保申报顺利。';
    } else {
      return `感谢您的咨询！${context?.companyName ? `结合${context.companyName}的情况，` : ''}我们的AI政策助手正在为您分析相关政策...\n\n建议您：\n1. 使用政策搜索功能查找相关政策文件\n2. 通过智能匹配功能评估企业适配度\n3. 联系我们的专业顾问获取一对一指导\n\n如有更多问题，欢迎继续咨询！`;
    }
  };

  // 重置对话
  const handleReset = () => {
    setChatHistory([]);
    setInputValue('');
  };

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>AI政策通</span>
          <span style={{
            background: '#faad14',
            color: '#fff',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '4px',
            marginLeft: '8px'
          }}>
            Beta
          </span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 50 }}
      bodyStyle={{ padding: '24px', maxHeight: '600px', overflowY: 'auto' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 欢迎信息 */}
        {chatHistory.length === 0 && (
          <Card bordered={false} style={{ background: '#f5f7fa', borderRadius: '8px' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                <QuestionCircleOutlined style={{ marginRight: '8px', color: '#1677ff' }} />
                您好！我是AI政策助手
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                我可以帮您解答政策相关问题，提供申报指导和政策推荐。请选择下方预设问题或直接输入您的问题。
              </Paragraph>
            </Space>
          </Card>
        )}

        {/* 预设问题模板 */}
        {chatHistory.length === 0 && (
          <div>
            <Text strong style={{ marginBottom: '12px', display: 'block' }}>
              常见问题：
            </Text>
            <List
              grid={{ gutter: 12, column: 1 }}
              dataSource={PRESET_QUESTIONS}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => handlePresetClick(item.question)}
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    bodyStyle={{ padding: '12px 16px' }}
                  >
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text style={{ fontSize: '14px', color: '#1f1f1f' }}>
                        {item.question}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.category}
                      </Text>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 对话历史 */}
        {chatHistory.length > 0 && (
          <div style={{ 
            maxHeight: '350px', 
            overflowY: 'auto',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px'
          }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: msg.role === 'user' ? '#1677ff' : '#fff',
                      color: msg.role === 'user' ? '#fff' : '#1f1f1f',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    <Space>
                      <span>AI正在思考</span>
                      <span className="loading-dots">...</span>
                    </Space>
                  </div>
                </div>
              )}
              {error && (
                 <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                   <div style={{ padding: '12px 16px', background: '#fff1f0', borderRadius: '8px', border: '1px solid #ffccc7' }}>
                      <Space>
                        <span style={{ color: '#ff4d4f' }}>AI政策通临时故障，请点击重试</span>
                        <Button type="link" size="small" onClick={handleRetry} style={{ padding: 0 }}>重试</Button>
                      </Space>
                   </div>
                 </div>
              )}
            </Space>
          </div>
        )}

        {/* 输入区域 */}
        <div>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入您的问题（50字以内）"
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={50}
              showCount
              onPressEnter={(e) => {
                if (e.shiftKey) return;
                e.preventDefault();
                handleSend();
              }}
              style={{ flex: 1 }}
            />
          </Space.Compact>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleReset} disabled={chatHistory.length === 0}>
              重新开始
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          </div>
        </div>

        {/* 提示信息 */}
        <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
          💡 提示：AI政策通目前处于测试阶段，建议重要决策前咨询专业顾问
        </Text>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .loading-dots {
          animation: blink 1.4s infinite;
        }
      `}</style>
    </Modal>
  );
};

export default AIPolicyModal;
