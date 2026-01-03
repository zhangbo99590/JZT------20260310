/**
 * AI政策中心主页面
 * 集成所有AI功能模块，提供智能政策服务
 */

import React, { useState, useEffect } from 'react';
import { message, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PageWrapper from '../../components/PageWrapper';
import AISearchBar from './components/AISearchBar';
import CompanyProfileModal from './components/CompanyProfileModal';
import PolicyCardList from './components/PolicyCardList';
import AIToolsPanel from './components/AIToolsPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import styles from './AIPolicyCenter.module.css';
import {
  CompanyProfile,
  PolicyInfo,
  ApplicationEligibility,
  AIInsights,
  MaterialGenerationRequest,
  ApplicationProgress,
  PolicySubscription,
} from './types';

const AIPolicyCenter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [policies, setPolicies] = useState<PolicyInfo[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyInfo | undefined>();
  const [insights, setInsights] = useState<AIInsights>({
    applicablePoliciesCount: 0,
    estimatedTotalSubsidy: 0,
    highMatchPoliciesCount: 0,
    priorityRecommendations: [],
    qualificationGaps: [],
    lastUpdated: new Date().toISOString(),
  });

  // 初始化加载模拟数据
  useEffect(() => {
    loadMockData();
  }, []);

  // 加载模拟数据
  const loadMockData = () => {
    // 模拟政策数据
    const mockPolicies: PolicyInfo[] = [
      {
        id: 'p1',
        title: '2024年北京市科技创新补贴政策',
        category: '补贴',
        level: '市级',
        publishDate: '2024-01-01',
        deadline: '2024-03-31',
        status: 'active',
        tags: ['科技创新', '研发补贴', '小微企业'],
        summary: '支持科技型中小企业开展技术创新活动，最高补贴50万元',
        content: '',
        matchScore: 92,
        matchReason: '适配你的"北京+小型科技企业+高新技术企业"属性',
        applicationConditions: {
          hard: [
            '在北京市注册的科技型中小企业',
            '具有高新技术企业资质',
            '年研发投入占营收比例≥5%',
          ],
          soft: ['拥有发明专利', '参与过国家级科研项目'],
        },
        requiredMaterials: [
          { name: '企业资质证明', type: 'seal-required', required: true },
          { name: '研发投入证明', type: 'ai-generated', required: true },
          { name: '项目可行性报告', type: 'ai-generated', required: true },
          { name: '财务审计报告', type: 'third-party-certified', required: true },
        ],
        subsidy: {
          min: 10,
          max: 50,
          average: 30,
          unit: '万元',
        },
        applicationDifficulty: 'low',
        daysUntilDeadline: 15,
        isUrgent: true,
      },
      {
        id: 'p2',
        title: '专精特新企业认定',
        category: '资质认定',
        level: '国家级',
        publishDate: '2023-12-15',
        deadline: '2024-06-30',
        status: 'active',
        tags: ['专精特新', '企业认定'],
        summary: '国家级专精特新"小巨人"企业认定，享受多项政策扶持',
        content: '',
        matchScore: 78,
        matchReason: '企业规模和行业符合认定条件',
        applicationConditions: {
          hard: [
            '成立时间≥3年',
            '主营业务收入占比≥70%',
            '近两年研发费用占营收比例≥3%',
          ],
          soft: ['拥有核心技术专利', '参与行业标准制定'],
        },
        requiredMaterials: [
          { name: '企业基本信息表', type: 'ai-generated', required: true },
          { name: '专利证书', type: 'seal-required', required: true },
          { name: '财务报表', type: 'third-party-certified', required: true },
        ],
        applicationDifficulty: 'medium',
        daysUntilDeadline: 90,
        isUrgent: false,
      },
      {
        id: 'p3',
        title: '企业数字化转型补贴',
        category: '补贴',
        level: '省级',
        publishDate: '2024-01-10',
        deadline: '2024-12-31',
        status: 'active',
        tags: ['数字化', '转型升级'],
        summary: '支持企业进行数字化、智能化改造，最高补贴30万元',
        content: '',
        matchScore: 85,
        matchReason: '符合软件企业数字化转型政策导向',
        applicationConditions: {
          hard: [
            '软件和信息技术服务业企业',
            '数字化改造投入≥20万元',
            '有明确的数字化转型方案',
          ],
          soft: ['已获得相关行业认证', '有成功案例'],
        },
        requiredMaterials: [
          { name: '数字化转型方案', type: 'ai-generated', required: true },
          { name: '投入证明材料', type: 'seal-required', required: true },
          { name: '技术方案说明', type: 'ai-generated', required: true },
        ],
        subsidy: {
          min: 10,
          max: 30,
          average: 20,
          unit: '万元',
        },
        applicationDifficulty: 'low',
        daysUntilDeadline: 180,
        isUrgent: false,
      },
    ];

    setPolicies(mockPolicies);

    // 模拟洞察数据
    const mockInsights: AIInsights = {
      applicablePoliciesCount: 12,
      estimatedTotalSubsidy: 85,
      highMatchPoliciesCount: 5,
      priorityRecommendations: [
        {
          policyId: 'p1',
          policyTitle: '2024年北京市科技创新补贴政策',
          priority: 'high',
          reason: '补贴50万+申报难度低+剩余15天截止，建议立即申报',
          subsidy: 50,
          difficulty: 'low',
          daysRemaining: 15,
        },
        {
          policyId: 'p3',
          policyTitle: '企业数字化转型补贴',
          priority: 'medium',
          reason: '补贴30万+申报难度低+剩余180天截止',
          subsidy: 30,
          difficulty: 'low',
          daysRemaining: 180,
        },
        {
          policyId: 'p2',
          policyTitle: '专精特新企业认定',
          priority: 'low',
          reason: '无直接补贴+需补充专利资质+长期有效',
          difficulty: 'medium',
          daysRemaining: 90,
        },
      ],
      qualificationGaps: [
        {
          qualification: '发明专利',
          requiredBy: ['p1', 'p2'],
          acquisitionPath: '可申报"专利资助政策"，获取发明专利后再申报目标政策',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    setInsights(mockInsights);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setLoading(true);
    message.info(`AI正在搜索: ${query}`);
    
    // 模拟AI搜索
    setTimeout(() => {
      setLoading(false);
      message.success('搜索完成');
      // 这里可以根据搜索结果更新政策列表
    }, 1500);
  };

  // 保存企业画像
  const handleSaveProfile = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    localStorage.setItem('companyProfile', JSON.stringify(profile));
    message.success('企业画像已保存，AI将基于此为您推荐政策');
    
    // 重新加载推荐政策
    loadMockData();
  };

  // 刷新推荐
  const handleRefreshPolicies = () => {
    setLoading(true);
    message.info('AI正在重新推荐政策...');
    
    setTimeout(() => {
      setLoading(false);
      message.success('推荐已更新');
      loadMockData();
    }, 1000);
  };

  // AI解读
  const handleAIAnalysis = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId);
    if (!policy) return;

    Modal.info({
      title: 'AI政策解读',
      width: 700,
      content: (
        <div style={{ marginTop: 16 }}>
          <h3>{policy.title}</h3>
          <div style={{ marginTop: 16, lineHeight: 1.8 }}>
            <p><strong>政策概述：</strong>{policy.summary}</p>
            <p><strong>适用对象：</strong>符合条件的{policy.category}企业</p>
            <p><strong>核心优势：</strong></p>
            <ul>
              <li>申报难度{policy.applicationDifficulty === 'low' ? '低' : policy.applicationDifficulty === 'medium' ? '中等' : '较高'}，通过率较高</li>
              {policy.subsidy && <li>最高可获得{policy.subsidy.max}{policy.subsidy.unit}补贴</li>}
              <li>AI可辅助生成{policy.requiredMaterials.filter(m => m.type === 'ai-generated').length}份申报材料</li>
            </ul>
            <p><strong>AI建议：</strong>根据您的企业画像，该政策匹配度为{policy.matchScore}%，建议{policy.isUrgent ? '尽快' : '适时'}申报。</p>
          </div>
        </div>
      ),
    });
  };

  // 检查申报资格
  const handleCheckEligibility = async (policyId: string): Promise<ApplicationEligibility> => {
    // 模拟AI分析
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const policy = policies.find((p) => p.id === policyId);
    const hasProfile = !!companyProfile;

    if (!hasProfile) {
      return {
        eligible: false,
        probability: 0,
        status: 'not-qualified',
        reasons: ['请先完善企业画像信息'],
        suggestions: ['点击右上角"绑定企业信息"完善企业画像'],
      };
    }

    // 模拟适配性分析
    const matchScore = policy?.matchScore || 0;
    
    if (matchScore >= 80) {
      return {
        eligible: true,
        probability: matchScore,
        status: 'qualified',
        reasons: [
          '企业规模符合要求',
          '行业类别匹配',
          '所在地区符合政策范围',
        ],
        suggestions: [
          '建议尽快准备申报材料',
          '可使用AI材料生成功能辅助准备',
        ],
      };
    } else if (matchScore >= 60) {
      return {
        eligible: true,
        probability: matchScore,
        status: 'partially-qualified',
        reasons: [
          '基本条件符合',
          '部分软性条件不满足',
        ],
        suggestions: [
          '建议补充发明专利等资质',
          '完善研发投入证明材料',
        ],
        missingRequirements: ['发明专利', '行业认证'],
      };
    } else {
      return {
        eligible: false,
        probability: matchScore,
        status: 'not-qualified',
        reasons: [
          '企业规模暂不符合要求',
          '缺少必要资质认证',
        ],
        suggestions: [
          '建议先申报相关资质认定',
          '达到条件后再申报此政策',
        ],
        missingRequirements: ['高新技术企业认定', '专利数量不足'],
      };
    }
  };

  // 政策对比
  const handleComparePolicies = (policyIds: string[]) => {
    const selectedPolicies = policies.filter((p) => policyIds.includes(p.id));
    
    Modal.info({
      title: 'AI政策对比分析',
      width: 900,
      content: (
        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '2px solid #1890ff' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>对比项</th>
                {selectedPolicies.map((p) => (
                  <th key={p.id} style={{ padding: 12, textAlign: 'left' }}>
                    {p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>匹配度</td>
                {selectedPolicies.map((p) => (
                  <td key={p.id} style={{ padding: 12 }}>
                    {p.matchScore}%
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>补贴金额</td>
                {selectedPolicies.map((p) => (
                  <td key={p.id} style={{ padding: 12 }}>
                    {p.subsidy ? `${p.subsidy.max}${p.subsidy.unit}` : '-'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>申报难度</td>
                {selectedPolicies.map((p) => (
                  <td key={p.id} style={{ padding: 12 }}>
                    {p.applicationDifficulty === 'low' ? '低' : p.applicationDifficulty === 'medium' ? '中' : '高'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>截止时间</td>
                {selectedPolicies.map((p) => (
                  <td key={p.id} style={{ padding: 12 }}>
                    {p.daysUntilDeadline ? `剩余${p.daysUntilDeadline}天` : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ),
    });
  };

  // 生成材料
  const handleGenerateMaterial = async (request: MaterialGenerationRequest) => {
    message.loading('AI正在生成材料...', 2);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    message.success('材料生成成功！');
  };

  // 跟踪进度
  const handleTrackProgress = (progress: ApplicationProgress) => {
    message.success('申报进度跟踪已添加');
  };

  // 订阅政策
  const handleSubscribe = (subscription: PolicySubscription) => {
    message.success('政策订阅已添加，有新政策时将及时通知您');
  };

  // 政策点击
  const handlePolicyClick = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId);
    setSelectedPolicy(policy);
    message.info(`查看政策: ${policy?.title}`);
  };

  // 资质指南
  const handleQualificationGuide = (qualification: string) => {
    Modal.info({
      title: `${qualification}获取指南`,
      width: 600,
      content: (
        <div style={{ marginTop: 16, lineHeight: 1.8 }}>
          <h4>获取途径：</h4>
          <ol>
            <li>准备相关技术文档和创新证明材料</li>
            <li>向国家知识产权局提交申请</li>
            <li>等待审查（一般需要18-24个月）</li>
            <li>获得授权后领取证书</li>
          </ol>
          <h4>相关政策支持：</h4>
          <ul>
            <li>专利申请资助政策（最高补贴5000元）</li>
            <li>知识产权贯标补贴</li>
          </ul>
        </div>
      ),
    });
  };

  return (
    <PageWrapper title="">
      <div className={styles.aiPolicyCenter}>
        <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 48 }} />}>
          {/* 顶部AI交互区 */}
          <div className={styles.topSection}>
            <AISearchBar
              onSearch={handleSearch}
              onProfileClick={() => setShowProfileModal(true)}
              companyProfileExists={!!companyProfile}
            />
          </div>

          {/* 中间政策服务区 */}
          <div className={styles.middleSection}>
            <PolicyCardList
              policies={policies}
              onRefresh={handleRefreshPolicies}
              onAIAnalysis={handleAIAnalysis}
              onCheckEligibility={handleCheckEligibility}
              onCompare={handleComparePolicies}
            />

            <AIToolsPanel
              selectedPolicy={selectedPolicy}
              onGenerateMaterial={handleGenerateMaterial}
              onTrackProgress={handleTrackProgress}
              onSubscribe={handleSubscribe}
            />
          </div>

          {/* 底部洞察区 */}
          <AIInsightsPanel
            insights={insights}
            onPolicyClick={handlePolicyClick}
            onQualificationGuide={handleQualificationGuide}
          />
        </Spin>

        {/* 企业画像弹窗 */}
        <CompanyProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfile}
          initialProfile={companyProfile || undefined}
        />
      </div>
    </PageWrapper>
  );
};

export default AIPolicyCenter;
