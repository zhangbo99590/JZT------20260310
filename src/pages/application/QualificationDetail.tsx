import React, { useState } from 'react';
import { Card, Button, Tag, Typography, Divider, Row, Col, Timeline, Alert, Space, List } from 'antd';
import { 
  ArrowLeftOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface QualificationDetail {
  id: string;
  title: string;
  category: string;
  level: string;
  deadline: string;
  subsidy: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  detailedDescription: string;
  basicRequirements: string[];
  coreIndicators: {
    name: string;
    requirement: string;
    description?: string;
  }[];
  restrictions: string[];
  materials: {
    name: string;
    required: boolean;
    template?: string;
    description?: string;
  }[];
  process: {
    step: string;
    description: string;
    duration: string;
  }[];
  benefits: string[];
  tags: string[];
  isHot: boolean;
}

const QualificationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { } = useParams<{ id: string }>();
  
  // 模拟数据 - 实际应用中应该根据id从API获取
  const [qualification] = useState<QualificationDetail>({
    id: '1',
    title: '高新技术企业认定',
    category: '资质认定',
    level: '国家级',
    deadline: '2024-04-30',
    subsidy: '税收减免15%',
    difficulty: 'medium',
    description: '高新技术企业是指在《国家重点支持的高新技术领域》内，持续进行研究开发与技术成果转化，形成企业核心自主知识产权，并以此为基础开展经营活动的居民企业。',
    detailedDescription: '高新技术企业认定是国家为了鼓励企业加大研发投入、提升自主创新能力而设立的重要政策。通过认定的企业可以享受企业所得税减按15%征收的优惠政策，同时在政府采购、项目申报等方面享有优先权。认定有效期为三年，到期后需要重新申请认定。',
    basicRequirements: [
      '企业申请认定时须注册成立一年以上',
      '企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权',
      '对企业主要产品（服务）发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定的范围',
      '企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%'
    ],
    coreIndicators: [
      {
        name: '研发费用占比',
        requirement: '最近一年销售收入小于5,000万元（含）的企业，比例不低于5%；最近一年销售收入在5,000万元至2亿元（含）的企业，比例不低于4%；最近一年销售收入在2亿元以上的企业，比例不低于3%',
        description: '研发费用是指企业在产品、技术、材料、工艺、标准的研究、开发过程中发生的各项费用'
      },
      {
        name: '知识产权数量',
        requirement: '企业通过自主研发、受让、受赠、并购等方式，获得对其主要产品（服务）在技术上发挥核心支持作用的知识产权的所有权',
        description: '发明专利（含国防专利）、植物新品种、国家级农作物品种、国家新药、国家一级中药保护品种、集成电路布图设计专有权等按Ⅰ类评价；实用新型专利、外观设计专利、软件著作权等（不含商标）按Ⅱ类评价'
      },
      {
        name: '科技人员占比',
        requirement: '企业从事研发和相关技术创新活动的科技人员占企业当年职工总数的比例不低于10%',
        description: '科技人员是指直接从事研发和相关技术创新活动，以及专门从事上述活动的管理和提供直接技术服务的，累计实际工作时间在183天以上的人员'
      },
      {
        name: '高新技术产品收入占比',
        requirement: '高新技术产品（服务）收入占企业同期总收入的比例不低于60%',
        description: '高新技术产品（服务）是指对其发挥核心支持作用的技术属于《国家重点支持的高新技术领域》规定范围的产品（服务）'
      }
    ],
    restrictions: [
      '企业申请认定前一年内未发生重大安全、重大质量事故或严重环境违法行为',
      '企业未列入经营异常名录和严重违法失信企业名单',
      '企业未发生重大涉税违法行为',
      '企业研究开发组织管理水平、科技成果转化能力、自主知识产权数量、销售与总资产成长性等指标符合《高新技术企业认定管理工作指引》的要求'
    ],
    materials: [
      {
        name: '高新技术企业认定申请书',
        required: true,
        template: '高新技术企业认定申请书模板.docx',
        description: '按照规定格式填写，需要法定代表人签字并加盖企业公章'
      },
      {
        name: '企业营业执照副本',
        required: true,
        description: '提供加盖公章的复印件'
      },
      {
        name: '税务登记证书',
        required: true,
        description: '提供加盖公章的复印件'
      },
      {
        name: '研发项目立项报告',
        required: true,
        description: '包括项目名称、目标、内容、预期成果等'
      },
      {
        name: '知识产权相关材料',
        required: true,
        description: '专利证书、软件著作权证书等复印件'
      },
      {
        name: '科技成果转化总体情况与转化形式、应用成效的逐项说明',
        required: true,
        template: '科技成果转化说明模板.docx'
      }
    ],
    process: [
      {
        step: '企业自评',
        description: '企业对照认定条件进行自我评价，确认符合申报要求',
        duration: '1-2周'
      },
      {
        step: '材料准备',
        description: '准备申报所需的各项材料，包括审计报告等',
        duration: '2-4周'
      },
      {
        step: '网上申报',
        description: '在高新技术企业认定管理工作网进行网上申报',
        duration: '1周'
      },
      {
        step: '专家评审',
        description: '由专家组对申报材料进行评审',
        duration: '2-3个月'
      },
      {
        step: '认定公示',
        description: '通过评审的企业进行公示',
        duration: '15个工作日'
      },
      {
        step: '颁发证书',
        description: '公示无异议后颁发高新技术企业证书',
        duration: '1个月'
      }
    ],
    benefits: [
      '企业所得税减按15%征收（正常税率25%）',
      '研发费用加计扣除比例提高到100%',
      '政府采购项目中享有优先权',
      '各类政府项目申报中享有优先权或加分',
      '提升企业品牌形象和市场竞争力',
      '更容易获得银行贷款和投资机构青睐',
      '人才引进政策倾斜',
      '土地使用、电力使用等方面的优惠政策'
    ],
    tags: ['研发投入', '知识产权', '科技人员', '税收优惠'],
    isHot: true
  });

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      easy: 'green',
      medium: 'orange',
      hard: 'red'
    };
    return colorMap[difficulty as keyof typeof colorMap];
  };

  const getDifficultyText = (difficulty: string) => {
    const textMap = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    };
    return textMap[difficulty as keyof typeof textMap];
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        返回
      </Button>

      {/* 标题区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
              {qualification.title}
              {qualification.isHot && <Tag color="red" style={{ marginLeft: '8px' }}>热门</Tag>}
            </Title>
            
            <Space size="middle" style={{ marginBottom: '16px' }}>
              <Tag color="blue">{qualification.category}</Tag>
              <Tag color="purple">{qualification.level}</Tag>
              <Tag color={getDifficultyColor(qualification.difficulty)}>
                申报难度：{getDifficultyText(qualification.difficulty)}
              </Tag>
            </Space>

            <Row gutter={32}>
              <Col span={8}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                  <Text>申报截止：{qualification.deadline}</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DollarOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <Text>政策优惠：{qualification.subsidy}</Text>
                </div>
              </Col>
            </Row>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button 
              type="primary" 
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/policy-center/application-management/apply/${qualification.id}`)}
            >
              立即申报
            </Button>
            <Button 
              size="large"
              onClick={() => navigate(`/policy-center/application-management/condition-check/${qualification.id}`)}
            >
              条件自查
            </Button>
          </div>
        </div>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          {/* 详细介绍 */}
          <Card title="详细介绍" style={{ marginBottom: '24px' }}>
            <Paragraph>{qualification.detailedDescription}</Paragraph>
            <Divider />
            <Paragraph>{qualification.description}</Paragraph>
          </Card>

          {/* 申报条件 */}
          <Card title="申报条件" style={{ marginBottom: '24px' }}>
            <Title level={4}>基础条件</Title>
            <List
              dataSource={qualification.basicRequirements}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px', marginTop: '4px' }} />
                    <Text>{item}</Text>
                  </div>
                </List.Item>
              )}
            />

            <Divider />
            
            <Title level={4}>核心指标</Title>
            {qualification.coreIndicators.map((indicator, index) => (
              <Card key={index} size="small" style={{ marginBottom: '16px' }}>
                <Title level={5}>{indicator.name}</Title>
                <Paragraph>{indicator.requirement}</Paragraph>
                {indicator.description && (
                  <Alert 
                    message={indicator.description} 
                    type="info" 
                    showIcon 
                    style={{ marginTop: '8px' }}
                  />
                )}
              </Card>
            ))}

            <Divider />
            
            <Title level={4}>限制条件</Title>
            <List
              dataSource={qualification.restrictions}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px', marginTop: '4px' }} />
                    <Text>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 申报材料 */}
          <Card title="申报材料清单" style={{ marginBottom: '24px' }}>
            <List
              dataSource={qualification.materials}
              renderItem={(material) => (
                <List.Item
                  actions={material.template ? [
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        // TODO: 实现模板下载功能
                        // window.open(material.template, '_blank');
                      }}
                    >
                      下载模板
                    </Button>
                  ] : []}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        {material.name}
                        {material.required && <Tag color="red" style={{ marginLeft: '8px' }}>必需</Tag>}
                      </div>
                    }
                    description={material.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          {/* 申报流程 */}
          <Card title="申报流程" style={{ marginBottom: '24px' }}>
            <Timeline>
              {qualification.process.map((step, index) => (
                <Timeline.Item key={index}>
                  <Title level={5}>{step.step}</Title>
                  <Paragraph style={{ color: '#666' }}>{step.description}</Paragraph>
                  <Text type="secondary">预计用时：{step.duration}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {/* 政策优惠 */}
          <Card title="政策优惠" style={{ marginBottom: '24px' }}>
            <List
              dataSource={qualification.benefits}
              renderItem={(benefit) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px', marginTop: '4px' }} />
                    <Text>{benefit}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 关键标签 */}
          <Card title="关键标签">
            <div>
              {qualification.tags.map((tag, index) => (
                <Tag key={index} style={{ marginBottom: '8px' }}>{tag}</Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QualificationDetail;