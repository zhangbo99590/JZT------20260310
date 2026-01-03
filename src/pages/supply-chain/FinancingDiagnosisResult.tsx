import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Progress,
  Space,
  Tag,
  Divider,
  List,
  Avatar,
  Rate,
  Statistic,
  Alert,
  Table,
  Badge,
  Timeline,
  Tabs,
  Select,
  message,
  Tooltip,
  Form,
  Steps,
  Modal,
  Input,
  InputNumber,
  Breadcrumb,
} from 'antd';
import html2pdf from 'html2pdf.js';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  HeartOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface FinancingOption {
  id: string;
  name: string;
  type: string;
  matchScore: number;
  matchLevel: string;
  interestRate: string;
  amount: string;
  term: string;
  requirements: string[];
  advantages: string[];
  risks: string[];
  provider: string;
  processingTime: string;
  successRate: number;
  rating: number;
}

const FinancingDiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FinancingOption | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟融资方案数据 - 使用useMemo缓存
  const financingOptions: FinancingOption[] = useMemo(() => [
    {
      id: '1',
      name: '供应链金融-应收账款融资',
      type: '供应链金融',
      matchScore: 95,
      matchLevel: '极度推荐',
      interestRate: '6.5%-8.5%',
      amount: '100-2000万',
      term: '3-12个月',
      requirements: [
        '应收账款真实有效',
        '核心企业信用良好',
        '历史交易记录完整'
      ],
      advantages: [
        '审批快速',
        '无需抵押',
        '循环使用',
        '成本相对较低'
      ],
      risks: [
        '依赖核心企业信用',
        '应收账款质量风险'
      ],
      provider: '工商银行',
      processingTime: '3-5个工作日',
      successRate: 85,
      rating: 4
    }
  ], []);

  const analysisSteps = useMemo(() => [
    {
      title: '需求分析',
      description: '基于企业融资需求、还款能力完成初步定位',
      status: 'finish' as const,
      icon: <CheckCircleOutlined />
    },
    {
      title: '风险评估',
      description: '综合企业信用、财务、经营等维度完成风险核验',
      status: 'finish' as const,
      icon: <CheckCircleOutlined />
    },
    {
      title: '方案匹配',
      description: '依据需求与风险结果匹配适配融资方案',
      status: 'finish' as const,
      icon: <CheckCircleOutlined />
    }
  ], []);

  const getMatchColor = useCallback((score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#faad14';
    return '#ff4d4f';
  }, []);

  const getMatchTag = useCallback((score: number) => {
    if (score >= 90) return { color: 'green', text: '极度推荐' };
    if (score >= 80) return { color: 'blue', text: `匹配度 ${score}%` };
    if (score >= 70) return { color: 'orange', text: `匹配度 ${score}%` };
    return { color: 'red', text: `匹配度 ${score}%` };
  }, []);

  const handleToggleFavorite = useCallback((optionId: string) => {
    setFavorites(prev => {
      if (prev.includes(optionId)) {
        message.success('已取消收藏');
        return prev.filter(id => id !== optionId);
      } else {
        message.success('已添加到收藏');
        return [...prev, optionId];
      }
    });
  }, []);

  const handleShare = useCallback((option: FinancingOption) => {
    message.info('分享功能开发中...');
  }, []);

  const handleExportPDF = useCallback(() => {
    message.info('正在生成PDF报告...');
  }, []);

  const handleConsult = useCallback(() => {
    message.info('客服咨询功能开发中...');
  }, []);

  const handleViewReport = useCallback(() => {
    setReportModalVisible(true);
  }, []);

  const handleDownloadReport = () => {
    message.loading('正在生成PDF报告...', 3);
    
    setTimeout(() => {
      try {
        generatePDFFromHTML();
        message.success('PDF报告下载成功！');
      } catch (error) {
        console.error('PDF生成错误:', error);
        message.error('报告生成失败，请重试');
      }
    }, 1000);
  };

  const generateHTMLReport = () => {
    const currentDate = new Date().toLocaleDateString();
    const reportId = `FD${Date.now().toString().slice(-8)}`;
    const generateTime = new Date().toLocaleString();
    
    const reportContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>融资诊断分析报告</title>
    <style>
        body { 
            font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333; 
            background: white;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 2px solid #1890ff; 
            padding-bottom: 20px; 
        }
        .header h1 { 
            color: #1890ff; 
            margin: 0; 
            font-size: 24px; 
            font-weight: bold;
        }
        .header p { 
            color: #666; 
            margin: 10px 0 0 0; 
            font-size: 14px;
        }
        .section { 
            margin-bottom: 30px; 
            page-break-inside: avoid;
        }
        .section-title { 
            background: #f0f8ff; 
            padding: 12px 20px; 
            border-left: 4px solid #1890ff; 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 15px; 
        }
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin-bottom: 20px; 
        }
        .info-item { 
            padding: 8px 0; 
            font-size: 14px;
        }
        .info-label { 
            font-weight: bold; 
            color: #1890ff; 
        }
        .risk-item { 
            padding: 12px; 
            margin: 8px 0; 
            border-radius: 4px; 
            font-size: 14px;
        }
        .risk-low { 
            background: #f6ffed; 
            border-left: 4px solid #52c41a; 
        }
        .risk-medium { 
            background: #fff7e6; 
            border-left: 4px solid #faad14; 
        }
        .risk-high { 
            background: #fff2f0; 
            border-left: 4px solid #ff4d4f; 
        }
        .recommendation { 
            background: #e6f7ff; 
            padding: 15px; 
            border-radius: 6px; 
            border-left: 4px solid #1890ff; 
            margin-bottom: 15px;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
        }
        ul { 
            padding-left: 20px; 
        }
        li { 
            margin-bottom: 5px; 
            font-size: 14px;
        }
        h4 {
            color: #1890ff;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        @media print {
            body { margin: 20px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>某制造企业有限公司 融资诊断分析报告</h1>
        <p>报告生成时间：${currentDate} | 报告有效期：30天</p>
    </div>

    <div class="section">
        <div class="section-title">一、报告基础信息</div>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">企业名称：</span>某制造企业有限公司</div>
            <div class="info-item"><span class="info-label">统一社会信用代码：</span>91110000MA01****XX</div>
            <div class="info-item"><span class="info-label">所属行业：</span>制造业</div>
            <div class="info-item"><span class="info-label">成立时间：</span>2018年3月</div>
            <div class="info-item"><span class="info-label">企业规模：</span>中型企业</div>
            <div class="info-item"><span class="info-label">数据来源：</span>企业填报 + 系统关联数据</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">二、融资需求分析</div>
        <h4>企业申报的融资需求：</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">融资金额：</span>100-200万元</div>
            <div class="info-item"><span class="info-label">融资用途：</span>采购原材料、补充流动资金</div>
            <div class="info-item"><span class="info-label">期望期限：</span>3-6个月</div>
            <div class="info-item"><span class="info-label">可接受利率：</span>≤8.5%</div>
        </div>
        <h4>还款来源评估：</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">核心还款来源：</span>主营业务营收</div>
            <div class="info-item"><span class="info-label">辅助还款来源：</span>应收账款回款</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">三、企业融资资质画像</div>
        <h4>财务状况（近1年核心数据）：</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">年营业收入：</span>2,800万元</div>
            <div class="info-item"><span class="info-label">净利润：</span>280万元</div>
            <div class="info-item"><span class="info-label">资产负债率：</span>65%</div>
            <div class="info-item"><span class="info-label">现金流情况：</span>经营性现金流净额为正</div>
        </div>
        <h4>信用状况：</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">企业征信记录：</span>无逾期、无不良信用记录</div>
            <div class="info-item"><span class="info-label">企业资质认证：</span>已获得高新技术企业认证</div>
        </div>
        <h4>经营稳定性：</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">核心业务占比：</span>主营业务占比90%</div>
            <div class="info-item"><span class="info-label">合作客户情况：</span>长期合作客户≥5家</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">四、融资风险评估</div>
        <div class="risk-item risk-low">
            <strong>信用风险：低风险</strong><br>
            无不良征信记录，企业信用状况良好
        </div>
        <div class="risk-item risk-medium">
            <strong>财务风险：中风险</strong><br>
            资产负债率略高于行业均值，需关注资金流动性
        </div>
        <div class="risk-item risk-low">
            <strong>经营风险：低风险</strong><br>
            主营业务营收稳定，经营状况良好
        </div>
        <p><span class="info-label">综合风险等级：</span>低-中风险</p>
        <p><span class="info-label">风险说明：</span>资产负债率65%，高于制造业平均50%的水平，建议优化资产结构</p>
    </div>

    <div class="section">
        <div class="section-title">五、适配融资方案匹配</div>
        <h4>推荐方案：供应链金融-应收账款融资</h4>
        <div class="info-grid">
            <div class="info-item"><span class="info-label">产品类型：</span>供应链类融资</div>
            <div class="info-item"><span class="info-label">适配额度：</span>100-200万元</div>
            <div class="info-item"><span class="info-label">利率范围：</span>6.5%-8.5%</div>
            <div class="info-item"><span class="info-label">期限范围：</span>3-6个月</div>
            <div class="info-item"><span class="info-label">申请通过率：</span>85%</div>
            <div class="info-item"><span class="info-label">办理机构：</span>工商银行</div>
        </div>
        <h4>产品细节：</h4>
        <div style="margin-bottom: 8px;"><span class="info-label">核心优势：</span>无需抵押、审批快（3个工作日）</div>
        <div style="margin-bottom: 8px;"><span class="info-label">申请条件：</span>企业成立满1年、有稳定应收账款</div>
        <div style="margin-bottom: 8px;"><span class="info-label">所需材料：</span>营业执照、应收账款凭证、近3个月银行流水</div>
        <div><span class="info-label">适配理由：</span>额度、期限与企业需求高度匹配；无需抵押适配轻资产企业</div>
    </div>

    <div class="section">
        <div class="section-title">六、专业融资建议</div>
        <div class="recommendation">
            <h4>优先推荐方案</h4>
            <p>供应链金融-应收账款融资，适配度最高</p>
        </div>
        <h4>风险规避建议：</h4>
        <ul>
            <li>针对资产负债率略高的问题，可补充核心资产证明降低审核顾虑</li>
            <li>建议提供主要客户的合作协议，证明应收账款的稳定性</li>
        </ul>
        <h4>材料准备指南：</h4>
        <ul>
            <li>应收账款融资需提前准备"应收账款确认函"</li>
            <li>准备近6个月的银行流水和财务报表</li>
            <li>核心客户的合作协议和历史交易记录</li>
        </ul>
    </div>

    <div class="footer">
        <p>本报告由企规宝融资诊断系统生成 | 报告编号：${reportId} | 生成时间：${generateTime}</p>
        <p>注：本报告基于企业提供的信息和公开数据分析生成，仅供参考，不构成投资建议</p>
    </div>
</body>
</html>`;

    // 创建Blob对象并下载
    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `融资诊断分析报告_${currentDate.replace(/\//g, '')}.html`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFFromHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const reportId = `FD${Date.now().toString().slice(-8)}`;
    const generateTime = new Date().toLocaleString();
    
    // 创建临时的HTML元素
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1890ff; padding-bottom: 15px;">
          <h1 style="color: #1890ff; margin: 0; font-size: 20px; font-weight: bold;">某制造企业有限公司 融资诊断分析报告</h1>
          <p style="color: #666; margin: 8px 0 0 0; font-size: 12px;">报告生成时间：${currentDate} | 报告有效期：30天</p>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">一、报告基础信息</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
            <div><span style="font-weight: bold; color: #1890ff;">企业名称：</span>某制造企业有限公司</div>
            <div><span style="font-weight: bold; color: #1890ff;">统一社会信用代码：</span>91110000MA01****XX</div>
            <div><span style="font-weight: bold; color: #1890ff;">所属行业：</span>制造业</div>
            <div><span style="font-weight: bold; color: #1890ff;">成立时间：</span>2018年3月</div>
            <div><span style="font-weight: bold; color: #1890ff;">企业规模：</span>中型企业</div>
            <div><span style="font-weight: bold; color: #1890ff;">数据来源：</span>企业填报 + 系统关联数据</div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">二、融资需求分析</div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">企业申报的融资需求：</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
            <div><span style="font-weight: bold; color: #1890ff;">融资金额：</span>100-200万元</div>
            <div><span style="font-weight: bold; color: #1890ff;">融资用途：</span>采购原材料、补充流动资金</div>
            <div><span style="font-weight: bold; color: #1890ff;">期望期限：</span>3-6个月</div>
            <div><span style="font-weight: bold; color: #1890ff;">可接受利率：</span>≤8.5%</div>
          </div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">还款来源评估：</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
            <div><span style="font-weight: bold; color: #1890ff;">核心还款来源：</span>主营业务营收</div>
            <div><span style="font-weight: bold; color: #1890ff;">辅助还款来源：</span>应收账款回款</div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">三、企业融资资质画像</div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">财务状况（近1年核心数据）：</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
            <div><span style="font-weight: bold; color: #1890ff;">年营业收入：</span>2,800万元</div>
            <div><span style="font-weight: bold; color: #1890ff;">净利润：</span>280万元</div>
            <div><span style="font-weight: bold; color: #1890ff;">资产负债率：</span>65%</div>
            <div><span style="font-weight: bold; color: #1890ff;">现金流情况：</span>经营性现金流净额为正</div>
          </div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">信用状况：</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
            <div><span style="font-weight: bold; color: #1890ff;">企业征信记录：</span>无逾期、无不良信用记录</div>
            <div><span style="font-weight: bold; color: #1890ff;">企业资质认证：</span>已获得高新技术企业认证</div>
          </div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">经营稳定性：</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
            <div><span style="font-weight: bold; color: #1890ff;">核心业务占比：</span>主营业务占比90%</div>
            <div><span style="font-weight: bold; color: #1890ff;">合作客户情况：</span>长期合作客户≥5家</div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">四、融资风险评估</div>
          <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #f6ffed; border-left: 4px solid #52c41a; font-size: 12px;">
            <strong>信用风险：低风险</strong><br>
            无不良征信记录，企业信用状况良好
          </div>
          <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #fff7e6; border-left: 4px solid #faad14; font-size: 12px;">
            <strong>财务风险：中风险</strong><br>
            资产负债率略高于行业均值，需关注资金流动性
          </div>
          <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #f6ffed; border-left: 4px solid #52c41a; font-size: 12px;">
            <strong>经营风险：低风险</strong><br>
            主营业务营收稳定，经营状况良好
          </div>
          <p style="font-size: 12px; margin: 10px 0 5px 0;"><span style="font-weight: bold; color: #1890ff;">综合风险等级：</span>低-中风险</p>
          <p style="font-size: 12px; margin: 5px 0;"><span style="font-weight: bold; color: #1890ff;">风险说明：</span>资产负债率65%，高于制造业平均50%的水平，建议优化资产结构</p>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">五、适配融资方案匹配</div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">推荐方案：供应链金融-应收账款融资</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
            <div><span style="font-weight: bold; color: #1890ff;">产品类型：</span>供应链类融资</div>
            <div><span style="font-weight: bold; color: #1890ff;">适配额度：</span>100-200万元</div>
            <div><span style="font-weight: bold; color: #1890ff;">利率范围：</span>6.5%-8.5%</div>
            <div><span style="font-weight: bold; color: #1890ff;">期限范围：</span>3-6个月</div>
            <div><span style="font-weight: bold; color: #1890ff;">申请通过率：</span>85%</div>
            <div><span style="font-weight: bold; color: #1890ff;">办理机构：</span>工商银行</div>
          </div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">产品细节：</h4>
          <div style="font-size: 12px; margin-bottom: 6px;"><span style="font-weight: bold; color: #1890ff;">核心优势：</span>无需抵押、审批快（3个工作日）</div>
          <div style="font-size: 12px; margin-bottom: 6px;"><span style="font-weight: bold; color: #1890ff;">申请条件：</span>企业成立满1年、有稳定应收账款</div>
          <div style="font-size: 12px; margin-bottom: 6px;"><span style="font-weight: bold; color: #1890ff;">所需材料：</span>营业执照、应收账款凭证、近3个月银行流水</div>
          <div style="font-size: 12px;"><span style="font-weight: bold; color: #1890ff;">适配理由：</span>额度、期限与企业需求高度匹配；无需抵押适配轻资产企业</div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">六、专业融资建议</div>
          <div style="background: #e6f7ff; padding: 12px; border-radius: 6px; border-left: 4px solid #1890ff; margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #1890ff;">优先推荐方案</h4>
            <p style="margin: 0; font-size: 12px;">供应链金融-应收账款融资，适配度最高</p>
          </div>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">风险规避建议：</h4>
          <ul style="padding-left: 15px; font-size: 12px; margin-bottom: 15px;">
            <li style="margin-bottom: 4px;">针对资产负债率略高的问题，可补充核心资产证明降低审核顾虑</li>
            <li style="margin-bottom: 4px;">建议提供主要客户的合作协议，证明应收账款的稳定性</li>
          </ul>
          <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">材料准备指南：</h4>
          <ul style="padding-left: 15px; font-size: 12px;">
            <li style="margin-bottom: 4px;">应收账款融资需提前准备"应收账款确认函"</li>
            <li style="margin-bottom: 4px;">准备近6个月的银行流水和财务报表</li>
            <li style="margin-bottom: 4px;">核心客户的合作协议和历史交易记录</li>
          </ul>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 10px; border-top: 1px solid #ddd; padding-top: 15px;">
          <p>本报告由企规宝融资诊断系统生成 | 报告编号：${reportId} | 生成时间：${generateTime}</p>
          <p>注：本报告基于企业提供的信息和公开数据分析生成，仅供参考，不构成投资建议</p>
        </div>
      </div>
    `;

    // 配置PDF选项
    const opt = {
      margin: 0.5,
      filename: `融资诊断分析报告_${currentDate.replace(/\//g, '')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    // 生成PDF并下载
    html2pdf().set({
      ...opt,
      image: { type: 'jpeg' as const, quality: 0.98 },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' as const
      }
    }).from(element).save();
  };

  const handleApplyOption = (option: FinancingOption) => {
    setSelectedOption(option);
    setApplyModalVisible(true);
  };

  const handleApplySubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 生成申请数据，为可选字段提供默认值
      const applicationData = {
        ...values,
        amount: values.amount || 0, // 如果没有填写金额，默认为0
        purpose: values.purpose || 'other', // 如果没有选择用途，默认为其他
        applicationId: 'FA' + Date.now().toString().slice(-8),
        submitTime: new Date().toLocaleString(),
        productName: selectedOption?.name || '融资产品'
      };
      
      // 保存申请数据
      localStorage.setItem('latest-application', JSON.stringify(applicationData));
      
      message.success('申请提交成功，正在跳转...');
      setApplyModalVisible(false);
      form.resetFields();
      
      // 跳转到申请成功页面
      setTimeout(() => {
        navigate('/supply-chain-finance/application-success', {
          state: { applicationData }
        });
      }, 1000);
    } catch (error) {
      message.error('请完善申请信息');
    }
  };

  const renderOptionCard = (option: FinancingOption) => {
    const matchTag = getMatchTag(option.matchScore);
    
    return (
      <Card
        key={option.id}
        style={{ marginBottom: '16px' }}
        styles={{ body: { padding: '24px' } }}
      >
        <div>
          {/* 标题和匹配度 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                {option.name}
              </Title>
              <Tag color={matchTag.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
                {matchTag.text}
              </Tag>
            </div>
            <Rate disabled value={option.rating} style={{ fontSize: '20px' }} />
          </div>

          {/* 关键指标 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={6}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>利率/成本</Text>
                <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
                  <PercentageOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                  {option.interestRate}
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>融资额度</Text>
                <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
                  <DollarOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                  {option.amount}
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>融资期限</Text>
                <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
                  <ClockCircleOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                  {option.term}
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>成功率</Text>
                <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>
                  <TrophyOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                  {option.successRate}%
                </div>
              </div>
            </Col>
          </Row>

          {/* 主要优势和申请条件 */}
          <Row gutter={24} style={{ marginBottom: '16px' }}>
            <Col span={12}>
              <div>
                <Text strong style={{ fontSize: '14px' }}>主要优势：</Text>
                <div style={{ marginTop: '8px' }}>
                  {option.advantages.map((advantage, index) => (
                    <div key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>
                      • {advantage}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong style={{ fontSize: '14px' }}>申请条件：</Text>
                <div style={{ marginTop: '8px' }}>
                  {option.requirements.map((req, index) => (
                    <div key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>
                      • {req}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* 底部信息和操作 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Space size="large">
              <Space>
                <BankOutlined style={{ color: '#1890ff' }} />
                <Text type="secondary">{option.provider}</Text>
              </Space>
              <Divider type="vertical" />
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <Text type="secondary">审批时间：{option.processingTime}</Text>
              </Space>
            </Space>
            
            <Space>
              <Button 
                type="primary" 
                icon={<ThunderboltOutlined />}
                onClick={() => handleApplyOption(option)}
              >
                立即申请
              </Button>
              <Button 
                icon={<FileTextOutlined />}
                onClick={handleViewReport}
              >
                诊断报告
              </Button>
              <Button 
                icon={favorites.includes(option.id) ? <HeartOutlined style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={() => handleToggleFavorite(option.id)}
              >
                {favorites.includes(option.id) ? '已收藏' : '收藏'}
              </Button>
              <Button 
                icon={<ShareAltOutlined />}
                onClick={() => handleShare(option)}
              >
                分享
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  // 预先渲染所有选项卡片
  const optionCards = financingOptions.map(option => renderOptionCard(option));
  
  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: '金融服务',
            href: '/supply-chain-finance',
          },
          {
            title: '诊断分析报告',
          },
        ]}
      />

      {/* 页面标题 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              诊断分析报告
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: 14 }}>
              融资需求分析 · 企业资质评估 · 专业融资方案
            </Paragraph>
          </Col>
          <Col>
            <Button 
              icon={<CustomerServiceOutlined />}
              onClick={handleConsult}
            >
              立即咨询
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 诊断进度 */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps current={2} items={analysisSteps} />
      </Card>

      {/* 主内容区 - 融资方案展示 */}
      <Row gutter={24}>
        <Col span={18}>
          <div>
            {optionCards}
          </div>
        </Col>
        
        <Col span={6}>
          {/* 推荐理由 */}
          <Card 
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                <span>推荐理由</span>
              </Space>
            } 
            style={{ marginBottom: '16px' }}
          >
            <Alert
              message="专业建议"
              description="基于您的企业情况，建议优先选择供应链金融方案，具有额度高、成本低的优势。该方案审批快速，无需抵押，非常适合您的融资需求。"
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: '12px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>匹配度分析</Text>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '12px' }}>资质匹配</Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>95%</Text>
                  </div>
                  <Progress percent={95} size="small" strokeColor="#52c41a" showInfo={false} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '12px' }}>需求匹配</Text>
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>90%</Text>
                  </div>
                  <Progress percent={90} size="small" strokeColor="#52c41a" showInfo={false} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text style={{ fontSize: '12px' }}>风险评估</Text>
                    <Text style={{ fontSize: '12px', color: '#1890ff' }}>88%</Text>
                  </div>
                  <Progress percent={88} size="small" strokeColor="#1890ff" showInfo={false} />
                </div>
              </Space>
            </div>
          </Card>

          {/* 立即咨询 */}
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CustomerServiceOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={5}>需要专业指导？</Title>
              <Paragraph type="secondary" style={{ fontSize: '13px' }}>
                联系金融服务顾问，获取1对1方案解读、材料准备指导
              </Paragraph>
              <Button 
                type="primary" 
                block 
                size="large"
                icon={<CustomerServiceOutlined />}
                onClick={handleConsult}
              >
                立即咨询
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 诊断报告弹窗 */}
      <Modal
        title="融资诊断分析报告"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        width={900}
        footer={[
          <Button key="download" type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadReport}>
            下载PDF报告
          </Button>,
          <Button key="close" onClick={() => setReportModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{ maxHeight: '70vh', overflow: 'auto', padding: '16px 0' }}>
          {/* 报告基础信息 */}
          <Card title="一、报告基础信息" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div><Text strong>报告名称：</Text>某制造企业有限公司 融资诊断分析报告</div>
              </Col>
              <Col span={12}>
                <div><Text strong>企业名称：</Text>某制造企业有限公司</div>
              </Col>
              <Col span={12}>
                <div><Text strong>统一社会信用代码：</Text>91110000MA01****XX</div>
              </Col>
              <Col span={12}>
                <div><Text strong>所属行业：</Text>制造业</div>
              </Col>
              <Col span={12}>
                <div><Text strong>成立时间：</Text>2018年3月</div>
              </Col>
              <Col span={12}>
                <div><Text strong>企业规模：</Text>中型企业</div>
              </Col>
              <Col span={12}>
                <div><Text strong>报告生成时间：</Text>{new Date().toLocaleDateString()}</div>
              </Col>
              <Col span={12}>
                <div><Text strong>报告有效期：</Text>30天（基于当前企业数据）</div>
              </Col>
            </Row>
          </Card>

          {/* 融资需求分析 */}
          <Card title="二、融资需求分析" style={{ marginBottom: '16px' }}>
            <Title level={5}>企业申报的融资需求：</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text strong>融资金额：</Text>100-200万元</Col>
              <Col span={12}><Text strong>融资用途：</Text>采购原材料、补充流动资金</Col>
              <Col span={12}><Text strong>期望期限：</Text>3-6个月</Col>
              <Col span={12}><Text strong>可接受利率：</Text>≤8.5%</Col>
            </Row>
            <Divider />
            <Title level={5}>还款来源评估：</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text strong>核心还款来源：</Text>主营业务营收</Col>
              <Col span={12}><Text strong>辅助还款来源：</Text>应收账款回款</Col>
            </Row>
          </Card>

          {/* 企业融资资质画像 */}
          <Card title="三、企业融资资质画像" style={{ marginBottom: '16px' }}>
            <Title level={5}>财务状况（近1年核心数据）：</Title>
            <Row gutter={[16, 8]}>
              <Col span={8}><Text strong>年营业收入：</Text>2,800万元</Col>
              <Col span={8}><Text strong>净利润：</Text>280万元</Col>
              <Col span={8}><Text strong>资产负债率：</Text>65%</Col>
            </Row>
            <div style={{ marginTop: '8px' }}><Text strong>现金流情况：</Text>经营性现金流净额为正</div>
            
            <Divider />
            <Title level={5}>信用状况：</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text strong>企业征信记录：</Text>无逾期、无不良信用记录</Col>
              <Col span={12}><Text strong>企业资质认证：</Text>已获得高新技术企业认证</Col>
            </Row>
            
            <Divider />
            <Title level={5}>经营稳定性：</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}><Text strong>核心业务占比：</Text>主营业务占比90%</Col>
              <Col span={12}><Text strong>合作客户情况：</Text>长期合作客户≥5家</Col>
            </Row>
          </Card>

          {/* 融资风险评估 */}
          <Card title="四、融资风险评估" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Alert message="信用风险" description="低风险，无不良征信记录" type="success" showIcon />
              </Col>
              <Col span={8}>
                <Alert message="财务风险" description="中风险，资产负债率略高于行业均值" type="warning" showIcon />
              </Col>
              <Col span={8}>
                <Alert message="经营风险" description="低风险，主营业务营收稳定" type="success" showIcon />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <Text strong>综合风险等级：</Text>
              <Tag color="orange" style={{ marginLeft: '8px' }}>低-中风险</Tag>
            </div>
            <div style={{ marginTop: '8px' }}>
              <Text strong>风险说明：</Text>资产负债率65%，高于制造业平均50%的水平，建议优化资产结构
            </div>
          </Card>

          {/* 适配融资方案匹配 */}
          <Card title="五、适配融资方案匹配" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>推荐方案：供应链金融-应收账款融资</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}><Text strong>产品类型：</Text>供应链类融资</Col>
                <Col span={12}><Text strong>适配额度：</Text>100-200万元</Col>
                <Col span={12}><Text strong>利率范围：</Text>6.5%-8.5%</Col>
                <Col span={12}><Text strong>期限范围：</Text>3-6个月</Col>
                <Col span={12}><Text strong>申请通过率：</Text>85%</Col>
                <Col span={12}><Text strong>办理机构：</Text>工商银行</Col>
              </Row>
              
              <Divider />
              <Title level={5}>产品细节：</Title>
              <div style={{ marginBottom: '8px' }}><Text strong>核心优势：</Text>无需抵押、审批快（3个工作日）</div>
              <div style={{ marginBottom: '8px' }}><Text strong>申请条件：</Text>企业成立满1年、有稳定应收账款</div>
              <div style={{ marginBottom: '8px' }}><Text strong>所需材料：</Text>营业执照、应收账款凭证、近3个月银行流水</div>
              <div><Text strong>适配理由：</Text>额度、期限与企业需求高度匹配；无需抵押适配轻资产企业</div>
            </div>
          </Card>

          {/* 专业融资建议 */}
          <Card title="六、专业融资建议">
            <Alert
              message="优先推荐方案"
              description="供应链金融-应收账款融资，适配度最高"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Title level={5}>风险规避建议：</Title>
            <div style={{ marginBottom: '12px' }}>
              • 针对资产负债率略高的问题，可补充核心资产证明降低审核顾虑
            </div>
            <div style={{ marginBottom: '12px' }}>
              • 建议提供主要客户的合作协议，证明应收账款的稳定性
            </div>
            
            <Title level={5}>材料准备指南：</Title>
            <div style={{ marginBottom: '12px' }}>
              • 应收账款融资需提前准备"应收账款确认函"
            </div>
            <div style={{ marginBottom: '12px' }}>
              • 准备近6个月的银行流水和财务报表
            </div>
            <div>
              • 核心客户的合作协议和历史交易记录
            </div>
          </Card>
        </div>
      </Modal>

      {/* 申请弹窗 */}
      <Modal
        title={`申请 ${selectedOption?.name || '融资产品'}`}
        open={applyModalVisible}
        onCancel={() => setApplyModalVisible(false)}
        onOk={handleApplySubmit}
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
                rules={[{ required: true, message: '请输入企业名称' }]}
              >
                <Input placeholder="请输入企业名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系人"
                name="contactPerson"
                rules={[{ required: true, message: '请输入联系人' }]}
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
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="申请金额"
                name="amount"
              >
                <InputNumber
                  placeholder="请输入申请金额（选填）"
                  addonAfter="万元"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="资金用途"
            name="purpose"
          >
            <Select placeholder="请选择资金用途（选填）">
              <Select.Option value="equipment">设备采购</Select.Option>
              <Select.Option value="working-capital">流动资金</Select.Option>
              <Select.Option value="expansion">业务扩张</Select.Option>
              <Select.Option value="rd">研发投入</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="备注说明"
            name="remarks"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请简要说明您的融资需求和企业情况"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinancingDiagnosisResult;
