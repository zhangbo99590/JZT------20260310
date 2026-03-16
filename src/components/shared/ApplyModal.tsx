/**
 * 共享申请弹窗组件
 * 创建时间: 2026-03-02
 * 用途: 统一的融资申请弹窗，避免重复代码
 */

import React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { generateApplicationId } from "../../utils/commonUtils";
import { saveApplicationData } from "../../utils/applicationStorage";

// 通用的融资选项类型
export interface FinancingOption {
  id: string;
  name: string;
  [key: string]: any;
}

// 资金用途选项
const PURPOSE_OPTIONS = [
  { value: "working_capital", label: "流动资金" },
  { value: "equipment", label: "设备采购" },
  { value: "expansion", label: "业务扩张" },
  { value: "inventory", label: "库存采购" },
  { value: "other", label: "其他" },
];

interface ApplyModalProps {
  visible: boolean;
  option: FinancingOption | null;
  onClose: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({
  visible,
  option,
  onClose,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 生成申请数据
      const applicationData = {
        ...values,
        amount: values.amount || 0,
        purpose: values.purpose || "other",
        applicationId: generateApplicationId(),
        submitTime: new Date().toLocaleString(),
        productName: option?.name || "融资产品",
      };

      // 保存申请数据
      saveApplicationData(applicationData.applicationId, applicationData);

      message.success("申请提交成功，正在跳转...");
      onClose();
      form.resetFields();

      // 跳转到申请成功页面
      setTimeout(() => {
        navigate("/supply-chain-finance/application-success", {
          state: { applicationData },
        });
      }, 1000);
    } catch {
      message.error("请完善申请信息");
    }
  };

  return (
    <Modal
      title={`申请 ${option?.name || "融资产品"}`}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      width={600}
      okText="提交申请"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="企业名称"
              name="companyName"
              rules={[{ required: true, message: "请输入企业名称" }]}
            >
              <Input placeholder="请输入企业名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系人"
              name="contactPerson"
              rules={[{ required: true, message: "请输入联系人" }]}
            >
              <Input placeholder="请输入联系人姓名" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[
                { required: true, message: "请输入联系电话" },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: "请输入有效的中国大陆手机号",
                },
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="申请金额" name="amount">
              <InputNumber
                placeholder="请输入申请金额（选填）"
                addonAfter="万元"
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="资金用途" name="purpose">
          <Select placeholder="请选择资金用途（选填）">
            {PURPOSE_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="备注说明" name="remarks">
          <Input.TextArea
            rows={3}
            placeholder="请简要说明您的融资需求和企业情况"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplyModal;
