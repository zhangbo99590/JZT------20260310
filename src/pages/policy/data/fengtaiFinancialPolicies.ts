/**
 * 丰台区金融补贴政策模拟数据
 * 包含13条政策文件和1条相关项目，与企知道数据结构对齐
 */

import { EnhancedPolicyData } from "./enhancedPolicyData";

// 政策文件类型定义
export interface PolicyFileData extends EnhancedPolicyData {
  originalTitle: string; // 原文标题
  content: string; // 正文内容
  policyType: "policy" | "project"; // 政策类型
  supportAmount?: string; // 支持力度
  applicationConditions?: string[]; // 申报条件
}

// 13条丰台区金融补贴政策文件
export const fengtaiFinancialPolicies: PolicyFileData[] = [
  {
    id: "fengtai_finance_001",
    title: '"十四五"时期丰台区金融业发展规划',
    originalTitle:
      '北京市丰台区人民政府关于印发"十四五"时期丰台区金融业发展规划的通知',
    tags: [
      {
        text: "产业规划",
        type: "category",
        color: "#faad14",
        bgColor: "#fffbe6",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "总投资100亿元",
    maxReward: "单项最高1000万元",
    approvedCompanies: "预计惠及800家",
    applicableIndustries: [
      "保险业",
      "其他金融业",
      "货币金融服务",
      "资本市场服务",
      "金融科技",
    ],
    publishDate: "2021年12月27日",
    publishOrg: "北京市丰台区人民政府",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "产业规划",
    keywords: ["丰台区", "金融业", "发展规划", "十四五", "金融服务"],
    matchScore: 98,
    content:
      '为深入贯彻落实党中央、国务院关于金融工作的决策部署，推动丰台区金融业高质量发展，根据《北京市"十四五"时期金融业发展规划》，结合丰台区实际，制定本规划。丰台区金融服务办公室将统筹推进金融业发展各项工作，重点支持金融科技创新发展。',
    policyType: "policy",
  },
  {
    id: "fengtai_finance_002",
    title:
      "丰台区发展和改革委员会关于公开征集丰台区互联网金融风险监测预警服务机构的公告",
    originalTitle:
      "丰台区发展和改革委员会关于公开征集丰台区互联网金融风险监测预警服务机构的公告",
    tags: [
      {
        text: "申报通知",
        type: "announcement",
        color: "#ff7a45",
        bgColor: "#fff2e8",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算500万元",
    maxReward: "服务费最高200万元",
    approvedCompanies: "征集3-5家",
    applicableIndustries: [
      "其他金融业",
      "金融业",
      "互联网金融",
      "风险管理服务",
    ],
    publishDate: "2024年05月15日",
    publishOrg: "北京市丰台区发展和改革委员会",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "申报通知",
    keywords: ["丰台区", "互联网金融", "风险监测", "服务机构", "公告"],
    matchScore: 95,
    content:
      "为加强丰台区互联网金融风险防控工作，建立健全风险监测预警机制，现面向社会公开征集互联网金融风险监测预警服务机构。丰台区金融服务办公室负责具体实施工作，重点关注金融科技领域的风险防控。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_003",
    title: "丰台区金融业发展专项资金管理办法",
    originalTitle:
      "北京市丰台区人民政府办公室关于印发丰台区金融业发展专项资金管理办法的通知",
    tags: [
      {
        text: "奖励文件",
        type: "category",
        color: "#f5222d",
        bgColor: "#fff1f0",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算5000万元",
    maxReward: "单项最高500万元",
    approvedCompanies: "已支持156家",
    applicableIndustries: [
      "银行业",
      "保险业",
      "证券业",
      "其他金融业",
      "金融科技",
    ],
    publishDate: "2023年03月20日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "资金管理",
    keywords: ["丰台区", "金融业", "专项资金", "管理办法", "补贴"],
    matchScore: 97,
    content:
      "为规范丰台区金融业发展专项资金使用管理，提高资金使用效益，支持金融业健康发展，制定本办法。专项资金重点支持在丰台区注册的金融机构、金融科技企业等，由丰台区金融服务办公室负责资金管理和项目审核。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_004",
    title: "丰台区促进金融科技创新发展若干措施",
    originalTitle:
      "北京市丰台区人民政府关于印发丰台区促进金融科技创新发展若干措施的通知",
    tags: [
      {
        text: "扶持政策",
        type: "category",
        color: "#52c41a",
        bgColor: "#f6ffed",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算3000万元",
    maxReward: "单企业最高300万元",
    approvedCompanies: "已扶持89家",
    applicableIndustries: [
      "金融科技",
      "软件和信息技术服务业",
      "其他金融业",
      "科学研究和技术服务业",
    ],
    publishDate: "2024年01月10日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "扶持政策",
    keywords: ["丰台区", "金融科技", "创新发展", "扶持措施", "补贴"],
    matchScore: 96,
    content:
      "为深入贯彻落实国家金融科技发展战略，推动丰台区金融科技产业创新发展，营造良好的金融科技发展环境，制定本措施。重点支持人工智能、区块链、大数据等技术在金融领域的应用创新，丰台区金融服务办公室统筹实施相关扶持政策。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_005",
    title: "丰台区金融机构落户奖励实施细则",
    originalTitle:
      "北京市丰台区金融服务办公室关于印发丰台区金融机构落户奖励实施细则的通知",
    tags: [
      {
        text: "奖励文件",
        type: "category",
        color: "#f5222d",
        bgColor: "#fff1f0",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算2000万元",
    maxReward: "单机构最高800万元",
    approvedCompanies: "已奖励23家",
    applicableIndustries: [
      "银行业",
      "保险业",
      "证券业",
      "基金管理",
      "其他金融业",
    ],
    publishDate: "2023年09月08日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "落户奖励",
    keywords: ["丰台区", "金融机构", "落户奖励", "实施细则", "补贴"],
    matchScore: 94,
    content:
      "为吸引优质金融机构在丰台区落户发展，优化区域金融生态环境，根据相关政策规定，制定本实施细则。对在丰台区新设立或迁入的金融机构给予落户奖励，丰台区金融服务办公室负责奖励资金的审核发放工作。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_006",
    title: "丰台区小微企业金融服务创新试点工作方案",
    originalTitle:
      "北京市丰台区人民政府办公室关于印发丰台区小微企业金融服务创新试点工作方案的通知",
    tags: [
      {
        text: "试点方案",
        type: "category",
        color: "#722ed1",
        bgColor: "#f9f0ff",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "试点资金1500万元",
    maxReward: "单项目最高100万元",
    approvedCompanies: "试点企业200家",
    applicableIndustries: [
      "小微企业金融服务",
      "普惠金融",
      "其他金融业",
      "金融科技",
    ],
    publishDate: "2024年03月25日",
    publishOrg: "北京市丰台区发展和改革委员会",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "试点方案",
    keywords: ["丰台区", "小微企业", "金融服务", "创新试点", "补贴"],
    matchScore: 93,
    content:
      "为深入推进小微企业金融服务创新，缓解小微企业融资难融资贵问题，根据国家和北京市相关政策要求，结合丰台区实际，制定本工作方案。丰台区金融服务办公室会同相关部门共同推进试点工作实施。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_007",
    title: "丰台区绿色金融发展支持政策",
    originalTitle:
      "北京市丰台区人民政府关于印发丰台区绿色金融发展支持政策的通知",
    tags: [
      {
        text: "支持政策",
        type: "category",
        color: "#13c2c2",
        bgColor: "#e6fffb",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算1000万元",
    maxReward: "单项目最高200万元",
    approvedCompanies: "已支持45家",
    applicableIndustries: [
      "绿色金融",
      "环保产业",
      "其他金融业",
      "可持续发展金融",
    ],
    publishDate: "2024年06月12日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "绿色金融",
    keywords: ["丰台区", "绿色金融", "发展支持", "环保", "补贴"],
    matchScore: 91,
    content:
      "为推动丰台区绿色金融发展，支持绿色产业和项目融资，促进经济社会可持续发展，制定本支持政策。重点支持绿色信贷、绿色债券、绿色保险等金融产品创新，丰台区金融服务办公室负责政策实施和监督管理。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_008",
    title: "丰台区数字金融产业园区建设实施方案",
    originalTitle:
      "北京市丰台区人民政府办公室关于印发丰台区数字金融产业园区建设实施方案的通知",
    tags: [
      {
        text: "建设方案",
        type: "category",
        color: "#eb2f96",
        bgColor: "#fff0f6",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "建设投资20亿元",
    maxReward: "入驻企业最高500万元",
    approvedCompanies: "规划入驻100家",
    applicableIndustries: [
      "数字金融",
      "金融科技",
      "软件和信息技术服务业",
      "其他金融业",
    ],
    publishDate: "2023年11月30日",
    publishOrg: "北京市丰台区发展和改革委员会",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "园区建设",
    keywords: ["丰台区", "数字金融", "产业园区", "建设方案", "补贴"],
    matchScore: 92,
    content:
      "为加快推进丰台区数字金融产业发展，打造具有区域特色的数字金融产业集聚区，根据北京市数字经济发展规划，制定本实施方案。园区将重点引进金融科技、数字支付等领域的优质企业，丰台区金融服务办公室参与园区运营管理。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_009",
    title: "丰台区金融人才引进和培养办法",
    originalTitle:
      "北京市丰台区人民政府关于印发丰台区金融人才引进和培养办法的通知",
    tags: [
      {
        text: "人才政策",
        type: "category",
        color: "#fa8c16",
        bgColor: "#fff7e6",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算800万元",
    maxReward: "顶尖人才最高100万元",
    approvedCompanies: "已引进人才156人",
    applicableIndustries: ["金融业", "金融科技", "其他金融业", "人力资源服务"],
    publishDate: "2024年02月18日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "人才政策",
    keywords: ["丰台区", "金融人才", "引进培养", "人才政策", "补贴"],
    matchScore: 89,
    content:
      "为加强丰台区金融人才队伍建设，吸引和培养高层次金融人才，推动金融业高质量发展，制定本办法。重点引进金融科技、风险管理、资产管理等领域的专业人才，丰台区金融服务办公室负责人才认定和奖励发放。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_010",
    title: "丰台区金融风险防控专项行动方案",
    originalTitle:
      "北京市丰台区人民政府办公室关于印发丰台区金融风险防控专项行动方案的通知",
    tags: [
      {
        text: "行动方案",
        type: "category",
        color: "#a0d911",
        bgColor: "#fcffe6",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "专项资金600万元",
    maxReward: "风控系统最高150万元",
    approvedCompanies: "覆盖机构300家",
    applicableIndustries: ["金融业", "风险管理", "其他金融业", "金融科技"],
    publishDate: "2024年04月08日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "风险防控",
    keywords: ["丰台区", "金融风险", "防控", "专项行动", "补贴"],
    matchScore: 88,
    content:
      "为切实防范化解金融风险，维护区域金融稳定，保护金融消费者合法权益，根据国家和北京市金融监管要求，制定本专项行动方案。丰台区金融服务办公室牵头组织实施，重点加强对金融科技等新兴业态的风险监测。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_011",
    title: "丰台区普惠金融服务体系建设指导意见",
    originalTitle:
      "北京市丰台区人民政府关于印发丰台区普惠金融服务体系建设指导意见的通知",
    tags: [
      {
        text: "指导意见",
        type: "category",
        color: "#597ef7",
        bgColor: "#f0f5ff",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算1200万元",
    maxReward: "服务点最高50万元",
    approvedCompanies: "建设服务点80个",
    applicableIndustries: ["普惠金融", "小微金融", "其他金融业", "金融服务"],
    publishDate: "2023年07月22日",
    publishOrg: "北京市丰台区发展和改革委员会",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "普惠金融",
    keywords: ["丰台区", "普惠金融", "服务体系", "建设", "补贴"],
    matchScore: 90,
    content:
      "为完善丰台区普惠金融服务体系，提升金融服务覆盖面和便民程度，更好服务实体经济发展，制定本指导意见。重点推进普惠金融服务站点建设，丰台区金融服务办公室协调推进各项工作落实。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_012",
    title: "丰台区金融消费者权益保护工作实施办法",
    originalTitle:
      "北京市丰台区金融服务办公室关于印发丰台区金融消费者权益保护工作实施办法的通知",
    tags: [
      {
        text: "实施办法",
        type: "category",
        color: "#9254de",
        bgColor: "#f9f0ff",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算400万元",
    maxReward: "教育活动最高30万元",
    approvedCompanies: "覆盖消费者10万人",
    applicableIndustries: ["金融业", "消费者保护", "其他金融业", "金融教育"],
    publishDate: "2024年08月05日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "消费者保护",
    keywords: ["丰台区", "金融消费者", "权益保护", "实施办法", "补贴"],
    matchScore: 87,
    content:
      "为加强丰台区金融消费者权益保护工作，规范金融机构经营行为，提升金融消费者满意度，根据相关法律法规，制定本实施办法。丰台区金融服务办公室负责统筹协调全区金融消费者权益保护工作。",
    policyType: "policy",
  },
  {
    id: "fengtai_finance_013",
    title: "丰台区金融业对外开放合作促进办法",
    originalTitle:
      "北京市丰台区人民政府关于印发丰台区金融业对外开放合作促进办法的通知",
    tags: [
      {
        text: "促进办法",
        type: "category",
        color: "#ff85c0",
        bgColor: "#fff0f6",
      },
      { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
    ],
    fundingAmount: "年度预算2500万元",
    maxReward: "合作项目最高400万元",
    approvedCompanies: "已支持项目12个",
    applicableIndustries: [
      "国际金融",
      "跨境金融服务",
      "其他金融业",
      "金融合作",
    ],
    publishDate: "2023年12月15日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "对外合作",
    keywords: ["丰台区", "金融业", "对外开放", "合作促进", "补贴"],
    matchScore: 86,
    content:
      "为深化丰台区金融业对外开放，促进国际金融合作，吸引境外金融机构和资本参与区域发展，制定本促进办法。重点支持跨境金融服务、国际金融合作等项目，丰台区金融服务办公室负责政策实施和项目管理。",
    policyType: "policy",
  },
];

// 1条相关项目数据
export const fengtaiFinancialProject: PolicyFileData = {
  id: "fengtai_project_001",
  title: "丰台区金融补贴资金申报项目",
  originalTitle: "2024年度丰台区金融业发展专项资金申报项目",
  tags: [
    {
      text: "申报项目",
      type: "category",
      color: "#52c41a",
      bgColor: "#f6ffed",
    },
    { text: "区级", type: "level", color: "#1890ff", bgColor: "#e6f7ff" },
  ],
  fundingAmount: "项目总额3000万元",
  maxReward: "单个项目最高300万元",
  approvedCompanies: "计划支持50个项目",
  applicableIndustries: ["金融业", "金融科技", "其他金融业", "金融服务"],
  publishDate: "2024年09月01日",
  publishOrg: "北京市丰台区金融服务办公室",
  publishOrgIcon: "government",
  district: "丰台区",
  level: "区级",
  category: "申报项目",
  keywords: ["丰台区", "金融补贴", "申报项目", "专项资金", "项目"],
  matchScore: 99,
  content:
    "根据《丰台区金融业发展专项资金管理办法》，现启动2024年度专项资金申报工作。本次申报重点支持金融机构创新发展、金融科技应用、普惠金融服务等项目。丰台区金融服务办公室负责项目评审和资金拨付工作。",
  policyType: "project",
  supportAmount: "最高300万元资金支持",
  applicationConditions: [
    "在丰台区注册的金融机构或金融科技企业",
    "项目具有创新性和示范性",
    "符合国家和北京市金融发展政策导向",
    "项目实施方案可行，预期效果明确",
    "申报企业信用状况良好，无重大违法违规记录",
  ],
};

// 合并所有数据
export const allFengtaiFinancialData: PolicyFileData[] = [
  ...fengtaiFinancialPolicies,
  fengtaiFinancialProject,
];
