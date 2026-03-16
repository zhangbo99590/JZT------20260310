/**
 * 申报向导页（带左侧导航和右侧提示）
 * 创建时间: 2026-02-26
 * 功能: 完整布局的申报向导页面，包含左侧导航、中间表单、右侧提示
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Steps, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Upload,
  message,
  Radio,
  Breadcrumb,
  Row,
  Col,
  Alert,
  Progress,
  Modal,
  InputNumber,
  Select,
  Descriptions,
  Divider,
  Watermark,
  Timeline,
  Table,
  Tag
} from 'antd';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  HomeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  UserOutlined,
  InboxOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
  EyeOutlined,
  PaperClipOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { DESIGN_TOKENS } from './config/designTokens';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import { 
  saveApplicationData, 
  getApplicationData, 
  removeApplicationData,
  getRemainingDays,
  cleanExpiredData
} from '../../utils/applicationStorage';
import QualificationDrawer from './components/QualificationDrawer';
import { QUALIFICATION_DATA } from './components/QualificationSelector';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface FormData {
  [key: string]: any;
}

const ApplyWizardWithLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  
  // 监听财务数据变化以实时更新图表
  const annualRevenue = Form.useWatch('annualRevenue', form);
  const netProfit = Form.useWatch('netProfit', form);
  const rdExpenses = Form.useWatch('rdExpenses', form);
  const totalAssets = Form.useWatch('totalAssets', form);
  const totalLiabilities = Form.useWatch('totalLiabilities', form);
  const declaration = Form.useWatch('declaration', form);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [qualificationDrawerVisible, setQualificationDrawerVisible] = useState(false);

  // 获取资质名称的辅助函数
  const getQualificationLabel = (value: string) => {
    const qualification = QUALIFICATION_DATA
      .flatMap(g => g.qualifications)
      .find(q => q.value === value);
    return qualification?.label || value;
  };

  // 获取已选资质的显示文本
  const getSelectedQualificationsText = (values: string[]) => {
    if (!values || values.length === 0) return '';
    return values.map(v => getQualificationLabel(v)).join('、');
  };

  // 从路由状态获取项目信息和登录状态
  useEffect(() => {
    if (location.state?.projectInfo) {
      setProjectInfo(location.state.projectInfo);
      
      // 同步企业信息到表单隐藏字段
      form.setFieldsValue({
        companyName: location.state.projectInfo.companyName,
        creditCode: location.state.projectInfo.creditCode,
        legalPerson: location.state.projectInfo.legalPerson,
        contactPerson: location.state.projectInfo.contactPerson,
        contactPhone: location.state.projectInfo.contactPhone
      });
      
      // 更新 formData
      setFormData(prev => ({
        ...prev,
        ...location.state.projectInfo
      }));
    }
    if (location.state?.isLoggedIn !== undefined) {
      setIsLoggedIn(location.state.isLoggedIn);
    }
  }, [location.state, form]);

  // 页面加载时清理过期数据并恢复暂存数据
  useEffect(() => {
    if (id) {
      cleanExpiredData();
      
      const savedData = getApplicationData(id);
      if (savedData) {
        setFormData(savedData);
        form.setFieldsValue(savedData);
        const remainingDays = getRemainingDays(id);
        message.info(`已恢复暂存数据，剩余有效期 ${remainingDays} 天`);
      }
    }
  }, [id, form]);

  // 自动保存草稿（每30秒）
  useEffect(() => {
    if (!id) return;

    const timer = setInterval(() => {
      const values = form.getFieldsValue();
      // 只有当表单有内容时才保存
      if (Object.keys(values).length > 0) {
        const updatedData = { ...formData, ...values };
        saveApplicationData(id, updatedData);
        console.log('自动保存草稿成功', new Date().toLocaleTimeString());
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [id, formData, form]);

  // 监听表单变化
  const handleFormChange = () => {
    // 移除验证逻辑，允许直接通过
    setCanProceed(true);
  };

  // 步骤配置
  const steps = [
    {
      title: '资质信息与数据填写',
      description: '确认企业信息并填写关键指标',
      icon: <UserOutlined />
    },
    {
      title: '证明材料上传',
      description: '上传所需的申报材料',
      icon: <UploadOutlined />
    },
    {
      title: '审核提交',
      description: '预览确认并提交申报',
      icon: <CheckCircleOutlined />
    }
  ];

  // 自定义步骤条样式
  const CustomSteps = () => (
    <div style={{ display: 'flex', marginBottom: 24, background: '#f5f7fa', padding: '16px 24px', borderRadius: 4 }}>
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={index} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ marginRight: 12 }}>
               {isCompleted ? (
                 <div style={{ 
                   width: 24, height: 24, borderRadius: '50%', background: '#1890ff', 
                   color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                 }}>
                   <CheckCircleOutlined />
                 </div>
               ) : (
                 <div style={{ 
                   width: 24, height: 24, borderRadius: '50%', 
                   background: isActive ? '#1890ff' : '#d9d9d9',
                   color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   fontSize: 14
                 }}>
                   {index + 1}
                 </div>
               )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: isActive || isCompleted ? '#333' : '#999', 
                fontWeight: isActive ? 600 : 400,
                fontSize: 16,
                marginBottom: 4
              }}>
                {step.title}
              </div>
              <div style={{ color: '#999', fontSize: 12 }}>
                {step.description}
              </div>
            </div>
            {!isLast && (
              <div style={{ 
                position: 'absolute', right: 0, top: 12, width: '30%', height: 1, background: '#e8e8e8',
                left: '60%'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );

  // 处理下一步
  const handleNext = async () => {
    try {
      // 恢复表单验证
      const values = await form.validateFields();
      const updatedData = { ...formData, ...values };
      setFormData(updatedData);
      
      if (id) {
        const saved = saveApplicationData(id, updatedData);
        if (!saved) {
          message.warning('数据暂存失败，请检查网络后重试');
        }
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      message.error('请完善填写信息');
    }
  };

  // 保存草稿
  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    const updatedData = { ...formData, ...values };
    setFormData(updatedData);
    
    if (id) {
      saveApplicationData(id, updatedData);
      message.success('草稿保存成功');
    } else {
      message.warning('无法保存草稿：缺少申请ID');
    }
  };

  // 处理上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 执行提交操作（核心逻辑）
  const performSubmission = async (auditInfo?: any) => {
    try {
      // 获取当前表单值，不进行验证
      const values = form.getFieldsValue();
      const finalData = { ...formData, ...values };
      
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (id) {
        removeApplicationData(id);
      }
      
      const applicationId = `APP${Date.now()}`;
      message.success('申报提交成功！');
      navigate(`/application/success/${id}`, {
        state: { 
          applicationId,
          projectInfo,
          formData: finalData,
          auditInfo // 传递审计信息到成功页面
        }
      });
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    try {
      // 1. 验证表单数据
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      setFormData(finalData);

      // 2. 直接执行提交，无需登录确认
      await performSubmission();
    } catch (error) {
      console.error(error);
      message.error('提交失败，请检查填写信息');
    }
  };

  // 文件上传验证
  const beforeUpload = (file: RcFile) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg'
    ];
    
    const isValidFormat = allowedTypes.includes(file.type);
    if (!isValidFormat) {
      message.error('文件格式不符，请上传PDF、DOC、DOCX、XLS、XLSX、PNG或JPG格式的文件');
      return Upload.LIST_IGNORE;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过10MB，请重新上传');
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  // 预览模态框渲染
  const renderPreviewModal = () => {
    // 模拟数据生成（结合formData）
    const previewData = {
      basicInfo: {
        projectName: formData.projectName || '',
        applicant: formData.companyName || '',
        creditCode: formData.creditCode || '',
        legalPerson: formData.legalPerson || '',
        contact: formData.contactPerson || '',
        phone: formData.contactPhone || '',
        address: '深圳市南山区科技园xx栋xx楼',
        date: '2026年02月27日'
      },
      overview: {
        background: '随着国家对科技创新的重视，我司积极响应号召，加大研发投入，提升核心竞争力。本项目旨在通过技术攻关，解决行业痛点，实现技术突破。',
        objectives: '1. 完成核心技术研发；2. 申请发明专利5项；3. 实现销售收入5000万元。',
        content: '主要内容包括：1. 核心算法优化；2. 系统架构升级；3. 应用场景拓展。',
        route: '采用敏捷开发模式，结合大数据分析与人工智能技术，分阶段推进项目实施。'
      },
      plan: [
        { date: '2026-03-01', children: '项目启动，组建团队' },
        { date: '2026-06-30', children: '完成核心模块开发' },
        { date: '2026-09-30', children: '系统集成与测试' },
        { date: '2026-12-31', children: '项目验收与结项' }
      ],
      budget: [
        { item: '设备费', amount: 50.00, desc: '购置服务器、开发终端等' },
        { item: '材料费', amount: 20.00, desc: '研发耗材、元器件等' },
        { item: '测试费', amount: 10.00, desc: '第三方软件测试服务' },
        { item: '差旅费', amount: 5.00, desc: '项目调研、会议差旅' },
        { item: '劳务费', amount: 100.00, desc: '研发人员薪资、专家咨询费' },
        { item: '其他', amount: 15.00, desc: '出版/知识产权/会议等' }
      ],
      outcomes: {
        tech: '申请发明专利5项，软著10项，发表论文3篇。',
        economic: '预计新增销售收入5000万元，新增利润1000万元。',
        social: '带动就业50人，推动行业技术进步，促进区域经济发展。'
      },
      risks: [
        { risk: '技术风险', countermeasure: '加强技术调研，引进高端人才，建立技术专家库。' },
        { risk: '市场风险', countermeasure: '深入市场调研，灵活调整营销策略，拓展多元化市场。' },
        { risk: '管理风险', countermeasure: '完善项目管理制度，强化过程监控，落实责任到人。' }
      ],
      attachments: [
        '营业执照副本.pdf',
        '2025年度财务审计报告.pdf',
        '研发费用专项审计报告.pdf',
        '知识产权证书扫描件.zip'
      ]
    };

    // 预算图表配置
    const budgetOption = {
      title: { text: '预算明细分布', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{b}: {c}万元 ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: previewData.budget.map(item => ({ value: item.amount, name: item.item })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>申报书预览</span>
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>关闭</Button>,
          <Button key="download" type="primary" icon={<PrinterOutlined />}>导出Word</Button>
        ]}
        style={{ top: 20 }}
      >
        <Watermark content={['仅供预览', 'JZT System']} gap={[100, 100]}>
          <div style={{ padding: '24px 40px', background: '#fff', minHeight: 800 }}>
            {/* 封面 */}
            <div style={{ textAlign: 'center', marginBottom: 60, marginTop: 40, borderBottom: '2px solid #000', paddingBottom: 20 }}>
              <Typography.Title level={1} style={{ marginBottom: 40 }}>高新技术企业认定申请书</Typography.Title>
              <Descriptions column={1} labelStyle={{ width: 150, justifyContent: 'flex-end', fontSize: 16 }} contentStyle={{ fontSize: 16, fontWeight: 500 }}>
                <Descriptions.Item label="申请企业">{previewData.basicInfo.applicant}</Descriptions.Item>
                <Descriptions.Item label="统一社会信用代码">{previewData.basicInfo.creditCode}</Descriptions.Item>
                <Descriptions.Item label="申请日期">{previewData.basicInfo.date}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* 一、项目基本信息 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>一、项目基本信息</Typography.Title>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="项目名称" span={2}>{previewData.basicInfo.projectName}</Descriptions.Item>
                <Descriptions.Item label="申报单位" span={2}>{previewData.basicInfo.applicant}</Descriptions.Item>
                <Descriptions.Item label="项目负责人">{previewData.basicInfo.legalPerson}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{previewData.basicInfo.phone}</Descriptions.Item>
                <Descriptions.Item label="联系人">{previewData.basicInfo.contact}</Descriptions.Item>
                <Descriptions.Item label="通讯地址">{previewData.basicInfo.address}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* 二、项目概况 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>二、项目概况</Typography.Title>
              <div style={{ textIndent: '2em', lineHeight: 1.8 }}>
                <Paragraph><Text strong>1. 建设背景：</Text>{previewData.overview.background}</Paragraph>
                <Paragraph><Text strong>2. 建设目标：</Text>{previewData.overview.objectives}</Paragraph>
                <Paragraph><Text strong>3. 主要内容：</Text>{previewData.overview.content}</Paragraph>
                <Paragraph><Text strong>4. 技术路线：</Text>{previewData.overview.route}</Paragraph>
              </div>
            </div>

            {/* 三、实施计划 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>三、实施计划</Typography.Title>
              <div style={{ padding: '0 24px' }}>
                <Timeline items={previewData.plan.map(item => ({ color: 'blue', children: <><Text strong>{item.date}</Text> {item.children}</> }))} />
              </div>
            </div>

            {/* 四、预算明细 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>四、预算明细</Typography.Title>
              <Row gutter={24}>
                <Col span={14}>
                  <Table 
                    dataSource={previewData.budget} 
                    columns={[
                      { title: '费用科目', dataIndex: 'item', key: 'item' },
                      { title: '金额（万元）', dataIndex: 'amount', key: 'amount', render: (val) => val.toFixed(2) },
                      { title: '测算依据', dataIndex: 'desc', key: 'desc' }
                    ]}
                    pagination={false}
                    size="small"
                    summary={pageData => {
                      let total = 0;
                      pageData.forEach(({ amount }) => { total += amount; });
                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                          <Table.Summary.Cell index={1}><strong>{total.toFixed(2)}</strong></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                        </Table.Summary.Row>
                      );
                    }}
                  />
                </Col>
                <Col span={10}>
                  <div style={{ height: 250 }}>
                    <ReactECharts option={budgetOption} style={{ height: '100%', width: '100%' }} />
                  </div>
                </Col>
              </Row>
            </div>

            {/* 五、预期成果 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>五、预期成果</Typography.Title>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="技术指标">{previewData.outcomes.tech}</Descriptions.Item>
                <Descriptions.Item label="经济效益">{previewData.outcomes.economic}</Descriptions.Item>
                <Descriptions.Item label="社会效益">{previewData.outcomes.social}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* 六、风险分析及应对措施 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>六、风险分析及应对措施</Typography.Title>
              <Table 
                dataSource={previewData.risks} 
                columns={[
                  { title: '风险类型', dataIndex: 'risk', key: 'risk', width: 120 },
                  { title: '应对措施', dataIndex: 'countermeasure', key: 'countermeasure' }
                ]}
                pagination={false}
                size="small"
              />
            </div>

            {/* 七、附件清单 */}
            <div style={{ marginBottom: 32 }}>
              <Typography.Title level={4} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>七、附件清单</Typography.Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {previewData.attachments.map((file, index) => (
                  <Tag key={index} icon={<PaperClipOutlined />} color="blue" style={{ padding: '4px 10px', fontSize: 14 }}>{file}</Tag>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', color: '#999', marginTop: 60, fontSize: 12 }}>
              —— 本文档由JZT企业服务平台自动生成，仅供预览 ——
            </div>
          </div>
        </Watermark>
      </Modal>
    );
  };

  // 渲染步骤1：完善信息与数据填写
  const renderStep1 = () => {
    const hasFinancialData = [annualRevenue, netProfit, rdExpenses, totalAssets, totalLiabilities].some(val => val !== undefined && val !== null && val > 0);
    
    const financialOption = {
      title: { 
        text: '财务数据可视化概览', 
        left: 'left',
        textStyle: { fontSize: 16, fontWeight: 'normal' }
      },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['年销售收入', '净利润', '研发费用', '总资产', '总负债'],
        axisTick: { alignWithLabel: true }
      },
      yAxis: { type: 'value', name: '金额 (万元)' },
      series: [
        {
          name: '金额',
          type: 'bar',
          barWidth: '40%',
          data: [
            annualRevenue || 0,
            netProfit || 0,
            rdExpenses || 0,
            totalAssets || 0,
            totalLiabilities || 0
          ],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    };

    return (
    <div style={{ paddingBottom: DESIGN_TOKENS.spacing.lg }}>
      {/* 1. 企业基础信息 (只读) */}
      <Card 
        title={<Space><UserOutlined /> 企业基础信息</Space>} 
        bordered={false}
        style={{ marginBottom: DESIGN_TOKENS.spacing.md, background: '#FAFAFA' }}
        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <Descriptions column={3} layout="vertical">
          <Descriptions.Item label="企业名称">{projectInfo?.companyName || '深圳市创新科技有限公司'}</Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">{projectInfo?.creditCode || '91440300MA5XXXXXX'}</Descriptions.Item>
          <Descriptions.Item label="法定代表人">{projectInfo?.legalPerson || '张三'}</Descriptions.Item>
          <Descriptions.Item label="成立日期">2020-03-15</Descriptions.Item>
          <Descriptions.Item label="注册资本">1000万元</Descriptions.Item>
          <Descriptions.Item label="员工人数">85人</Descriptions.Item>
        </Descriptions>
      </Card>

      <Form 
        form={form} 
        layout="vertical" 
        initialValues={formData}
        onValuesChange={handleFormChange}
        requiredMark={false}
      >
        {/* 隐藏字段：企业基础信息 */}
        <Form.Item name="companyName" hidden initialValue={projectInfo?.companyName || '深圳市创新科技有限公司'}>
          <Input />
        </Form.Item>
        <Form.Item name="creditCode" hidden initialValue={projectInfo?.creditCode || '91440300MA5XXXXXX'}>
          <Input />
        </Form.Item>
        <Form.Item name="legalPerson" hidden initialValue={projectInfo?.legalPerson || '张三'}>
          <Input />
        </Form.Item>

        {/* 联系人信息 */}
        <Card 
          title={<Space><UserOutlined /> 联系人信息</Space>} 
          bordered={false}
          style={{ marginBottom: DESIGN_TOKENS.spacing.md }}
          headStyle={{ borderBottom: 'none', paddingLeft: 0 }}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="联系人姓名"
                name="contactPerson"
                rules={[{ required: false, message: '请输入联系人姓名' }]}
              >
                <Input placeholder="请输入联系人姓名" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="contactPhone"
                rules={[{ required: false, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 2. 申报资质类型 */}
        <Card 
          title={<Space><CheckCircleOutlined /> 申报资质类型</Space>}
          bordered={false}
          style={{ marginBottom: DESIGN_TOKENS.spacing.md }}
          headStyle={{ borderBottom: 'none', paddingLeft: 0 }}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Alert
            message="资质选择说明"
            description="点击输入框打开资质选择器，支持分组浏览、搜索定位、多选资质，查看详细申报条件和核心价值。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form.Item
            name="projectType"
            rules={[
              { 
                required: true, 
                message: '请至少选择一个申报资质类型',
                type: 'array',
                min: 1
              }
            ]}
          >
            <Input
              size="large"
              placeholder="请选择申报资质类型（支持多选）"
              readOnly
              onClick={() => setQualificationDrawerVisible(true)}
              value={getSelectedQualificationsText(form.getFieldValue('projectType') || [])}
              suffix={
                <Space>
                  {form.getFieldValue('projectType')?.length > 0 && (
                    <Tag color="blue">{form.getFieldValue('projectType').length}</Tag>
                  )}
                  <Button type="link" size="small" onClick={(e) => {
                    e.stopPropagation();
                    setQualificationDrawerVisible(true);
                  }}>
                    点击选择
                  </Button>
                </Space>
              }
              style={{ cursor: 'pointer' }}
            />
          </Form.Item>
          
          {/* 已选资质标签展示 */}
          {form.getFieldValue('projectType')?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                已选资质：
              </Text>
              <Space wrap>
                {form.getFieldValue('projectType').map((value: string) => {
                  return (
                    <Tag
                      key={value}
                      color="blue"
                      closable
                      onClose={(e) => {
                        e.preventDefault();
                        const current = form.getFieldValue('projectType') || [];
                        const newValues = current.filter((v: string) => v !== value);
                        form.setFieldsValue({
                          projectType: newValues
                        });
                        // 触发表单验证
                        form.validateFields(['projectType']);
                      }}
                    >
                      {getQualificationLabel(value)}
                    </Tag>
                  );
                })}
              </Space>
            </div>
          )}
        </Card>
        
        {/* 资质选择抽屉 */}
        <QualificationDrawer
          visible={qualificationDrawerVisible}
          value={form.getFieldValue('projectType') || []}
          onClose={() => setQualificationDrawerVisible(false)}
          onConfirm={(selectedValues) => {
            form.setFieldsValue({ projectType: selectedValues });
            // 触发表单验证
            form.validateFields(['projectType']).catch(() => {});
            setQualificationDrawerVisible(false);
          }}
        />

        {/* 3. 企业财务数据 */}
        <Card 
          title={<Space><HistoryOutlined /> 企业财务数据</Space>}
          bordered={false}
          extra={
            <Space>
               <Button type="text" icon={<HistoryOutlined />}>查看历史</Button>
               <Button type="text" danger icon={<DeleteOutlined />} onClick={() => form.resetFields(['annualRevenue', 'netProfit', 'rdExpenses', 'totalAssets', 'totalLiabilities'])}>清除所有数据</Button>
            </Space>
          }
          headStyle={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <Alert
            message="财务数据说明"
            description="以下财务数据将作为初审依据，您可以根据企业实际情况填写，系统将自动计算相关占比率。"
            type="info"
            showIcon
            style={{ marginBottom: DESIGN_TOKENS.spacing.lg }}
          />

          <div style={{ marginBottom: DESIGN_TOKENS.spacing.lg }}>
            <Title level={5} style={{ marginBottom: DESIGN_TOKENS.spacing.md, color: DESIGN_TOKENS.colors.primary, borderLeft: `3px solid ${DESIGN_TOKENS.colors.primary}`, paddingLeft: 8 }}>收入与利润数据</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="年销售收入 (万元)"
                  name="annualRevenue"
                  rules={[{ required: false, message: '请输入年销售收入' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请输入年销售收入" precision={2} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="净利润 (万元)"
                  name="netProfit"
                  rules={[{ required: false, message: '请输入净利润' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请输入净利润" precision={2} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="研发费用 (万元)"
                  name="rdExpenses"
                  rules={[{ required: false, message: '请输入研发费用' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请输入研发费用" precision={2} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Title level={5} style={{ marginBottom: DESIGN_TOKENS.spacing.md, color: DESIGN_TOKENS.colors.warning, borderLeft: `3px solid ${DESIGN_TOKENS.colors.warning}`, paddingLeft: 8 }}>资产负债数据</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="总资产 (万元)"
                  name="totalAssets"
                  rules={[{ required: false, message: '请输入总资产' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请输入总资产" precision={2} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="总负债 (万元)"
                  name="totalLiabilities"
                  rules={[{ required: false, message: '请输入总负债' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请输入总负债" precision={2} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {hasFinancialData && (
            <div style={{ marginTop: DESIGN_TOKENS.spacing.xl, borderTop: '1px solid #f0f0f0', paddingTop: DESIGN_TOKENS.spacing.lg }}>
              <ReactECharts option={financialOption} style={{ height: 300 }} />
            </div>
          )}
        </Card>
      </Form>
    </div>
  );
  };

  // 渲染步骤2：上传材料
  const renderStep2 = () => (
    <Card title="上传申报材料" style={{ marginBottom: DESIGN_TOKENS.spacing.md }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>项目申请表</Text>
          <Upload.Dragger
            beforeUpload={beforeUpload}
            maxCount={1}
            style={{ marginTop: DESIGN_TOKENS.spacing.sm }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持PDF、DOC、DOCX、XLS、XLSX、PNG、JPG格式，文件大小不超过10MB</p>
          </Upload.Dragger>
        </div>

        <div>
          <Text strong>营业执照副本复印件</Text>
          <Upload.Dragger
            beforeUpload={beforeUpload}
            maxCount={1}
            style={{ marginTop: DESIGN_TOKENS.spacing.sm }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持PDF、PNG、JPG格式，文件大小不超过10MB</p>
          </Upload.Dragger>
        </div>

        <div>
          <Text strong>项目可行性研究报告</Text>
          <Upload.Dragger
            beforeUpload={beforeUpload}
            maxCount={1}
            style={{ marginTop: DESIGN_TOKENS.spacing.sm }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持PDF、DOC、DOCX格式，文件大小不超过10MB</p>
          </Upload.Dragger>
        </div>

        <div>
          <Text strong>第三方节能量审核报告</Text>
          <Upload.Dragger
            beforeUpload={beforeUpload}
            maxCount={1}
            style={{ marginTop: DESIGN_TOKENS.spacing.sm }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持PDF、DOC、DOCX格式，文件大小不超过10MB</p>
          </Upload.Dragger>
        </div>
      </Space>
    </Card>
  );

  // 渲染步骤3：审核提交
  const renderStep3 = () => {
    return (
    <Card title="审核提交" style={{ marginBottom: DESIGN_TOKENS.spacing.md }}>
      <Alert
        message="提交前确认"
        description="请仔细核对申报信息，确认无误后提交。提交后将无法修改，请谨慎操作。"
        type="warning"
        showIcon
        style={{ marginBottom: DESIGN_TOKENS.spacing.lg, background: '#fffbe6', border: '1px solid #ffe58f' }}
      />

      <div style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>申报信息预览</Title>
        <div style={{ background: '#fafafa', padding: 24, borderRadius: 4 }}>
          <Row gutter={[48, 24]}>
            <Col span={12}>
              <div style={{ marginBottom: 8, color: '#999' }}>申报企业</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{formData.companyName || '深圳市创新科技有限公司'}</div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8, color: '#999' }}>申报类型</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{formData.projectType === 'type1' ? '国家高新技术企业认定' : (formData.projectType === 'type2' ? '深圳市技术攻关项目' : '企业技术中心认定')}</div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8, color: '#999' }}>年销售收入</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{formData.annualRevenue ? `${formData.annualRevenue} 万元` : '未填写'}</div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8, color: '#999' }}>研发费用</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{formData.rdExpenses ? `${formData.rdExpenses} 万元` : '未填写'}</div>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>预览申报书</Button>
          <Button icon={<PrinterOutlined />}>打印存档</Button>
        </div>
      </div>

      <Divider />

      <Form form={form} initialValues={formData} onValuesChange={handleFormChange} style={{ marginTop: DESIGN_TOKENS.spacing.lg }}>
        <Form.Item
          name="declaration"
          valuePropName="checked"
        >
          <Radio.Group>
            <Radio value={true}>
              我已仔细核对所有申报信息，确认无误并同意提交
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Card>
  )};

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      default:
        return null;
    }
  };

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          style={{ marginRight: 16 }} 
          onClick={handleBack}
        >
          返回
        </Button>
      </div>

      <Row gutter={24}>
        {/* 中间内容区 */}
        <Col span={18}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
              <Title level={3} style={{ margin: 0, marginRight: 12 }}>申报向导</Title>
              <Text type="secondary">专业的企业资质申报服务</Text>
            </div>
              


              {/* 进度条 - 移除旧的进度条，使用自定义步骤条 */}
              {/* 
              <div style={{ marginBottom: DESIGN_TOKENS.spacing.lg }}>
                <Text strong>申报进度：{currentStep + 1}/3</Text>
                <Progress 
                  percent={((currentStep + 1) / 3) * 100} 
                  showInfo={false}
                  strokeColor={DESIGN_TOKENS.colors.primary}
                  style={{ marginTop: DESIGN_TOKENS.spacing.xs }}
                />
              </div>
              */}

              {/* 步骤导航 */}
              <CustomSteps />

              {/* 步骤内容 */}
              {renderStepContent()}

              {/* 操作按钮 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: DESIGN_TOKENS.spacing.lg, padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
                 <Button icon={<SaveOutlined />} size="large" onClick={handleSaveDraft}>保存草稿</Button>
                 <Space>
                    {currentStep > 0 && (
                      <Button size="large" onClick={handlePrev}>上一步</Button>
                    )}
                    {currentStep < steps.length - 1 && (
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleNext}
                      >
                        下一步
                      </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                      <Button 
                        size="large" 
                        onClick={handleSubmit}
                        loading={submitting}
                        disabled={!declaration}
                      >
                        提交申报
                      </Button>
                    )}
                 </Space>
              </div>
          </div>
        </Col>

        {/* 右侧提示区 */}
        <Col span={6}>
            <Card title="申报小贴士" size="small" style={{ position: 'sticky', top: 24 }}>
              <div style={{ padding: '0 8px' }}>
                <div style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
                  1. 请确保所有信息真实有效
                </div>
                <div style={{ marginBottom: 12, color: '#666', fontSize: 13 }}>
                  2. 支持中途保存草稿
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 申报书预览模态框 */}
        {renderPreviewModal()}
    </>
  );
};

export default ApplyWizardWithLayout;
