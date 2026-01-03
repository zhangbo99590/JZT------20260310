import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Tree, Breadcrumb, Modal, Space } from 'antd';
import { 
  FileTextOutlined, 
  EyeOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  BankOutlined,
  RightOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

const { Title, Text, Paragraph } = Typography;
const { DirectoryTree } = Tree;

interface ApplicationProject {
  id: string;
  title: string;
  category: string;
  description: string;
  deadline: string;
  status: 'available' | 'applying' | 'completed' | 'expired';
  difficulty: 'easy' | 'medium' | 'hard';
  subsidy: string;
  requirements: string[];
}

const ApplicationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['all']);
  
  // 分类数据结构
  const treeData = [
    {
      title: '全部申报',
      key: 'all',
      icon: <AppstoreOutlined />,
      children: [
        {
          title: '资质认定',
          key: 'qualification',
          icon: <SafetyCertificateOutlined />,
          children: [
            { title: '高企认定', key: 'high_tech', isLeaf: true },
            { title: '科技型中小企业', key: 'tech_sme', isLeaf: true },
            { title: '专精特新', key: 'specialized', isLeaf: true },
          ],
        },
        {
          title: '资金补贴',
          key: 'subsidy',
          icon: <DollarOutlined />,
          children: [
            { title: '技术创新', key: 'innovation', isLeaf: true },
            { title: '数字化转型', key: 'digital', isLeaf: true },
            { title: '设备更新', key: 'equipment', isLeaf: true },
          ],
        },
        {
          title: '税收优惠',
          key: 'tax',
          icon: <BankOutlined />,
          children: [
            { title: '研发费用加计扣除', key: 'rd_tax', isLeaf: true },
            { title: '所得税减免', key: 'income_tax', isLeaf: true },
          ],
        },
      ],
    },
  ];

  // 模拟申报项目数据
  const [projects] = useState<ApplicationProject[]>([
    {
      id: '1',
      title: '高新技术企业认定',
      category: 'high_tech',
      description: '高新技术企业是指在《国家重点支持的高新技术领域》内，持续进行研究开发与技术成果转化，形成企业核心自主知识产权，并以此为基础开展经营活动的居民企业。',
      deadline: '2024-04-30',
      status: 'available',
      difficulty: 'medium',
      subsidy: '税收减免15%',
      requirements: ['研发人员', '知识产权', '科技成果']
    },
    {
      id: '2',
      title: '科技型中小企业评价',
      category: 'tech_sme',
      description: '科技型中小企业是指依托一定数量的科技人员从事科学技术研究开发活动，取得自主知识产权并将其转化为高新技术产品或服务，从而实现可持续发展的中小企业。',
      deadline: '2024-05-31',
      status: 'available',
      difficulty: 'easy',
      subsidy: '研发费用加计扣除100%',
      requirements: ['中小企业', '科技创新', '知识产权']
    },
    {
      id: '3',
      title: '专精特新企业认定',
      category: 'specialized',
      description: '专精特新企业是指具有"专业化、精细化、特色化、新颖化"特征的企业。',
      deadline: '2024-06-15',
      status: 'available',
      difficulty: 'hard',
      subsidy: '最高50万元',
      requirements: ['专业化', '精细化', '特色化', '新颖化']
    },
    {
      id: '4',
      title: '研发费用加计扣除',
      category: 'rd_tax',
      description: '研发费用加计扣除是指企业开展研发活动中实际发生的研发费用，未形成无形资产计入当期损益的，在按规定据实扣除的基础上，在2018年1月1日至2020年12月31日期间，再按照实际发生额的75%在税前加计扣除。',
      deadline: '2024-12-31',
      status: 'available',
      difficulty: 'medium',
      subsidy: '研发费用加计扣除',
      requirements: ['研发活动', '费用凭证', '研发项目']
    },
    {
      id: '5',
      title: '技术创新补贴',
      category: 'innovation',
      description: '支持企业技术创新，提升核心竞争力，促进产业升级。',
      deadline: '2024-07-31',
      status: 'available',
      difficulty: 'medium',
      subsidy: '最高100万元',
      requirements: ['技术创新', '产业升级', '核心技术']
    },
    {
      id: '6',
      title: '数字化转型补贴',
      category: 'digital',
      description: '支持企业数字化转型，提升信息化水平。',
      deadline: '2024-08-15',
      status: 'available',
      difficulty: 'easy',
      subsidy: '最高30万元',
      requirements: ['数字化转型', '信息化建设', '智能制造']
    }
  ]);

  // 根据分类过滤项目
  const getFilteredProjects = () => {
    const selectedKey = selectedKeys[0] as string;
    if (!selectedKey || selectedKey === 'all') return projects;
    
    // 如果选择的是父分类（如qualification），则显示其下所有子分类
    if (selectedKey === 'qualification') {
      return projects.filter(p => ['high_tech', 'tech_sme', 'specialized'].includes(p.category));
    }
    if (selectedKey === 'subsidy') {
      return projects.filter(p => ['innovation', 'digital', 'equipment'].includes(p.category));
    }
    if (selectedKey === 'tax') {
      return projects.filter(p => ['rd_tax', 'income_tax'].includes(p.category));
    }
    
    return projects.filter(project => project.category === selectedKey);
  };

  // 难度标签渲染
  const renderDifficulty = (difficulty: string) => {
    const difficultyMap = {
      easy: { color: 'green', text: '简单' },
      medium: { color: 'orange', text: '中等' },
      hard: { color: 'red', text: '困难' }
    };
    
    const config = difficultyMap[difficulty as keyof typeof difficultyMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 状态标签渲染
  const renderStatus = (status: string) => {
    const statusMap = {
      available: { color: 'blue', text: '可申请' },
      applying: { color: 'processing', text: '申请中' },
      completed: { color: 'success', text: '已完成' },
      expired: { color: 'default', text: '已过期' }
    };
    
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 政策详情弹窗
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ApplicationProject | null>(null);

  const handlePolicyDetail = (project: ApplicationProject) => {
    setSelectedProject(project);
    setDetailModalVisible(true);
  };

  // 立即申请
  const handleApplyNow = (project: ApplicationProject) => {
    navigate(`/policy-center/application-management/apply/${project.id}`);
  };

  return (
    <PageWrapper module="policy">
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '政策中心',
          },
          {
            title: '申报管理',
          },
        ]}
      />

      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              申报管理
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
              项目申报管理 · 资质证书管理 · 申报进度跟踪
            </Paragraph>
          </Col>
        </Row>
      </div>

      {/* 项目展示区域 */}
      <Row gutter={24} style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div style={{ height: '100%' }}>
            <Row gutter={[16, 16]}>
              {getFilteredProjects().map(project => (
                <Col 
                  xs={24} 
                  sm={24} 
                  md={24} 
                  lg={12} 
                  xl={12}
                  key={project.id}
                >
                  <Card
                    hoverable
                    style={{ 
                      height: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e8e8e8',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                    styles={{ 
                      body: { 
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* 卡片头部 */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <Title 
                          level={4} 
                          style={{ 
                            margin: 0, 
                            fontSize: '16px', 
                            fontWeight: 600,
                            lineHeight: '1.4',
                            maxWidth: '70%'
                          }}
                        >
                          {project.title}
                        </Title>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {renderStatus(project.status)}
                          {renderDifficulty(project.difficulty)}
                        </div>
                      </div>
                      
                      {/* 补贴信息 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '4px', fontSize: '14px' }} />
                        <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>{project.subsidy}</Text>
                      </div>
                      
                      {/* 截止日期 */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ color: '#ff4d4f', marginRight: '4px', fontSize: '14px' }} />
                        <Text type="danger" style={{ fontSize: '14px' }}>截止日期：{project.deadline}</Text>
                      </div>
                    </div>

                    {/* 项目描述 */}
                    <div style={{ flex: 1, marginBottom: '16px' }}>
                      <Paragraph 
                        ellipsis={{ rows: 3, expandable: false }}
                        style={{ 
                          margin: 0, 
                          color: '#666',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}
                      >
                        {project.description}
                      </Paragraph>
                    </div>

                    {/* 申请要求 */}
                    <div style={{ marginBottom: '16px' }}>
                      <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                        关键要求：
                      </Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {project.requirements.slice(0, 3).map((req, index) => (
                          <Tag key={index} color="geekblue" style={{ fontSize: '12px' }}>
                            {req}
                          </Tag>
                        ))}
                        {project.requirements.length > 3 && (
                          <Tag color="default" style={{ fontSize: '12px' }}>
                            +{project.requirements.length - 3}
                          </Tag>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px',
                      marginTop: 'auto'
                    }}>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handlePolicyDetail(project)}
                        style={{
                          flex: 1,
                          borderColor: '#1890ff',
                          color: '#1890ff',
                          transition: 'all 0.3s ease',
                          height: '36px',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1890ff';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#1890ff';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        政策详情
                      </Button>
                      <Button
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={() => handleApplyNow(project)}
                        style={{
                          flex: 1,
                          backgroundColor: '#52c41a',
                          borderColor: '#52c41a',
                          transition: 'all 0.3s ease',
                          height: '36px',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#389e0d';
                          e.currentTarget.style.borderColor = '#389e0d';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#52c41a';
                          e.currentTarget.style.borderColor = '#52c41a';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        立即申请
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* 空状态 */}
            {getFilteredProjects().length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0',
                color: '#999'
              }}>
                <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>暂无相关申报项目</div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* 政策详情弹窗 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <span>政策详情</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="apply" 
            type="primary" 
            onClick={() => {
              if (selectedProject) {
                setDetailModalVisible(false);
                handleApplyNow(selectedProject);
              }
            }}
          >
            立即申请
          </Button>
        ]}
      >
        {selectedProject && (
          <div>
            {/* 基本信息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>{selectedProject.title}</Title>
              <Space size="middle" style={{ marginTop: '12px' }}>
                {renderStatus(selectedProject.status)}
                {renderDifficulty(selectedProject.difficulty)}
                <Tag color="blue">{selectedProject.category}</Tag>
              </Space>
            </div>

            {/* 补贴信息 */}
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                <div>
                  <Text strong style={{ color: '#1890ff' }}>补贴政策：</Text>
                  <Text style={{ fontSize: '16px', marginLeft: '8px' }}>{selectedProject.subsidy}</Text>
                </div>
              </Space>
            </Card>

            {/* 截止日期 */}
            <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff2e8', borderColor: '#ffbb96' }}>
              <Space>
                <CalendarOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
                <div>
                  <Text strong style={{ color: '#ff4d4f' }}>截止日期：</Text>
                  <Text style={{ fontSize: '16px', marginLeft: '8px' }}>{selectedProject.deadline}</Text>
                </div>
              </Space>
            </Card>

            {/* 政策描述 */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>政策说明</Title>
              <Paragraph style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
                {selectedProject.description}
              </Paragraph>
            </div>

            {/* 申请要求 */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>申请要求</Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.requirements.map((req, index) => (
                  <Tag key={index} color="geekblue" style={{ fontSize: '13px', padding: '4px 12px' }}>
                    {req}
                  </Tag>
                ))}
              </div>
            </div>

            {/* 温馨提示 */}
            <Card size="small" style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
              <Space align="start">
                <InfoCircleOutlined style={{ color: '#52c41a', fontSize: '16px', marginTop: '2px' }} />
                <div>
                  <Text strong style={{ color: '#52c41a' }}>温馨提示</Text>
                  <Paragraph style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666' }}>
                    1. 请仔细阅读申请要求，确保企业符合所有条件<br/>
                    2. 准备好相关材料后再开始申报流程<br/>
                    3. 注意申报截止日期，提前规划时间<br/>
                    4. 如有疑问，可咨询平台客服或相关部门
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};

export default ApplicationManagement;
