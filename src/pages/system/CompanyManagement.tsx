import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Select,
  Input,
  Modal,
  message,
  Divider,
  Breadcrumb,
  Descriptions,
  Statistic
} from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  SettingOutlined,
  BankOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// 企业画像数据接口
interface CompanyProfile {
  id: string;
  // 基础信息
  companyName: string;
  creditCode: string;
  legalPerson: string;
  registeredCapital: string;
  establishDate: string;
  industry: string;
  scale: string;
  companyType: string;
  address: string;
  
  // 财务数据
  revenue: string;
  profit: string;
  taxAmount: string;
  assets: string;
  
  // 研发数据
  rdInvestment: string;
  rdRatio: string;
  rdPersonnel: number;
  rdProjects: number;
  
  // 知识产权
  patents: number;
  inventionPatents: number;
  softwareCopyrights: number;
  trademarks: number;
  achievements: number;
  
  // 人员信息
  totalEmployees: number;
  technicalPersonnel: number;
  bachelorAbove: number;
  
  // 资质认证
  qualifications: string[];
  certifications: string[];
  
  // 经营信息
  mainBusiness: string;
  mainProducts: string;
  marketShare: string;
  exportVolume: string;
  
  // 项目经验
  completedProjects: number;
  ongoingProjects: number;
  governmentProjects: number;
  
  // 荣誉奖项
  awards: string[];
  
  // 系统信息
  lastSyncTime: string;
  syncStatus: 'success' | 'syncing' | 'failed';
  dataSource: {
    business: 'success' | 'syncing' | 'failed';
    tax: 'success' | 'syncing' | 'failed';
    rd: 'success' | 'syncing' | 'failed';
  };
}

const CompanyManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CompanyProfile>>({});

  // 模拟企业画像数据
  const mockCompanyProfile: CompanyProfile = {
    id: '1',
    // 基础信息
    companyName: '深圳创新科技有限公司',
    creditCode: '91440300MA5XXXXX0X',
    legalPerson: '张三',
    registeredCapital: '1000万元',
    establishDate: '2018-03-15',
    industry: '软件和信息技术服务业',
    scale: '中型企业',
    companyType: '有限责任公司',
    address: '深圳市南山区科技园南区',
    
    // 财务数据
    revenue: '5000万元',
    profit: '800万元',
    taxAmount: '150万元',
    assets: '3000万元',
    
    // 研发数据
    rdInvestment: '500万元',
    rdRatio: '10%',
    rdPersonnel: 25,
    rdProjects: 8,
    
    // 知识产权
    patents: 15,
    inventionPatents: 5,
    softwareCopyrights: 12,
    trademarks: 3,
    achievements: 3,
    
    // 人员信息
    totalEmployees: 120,
    technicalPersonnel: 80,
    bachelorAbove: 90,
    
    // 资质认证
    qualifications: ['高新技术企业', '专精特新企业', '科技型中小企业'],
    certifications: ['ISO9001质量管理体系', 'ISO27001信息安全管理', 'CMMI3级'],
    
    // 经营信息
    mainBusiness: '企业管理软件开发、云计算服务、大数据分析',
    mainProducts: '企业ERP系统、智能办公平台、数据分析工具',
    marketShare: '行业前10%',
    exportVolume: '200万美元',
    
    // 项目经验
    completedProjects: 45,
    ongoingProjects: 12,
    governmentProjects: 8,
    
    // 荣誉奖项
    awards: ['深圳市科技进步奖', '广东省优秀软件产品奖', '国家级专精特新小巨人'],
    
    // 系统信息
    lastSyncTime: '2024-01-15 14:30:00',
    syncStatus: 'success',
    dataSource: {
      business: 'success',
      tax: 'success',
      rd: 'success'
    }
  };

  // 初始化数据
  useEffect(() => {
    setCompanyProfile(mockCompanyProfile);
  }, []);

  // 打开编辑模式
  const handleEditProfile = () => {
    if (companyProfile) {
      setEditForm({
        // 基础信息
        companyName: companyProfile.companyName,
        creditCode: companyProfile.creditCode,
        legalPerson: companyProfile.legalPerson,
        registeredCapital: companyProfile.registeredCapital,
        establishDate: companyProfile.establishDate,
        industry: companyProfile.industry,
        scale: companyProfile.scale,
        companyType: companyProfile.companyType,
        address: companyProfile.address,
        // 财务数据
        revenue: companyProfile.revenue,
        profit: companyProfile.profit,
        taxAmount: companyProfile.taxAmount,
        assets: companyProfile.assets,
        // 研发数据
        rdInvestment: companyProfile.rdInvestment,
        rdRatio: companyProfile.rdRatio,
        rdPersonnel: companyProfile.rdPersonnel,
        rdProjects: companyProfile.rdProjects,
        // 知识产权
        patents: companyProfile.patents,
        inventionPatents: companyProfile.inventionPatents,
        softwareCopyrights: companyProfile.softwareCopyrights,
        trademarks: companyProfile.trademarks,
        achievements: companyProfile.achievements,
        // 人员信息
        totalEmployees: companyProfile.totalEmployees,
        technicalPersonnel: companyProfile.technicalPersonnel,
        bachelorAbove: companyProfile.bachelorAbove,
        // 资质认证
        qualifications: companyProfile.qualifications,
        certifications: companyProfile.certifications,
        // 经营信息
        mainBusiness: companyProfile.mainBusiness,
        mainProducts: companyProfile.mainProducts,
        marketShare: companyProfile.marketShare,
        exportVolume: companyProfile.exportVolume,
        // 项目经验
        completedProjects: companyProfile.completedProjects,
        ongoingProjects: companyProfile.ongoingProjects,
        governmentProjects: companyProfile.governmentProjects,
        // 荣誉奖项
        awards: companyProfile.awards
      });
      setEditMode(true);
      setProfileModalVisible(true);
    }
  };

  // 保存企业画像
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCompanyProfile(prev => prev ? {
        ...prev,
        ...editForm,
        lastSyncTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      } : null);
      
      message.success('企业画像更新成功');
      setProfileModalVisible(false);
      setEditMode(false);
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditForm({});
  };

  // 获取同步状态图标和颜色
  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'syncing':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'failed':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '系统管理',
            href: '/system',
          },
          {
            title: '企业管理',
          },
        ]}
      />

      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ 
          margin: 0, 
          marginBottom: '8px', 
          color: '#262626',
          fontSize: '24px',
          fontWeight: 500
        }}>
          <BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          企业管理
        </Title>
        <Text type="secondary" style={{ 
          color: '#8c8c8c', 
          fontSize: '14px',
          lineHeight: '22px'
        }}>
          管理企业画像信息，包含40+个字段，涵盖基础信息、财务、研发、知识产权、人员、资质、经营、项目、荣誉等全方位数据
        </Text>
      </div>

      {/* 企业画像概览卡片 */}
      <Card 
        style={{ marginBottom: '24px' }}
        title={
          <Space>
            <BankOutlined />
            <span>企业画像</span>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleEditProfile}
          >
            编辑企业画像
          </Button>
        }
      >
        {companyProfile ? (
          <>
            {/* 关键指标统计 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Statistic 
                  title="年度营收" 
                  value={companyProfile.revenue}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="研发投入占比" 
                  value={companyProfile.rdRatio}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="知识产权总数" 
                  value={companyProfile.patents}
                  suffix="项"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="员工总数" 
                  value={companyProfile.totalEmployees}
                  suffix="人"
                />
              </Col>
            </Row>

            <Divider />

            {/* 详细信息 */}
            <Row gutter={24}>
              <Col span={18}>
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="企业名称">{companyProfile.companyName}</Descriptions.Item>
                  <Descriptions.Item label="信用代码">{companyProfile.creditCode}</Descriptions.Item>
                  <Descriptions.Item label="法定代表人">{companyProfile.legalPerson}</Descriptions.Item>
                  <Descriptions.Item label="注册资本">{companyProfile.registeredCapital}</Descriptions.Item>
                  <Descriptions.Item label="成立日期">{companyProfile.establishDate}</Descriptions.Item>
                  <Descriptions.Item label="企业规模">{companyProfile.scale}</Descriptions.Item>
                  <Descriptions.Item label="行业分类" span={2}>{companyProfile.industry}</Descriptions.Item>
                  <Descriptions.Item label="注册地址" span={2}>{companyProfile.address}</Descriptions.Item>
                  <Descriptions.Item label="企业资质" span={2}>
                    {companyProfile.qualifications.map((q, i) => (
                      <Tag key={i} color="blue">{q}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="认证证书" span={2}>
                    {companyProfile.certifications.map((c, i) => (
                      <Tag key={i} color="green">{c}</Tag>
                    ))}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">数据同步状态</Text>
                  <div style={{ marginTop: '16px' }}>
                    <Space direction="vertical" size="middle">
                      <div>
                        {getSyncStatusIcon(companyProfile.dataSource.business)}
                        <span style={{ marginLeft: '8px' }}>工商数据</span>
                      </div>
                      <div>
                        {getSyncStatusIcon(companyProfile.dataSource.tax)}
                        <span style={{ marginLeft: '8px' }}>税务数据</span>
                      </div>
                      <div>
                        {getSyncStatusIcon(companyProfile.dataSource.rd)}
                        <span style={{ marginLeft: '8px' }}>研发数据</span>
                      </div>
                    </Space>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '12px', color: '#8c8c8c' }}>
                    最后同步: {companyProfile.lastSyncTime}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">暂无企业画像数据</Text>
          </div>
        )}
      </Card>

      {/* 企业画像编辑弹窗 */}
      <Modal
        title={editMode ? "编辑企业画像" : "企业画像详情"}
        open={profileModalVisible}
        onCancel={() => {
          setProfileModalVisible(false);
          handleCancelEdit();
        }}
        footer={
          editMode ? [
            <Button key="cancel" onClick={handleCancelEdit}>
              取消
            </Button>,
            <Button key="save" type="primary" loading={loading} onClick={handleSaveProfile}>
              保存
            </Button>
          ] : [
            <Button key="close" onClick={() => setProfileModalVisible(false)}>
              关闭
            </Button>,
            <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
              编辑
            </Button>
          ]
        }
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {companyProfile && (
          <div>
            {/* 基础信息 */}
            <Title level={4}>基础信息</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">企业名称 *</Text>
                {editMode ? (
                  <Input value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} placeholder="请输入企业名称" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.companyName}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">统一社会信用代码 *</Text>
                {editMode ? (
                  <Input value={editForm.creditCode} onChange={(e) => setEditForm({ ...editForm, creditCode: e.target.value })} placeholder="请输入信用代码" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.creditCode}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">法定代表人 *</Text>
                {editMode ? (
                  <Input value={editForm.legalPerson} onChange={(e) => setEditForm({ ...editForm, legalPerson: e.target.value })} placeholder="请输入法人姓名" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.legalPerson}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">注册资本 *</Text>
                {editMode ? (
                  <Input value={editForm.registeredCapital} onChange={(e) => setEditForm({ ...editForm, registeredCapital: e.target.value })} placeholder="如：1000万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.registeredCapital}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">成立日期 *</Text>
                {editMode ? (
                  <Input value={editForm.establishDate} onChange={(e) => setEditForm({ ...editForm, establishDate: e.target.value })} placeholder="如：2018-03-15" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.establishDate}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">行业分类 *</Text>
                {editMode ? (
                  <Select value={editForm.industry} onChange={(value) => setEditForm({ ...editForm, industry: value })} placeholder="请选择行业" style={{ width: '100%', marginTop: '4px' }}>
                    <Option value="软件和信息技术服务业">软件和信息技术服务业</Option>
                    <Option value="制造业">制造业</Option>
                    <Option value="批发和零售业">批发和零售业</Option>
                    <Option value="科学研究和技术服务业">科学研究和技术服务业</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.industry}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">企业规模 *</Text>
                {editMode ? (
                  <Select value={editForm.scale} onChange={(value) => setEditForm({ ...editForm, scale: value })} placeholder="请选择规模" style={{ width: '100%', marginTop: '4px' }}>
                    <Option value="微型企业">微型企业</Option>
                    <Option value="小型企业">小型企业</Option>
                    <Option value="中型企业">中型企业</Option>
                    <Option value="大型企业">大型企业</Option>
                  </Select>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.scale}</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">企业类型 *</Text>
                {editMode ? (
                  <Select value={editForm.companyType} onChange={(value) => setEditForm({ ...editForm, companyType: value })} placeholder="请选择类型" style={{ width: '100%', marginTop: '4px' }}>
                    <Option value="有限责任公司">有限责任公司</Option>
                    <Option value="股份有限公司">股份有限公司</Option>
                    <Option value="个人独资企业">个人独资企业</Option>
                    <Option value="合伙企业">合伙企业</Option>
                  </Select>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.companyType}</div>
                )}
              </Col>
              <Col span={24}>
                <Text type="secondary">注册地址 *</Text>
                {editMode ? (
                  <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder="请输入注册地址" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.address}</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 财务数据 */}
            <Title level={4}>财务数据</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Text type="secondary">年度营收 *</Text>
                {editMode ? (
                  <Input value={editForm.revenue} onChange={(e) => setEditForm({ ...editForm, revenue: e.target.value })} placeholder="如：5000万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.revenue}</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">年度利润 *</Text>
                {editMode ? (
                  <Input value={editForm.profit} onChange={(e) => setEditForm({ ...editForm, profit: e.target.value })} placeholder="如：800万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.profit}</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">年度纳税额 *</Text>
                {editMode ? (
                  <Input value={editForm.taxAmount} onChange={(e) => setEditForm({ ...editForm, taxAmount: e.target.value })} placeholder="如：150万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.taxAmount}</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">总资产 *</Text>
                {editMode ? (
                  <Input value={editForm.assets} onChange={(e) => setEditForm({ ...editForm, assets: e.target.value })} placeholder="如：3000万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.assets}</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 研发数据 */}
            <Title level={4}>研发数据</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Text type="secondary">研发投入金额 *</Text>
                {editMode ? (
                  <Input value={editForm.rdInvestment} onChange={(e) => setEditForm({ ...editForm, rdInvestment: e.target.value })} placeholder="如：500万元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.rdInvestment}</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">研发投入占比 *</Text>
                {editMode ? (
                  <Input value={editForm.rdRatio} onChange={(e) => setEditForm({ ...editForm, rdRatio: e.target.value })} placeholder="如：10%" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.rdRatio}</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">研发人员数量 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.rdPersonnel} onChange={(e) => setEditForm({ ...editForm, rdPersonnel: parseInt(e.target.value) || 0 })} placeholder="人数" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.rdPersonnel} 人</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">研发项目数量 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.rdProjects} onChange={(e) => setEditForm({ ...editForm, rdProjects: parseInt(e.target.value) || 0 })} placeholder="项目数" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.rdProjects} 个</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 知识产权 */}
            <Title level={4}>知识产权</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Text type="secondary">专利总数 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.patents} onChange={(e) => setEditForm({ ...editForm, patents: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.patents} 项</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">发明专利 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.inventionPatents} onChange={(e) => setEditForm({ ...editForm, inventionPatents: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.inventionPatents} 项</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">软件著作权 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.softwareCopyrights} onChange={(e) => setEditForm({ ...editForm, softwareCopyrights: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.softwareCopyrights} 项</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">商标数量 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.trademarks} onChange={(e) => setEditForm({ ...editForm, trademarks: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.trademarks} 个</div>
                )}
              </Col>
              <Col span={6}>
                <Text type="secondary">科技成果转化 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.achievements} onChange={(e) => setEditForm({ ...editForm, achievements: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.achievements} 项</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 人员信息 */}
            <Title level={4}>人员信息</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">员工总数 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.totalEmployees} onChange={(e) => setEditForm({ ...editForm, totalEmployees: parseInt(e.target.value) || 0 })} placeholder="人数" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.totalEmployees} 人</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">技术人员数量 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.technicalPersonnel} onChange={(e) => setEditForm({ ...editForm, technicalPersonnel: parseInt(e.target.value) || 0 })} placeholder="人数" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.technicalPersonnel} 人</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">本科及以上学历 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.bachelorAbove} onChange={(e) => setEditForm({ ...editForm, bachelorAbove: parseInt(e.target.value) || 0 })} placeholder="人数" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.bachelorAbove} 人</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 资质认证 */}
            <Title level={4}>资质认证</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">企业资质</Text>
                {editMode ? (
                  <Select mode="tags" value={editForm.qualifications} onChange={(value) => setEditForm({ ...editForm, qualifications: value })} placeholder="请选择或输入资质" style={{ width: '100%', marginTop: '4px' }}>
                    <Option value="高新技术企业">高新技术企业</Option>
                    <Option value="专精特新企业">专精特新企业</Option>
                    <Option value="科技型中小企业">科技型中小企业</Option>
                    <Option value="瞪羚企业">瞪羚企业</Option>
                    <Option value="独角兽企业">独角兽企业</Option>
                  </Select>
                ) : (
                  <div style={{ marginTop: '4px' }}>
                    {companyProfile.qualifications.map((q, i) => <Tag key={i} color="blue">{q}</Tag>)}
                  </div>
                )}
              </Col>
              <Col span={24}>
                <Text type="secondary">认证证书</Text>
                {editMode ? (
                  <Select mode="tags" value={editForm.certifications} onChange={(value) => setEditForm({ ...editForm, certifications: value })} placeholder="请选择或输入认证" style={{ width: '100%', marginTop: '4px' }}>
                    <Option value="ISO9001质量管理体系">ISO9001质量管理体系</Option>
                    <Option value="ISO27001信息安全管理">ISO27001信息安全管理</Option>
                    <Option value="CMMI3级">CMMI3级</Option>
                    <Option value="CMMI5级">CMMI5级</Option>
                  </Select>
                ) : (
                  <div style={{ marginTop: '4px' }}>
                    {companyProfile.certifications.map((c, i) => <Tag key={i} color="green">{c}</Tag>)}
                  </div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 经营信息 */}
            <Title level={4}>经营信息</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">主营业务 *</Text>
                {editMode ? (
                  <Input.TextArea value={editForm.mainBusiness} onChange={(e) => setEditForm({ ...editForm, mainBusiness: e.target.value })} placeholder="请输入主营业务" rows={2} style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{companyProfile.mainBusiness}</div>
                )}
              </Col>
              <Col span={12}>
                <Text type="secondary">主要产品 *</Text>
                {editMode ? (
                  <Input.TextArea value={editForm.mainProducts} onChange={(e) => setEditForm({ ...editForm, mainProducts: e.target.value })} placeholder="请输入主要产品" rows={2} style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{companyProfile.mainProducts}</div>
                )}
              </Col>
              <Col span={12}>
                <Text type="secondary">市场占有率</Text>
                {editMode ? (
                  <Input value={editForm.marketShare} onChange={(e) => setEditForm({ ...editForm, marketShare: e.target.value })} placeholder="如：行业前10%" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.marketShare}</div>
                )}
              </Col>
              <Col span={12}>
                <Text type="secondary">出口额</Text>
                {editMode ? (
                  <Input value={editForm.exportVolume} onChange={(e) => setEditForm({ ...editForm, exportVolume: e.target.value })} placeholder="如：200万美元" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.exportVolume}</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 项目经验 */}
            <Title level={4}>项目经验</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary">已完成项目数 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.completedProjects} onChange={(e) => setEditForm({ ...editForm, completedProjects: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.completedProjects} 个</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">在研项目数 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.ongoingProjects} onChange={(e) => setEditForm({ ...editForm, ongoingProjects: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.ongoingProjects} 个</div>
                )}
              </Col>
              <Col span={8}>
                <Text type="secondary">政府项目数 *</Text>
                {editMode ? (
                  <Input type="number" value={editForm.governmentProjects} onChange={(e) => setEditForm({ ...editForm, governmentProjects: parseInt(e.target.value) || 0 })} placeholder="数量" style={{ marginTop: '4px' }} />
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>{companyProfile.governmentProjects} 个</div>
                )}
              </Col>
            </Row>

            <Divider />

            {/* 荣誉奖项 */}
            <Title level={4}>荣誉奖项</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">获得奖项</Text>
                {editMode ? (
                  <Select mode="tags" value={editForm.awards} onChange={(value) => setEditForm({ ...editForm, awards: value })} placeholder="请输入获得的奖项" style={{ width: '100%', marginTop: '4px' }} />
                ) : (
                  <div style={{ marginTop: '4px' }}>
                    {companyProfile.awards.map((a, i) => <Tag key={i} color="gold">{a}</Tag>)}
                  </div>
                )}
              </Col>
            </Row>

            <Divider />

            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
              <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              <Text type="secondary">
                {editMode 
                  ? "编辑模式：您可以修改企业画像信息，修改后将用于智能匹配政策" 
                  : "企业画像包含40+个字段，涵盖基础信息、财务、研发、知识产权、人员、资质、经营、项目、荣誉等全方位数据"}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyManagement;
