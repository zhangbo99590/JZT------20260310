import React from "react";

interface HighlightTextProps {
  text: string;
  keywords: string | string[];
  highlightStyle?: React.CSSProperties;
  caseSensitive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const defaultHighlightStyle: React.CSSProperties = {
  backgroundColor: "#fff2e8",
  color: "#fa541c",
  fontWeight: 500,
  padding: "1px 2px",
  borderRadius: "2px",
};

/**
 * 高亮文本组件
 * 用于在文本中高亮显示搜索关键词
 */
const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  keywords,
  highlightStyle = defaultHighlightStyle,
  caseSensitive = false,
  className,
  style,
}) => {
  if (!text || !keywords) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  // 处理关键词数组
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];

  // 过滤空关键词
  const validKeywords = keywordArray
    .filter((keyword) => keyword && keyword.trim().length > 0)
    .map((keyword) => keyword.trim());

  if (validKeywords.length === 0) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  // 创建正则表达式来匹配所有关键词
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const escapedKeywords = validKeywords.map(escapeRegExp);
  const regex = new RegExp(
    `(${escapedKeywords.join("|")})`,
    caseSensitive ? "g" : "gi",
  );

  // 分割文本并高亮匹配的部分
  const parts = text.split(regex);

  return (
    <span className={className} style={style}>
      {parts.map((part, index) => {
        // 检查当前部分是否匹配任何关键词
        const isHighlight = validKeywords.some((keyword) =>
          caseSensitive
            ? part === keyword
            : part.toLowerCase() === keyword.toLowerCase(),
        );

        if (isHighlight) {
          return (
            <mark key={index} style={highlightStyle}>
              {part}
            </mark>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default HighlightText;
