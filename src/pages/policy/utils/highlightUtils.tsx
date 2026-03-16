/**
 * 关键词高亮工具函数
 * 用于在搜索结果中高亮显示关键词
 */

import React from 'react';

/**
 * 高亮关键词 - 返回带高亮标记的React元素
 * @param text 原始文本
 * @param keywords 关键词数组
 * @param highlightColor 高亮颜色，默认为红色 #FF4D4F
 * @returns React元素
 */
export const highlightKeywords = (
  text: string,
  keywords: string | string[],
  highlightColor: string = '#FF4D4F'
): React.ReactNode => {
  if (!text) return text;
  
  // 确保keywords是数组
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  
  // 过滤空关键词
  const validKeywords = keywordArray.filter(k => k && k.trim());
  
  if (validKeywords.length === 0) return text;
  
  // 创建正则表达式，不区分大小写，匹配所有关键词
  const pattern = validKeywords
    .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 转义特殊字符
    .join('|');
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  // 分割文本
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        // 检查是否是关键词（不区分大小写）
        const isKeyword = validKeywords.some(
          keyword => keyword.toLowerCase() === part.toLowerCase()
        );
        
        if (isKeyword) {
          return (
            <span
              key={index}
              style={{
                color: highlightColor,
                fontWeight: 500
              }}
            >
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

/**
 * 检查文本是否包含关键词（不区分大小写）
 * @param text 文本
 * @param keywords 关键词数组
 * @returns 是否包含
 */
export const containsKeywords = (
  text: string,
  keywords: string | string[]
): boolean => {
  if (!text) return false;
  
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  const validKeywords = keywordArray.filter(k => k && k.trim());
  
  if (validKeywords.length === 0) return false;
  
  const lowerText = text.toLowerCase();
  return validKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
};

/**
 * 提取文本中的关键词片段（用于摘要显示）
 * @param text 原始文本
 * @param keywords 关键词数组
 * @param contextLength 上下文长度
 * @returns 包含关键词的文本片段
 */
export const extractKeywordContext = (
  text: string,
  keywords: string | string[],
  contextLength: number = 50
): string => {
  if (!text) return '';
  
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  const validKeywords = keywordArray.filter(k => k && k.trim());
  
  if (validKeywords.length === 0) return text.substring(0, 100);
  
  const lowerText = text.toLowerCase();
  
  // 找到第一个关键词的位置
  let firstIndex = -1;
  let matchedKeyword = '';
  
  for (const keyword of validKeywords) {
    const index = lowerText.indexOf(keyword.toLowerCase());
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
      matchedKeyword = keyword;
    }
  }
  
  if (firstIndex === -1) return text.substring(0, 100);
  
  // 计算起始和结束位置
  const start = Math.max(0, firstIndex - contextLength);
  const end = Math.min(text.length, firstIndex + matchedKeyword.length + contextLength);
  
  let excerpt = text.substring(start, end);
  
  // 添加省略号
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt;
};

/**
 * 多字段关键词匹配检查
 * @param item 数据项
 * @param keywords 关键词数组
 * @param fields 要检查的字段名数组
 * @returns 是否匹配
 */
export const matchKeywordsInFields = (
  item: any,
  keywords: string | string[],
  fields: string[]
): boolean => {
  if (!item || !fields || fields.length === 0) return false;
  
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  const validKeywords = keywordArray.filter(k => k && k.trim());
  
  if (validKeywords.length === 0) return true; // 无关键词时返回true
  
  // 检查任意字段是否包含关键词
  return fields.some(field => {
    const value = item[field];
    if (!value) return false;
    
    const text = typeof value === 'string' ? value : String(value);
    return containsKeywords(text, validKeywords);
  });
};
