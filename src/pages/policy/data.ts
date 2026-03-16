/**
 * 政策搜索页面数据配置
 * 包含企业信息、政策推荐等数据
 */

// 已关联企业列表
export const ASSOCIATED_COMPANIES = [
  "北京智行科技有限公司",
  "北京创新软件有限公司",
  "北京数字未来科技有限公司"
];

// 默认企业
export const DEFAULT_COMPANY = "北京智行科技有限公司";

// 企业信息映射
export const COMPANY_INFO_MAP: Record<string, {
  name: string;
  tags: string[];
  completeness: number;
  missing?: string;
}> = {
  "北京智行科技有限公司": {
    name: "北京智行科技有限公司",
    tags: ["高新技术企业", "软件企业", "专精特新"],
    completeness: 85,
    missing: "近三年营收数据"
  },
  "北京创新软件有限公司": {
    name: "北京创新软件有限公司",
    tags: ["软件企业", "科技型中小企业"],
    completeness: 60,
    missing: "知识产权、近三年营收数据"
  },
  "北京数字未来科技有限公司": {
    name: "北京数字未来科技有限公司",
    tags: ["高新技术企业"],
    completeness: 95,
    missing: ""
  }
};

// 政策数据接口
export interface PolicyData {
  id: string;
  title: string;
  category: string;
  level: string;
  amount: string;
  deadline: string;
  matchScore?: number;
  tags?: string[];
  isEligible?: boolean;
  missingConditions?: string[];
  description?: string;
}

// 增强版政策数据（用于分类展示）
export const enhancedPolicyData: PolicyData[] = [
  {
    id: "1",
    title: "朝阳区促进商务经济高质量发展引导资金",
    category: "商务发展",
    level: "区级",
    amount: "最高1000万元",
    deadline: "2026-06-30",
    matchScore: 92,
    tags: ["商务服务", "市场推广"],
    isEligible: true,
    description: "促进产品销售 / 提升企业市场竞争优势 / 企业市场推广补贴"
  },
  {
    id: "2",
    title: "北京市专精特新中小企业认定",
    category: "企业认定",
    level: "市级",
    amount: "资质认定",
    deadline: "2026-05-31",
    matchScore: 88,
    tags: ["专精特新", "中小企业"],
    isEligible: true,
    description: "提升企业竞争力 / 获得政策支持 / 优先申报其他项目"
  },
  {
    id: "3",
    title: "高新技术企业研发费用加计扣除",
    category: "税收优惠",
    level: "国家级",
    amount: "税收减免",
    deadline: "2026-12-31",
    matchScore: 85,
    tags: ["研发费用", "税收优惠"],
    isEligible: false,
    missingConditions: ["需补充近三年研发费用明细"],
    description: "研发费用税前加计扣除100% / 降低企业税负"
  },
  {
    id: "4",
    title: "北京市科技型中小企业评价",
    category: "企业认定",
    level: "市级",
    amount: "资质认定",
    deadline: "2026-04-30",
    matchScore: 82,
    tags: ["科技型企业", "中小企业"],
    isEligible: true,
    description: "获得科技型中小企业资质 / 享受研发费用加计扣除"
  },
  {
    id: "5",
    title: "中关村高新技术企业培育资金",
    category: "资金支持",
    level: "市级",
    amount: "最高500万元",
    deadline: "2026-07-31",
    matchScore: 78,
    tags: ["高新技术", "培育资金"],
    isEligible: false,
    missingConditions: ["需在中关村示范区注册"],
    description: "支持高新技术企业发展 / 研发投入补贴"
  },
  {
    id: "6",
    title: "北京市稳岗补贴政策",
    category: "人力资源",
    level: "市级",
    amount: "按比例返还",
    deadline: "2026-08-31",
    matchScore: 75,
    tags: ["稳岗", "社保"],
    isEligible: true,
    description: "稳定就业岗位 / 返还失业保险费"
  },
  {
    id: "7",
    title: "创业担保贷款贴息政策",
    category: "金融支持",
    level: "市级",
    amount: "最高300万元",
    deadline: "2026-09-30",
    matchScore: 72,
    tags: ["创业", "贷款贴息"],
    isEligible: true,
    description: "降低融资成本 / 支持创业发展"
  },
  {
    id: "8",
    title: "北京市知识产权资助政策",
    category: "知识产权",
    level: "市级",
    amount: "最高50万元",
    deadline: "2026-10-31",
    matchScore: 70,
    tags: ["专利", "知识产权"],
    isEligible: true,
    description: "专利申请资助 / 知识产权保护"
  }
];
