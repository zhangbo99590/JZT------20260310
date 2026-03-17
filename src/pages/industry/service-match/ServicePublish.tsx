import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Upload,
  Space,
  Typography,
  message,
  Divider,
  Modal,
  DatePicker,
  Switch,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { THEME, COMMON_STYLES } from "./styles";
import {
  createPublication,
  getPublicationById,
  updatePublication,
} from "../../../services/industryService";
import type { NewPublicationForm } from "../../../types/industry";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

type ScenarioType = "supply" | "demand";

const ServicePublish: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const id = searchParams.get("id");

  // Initialize from query param or default to 'supply'
  const [scenarioType, setScenarioType] = useState<ScenarioType>(
    (searchParams.get("type") as ScenarioType) || "supply",
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Mock Enterprise Info
  const enterpriseName = "杭州智通科技有限公司";
  const enterpriseRegion = "浙江省杭州市滨江区";

  // Load data if editing
  React.useEffect(() => {
    if (id) {
      setDataLoading(true);
      getPublicationById(id)
        .then((data) => {
          setScenarioType(data.type as ScenarioType);
          form.setFieldsValue({
            title: data.title,
            description: data.description,
            supplyType: data.subType, // This assumes supply subType matches form field
            visibility: data.visibilityScope === "industry", // Map 'industry' to true (仅匹配可见)
            category: data.industry,
            ...data.details,
          });
          // Handle specific scenario type setting if needed
        })
        .catch((err) => {
          message.error("加载数据失败");
          navigate("/industry/service-match/my-services");
        })
        .finally(() => {
          setDataLoading(false);
        });
    }
  }, [id, form, navigate]);

  const onScenarioChange = (e: any) => {
    setScenarioType(e.target.value);
    // Reset fields when switching scenario
    form.resetFields([
      "category",
      "title",
      "description",
      "supplyType",
      "spec",
      "priceRange",
      "coopMode",
      "procurementCategory",
      "quantity",
      "budget",
      "deadline",
      "inventory",
      "serviceCycle",
      "deliveryMode",
      "resourceType",
      "availableTime",
    ]);
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList.slice(0, 3)); // Limit to 3
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const pubData: any = {
        title: values.title,
        type: scenarioType,
        subType: scenarioType === "supply" ? values.supplyType : "purchase",
        description: values.description,
        details: {
          ...values,
          quantity: values.quantity,
          budget: values.budget,
        },
        validityDays: 30,
        visibilityScope: values.visibility ? "industry" : "public",
        tags: [values.category || values.procurementCategory || "其他"],
        region: enterpriseRegion,
        industry: values.category || "通用",
        attachments: [],
      };

      if (id) {
        await updatePublication(id, pubData);
        message.success({
          content: "更新成功，即将跳转至我的信息页",
          duration: 3,
        });
      } else {
        await createPublication(pubData as NewPublicationForm);
        message.success({
          content: "提交成功，即将跳转至我的信息页",
          duration: 3,
        });
      }

      navigate("/industry/service-match/my-services");
    } catch (error) {
      console.error(error);
      message.error(id ? "更新失败" : "发布失败");
    } finally {
      setLoading(false);
    }
  };

  const onSaveDraft = () => {
    message.success("已保存到草稿箱");
    navigate("/industry/service-match/my-services");
  };

  const handleQuickAdd = (type: string) => {
    message.info(`已切换至 ${type} 发布表单`);
    // Logic to switch form type would go here
  };

  const renderScenarioSpecificFields = () => {
    if (scenarioType === "supply") {
      return (
        <>
          <Form.Item
            label="供给类型"
            name="supplyType"
            rules={[{ required: true, message: "请选择供给类型" }]}
            tooltip="请选择您提供的业务类型，系统将自动匹配相关字段"
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="product" style={{ color: "#1890ff" }}>
                产品
              </Radio.Button>
              <Radio.Button value="service" style={{ color: "#52c41a" }}>
                服务
              </Radio.Button>
              <Radio.Button value="resource" style={{ color: "#fa8c16" }}>
                资源
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.supplyType !== curr.supplyType}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue("supplyType");

              if (!type) return null;

              return (
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "16px",
                    borderRadius: "4px",
                    marginBottom: "24px",
                  }}
                >
                  {type === "product" && (
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="规格/属性"
                          name="spec"
                          rules={[{ required: true, message: "请输入规格" }]}
                          tooltip="如：500g/盒，S/M/L"
                        >
                          <Input placeholder="请输入规格属性" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="报价区间"
                          name="priceRange"
                          rules={[{ required: true, message: "请输入报价" }]}
                          tooltip="如：100-200元/件"
                        >
                          <Input placeholder="请输入报价区间" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="库存数量"
                          name="inventory"
                          rules={[{ required: true, message: "请输入库存" }]}
                        >
                          <Input placeholder="请输入当前库存量" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  {type === "service" && (
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="服务周期"
                          name="serviceCycle"
                          rules={[{ required: true, message: "请输入周期" }]}
                          tooltip="如：1年，3个月"
                        >
                          <Input placeholder="请输入服务周期" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="交付方式"
                          name="deliveryMode"
                          rules={[
                            { required: true, message: "请选择交付方式" },
                          ]}
                        >
                          <Select placeholder="请选择">
                            <Option value="online">线上交付</Option>
                            <Option value="offline">线下交付</Option>
                            <Option value="hybrid">混合交付</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="服务价格"
                          name="priceRange"
                          rules={[{ required: true, message: "请输入价格" }]}
                        >
                          <Input placeholder="请输入服务价格" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  {type === "resource" && (
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="资源类型"
                          name="resourceType"
                          rules={[{ required: true, message: "请输入类型" }]}
                        >
                          <Input placeholder="如：厂房、设备、数据" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="可用时间"
                          name="availableTime"
                          rules={[{ required: true, message: "请选择时间" }]}
                        >
                          <DatePicker.RangePicker style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="合作模式"
                          name="coopMode"
                          rules={[{ required: true, message: "请选择模式" }]}
                        >
                          <Select placeholder="请选择">
                            <Option value="rent">租赁</Option>
                            <Option value="share">共享</Option>
                            <Option value="exchange">置换</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              );
            }}
          </Form.Item>
        </>
      );
    } else {
      // Demand Scenario
      return (
        <div
          style={{
            background: "#f9f9f9",
            padding: "16px",
            borderRadius: "4px",
            marginBottom: "24px",
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="采购品类"
                name="procurementCategory"
                rules={[{ required: true, message: "请选择采购品类" }]}
              >
                <Select placeholder="请选择">
                  <Option value="hardware">硬件设备</Option>
                  <Option value="software">软件系统</Option>
                  <Option value="rawMaterial">原材料</Option>
                  <Option value="service">专业服务</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="采购数量"
                name="quantity"
                rules={[{ required: true, message: "请输入采购数量" }]}
              >
                <Input placeholder="如：100台，5套" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="采购预算"
                name="budget"
                rules={[{ required: true, message: "请输入采购预算" }]}
              >
                <Input placeholder="如：50万以内" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="截止日期"
                name="deadline"
                rules={[{ required: true, message: "请选择截止日期" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }
  };

  return (
    <div style={COMMON_STYLES.pageContainer}>
      <Space direction="vertical" style={{ width: "100%" }} size={24}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            style={{ marginRight: "8px" }}
          />
          <Title level={4} style={{ margin: 0, ...COMMON_STYLES.title }}>
            {id ? "编辑信息" : "发布信息"}
          </Title>
        </div>

        {/* Top Scenario Switch & Quick Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              background: "#f0f0f0",
              borderRadius: "30px",
              padding: "4px",
              display: "inline-flex",
            }}
          >
            <div
              onClick={() => onScenarioChange({ target: { value: "supply" } })}
              style={{
                padding: "6px 24px",
                borderRadius: "24px",
                cursor: "pointer",
                background:
                  scenarioType === "supply" ? THEME.primary : "transparent",
                color: scenarioType === "supply" ? "#fff" : "#666",
                fontWeight: scenarioType === "supply" ? 500 : 400,
                transition: "all 0.3s",
              }}
            >
              业务供给
            </div>
            <div
              onClick={() => onScenarioChange({ target: { value: "demand" } })}
              style={{
                padding: "6px 24px",
                borderRadius: "24px",
                cursor: "pointer",
                background:
                  scenarioType === "demand" ? THEME.primary : "transparent",
                color: scenarioType === "demand" ? "#fff" : "#666",
                fontWeight: scenarioType === "demand" ? 500 : 400,
                transition: "all 0.3s",
              }}
            >
              采购需求
            </div>
          </div>

          <Select
            placeholder="+ 新增发布事项"
            style={{ width: 160 }}
            bordered={false}
            onChange={handleQuickAdd}
            suffixIcon={<PlusOutlined />}
          >
            <Option value="policy">政策申报</Option>
            <Option value="finance">融资需求</Option>
            <Option value="talent">人才招聘</Option>
          </Select>
        </div>

        {/* Form Area */}
        <div style={COMMON_STYLES.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ visibility: true, supplyType: "product" }}
            requiredMark={true}
            validateTrigger="onBlur"
          >
            {/* 1. Basic Info */}
            <Title
              level={5}
              style={{
                fontSize: "16px",
                marginBottom: "24px",
                borderLeft: `4px solid ${THEME.primary}`,
                paddingLeft: "12px",
              }}
            >
              基础信息
            </Title>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="企业名称"
                  required
                  tooltip="系统自动拉取，不可修改"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: "#f5f5f5",
                      padding: "5px 11px",
                      border: "1px solid #d9d9d9",
                      borderRadius: "2px",
                    }}
                  >
                    <span style={{ color: "#999" }}>{enterpriseName}</span>
                    <a
                      onClick={() => message.info("跳转至企业中心")}
                      style={{ fontSize: "12px" }}
                    >
                      前往企业中心 &gt;
                    </a>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所在地区"
                  required
                  tooltip="系统自动拉取，不可修改"
                >
                  <Input
                    value={enterpriseRegion}
                    disabled
                    style={{ color: "#999", background: "#f5f5f5" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="主营品类"
              name="category"
              rules={[{ required: true, message: "请选择主营品类" }]}
            >
              <Select showSearch placeholder="输入关键词自动匹配品类库">
                <Option value="software">软件开发</Option>
                <Option value="legal">法律咨询</Option>
                <Option value="marketing">市场营销</Option>
                <Option value="hr">人力资源</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="信息标题"
              name="title"
              rules={[
                { required: true, message: "请输入信息标题" },
                { max: 50, message: "标题最多50字" },
              ]}
              tooltip="简明扼要描述核心内容，50字以内"
            >
              <Input placeholder="请输入标题" count={{ show: true, max: 50 }} />
            </Form.Item>

            <Divider dashed />

            {/* 2. Core Info */}
            <Title
              level={5}
              style={{
                fontSize: "16px",
                marginBottom: "24px",
                borderLeft: `4px solid ${THEME.primary}`,
                paddingLeft: "12px",
              }}
            >
              {scenarioType === "supply" ? "供给详情" : "需求详情"}
            </Title>

            {renderScenarioSpecificFields()}

            <Form.Item
              label="核心介绍"
              name="description"
              rules={[{ max: 500, message: "介绍最多500字" }]}
            >
              <TextArea
                placeholder="详细描述产品/服务优势，选填"
                rows={4}
                count={{ show: true, max: 500 }}
              />
            </Form.Item>

            <Divider dashed />

            {/* 3. Supplementary Info */}
            <Title
              level={5}
              style={{
                fontSize: "16px",
                marginBottom: "24px",
                borderLeft: `4px solid ${THEME.primary}`,
                paddingLeft: "12px",
              }}
            >
              补充信息
            </Title>

            <Form.Item label="相关图片/文档">
              <Dragger
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Manual upload
                maxCount={3}
                onRemove={(file) => {
                  setFileList((prev) =>
                    prev.filter((item) => item.uid !== file.uid),
                  );
                }}
                style={{ padding: "20px" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持jpg/png/pdf，最多3张，单文件≤20M
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  展示权限
                  <Tooltip title="仅匹配客户可见：仅向高匹配度企业展示，保护您的信息隐私">
                    <InfoCircleOutlined style={{ color: "#999" }} />
                  </Tooltip>
                </Space>
              }
              name="visibility"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="仅匹配客户可见"
                unCheckedChildren="公开可见"
                defaultChecked
              />
            </Form.Item>

            <Divider />

            {/* 4. Bottom Actions */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <Button
                size="large"
                onClick={onSaveDraft}
                style={{ width: "160px" }}
              >
                保存草稿
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                style={{ width: "160px", background: THEME.primary }}
              >
                {loading ? "提交中..." : id ? "保存修改" : "提交发布"}
              </Button>
            </div>
          </Form>
        </div>
      </Space>
    </div>
  );
};

export default ServicePublish;
