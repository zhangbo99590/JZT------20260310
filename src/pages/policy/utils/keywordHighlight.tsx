/**
 * 关键词高亮工具函数
 * 实现搜索关键词的红色高亮显示功能
 */

import React from 'react';

/**
 * 高亮关键词的样式
 */
const highlightStyle: React.CSSProperties = {
  color: '#FF4D4F',
  fontWeight: 'normal',
  backgroundColor: 'transparent'
};

/**
 * 将文本中的关键词进行高亮处理
 * @param text 原始文本
 * @param keywords 关键词数组
 * @returns 包含高亮元素的React节点
 */
export const highlightKeywords = (text: string, keywords: string[]): React.ReactNode => {
  if (!text || !keywords || keywords.length === 0) {
    return text;
  }

  // 过滤空关键词并去重
  const validKeywords = [...new Set(keywords.filter(k => k && k.trim()))];
  
  if (validKeywords.length === 0) {
    return text;
  }

  // 创建正则表达式，匹配所有关键词（不区分大小写）
  const regex = new RegExp(`(${validKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  
  // 分割文本并高亮匹配的部分
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    // 检查当前部分是否匹配任何关键词
    const isKeyword = validKeywords.some(keyword => 
      part.toLowerCase() === keyword.toLowerCase()
    );
    
    if (isKeyword) {
      return (
        <span key={index} style={highlightStyle}>
          {part}
        </span>
      );
    }
    
    return part;
  });
};

/**
 * 检查文本是否包含任何关键词
 * @param text 要检查的文本
 * @param keywords 关键词数组
 * @returns 是否包含关键词
 */
export const containsKeywords = (text: string, keywords: string[]): boolean => {
  if (!text || !keywords || keywords.length === 0) {
    return false;
  }

  const lowerText = text.toLowerCase();
  return keywords.some(keyword => 
    keyword && keyword.trim() && lowerText.includes(keyword.toLowerCase().trim())
  );
};

/**
 * 分词处理关键词
 * @param searchTerm 搜索词
 * @returns 分词后的关键词数组
 */
export const segmentSearchKeywords = (searchTerm: string): string[] => {
  if (!searchTerm || !searchTerm.trim()) {
    return [];
  }

  const term = searchTerm.trim();
  const keywords: string[] = [];
  
  // 添加完整搜索词
  keywords.push(term);
  
  // 按空格分割
  const spaceSegments = term.split(/\s+/).filter(s => s.length > 0);
  keywords.push(...spaceSegments);
  
  // 简单的中文分词（基于常见词汇）
  const commonWords = [
    '北京市', '丰台区', '朝阳区', '海淀区', '西城区', '东城区', '石景山区',
    '金融', '补贴', '政策', '科技', '创新', '企业', '认定', '奖励',
    '高新技术', '中小企业', '国家级', '市级', '区级', '省级'
  ];
  
  commonWords.forEach(word => {
    if (term.includes(word)) {
      keywords.push(word);
    }
  });
  
  // 去重并过滤空值
  return [...new Set(keywords)].filter(k => k && k.trim());
};
