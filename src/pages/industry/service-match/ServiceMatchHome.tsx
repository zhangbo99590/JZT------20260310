import React, { useState, useEffect } from 'react';
import { 
  List, 
  Card, 
  Tag, 
  Button, 
  Typography, 
  Skeleton, 
  Space, 
  Empty,
  message,
  Rate,
  Radio,
  Checkbox,
  Row,
  Col
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  StarFilled,
  ReloadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { COMMON_STYLES } from './styles';
import HallHeader from './components/HallHeader';
import ServiceMatchCard from './components/ServiceMatchCard';
import ConnectModal from './components/ConnectModal';
import ComparisonModal from './components/ComparisonModal';
import { getPublications, getRecommendedPublications } from '../../../services/industryService';

const { Title, Text, Paragraph } = Typography;

const ServiceMatchHome: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [recommendData, setRecommendData] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [sortField, setSortField] = useState('match'); // match | time | qual
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState<any>(null);

  // API Call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Reset selection and compare on refresh
      setSelectedRowKeys([]);
      setCompareList([]);
      
      try {
        const type = 'supply'; // Always supply for Business Hall
        
        // Map filters
        const regionMap: Record<string, string> = {
          'beijing': '北京', 'shanghai': '上海', 'guangzhou': '广州',
          'shenzhen': '深圳', 'hangzhou': '杭州', 'suzhou': '苏州'
        };
        const region = filters.region ? regionMap[filters.region] : undefined;

        // Parallel fetch
        const [listData, recommendList] = await Promise.all([
          getPublications({ 
             type, 
             keyword: searchText, 
             region,
          }),
          getRecommendedPublications(3)
        ]);

        // Map listData
        const mappedData = listData.map((p: any) => ({
            id: p.id,
            name: p.publisherName || p.title,
            isMasked: false,
            advantageTags: p.tags?.slice(0, 2) || [],
            tags: p.tags || [],
            region: p.region || '未知',
            scope: p.description,
            updateTime: p.publishTime ? p.publishTime.split(' ')[0] : '刚刚',
            score: p.rating || 4,
            matchDegree: p.matchScore || Math.floor(Math.random() * 40) + 60,
            qualification: p.isCertified ? '已认证' : '未认证',
            budget: p.budget ? `${p.budget}${p.budgetUnit || '万'}` : '面议',
            quantity: '-',
            deadline: p.expiryDate
        }));

        // Client-side sorting
        if (sortField === 'match') {
            mappedData.sort((a, b) => b.matchDegree - a.matchDegree);
        } else if (sortField === 'qual') {
             mappedData.sort((a, b) => b.score - a.score);
        }

        setData(mappedData);
        
        // Map recommend data
        setRecommendData(recommendList.map((p: any) => ({
            id: p.id,
            name: p.publisherName || p.title,
            scope: p.description,
            score: p.rating || 5,
            matchDegree: p.matchScore || Math.floor(Math.random() * 10) + 90,
            isRecommend: true,
            tags: p.tags || [],
            region: p.region || '未知'
        })));

      } catch (error) {
        console.error('Fetch failed:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText, filters, sortField]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCreateClick = () => {
    navigate('/industry/service-match/publish?type=supply');
  };

  const handleSortChange = (e: any) => {
    setSortField(e.target.value);
    message.loading('正在重新排序...', 0.5);
  };

  const handleRefreshRecommend = () => {
    message.success('已刷新推荐列表');
    // Mock refresh logic - just shuffle or keep same
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRowKeys(data.map(item => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(prev => [...prev, id]);
    } else {
      setSelectedRowKeys(prev => prev.filter(k => k !== id));
    }
  };

  const handleCompareToggle = (item: any) => {
    const exists = compareList.find(c => c.id === item.id);
    if (exists) {
      setCompareList(prev => prev.filter(c => c.id !== item.id));
    } else {
      if (compareList.length >= 3) {
        message.warning('最多只能对比3家企业');
        return;
      }
      setCompareList(prev => [...prev, item]);
    }
  };

  const handleBatchConnect = () => {
    const targets = data.filter(d => selectedRowKeys.includes(d.id));
    setConnectTarget(targets);
    setConnectModalOpen(true);
  };

  const handleConnectClick = (item: any) => {
    setConnectTarget(item);
    setConnectModalOpen(true);
  };

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) return;
    
    message.loading({ content: '正在导出数据...', key: 'export' });
    
    try {
        const targets = data.filter(d => selectedRowKeys.includes(d.id));
        
        // Generate CSV
        const headers = ['企业/需求名称', '所在地区', '匹配度', '业务标签', '需求/业务描述', '更新时间', '质量评分'];
        const csvContent = [
          headers.join(','),
          ...targets.map(t => [
            `"${t.name}"`,
            `"${t.region}"`,
            `${t.matchDegree}%`,
            `"${t.tags.join(';')}"`,
            `"${t.scope.replace(/"/g, '""')}"`, // Escape quotes
            t.updateTime,
            t.score
          ].join(','))
        ].join('\n');
        
        // Trigger download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `企服大厅_批量导出_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
            message.success({ content: `成功导出 ${targets.length} 条数据`, key: 'export' });
        }, 800);
    } catch (e) {
        console.error(e);
        message.error({ content: '导出失败', key: 'export' });
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 60 }}>
      {/* Fixed Header */}
      <div style={{ padding: '0 20px' }}>
        <HallHeader 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onCreateClick={handleCreateClick}
          isProcurement={false}
        />
      </div>

      <div style={{ padding: '20px' }}>
        {/* Sorting & Batch Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
           <Space>
             <Checkbox 
               checked={data.length > 0 && selectedRowKeys.length === data.length}
               indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
               onChange={handleSelectAll}
             >
               全选
             </Checkbox>
             <Text type="secondary">共找到 {data.length} 条结果</Text>
           </Space>
           
           <Radio.Group value={sortField} onChange={handleSortChange} buttonStyle="solid">
             <Radio.Button value="match">匹配度</Radio.Button>
             <Radio.Button value="time">发布时间</Radio.Button>
             <Radio.Button value="qual">企业资质</Radio.Button>
           </Radio.Group>
        </div>

        {/* Content List */}
        <div style={{ minHeight: '400px' }}>
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <Card key={i} style={{ ...COMMON_STYLES.card, marginBottom: '15px' }}>
                 <Skeleton active avatar paragraph={{ rows: 2 }} />
               </Card>
             ))
          ) : data.length > 0 ? (
            <List
              dataSource={data}
              renderItem={(item) => (
                <ServiceMatchCard
                  item={item}
                  isSelected={selectedRowKeys.includes(item.id)}
                  isComparing={compareList.some(c => c.id === item.id)}
                  activeTab="business"
                  onSelect={handleSelectRow}
                  onCompare={handleCompareToggle}
                  onConnect={handleConnectClick}
                  navigate={navigate}
                />
              )}
              split={false}
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">暂无相关企业信息</Text>
                  <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>
                    建议放宽筛选条件或尝试其他关键词
                  </Text>
                </div>
              } 
            />
          )}
        </div>

        {/* Recommendation Section */}
        <div style={{ marginTop: 40, marginBottom: 24 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
             <Title level={5} style={{ margin: 0 }}><StarFilled style={{ color: '#faad14', marginRight: 8 }} />为你推荐</Title>
             <Button type="text" icon={<ReloadOutlined />} onClick={handleRefreshRecommend}>换一批</Button>
           </div>
           <Row gutter={16}>
             {recommendData.map((item) => (
               <Col span={8} key={item.id}>
                 <Card 
                    hoverable 
                    size="small"
                    style={{ ...COMMON_STYLES.card, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                    onClick={() => navigate(`/industry/service-match/detail/${item.id}`)}
                 >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: 14 }}>{item.name}</Text>
                      <Tag color="gold">推荐</Tag>
                    </div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12, marginTop: 8, color: '#666', marginBottom: 8 }}>
                      {item.scope}
                    </Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Rate disabled defaultValue={item.score} style={{ fontSize: 12 }} />
                       <Text type="secondary" style={{ fontSize: 12 }}>匹配度 {item.matchDegree}%</Text>
                    </div>
                 </Card>
               </Col>
             ))}
           </Row>
        </div>
      </div>

      {/* Batch Action Bar (Fixed Bottom) */}
      {selectedRowKeys.length > 0 && (
        <div style={{ 
          position: 'fixed', 
          bottom: 20, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          backgroundColor: '#333', 
          padding: '12px 24px', 
          borderRadius: 30,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: '#fff'
        }}>
           <span>已选择 {selectedRowKeys.length} 项</span>
           <Button type="primary" shape="round" onClick={handleBatchConnect}>批量对接</Button>
           <Button ghost shape="round" onClick={handleBatchExport}>批量导出</Button>
           <Button type="text" style={{ color: '#fff' }} onClick={() => setSelectedRowKeys([])}>取消</Button>
        </div>
      )}

      {/* Comparison Floating Button */}
       {compareList.length > 0 && (
          <div style={{
             position: 'fixed',
             bottom: 100,
             right: 40,
             zIndex: 1000
          }}>
             <Button 
               type="primary" 
               size="large" 
               icon={<BarChartOutlined />}
               onClick={() => setComparisonModalOpen(true)}
             >
               开始对比 ({compareList.length})
             </Button>
          </div>
       )}

       <ComparisonModal 
         open={comparisonModalOpen}
         items={compareList}
         onCancel={() => setComparisonModalOpen(false)}
       />

       {/* Connect Modal - Enhanced */}
       <ConnectModal 
         open={connectModalOpen}
         target={connectTarget}
         onCancel={() => {
           setConnectModalOpen(false);
           setSelectedRowKeys([]); // Clear selection on close if it was batch
         }}
       />
    </div>
  );
};

export default ServiceMatchHome;
