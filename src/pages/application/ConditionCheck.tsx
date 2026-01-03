import React, { useState } from 'react';
import { 
  Card, 
  Checkbox, 
  Button, 
  Typography, 
  Alert, 
  Progress, 
  Row, 
  Col, 
  Space,
  Tag,
  Modal,
  Result,
  List,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

const { Title, Text, Paragraph } = Typography;

interface Condition {
  id: string;
  category: 'basic' | 'core' | 'restriction';
  title: string;
  description: string;
  requirement: string;
  isRequired: boolean;
  weight: number;
  checked: boolean;
  helpText?: string;
}

interface CheckResult {
  passed: boolean;
  score: number;
  totalScore: number;
  passRate: number;
  suggestions: string[];
  missingConditions: Condition[];
}

const ConditionCheck: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [resultVisible, setResultVisible] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  // 申报条件数据
  const [conditions, setConditions] = useState<Condition[]>([
    // 基础条件
    {
      id: 'basic_1',
      category: 'basic',
      title: '企业注册年限',
      description: '企业申请认定时须注册成立一年以上',
      requirement: '注册满1年',
      isRequired: true,
      weight: 10,
      checked: false,
      helpText: '以营业执照注册日期为准，需满足一个完整会计年度'
    },
    {
      id: 'basic_2',
      category: 'basic',
      title: '知识产权所有权',
      description: '企业通过自主研发、受让、受赠、并购等方式获得知识产权',
      requirement: '拥有知识产权',
      isRequired: true,
      weight: 15,
      checked: false,
      helpText: '包括发明专利、实用新型专利、外观设计专利、软件著作权等'
    },
    {
      id: 'basic_3',
      category: 'basic',
      title: '技术领域符合性',
      description: '企业主要产品技术属于国家重点支持的高新技术领域',
      requirement: '符合技术领域要求',
      isRequired: true,
      weight: 15,
      checked: false,
      helpText: '参考《国家重点支持的高新技术领域》目录'
    },
    {
      id: 'basic_4',
      category: 'basic',
      title: '企业规模要求',
      description: '符合中小企业划型标准规定',
      requirement: '属于中小企业',
      isRequired: false,
      weight: 5,
      checked: false,
      helpText: '根据《中小企业划型标准规定》进行判定'
    },

    // 核心指标
    {
      id: 'core_2',
      category: 'core',
      title: '科技人员占比',
      description: '企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例',
      requirement: '≥10%',
      isRequired: true,
      weight: 15,
      checked: false,
      helpText: '科技人员需在企业累计实际工作时间在183天以上'
    },
    {
      id: 'core_4',
      category: 'core',
      title: '创新能力评价',
      description: '企业创新能力评价应达到相应要求',
      requirement: '≥70分',
      isRequired: true,
      weight: 10,
      checked: false,
      helpText: '包括知识产权、科技成果转化能力、研究开发组织管理水平、企业成长性等指标'
    },

    // 限制条件
    {
      id: 'restriction_1',
      category: 'restriction',
      title: '无重大安全质量事故',
      description: '企业申请认定前一年内未发生重大安全、重大质量事故',
      requirement: '无相关事故记录',
      isRequired: true,
      weight: 5,
      checked: false,
      helpText: '包括但不限于生产安全事故、产品质量事故等'
    },
    {
      id: 'restriction_2',
      category: 'restriction',
      title: '无严重环境违法行为',
      description: '企业申请认定前一年内未发生严重环境违法行为',
      requirement: '无环境违法记录',
      isRequired: true,
      weight: 5,
      checked: false,
      helpText: '以环保部门的处罚记录为准'
    },
    {
      id: 'restriction_3',
      category: 'restriction',
      title: '非失信企业',
      description: '企业未列入经营异常名录和严重违法失信企业名单',
      requirement: '信用状况良好',
      isRequired: true,
      weight: 5,
      checked: false,
      helpText: '可通过国家企业信用信息公示系统查询'
    },
    {
      id: 'restriction_4',
      category: 'restriction',
      title: '无重大涉税违法行为',
      description: '企业未发生重大涉税违法行为',
      requirement: '税务合规',
      isRequired: true,
      weight: 5,
      checked: false,
      helpText: '以税务部门的处罚记录为准'
    }
  ]);

  // 获取分类标题
  const getCategoryTitle = (category: string) => {
    const titleMap = {
      basic: '基础条件',
      core: '核心指标',
      restriction: '限制条件'
    };
    return titleMap[category as keyof typeof titleMap];
  };

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    const colorMap = {
      basic: '#1890ff',
      core: '#52c41a',
      restriction: '#faad14'
    };
    return colorMap[category as keyof typeof colorMap];
  };

  // 处理条件勾选
  const handleConditionChange = (conditionId: string, checked: boolean) => {
    setConditions(conditions.map(condition => 
      condition.id === conditionId 
        ? { ...condition, checked }
        : condition
    ));
  };

  // 执行自查
  const performCheck = () => {
    const checkedConditions = conditions.filter(c => c.checked);
    const requiredConditions = conditions.filter(c => c.isRequired);
    const checkedRequiredConditions = requiredConditions.filter(c => c.checked);
    
    // 计算得分
    const totalScore = conditions.reduce((sum, c) => sum + c.weight, 0);
    const score = checkedConditions.reduce((sum, c) => sum + c.weight, 0);
    const passRate = (score / totalScore) * 100;
    
    // 判断是否通过
    const allRequiredMet = checkedRequiredConditions.length === requiredConditions.length;
    const passed = allRequiredMet && passRate >= 80;
    
    // 生成建议
    const suggestions = [];
    const missingConditions = conditions.filter(c => c.isRequired && !c.checked);
    
    if (!allRequiredMet) {
      suggestions.push('请确保满足所有必需条件后再进行申报');
    }
    
    if (passRate < 80) {
      suggestions.push('建议提升企业在核心指标方面的表现');
    }
    
    if (passRate >= 80 && allRequiredMet) {
      suggestions.push('恭喜！您的企业符合申报基础门槛，建议尽快准备申报材料');
    }
    
    // 针对性建议
    const uncheckedCore = conditions.filter(c => c.category === 'core' && !c.checked);
    if (uncheckedCore.length > 0) {
      suggestions.push('重点关注科技人员占比等核心指标');
    }
    
    const result: CheckResult = {
      passed,
      score,
      totalScore,
      passRate,
      suggestions,
      missingConditions
    };
    
    setCheckResult(result);
    setResultVisible(true);
  };

  // 按分类分组条件
  const groupedConditions = conditions.reduce((groups, condition) => {
    const category = condition.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(condition);
    return groups;
  }, {} as Record<string, Condition[]>);

  // 计算统计信息
  const statistics = {
    total: conditions.length,
    checked: conditions.filter(c => c.checked).length,
    required: conditions.filter(c => c.isRequired).length,
    checkedRequired: conditions.filter(c => c.isRequired && c.checked).length
  };

  return (
    <PageWrapper module="policy">
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        返回
      </Button>

      {/* 标题 */}
      <Title level={2} style={{ marginBottom: '24px' }}>
        申报条件自查
      </Title>

      {/* 说明信息 */}
      <Alert
          message="自查说明"
          description="请根据企业实际情况勾选已满足的条件，系统将自动判断是否符合申报基础门槛。标记为必需的条件必须满足，其他条件建议尽可能满足以提高申报成功率。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

      {/* 进度统计 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {statistics.checked}/{statistics.total}
              </div>
              <div style={{ color: '#666' }}>已勾选条件</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {statistics.checkedRequired}/{statistics.required}
              </div>
              <div style={{ color: '#666' }}>必需条件</div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>完成进度</div>
                <Progress 
                  percent={Math.round((statistics.checked / statistics.total) * 100)}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 条件列表 */}
      {Object.entries(groupedConditions).map(([category, categoryConditions]) => (
        <Card 
          key={category}
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '4px', 
                  height: '20px', 
                  backgroundColor: getCategoryColor(category),
                  marginRight: '12px'
                }}
              />
              {getCategoryTitle(category)}
              <Tag 
                color={getCategoryColor(category)} 
                style={{ marginLeft: '12px' }}
              >
                {categoryConditions.length} 项
              </Tag>
            </div>
          }
          style={{ marginBottom: '24px' }}
        >
          <List
            dataSource={categoryConditions}
            renderItem={(condition) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Checkbox
                      checked={condition.checked}
                      onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                      style={{ marginRight: '12px', marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <Text strong>{condition.title}</Text>
                        {condition.isRequired && (
                          <Tag color="red" style={{ marginLeft: '8px' }}>
                            必需
                          </Tag>
                        )}
                        {condition.helpText && (
                          <Tooltip title={condition.helpText}>
                            <QuestionCircleOutlined 
                              style={{ marginLeft: '8px', color: '#1890ff' }}
                            />
                          </Tooltip>
                        )}
                      </div>
                      <Paragraph style={{ margin: 0, color: '#666' }}>
                        {condition.description}
                      </Paragraph>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">要求：</Text>
                        <Text code>{condition.requirement}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      ))}

      {/* 操作按钮 */}
      <Card>
        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={performCheck}
            >
              开始自查
            </Button>
            <Button 
              size="large"
              onClick={() => navigate(`/policy-center/application-management/qualification/${id}`)}
            >
              查看详细要求
            </Button>
          </Space>
        </div>
      </Card>

      {/* 自查结果模态框 */}
      <Modal
        title="自查结果"
        visible={resultVisible}
        onCancel={() => setResultVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setResultVisible(false)}>
            关闭
          </Button>,
          checkResult?.passed && (
            <Button 
              key="apply" 
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => {
                navigate(`/policy-center/application-management/apply/${id}`);
              }}
            >
              立即申报
            </Button>
          )
        ].filter(Boolean)}
      >
        {checkResult && (
          <div>
            <Result
              status={checkResult.passed ? 'success' : 'warning'}
              title={checkResult.passed ? '恭喜！符合申报条件' : '暂不符合申报条件'}
              subTitle={
                checkResult.passed 
                  ? '您的企业满足申报基础门槛，建议尽快准备申报材料'
                  : '请根据以下建议完善相关条件后再进行申报'
              }
            />
            
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                      {checkResult.score}
                    </div>
                    <div style={{ color: '#666' }}>得分</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                      {checkResult.passRate.toFixed(1)}%
                    </div>
                    <div style={{ color: '#666' }}>通过率</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                      {checkResult.missingConditions.length}
                    </div>
                    <div style={{ color: '#666' }}>缺失必需条件</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {checkResult.missingConditions.length > 0 && (
              <Card title="缺失的必需条件" size="small" style={{ marginBottom: '16px' }}>
                <List
                  size="small"
                  dataSource={checkResult.missingConditions}
                  renderItem={(condition) => (
                    <List.Item>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        <div>
                          <Text strong>{condition.title}</Text>
                          <br />
                          <Text type="secondary">{condition.requirement}</Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            <Card title="改进建议" size="small">
              <List
                size="small"
                dataSource={checkResult.suggestions}
                renderItem={(suggestion) => (
                  <List.Item>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                      <Text>{suggestion}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default ConditionCheck;
