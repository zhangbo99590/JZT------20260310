import React, { useState } from 'react';
import { Modal, Form, Input, Button, Result, Typography, message, Spin, Upload, Select, Row, Col } from 'antd';
import { SafetyCertificateOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { useCompanyProfileContext } from '../../../context/CompanyProfileContext';
import type { UploadFile, UploadProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface EnterpriseCertificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const EnterpriseCertificationModal: React.FC<EnterpriseCertificationModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { updateProfile } = useCompanyProfileContext();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [inviteCode, setInviteCode] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined style={{ fontSize: '32px', color: '#ccc' }} />
    </div>
  );

  const handleFinish = (values: any) => {
    setLoading(true);
    // Simulate API call for certification
    setTimeout(() => {
      const generatedCode = 'JZT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setInviteCode(generatedCode);
      
      // Update context profile to verified and set some basic info
      updateProfile({
        isVerified: true,
        companyName: values.companyName,
        creditCode: values.creditCode,
        legalPerson: values.legalPerson,
      } as any);

      setLoading(false);
      setStep('success');
      message.success('企业实名认证成功！');
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  const handleClose = () => {
    if (step === 'success') {
      // Reset state for next time (though it probably won't be opened again if verified)
      setTimeout(() => {
        setStep('form');
        form.resetFields();
      }, 300);
    }
    onCancel();
  };

  const navigate = useNavigate();

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    message.success('邀请码已复制到剪贴板');
  };

  return (
    <Modal
      title={step === 'form' ? (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>填写企业认证信息</Title>
        </div>
      ) : null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Spin spinning={loading}>
        {step === 'form' ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Text style={{ color: '#1890ff', fontSize: 14 }}>
                完成认证后可享受精准获取同行信息、智能匹配政策补贴以及案件进度可视化等权益。
              </Text>
            </div>
            
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              onFinish={handleFinish}
            >
              <Form.Item
                label={<span style={{ color: '#ff4d4f' }}>* 认证材料</span>}
                required={false}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  {/* 上传区域 */}
                  <div style={{ textAlign: 'center' }}>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={() => false} // 阻止默认上传
                      maxCount={1}
                      style={{ width: 140, height: 140 }}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                      上传营业执照 (正面照片)
                    </Text>
                  </div>

                  {/* 示例图 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: 140, 
                      height: 140, 
                      border: '1px solid #d9d9d9', 
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {/* 这里用一个占位的底纹或图标模拟营业执照 */}
                      <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', color: '#d9363e', fontWeight: 'bold' }}>营业执照</div>
                        <div style={{ position: 'absolute', top: '40%', left: '10%', fontSize: '10px', color: '#666', textAlign: 'left', lineHeight: '1.5' }}>
                          名 称 xxxxxxxxxxxxx<br/>
                          类 型 xxxxx<br/>
                          法定代表人 xxxxxxx<br/>
                          经营范围 xxxxxxxxxxxxxxxx
                        </div>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>示例图</Text>
                  </div>

                  {/* 提示信息 */}
                  <div style={{ 
                    flex: 1, 
                    backgroundColor: '#f0f5ff', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #d6e4ff'
                  }}>
                    <Text style={{ color: '#597ef7', fontSize: 13, lineHeight: 1.6, display: 'block' }}>
                      照片或扫描件，企业名称必须与您填写的企业名称一致；图片文字需清晰可见，内容真实有效，不得做任何修改。支持JPG\JPEG\PNG格式，大小不超过5M。
                    </Text>
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                label="企业名称"
                name="companyName"
                rules={[{ required: true, message: '请输入企业名称' }]}
              >
                <Input placeholder="请输入营业执照上的全称" size="large" />
              </Form.Item>

              <Form.Item
                label="统一信用代码"
                name="creditCode"
                rules={[
                  { required: true, message: '请输入统一社会信用代码' },
                  { pattern: /^[0-9A-Z]{18}$/, message: '请输入18位正确的信用代码' }
                ]}
              >
                <Input placeholder="请输入18位统一信用代码" size="large" maxLength={18} />
              </Form.Item>

              <Form.Item
                label="法人姓名"
                name="legalPerson"
                rules={[{ required: true, message: '请输入法定代表人姓名' }]}
              >
                <Input placeholder="请输入法人姓名" size="large" />
              </Form.Item>

              <Form.Item
                label="所在地区"
                name="region"
                rules={[{ required: true, message: '请选择所在地区' }]}
              >
                <Select placeholder="请选择" size="large">
                  <Select.Option value="beijing">北京市</Select.Option>
                  <Select.Option value="shanghai">上海市</Select.Option>
                  <Select.Option value="guangdong">广东省</Select.Option>
                  <Select.Option value="shenzhen">深圳市</Select.Option>
                  <Select.Option value="hangzhou">杭州市</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 5, span: 19 }} style={{ marginTop: 32, marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" size="large" block style={{ height: '48px', fontSize: '16px' }}>
                  提交认证
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <Result
            status="success"
            title="认证成功，您已成为超级管理员"
            subTitle="系统已为您生成专属企业邀请码，可发送给企业员工用于注册和加入平台。"
            extra={[
              <div key="code" style={{ 
                background: '#f5f5f5', 
                padding: '24px', 
                borderRadius: '8px', 
                marginTop: '16px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>企业专属邀请码</Text>
                <Title level={2} style={{ margin: 0, color: '#1890ff', letterSpacing: '2px' }}>
                  {inviteCode}
                </Title>
                <Button 
                  type="link" 
                  icon={<CopyOutlined />} 
                  onClick={copyInviteCode}
                  style={{ marginTop: 16 }}
                >
                  复制邀请码
                </Button>
              </div>,
              <Button type="primary" key="console" size="large" onClick={() => navigate('/system')} block>
                进入系统管理工作台
              </Button>
            ]}
          />
        )}
      </Spin>
    </Modal>
  );
};
