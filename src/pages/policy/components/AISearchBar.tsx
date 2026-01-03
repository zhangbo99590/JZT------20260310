/**
 * AI智能搜索栏组件
 * 包含自然语言搜索、语音输入、智能联想等功能
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Tooltip, Dropdown, Tag, Space, message } from 'antd';
import {
  SearchOutlined,
  AudioOutlined,
  UserOutlined,
  HistoryOutlined,
  BulbOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from '../AIPolicyCenter.module.css';
import { SearchHistory, AITemplate } from '../types';

const { Search } = Input;

interface AISearchBarProps {
  onSearch: (query: string) => void;
  onProfileClick: () => void;
  companyProfileExists: boolean;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  onProfileClick,
  companyProfileExists,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // 模拟搜索历史数据
  useEffect(() => {
    const mockHistory: SearchHistory[] = [
      {
        id: '1',
        query: '北京小型科技企业2024年能领的补贴政策有哪些？',
        timestamp: '2024-01-02 14:30',
        resultCount: 12,
      },
      {
        id: '2',
        query: '高新技术企业认定条件',
        timestamp: '2024-01-02 10:15',
        resultCount: 8,
      },
      {
        id: '3',
        query: '专精特新企业申报流程',
        timestamp: '2024-01-01 16:20',
        resultCount: 15,
      },
    ];
    setSearchHistory(mockHistory);
  }, []);

  // 根据输入内容生成智能模板
  useEffect(() => {
    if (searchValue.trim()) {
      const keyword = searchValue.trim();
      const generatedTemplates: AITemplate[] = [];

      if (keyword.includes('补贴') || keyword.includes('资金')) {
        generatedTemplates.push({
          id: 't1',
          title: '补贴政策查询',
          template: `${keyword}政策申报条件和补贴金额是多少？`,
          category: '补贴',
        });
        generatedTemplates.push({
          id: 't2',
          title: '企业适配查询',
          template: `我们公司能申请${keyword}吗？需要什么条件？`,
          category: '适配',
        });
      }

      if (keyword.includes('高新') || keyword.includes('认定')) {
        generatedTemplates.push({
          id: 't3',
          title: '认定条件查询',
          template: `${keyword}的申报条件和流程是什么？`,
          category: '认定',
        });
      }

      if (keyword.includes('申报') || keyword.includes('流程')) {
        generatedTemplates.push({
          id: 't4',
          title: '申报指南',
          template: `${keyword}需要准备哪些材料？`,
          category: '申报',
        });
      }

      // 通用模板
      generatedTemplates.push({
        id: 't5',
        title: '政策解读',
        template: `请详细解读${keyword}相关政策`,
        category: '解读',
      });

      setTemplates(generatedTemplates);
      setShowTemplates(generatedTemplates.length > 0);
    } else {
      setShowTemplates(false);
    }
  }, [searchValue]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchValue(transcript);
        setIsListening(false);
        message.success('语音识别成功');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false);
        message.error('语音识别失败，请重试');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索内容');
      return;
    }

    setIsSearching(true);
    
    // 添加到历史记录
    const newHistory: SearchHistory = {
      id: Date.now().toString(),
      query: value,
      timestamp: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSearchHistory([newHistory, ...searchHistory.slice(0, 9)]);

    // 模拟AI搜索延迟
    setTimeout(() => {
      setIsSearching(false);
      onSearch(value);
    }, 1500);
  };

  // 语音输入
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      message.error('您的浏览器不支持语音识别功能');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        message.info('请开始说话...');
      } catch (error) {
        console.error('启动语音识别失败:', error);
        message.error('启动语音识别失败');
      }
    }
  };

  // 历史记录菜单
  const historyMenuItems: MenuProps['items'] = searchHistory.map((item) => ({
    key: item.id,
    label: (
      <div className={styles.historyItem} onClick={() => setSearchValue(item.query)}>
        <div>{item.query}</div>
        <div className={styles.historyTime}>
          <HistoryOutlined /> {item.timestamp}
          {item.resultCount && ` · ${item.resultCount}条结果`}
        </div>
      </div>
    ),
  }));

  // 模板点击
  const handleTemplateClick = (template: AITemplate) => {
    setSearchValue(template.template);
    setShowTemplates(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.aiSearchBar}>
        <Search
          placeholder="用自然语言描述您的需求，如：北京小型科技企业2024年能领的补贴政策有哪些？"
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              AI搜索
            </Button>
          }
          suffix={
            <Space>
              <Tooltip title={isListening ? '停止录音' : '语音输入'}>
                <Button
                  type="text"
                  icon={<AudioOutlined />}
                  className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
                  onClick={handleVoiceInput}
                  danger={isListening}
                />
              </Tooltip>
              
              <Tooltip title={companyProfileExists ? '管理企业信息' : '绑定企业信息'}>
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  className={styles.companyProfileButton}
                  onClick={onProfileClick}
                />
              </Tooltip>

              {searchHistory.length > 0 && (
                <Dropdown
                  menu={{ items: historyMenuItems }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button type="text" icon={<HistoryOutlined />} />
                </Dropdown>
              )}
            </Space>
          }
        />

        {isSearching && (
          <div className={styles.searchProgress}>
            <LoadingOutlined />
            <span>AI正在解析你的需求...</span>
          </div>
        )}
      </div>

      {showTemplates && templates.length > 0 && (
        <div className={styles.templateSuggestions}>
          <Space size={[8, 8]} wrap>
            <Tag icon={<BulbOutlined />} color="blue">
              智能提问建议
            </Tag>
            {templates.map((template) => (
              <Tag
                key={template.id}
                className={styles.templateTag}
                onClick={() => handleTemplateClick(template)}
              >
                {template.template}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
