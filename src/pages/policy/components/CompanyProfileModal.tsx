/**
 * 企业画像管理弹窗
 * 用于绑定和管理企业信息
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Tag,
  message,
  Divider,
} from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { CompanyProfile } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface CompanyProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profile: CompanyProfile) => void;
  initialProfile?: CompanyProfile;
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [form] = Form.useForm();
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [inputQualification, setInputQualification] = useState('');

  useEffect(() => {
    if (visible && initialProfile) {
      form.setFieldsValue(initialProfile);
      setQualifications(initialProfile.qualifications || []);
    } else if (visible) {
      form.resetFields();
      setQualifications([]);
    }
  }, [visible, initialProfile, form]);

  const handleAddQualification = () => {
    if (inputQualification && !qualifications.includes(inputQualification)) {
      setQualifications([...qualifications, inputQualification]);
      setInputQualification('');
    }
  };

  const handleRemoveQualification = (qual: string) => {
    setQualifications(qualifications.filter((q) => q !== qual));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const profile: CompanyProfile = {
        ...values,
        qualifications,
        updatedAt: new Date().toISOString(),
      };

      if (!initialProfile) {
        profile.id = Date.now().toString();
        profile.createdAt = new Date().toISOString();
      } else {
        profile.id = initialProfile.id;
        profile.createdAt = initialProfile.createdAt;
      }

      onSave(profile);
      message.success('企业信息保存成功');
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 常用资质选项
  const commonQualifications = [
    '高新技术企业',
    '专精特新企业',
    '科技型中小企业',
    '瞪羚企业',
    '独角兽企业',
    '小巨人企业',
    'ISO9001认证',
    'ISO14001认证',
    '知识产权贯标企业',
  ];

  return (
    <Modal
      title={
        <Space>
          <BankOutlined />
          {initialProfile ? '编辑企业画像' : '绑定企业信息'}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="professional-form"
      >
        <Form.Item
          label={
            <Space>
              <BankOutlined />
              企业名称
            </Space>
          }
          name="name"
          rules={[{ required: true, message: '请输入企业名称' }]}
        >
          <Input placeholder="请输入企业全称" size="large" />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <EnvironmentOutlined />
              所在地区
            </Space>
          }
          name="region"
          rules={[{ required: true, message: '请选择所在地区' }]}
        >
          <Select placeholder="请选择所在地区" size="large">
            <Option value="北京市">北京市</Option>
            <Option value="上海市">上海市</Option>
            <Option value="广东省">广东省</Option>
            <Option value="浙江省">浙江省</Option>
            <Option value="江苏省">江苏省</Option>
            <Option value="四川省">四川省</Option>
            <Option value="湖北省">湖北省</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="所属行业"
          name="industry"
          rules={[{ required: true, message: '请选择所属行业' }]}
        >
          <Select placeholder="请选择所属行业" size="large">
            <Option value="软件和信息技术服务业">软件和信息技术服务业</Option>
            <Option value="互联网和相关服务">互联网和相关服务</Option>
            <Option value="电子信息制造业">电子信息制造业</Option>
            <Option value="生物医药">生物医药</Option>
            <Option value="新能源">新能源</Option>
            <Option value="新材料">新材料</Option>
            <Option value="高端装备制造">高端装备制造</Option>
            <Option value="节能环保">节能环保</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="企业规模"
          name="scale"
          rules={[{ required: true, message: '请选择企业规模' }]}
        >
          <Select placeholder="请选择企业规模" size="large">
            <Option value="large">大型企业</Option>
            <Option value="medium">中型企业</Option>
            <Option value="small">小型企业</Option>
            <Option value="micro">微型企业</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <DollarOutlined />
              注册资本（万元）
            </Space>
          }
          name="registeredCapital"
        >
          <InputNumber
            placeholder="请输入注册资本"
            style={{ width: '100%' }}
            size="large"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <TeamOutlined />
              员工人数
            </Space>
          }
          name="employeeCount"
        >
          <InputNumber
            placeholder="请输入员工人数"
            style={{ width: '100%' }}
            size="large"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <DollarOutlined />
              年营收（万元）
            </Space>
          }
          name="annualRevenue"
        >
          <InputNumber
            placeholder="请输入年营收"
            style={{ width: '100%' }}
            size="large"
            min={0}
          />
        </Form.Item>

        <Divider />

        <Form.Item
          label={
            <Space>
              <SafetyCertificateOutlined />
              企业资质认证
            </Space>
          }
        >
          <div style={{ marginBottom: 12 }}>
            <Space wrap>
              {qualifications.map((qual) => (
                <Tag
                  key={qual}
                  closable
                  onClose={() => handleRemoveQualification(qual)}
                  color="blue"
                >
                  {qual}
                </Tag>
              ))}
            </Space>
          </div>

          <Space.Compact style={{ width: '100%' }}>
            <Select
              placeholder="选择常用资质"
              value={inputQualification}
              onChange={setInputQualification}
              style={{ width: '70%' }}
              size="large"
              showSearch
              allowClear
            >
              {commonQualifications
                .filter((q) => !qualifications.includes(q))
                .map((qual) => (
                  <Option key={qual} value={qual}>
                    {qual}
                  </Option>
                ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddQualification}
              size="large"
              disabled={!inputQualification}
            >
              添加
            </Button>
          </Space.Compact>

          <div style={{ marginTop: 8 }}>
            <Input
              placeholder="或输入自定义资质"
              value={inputQualification}
              onChange={(e) => setInputQualification(e.target.value)}
              onPressEnter={handleAddQualification}
              size="large"
            />
          </div>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 16, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
        <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.6 }}>
          <div>💡 提示：</div>
          <div>• 完善的企业信息有助于AI更精准地为您推荐适配的政策</div>
          <div>• 您可以随时编辑和更新企业信息</div>
          <div>• 企业信息仅用于政策匹配，我们会严格保护您的隐私</div>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyProfileModal;
