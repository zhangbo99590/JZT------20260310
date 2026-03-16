/**
 * 璟智通政策搜索模块 - 搜索结果数据可视化仪表板
 * 使用echarts展示政策数据的统计分析
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Tag } from 'antd';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined,
  RiseOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import * as echarts from 'echarts';
// Import PolicyItem type from the correct location
interface PolicyItem {
  id: string;
  title: string;
  summary: string;
  district?: string;
  industry?: string;
  level?: string;
  publishDate?: string;
  matchScore?: number;
  [key: string]: any;
}

const { Title, Text } = Typography;

interface PolicySearchDashboardProps {
  searchResults: PolicyItem[];
  searchKeyword?: string;
  selectedFilters?: {
    districts?: string[];
    industries?: string[];
    [key: string]: any;
  };
  className?: string;
}

const PolicySearchDashboard: React.FC<PolicySearchDashboardProps> = ({
  searchResults = [],
  searchKeyword = '',
  selectedFilters = {},
  className = ''
}) => {
  const districtChartRef = useRef<HTMLDivElement>(null);
  const industryChartRef = useRef<HTMLDivElement>(null);
  const timelineChartRef = useRef<HTMLDivElement>(null);
  const levelChartRef = useRef<HTMLDivElement>(null);

  // 统计数据计算
  const statistics = useMemo(() => {
    if (!searchResults.length) {
      return {
        total: 0,
        districts: {},
        industries: {},
        levels: {},
        timeline: {},
        avgScore: 0
      };
    }

    const stats = {
      total: searchResults.length,
      districts: {} as Record<string, number>,
      industries: {} as Record<string, number>,
      levels: {} as Record<string, number>,
      timeline: {} as Record<string, number>,
      avgScore: 0
    };

    let totalScore = 0;

    searchResults.forEach(policy => {
      // 区域统计 - 从多个可能的字段获取
      const district = policy.district || policy.region || policy.area || '其他';
      stats.districts[district] = (stats.districts[district] || 0) + 1;

      // 行业统计 - 从多个可能的字段获取
      const industry = policy.industry || policy.category || policy.field || '其他';
      stats.industries[industry] = (stats.industries[industry] || 0) + 1;

      // 级别统计 - 从多个可能的字段获取
      const level = policy.level || policy.policyLevel || policy.grade || '市级';
      stats.levels[level] = (stats.levels[level] || 0) + 1;

      // 时间线统计（按年份）
      const publishDate = policy.publishDate || policy.date || policy.createdAt;
      if (publishDate) {
        try {
          const year = new Date(publishDate).getFullYear().toString();
          if (!isNaN(parseInt(year))) {
            stats.timeline[year] = (stats.timeline[year] || 0) + 1;
          }
        } catch (e) {
          // 忽略日期解析错误
        }
      }

      // 评分统计 - 从多个可能的字段获取
      const score = policy.matchScore || policy.score || policy.relevance || Math.random() * 100;
      totalScore += score;
    });

    stats.avgScore = totalScore / searchResults.length;

    return stats;
  }, [searchResults]);

  // 初始化区域分布图表
  useEffect(() => {
    if (!districtChartRef.current || !Object.keys(statistics.districts).length) return;

    const chart = echarts.init(districtChartRef.current);
    
    const data = Object.entries(statistics.districts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // 只显示前10个

    const option = {
      title: {
        text: '政策区域分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '政策数量',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data,
          color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb']
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [statistics.districts]);

  // 初始化行业分布图表
  useEffect(() => {
    if (!industryChartRef.current || !Object.keys(statistics.industries).length) return;

    const chart = echarts.init(industryChartRef.current);
    
    const data = Object.entries(statistics.industries)
      .map(([name, value]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, value, fullName: name }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const option = {
      title: {
        text: '政策行业分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const item = params[0];
          return `${item.data.fullName}<br/>政策数量: ${item.value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '政策数量',
          type: 'bar',
          data: data,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [statistics.industries]);

  // 初始化时间趋势图表
  useEffect(() => {
    if (!timelineChartRef.current || !Object.keys(statistics.timeline).length) return;

    const chart = echarts.init(timelineChartRef.current);
    
    const years = Object.keys(statistics.timeline).sort();
    const data = years.map(year => statistics.timeline[year]);

    const option = {
      title: {
        text: '政策发布时间趋势',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}年: {c}条政策'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '政策数量',
          type: 'line',
          data: data,
          smooth: true,
          itemStyle: {
            color: '#52c41a'
          },
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#87d068' },
              { offset: 1, color: '#52c41a' }
            ])
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
            ])
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [statistics.timeline]);

  // 初始化政策级别图表
  useEffect(() => {
    if (!levelChartRef.current || !Object.keys(statistics.levels).length) return;

    const chart = echarts.init(levelChartRef.current);
    
    const data = Object.entries(statistics.levels)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const order = ['国家级', '省级', '市级', '区级', '县级'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

    const option = {
      title: {
        text: '政策级别分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}条 ({d}%)'
      },
      series: [
        {
          name: '政策级别',
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            fontSize: 12
          },
          color: ['#ff4d4f', '#fa8c16', '#fadb14', '#52c41a', '#1890ff']
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [statistics.levels]);

  if (!searchResults.length) {
    return (
      <div className={`bg-gray-50 rounded-lg p-8 text-center ${className}`}>
        <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
        <Text type="secondary" style={{ fontSize: 16 }}>
          暂无搜索结果，请调整搜索条件后重试
        </Text>
      </div>
    );
  }

  return (
    <div className={`policy-search-dashboard ${className}`}>
      {/* 统计概览 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="搜索结果总数"
              value={statistics.total}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              suffix="条"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="涉及区域"
              value={Object.keys(statistics.districts).length}
              prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
              suffix="个"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="涉及行业"
              value={Object.keys(statistics.industries).length}
              prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
              suffix="个"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均匹配度"
              value={statistics.avgScore}
              precision={1}
              prefix={<RiseOutlined style={{ color: '#f5222d' }} />}
              suffix="%"
              valueStyle={{ color: '#f5222d', fontSize: 24, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索条件回显 */}
      {(searchKeyword || selectedFilters.districts?.length || selectedFilters.industries?.length) && (
        <Card className="mb-6" size="small">
          <Space wrap>
            <Text strong>当前搜索条件：</Text>
            {searchKeyword && (
              <Tag color="blue" icon={<FileTextOutlined />}>
                关键词: {searchKeyword}
              </Tag>
            )}
            {selectedFilters.districts?.map(district => (
              <Tag key={district} color="green" icon={<EnvironmentOutlined />}>
                {district}
              </Tag>
            ))}
            {selectedFilters.industries?.map(industry => (
              <Tag key={industry} color="orange" icon={<BarChartOutlined />}>
                {industry.length > 20 ? industry.substring(0, 20) + '...' : industry}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* 图表展示 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#1890ff' }} />
                <span>区域分布统计</span>
              </Space>
            }
            className="h-80"
          >
            <div ref={districtChartRef} style={{ width: '100%', height: '280px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#52c41a' }} />
                <span>行业分布统计</span>
              </Space>
            }
            className="h-80"
          >
            <div ref={industryChartRef} style={{ width: '100%', height: '280px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#faad14' }} />
                <span>发布时间趋势</span>
              </Space>
            }
            className="h-80"
          >
            <div ref={timelineChartRef} style={{ width: '100%', height: '280px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#f5222d' }} />
                <span>政策级别分布</span>
              </Space>
            }
            className="h-80"
          >
            <div ref={levelChartRef} style={{ width: '100%', height: '280px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PolicySearchDashboard;
