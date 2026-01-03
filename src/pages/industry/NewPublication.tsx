import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Steps,
  Radio,
  Upload,
  Space,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Alert,
  Tooltip,
  Result,
} from 'antd';
import {
  InboxOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import type { NewPublicationForm, PublicationType, SupplyType, DemandType } from '../../types/industry';
import { createPublication } from '../../services/industryService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const NewPublication: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [publicationType, setPublicationType] = useState<PublicationType>('demand');
  const [subType, setSubType] = useState<SupplyType | DemandType | undefined>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 从URL参数获取类型，默认为需求
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'demand') {
      setPublicationType('demand');
      form.setFieldValue('type', 'demand');
    } else {
      // 默认设置为需求发布
      setPublicationType('demand');
      form.setFieldValue('type', 'demand');
    }
  }, [searchParams, form]);

  const demandTypes = [
    { value: 'purchase', label: '采购需求', desc: '采购物料或产品' },
    { value: 'cooperation', label: '合作需求', desc: '寻求业务合作' },
    { value: 'technology', label: '技术需求', desc: '技术研发合作' },
    { value: 'capacity', label: '产能需求', desc: '寻找代工产能' },
  ];

  const steps = [
    { title: '选择类型', description: '选择需求类型' },
    { title: '填写信息', description: '填写详细信息' },
    { title: '发布设置', description: '设置可见范围' },
  ];

  // 渲染采购需求表单
  const renderPurchaseRequirementForm = () => (
    <>
      {/* 产品基本信息 */}
      <Divider orientation="left">产品基本信息</Divider>
      <Form.Item name={['details', 'productName']} label="产品名称">
        <Input placeholder="例如：Z41H-16C铸钢闸阀" />
      </Form.Item>
      <Form.Item name={['details', 'specifications']} label="规格型号">
        <Input placeholder="例如：DN50 PN16" />
      </Form.Item>
      <Form.Item name={['details', 'material']} label="材质要求">
        <Input placeholder="例如：WCB铸钢、不锈钢304" />
      </Form.Item>
      
      {/* 采购数量信息 */}
      <Divider orientation="left">采购数量</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'quantity']} label="采购数量">
            <InputNumber style={{ width: '100%' }} placeholder="100" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'quantityUnit']} label="数量单位">
            <Select placeholder="选择单位">
              <Option value="件">件</Option>
              <Option value="台">台</Option>
              <Option value="套">套</Option>
              <Option value="个">个</Option>
              <Option value="批">批</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      {/* 预算与交付 */}
      <Divider orientation="left">预算与交付</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'budgetMin']} label="预算范围（最低）">
            <InputNumber style={{ width: '100%' }} placeholder="50" min={0} addonAfter="元" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'budgetMax']} label="预算范围（最高）">
            <InputNumber style={{ width: '100%' }} placeholder="80" min={0} addonAfter="元" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={['details', 'deliveryLocation']} label="交付地点">
        <Input placeholder="例如：北京市顺义区工厂" />
      </Form.Item>
      <Form.Item name={['details', 'deliveryTime']} label="期望交付时间">
        <Input placeholder="例如：签约后30天内" />
      </Form.Item>
    </>
  );

  // 渲染合作需求表单
  const renderCooperationRequirementForm = () => (
    <>
      <Divider orientation="left">合作基本信息</Divider>
      <Form.Item name={['details', 'cooperationField']} label="合作领域">
        <Select placeholder="选择合作领域">
          <Option value="产品研发">产品研发</Option>
          <Option value="市场拓展">市场拓展</Option>
          <Option value="生产制造">生产制造</Option>
          <Option value="技术服务">技术服务</Option>
        </Select>
      </Form.Item>
      <Form.Item name={['details', 'cooperationType']} label="合作方式">
        <Select placeholder="选择合作方式">
          <Option value="长期合作">长期合作</Option>
          <Option value="项目合作">项目合作</Option>
          <Option value="战略联盟">战略联盟</Option>
        </Select>
      </Form.Item>
      
      <Divider orientation="left">合作详情</Divider>
      <Form.Item name={['details', 'expectedGoal']} label="合作目标">
        <TextArea rows={3} placeholder="请描述希望达成的合作目标" />
      </Form.Item>
      <Form.Item name={['details', 'resourceInput']} label="资源投入">
        <TextArea rows={3} placeholder="请说明您可以投入的资源（资金、技术、人员等）" />
      </Form.Item>
      <Form.Item name={['details', 'profitDistribution']} label="收益分配">
        <Input placeholder="例如：按投入比例分成、固定收益" />
      </Form.Item>
    </>
  );

  // 渲染技术需求表单
  const renderTechnologyRequirementForm = () => (
    <>
      <Divider orientation="left">技术需求信息</Divider>
      <Form.Item name={['details', 'technologyField']} label="技术领域">
        <Select placeholder="选择技术领域">
          <Option value="人工智能">人工智能</Option>
          <Option value="物联网">物联网</Option>
          <Option value="自动化控制">自动化控制</Option>
          <Option value="数据分析">数据分析</Option>
          <Option value="机器学习">机器学习</Option>
        </Select>
      </Form.Item>
      <Form.Item name={['details', 'technologyDescription']} label="技术描述">
        <TextArea rows={3} placeholder="请详细描述所需技术的具体要求" />
      </Form.Item>
      
      <Divider orientation="left">项目信息</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'rdCycle']} label="预期周期（月）">
            <InputNumber style={{ width: '100%' }} placeholder="6" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'urgencyLevel']} label="紧急程度">
            <Select placeholder="选择紧急程度">
              <Option value="一般">一般</Option>
              <Option value="较急">较急</Option>
              <Option value="紧急">紧急</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Divider orientation="left">预算与成果</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'budgetMin']} label="预算范围（最低）">
            <InputNumber style={{ width: '100%' }} placeholder="50" min={0} addonAfter="万元" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'budgetMax']} label="预算范围（最高）">
            <InputNumber style={{ width: '100%' }} placeholder="100" min={0} addonAfter="万元" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={['details', 'resultOwnership']} label="成果归属">
        <Select placeholder="选择成果归属">
          <Option value="双方共享">双方共享</Option>
          <Option value="委托方所有">委托方所有</Option>
          <Option value="受托方所有">受托方所有</Option>
        </Select>
      </Form.Item>
    </>
  );

  // 渲染产能需求表单
  const renderCapacityRequirementForm = () => (
    <>
      <Divider orientation="left">产品信息</Divider>
      <Form.Item name={['details', 'productType']} label="产品类型">
        <Input placeholder="例如：机械零件、电子产品" />
      </Form.Item>
      <Form.Item name={['details', 'processingRequirements']} label="加工要求">
        <TextArea rows={3} placeholder="请详细描述加工工艺、技术要求和质量标准" />
      </Form.Item>
      
      <Divider orientation="left">产能需求</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'quantity']} label="需求数量">
            <InputNumber style={{ width: '100%' }} placeholder="1000" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'quantityUnit']} label="数量单位">
            <Select placeholder="选择单位">
              <Option value="件">件</Option>
              <Option value="台">台</Option>
              <Option value="套">套</Option>
              <Option value="批">批</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Divider orientation="left">交付要求</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name={['details', 'deliveryCycle']} label="交付周期（天）">
            <InputNumber style={{ width: '100%' }} placeholder="30" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={['details', 'qualityLevel']} label="质量等级">
            <Select placeholder="选择质量等级">
              <Option value="一级品">一级品</Option>
              <Option value="合格品">合格品</Option>
              <Option value="普通级">普通级</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={['details', 'qualityStandards']} label="质量标准">
        <Input placeholder="例如：ISO 9001、GB/T 19001" />
      </Form.Item>
    </>
  );

  // 根据子类型渲染对应表单（只保留需求类型）
  const renderDetailsForm = () => {
    if (!subType) return null;

    switch (subType) {
      case 'purchase':
        return renderPurchaseRequirementForm();
      case 'cooperation':
        return renderCooperationRequirementForm();
      case 'technology':
        return renderTechnologyRequirementForm();
      case 'capacity':
        return renderCapacityRequirementForm();
      default:
        return null;
    }
  };

  // 步骤1：选择类型
  const renderStep1 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="发布须知"
        description="请如实填写采购需求信息，虚假信息将被下架并影响企业信用。发布后需经过平台审核，审核通过后即可展示。"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />
      
      <Card>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={4} style={{ marginBottom: 8 }}>发布采购需求</Title>
          <Text type="secondary">选择您的采购需求类型，平台将为您匹配合适的供应商</Text>
        </div>

        <Form.Item name="subType" label="需求类型">
          <Radio.Group onChange={(e) => setSubType(e.target.value)} style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {demandTypes.map((type) => (
                <Col xs={24} sm={12} key={type.value}>
                  <Card
                    hoverable
                    style={{
                      borderColor: subType === type.value ? '#1890ff' : '#d9d9d9',
                      borderWidth: subType === type.value ? 2 : 1,
                      backgroundColor: subType === type.value ? '#f0f8ff' : '#fff',
                      height: '100%',
                    }}
                  >
                    <Radio value={type.value} style={{ width: '100%' }}>
                      <div style={{ padding: '8px 0' }}>
                        <Text strong style={{ fontSize: 15 }}>{type.label}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {type.desc}
                        </Text>
                      </div>
                    </Radio>
                  </Card>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>
      </Card>
    </Space>
  );

  // 步骤2：填写信息
  const renderStep2 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="填写提示"
        description="所有字段均为选填，请根据实际情况填写。信息越完整，越容易获得精准对接。"
        type="info"
        showIcon
      />
      
      <Card title="基本信息">
        <Form.Item name="title" label="商机标题" extra="选填，建议格式：【类型】产品/服务名称 - 简要说明">
          <Input 
            placeholder="例如：【采购需求】高性能锂电池 - 48V/60V 大批量采购" 
            showCount 
            maxLength={50}
            size="large"
          />
        </Form.Item>

        <Form.Item name="description" label="详细描述" extra="选填，请详细描述产品/服务特点、技术参数、合作方式等">
          <TextArea
            rows={6}
            placeholder="请详细描述您的采购需求信息"
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Card>

      <Card title="详细信息">
        {renderDetailsForm()}
      </Card>

      <Card title="地区与行业">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="region" label="所在地区">
              <Select placeholder="选择地区" size="large">
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="江苏省">江苏省</Option>
                <Option value="浙江省">浙江省</Option>
                <Option value="广东省">广东省</Option>
                <Option value="山东省">山东省</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="industry" label="所属行业">
              <Select placeholder="选择行业" size="large">
                <Option value="新能源">新能源</Option>
                <Option value="电动车制造">电动车制造</Option>
                <Option value="金属加工">金属加工</Option>
                <Option value="电子电气">电子电气</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="联系方式">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="contactPerson" label="联系人">
              <Input placeholder="请输入联系人姓名" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="contactPhone" label="联系电话">
              <Input placeholder="请输入11位手机号" size="large" maxLength={11} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="contactEmail" label="联系邮箱">
          <Input placeholder="选填，用于接收商机通知" size="large" />
        </Form.Item>
      </Card>

      <Card title="标签与附件">
        <Form.Item name="tags" label="商机标签" extra="最多添加5个标签">
          <Select mode="tags" placeholder="输入标签后按回车确认" maxCount={5} size="large" />
        </Form.Item>

        <Form.Item label="附件上传">
          <Dragger
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            maxCount={5}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持 PDF、Word、PNG、JPG 格式，最多 5 个文件</p>
          </Dragger>
        </Form.Item>
      </Card>
    </Space>
  );

  // 步骤3：发布设置
  const renderStep3 = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="发布前确认"
        description="请仔细核对信息，确认无误后提交。提交后将通知工作人员处理。"
        type="warning"
        showIcon
      />

      <Card title="发布设置">
        <Form.Item name="validityDays" label="有效期" extra="建议选择30天或60天">
          <Radio.Group size="large">
            <Space direction="vertical" size="middle">
              <Radio value={15}>15天（适合短期商机）</Radio>
              <Radio value={30}>30天（推荐）</Radio>
              <Radio value={60}>60天（适合长期合作）</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Divider />

        <Form.Item name="visibilityScope" label="可见范围">
          <Radio.Group size="large">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card hoverable>
                <Radio value="public">全平台公开（推荐）</Radio>
              </Card>
              <Card hoverable>
                <Radio value="industry">行业内可见</Radio>
              </Card>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Card>
    </Space>
  );

  // 成功页面
  const renderSuccessPage = () => (
    <Result
      icon={<SmileOutlined style={{ color: '#52c41a' }} />}
      title="已通知工作人员"
      subTitle="您的采购需求已提交成功，我们的工作人员将尽快与您联系。"
      extra={[
        <Button type="primary" size="large" key="back" onClick={() => navigate('/industry-hall/supply-demand')}>
          返回商机大厅
        </Button>,
        <Button size="large" key="new" onClick={() => {
          setSubmitted(false);
          setCurrentStep(0);
          form.resetFields();
          setSubType(undefined);
          setFileList([]);
        }}>
          继续发布
        </Button>,
      ]}
    >
      <div style={{ background: '#fafafa', padding: 24, borderRadius: 8 }}>
        <Paragraph>
          <Text strong>接下来会发生什么？</Text>
        </Paragraph>
        <Paragraph>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>工作人员将在1个工作日内审核您的需求</li>
            <li>审核通过后，您的需求将在平台展示</li>
            <li>我们会为您匹配合适的供应商</li>
            <li>您将收到相关通知和对接信息</li>
          </ul>
        </Paragraph>
        <Paragraph>
          <Text type="secondary">如有疑问，请联系客服：400-888-1234</Text>
        </Paragraph>
      </div>
    </Result>
  );

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = () => {
    try {
      const values = form.getFieldsValue();
      localStorage.setItem('publication_draft', JSON.stringify(values));
      message.success('草稿已保存');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const formData: NewPublicationForm = {
        ...values,
        type: 'demand',
        attachments: fileList.map((file) => file.originFileObj as File),
      };
      await createPublication(formData);
      setSubmitted(true);
      localStorage.removeItem('publication_draft');
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-container" style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
        {renderSuccessPage()}
      </div>
    );
  }

  return (
    <div className="page-container" style={{ background: '#f0f2f5', minHeight: '100vh', padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/industry-hall/supply-demand')}
              style={{ marginBottom: 12 }}
            >
              返回商机大厅
            </Button>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                发布采购需求
              </Title>
              <Text type="secondary">
                免费发布采购需求，快速对接优质供应商 | 已有 <Text strong style={{ color: '#1890ff' }}>12,567</Text> 家供应商入驻
              </Text>
            </div>
          </div>
          <Button onClick={handleSaveDraft}>保存草稿</Button>
        </div>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Steps 
          current={currentStep} 
          items={steps}
          style={{ maxWidth: 800, margin: '0 auto' }}
        />
      </Card>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'demand',
            validityDays: 30,
            visibilityScope: 'public',
          }}
        >
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}
        </Form>

        <Card style={{ marginTop: 24, position: 'sticky', bottom: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {currentStep === 0 && (
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                  第1步：选择您的采购需求类型
                </Text>
              )}
              {currentStep === 1 && (
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                  第2步：填写详细的采购需求信息（所有字段均为选填）
                </Text>
              )}
              {currentStep === 2 && (
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                  第3步：设置发布选项并提交
                </Text>
              )}
            </div>
            <Space size="middle">
              {currentStep > 0 && (
                <Button size="large" onClick={handlePrev}>
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" size="large" onClick={handleNext}>
                  下一步
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ minWidth: 120 }}
                >
                  提交发布
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewPublication;
