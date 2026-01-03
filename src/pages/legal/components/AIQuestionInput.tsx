import React, { useState, useRef } from 'react';
import { Input, Button, Space, message, Tooltip } from 'antd';
import { SendOutlined, ThunderboltOutlined, LeftOutlined, RightOutlined, BulbOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface AIQuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedTypes: string[];
  onSelectedTypesChange: (types: string[]) => void;
  onSend: (question: string, types: string[]) => void;
  loading: boolean;
}

// 快速提问选项 - 申报向导专用
const QUICK_QUESTIONS = [
  { icon: '📋', label: '认定条件', question: '申报这个项目需要满足什么条件？' },
  { icon: '💰', label: '研发费用', question: '研发费用如何计算和归集？' },
  { icon: '📄', label: '申报材料', question: '需要准备哪些申报材料？' },
  { icon: '⏰', label: '申报流程', question: '申报流程和时间节点是什么？' },
  { icon: '🏢', label: '知识产权', question: '知识产权有什么要求？' },
  { icon: '📊', label: '财务指标', question: '财务指标有哪些要求？' },
  { icon: '✅', label: '自查清单', question: '如何进行申报条件自查？' },
  { icon: '💡', label: '注意事项', question: '申报过程中有哪些注意事项？' },
];

const AIQuestionInput: React.FC<AIQuestionInputProps> = ({
  value,
  onChange,
  selectedTypes,
  onSelectedTypesChange,
  onSend,
  loading,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // 发送消息
  const handleSend = () => {
    if (!value.trim()) {
      message.warning('请输入您的问题');
      return;
    }
    onSend(value, selectedTypes);
  };

  // 按Enter发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 快速提问
  const handleQuickQuestion = (question: string) => {
    onChange(question);
    setShowTooltip(null);
  };

  // 滚动控制
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ 
      padding: '16px 24px', 
      backgroundColor: '#f5f7fa', 
      borderTop: '1px solid #e8eaed' 
    }}>
      {/* 快速提问区域 */}
      <div style={{ 
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 16 
        }}>
          <ThunderboltOutlined style={{ 
            color: '#1890ff', 
            fontSize: 16, 
            marginRight: 8 
          }} />
          <span style={{ 
            fontWeight: 600, 
            fontSize: 14, 
            color: '#262626' 
          }}>
            快速提问
          </span>
        </div>

        {/* 滚动按钮容器 - 优化布局避免重叠 */}
        <div style={{ 
          position: 'relative',
          padding: '0 48px', // 为左右箭头留出空间
        }}>
          {/* 左箭头 - 优化位置 */}
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => handleScroll('left')}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e8e8e8',
              color: '#595959',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#1890ff';
              e.currentTarget.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = '#595959';
              e.currentTarget.style.borderColor = '#e8e8e8';
            }}
          />

          {/* 快速提问按钮列表 - 添加渐变遮罩效果 */}
          <div style={{ position: 'relative' }}>
            {/* 左侧渐变遮罩 */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))',
              zIndex: 5,
              pointerEvents: 'none',
            }} />
            
            {/* 右侧渐变遮罩 */}
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))',
              zIndex: 5,
              pointerEvents: 'none',
            }} />

            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '8px 4px',
              }}
              className="hide-scrollbar"
            >
              {QUICK_QUESTIONS.map((item, index) => (
                <Tooltip
                  key={index}
                  title={item.question}
                  placement="top"
                  overlayStyle={{
                    maxWidth: 320,
                  }}
                >
                  <Button
                    onClick={() => handleQuickQuestion(item.question)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: 20,
                      color: '#fff',
                      padding: '10px 24px',
                      height: 'auto',
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.25)';
                    }}
                  >
                    <span style={{ marginRight: 6, fontSize: 16 }}>{item.icon}</span>
                    {item.label}
                  </Button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* 右箭头 - 优化位置 */}
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => handleScroll('right')}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e8e8e8',
              color: '#595959',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#1890ff';
              e.currentTarget.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = '#595959';
              e.currentTarget.style.borderColor = '#e8e8e8';
            }}
          />
        </div>

        {/* 提示文字 - 优化样式 */}
        <div style={{ 
          marginTop: 16, 
          textAlign: 'center',
          fontSize: 12,
          color: '#8c8c8c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}>
          <BulbOutlined style={{ color: '#faad14' }} />
          <span>点击标签快速提问，使用左右箭头查看更多选项</span>
        </div>
      </div>

      {/* 输入框区域 */}
      <div style={{ 
        display: 'flex', 
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        alignItems: 'flex-end',
      }}>
        <TextArea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="请输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          maxLength={1000}
          style={{ 
            flex: 1,
            border: 'none',
            boxShadow: 'none',
            resize: 'none',
            fontSize: 14,
            color: '#262626',
            lineHeight: '22px',
          }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{
            backgroundColor: '#1890ff',
            borderRadius: 6,
            height: 40,
            minWidth: 100,
            padding: '0 24px',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.25)',
            border: 'none',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40a9ff';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1890ff';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          发送
        </Button>
      </div>

      {/* 底部提示 */}
      <div style={{ 
        marginTop: 8, 
        fontSize: 12, 
        color: '#8c8c8c',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}>
        <span>💡</span>
        <span>按 <kbd style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #d9d9d9',
          borderRadius: 3,
          fontSize: 11,
          fontFamily: 'monospace',
        }}>Enter</kbd> 发送，<kbd style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #d9d9d9',
          borderRadius: 3,
          fontSize: 11,
          fontFamily: 'monospace',
        }}>Shift + Enter</kbd> 换行</span>
      </div>

      {/* 隐藏滚动条的样式 */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AIQuestionInput;
