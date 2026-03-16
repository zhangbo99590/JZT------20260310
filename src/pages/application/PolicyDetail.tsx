/**
 * 政策详情页
 * 创建时间: 2026-02-26
 * 功能: 展示政策项目的详细信息，支持申报操作
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Card, 
  Breadcrumb, 
  Button, 
  Descriptions, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Divider,
  message,
  Skeleton,
  Empty,
  Modal,
  List,
  Row,
  Col,
  Timeline,
  Watermark,
  Steps,
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Alert
} from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PrinterOutlined,
  CloudDownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  StarFilled,
  HeartOutlined,
  ShareAltOutlined,
  EyeOutlined,
  TrophyOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DESIGN_TOKENS } from './config/designTokens';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';
import styles from './PolicyDetail.module.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface PolicyDetailData {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'ended';
  deadline: string;
  startTime: string;
  department: string;
  region: string;
  funding: string;
  type: string;
  description: string;
  conditions: string[];
  materials: Array<{
    name: string;
    required: boolean;
    format: string;
    example?: string;
    note?: string;
  }>;
  process: string[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  isApplied?: boolean;
}

interface ApplicationDetailData extends PolicyDetailData {
  applicationId: string;
  applicationStatus: 'draft' | 'to_submit' | 'under_review' | 'needs_revision' | 'approved' | 'rejected' | 'expired';
  submitTime?: string;
  auditLogs: Array<{
    time: string;
    action: string;
    operator: string;
    comment?: string;
    status: string;
  }>;
  applicantInfo: {
    companyName: string;
    contactPerson: string;
    phone: string;
    idCard: string;
  };
}

const PolicyDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<PolicyDetailData | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationDetailData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // 模拟数据
  const mockPolicyData: PolicyDetailData = {
    id: '1',
    title: '2024-2025年北京市节能技术改造项目奖励',
    status: 'in_progress',
    deadline: '2026-03-31',
    startTime: '2026-01-01',
    department: '北京市发展和改革委员会',
    region: '北京市',
    funding: '最高500万元',
    type: '技术创新',
    description: '为鼓励企业实施节能技术改造，提升能源利用效率，降低能源消耗，促进绿色低碳发展，特制定本奖励办法。',
    conditions: [
      '在北京市注册的独立法人企业',
      '完成节能技术改造项目并通过验收',
      '节能量达到100吨标准煤以上',
      '项目投资额在50万元以上'
    ],
    materials: [
      {
        name: '项目申请表',
        required: true,
        format: '电子版（PDF、DOC、DOCX、XLS、PNG）',
        example: '示例文本',
        note: '需加盖企业公章'
      },
      {
        name: '营业执照副本复印件',
        required: true,
        format: '电子版扫描件',
        note: '需加盖企业公章'
      },
      {
        name: '项目可行性研究报告',
        required: true,
        format: 'PDF或Word文档',
        example: '示例文本'
      },
      {
        name: '第三方节能量审核报告',
        required: true,
        format: 'PDF文档',
        note: '需由具备资质的第三方机构出具'
      }
    ],
    process: [
      '企业在线提交申报材料',
      '主管部门进行形式审查',
      '组织专家评审',
      '公示评审结果',
      '发放奖励资金'
    ],
    contactPhone: '400-888-6666',
    contactEmail: 'policy@example.com',
    contactAddress: '北京市朝阳区建国路88号',
    isApplied: false
  };

  // 模拟申报详情数据
  const mockApplicationData: ApplicationDetailData = {
    ...mockPolicyData,
    applicationId: 'a1',
    applicationStatus: 'under_review',
    submitTime: '2026-02-15 10:30:00',
    auditLogs: [
      {
        time: '2026-02-15 10:30:00',
        action: '提交申报',
        operator: '张三 (企业经办人)',
        status: 'pending_review'
      },
      {
        time: '2026-02-16 09:15:00',
        action: '形式审查通过',
        operator: '李四 (审核员)',
        comment: '材料齐全，符合要求',
        status: 'under_review'
      },
      {
        time: '2026-02-18 14:00:00',
        action: '专家评审中',
        operator: '系统自动流转',
        status: 'expert_review'
      }
    ],
    applicantInfo: {
      companyName: '北京积分时代科技有限公司',
      contactPerson: '张三',
      phone: '138****1234',
      idCard: '110101********1234'
    }
  };

  // 敏感信息脱敏处理
  const maskInfo = (str: string, type: 'phone' | 'idCard' | 'name') => {
    if (!str) return '';
    if (type === 'phone') {
      return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    if (type === 'idCard') {
      return str.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
    }
    if (type === 'name') {
      return str.length > 2 ? str[0] + '*' + str[str.length - 1] : str[0] + '*';
    }
    return str;
  };

  // 导出PDF
  const handleExportPDF = async () => {
    if (!printRef.current) return;
    const hideLoading = message.loading('正在生成PDF...', 0);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`申报详情_${applicationData?.applicationId || id}.pdf`);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      hideLoading();
    }
  };

  // 打印
  const handlePrint = () => {
    window.print();
  };


  // 计算倒计时天数
  const getCountdownDays = (deadline: string) => {
    const now = new Date();
    const endTime = new Date(deadline);
    const diffTime = endTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 获取项目状态
  const getProjectStatus = (data: PolicyDetailData) => {
    const now = new Date();
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.deadline);
    
    if (now < startTime) return 'not_started';
    if (now > endTime) return 'ended';
    return 'in_progress';
  };

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!id) {
          message.error('项目ID无效');
          setPolicyData(null);
          return;
        }

        // 判断是否为申报详情 (假设申报ID以'a'开头)
        if (id.startsWith('a') || location.state?.projectInfo?.id?.startsWith('a')) {
          setApplicationData(mockApplicationData);
          setPolicyData(mockApplicationData); // 同时也设置 policyData 以兼容基础显示
        } else {
          setPolicyData(mockPolicyData);
          setApplicationData(null);
        }
      } catch (error) {
        message.error('数据加载失败');
        setPolicyData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, location.state]);

  // 处理返回
  const handleBack = () => {
    navigate('/application', { 
      state: location.state 
    });
  };

  // 处理申报
  const handleApply = () => {
    if (!isLoggedIn) {
      setLoginModalVisible(true);
      return;
    }

    if (!policyData) return;

    const status = getProjectStatus(policyData);
    if (status !== 'in_progress') {
      message.warning('当前项目无法申报');
      return;
    }

    if (policyData.isApplied) {
      navigate('/application?view=status');
      return;
    }

    navigate(`/application/apply/${id}`);
  };

  // 渲染材料表格
  const materialColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          {record.required && <Tag color="red">必填</Tag>}
        </Space>
      )
    },
    {
      title: '上传要求',
      dataIndex: 'format',
      key: 'format',
      render: (text: string) => <Text type="secondary">{text}</Text>
    },
    {
      title: '相关说明',
      dataIndex: 'note',
      key: 'note',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={4}>
          {text && <Text type="secondary">{text}</Text>}
          {record.example && (
            <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
              {record.example}
            </Button>
          )}
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: DESIGN_TOKENS.colors.background }}>
        <Content style={{ padding: DESIGN_TOKENS.spacing.md }}>
          <Card>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </Content>
      </Layout>
    );
  }

  if (!policyData) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: DESIGN_TOKENS.colors.background }}>
        <Content style={{ padding: DESIGN_TOKENS.spacing.md }}>
          <Card>
            <Empty
              description="项目信息不存在或加载失败，请返回项目列表重试"
              image={<FileTextOutlined style={{ fontSize: '64px', color: DESIGN_TOKENS.colors.text.disabled }} />}
            >
              <Button type="primary" onClick={handleBack}>返回项目列表</Button>
            </Empty>
          </Card>
        </Content>
      </Layout>
    );
  }

  const status = getProjectStatus(policyData);
  const countdownDays = status === 'in_progress' ? getCountdownDays(policyData.deadline) : 0;

  // ECharts 配置
  const getRadarOption = () => ({
    title: {
      text: '政策竞争力分析',
      textStyle: { fontSize: 14 }
    },
    tooltip: {},
    radar: {
      indicator: [
        { name: '资金力度', max: 100 },
        { name: '申报难度', max: 100 },
        { name: '竞争程度', max: 100 },
        { name: '匹配度', max: 100 },
        { name: '获批率', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '55%']
    },
    series: [{
      name: '政策分析',
      type: 'radar',
      data: [
        {
          value: [85, 60, 70, 90, 75],
          name: '当前政策',
          itemStyle: { color: DESIGN_TOKENS.colors.primary },
          areaStyle: { opacity: 0.3 }
        }
    }]
  });

  // 检查是否超时 (>48h)
  const checkTimeout = (startTime: string, endTime?: string) => {
    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    const diffHours = end.diff(start, 'hour');
    return diffHours > 48;
  };

  // 渲染耗时分析图表
  const renderTimeAnalysisChart = () => {
    if (!applicationData || applicationData.auditLogs.length < 2) return null;

    const durations = applicationData.auditLogs.slice(0, -1).map((log, index) => {
      const nextLog = applicationData.auditLogs[index + 1];
      const start = dayjs(log.time);
      const end = dayjs(nextLog.time);
      const diffHours = end.diff(start, 'hour');
      return {
        name: log.action,
        value: diffHours
      };
    });

    // 如果最后一个节点还在进行中，计算到当前的时间
    const lastLog = applicationData.auditLogs[applicationData.auditLogs.length - 1];
    if (applicationData.applicationStatus !== 'approved' && applicationData.applicationStatus !== 'rejected') {
       const start = dayjs(lastLog.time);
       const end = dayjs();
       const diffHours = end.diff(start, 'hour');
       durations.push({ name: lastLog.action, value: diffHours });
    }

    const option = {
      title: { text: '各环节耗时分析 (小时)', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: durations.map(d => d.name) },
      yAxis: { type: 'value', name: '小时' },
      series: [
        {
          data: durations.map(d => d.value),
          type: 'bar',
          itemStyle: {
            color: (params: any) => {
              return params.value > 48 ? '#ff4d4f' : '#1890ff';
            }
          },
          label: { show: true, position: 'top' }
        }
      ]
    };

    return <ReactECharts option={option} style={{ height: '300px', marginTop: 20 }} />;
  };

  const renderApplicationView = () => {
    if (!applicationData) return null;

    return (
      <div ref={printRef} style={{ padding: 20, background: '#fff' }}>
        <Watermark content={['JZT', '内部资料']}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            {/* Header / Status */}
            <Card title="申报状态" bordered={false}>
              <Steps
                current={
                  ['draft', 'to_submit', 'under_review', 'expert_review', 'approved'].indexOf(applicationData.applicationStatus)
                }
                items={[
                  { title: '草稿', description: '填写申报材料' },
                  { title: '待提交', description: '确认无误后提交' },
                  { title: '形式审查', description: '主管部门审核' },
                  { title: '专家评审', description: '专家组评审' },
                  { title: '结果公示', description: '最终结果' },
                ]}
              />
            </Card>

            {/* Applicant Info */}
            <Card title="申报主体信息" bordered={false}>
              <Descriptions column={2}>
                 <Descriptions.Item label="企业名称">{applicationData.applicantInfo.companyName}</Descriptions.Item>
                 <Descriptions.Item label="联系人">{maskInfo(applicationData.applicantInfo.contactPerson, 'name')}</Descriptions.Item>
                 <Descriptions.Item label="联系电话">{maskInfo(applicationData.applicantInfo.phone, 'phone')}</Descriptions.Item>
                 <Descriptions.Item label="身份证号">{maskInfo(applicationData.applicantInfo.idCard, 'idCard')}</Descriptions.Item>
                 <Descriptions.Item label="申报时间">{applicationData.submitTime}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Audit Logs / Timeline */}
            <Card title="流程跟踪" bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <Timeline
                    items={applicationData.auditLogs.map((log, index) => {
                      const nextLog = applicationData.auditLogs[index + 1];
                      const isTimeout = checkTimeout(log.time, nextLog?.time);
                      
                      return {
                        color: log.status === 'rejected' ? 'red' : isTimeout ? 'orange' : 'green',
                        dot: isTimeout ? <ClockCircleOutlined style={{ fontSize: '16px', color: 'orange' }} /> : undefined,
                        children: (
                          <>
                            <Space>
                              <Text strong>{log.action}</Text>
                              {isTimeout && <Tag color="orange">耗时 &gt; 48h</Tag>}
                            </Space>
                            <br/>
                            <Text type="secondary">{log.time} - {log.operator}</Text>
                            {log.comment && <div><Text type="warning">{log.comment}</Text></div>}
                          </>
                        )
                      };
                    })}
                  />
                </Col>
                <Col span={12}>
                   {renderTimeAnalysisChart()}
                </Col>
              </Row>
            </Card>
            
            {/* Policy Info Reference */}
            <Card title="关联政策信息" bordered={false}>
               <Descriptions>
                 <Descriptions.Item label="政策名称">{applicationData.title}</Descriptions.Item>
                 <Descriptions.Item label="主管部门">{applicationData.department}</Descriptions.Item>
               </Descriptions>
            </Card>

          </Space>
        </Watermark>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: DESIGN_TOKENS.colors.background }}>
      {/* Hero Section with Gradient Background */}
      <div style={{
        background: DESIGN_TOKENS.colors.gradient.primary,
        padding: `${DESIGN_TOKENS.spacing.xl}px ${DESIGN_TOKENS.spacing.md}px`,
        marginBottom: DESIGN_TOKENS.spacing.lg
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 面包屑导航 */}
          <Breadcrumb 
            style={{ 
              marginBottom: DESIGN_TOKENS.spacing.md,
              color: DESIGN_TOKENS.colors.text.white
            }}
            items={[
              {
                title: (
                  <span onClick={handleBack} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                    <HomeOutlined /> {applicationData ? '我的申报' : '政策中心'}
                  </span>
                )
              },
              {
                title: <span style={{ color: 'rgba(255,255,255,0.8)' }}>{applicationData ? '申报详情' : '政策详情'}</span>
              }
            ]}
          />
          
          {/* Policy Title and Quick Info */}
          <Row align="middle" justify="space-between">
            <Col flex="auto">
              <Title 
                level={1} 
                style={{ 
                  color: DESIGN_TOKENS.colors.text.white, 
                  marginBottom: DESIGN_TOKENS.spacing.sm,
                  fontSize: DESIGN_TOKENS.fontSize.xxl,
                  fontWeight: 700
                }}
              >
                {policyData.title}
              </Title>
              <Space size="large" wrap>
                <Tag 
                  icon={<RocketOutlined />}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: DESIGN_TOKENS.colors.text.white,
                    border: 'none',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    padding: '4px 12px',
                    fontSize: DESIGN_TOKENS.fontSize.sm
                  }}
                >
                  {policyData.type}
                </Tag>
                <Tag 
                  icon={<EnvironmentOutlined />}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: DESIGN_TOKENS.colors.text.white,
                    border: 'none',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    padding: '4px 12px',
                    fontSize: DESIGN_TOKENS.fontSize.sm
                  }}
                >
                  {policyData.region}
                </Tag>
                <Tag 
                  icon={<DollarOutlined />}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: DESIGN_TOKENS.colors.text.white,
                    border: 'none',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    padding: '4px 12px',
                    fontSize: DESIGN_TOKENS.fontSize.sm
                  }}
                >
                  {policyData.funding}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<StarFilled />}
                  style={{
                    backgroundColor: DESIGN_TOKENS.colors.text.white,
                    color: DESIGN_TOKENS.colors.primary,
                    border: 'none',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    fontWeight: 600,
                    height: '48px',
                    padding: '0 24px'
                  }}
                  onClick={handleApply}
                >
                  立即申报
                </Button>
                <Space>
                  <Tooltip title="收藏">
                    <Button 
                      type="text" 
                      icon={<HeartOutlined />} 
                      style={{ color: DESIGN_TOKENS.colors.text.white }}
                    />
                  </Tooltip>
                  <Tooltip title="分享">
                    <Button 
                      type="text" 
                      icon={<ShareAltOutlined />} 
                      style={{ color: DESIGN_TOKENS.colors.text.white }}
                    />
                  </Tooltip>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <Content style={{ 
        padding: `0 ${DESIGN_TOKENS.spacing.md}px ${DESIGN_TOKENS.spacing.xl}px`,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>

        {applicationData ? (
           <>
             <div style={{ marginBottom: 16, textAlign: 'right' }}>
               <Space>
                 <Button 
                   icon={<CloudDownloadOutlined />} 
                   onClick={handleExportPDF}
                   style={{
                     borderRadius: DESIGN_TOKENS.borderRadius.md,
                     boxShadow: DESIGN_TOKENS.shadow.sm
                   }}
                 >
                   导出PDF
                 </Button>
                 <Button 
                   icon={<PrinterOutlined />} 
                   onClick={handlePrint}
                   style={{
                     borderRadius: DESIGN_TOKENS.borderRadius.md,
                     boxShadow: DESIGN_TOKENS.shadow.sm
                   }}
                 >
                   打印
                 </Button>
               </Space>
             </div>
             {renderApplicationView()}
           </>
        ) : (
        <Row gutter={[DESIGN_TOKENS.spacing.md, DESIGN_TOKENS.spacing.md]}>
          {/* 主内容区 */}
          <Col xs={24} lg={16}>
            {/* Status Alert Card */}
            <Alert
              message={
                <Space>
                  <CalendarOutlined />
                  <Text strong>申报状态提醒</Text>
                </Space>
              }
              description={
                <Space direction="vertical" size={4}>
                  <Text>截止时间：{policyData.deadline}</Text>
                  {status === 'in_progress' && countdownDays > 0 && (
                    <Text type="warning">还剩 {countdownDays} 天，请抓紧申报！</Text>
                  )}
                </Space>
              }
              type={status === 'in_progress' ? 'info' : status === 'ended' ? 'error' : 'warning'}
              showIcon
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.sm
              }}
            />

            {/* 基本信息卡片 */}
            <Card 
              title={
                <Space>
                  <SafetyOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>基本信息</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.primary}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">实施主体单位</Text>
                    <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.md }}>{policyData.department}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">申报对象</Text>
                    <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.md }}>{policyData.region}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">项目类别</Text>
                    <Tag 
                      color={DESIGN_TOKENS.colors.tag.tech.bg}
                      style={{ 
                        color: DESIGN_TOKENS.colors.tag.tech.text,
                        border: `1px solid ${DESIGN_TOKENS.colors.tag.tech.border}`,
                        borderRadius: DESIGN_TOKENS.borderRadius.sm
                      }}
                    >
                      {policyData.type}
                    </Tag>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">扶持金额</Text>
                    <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.md, color: DESIGN_TOKENS.colors.warning }}>
                      <DollarOutlined /> {policyData.funding}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 数据可视化分析 */}
            <Card 
              title={
                <Space>
                  <TrophyOutlined style={{ color: DESIGN_TOKENS.colors.secondary }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>政策竞争力分析</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.secondary}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <div style={{ 
                    padding: DESIGN_TOKENS.spacing.sm,
                    backgroundColor: '#FAFBFC',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    border: `1px solid ${DESIGN_TOKENS.colors.border}`
                  }}>
                    <ReactECharts option={getRadarOption()} style={{ height: 280 }} />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ 
                    padding: DESIGN_TOKENS.spacing.sm,
                    backgroundColor: '#FAFBFC',
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    border: `1px solid ${DESIGN_TOKENS.colors.border}`
                  }}>
                    <ReactECharts option={getTrendOption()} style={{ height: 280 }} />
                  </div>
                </Col>
              </Row>
              
              {/* 分析指标说明 */}
              <Row gutter={16} style={{ marginTop: DESIGN_TOKENS.spacing.md }}>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing.sm }}>
                    <div style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.xl, 
                      fontWeight: 'bold', 
                      color: DESIGN_TOKENS.colors.primary,
                      marginBottom: 4
                    }}>
                      85%
                    </div>
                    <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>资金力度</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing.sm }}>
                    <div style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.xl, 
                      fontWeight: 'bold', 
                      color: DESIGN_TOKENS.colors.success,
                      marginBottom: 4
                    }}>
                      90%
                    </div>
                    <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>匹配度</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing.sm }}>
                    <div style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.xl, 
                      fontWeight: 'bold', 
                      color: DESIGN_TOKENS.colors.warning,
                      marginBottom: 4
                    }}>
                      75%
                    </div>
                    <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>获批率</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing.sm }}>
                    <div style={{ 
                      fontSize: DESIGN_TOKENS.fontSize.xl, 
                      fontWeight: 'bold', 
                      color: DESIGN_TOKENS.colors.accent,
                      marginBottom: 4
                    }}>
                    230
                    </div>
                    <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>申报人数</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 受理条件 */}
            <Card 
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: DESIGN_TOKENS.colors.success }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>受理条件</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.success}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <List
                dataSource={policyData.conditions}
                renderItem={(item, index) => (
                  <List.Item style={{ 
                    padding: `${DESIGN_TOKENS.spacing.sm}px 0`,
                    borderBottom: index < policyData.conditions.length - 1 ? `1px solid ${DESIGN_TOKENS.colors.border}` : 'none'
                  }}>
                    <Space>
                      <Badge 
                        count={index + 1} 
                        style={{ 
                          backgroundColor: DESIGN_TOKENS.colors.primary,
                          borderRadius: '50%'
                        }} 
                      />
                      <Text style={{ fontSize: DESIGN_TOKENS.fontSize.md }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* 事项描述 */}
            <Card 
              title={
                <Space>
                  <FileTextOutlined style={{ color: DESIGN_TOKENS.colors.accent }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>事项描述</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.accent}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <div style={{
                padding: DESIGN_TOKENS.spacing.md,
                backgroundColor: '#F8FAFC',
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`,
                lineHeight: 1.8
              }}>
                <Text style={{ fontSize: DESIGN_TOKENS.fontSize.md, color: DESIGN_TOKENS.colors.text.primary }}>
                  {policyData.description}
                </Text>
              </div>
            </Card>

            {/* 申报材料 */}
            <Card 
              title={
                <Space>
                  <DownloadOutlined style={{ color: DESIGN_TOKENS.colors.warning }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>申报材料</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.warning}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <Table
                columns={materialColumns.map(col => ({
                  ...col,
                  render: col.render || ((text: any, record: any, index: number) => {
                    if (col.dataIndex === 'name') {
                      return (
                        <Space>
                          <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.md }}>{text}</Text>
                          {record.required && (
                            <Tag 
                              color="error" 
                              style={{ 
                                borderRadius: DESIGN_TOKENS.borderRadius.sm,
                                fontSize: DESIGN_TOKENS.fontSize.xs
                              }}
                            >
                              必填
                            </Tag>
                          )}
                        </Space>
                      );
                    }
                    return col.render ? col.render(text, record, index) : text;
                  })
                }))}
                dataSource={policyData.materials.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                style={{ 
                  borderRadius: DESIGN_TOKENS.borderRadius.md,
                  overflow: 'hidden'
                }}
                rowClassName={(record, index) => 
                  index % 2 === 0 ? '' : 'ant-table-row-striped'
                }
              />
            </Card>

            {/* 办理程序 */}
            <Card 
              title={
                <Space>
                  <SyncOutlined style={{ color: DESIGN_TOKENS.colors.secondary }} />
                  <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.lg }}>办理程序</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.md,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
              headStyle={{
                borderBottom: `2px solid ${DESIGN_TOKENS.colors.secondary}`,
                backgroundColor: '#FAFBFC'
              }}
            >
              <Timeline
                items={policyData.process.map((item, index) => ({
                  color: DESIGN_TOKENS.colors.primary,
                  dot: (
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: DESIGN_TOKENS.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: DESIGN_TOKENS.fontSize.sm,
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                  ),
                  children: (
                    <div style={{ marginLeft: DESIGN_TOKENS.spacing.sm }}>
                      <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.md, display: 'block', marginBottom: 4 }}>
                        步骤 {index + 1}
                      </Text>
                      <Text style={{ fontSize: DESIGN_TOKENS.fontSize.md, color: DESIGN_TOKENS.colors.text.secondary }}>
                        {item}
                      </Text>
                    </div>
                  )
                }))}
                style={{ marginTop: DESIGN_TOKENS.spacing.md }}
              />
            </Card>
          </Col>

          {/* 右侧辅助区 */}
          <Col xs={24} lg={8}>
            {/* 快速申报卡片 */}
            <Card 
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.lg,
                boxShadow: DESIGN_TOKENS.shadow.lg,
                background: DESIGN_TOKENS.colors.gradient.primary,
                border: 'none'
              }}
            >
              <div style={{ textAlign: 'center', color: 'white' }}>
                <RocketOutlined style={{ fontSize: 48, marginBottom: DESIGN_TOKENS.spacing.sm }} />
                <Title level={4} style={{ color: 'white', marginBottom: DESIGN_TOKENS.spacing.sm }}>
                  快速申报通道
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: DESIGN_TOKENS.spacing.md }}>
                  专业团队协助，提升申报成功率
                </Text>
                <Button 
                  type="default" 
                  size="large" 
                  block
                  style={{
                    backgroundColor: 'white',
                    color: DESIGN_TOKENS.colors.primary,
                    border: 'none',
                    fontWeight: 600,
                    borderRadius: DESIGN_TOKENS.borderRadius.md
                  }}
                  onClick={handleApply}
                >
                  立即申报
                </Button>
              </div>
            </Card>

            {/* 申报注意事项 */}
            <Card 
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: DESIGN_TOKENS.colors.warning }} />
                  <Text strong>申报注意事项</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.sm,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
            >
              <List
                dataSource={[
                  { icon: <CheckCircleOutlined />, text: '请确保所有材料真实有效' },
                  { icon: <ExclamationCircleOutlined />, text: '红色标记为必填项' },
                  { icon: <EyeOutlined />, text: '支持材料预览和编辑' }
                ]}
                renderItem={item => (
                  <List.Item style={{ padding: `${DESIGN_TOKENS.spacing.xs}px 0`, border: 'none' }}>
                    <Space>
                      <span style={{ color: DESIGN_TOKENS.colors.primary }}>{item.icon}</span>
                      <Text style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>{item.text}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            {/* 政策申报规划咨询 */}
            <Card 
              title={
                <Space>
                  <TeamOutlined style={{ color: DESIGN_TOKENS.colors.accent }} />
                  <Text strong>专家咨询</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.sm,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
            >
              <div style={{ textAlign: 'center', padding: DESIGN_TOKENS.spacing.sm }}>
                <Avatar 
                  size={64} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: DESIGN_TOKENS.colors.accent,
                    marginBottom: DESIGN_TOKENS.spacing.sm
                  }} 
                />
                <div style={{ marginBottom: DESIGN_TOKENS.spacing.sm }}>
                  <Text strong style={{ display: 'block', fontSize: DESIGN_TOKENS.fontSize.md }}>
                    资深政策专家
                  </Text>
                  <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>
                    10年+ 申报经验
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  block
                  style={{
                    borderRadius: DESIGN_TOKENS.borderRadius.md,
                    backgroundColor: DESIGN_TOKENS.colors.accent,
                    border: 'none'
                  }}
                >
                  在线咨询
                </Button>
              </div>
            </Card>

            {/* 申报推荐 */}
            <Card 
              title={
                <Space>
                  <StarFilled style={{ color: DESIGN_TOKENS.colors.warning }} />
                  <Text strong>相关推荐</Text>
                </Space>
              }
              style={{ 
                marginBottom: DESIGN_TOKENS.spacing.md,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.sm,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
            >
              <List
                dataSource={[
                  { title: '北京市高新技术企业认定', tag: '技术创新', amount: '最高200万' },
                  { title: '海淀区人才引进政策', tag: '人才引进', amount: '最高100万' },
                  { title: '丰台区科技型企业补贴', tag: '技术创新', amount: '最高300万' }
                ]}
                renderItem={item => (
                  <List.Item 
                    style={{ 
                      cursor: 'pointer',
                      padding: DESIGN_TOKENS.spacing.sm,
                      borderRadius: DESIGN_TOKENS.borderRadius.sm,
                      marginBottom: DESIGN_TOKENS.spacing.xs,
                      border: `1px solid ${DESIGN_TOKENS.colors.border}`,
                      transition: 'all 0.3s ease'
                    }}
                    className="hover-card"
                  >
                    <div style={{ width: '100%' }}>
                      <Text 
                        strong 
                        ellipsis 
                        style={{ 
                          fontSize: DESIGN_TOKENS.fontSize.sm,
                          display: 'block',
                          marginBottom: 4
                        }}
                      >
                        {item.title}
                      </Text>
                      <Space size="small" wrap>
                        <Tag 
                          color={DESIGN_TOKENS.colors.tag.tech.bg}
                          style={{ 
                            color: DESIGN_TOKENS.colors.tag.tech.text,
                            border: `1px solid ${DESIGN_TOKENS.colors.tag.tech.border}`,
                            borderRadius: DESIGN_TOKENS.borderRadius.sm,
                            fontSize: DESIGN_TOKENS.fontSize.xs
                          }}
                        >
                          {item.tag}
                        </Tag>
                        <Tag 
                          color={DESIGN_TOKENS.colors.tag.funding.bg}
                          style={{ 
                            color: DESIGN_TOKENS.colors.tag.funding.text,
                            border: `1px solid ${DESIGN_TOKENS.colors.tag.funding.border}`,
                            borderRadius: DESIGN_TOKENS.borderRadius.sm,
                            fontSize: DESIGN_TOKENS.fontSize.xs
                          }}
                        >
                          {item.amount}
                        </Tag>
                      </Space>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* 联系我们 */}
            <Card 
              title={
                <Space>
                  <PhoneOutlined style={{ color: DESIGN_TOKENS.colors.success }} />
                  <Text strong>联系我们</Text>
                </Space>
              }
              style={{
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                boxShadow: DESIGN_TOKENS.shadow.sm,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{
                  padding: DESIGN_TOKENS.spacing.sm,
                  backgroundColor: '#F8FAFC',
                  borderRadius: DESIGN_TOKENS.borderRadius.sm,
                  border: `1px solid ${DESIGN_TOKENS.colors.border}`
                }}>
                  <Space>
                    <PhoneOutlined style={{ color: DESIGN_TOKENS.colors.success }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.xs, display: 'block' }}>
                        咨询电话
                      </Text>
                      <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>
                        {policyData.contactPhone}
                      </Text>
                    </div>
                  </Space>
                </div>
                <div style={{
                  padding: DESIGN_TOKENS.spacing.sm,
                  backgroundColor: '#F8FAFC',
                  borderRadius: DESIGN_TOKENS.borderRadius.sm,
                  border: `1px solid ${DESIGN_TOKENS.colors.border}`
                }}>
                  <Space>
                    <MailOutlined style={{ color: DESIGN_TOKENS.colors.primary }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.xs, display: 'block' }}>
                        邮箱地址
                      </Text>
                      <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>
                        {policyData.contactEmail}
                      </Text>
                    </div>
                  </Space>
                </div>
                <div style={{
                  padding: DESIGN_TOKENS.spacing.sm,
                  backgroundColor: '#F8FAFC',
                  borderRadius: DESIGN_TOKENS.borderRadius.sm,
                  border: `1px solid ${DESIGN_TOKENS.colors.border}`
                }}>
                  <Space align="start">
                    <EnvironmentOutlined style={{ color: DESIGN_TOKENS.colors.warning }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: DESIGN_TOKENS.fontSize.xs, display: 'block' }}>
                        办公地址
                      </Text>
                      <Text strong style={{ fontSize: DESIGN_TOKENS.fontSize.sm }}>
                        {policyData.contactAddress}
                      </Text>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        )}
      </Content>

      {/* 登录弹窗 */}
      <Modal
        title={<span style={{ fontFamily: 'Microsoft YaHei' }}>用户登录</span>}
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setLoginModalVisible(false)}
            style={{ fontFamily: 'Microsoft YaHei' }}
          >
            取消
          </Button>,
          <Button 
            key="login" 
            type="primary" 
            onClick={() => {
              setIsLoggedIn(true);
              setLoginModalVisible(false);
              message.success('登录成功');
              handleApply();
            }}
            style={{ fontFamily: 'Microsoft YaHei' }}
          >
            登录
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <UserOutlined style={{ fontSize: '48px', color: DESIGN_TOKENS.colors.primary, marginBottom: DESIGN_TOKENS.spacing.sm }} />
          <p style={{ fontFamily: 'Microsoft YaHei', color: DESIGN_TOKENS.colors.text.secondary }}>
            请登录后继续申报操作
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default PolicyDetail;
