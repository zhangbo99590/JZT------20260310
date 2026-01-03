/**
 * 常用关键词组件
 * 显示常用搜索关键词，支持点击快速搜索
 */

import React from 'react';
import { Space, Tag, Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import type { CommonKeyword } from '../../../types/contract';

const { Text } = Typography;

interface CommonKeywordsProps {
  keywords: CommonKeyword[];
  onKeywordClick: (keyword: string) => void;
}

const CommonKeywords: React.FC<CommonKeywordsProps> = ({ keywords, onKeywordClick }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div>
      <Space size="small" align="center" style={{ marginBottom: 8 }}>
        <FireOutlined style={{ color: '#ff4d4f' }} />
        <Text type="secondary" style={{ fontSize: 13 }}>
          常用关键词：
        </Text>
      </Space>
      <Space size={[8, 8]} wrap>
        {keywords.map((item, index) => (
          <Tag
            key={item.keyword}
            color={index < 3 ? 'red' : 'default'}
            style={{
              cursor: 'pointer',
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: '4px',
            }}
            onClick={() => onKeywordClick(item.keyword)}
          >
            {item.keyword}
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
              ({item.count})
            </Text>
          </Tag>
        ))}
      </Space>
    </div>
  );
};

export default CommonKeywords;
