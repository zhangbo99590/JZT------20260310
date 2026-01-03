/**
 * AI辅助工具面板
 * 包含材料生成、进度跟踪、政策订阅等功能
 */

import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Steps,
  List,
  Tag,
  Space,
  Modal,
  message,
  Divider,
  Switch,
  Checkbox,
} from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  BellOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from '../AIPolicyCenter.module.css';
import {
  PolicyInfo,
  ApplicationProgress,
  PolicySubscription,
  MaterialGenerationRequest,
} from '../types';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface AIToolsPanelProps {
  selectedPolicy?: PolicyInfo;
  onGenerateMaterial: (request: MaterialGenerationRequest) => Promise<void>;
  onTrackProgress: (progress: ApplicationProgress) => void;
  onSubscribe: (subscription: PolicySubscription) => void;
}

const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  selectedPolicy,
  onGenerateMaterial,
  onTrackProgress,
  onSubscribe,
}) => {
  const [materialForm] = Form.useForm();
  const [progressForm] = Form.useForm();
  const [subscriptionForm] = Form.useForm();
  
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [generatingMaterial, setGeneratingMaterial] = useState(false);
  
  const [progressList, setProgressList] = useState<ApplicationProgress[]>([
    {
      id: '1',
      policyId: 'p1',
      policyTitle: '2024年北京市科技创新补贴',
      applicationNumber: 'BJ2024001',
      currentStage: '市复审',
      stages: [
        {
          name: '材料提交',
          status: 'completed',
          startDate: '2024-01-05',
          endDate: '2024-01-05',
        },
        {
          name: '区初审',
          status: 'completed',
          startDate: '2024-01-06',
          endDate: '2024-01-10',
        },
        {
          name: '市复审',
          status: 'in-progress',
          startDate: '2024-01-11',
        },
        {
          name: '结果公示',
          status: 'pending',
        },
      ],
      estimatedNextStageDate: '2024-01-20',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-11',
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<PolicySubscription[]>([
    {
      id: '1',
      name: '北京科技补贴政策',
      filters: {
        regions: ['北京市'],
        industries: ['软件和信息技术服务业'],
        categories: ['补贴'],
      },
      notificationMethods: ['system', 'sms'],
      active: true,
      createdAt: '2024-01-01',
    },
  ]);

  // 处理材料生成
  const handleGenerateMaterial = async () => {
    try {
      const values = await materialForm.validateFields();
      setGeneratingMaterial(true);

      const request: MaterialGenerationRequest = {
        policyId: selectedPolicy?.id || '',
        companyProfile: {} as any, // 从上下文获取
        materialType: values.materialType,
      };

      await onGenerateMaterial(request);
      message.success('材料生成成功，可下载编辑');
      setShowMaterialModal(false);
      materialForm.resetFields();
    } catch (error) {
      message.error('材料生成失败');
    } finally {
      setGeneratingMaterial(false);
    }
  };

  // 处理进度跟踪
  const handleAddProgress = async () => {
    try {
      const values = await progressForm.validateFields();
      
      const newProgress: ApplicationProgress = {
        id: Date.now().toString(),
        policyId: values.policyId,
        policyTitle: values.policyTitle,
        applicationNumber: values.applicationNumber,
        currentStage: '材料提交',
        stages: [
          {
            name: '材料提交',
            status: 'completed',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
          },
          {
            name: '初审',
            status: 'pending',
          },
          {
            name: '复审',
            status: 'pending',
          },
          {
            name: '结果公示',
            status: 'pending',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProgressList([...progressList, newProgress]);
      onTrackProgress(newProgress);
      message.success('申报进度跟踪已添加');
      setShowProgressModal(false);
      progressForm.resetFields();
    } catch (error) {
      console.error('添加进度跟踪失败:', error);
    }
  };

  // 处理订阅
  const handleAddSubscription = async () => {
    try {
      const values = await subscriptionForm.validateFields();
      
      const newSubscription: PolicySubscription = {
        id: Date.now().toString(),
        name: values.name,
        filters: {
          regions: values.regions,
          industries: values.industries,
          categories: values.categories,
        },
        notificationMethods: values.notificationMethods,
        active: true,
        createdAt: new Date().toISOString(),
      };

      setSubscriptions([...subscriptions, newSubscription]);
      onSubscribe(newSubscription);
      message.success('政策订阅已添加');
      setShowSubscriptionModal(false);
      subscriptionForm.resetFields();
    } catch (error) {
      console.error('添加订阅失败:', error);
    }
  };

  // 切换订阅状态
  const toggleSubscription = (id: string) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, active: !sub.active } : sub
      )
    );
  };

  // 删除订阅
  const deleteSubscription = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个订阅吗？',
      onOk: () => {
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
        message.success('订阅已删除');
      },
    });
  };

  return (
    <div className={styles.toolsArea}>
      {/* AI材料生成 */}
      <div className={styles.toolSection}>
        <div className={styles.toolTitle}>
          <FileTextOutlined />
          AI材料生成
        </div>
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          block
          onClick={() => setShowMaterialModal(true)}
          disabled={!selectedPolicy}
        >
          生成申报材料
        </Button>
        {!selectedPolicy && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            请先选择一个政策
          </div>
        )}
      </div>

      {/* AI进度跟踪 */}
      <div className={styles.toolSection}>
        <div className={styles.toolTitle}>
          <ClockCircleOutlined />
          AI进度跟踪
        </div>
        
        <Button
          icon={<PlusOutlined />}
          block
          onClick={() => setShowProgressModal(true)}
          style={{ marginBottom: 16 }}
        >
          添加申报项目
        </Button>

        {progressList.length > 0 ? (
          <div className={styles.progressTracker}>
            {progressList.map((progress) => (
              <div key={progress.id} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {progress.policyTitle}
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                  编号：{progress.applicationNumber}
                </div>
                
                <Steps
                  direction="vertical"
                  size="small"
                  current={progress.stages.findIndex((s) => s.status === 'in-progress')}
                >
                  {progress.stages.map((stage, idx) => (
                    <Step
                      key={idx}
                      title={stage.name}
                      status={
                        stage.status === 'completed'
                          ? 'finish'
                          : stage.status === 'in-progress'
                          ? 'process'
                          : stage.status === 'rejected'
                          ? 'error'
                          : 'wait'
                      }
                      description={
                        stage.endDate
                          ? `完成于 ${stage.endDate}`
                          : stage.startDate
                          ? `开始于 ${stage.startDate}`
                          : null
                      }
                    />
                  ))}
                </Steps>

                {progress.estimatedNextStageDate && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      background: '#e6f7ff',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    预计下一步：{progress.estimatedNextStageDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 20, color: '#8c8c8c' }}>
            暂无跟踪项目
          </div>
        )}
      </div>

      {/* AI政策订阅 */}
      <div className={styles.toolSection}>
        <div className={styles.toolTitle}>
          <BellOutlined />
          AI政策订阅
        </div>

        <Button
          icon={<PlusOutlined />}
          block
          onClick={() => setShowSubscriptionModal(true)}
          style={{ marginBottom: 16 }}
        >
          新增订阅
        </Button>

        {subscriptions.length > 0 ? (
          <List
            size="small"
            dataSource={subscriptions}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Switch
                    size="small"
                    checked={item.active}
                    onChange={() => toggleSubscription(item.id)}
                  />,
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteSubscription(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Space size={[0, 4]} wrap>
                      {item.filters.regions?.map((r) => (
                        <Tag key={r} size="small">
                          {r}
                        </Tag>
                      ))}
                      {item.filters.categories?.map((c) => (
                        <Tag key={c} size="small" color="blue">
                          {c}
                        </Tag>
                      ))}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 20, color: '#8c8c8c' }}>
            暂无订阅
          </div>
        )}
      </div>

      {/* 材料生成弹窗 */}
      <Modal
        title="AI生成申报材料"
        open={showMaterialModal}
        onCancel={() => setShowMaterialModal(false)}
        onOk={handleGenerateMaterial}
        confirmLoading={generatingMaterial}
      >
        <Form form={materialForm} layout="vertical">
          <Form.Item label="政策名称">
            <Input value={selectedPolicy?.title} disabled />
          </Form.Item>
          
          <Form.Item
            label="材料类型"
            name="materialType"
            rules={[{ required: true, message: '请选择材料类型' }]}
          >
            <Select placeholder="请选择要生成的材料类型">
              <Option value="qualification">企业资质说明</Option>
              <Option value="feasibility">项目可行性报告</Option>
              <Option value="financial">财务报表说明</Option>
              <Option value="innovation">创新能力证明</Option>
              <Option value="application">申报书</Option>
            </Select>
          </Form.Item>

          <div style={{ padding: 12, background: '#f5f7fa', borderRadius: 4, fontSize: 12 }}>
            💡 AI将基于您的企业画像自动生成材料草稿，生成后可在线编辑并导出为Word/PDF格式
          </div>
        </Form>
      </Modal>

      {/* 进度跟踪弹窗 */}
      <Modal
        title="添加申报项目跟踪"
        open={showProgressModal}
        onCancel={() => setShowProgressModal(false)}
        onOk={handleAddProgress}
      >
        <Form form={progressForm} layout="vertical">
          <Form.Item
            label="政策名称"
            name="policyTitle"
            rules={[{ required: true, message: '请输入政策名称' }]}
          >
            <Input placeholder="请输入政策名称" />
          </Form.Item>
          
          <Form.Item
            label="申报编号"
            name="applicationNumber"
            rules={[{ required: true, message: '请输入申报编号' }]}
          >
            <Input placeholder="请输入申报编号" />
          </Form.Item>

          <Form.Item name="policyId" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 订阅弹窗 */}
      <Modal
        title="新增政策订阅"
        open={showSubscriptionModal}
        onCancel={() => setShowSubscriptionModal(false)}
        onOk={handleAddSubscription}
        width={600}
      >
        <Form form={subscriptionForm} layout="vertical">
          <Form.Item
            label="订阅名称"
            name="name"
            rules={[{ required: true, message: '请输入订阅名称' }]}
          >
            <Input placeholder="如：北京科技补贴政策" />
          </Form.Item>

          <Form.Item label="地区" name="regions">
            <Select mode="multiple" placeholder="请选择地区">
              <Option value="北京市">北京市</Option>
              <Option value="上海市">上海市</Option>
              <Option value="广东省">广东省</Option>
              <Option value="浙江省">浙江省</Option>
            </Select>
          </Form.Item>

          <Form.Item label="行业" name="industries">
            <Select mode="multiple" placeholder="请选择行业">
              <Option value="软件和信息技术服务业">软件和信息技术服务业</Option>
              <Option value="互联网和相关服务">互联网和相关服务</Option>
              <Option value="生物医药">生物医药</Option>
            </Select>
          </Form.Item>

          <Form.Item label="政策类别" name="categories">
            <Select mode="multiple" placeholder="请选择政策类别">
              <Option value="补贴">补贴</Option>
              <Option value="资质认定">资质认定</Option>
              <Option value="培训扶持">培训扶持</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="通知方式"
            name="notificationMethods"
            rules={[{ required: true, message: '请选择通知方式' }]}
          >
            <Checkbox.Group>
              <Checkbox value="system">系统消息</Checkbox>
              <Checkbox value="sms">短信</Checkbox>
              <Checkbox value="email">邮件</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AIToolsPanel;
