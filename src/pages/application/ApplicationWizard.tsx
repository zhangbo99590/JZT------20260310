import React, { useState, useMemo } from 'react';
import { 
  Steps, 
  Card, 
  Button, 
  Form, 
  Select, 
  Upload, 
  Checkbox, 
  InputNumber, 
  Row, 
  Col, 
  Alert, 
  Typography, 
  Divider,
  Space, 
  Modal, 
  Tag,
  message,
  Breadcrumb
} from 'antd';
import { 
  ArrowLeftOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  DeleteOutlined,
  HistoryOutlined,
  WarningOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import TemplateUpdateNotification from '../../components/TemplateUpdateNotification';
import SmartQA from '../../components/SmartQA';
import ApplicationStats from '../../components/ApplicationStats';
import FormProgress from '../../components/FormProgress';
import { templateService } from '../../services/templateService';
import { financialDataService, FinancialData } from '../../services/financialDataService';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface CompanyInfo {
  name: string;
  creditCode: string;
  address: string;
  legalPerson: string;
  registrationDate: string;
  registeredCapital: number;
  industry: string;
  employeeCount: number;
}

interface ApplicationData {
  step1: {
    qualificationType: string;
    relatedPolicies: string[];
    confirmInfo: boolean;
    // 财务数据
    annualRevenue: number;
    rdExpense: number;
    netProfit: number;
    totalAssets: number;
    totalLiabilities: number;
    assetLiabilityRatio: number;
  };
  step2: {
    materials: { [key: string]: any };
    confirmInfo: boolean;
  };
  step3: {
    confirmed: boolean;
  };
}

const ApplicationWizard: React.FC = () => {
  const navigate = useNavigate();
  const { } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [clearType, setClearType] = useState<'rdExpense' | 'all'>('rdExpense');
  const [historyVisible, setHistoryVisible] = useState(false);
  const [validationResult, setValidationResult] = useState<{ errors: string[]; warnings: string[] }>({ errors: [], warnings: [] });
  const [isStep1Confirmed, setIsStep1Confirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // 计算表单完成度
  const calculateProgress = () => {
    const step1Fields = [
      applicationData.step1.qualificationType,
      applicationData.step1.confirmInfo,
      applicationData.step1.annualRevenue,
      applicationData.step1.rdExpense
    ];
    const completedStep1 = step1Fields.filter(field => field && field !== 0).length;
    
    return {
      completedFields: completedStep1,
      totalFields: 4, // 必填字段数量
      percentage: Math.round((completedStep1 / 4) * 100),
    };
  };

  // 模拟企业基础信息
  const [companyInfo] = useState<CompanyInfo>({
    name: '深圳市创新科技有限公司',
    creditCode: '91440300MA5XXXXX1X',
    address: '深圳市南山区科技园南区高新南七道16号',
    legalPerson: '张三',
    registrationDate: '2020-03-15',
    registeredCapital: 1000,
    industry: '软件和信息技术服务业',
    employeeCount: 85
  });

  // 申报数据
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    step1: {
      qualificationType: '',
      relatedPolicies: [],
      confirmInfo: false,
      annualRevenue: 0,
      rdExpense: 0,
      netProfit: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      assetLiabilityRatio: 0
    },
    step2: {
      materials: {},
      confirmInfo: false
    },
    step3: {
      confirmed: false
    }
  });

  // 相关政策条款
  const relatedPolicies = [
    {
      id: '1',
      title: '《高新技术企业认定管理办法》',
      content: '企业申请认定时须注册成立一年以上',
      status: 'match'
    },
    {
      id: '2', 
      title: '《国家重点支持的高新技术领域》',
      content: '企业主要产品技术属于规定范围',
      status: 'match'
    }
  ];

  // 申报材料清单 - 从模板服务获取详细信息
  const materialsList = useMemo(() => {
    const templates = templateService.getAllTemplates();
    const uploadedMaterials = applicationData.step2.materials || {};
    
    return [
      {
        key: 'application',
        name: '高新技术企业认定申请书',
        required: false,
        templateInfo: templates.find(t => t.id === 'high_tech_application'),
        uploaded: !!uploadedMaterials['application']
      },
      {
        key: 'license',
        name: '企业营业执照副本',
        required: false,
        templateInfo: templates.find(t => t.id === 'business_license'),
        uploaded: !!uploadedMaterials['license']
      },
      {
        key: 'financial_report',
        name: '近三年财务审计报告',
        required: false,
        templateInfo: null,
        uploaded: !!uploadedMaterials['financial_report']
      }
    ];
  }, [applicationData.step2.materials]);



  // 财务数据验证（建议性提示）
  const validateFinancialData = () => {
    const suggestions = [];
    const data = applicationData.step1;
    
    
    // 资产负债率建议
    if (data.assetLiabilityRatio > 70) {
      suggestions.push('提示：资产负债率较高，建议关注企业财务风险');
    }
    
    return suggestions;
  };

  // 验证财务数据完整性
  const validateFinancialDataComplete = () => {
    const data = applicationData.step1;
    const financialData: FinancialData = {
      annualRevenue: data.annualRevenue,
      rdExpense: data.rdExpense,
      netProfit: data.netProfit,
      totalAssets: data.totalAssets,
      totalLiabilities: data.totalLiabilities,
      assetLiabilityRatio: data.assetLiabilityRatio
    };
    
    const result = financialDataService.validateFinancialData(financialData);
    setValidationResult({ errors: result.errors, warnings: result.warnings });
    
    if (result.errors.length > 0) {
      message.error(`数据验证失败: ${result.errors.join(', ')}`);
      return false;
    }
    
    if (result.warnings.length > 0) {
      message.warning('数据存在警告信息，请注意查看');
    }
    
    return true;
  };

  // 显示清除确认对话框
  const showClearConfirm = (type: 'rdExpense' | 'all') => {
    setClearType(type);
    setClearModalVisible(true);
  };

  // 执行清除操作
  const handleClearData = () => {
    const currentFinancialData: FinancialData = {
      annualRevenue: applicationData.step1.annualRevenue,
      rdExpense: applicationData.step1.rdExpense,
      netProfit: applicationData.step1.netProfit,
      totalAssets: applicationData.step1.totalAssets,
      totalLiabilities: applicationData.step1.totalLiabilities,
      assetLiabilityRatio: applicationData.step1.assetLiabilityRatio
    };

    let newData: FinancialData;
    
    if (clearType === 'rdExpense') {
      newData = financialDataService.clearRdExpenseData(currentFinancialData);
      message.success('研发费用数据已清除');
    } else {
      newData = financialDataService.clearAllFinancialData(currentFinancialData);
      message.success('所有财务数据已清除');
    }

    // 更新状态
    setApplicationData({
      ...applicationData,
      step1: {
        ...applicationData.step1,
        ...newData
      }
    });

    // 更新表单
    form.setFieldsValue({
      annualRevenue: newData.annualRevenue || undefined,
      rdExpense: newData.rdExpense || undefined,
      netProfit: newData.netProfit || undefined,
      totalAssets: newData.totalAssets || undefined,
      totalLiabilities: newData.totalLiabilities || undefined,
      assetLiabilityRatio: newData.assetLiabilityRatio || undefined
    });

    setClearModalVisible(false);
  };

  // 保存财务数据
  const saveFinancialData = () => {
    const financialData: FinancialData = {
      annualRevenue: applicationData.step1.annualRevenue,
      rdExpense: applicationData.step1.rdExpense,
      netProfit: applicationData.step1.netProfit,
      totalAssets: applicationData.step1.totalAssets,
      totalLiabilities: applicationData.step1.totalLiabilities,
      assetLiabilityRatio: applicationData.step1.assetLiabilityRatio
    };

    const success = financialDataService.saveFinancialData(financialData);
    if (success) {
      message.success('财务数据保存成功');
    } else {
      message.error('财务数据保存失败');
    }
  };


  // 步骤内容渲染
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            {/* 企业基础信息卡片 */}
            <Card 
              title={<Space><InfoCircleOutlined style={{ color: '#1890ff' }} /><span>企业基础信息</span></Space>}
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Row gutter={[16, 16]}>
                {[
                  { label: '企业名称', value: companyInfo.name },
                  { label: '统一社会信用代码', value: companyInfo.creditCode },
                  { label: '法定代表人', value: companyInfo.legalPerson },
                  { label: '注册日期', value: companyInfo.registrationDate },
                  { label: '注册资本', value: `${companyInfo.registeredCapital}万元` },
                  { label: '员工人数', value: `${companyInfo.employeeCount}人` }
                ].map((item, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.label}</Text>
                      <div style={{ marginTop: '4px', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 申报类型选择 */}
            <Card 
              title={<Space><FileTextOutlined style={{ color: '#1890ff' }} /><span>申报资质类型</span></Space>}
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="qualificationType"
                  rules={[{ required: true, message: '请选择申报资质类型' }]}
                >
                  <Select 
                    placeholder="请选择申报资质类型" 
                    size="large"
                    onChange={(value) => {
                      setApplicationData({
                        ...applicationData,
                        step1: { ...applicationData.step1, qualificationType: value }
                      });
                    }}
                  >
                    <Option value="high_tech">
                      <Space>
                        <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                        <span>高新技术企业认定</span>
                      </Space>
                    </Option>
                    <Option value="tech_sme">
                      <Space>
                        <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                        <span>科技型中小企业</span>
                      </Space>
                    </Option>
                    <Option value="innovation">
                      <Space>
                        <SafetyCertificateOutlined style={{ color: '#faad14' }} />
                        <span>创新型企业</span>
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>

            {/* 相关政策条款 */}
            <Card 
              title={<Space><SafetyCertificateOutlined style={{ color: '#52c41a' }} /><span>相关政策条款自动关联</span></Space>}
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Row gutter={[12, 12]}>
                {relatedPolicies.map((policy) => (
                  <Col xs={24} key={policy.id}>
                    <div style={{
                      padding: '16px',
                      background: policy.status === 'match' ? '#f6ffed' : '#fffbe6',
                      border: `1px solid ${policy.status === 'match' ? '#b7eb8f' : '#ffe58f'}`,
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>{policy.title}</div>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{policy.content}</Text>
                      </div>
                      <Tag color={policy.status === 'match' ? 'success' : 'warning'}>
                        {policy.status === 'match' ? '✓ 符合' : '⚠ 需注意'}
                      </Tag>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 财务数据填写 */}
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <Space><DollarOutlined style={{ color: '#1890ff' }} /><span>企业财务数据</span></Space>
                  <Space>
                    <Button 
                      size="small" 
                      icon={<HistoryOutlined />}
                      onClick={() => setHistoryVisible(true)}
                    >
                      查看历史
                    </Button>
                    <Button 
                      size="small" 
                      danger
                      icon={<ClearOutlined />}
                      onClick={() => showClearConfirm('rdExpense')}
                    >
                      清除研发费用
                    </Button>
                    <Button 
                      size="small" 
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showClearConfirm('all')}
                    >
                      清除所有数据
                    </Button>
                  </Space>
                </div>
              }
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Alert
                message="财务数据说明"
                description="以下财务数据均为选填项，您可以根据企业实际情况填写。系统将自动计算相关财务比率。"
                type="info"
                showIcon
                style={{ marginBottom: '20px', borderRadius: '6px' }}
              />

              <Form form={form} layout="vertical">
                {/* 收入与利润数据组 */}
                <Card 
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>收入与利润数据</span>}
                  size="small" 
                  style={{ marginBottom: '20px' }}
                  headStyle={{ background: '#f0f5ff', borderBottom: '2px solid #1890ff' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 500 }}>年销售收入（万元）</span>}
                        name="annualRevenue"
                        tooltip="企业最近一年的销售收入总额"
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0}
                          placeholder="请输入年销售收入"
                          size="large"
                          onChange={(value) => {
                            const revenue = value || 0;
                            setApplicationData({
                              ...applicationData,
                              step1: { 
                                ...applicationData.step1, 
                                annualRevenue: revenue
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 500 }}>净利润（万元）</span>}
                        name="netProfit"
                        tooltip="企业最近一年的净利润"
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0}
                          placeholder="请输入净利润"
                          size="large"
                          onChange={(value) => {
                            setApplicationData({
                              ...applicationData,
                              step1: { ...applicationData.step1, netProfit: value || 0 }
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* 资产负债数据组 */}
                <Card 
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>资产负债数据</span>}
                  size="small" 
                  style={{ marginBottom: '20px' }}
                  headStyle={{ background: '#fff7e6', borderBottom: '2px solid #fa8c16' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 500 }}>总资产（万元）</span>}
                        name="totalAssets"
                        tooltip="企业资产负债表中的总资产"
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0}
                          placeholder="请输入总资产"
                          size="large"
                          onChange={(value) => {
                            const assets = value || 0;
                            const liabilities = applicationData.step1.totalLiabilities || 0;
                            const ratio = assets > 0 ? (liabilities / assets) * 100 : 0;
                            setApplicationData({
                              ...applicationData,
                              step1: { 
                                ...applicationData.step1, 
                                totalAssets: assets,
                                assetLiabilityRatio: Number(ratio.toFixed(2))
                              }
                            });
                            form.setFieldsValue({ assetLiabilityRatio: Number(ratio.toFixed(2)) });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 500 }}>总负债（万元）</span>}
                        name="totalLiabilities"
                        tooltip="企业资产负债表中的总负债"
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          min={0}
                          placeholder="请输入总负债"
                          size="large"
                          onChange={(value) => {
                            const liabilities = value || 0;
                            const assets = applicationData.step1.totalAssets || 0;
                            const ratio = assets > 0 ? (liabilities / assets) * 100 : 0;
                            setApplicationData({
                              ...applicationData,
                              step1: { 
                                ...applicationData.step1, 
                                totalLiabilities: liabilities,
                                assetLiabilityRatio: Number(ratio.toFixed(2))
                              }
                            });
                            form.setFieldsValue({ assetLiabilityRatio: Number(ratio.toFixed(2)) });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item 
                        label={
                          <Space>
                            <span style={{ fontWeight: 500 }}>资产负债率（%）</span>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              (自动计算)
                            </Text>
                          </Space>
                        } 
                        name="assetLiabilityRatio"
                        tooltip="资产负债率 = 总负债 ÷ 总资产 × 100%，系统自动计算或可手动输入"
                      >
                        <InputNumber 
                          style={{ width: '100%' }} 
                          precision={2}
                          min={0}
                          max={100}
                          placeholder="自动计算或手动输入"
                          size="large"
                          onChange={(value) => {
                            setApplicationData({
                              ...applicationData,
                              step1: { 
                                ...applicationData.step1, 
                                assetLiabilityRatio: value || 0
                              }
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Form>

              {/* 数据验证错误提示 */}
              {validationResult.errors.length > 0 && (
                <Alert
                  message="数据验证错误"
                  description={
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  }
                  type="error"
                  showIcon
                  closable
                  style={{ marginTop: '16px' }}
                />
              )}

              {/* 数据验证警告提示 */}
              {validationResult.warnings.length > 0 && (
                <Alert
                  message="数据验证警告"
                  description={
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {validationResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  }
                  type="warning"
                  showIcon
                  closable
                  style={{ marginTop: '16px' }}
                />
              )}

              {/* 财务数据建议提醒 */}
              {validateFinancialData().length > 0 && (
                <Alert
                  message="温馨提示"
                  description={
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {validateFinancialData().map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}

              {/* 确认信息 */}
              <Form form={form} style={{ marginTop: '16px' }}>
                <Form.Item
                  name="confirmInfo"
                  valuePropName="checked"
                  rules={[{ required: true, message: '请确认企业信息和数据无误' }]}
                >
                  <Checkbox
                    onChange={(e) => {
                      setIsStep1Confirmed(e.target.checked);
                      setApplicationData({
                        ...applicationData,
                        step1: { ...applicationData.step1, confirmInfo: e.target.checked }
                      });
                    }}
                  >
                    我确认以上企业基础信息和申报数据准确无误，且选择的申报类型正确
                  </Checkbox>
                </Form.Item>
              </Form>
            </Card>
          </div>
        );

      case 1:
        return (
          <Card 
            title="证明材料上传" 
            style={{ 
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Alert
              message="请按照清单上传相关材料，标记为必需的材料必须上传"
              type="info"
              style={{ marginBottom: '24px' }}
              showIcon
            />

            <div style={{ display: 'grid', gap: '16px' }}>
              {materialsList.map((material) => (
                <Card 
                  key={material.key}
                  size="small" 
                  style={{ 
                    border: material.uploaded ? '1px solid #52c41a' : '1px solid #d9d9d9',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '4px' 
                      }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {material.name}
                        </Text>
                        {material.required && (
                          <Tag color="red" style={{ marginLeft: '8px', fontSize: '12px' }}>
                            必需
                          </Tag>
                        )}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '12px',
                        color: material.uploaded ? '#52c41a' : '#faad14'
                      }}>
                        {material.uploaded ? (
                          <>
                            <CheckCircleOutlined style={{ marginRight: '4px' }} />
                            已上传
                          </>
                        ) : (
                          <>
                            <ExclamationCircleOutlined style={{ marginRight: '4px' }} />
                            待上传
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      {material.templateInfo && (
                        <Button 
                          type="text" 
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={async () => {
                            if (material.templateInfo) {
                              const result = await templateService.downloadTemplate(material.templateInfo.id);
                              if (result.success) {
                                message.success(result.message);
                              } else {
                                message.error(result.message);
                              }
                            }
                          }}
                          style={{ color: '#1890ff' }}
                        >
                          下载模板
                        </Button>
                      )}
                      <Upload
                        beforeUpload={() => false}
                        onChange={(info) => {
                          const newMaterials = { ...applicationData.step2.materials, [material.key]: true };
                          setApplicationData({
                            ...applicationData,
                            step2: { ...applicationData.step2, materials: newMaterials }
                          });
                          // 更新已上传文件列表
                          if (info.file) {
                            setUploadedFiles(prev => {
                              const exists = prev.some(f => f.key === material.key);
                              if (!exists) {
                                return [...prev, { key: material.key, name: material.name, file: info.file }];
                              }
                              return prev;
                            });
                          }
                          message.success(`${material.name} 上传成功`);
                        }}
                        showUploadList={false}
                      >
                        <Button 
                          type={material.uploaded ? "default" : "primary"}
                          size="small"
                          icon={<UploadOutlined />}
                        >
                          {material.uploaded ? '重新上传' : '上传文件'}
                        </Button>
                      </Upload>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>上传要求：</strong>
              </div>
              <div>
                • 支持格式：PDF、DOC、DOCX、JPG、PNG
              </div>
              <div>
                • 文件大小：单个文件不超过10MB
              </div>
              <div>
                • 文件命名：建议使用中文命名，便于识别
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Checkbox
                checked={applicationData.step2.confirmInfo}
                onChange={(e) => {
                  setApplicationData({
                    ...applicationData,
                    step2: { ...applicationData.step2, confirmInfo: e.target.checked }
                  });
                }}
              >
                我确认以上企业基础信息和申报数据准确无误，且选择的申报类型正确
              </Checkbox>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card 
            title="审核提交" 
            style={{ 
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Alert
              message="提交前确认"
              description="请仔细核对申报信息，确认无误后提交。提交后将无法修改，请谨慎操作。"
              type="warning"
              style={{ marginBottom: '24px' }}
            />

            <Card 
              title="申报信息预览" 
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '8px'
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>申报企业</Text>
                    <div style={{ marginTop: '4px', fontWeight: 500 }}>{companyInfo.name}</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>申报类型</Text>
                    <div style={{ marginTop: '4px', fontWeight: 500 }}>高新技术企业认定</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>年销售收入</Text>
                    <div style={{ marginTop: '4px', fontWeight: 500 }}>{applicationData.step1.annualRevenue || 0} 万元</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ padding: '12px', background: '#fafafa', borderRadius: '6px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>研发费用</Text>
                    <div style={{ marginTop: '4px', fontWeight: 500 }}>{applicationData.step1.rdExpense || 0} 万元</div>
                  </div>
                </Col>
              </Row>
            </Card>

            <Space style={{ marginBottom: '16px' }}>
              <Button 
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
              >
                预览申报书
              </Button>
              <Button 
                icon={<PrinterOutlined />}
                onClick={() => message.info('打印功能开发中')}
              >
                打印存档
              </Button>
            </Space>

            <div style={{ marginTop: '24px' }}>
              <Checkbox
                checked={applicationData.step3.confirmed}
                onChange={(e) => {
                  setApplicationData({
                    ...applicationData,
                    step3: { ...applicationData.step3, confirmed: e.target.checked }
                  });
                }}
              >
                我已仔细核对所有申报信息，确认无误并同意提交
              </Checkbox>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // 表单验证失败，保持在当前步骤
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('申报提交成功！');
      navigate('/policy-center/application-management');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    try {
      // 生成草稿ID（如果是新草稿）
      const draftId = Date.now().toString();
      
      // 准备草稿数据
      const draftData = {
        id: draftId,
        title: applicationData.step1.qualificationType || '未命名申报',
        type: applicationData.step1.qualificationType || '资质认定',
        currentStep: currentStep,
        progress: calculateProgress().percentage,
        data: applicationData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
        completedSteps: currentStep,
        totalSteps: 3,
        description: `已完成第${currentStep + 1}步，进度${calculateProgress().percentage}%`
      };
      
      // 获取现有草稿列表
      const existingDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      
      // 添加或更新草稿
      const draftIndex = existingDrafts.findIndex((d: any) => d.id === draftId);
      if (draftIndex >= 0) {
        existingDrafts[draftIndex] = draftData;
      } else {
        existingDrafts.unshift(draftData);
      }
      
      // 保存到localStorage
      localStorage.setItem('applicationDrafts', JSON.stringify(existingDrafts));
      
      message.success('草稿保存成功！可在"我的申报"中查看和继续编辑');
    } catch (error) {
      console.error('保存草稿失败:', error);
      message.error('草稿保存失败，请重试');
    }
  };

  return (
    <PageWrapper module="policy">
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
        size="large"
      >
        返回
      </Button>

      {/* 标题和更新通知 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
          申报向导
          <Text type="secondary" style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '12px' }}>
            专业的企业资质申报服务
          </Text>
        </Title>
        <TemplateUpdateNotification
          templateIds={['high_tech_application', 'financial_report', 'technical_achievement']}
          onDownloadUpdate={(templateId, version) => {
            message.success(`开始下载 ${templateId} ${version}`);
          }}
          onViewDetails={(templateId) => {
            message.info(`查看模板详情: ${templateId}`);
          }}
        />
      </div>

      {/* 进度条 */}
      <Card 
        style={{ 
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderRadius: '8px'
        }}
      >
        <Steps current={currentStep} size="default">
          <Step title="资质信息与数据填写" description="确认企业信息并填写关键指标" />
          <Step title="证明材料上传" description="上传所需的申报材料" />
          <Step title="审核提交" description="预览确认并提交申报" />
        </Steps>
      </Card>

      {/* 主要内容区域 - 两栏布局 */}
      <Row gutter={24}>
        {/* 左侧：步骤内容 */}
        <Col xs={24} lg={16}>
          {renderStepContent()}

          {/* 操作按钮 */}
      <Card 
        style={{ 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderRadius: '8px',
          position: 'sticky',
          bottom: '24px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Button 
              icon={<SaveOutlined />}
              onClick={saveDraft}
              size="large"
            >
              保存草稿
            </Button>
          </div>
          <Space>
            {currentStep > 0 && (
              <Button size="large" onClick={prev}>
                上一步
              </Button>
            )}
            {currentStep < 2 && (
              <Button 
                type="primary" 
                size="large" 
                onClick={next}
                disabled={currentStep === 0 ? !isStep1Confirmed : (currentStep === 1 ? !applicationData.step2.confirmInfo : false)}
              >
                下一步
              </Button>
            )}
            {currentStep === 2 && (
              <Button 
                type="primary" 
                size="large"
                loading={loading}
                onClick={handleSubmit}
                disabled={!applicationData.step3.confirmed}
              >
                提交申报
              </Button>
            )}
          </Space>
        </div>
      </Card>
        </Col>

        {/* 右侧：进度和智能问答 */}
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: '24px' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <FormProgress
                currentStep={currentStep}
                totalSteps={3}
                completedFields={calculateProgress().completedFields}
                totalFields={calculateProgress().totalFields}
              />
              <SmartQA />
            </Space>
          </div>
        </Col>
      </Row>

      {/* 预览模态框 */}
      <Modal
        title="申报书预览"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="print" icon={<PrinterOutlined />}>
            打印
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{ padding: '20px', background: '#fff' }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            高新技术企业认定申请书
          </Title>
          <Divider />
          <Paragraph>
            <Text strong>申请企业：</Text>{companyInfo.name}
          </Paragraph>
          <Paragraph>
            <Text strong>统一社会信用代码：</Text>{companyInfo.creditCode}
          </Paragraph>
          <Paragraph>
            <Text strong>申请日期：</Text>{new Date().toLocaleDateString()}
          </Paragraph>
          {/* 更多预览内容... */}
        </div>
      </Modal>

      {/* 清除数据确认模态框 */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <span>确认清除数据</span>
          </Space>
        }
        visible={clearModalVisible}
        onOk={handleClearData}
        onCancel={() => setClearModalVisible(false)}
        okText="确认清除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Alert
          message="警告"
          description={
clearType === 'rdExpense' 
              ? '您即将清除研发费用数据，此操作不可恢复。是否继续？'
              : '您即将清除所有财务数据，包括年销售收入、研发费用、净利润、总资产、总负债等所有字段，此操作不可恢复。是否继续？'
          }
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <div style={{ padding: '12px', background: '#fafafa', borderRadius: '4px' }}>
          <Text strong>当前数据：</Text>
          <div style={{ marginTop: '8px' }}>
{clearType === 'rdExpense' ? (
              <>
                <div>研发费用：{applicationData.step1.rdExpense} 万元</div>
              </>
            ) : (
              <>
                <div>年销售收入：{applicationData.step1.annualRevenue} 万元</div>
                <div>研发费用：{applicationData.step1.rdExpense} 万元</div>
                <div>净利润：{applicationData.step1.netProfit} 万元</div>
                <div>总资产：{applicationData.step1.totalAssets} 万元</div>
                <div>总负债：{applicationData.step1.totalLiabilities} 万元</div>
                <div>资产负债率：{applicationData.step1.assetLiabilityRatio}%</div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* 操作历史抽屉 */}
      <Modal
        title={
          <Space>
            <HistoryOutlined style={{ color: '#1890ff' }} />
            <span>操作历史记录</span>
          </Space>
        }
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {financialDataService.getOperationLogs(20).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {financialDataService.getOperationLogs(20).map((log) => (
                <Card 
                  key={log.id} 
                  size="small"
                  style={{ 
                    borderLeft: `3px solid ${
                      log.operation === 'clear' || log.operation === 'delete' ? '#ff4d4f' :
                      log.operation === 'create' ? '#52c41a' : '#1890ff'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Tag color={
                      log.operation === 'clear' || log.operation === 'delete' ? 'red' :
                      log.operation === 'create' ? 'green' : 'blue'
                    }>
                      {log.operation === 'clear' ? '清除' :
                       log.operation === 'delete' ? '删除' :
                       log.operation === 'create' ? '创建' : '更新'}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(log.timestamp).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <Text strong>{log.description}</Text>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div>操作人：{log.operator}</div>
                    <div>字段：{log.field}</div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <HistoryOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无操作记录</div>
            </div>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default ApplicationWizard;
