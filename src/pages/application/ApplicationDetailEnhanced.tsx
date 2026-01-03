import React, { useState, useEffect } from 'react';
import { 
  Card, Descriptions, Timeline, Steps, Button, Space, Typography, Tag, 
  Divider, Row, Col, List, Modal, Image, Tabs, Alert, Progress, Badge, Tooltip, Breadcrumb, Upload, message, Empty, Spin
} from 'antd';
import { 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
  FolderOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileZipOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  AuditOutlined,
  HistoryOutlined,
  CloudDownloadOutlined,
  HomeOutlined,
  UploadOutlined,
  RocketOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { myApplicationService, ApplicationProject } from '../../services/myApplicationService';
import PageWrapper from '../../components/PageWrapper';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface MaterialFile {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadTime: string;
  uploader: string;
  status: 'approved' | 'pending' | 'rejected' | 'need_replace';
  version?: string;
  isSupplementVersion?: boolean;
  fileUrl: string;
  thumbnail?: string;
}

interface ProgressNode {
  id: string;
  nodeName: string;
  status: 'completed' | 'processing' | 'pending';
  processTime?: string;
  reviewer?: string;
  opinion?: string;
  duration?: string;
}

const ApplicationDetailEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<MaterialFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ApplicationProject | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 加载项目数据
  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) {
        message.error('项目ID不存在');
        navigate('/policy-center/my-applications');
        return;
      }

      setLoading(true);
      try {
        const project = myApplicationService.getProjectById(id);
        if (project) {
          setProjectData(project);
        } else {
          message.error('项目不存在');
          navigate('/policy-center/my-applications');
        }
      } catch (error) {
        message.error('加载项目数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id, navigate]);

  // 获取项目状态
  const getProjectStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    return statusParam || projectData?.status || 'reviewing';
  };

  const currentStatus = getProjectStatus();

  // 获取项目详细数据
  const getProjectDetail = () => {
    if (!projectData) return null;
    
    return {
      ...projectData,
      currentStatus: currentStatus,
      currentNode: currentStatus === 'rejected' ? '已驳回' : 
                   currentStatus === 'reviewing' ? projectData.currentNode || '审核中' :
                   currentStatus === 'approved' ? '已通过' :
                   currentStatus === 'supplement' ? '需补正' :
                   currentStatus === 'draft' ? '待提交' : '审核中',
      rejectionReason: currentStatus === 'rejected' ? '经审核，您的申报材料存在以下问题：\n1. 营业执照副本不清晰，无法辨认关键信息\n2. 缺少相关业务合同的完整版本\n3. 财务报表数据与申报信息不符，需重新提供' : '',
      rejectionDate: currentStatus === 'rejected' ? '2024-03-18' : '',
      reviewer: currentStatus === 'rejected' ? '市科技局审核组' : '',
      supplementMaterials: currentStatus === 'supplement' ? [
        { name: '营业执照', uploaded: false, uploadTime: '' },
        { name: '合同', uploaded: false, uploadTime: '' },
        { name: '财务报表', uploaded: false, uploadTime: '' }
      ] : [],
      policyBasis: '《高新技术企业认定管理办法》（国科发火〔2016〕32号）',
      company: '深圳市创新科技有限公司',
      
      // 基础信息
      basicInfo: {
        companyName: '深圳市创新科技有限公司',
        creditCode: '91440300MA5XXXXX1X',
        legalPerson: '张三',
        registeredCapital: '1000万元',
        registrationDate: '2020-03-15',
        address: '深圳市南山区科技园南区高新南七道16号',
        industry: '软件和信息技术服务业',
        employeeCount: 85,
        rdPersonnel: 32
      },
      
      // 核心指标
      coreIndicators: {
        annualRevenue: '5000万元',
        rdExpense: '260万元',
        rdExpenseRatio: '5.2%',
        rdPersonnelRatio: '37.6%',
        ipCount: 8,
        inventionPatents: 3,
        utilityModels: 5,
        techTransformations: 12
      },
      
      // 资质信息
      qualifications: [
        { name: 'ISO9001质量管理体系认证', certNo: 'ISO9001-2024-001', validUntil: '2027-03-01' },
        { name: 'ISO27001信息安全管理体系认证', certNo: 'ISO27001-2023-088', validUntil: '2026-12-31' },
        { name: '软件企业认定证书', certNo: 'RQ-2023-0156', validUntil: '2028-06-30' }
      ]
    };
  };

  const projectDetail = getProjectDetail();

  // 进度轨迹
  const progressNodes: ProgressNode[] = [
    {
      id: '1',
      nodeName: '草稿创建',
      status: 'completed',
      processTime: '2024-02-25 10:30:00',
      reviewer: '张三',
      opinion: '创建申报草稿',
      duration: '-'
    },
    {
      id: '2',
      nodeName: '提交申报',
      status: 'completed',
      processTime: '2024-03-01 14:20:00',
      reviewer: '张三',
      opinion: '正式提交申报材料',
      duration: '4天'
    },
    {
      id: '3',
      nodeName: '区科技局初审',
      status: 'completed',
      processTime: '2024-03-05 09:15:00',
      reviewer: '李审核员',
      opinion: '材料齐全，符合申报条件，建议通过初审',
      duration: '4天'
    },
    {
      id: '4',
      nodeName: '市科技局复审',
      status: 'processing',
      processTime: '2024-03-10 11:00:00',
      reviewer: '王复审员',
      opinion: '正在进行专家评审',
      duration: '进行中（已5天）'
    },
    {
      id: '5',
      nodeName: '结果公示',
      status: 'pending',
      processTime: '-',
      reviewer: '-',
      opinion: '待复审完成后公示',
      duration: '-'
    },
    {
      id: '6',
      nodeName: '认定完成',
      status: 'pending',
      processTime: '-',
      reviewer: '-',
      opinion: '待公示期结束后颁发证书',
      duration: '-'
    }
  ];

  // 申报材料
  const materials: MaterialFile[] = [
    {
      id: 'M001',
      name: '高新技术企业认定申请书.pdf',
      type: 'pdf',
      category: '资质证明类',
      uploadTime: '2024-02-28 15:30:00',
      uploader: '张三',
      status: 'approved',
      fileUrl: '/files/application.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/1890ff/ffffff?text=申请书'
    },
    {
      id: 'M002',
      name: '企业营业执照副本.pdf',
      type: 'pdf',
      category: '资质证明类',
      uploadTime: '2024-02-28 15:35:00',
      uploader: '张三',
      status: 'approved',
      fileUrl: '/files/license.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/52c41a/ffffff?text=营业执照'
    },
    {
      id: 'M003',
      name: '2023年度财务审计报告.pdf',
      type: 'pdf',
      category: '财务报表类',
      uploadTime: '2024-02-28 16:00:00',
      uploader: '李四',
      status: 'approved',
      fileUrl: '/files/audit_2023.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/faad14/ffffff?text=2023审计'
    },
    {
      id: 'M004',
      name: '2022年度财务审计报告.pdf',
      type: 'pdf',
      category: '财务报表类',
      uploadTime: '2024-02-28 16:05:00',
      uploader: '李四',
      status: 'approved',
      fileUrl: '/files/audit_2022.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/faad14/ffffff?text=2022审计'
    },
    {
      id: 'M005',
      name: '2021年度财务审计报告.pdf',
      type: 'pdf',
      category: '财务报表类',
      uploadTime: '2024-02-28 16:10:00',
      uploader: '李四',
      status: 'approved',
      fileUrl: '/files/audit_2021.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/faad14/ffffff?text=2021审计'
    },
    {
      id: 'M006',
      name: '发明专利证书汇总.pdf',
      type: 'pdf',
      category: '项目材料类',
      uploadTime: '2024-02-29 10:00:00',
      uploader: '王五',
      status: 'approved',
      fileUrl: '/files/patents.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/722ed1/ffffff?text=专利证书'
    },
    {
      id: 'M007',
      name: '研发项目立项报告.docx',
      type: 'word',
      category: '项目材料类',
      uploadTime: '2024-02-29 11:00:00',
      uploader: '王五',
      status: 'approved',
      fileUrl: '/files/rd_projects.docx',
      thumbnail: 'https://via.placeholder.com/200x280/13c2c2/ffffff?text=研发项目'
    },
    {
      id: 'M008',
      name: '科技成果转化证明材料.pdf',
      type: 'pdf',
      category: '项目材料类',
      uploadTime: '2024-02-29 14:00:00',
      uploader: '赵六',
      status: 'approved',
      fileUrl: '/files/tech_transformation.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/eb2f96/ffffff?text=成果转化'
    },
    {
      id: 'M009',
      name: '研发费用明细表.xlsx',
      type: 'excel',
      category: '财务报表类',
      uploadTime: '2024-03-01 09:00:00',
      uploader: '李四',
      status: 'approved',
      fileUrl: '/files/rd_expense.xlsx',
      thumbnail: 'https://via.placeholder.com/200x280/52c41a/ffffff?text=研发费用'
    }
  ];

  // 按分类分组材料
  const materialsByCategory = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as { [key: string]: MaterialFile[] });

  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />;
      case 'word': return <FileWordOutlined style={{ fontSize: 48, color: '#1890ff' }} />;
      case 'excel': return <FileExcelOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      case 'image': return <FileImageOutlined style={{ fontSize: 48, color: '#faad14' }} />;
      case 'zip': return <FileZipOutlined style={{ fontSize: 48, color: '#722ed1' }} />;
      default: return <FileTextOutlined style={{ fontSize: 48, color: '#8c8c8c' }} />;
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      approved: { color: 'success', text: '已通过' },
      pending: { color: 'processing', text: '审核中' },
      rejected: { color: 'error', text: '已驳回' },
      need_replace: { color: 'warning', text: '需替换' }
    };
    const config = statusMap[status] || statusMap.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 预览文件
  const handlePreview = (file: MaterialFile) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  // 下载文件
  const handleDownload = async (file: MaterialFile) => {
    try {
      const blob = await myApplicationService.downloadMaterial(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('文件下载成功');
    } catch (error) {
      message.error('文件下载失败');
    }
  };

  // 批量下载
  const handleBatchDownload = async () => {
    if (!projectData) return;
    try {
      const blob = await myApplicationService.downloadAllMaterials(projectData.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.name}_申报材料.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('批量下载成功');
    } catch (error) {
      message.error('批量下载失败');
    }
  };

  // 处理编辑
  const handleEdit = () => {
    if (projectData) {
      navigate(`/policy-center/application-management/apply/${projectData.id}`);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!projectData) return;
    
    Modal.confirm({
      title: '确认提交',
      content: '确认提交此申报项目？提交后将进入审核流程。',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await myApplicationService.submitApplication(projectData.id);
          if (result.success) {
            message.success(result.message);
            // 重新加载数据
            const updatedProject = myApplicationService.getProjectById(projectData.id);
            if (updatedProject) {
              setProjectData(updatedProject);
            }
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('提交失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // 处理补正材料上传
  const handleSupplementUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件');
      return;
    }

    setUploading(true);
    try {
      for (const file of fileList) {
        if (file.originFileObj && projectData) {
          await myApplicationService.supplementMaterial(
            projectData.id,
            file.originFileObj,
            '补正材料'
          );
        }
      }
      message.success('材料上传成功');
      setUploadModalVisible(false);
      setFileList([]);
      // 重新加载数据
      const updatedProject = myApplicationService.getProjectById(projectData!.id);
      if (updatedProject) {
        setProjectData(updatedProject);
      }
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理重新申报
  const handleReapply = async () => {
    if (!projectData) return;
    
    Modal.confirm({
      title: '重新申报',
      content: '将基于此项目创建新的申报，是否继续？',
      onOk: async () => {
        setLoading(true);
        try {
          const result = await myApplicationService.reapplyProject(projectData.id);
          if (result.success) {
            message.success('已创建新申报，请继续编辑');
            navigate(`/policy-center/application-management/apply/${result.newId}`);
          } else {
            message.error('重新申报失败');
          }
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!projectDetail) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty description="项目不存在" />
        <Button type="primary" onClick={() => navigate('/policy-center/my-applications')}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <PageWrapper module="policy">
      
      {/* 返回按钮 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/policy-center/my-applications')}
        style={{ marginBottom: 16 }}
      >
        返回列表
      </Button>

      {/* 驳回提醒（仅驳回状态显示） */}
      {projectDetail.currentStatus === 'rejected' && (
        <Alert
          message="该项目已被驳回"
          description={
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div>
                <Text strong>驳回时间：</Text>
                <Text>{projectDetail.rejectionDate}</Text>
                <Divider type="vertical" />
                <Text strong>审核人员：</Text>
                <Text>{projectDetail.reviewer}</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text strong>驳回原因：</Text>
                <div style={{ marginTop: 4, whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                  <Text type="secondary">{projectDetail.rejectionReason}</Text>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <Button 
                  type="primary" 
                  icon={<RocketOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: '重新申报',
                      content: '将基于此项目创建新的申报，是否继续？',
                      onOk: () => {
                        message.success('已创建新申报，请继续编辑');
                        navigate('/policy-center/application-management/apply/new');
                      }
                    });
                  }}
                >
                  重新申报
                </Button>
              </div>
            </Space>
          }
          type="error"
          showIcon
          closable={false}
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {/* 项目标题卡片 */}
      <Card style={{ marginBottom: 16, borderRadius: 8 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Space direction="vertical" size="small">
              <Space>
                <Title level={3} style={{ margin: 0 }}>{projectDetail.name}</Title>
                {projectDetail.currentStatus === 'rejected' ? (
                  <Tag color="error" icon={<CloseCircleOutlined />}>已驳回</Tag>
                ) : projectDetail.currentStatus === 'supplement' ? (
                  <Tag color="warning" icon={<ExclamationCircleOutlined />}>需补正</Tag>
                ) : projectDetail.currentStatus === 'approved' ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>已通过</Tag>
                ) : projectDetail.currentStatus === 'draft' ? (
                  <Tag color="default" icon={<EditOutlined />}>待提交</Tag>
                ) : (
                  <Tag color="processing" icon={<SyncOutlined spin />}>审核中</Tag>
                )}
              </Space>
              <Text type="secondary">{projectDetail.policyBasis}</Text>
            </Space>
            
            {/* 操作按钮 */}
            <Space>
              {projectDetail.currentStatus === 'draft' && (
                <>
                  <Button icon={<EditOutlined />} onClick={handleEdit}>
                    编辑
                  </Button>
                  <Button type="primary" icon={<RocketOutlined />} onClick={handleSubmit}>
                    提交申报
                  </Button>
                </>
              )}
              {projectDetail.currentStatus === 'supplement' && (
                <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
                  补正材料
                </Button>
              )}
              {projectDetail.currentStatus === 'rejected' && (
                <Button type="primary" icon={<RocketOutlined />} onClick={handleReapply}>
                  重新申报
                </Button>
              )}
              <Button icon={<CloudDownloadOutlined />} onClick={handleBatchDownload}>
                下载全部材料
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <Tabs 
        defaultActiveKey="1" 
        type="card"
        items={[
          {
            key: '1',
            label: <span><FileTextOutlined /> 基础信息</span>,
            children: (
              <>
          <Card title="项目基本信息" style={{ marginBottom: 16, borderRadius: 8 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="项目名称" span={2}>
                {projectDetail.name}
              </Descriptions.Item>
              <Descriptions.Item label="政策依据" span={2}>
                {projectDetail.policyBasis}
              </Descriptions.Item>
              <Descriptions.Item label="申报企业">
                {projectDetail.company}
              </Descriptions.Item>
              <Descriptions.Item label="申报时间">
                {projectDetail.applyDate}
              </Descriptions.Item>
              <Descriptions.Item label="截止日期">
                <Text type="danger">{projectDetail.deadline}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="审批部门">
                {projectDetail.department}
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                {projectDetail.currentStatus === 'rejected' ? (
                  <Tag color="error" icon={<CloseCircleOutlined />}>已驳回</Tag>
                ) : projectDetail.currentStatus === 'supplement' ? (
                  <Tag color="warning" icon={<ExclamationCircleOutlined />}>需补正</Tag>
                ) : projectDetail.currentStatus === 'approved' ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>已通过</Tag>
                ) : projectDetail.currentStatus === 'draft' ? (
                  <Tag color="default" icon={<EditOutlined />}>待提交</Tag>
                ) : (
                  <Tag color="processing" icon={<SyncOutlined spin />}>审核中</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="当前节点">
                <Text strong>{projectDetail.currentNode}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="企业基础信息" style={{ marginBottom: 16, borderRadius: 8 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="企业名称" span={2}>
                {projectDetail.basicInfo.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码" span={2}>
                {projectDetail.basicInfo.creditCode}
              </Descriptions.Item>
              <Descriptions.Item label="法定代表人">
                {projectDetail.basicInfo.legalPerson}
              </Descriptions.Item>
              <Descriptions.Item label="注册资本">
                {projectDetail.basicInfo.registeredCapital}
              </Descriptions.Item>
              <Descriptions.Item label="注册日期">
                {projectDetail.basicInfo.registrationDate}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业">
                {projectDetail.basicInfo.industry}
              </Descriptions.Item>
              <Descriptions.Item label="企业地址" span={2}>
                {projectDetail.basicInfo.address}
              </Descriptions.Item>
              <Descriptions.Item label="员工总数">
                {projectDetail.basicInfo.employeeCount} 人
              </Descriptions.Item>
              <Descriptions.Item label="研发人员">
                {projectDetail.basicInfo.rdPersonnel} 人
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="核心指标数据" style={{ marginBottom: 16, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#f0f5ff' }}>
                  <Space direction="vertical" size="small">
                    <Text type="secondary">年度营收</Text>
                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                      {projectDetail.coreIndicators.annualRevenue}
                    </Title>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#f6ffed' }}>
                  <Space direction="vertical" size="small">
                    <Text type="secondary">研发费用</Text>
                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                      {projectDetail.coreIndicators.rdExpense}
                    </Title>
                    <Text type="secondary">占比: {projectDetail.coreIndicators.rdExpenseRatio}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#fff7e6' }}>
                  <Space direction="vertical" size="small">
                    <Text type="secondary">研发人员占比</Text>
                    <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                      {projectDetail.coreIndicators.rdPersonnelRatio}
                    </Title>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider />

            <Descriptions bordered column={3}>
              <Descriptions.Item label="知识产权总数">
                <Badge count={projectDetail.coreIndicators.ipCount} showZero style={{ backgroundColor: '#52c41a' }} />
              </Descriptions.Item>
              <Descriptions.Item label="发明专利">
                <Badge count={projectDetail.coreIndicators.inventionPatents} showZero style={{ backgroundColor: '#1890ff' }} />
              </Descriptions.Item>
              <Descriptions.Item label="实用新型">
                <Badge count={projectDetail.coreIndicators.utilityModels} showZero style={{ backgroundColor: '#722ed1' }} />
              </Descriptions.Item>
              <Descriptions.Item label="科技成果转化" span={3}>
                <Badge count={projectDetail.coreIndicators.techTransformations} showZero style={{ backgroundColor: '#faad14' }} /> 项
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="资质信息" style={{ borderRadius: 8 }}>
            <List
              dataSource={projectDetail.qualifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                    title={item.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">证书编号: {item.certNo}</Text>
                        <Text type="secondary">有效期至: {item.validUntil}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
              </>
            )
          },
          {
            key: '2',
            label: <span><HistoryOutlined /> 进度轨迹</span>,
            children: (
          <Card style={{ borderRadius: 8 }}>
            <Steps
              current={3}
              status="process"
              direction="vertical"
            >
              {progressNodes.map((node, index) => (
                <Step
                  key={node.id}
                  title={node.nodeName}
                  status={
                    node.status === 'completed' ? 'finish' :
                    node.status === 'processing' ? 'process' : 'wait'
                  }
                  icon={
                    node.status === 'completed' ? <CheckCircleOutlined /> :
                    node.status === 'processing' ? <ClockCircleOutlined /> : undefined
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                      {node.processTime !== '-' && (
                        <Text type="secondary">
                          <CalendarOutlined /> {node.processTime}
                        </Text>
                      )}
                      {node.reviewer !== '-' && (
                        <Text type="secondary">
                          <UserOutlined /> 处理人: {node.reviewer}
                        </Text>
                      )}
                      {node.opinion && (
                        <Alert
                          message={node.opinion}
                          type={node.status === 'completed' ? 'success' : 'info'}
                          showIcon
                          style={{ marginTop: 8 }}
                        />
                      )}
                      {node.duration !== '-' && (
                        <Text type="secondary">
                          <ClockCircleOutlined /> 处理时长: {node.duration}
                        </Text>
                      )}
                    </Space>
                  }
                />
              ))}
            </Steps>
          </Card>
            )
          },
          {
            key: '3',
            label: <span><FolderOutlined /> 申报材料</span>,
            children: (
              <Card 
                title={
                  <Space>
                    <FolderOutlined />
                    申报材料
                    <Badge count={materials.length} showZero style={{ backgroundColor: '#52c41a' }} />
                  </Space>
                }
                extra={
                  <Button icon={<CloudDownloadOutlined />} onClick={handleBatchDownload}>
                    批量下载
                  </Button>
                }
                style={{ borderRadius: 8 }}
              >
                {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
                  <div key={category} style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
                      <FolderOutlined style={{ marginRight: 8 }} />
                      {category}
                      <Badge count={categoryMaterials.length} showZero style={{ marginLeft: 8, backgroundColor: '#1890ff' }} />
                    </Title>
                    
                    <Row gutter={[16, 16]}>
                      {categoryMaterials.map((material) => (
                        <Col key={material.id} xs={24} sm={12} md={8} lg={6}>
                          <Card
                            hoverable
                            style={{ 
                              height: '100%',
                              border: '1px solid #f0f0f0',
                              borderRadius: 8
                            }}
                            bodyStyle={{ padding: 16 }}
                            cover={
                              <div style={{ 
                                height: 120, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: '#fafafa',
                                borderRadius: '8px 8px 0 0'
                              }}>
                                {getFileIcon(material.type)}
                              </div>
                            }
                            actions={[
                              <Tooltip title="预览">
                                <Button 
                                  type="text" 
                                  icon={<EyeOutlined />} 
                                  onClick={() => handlePreview(material)}
                                />
                              </Tooltip>,
                              <Tooltip title="下载">
                                <Button 
                                  type="text" 
                                  icon={<DownloadOutlined />} 
                                  onClick={() => handleDownload(material)}
                                />
                              </Tooltip>
                            ]}
                          >
                            <Card.Meta
                              title={
                                <Tooltip title={material.name}>
                                  <Text ellipsis style={{ fontSize: 14, fontWeight: 500 }}>
                                    {material.name}
                                  </Text>
                                </Tooltip>
                              }
                              description={
                                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                  {getStatusTag(material.status)}
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    <UserOutlined style={{ marginRight: 4 }} />
                                    {material.uploader}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    <CalendarOutlined style={{ marginRight: 4 }} />
                                    {material.uploadTime.split(' ')[0]}
                                  </Text>
                                  {material.isSupplementVersion && (
                                    <Tag color="orange" style={{ fontSize: '12px' }}>
                                      补正版本 {material.version}
                                    </Tag>
                                  )}
                                </Space>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
                
                {materials.length === 0 && (
                  <Empty
                    description="暂无申报材料"
                    style={{ padding: '60px 0' }}
                  />
                )}
              </Card>
            )
          },
          {
            key: '4',
            label: <span><UploadOutlined /> 补正材料</span>,
            children: (
              <Card 
                title="补正材料"
                style={{ borderRadius: 8 }}
              >
                {projectDetail.supplementMaterials && projectDetail.supplementMaterials.length > 0 ? (
                  <>
                    <Alert
                      message="请根据审核意见上传以下需要补正的材料"
                      type="warning"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />
                    
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      {projectDetail.supplementMaterials.map((material, index) => (
                        <Card
                          key={index}
                          title={
                            <Space>
                              {material.uploaded ? (
                                <Tag color="green" icon={<CheckCircleOutlined />}>已上传</Tag>
                              ) : (
                                <Tag color="orange">需补正</Tag>
                              )}
                              <Text strong>{material.name}</Text>
                            </Space>
                          }
                          extra={
                            material.uploaded ? (
                              <Text type="secondary">
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                                {material.uploadTime}
                              </Text>
                            ) : (
                              <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
                                上传文件
                              </Button>
                            )
                          }
                          style={{ background: material.uploaded ? '#f6ffed' : '#fffbe6' }}
                        >
                          {material.uploaded ? (
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Text type="success">
                                <CheckCircleOutlined style={{ marginRight: 4 }} />
                                材料已成功上传
                              </Text>
                            </Space>
                          ) : (
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Text type="secondary">要求：请上传清晰的{material.name}扫描件或照片</Text>
                              <Text type="secondary">格式：支持 PDF、JPG、PNG 格式，大小不超过 10MB</Text>
                              <Text type="danger">截止日期：{projectDetail.supplementDeadline || '2024-03-25'}</Text>
                            </Space>
                          )}
                        </Card>
                      ))}
                    </Space>
                  </>
                ) : (
                  <Empty
                    description="当前项目无需补正材料"
                    style={{ padding: '60px 0' }}
                  />
                )}
              </Card>
            )
          }
        ]}
      />

      {/* 文件预览模态框 */}
      <Modal
        title={previewFile?.name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => previewFile && handleDownload(previewFile)}>
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {previewFile && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {previewFile.thumbnail ? (
              <Image src={previewFile.thumbnail} alt={previewFile.name} />
            ) : (
              <div>
                {getFileIcon(previewFile.type)}
                <Paragraph style={{ marginTop: 16 }}>
                  文件预览功能开发中，请下载后查看
                </Paragraph>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 补正材料上传模态框 */}
      <Modal
        title="补正材料上传"
        open={uploadModalVisible}
        onOk={handleSupplementUpload}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
        }}
        confirmLoading={uploading}
        okText="确认上传"
        cancelText="取消"
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="请上传需要补正的材料"
            description="支持 PDF、Word、Excel、图片等格式文件，单个文件大小不超过 10MB"
            type="info"
            showIcon
          />
          
          <Upload.Dragger
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，支持 PDF、Word、Excel、图片等格式
            </p>
          </Upload.Dragger>
          
          {fileList.length > 0 && (
            <div>
              <Title level={5}>已选择文件：</Title>
              <List
                size="small"
                dataSource={fileList}
                renderItem={(file) => (
                  <List.Item>
                    <Space>
                      <FileTextOutlined />
                      <Text>{file.name}</Text>
                      <Text type="secondary">({(file.size / 1024).toFixed(2)} KB)</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Space>
      </Modal>
    </PageWrapper>
  );
};

export default ApplicationDetailEnhanced;
