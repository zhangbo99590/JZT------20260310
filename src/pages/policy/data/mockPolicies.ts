/**
 * 模拟政策数据
 * 用于测试搜索和筛选功能
 */

export interface PolicyData {
  id: string;
  title: string;
  originalTitle?: string;
  content: string;
  summary: string;
  industry: string;
  publishDate: string;
  department: string;
  publishOrg?: string;
  region: string;
  district: string;
  level: string;
  subsidyType: string;
  subsidyAmount?: string;
  amount?: string;
  approvedCompanies?: number;
  subsidyAmountDetail?: {
    central?: number;
    provincial?: number;
    municipal?: number;
    district?: number;
  };
  tags: string[];
  type: "policy" | "project" | "enterprise";
  category: string;
  orgType: string;
  policyOrg: string;
  matchScore?: number;
}

export const mockPolicies: PolicyData[] = [
  {
    id: "1",
    title: "北京市丰台区促进金融科技创新发展专项资金管理办法",
    originalTitle:
      "关于印发《北京市丰台区促进金融科技创新发展专项资金管理办法》的通知",
    content:
      "为深入贯彻落实国家金融科技发展战略，推动丰台区金融科技产业高质量发展，特制定本办法。支持金融科技企业技术创新、产品研发、场景应用等方面的发展。",
    summary:
      "支持丰台区金融科技企业创新发展，提供专项资金支持技术创新、产品研发等，最高补贴500万元。",
    industry: "工业、交通 / 信息产业（含电信）",
    publishDate: "2024-03-15",
    department: "丰台区金融服务办公室",
    publishOrg: "丰台区金融服务办公室",
    region: "北京市",
    district: "丰台区",
    level: "区级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高500万元",
    amount: "最高500万元",
    approvedCompanies: 156,
    subsidyAmountDetail: {
      district: 500,
    },
    tags: ["金融科技", "创新发展", "专项资金"],
    type: "policy",
    category: "政策文件",
    orgType: "government",
    policyOrg: "local_gov",
    matchScore: 92,
  },
  {
    id: "2",
    title: "朝阳区高新技术企业认定奖励政策实施细则",
    originalTitle: "关于朝阳区高新技术企业认定奖励政策的实施细则",
    content:
      "为鼓励企业加大研发投入，提升自主创新能力，对通过高新技术企业认定的企业给予奖励支持。包括首次认定奖励、重新认定奖励等。",
    summary:
      "对通过高新技术企业认定的朝阳区企业给予奖励，首次认定奖励30万元，重新认定奖励20万元。",
    industry: "科技、教育 / 科技",
    publishDate: "2024-02-20",
    department: "朝阳区科学技术委员会",
    region: "北京市",
    district: "朝阳区",
    level: "区县级",
    subsidyType: "award_reward",
    subsidyAmount: "最高30万元",
    tags: ["高新技术企业", "认定奖励", "科技创新"],
    type: "policy",
    category: "科技创新",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "3",
    title: "海淀区专精特新企业培育支持政策",
    originalTitle: "海淀区关于支持专精特新企业发展的若干措施",
    content:
      "支持区内中小企业走专精特新发展道路，在技术创新、市场拓展、人才培养等方面给予全方位支持。",
    summary:
      "支持海淀区专精特新企业发展，提供技术创新、市场拓展、人才培养等全方位支持，最高补贴200万元。",
    industry: "工业、交通 / 其他",
    publishDate: "2024-01-10",
    department: "海淀区经济和信息化局",
    region: "北京市",
    district: "海淀区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高200万元",
    tags: ["专精特新", "中小企业", "产业扶持"],
    type: "policy",
    category: "产业扶持",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "4",
    title: "东城区人才引进专项计划实施方案",
    originalTitle: "关于实施东城区高层次人才引进专项计划的通知",
    content:
      "为加强人才队伍建设，吸引高层次人才来东城区创新创业，制定人才引进专项计划，提供住房补贴、科研资助等支持。",
    summary:
      "东城区高层次人才引进计划，提供住房补贴、科研资助等支持，博士人才最高补贴100万元。",
    industry: "综合政务 / 政务公开",
    publishDate: "2024-04-05",
    department: "东城区人力资源和社会保障局",
    region: "北京市",
    district: "东城区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高100万元",
    tags: ["人才引进", "高层次人才", "住房补贴"],
    type: "policy",
    category: "人才引进",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "5",
    title: "西城区绿色发展专项基金管理办法",
    originalTitle: "西城区绿色发展专项基金管理办法（试行）",
    content:
      "支持区内企业开展绿色技术创新、节能减排、环境保护等项目，推动绿色低碳发展。",
    summary:
      "西城区绿色发展专项基金，支持企业绿色技术创新、节能减排项目，最高支持300万元。",
    industry: "城乡建设、环境保护 / 节能与资源综合利用",
    publishDate: "2024-03-01",
    department: "西城区发展和改革委员会",
    region: "北京市",
    district: "西城区",
    level: "区县级",
    subsidyType: "fund_support",
    subsidyAmount: "最高300万元",
    tags: ["绿色发展", "节能减排", "环境保护"],
    type: "policy",
    category: "环保节能",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "6",
    title: "石景山区数字经济产业发展扶持政策",
    originalTitle: "石景山区促进数字经济产业发展的若干政策措施",
    content:
      "加快推进数字经济产业发展，支持数字技术创新应用、数字化转型升级等，打造数字经济发展高地。",
    summary:
      "石景山区数字经济产业扶持政策，支持数字技术创新、数字化转型，最高补贴400万元。",
    industry: "工业、交通 / 信息产业（含电信）",
    publishDate: "2024-02-15",
    department: "石景山区经济和信息化局",
    region: "北京市",
    district: "石景山区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高400万元",
    tags: ["数字经济", "数字化转型", "产业发展"],
    type: "policy",
    category: "产业扶持",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "7",
    title: "通州区文化创意产业发展专项资金",
    originalTitle: "通州区文化创意产业发展专项资金管理暂行办法",
    content:
      "支持文化创意产业发展，鼓励原创内容创作、文化科技融合、文化品牌建设等。",
    summary:
      "通州区文化创意产业专项资金，支持原创内容创作、文化科技融合，最高资助150万元。",
    industry: "其他",
    publishDate: "2024-01-25",
    department: "通州区文化和旅游局",
    region: "北京市",
    district: "通州区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高150万元",
    tags: ["文化创意", "原创内容", "文化科技"],
    type: "policy",
    category: "文化产业",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "8",
    title: "顺义区现代服务业发展引导基金",
    originalTitle: "顺义区现代服务业发展引导基金设立方案",
    content:
      "设立现代服务业发展引导基金，重点支持金融服务、现代物流、信息服务等现代服务业发展。",
    summary:
      "顺义区现代服务业引导基金，重点支持金融服务、现代物流、信息服务等领域发展。",
    industry: "商贸、海关、旅游 / 旅游",
    publishDate: "2024-03-20",
    department: "顺义区商务局",
    region: "北京市",
    district: "顺义区",
    level: "区县级",
    subsidyType: "fund_support",
    subsidyAmount: "基金投资",
    tags: ["现代服务业", "金融服务", "现代物流"],
    type: "policy",
    category: "产业扶持",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "9",
    title: "昌平区生物医药产业创新发展政策",
    originalTitle: "昌平区促进生物医药产业创新发展的实施意见",
    content:
      "加快生物医药产业发展，支持新药研发、临床试验、产业化等环节，打造生物医药产业集群。",
    summary:
      "昌平区生物医药产业政策，支持新药研发、临床试验、产业化，最高补贴600万元。",
    industry: "卫生、体育 / 医药管理",
    publishDate: "2024-02-28",
    department: "昌平区科学技术委员会",
    region: "北京市",
    district: "昌平区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高600万元",
    tags: ["生物医药", "新药研发", "产业集群"],
    type: "policy",
    category: "生物医药",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "10",
    title: "大兴区新能源汽车产业发展支持政策",
    originalTitle: "大兴区新能源汽车产业发展支持政策实施细则",
    content:
      "支持新能源汽车产业发展，包括整车制造、关键零部件、充电基础设施等全产业链发展。",
    summary:
      "大兴区新能源汽车产业支持政策，涵盖整车制造、零部件、充电设施全产业链，最高补贴800万元。",
    industry: "工业、交通 / 其他",
    publishDate: "2024-01-15",
    department: "大兴区经济和信息化局",
    region: "北京市",
    district: "大兴区",
    level: "区县级",
    subsidyType: "direct_subsidy",
    subsidyAmount: "最高800万元",
    tags: ["新能源汽车", "整车制造", "充电设施"],
    type: "policy",
    category: "新能源",
    orgType: "government",
    policyOrg: "local_gov",
  },
  {
    id: "11",
    title: "东城区节能减排综合奖励办法",
    originalTitle: "东城区关于进一步促进节能减排工作的奖励办法",
    content:
      "为推动东城区生态文明建设，鼓励企业开展节能技术改造和资源综合利用，给予专项奖励支持。",
    summary:
      "东城区节能减排奖励，支持企业节能改造、资源利用，最高奖励200万元。",
    industry: "城乡建设、环境保护 / 节能与资源综合利用",
    publishDate: "2024-03-10",
    department: "东城区生态环境局",
    region: "北京市",
    district: "东城区",
    level: "区县级",
    subsidyType: "award_reward",
    subsidyAmount: "最高200万元",
    tags: ["节能减排", "环境保护", "绿色发展"],
    type: "policy",
    category: "环保节能",
    orgType: "government",
    policyOrg: "local_gov",
  },
];

// 热门搜索关键词
export const hotSearchKeywords = [
  "高新技术企业认定",
  "专精特新企业",
  "研发费用加计扣除",
  "科技创新券",
  "人才引进政策",
  "金融科技创新",
  "数字经济发展",
  "绿色发展基金",
];
