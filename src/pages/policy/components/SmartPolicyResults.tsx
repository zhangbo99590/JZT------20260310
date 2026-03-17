import React, { useState } from 'react';
import { Card, Tabs, List, Tag, Typography, Pagination, Empty, Button, Space } from 'antd';
import { FileTextOutlined, AppstoreOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HighlightText from '../../../components/common/HighlightText';

const { Text, Paragraph } = Typography;

interface PolicyItem {
  id: string;
  title: string;
  department: string;
  date: string;
  industry: string[];
  status: 'active' | 'upcoming' | 'closed';
  type: string; // Business Tag e.g. "认定", "补贴"
  content?: string;
}

interface SmartPolicyResultsProps {
  loading: boolean;
  data: PolicyItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  searchKeyword?: string;
  activeFilters?: {
    region?: string[];
    industry?: string[];
    [key: string]: string[] | undefined;
  };
}

const SmartPolicyResults: React.FC<SmartPolicyResultsProps> = ({ 
  loading, 
  data, 
  total, 
  page, 
  pageSize, 
  onPageChange,
  searchKeyword,
  activeFilters
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('policy');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // In a real app, this would trigger a data fetch
  };

  const getStatusTag = (status: string) => {
    switch(status) {
      case 'active': return <Tag color="success">申报中</Tag>;
      case 'upcoming': return <Tag color="warning">即将开始</Tag>;
      case 'closed': return <Tag color="default">已截止</Tag>;
      default: return <Tag>未知</Tag>;
    }
  };

  const tabs = [
    { label: `政策文件 (${Math.floor(total * 0.7)})`, key: 'policy', icon: <FileTextOutlined /> },
  ];

  return (
    <div className="smart-policy-results">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={tabs.map(t => ({
            key: t.key,
            label: <span>{t.icon} {t.label}</span>
          }))}
          style={{ marginBottom: 0 }}
        />
      </div>

      <Card bordered={false} bodyStyle={{ padding: '0 24px 24px' }}>
        {/* List */}
        <List
          loading={loading}
          itemLayout="vertical"
          dataSource={data}
          locale={{ emptyText: <Empty description="未找到匹配政策，请调整筛选条件或更换搜索关键词" /> }}
          renderItem={item => (
            <List.Item
              key={item.id}
              style={{ padding: '20px 0' }}
              actions={[
                <Button type="primary" ghost onClick={() => navigate(`/policy-center/detail/${item.id}`, { state: { policyData: item } })}>查看详情</Button>
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="blue">{item.type || '通用'}</Tag>
                    <Text strong style={{ fontSize: 16, marginRight: 8 }}>
                      <HighlightText 
                        text={item.title} 
                        keywords={[
                          ...(searchKeyword ? [searchKeyword] : []),
                          ...(activeFilters?.region || []),
                          ...(activeFilters?.industry || [])
                        ]}
                        highlightStyle={{
                          backgroundColor: '#fff2e8',
                          color: '#fa541c',
                          fontWeight: 600,
                          padding: '2px 4px',
                          borderRadius: '3px'
                        }}
                      />
                    </Text>
                    {getStatusTag(item.status)}
                  </div>
                  
                  <Space size={24} style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>
                    <span><CalendarOutlined /> 发布日期：{item.date}</span>
                    <span><AppstoreOutlined /> 适用行业：{item.industry.join('、')}</span>
                    <span><BankOutlined /> 发文机构：
                      <HighlightText 
                        text={item.department} 
                        keywords={[
                          ...(searchKeyword ? [searchKeyword] : []),
                          ...(activeFilters?.region || []),
                          ...(activeFilters?.industry || [])
                        ]}
                        highlightStyle={{
                          backgroundColor: '#fff7e6',
                          color: '#fa8c16',
                          fontWeight: 500,
                          padding: '1px 3px',
                          borderRadius: '2px'
                        }}
                      />
                    </span>
                  </Space>
                  
                  <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#888', marginBottom: 0 }}>
                    <HighlightText 
                      text={item.content || '暂无摘要...'} 
                      keywords={[
                        ...(searchKeyword ? [searchKeyword] : []),
                        ...(activeFilters?.region || []),
                        ...(activeFilters?.industry || [])
                      ]}
                      highlightStyle={{
                        backgroundColor: '#fff7e6',
                        color: '#fa8c16',
                        fontWeight: 500,
                        padding: '1px 3px',
                        borderRadius: '2px'
                      }}
                    />
                  </Paragraph>
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* Pagination */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            showQuickJumper
            showTotal={t => `共 ${t} 条`}
          />
        </div>
      </Card>
    </div>
  );
};

export default SmartPolicyResults;
