/**
 * AI政策卡片列表组件
 * 展示AI推荐的政策，支持匹配度显示、快速操作等
 */

import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Space,
  Collapse,
  Table,
  Modal,
  message,
  Tooltip,
  Badge,
} from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  CompressOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import styles from '../AIPolicyCenter.module.css';
import { PolicyInfo, ApplicationEligibility } from '../types';

const { Panel } = Collapse;

interface PolicyCardListProps {
  policies: PolicyInfo[];
  onRefresh: () => void;
  onAIAnalysis: (policyId: string) => void;
  onCheckEligibility: (policyId: string) => Promise<ApplicationEligibility>;
  onCompare: (policyIds: string[]) => void;
}

const PolicyCardList: React.FC<PolicyCardListProps> = ({
  policies,
  onRefresh,
  onAIAnalysis,
  onCheckEligibility,
  onCompare,
}) => {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [expandedPolicies, setExpandedPolicies] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 处理政策选择
  const handlePolicySelect = (policyId: string) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter((id) => id !== policyId));
    } else {
      if (selectedPolicies.length >= 5) {
        message.warning('最多只能选择5个政策进行对比');
        return;
      }
      setSelectedPolicies([...selectedPolicies, policyId]);
    }
  };

  // 处理适配性检查
  const handleCheckEligibility = async (policy: PolicyInfo) => {
    try {
      const result = await onCheckEligibility(policy.id);
      
      Modal.info({
        title: '申报适配性分析',
        width: 600,
        content: (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Badge
                status={
                  result.status === 'qualified'
                    ? 'success'
                    : result.status === 'partially-qualified'
                    ? 'warning'
                    : 'error'
                }
                text={
                  <span style={{ fontSize: 16, fontWeight: 600 }}>
                    {result.status === 'qualified'
                      ? `符合条件（${result.probability}%通过概率）`
                      : result.status === 'partially-qualified'
                      ? '部分符合'
                      : '不符合'}
                  </span>
                }
              />
            </div>

            {result.reasons.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>分析结果：</div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {result.reasons.map((reason, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#1890ff' }}>
                  改进建议：
                </div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.missingRequirements && result.missingRequirements.length > 0 && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#faad14' }}>
                  缺少的条件：
                </div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {result.missingRequirements.map((req, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
      });
    } catch (error) {
      message.error('适配性分析失败');
    }
  };

  // 获取匹配度样式
  const getMatchBadgeClass = (score?: number) => {
    if (!score) return styles.low;
    if (score >= 80) return styles.high;
    if (score >= 60) return styles.medium;
    return styles.low;
  };

  // 获取匹配度文字
  const getMatchText = (score?: number) => {
    if (!score) return '待评估';
    return `${score}%匹配`;
  };

  // 过滤政策
  const filteredPolicies = policies.filter((policy) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'urgent') return policy.isUrgent;
    if (categoryFilter === 'high-match') return (policy.matchScore || 0) >= 80;
    return policy.category === categoryFilter;
  });

  // 分类统计
  const categories = [
    { key: 'all', label: '全部', count: policies.length },
    { key: 'urgent', label: '即将截止', count: policies.filter((p) => p.isUrgent).length },
    {
      key: 'high-match',
      label: '高匹配',
      count: policies.filter((p) => (p.matchScore || 0) >= 80).length,
    },
    { key: '补贴', label: '补贴政策', count: policies.filter((p) => p.category === '补贴').length },
    {
      key: '资质认定',
      label: '资质认定',
      count: policies.filter((p) => p.category === '资质认定').length,
    },
    {
      key: '培训扶持',
      label: '培训扶持',
      count: policies.filter((p) => p.category === '培训扶持').length,
    },
  ];

  return (
    <div className={styles.policyListArea}>
      {/* 分类标签 */}
      <div className={styles.categoryTabs}>
        <Space wrap>
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`${styles.categoryTab} ${
                categoryFilter === cat.key ? styles.active : ''
              }`}
              onClick={() => setCategoryFilter(cat.key)}
            >
              {cat.label} ({cat.count})
            </div>
          ))}
        </Space>
      </div>

      {/* 操作栏 */}
      {selectedPolicies.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 8 }}>
          <Space>
            <span>已选择 {selectedPolicies.length} 个政策</span>
            <Button
              type="primary"
              size="small"
              icon={<CompressOutlined />}
              onClick={() => onCompare(selectedPolicies)}
              disabled={selectedPolicies.length < 2}
            >
              AI对比分析
            </Button>
            <Button size="small" onClick={() => setSelectedPolicies([])}>
              取消选择
            </Button>
          </Space>
        </div>
      )}

      {/* 政策卡片列表 */}
      {filteredPolicies.map((policy) => (
        <Card
          key={policy.id}
          className={styles.policyCard}
          onClick={() => handlePolicySelect(policy.id)}
          style={{
            borderColor: selectedPolicies.includes(policy.id) ? '#1890ff' : undefined,
          }}
        >
          {/* 匹配度标识 */}
          <div className={`${styles.matchBadge} ${getMatchBadgeClass(policy.matchScore)}`}>
            {getMatchText(policy.matchScore)}
          </div>

          {/* 匹配理由 */}
          {policy.matchReason && (
            <div className={styles.matchReason}>💡 {policy.matchReason}</div>
          )}

          {/* 政策标题 */}
          <div className={styles.policyTitle}>{policy.title}</div>

          {/* 政策元信息 */}
          <div className={styles.policyMeta}>
            <div className={styles.metaItem}>
              <Tag color="blue">{policy.category}</Tag>
              <Tag>{policy.level}</Tag>
            </div>

            {policy.subsidy && (
              <div className={styles.metaItem}>
                <DollarOutlined />
                <span className={styles.subsidyAmount}>
                  最高补贴 {policy.subsidy.max}
                  {policy.subsidy.unit}
                </span>
              </div>
            )}

            {policy.deadline && (
              <div className={styles.metaItem}>
                <ClockCircleOutlined />
                <span className={policy.isUrgent ? styles.deadlineUrgent : ''}>
                  {policy.daysUntilDeadline
                    ? `剩余${policy.daysUntilDeadline}天`
                    : policy.deadline}
                </span>
              </div>
            )}

            {policy.applicationDifficulty && (
              <div className={styles.metaItem}>
                <Tag
                  color={
                    policy.applicationDifficulty === 'low'
                      ? 'green'
                      : policy.applicationDifficulty === 'medium'
                      ? 'orange'
                      : 'red'
                  }
                >
                  {policy.applicationDifficulty === 'low'
                    ? '难度低'
                    : policy.applicationDifficulty === 'medium'
                    ? '难度中'
                    : '难度高'}
                </Tag>
              </div>
            )}
          </div>

          {/* AI摘要卡片 */}
          <Collapse
            ghost
            activeKey={expandedPolicies}
            onChange={(keys) => setExpandedPolicies(keys as string[])}
          >
            <Panel header="查看AI政策摘要" key={policy.id}>
              <div className={styles.policySummaryCard}>
                {/* 申报条件 */}
                <div className={styles.summarySection}>
                  <div className={styles.summaryTitle}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    申报条件
                  </div>
                  <div className={styles.summaryContent}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>硬性条件（必须满足）：</strong>
                      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                        {policy.applicationConditions.hard.map((cond, idx) => (
                          <li key={idx}>{cond}</li>
                        ))}
                      </ul>
                    </div>
                    {policy.applicationConditions.soft.length > 0 && (
                      <div>
                        <strong>软性条件（加分项）：</strong>
                        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                          {policy.applicationConditions.soft.map((cond, idx) => (
                            <li key={idx}>{cond}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* 所需材料 */}
                <div className={styles.summarySection}>
                  <div className={styles.summaryTitle}>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    所需材料
                  </div>
                  <div className={styles.summaryContent}>
                    {policy.requiredMaterials.map((material, idx) => (
                      <span key={idx}>
                        <span
                          className={`${styles.materialTag} ${
                            material.type === 'ai-generated'
                              ? styles.aiGenerated
                              : material.type === 'seal-required'
                              ? styles.sealRequired
                              : styles.thirdParty
                          }`}
                        >
                          {material.name}
                          {material.type === 'ai-generated' && ' 🤖可AI生成'}
                          {material.type === 'seal-required' && ' 🔖需盖章'}
                          {material.type === 'third-party-certified' && ' ✓需第三方认证'}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 补贴金额 */}
                {policy.subsidy && (
                  <div className={styles.summarySection}>
                    <div className={styles.summaryTitle}>
                      <DollarOutlined style={{ color: '#ff4d4f' }} />
                      补贴金额
                    </div>
                    <div className={styles.summaryContent}>
                      最低：{policy.subsidy.min || '不限'}
                      {policy.subsidy.unit} / 最高：{policy.subsidy.max}
                      {policy.subsidy.unit}
                      {policy.subsidy.average && ` / 平均：${policy.subsidy.average}${policy.subsidy.unit}`}
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </Collapse>

          {/* 操作按钮 */}
          <div className={styles.policyActions} onClick={(e) => e.stopPropagation()}>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => onAIAnalysis(policy.id)}
            >
              AI解读
            </Button>
            <Button
              icon={<ExclamationCircleOutlined />}
              onClick={() => handleCheckEligibility(policy)}
            >
              我能申报吗？
            </Button>
            <Tooltip title="查看详情">
              <Button type="link">详情</Button>
            </Tooltip>
          </div>
        </Card>
      ))}

      {/* 换一批按钮 */}
      {filteredPolicies.length > 0 && (
        <Button
          type="dashed"
          icon={<ReloadOutlined />}
          className={styles.refreshButton}
          onClick={onRefresh}
        >
          换一批AI推荐
        </Button>
      )}

      {/* 空状态 */}
      {filteredPolicies.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <div className={styles.emptyText}>暂无符合条件的政策</div>
        </div>
      )}
    </div>
  );
};

export default PolicyCardList;
