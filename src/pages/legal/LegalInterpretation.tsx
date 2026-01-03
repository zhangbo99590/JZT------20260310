import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Tabs, 
  List, 
  Tag, 
  Avatar,
  Collapse,
  Alert,
  Spin,
  Empty,
  Divider,
  Timeline,
  Badge
} from 'antd';
import { 
  BulbOutlined, 
  SearchOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShopOutlined,
  BankOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface InterpretationResult {
  id: string;
  regulation: string;
  article: string;
  originalText: string;
  interpretation: string;
  businessScenarios: BusinessScenario[];
  relatedPolicies: string[];
  practicalImpact: string;
  riskPoints: string[];
  suggestions: string[];
}

interface BusinessScenario {
  id: string;
  title: string;
  description: string;
  applicableConditions: string[];
  operationSteps: string[];
  attentionPoints: string[];
  relatedDepartments: string[];
}

const LegalInterpretation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [interpretationResults, setInterpretationResults] = useState<InterpretationResult[]>([]);
  const [activeTab, setActiveTab] = useState('search');

  // 模拟解读结果数据
  const mockInterpretationResult: InterpretationResult = {
    id: '1',
    regulation: '中华人民共和国科学技术进步法',
    article: '第二十六条',
    originalText: '国家鼓励企业加大研究开发投入。企业开发新技术、新产品、新工艺发生的研究开发费用，可以在计算应纳税所得额时加计扣除；企业研究开发活动形成的无形资产，在计算应纳税所得额时摊销期限可以缩短。',
    interpretation: '这条法律条款规定了企业研发费用的税收优惠政策。简单来说，企业在研发新技术、新产品、新工艺时产生的费用，不仅可以正常扣除，还可以额外多扣除一部分（即"加计扣除"），从而减少应纳税所得额，降低企业税负。同时，研发形成的专利、软件著作权等无形资产，可以用更短的时间进行摊销，进一步减轻税负。',
    businessScenarios: [
      {
        id: '1',
        title: '高新技术企业研发费用加计扣除',
        description: '高新技术企业进行技术研发时，可享受研发费用175%的加计扣除优惠',
        applicableConditions: [
          '具有高新技术企业资质',
          '研发活动符合《研发费用加计扣除政策指引》要求',
          '建立完善的研发费用辅助账'
        ],
        operationSteps: [
          '建立研发项目立项文件',
          '设置研发费用辅助账',
          '按月归集研发费用',
          '年度汇算清缴时申报加计扣除'
        ],
        attentionPoints: [
          '研发费用必须单独核算',
          '保留完整的研发过程文档',
          '注意费用归集的准确性'
        ],
        relatedDepartments: ['财务部', '研发部', '税务部门']
      },
      {
        id: '2',
        title: '制造业企业研发费用加计扣除',
        description: '制造业企业研发费用可享受100%的加计扣除，即按200%扣除',
        applicableConditions: [
          '属于制造业企业',
          '研发活动符合相关规定',
          '费用归集规范'
        ],
        operationSteps: [
          '确认制造业企业身份',
          '规范研发费用核算',
          '准备相关证明材料',
          '及时申报享受优惠'
        ],
        attentionPoints: [
          '准确界定制造业范围',
          '区分研发费用和其他费用',
          '关注政策变化'
        ],
        relatedDepartments: ['财务部', '研发部', '生产部']
      }
    ],
    relatedPolicies: [
      '企业所得税法实施条例',
      '研发费用加计扣除政策指引',
      '高新技术企业认定管理办法'
    ],
    practicalImpact: '对于一家年研发投入1000万元的高新技术企业，通过175%加计扣除，可减少应纳税所得额750万元，按25%税率计算，可节省企业所得税187.5万元。',
    riskPoints: [
      '研发费用归集不准确可能面临税务风险',
      '缺乏完整的研发过程文档可能影响加计扣除',
      '未及时申报可能错失优惠政策'
    ],
    suggestions: [
      '建立完善的研发费用管理制度',
      '加强研发过程文档管理',
      '定期关注税收政策变化',
      '建议咨询专业税务顾问'
    ]
  };

  // 常见业务场景
  const commonScenarios = [
    {
      icon: <BankOutlined style={{ color: '#1890ff' }} />,
      title: '政策申报',
      description: '各类政策补贴、税收优惠申报',
      count: 156
    },
    {
      icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
      title: '合同签订',
      description: '商务合同、劳动合同等法律风险',
      count: 89
    },
    {
      icon: <TeamOutlined style={{ color: '#fa8c16' }} />,
      title: '用工管理',
      description: '劳动关系、社保公积金等',
      count: 234
    },
    {
      icon: <SafetyOutlined style={{ color: '#722ed1' }} />,
      title: '合规管理',
      description: '环保、安全生产等合规要求',
      count: 67
    }
  ];

  // 最近解读记录
  const recentInterpretations = [
    {
      id: '1',
      title: '研发费用加计扣除政策解读',
      regulation: '科学技术进步法',
      time: '2024-01-15 14:30',
      status: 'completed'
    },
    {
      id: '2',
      title: '高新技术企业认定条件分析',
      regulation: '高新技术企业认定管理办法',
      time: '2024-01-14 09:15',
      status: 'completed'
    },
    {
      id: '3',
      title: '劳动合同法相关条款解释',
      regulation: '劳动合同法',
      time: '2024-01-13 16:45',
      status: 'completed'
    }
  ];

  // 执行智能解读
  const handleInterpretation = () => {
    if (!searchText.trim()) return;
    
    setLoading(true);
    // 模拟AI解读过程
    setTimeout(() => {
      setInterpretationResults([mockInterpretationResult]);
      setLoading(false);
      setActiveTab('results');
    }, 2000);
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          智能法律解读
        </Title>
        <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
          专业法条场景化解析，业务场景智能匹配
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧主要内容 */}
        <Col xs={24} lg={16}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'search',
                label: (
                  <Space>
                    <SearchOutlined />
                    智能解读
                  </Space>
                ),
                children: (
                  <Card>
                    <div style={{ marginBottom: 24 }}>
                      <Title level={4}>
                        <Space>
                          <RobotOutlined style={{ color: '#1890ff' }} />
                          AI法律解读助手
                        </Space>
                      </Title>
                      <Paragraph type="secondary">
                        输入法律条款或业务场景，获得专业的法律解读和实用建议
                      </Paragraph>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <TextArea
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="请输入法律条款内容或描述您的业务场景，例如：&#10;1. 企业研发费用加计扣除相关规定&#10;2. 高新技术企业认定条件&#10;3. 劳动合同解除的法律风险"
                        rows={4}
                        maxLength={500}
                        showCount
                      />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<BulbOutlined />}
                        onClick={handleInterpretation}
                        loading={loading}
                        disabled={!searchText.trim()}
                      >
                        开始智能解读
                      </Button>
                    </div>

                    {loading && (
                      <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 16 }}>
                          <Text type="secondary">AI正在分析法律条款，请稍候...</Text>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              },
              {
                key: 'results',
                label: (
                  <Space>
                    <BookOutlined />
                    解读结果
                  </Space>
                ),
                children: (
                  <div>
                    {interpretationResults.length === 0 ? (
                      <Card>
                        <Empty 
                          description="暂无解读结果，请先进行智能解读"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </Card>
                    ) : (
                      interpretationResults.map((result) => (
                        <Card key={result.id} style={{ marginBottom: 16 }}>
                          <div style={{ marginBottom: 16 }}>
                            <Title level={4}>{result.regulation}</Title>
                            <Tag color="blue">{result.article}</Tag>
                          </div>

                          <Collapse defaultActiveKey={['1', '2', '3']}>
                            <Panel 
                              header={
                                <Space>
                                  <FileTextOutlined />
                                  原文条款
                                </Space>
                              } 
                              key="1"
                            >
                              <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6 }}>
                                <Text>{result.originalText}</Text>
                              </div>
                            </Panel>

                            <Panel 
                              header={
                                <Space>
                                  <BulbOutlined />
                                  通俗解释
                                </Space>
                              } 
                              key="2"
                            >
                              <Paragraph>{result.interpretation}</Paragraph>
                            </Panel>

                            <Panel 
                              header={
                                <Space>
                                  <ShopOutlined />
                                  业务场景应用
                                </Space>
                              } 
                              key="3"
                            >
                              {result.businessScenarios.map((scenario) => (
                                <Card 
                                  key={scenario.id} 
                                  size="small" 
                                  title={scenario.title}
                                  style={{ marginBottom: 16 }}
                                >
                                  <Paragraph>{scenario.description}</Paragraph>
                                  
                                  <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                      <Text strong>适用条件：</Text>
                                      <ul style={{ marginTop: 8 }}>
                                        {scenario.applicableConditions.map((condition, index) => (
                                          <li key={index}>{condition}</li>
                                        ))}
                                      </ul>
                                    </Col>
                                    <Col span={12}>
                                      <Text strong>操作步骤：</Text>
                                      <Timeline style={{ marginTop: 8 }}>
                                        {scenario.operationSteps.map((step, index) => (
                                          <Timeline.Item key={index}>{step}</Timeline.Item>
                                        ))}
                                      </Timeline>
                                    </Col>
                                  </Row>

                                  <Divider />

                                  <div style={{ marginBottom: 8 }}>
                                    <Text strong>注意事项：</Text>
                                    <div style={{ marginTop: 8 }}>
                                      {scenario.attentionPoints.map((point, index) => (
                                        <Alert
                                          key={index}
                                          message={point}
                                          type="warning"
                                          showIcon
                                          style={{ marginBottom: 8 }}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <Text strong>涉及部门：</Text>
                                    <div style={{ marginTop: 8 }}>
                                      <Space wrap>
                                        {scenario.relatedDepartments.map((dept) => (
                                          <Tag key={dept} color="blue">{dept}</Tag>
                                        ))}
                                      </Space>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </Panel>

                            <Panel 
                              header={
                                <Space>
                                  <ExclamationCircleOutlined />
                                  实际影响分析
                                </Space>
                              } 
                              key="4"
                            >
                              <Alert
                                message="实际影响"
                                description={result.practicalImpact}
                                type="info"
                                showIcon
                                style={{ marginBottom: 16 }}
                              />

                              <Row gutter={[16, 16]}>
                                <Col span={12}>
                                  <Card size="small" title="风险提示">
                                    <ul>
                                      {result.riskPoints.map((risk, index) => (
                                        <li key={index} style={{ color: '#ff4d4f' }}>
                                          {risk}
                                        </li>
                                      ))}
                                    </ul>
                                  </Card>
                                </Col>
                                <Col span={12}>
                                  <Card size="small" title="建议措施">
                                    <ul>
                                      {result.suggestions.map((suggestion, index) => (
                                        <li key={index} style={{ color: '#52c41a' }}>
                                          {suggestion}
                                        </li>
                                      ))}
                                    </ul>
                                  </Card>
                                </Col>
                              </Row>
                            </Panel>
                          </Collapse>
                        </Card>
                      ))
                    )}
                  </div>
                )
              }
            ]}
          />
        </Col>

        {/* 右侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 常见业务场景 */}
          <Card 
            title={
              <Space>
                <TeamOutlined />
                常见业务场景
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={commonScenarios}
              renderItem={(item) => (
                <List.Item style={{ cursor: 'pointer' }} onClick={() => setSearchText(item.description)}>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} />}
                    title={item.title}
                    description={item.description}
                  />
                  <Badge count={item.count} style={{ backgroundColor: '#52c41a' }} />
                </List.Item>
              )}
            />
          </Card>

          {/* 最近解读记录 */}
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                最近解读
              </Space>
            }
          >
            <List
              dataSource={recentInterpretations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<CheckCircleOutlined />} 
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    }
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.regulation}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LegalInterpretation;