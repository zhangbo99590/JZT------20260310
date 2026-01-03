/**
 * AI政策洞察面板
 * 展示企业政策机会数据、申报优先级建议、资质缺口提醒等
 */

import React from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Progress,
  Tooltip,
} from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  FireOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import SafeECharts from '../../../components/SafeECharts';
import styles from '../AIPolicyCenter.module.css';
import { AIInsights, PriorityRecommendation, QualificationGap } from '../types';

interface AIInsightsPanelProps {
  insights: AIInsights;
  onPolicyClick: (policyId: string) => void;
  onQualificationGuide: (qualification: string) => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onPolicyClick,
  onQualificationGuide,
}) => {
  // 优先级颜色映射
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      case 'low':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  // 难度颜色映射
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low':
        return 'green';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return 'default';
    }
  };

  // 政策类别分布图表配置
  const getCategoryChartOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
      },
      series: [
        {
          name: '政策类别',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 8, name: '补贴政策', itemStyle: { color: '#1890ff' } },
            { value: 5, name: '资质认定', itemStyle: { color: '#52c41a' } },
            { value: 3, name: '培训扶持', itemStyle: { color: '#faad14' } },
          ],
        },
      ],
    };
  };

  // 补贴金额趋势图表配置
  const getSubsidyTrendOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
        axisLabel: {
          color: '#8c8c8c',
        },
      },
      yAxis: {
        type: 'value',
        name: '金额(万元)',
        axisLine: {
          lineStyle: {
            color: '#d9d9d9',
          },
        },
        axisLabel: {
          color: '#8c8c8c',
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
      },
      series: [
        {
          name: '可获补贴',
          type: 'bar',
          data: [20, 35, 45, 60, 75, 85],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#52c41a' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
  };

  return (
    <div className={styles.bottomSection}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        <ThunderboltOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        AI政策洞察
      </h2>

      {/* 数据卡片 */}
      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <div className={styles.insightIcon} style={{ background: '#e6f7ff', color: '#1890ff' }}>
            <FileTextOutlined />
          </div>
          <div className={styles.insightLabel}>可申报政策数</div>
          <div className={styles.insightValue}>
            {insights.applicablePoliciesCount}
            <span className={styles.insightUnit}>个</span>
          </div>
          <div className={styles.insightUpdate}>
            更新于 {new Date(insights.lastUpdated).toLocaleString('zh-CN')}
          </div>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon} style={{ background: '#fff7e6', color: '#faad14' }}>
            <DollarOutlined />
          </div>
          <div className={styles.insightLabel}>预估可获补贴总额</div>
          <div className={styles.insightValue}>
            {insights.estimatedTotalSubsidy}
            <span className={styles.insightUnit}>万元</span>
          </div>
          <div className={styles.insightUpdate}>
            基于当前企业画像计算
          </div>
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightIcon} style={{ background: '#f6ffed', color: '#52c41a' }}>
            <TrophyOutlined />
          </div>
          <div className={styles.insightLabel}>高适配政策数</div>
          <div className={styles.insightValue}>
            {insights.highMatchPoliciesCount}
            <span className={styles.insightUnit}>个</span>
          </div>
          <div className={styles.insightUpdate}>
            匹配度 ≥ 80%
          </div>
        </div>
      </div>

      {/* 图表展示 */}
      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={12}>
          <Card title="政策类别分布" bordered={false}>
            <div className={styles.chartContainer}>
              <SafeECharts option={getCategoryChartOption()} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="预估补贴趋势" bordered={false}>
            <div className={styles.chartContainer}>
              <SafeECharts option={getSubsidyTrendOption()} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* AI申报优先级建议 */}
      <div className={styles.priorityList}>
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
          <FireOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
          AI申报优先级建议
        </h3>

        {insights.priorityRecommendations.map((rec, index) => (
          <div
            key={index}
            className={`${styles.priorityItem} ${styles[rec.priority]}`}
            onClick={() => onPolicyClick(rec.policyId)}
          >
            <div className={styles.priorityHeader}>
              <div className={styles.priorityTitle}>{rec.policyTitle}</div>
              <Tag className={`${styles.priorityBadge} ${styles[rec.priority]}`}>
                {rec.priority === 'high'
                  ? '优先申报'
                  : rec.priority === 'medium'
                  ? '次优先'
                  : '长期关注'}
              </Tag>
            </div>

            <div className={styles.priorityReason}>{rec.reason}</div>

            <div className={styles.priorityMeta}>
              {rec.subsidy && (
                <div className={styles.metaItem}>
                  <DollarOutlined style={{ color: '#ff4d4f' }} />
                  <span style={{ fontWeight: 600 }}>补贴 {rec.subsidy}万元</span>
                </div>
              )}

              <div className={styles.metaItem}>
                <Tag color={getDifficultyColor(rec.difficulty)}>
                  {rec.difficulty === 'low'
                    ? '难度低'
                    : rec.difficulty === 'medium'
                    ? '难度中'
                    : '难度高'}
                </Tag>
              </div>

              {rec.daysRemaining !== undefined && (
                <div className={styles.metaItem}>
                  <ClockCircleOutlined
                    style={{ color: rec.daysRemaining <= 7 ? '#ff4d4f' : '#faad14' }}
                  />
                  <span
                    style={{
                      color: rec.daysRemaining <= 7 ? '#ff4d4f' : '#faad14',
                      fontWeight: 600,
                    }}
                  >
                    剩余{rec.daysRemaining}天
                  </span>
                </div>
              )}

              <Button
                type="link"
                size="small"
                icon={<RightOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onPolicyClick(rec.policyId);
                }}
              >
                查看详情
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* AI资质缺口提醒 */}
      {insights.qualificationGaps.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
            <ExclamationCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
            AI资质缺口提醒与指引
          </h3>

          <div className={styles.gapList}>
            {insights.qualificationGaps.map((gap, index) => (
              <div key={index} className={styles.gapItem}>
                <div className={styles.gapTitle}>
                  <SafetyCertificateOutlined />
                  缺少资质：{gap.qualification}
                </div>
                <div className={styles.gapContent}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>影响政策：</strong>
                    {gap.requiredBy.length}个高适配政策需要此资质
                  </div>
                  {gap.acquisitionPath && (
                    <div className={styles.gapPath}>
                      <strong>获取路径：</strong>
                      {gap.acquisitionPath}
                      <Button
                        type="link"
                        size="small"
                        icon={<RightOutlined />}
                        onClick={() => onQualificationGuide(gap.qualification)}
                      >
                        查看资质获取指南
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作提示 */}
      <div
        style={{
          marginTop: 32,
          padding: 20,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          💡 AI智能建议
        </div>
        <div style={{ color: '#595959', lineHeight: 1.6 }}>
          根据您的企业画像和当前政策环境，建议优先申报高匹配度、低难度、即将截止的政策。
          <br />
          同时关注资质获取，为后续更多政策申报做准备。
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
