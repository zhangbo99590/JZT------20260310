/**
 * 增强版政策数据 - 1:1还原参考图片的政策卡片结构
 * 包含所有必需字段：主标题、标签、资助总额、最高奖励、已获批企业数、适用行业、发布日期、发布单位
 */

export interface EnhancedPolicyData {
  id: string;
  title: string; // 主标题
  tags: Array<{
    text: string;
    type: "announcement" | "level" | "status" | "category";
    color: string;
    bgColor: string;
  }>; // 标签（立项公示、省级等）
  fundingAmount: string; // 资助总额
  maxReward: string; // 最高奖励
  approvedCompanies: string; // 已获批企业数
  applicableIndustries: string[]; // 适用行业（数组）
  publishDate: string; // 发布日期
  publishOrg: string; // 发布单位
  publishOrgIcon?: string; // 发布单位图标
  district: string; // 区域
  level: string; // 级别
  category: string; // 类别
  keywords: string[]; // 关键词（用于搜索匹配）
  matchScore?: number; // 匹配分数
  segmentedKeywords?: string[]; // 分词后的关键词
}

import { segmentKeyword } from "../utils/keywordSegmentation";
import { allFengtaiFinancialData } from "./fengtaiFinancialPolicies";
import { mockPolicies } from "./mockPolicies";

// 转换mockPolicies为EnhancedPolicyData格式
const convertedMockPolicies: EnhancedPolicyData[] = mockPolicies.map((p) => ({
  id: `mock_${p.id}`,
  title: p.title,
  tags: p.tags.map((t) => ({
    text: t,
    type: "status",
    color: "#1890ff",
    bgColor: "#e6f7ff",
  })),
  fundingAmount: p.subsidyAmount || "未公开",
  maxReward: p.amount || "未公开",
  approvedCompanies: (p.approvedCompanies || 0) + "家",
  applicableIndustries: [p.industry],
  publishDate: p.publishDate,
  publishOrg: p.department || p.publishOrg || "未知机构",
  publishOrgIcon: "government",
  district: p.district || p.region || "北京市",
  level: p.level || "市级",
  category: p.category || "通用政策",
  keywords: [
    ...p.tags,
    ...segmentKeyword(p.title),
    p.district,
    p.publishOrg || "",
  ].filter(Boolean),
  matchScore: p.matchScore || 80,
}));

// 北京市国家级科技型中小企业认定相关政策数据
const originalPolicyDatabase: EnhancedPolicyData[] = [
  {
    id: "policy_001",
    title: "北京市2025年第一批国家级科技型中小企业认定公示名单",
    tags: [
      {
        text: "立项公示",
        type: "announcement",
        color: "#1890ff",
        bgColor: "#e6f7ff",
      },
      { text: "国家级", type: "level", color: "#f5222d", bgColor: "#fff1f0" },
    ],
    fundingAmount: "未公开",
    maxReward: "未公开",
    approvedCompanies: "3596家",
    applicableIndustries: [
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
      "批发和零售业",
      "建筑业",
      "交通运输、仓储和邮政业",
    ],
    publishDate: "2025年09月05日",
    publishOrg: "北京市科学技术委员会",
    publishOrgIcon: "government",
    district: "北京市",
    level: "国家级",
    category: "科技型企业认定",
    keywords: ["国家级", "科技型中小企业", "认定", "公示", "北京市"],
    matchScore: 95,
  },
  {
    id: "policy_002",
    title: "北京市2024年第二批国家级科技型中小企业认定公示名单",
    tags: [
      {
        text: "立项公示",
        type: "announcement",
        color: "#1890ff",
        bgColor: "#e6f7ff",
      },
      { text: "国家级", type: "level", color: "#f5222d", bgColor: "#fff1f0" },
    ],
    fundingAmount: "未公开",
    maxReward: "未公开",
    approvedCompanies: "4128家",
    applicableIndustries: [
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
      "批发和零售业",
      "租赁和商务服务业",
      "建筑业",
    ],
    publishDate: "2024年08月15日",
    publishOrg: "北京市科学技术委员会",
    publishOrgIcon: "government",
    district: "北京市",
    level: "国家级",
    category: "科技型企业认定",
    keywords: ["国家级", "科技型中小企业", "认定", "公示", "北京市"],
    matchScore: 94,
  },
  {
    id: "policy_003",
    title: "北京市2024年第一批国家级科技型中小企业认定公示名单",
    tags: [
      {
        text: "立项公示",
        type: "announcement",
        color: "#1890ff",
        bgColor: "#e6f7ff",
      },
      { text: "国家级", type: "level", color: "#f5222d", bgColor: "#fff1f0" },
    ],
    fundingAmount: "未公开",
    maxReward: "未公开",
    approvedCompanies: "3892家",
    applicableIndustries: [
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
      "批发和零售业",
      "建筑业",
      "交通运输、仓储和邮政业",
      "租赁和商务服务业",
    ],
    publishDate: "2024年04月20日",
    publishOrg: "北京市科学技术委员会",
    publishOrgIcon: "government",
    district: "北京市",
    level: "国家级",
    category: "科技型企业认定",
    keywords: ["国家级", "科技型中小企业", "认定", "公示", "北京市"],
    matchScore: 93,
  },
  {
    id: "policy_004",
    title: "北京市2023年第三批国家级科技型中小企业认定公示名单",
    tags: [
      {
        text: "立项公示",
        type: "announcement",
        color: "#1890ff",
        bgColor: "#e6f7ff",
      },
      { text: "国家级", type: "level", color: "#f5222d", bgColor: "#fff1f0" },
    ],
    fundingAmount: "未公开",
    maxReward: "未公开",
    approvedCompanies: "2756家",
    applicableIndustries: [
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
      "批发和零售业",
      "建筑业",
    ],
    publishDate: "2023年12月08日",
    publishOrg: "北京市科学技术委员会",
    publishOrgIcon: "government",
    district: "北京市",
    level: "国家级",
    category: "科技型企业认定",
    keywords: ["国家级", "科技型中小企业", "认定", "公示", "北京市"],
    matchScore: 92,
  },
  {
    id: "policy_005",
    title: "朝阳区2024年高新技术企业认定奖励政策实施细则",
    tags: [
      {
        text: "政策文件",
        type: "category",
        color: "#52c41a",
        bgColor: "#f6ffed",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "总计1500万元",
    maxReward: "首次认定30万元",
    approvedCompanies: "892家",
    applicableIndustries: [
      "高新技术产业",
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
    ],
    publishDate: "2024年02月20日",
    publishOrg: "朝阳区科学技术委员会",
    publishOrgIcon: "government",
    district: "朝阳区",
    level: "区级",
    category: "高新技术企业认定",
    keywords: ["高新技术企业", "认定", "奖励", "朝阳区"],
    matchScore: 88,
  },
  {
    id: "policy_006",
    title: "丰台区促进金融科技创新发展专项资金管理办法",
    tags: [
      {
        text: "资金支持",
        type: "category",
        color: "#722ed1",
        bgColor: "#f9f0ff",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "年度预算5000万元",
    maxReward: "单项最高500万元",
    approvedCompanies: "156家",
    applicableIndustries: [
      "金融业",
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "信息传输、软件和信息技术服务业",
    ],
    publishDate: "2024年03月15日",
    publishOrg: "丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "区级",
    category: "金融科技创新",
    keywords: ["金融科技", "创新", "专项资金", "丰台区"],
    matchScore: 85,
  },
  {
    id: "policy_007",
    title: "海淀区人工智能产业发展扶持政策",
    tags: [
      {
        text: "产业扶持",
        type: "category",
        color: "#13c2c2",
        bgColor: "#e6fffb",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "年度预算8000万元",
    maxReward: "单项最高1000万元",
    approvedCompanies: "234家",
    applicableIndustries: [
      "人工智能",
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "制造业",
      "信息传输、软件和信息技术服务业",
    ],
    publishDate: "2024年01月10日",
    publishOrg: "海淀区经济和信息化局",
    publishOrgIcon: "government",
    district: "海淀区",
    level: "区级",
    category: "人工智能产业",
    keywords: ["人工智能", "产业发展", "扶持政策", "海淀区"],
    matchScore: 87,
  },
  {
    id: "policy_008",
    title: "西城区绿色金融创新试点实施方案",
    tags: [
      {
        text: "试点项目",
        type: "category",
        color: "#eb2f96",
        bgColor: "#fff0f6",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "试点资金3000万元",
    maxReward: "单项最高300万元",
    approvedCompanies: "67家",
    applicableIndustries: [
      "金融业",
      "环保产业",
      "新能源",
      "节能环保",
      "绿色制造业",
    ],
    publishDate: "2024年01月25日",
    publishOrg: "西城区金融服务办公室",
    publishOrgIcon: "government",
    district: "西城区",
    level: "区级",
    category: "绿色金融",
    keywords: ["绿色金融", "创新试点", "西城区"],
    matchScore: 82,
  },
  {
    id: "policy_009",
    title: "东城区高新技术企业认定奖励办法",
    tags: [
      {
        text: "政策文件",
        type: "category",
        color: "#52c41a",
        bgColor: "#f6ffed",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "年度预算3000万元",
    maxReward: "首次认定50万元",
    approvedCompanies: "567家",
    applicableIndustries: [
      "高新技术产业",
      "软件和信息技术服务业",
      "科学研究和技术服务业",
      "环境保护/污染防治",
      "制造业",
    ],
    publishDate: "2024年03月01日",
    publishOrg: "东城区科学技术委员会",
    publishOrgIcon: "government",
    district: "东城区",
    level: "区级",
    category: "高新技术企业认定",
    keywords: ["高新技术企业", "认定", "奖励", "东城区", "环境保护"],
    matchScore: 90,
  },
  {
    id: "policy_010",
    title: "通州区城市副中心建设重点扶持企业认定管理办法",
    tags: [
      {
        text: "企业认定",
        type: "category",
        color: "#fa8c16",
        bgColor: "#fff7e6",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "扶持资金2亿元",
    maxReward: "综合扶持最高2000万元",
    approvedCompanies: "89家",
    applicableIndustries: [
      "建筑业",
      "房地产业",
      "基础设施建设",
      "公共服务业",
      "现代服务业",
    ],
    publishDate: "2024年03月10日",
    publishOrg: "通州区发展和改革委员会",
    publishOrgIcon: "government",
    district: "通州区",
    level: "区级",
    category: "城市建设",
    keywords: ["城市副中心", "重点扶持", "企业认定", "通州区"],
    matchScore: 80,
  },
  {
    id: "policy_010",
    title: "石景山区数字经济产业园招商引资优惠政策",
    tags: [
      {
        text: "招商引资",
        type: "category",
        color: "#2f54eb",
        bgColor: "#f0f5ff",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "优惠政策总额1.5亿元",
    maxReward: "入驻奖励最高800万元",
    approvedCompanies: "45家",
    applicableIndustries: [
      "数字经济",
      "电子商务",
      "软件和信息技术服务业",
      "互联网和相关服务",
      "智能制造",
    ],
    publishDate: "2024年02月28日",
    publishOrg: "石景山区发展和改革委员会",
    publishOrgIcon: "government",
    district: "石景山区",
    level: "区级",
    category: "数字经济",
    keywords: ["数字经济", "产业园", "招商引资", "石景山区"],
    matchScore: 78,
  },
  {
    id: "policy_011",
    title: "东城区绿色建筑与节能减排专项资金申报指南",
    tags: [
      {
        text: "申报指南",
        type: "category",
        color: "#13c2c2",
        bgColor: "#e6fffb",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "专项资金5000万元",
    maxReward: "单个项目最高300万元",
    approvedCompanies: "128家",
    applicableIndustries: ["建筑业", "节能环保", "城乡建设", "资源综合利用"],
    publishDate: "2024年03月15日",
    publishOrg: "东城区住房和城市建设委员会",
    publishOrgIcon: "government",
    district: "东城区",
    level: "区级",
    category: "节能环保",
    keywords: ["绿色建筑", "节能减排", "东城区", "专项资金"],
    matchScore: 88,
  },
  {
    id: "policy_012",
    title: "东城区科技成果转化与技术转移专项扶持政策",
    tags: [
      {
        text: "政策文件",
        type: "category",
        color: "#52c41a",
        bgColor: "#f6ffed",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "年度预算2000万元",
    maxReward: "单项最高200万元",
    approvedCompanies: "89家",
    applicableIndustries: [
      "技术转移/成果转化",
      "科学研究和技术服务业",
      "软件和信息技术服务业",
      "高新技术产业",
      "制造业",
    ],
    publishDate: "2024年02月10日",
    publishOrg: "东城区科学技术委员会",
    publishOrgIcon: "government",
    district: "东城区",
    level: "区级",
    category: "技术转移",
    keywords: ["技术转移", "成果转化", "东城区", "科技扶持"],
    matchScore: 92,
  },
  {
    id: "policy_013",
    title: "东城区创新创业孵化器建设与运营补贴办法",
    tags: [
      {
        text: "补贴办法",
        type: "category",
        color: "#722ed1",
        bgColor: "#f9f0ff",
      },
      { text: "区级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "补贴资金1500万元",
    maxReward: "年度运营补贴最高150万元",
    approvedCompanies: "45家",
    applicableIndustries: [
      "技术转移/成果转化",
      "创新创业服务",
      "科学研究和技术服务业",
      "软件和信息技术服务业",
      "租赁和商务服务业",
    ],
    publishDate: "2024年01月20日",
    publishOrg: "东城区发展和改革委员会",
    publishOrgIcon: "government",
    district: "东城区",
    level: "区级",
    category: "创新创业",
    keywords: ["创新创业", "孵化器", "技术转移", "东城区"],
    matchScore: 90,
  },
  {
    id: "policy_test_001",
    title: "北京市丰台区金融补贴政策实施细则",
    tags: [
      {
        text: "政策文件",
        type: "category",
        color: "#52c41a",
        bgColor: "#f6ffed",
      },
      { text: "市级", type: "level", color: "#faad14", bgColor: "#fffbe6" },
    ],
    fundingAmount: "年度预算5000万元",
    maxReward: "单项最高200万元",
    approvedCompanies: "234家",
    applicableIndustries: ["金融业", "金融科技", "保险业", "证券业", "银行业"],
    publishDate: "2024年03月20日",
    publishOrg: "北京市丰台区金融服务办公室",
    publishOrgIcon: "government",
    district: "丰台区",
    level: "市级",
    category: "金融补贴",
    keywords: ["北京市", "丰台区", "金融", "补贴", "政策"],
    matchScore: 95,
  },
];

// 合并原始政策数据、丰台区金融补贴政策数据和模拟数据
export const enhancedPolicyDatabase: EnhancedPolicyData[] = [
  ...originalPolicyDatabase,
  ...allFengtaiFinancialData,
  ...convertedMockPolicies,
];

/**
 * 旧版搜索函数 - 保留用于向后兼容
 */
export const searchEnhancedPoliciesLegacy = (
  keyword: string = "",
  districts: string[] = [],
  industries: string[] = [],
  levels: string[] = [],
  categories: string[] = [],
): EnhancedPolicyData[] => {
  let results = [...enhancedPolicyDatabase];

  // 关键词匹配 - 使用核心词分词进行精准匹配
  if (keyword && keyword.trim()) {
    // 将搜索关键词分解为核心词
    const coreTerms = segmentKeyword(keyword.trim());

    results = results.filter((policy) => {
      // 检查每个核心词是否在政策的关键字段中匹配
      return coreTerms.some((term) => {
        const normalizedTerm = term.toLowerCase();
        return (
          policy.title.toLowerCase().includes(normalizedTerm) ||
          policy.keywords.some((k) =>
            k.toLowerCase().includes(normalizedTerm),
          ) ||
          policy.publishOrg.toLowerCase().includes(normalizedTerm) ||
          policy.applicableIndustries.some((industry) =>
            industry.toLowerCase().includes(normalizedTerm),
          ) ||
          policy.district.toLowerCase().includes(normalizedTerm) ||
          policy.category.toLowerCase().includes(normalizedTerm)
        );
      });
    });
  }

  // 区域匹配 - 必须匹配所选区域之一（OR逻辑）
  if (districts && districts.length > 0) {
    results = results.filter((policy) => {
      return districts.some((district) => {
        // 支持部分匹配，例如"东城区"可以匹配"北京市东城区"
        const normalizedDistrict = district.replace("区", "").replace("市", "");
        const normalizedPolicyDistrict = policy.district
          .replace("区", "")
          .replace("市", "");
        return (
          policy.district.includes(district) ||
          district.includes(policy.district) ||
          normalizedPolicyDistrict.includes(normalizedDistrict) ||
          normalizedDistrict.includes(normalizedPolicyDistrict)
        );
      });
    });
  }

  // 行业匹配 - 必须匹配所选行业之一（OR逻辑）
  if (industries && industries.length > 0) {
    results = results.filter((policy) => {
      return policy.applicableIndustries.some((policyIndustry) => {
        return industries.some((filterIndustry) => {
          // 处理复合筛选值，例如 "城乡建设、环境保护 / 节能与资源综合利用"
          // 策略：分割字符串，提取关键词进行模糊匹配
          const keywords = filterIndustry
            .split(/\/|、|，| /)
            .filter((k) => k.trim().length > 1);

          // 1. 直接包含匹配（不区分大小写）
          if (
            policyIndustry
              .toLowerCase()
              .includes(filterIndustry.toLowerCase()) ||
            filterIndustry.toLowerCase().includes(policyIndustry.toLowerCase())
          ) {
            return true;
          }

          // 2. 关键词模糊匹配
          return keywords.some((k) => {
            const normalizedKeyword = k.trim().toLowerCase();
            const normalizedIndustry = policyIndustry.toLowerCase();
            return (
              normalizedIndustry.includes(normalizedKeyword) ||
              normalizedKeyword.includes(normalizedIndustry)
            );
          });
        });
      });
    });
  }

  // 级别匹配 - 必须匹配所选级别之一（OR逻辑）
  if (levels && levels.length > 0) {
    results = results.filter((policy) => levels.includes(policy.level));
  }

  // 类别匹配 - 必须匹配所选类别之一（OR逻辑）
  if (categories && categories.length > 0) {
    results = results.filter((policy) => categories.includes(policy.category));
  }

  // 按发布时间倒序排列（最新的在最上方）
  results.sort((a, b) => {
    const dateA = new Date(
      a.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
    );
    const dateB = new Date(
      b.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
    );
    return dateB.getTime() - dateA.getTime();
  });

  return results;
};

/**
 * 增强版搜索函数 - 支持对象参数接口
 * 匹配 EnhancedPolicySearch 组件的调用方式
 */
export const searchEnhancedPolicies = async (params: {
  keyword?: string;
  filters?: {
    districts?: string[];
    industries?: string[];
    levels?: string[];
    categories?: string[];
  };
  page?: number;
  pageSize?: number;
  sortBy?: string;
}): Promise<EnhancedPolicyData[]> => {
  const {
    keyword = "",
    filters = {},
    page = 1,
    pageSize = 20,
    sortBy = "comprehensive",
  } = params;

  const {
    districts = [],
    industries = [],
    levels = [],
    categories = [],
  } = filters;

  let results = [...enhancedPolicyDatabase];

  // console.log('搜索参数:', { keyword, filters, page, pageSize, sortBy });
  // console.log('数据库总数:', enhancedPolicyDatabase.length);

  // 关键词匹配 - 如果没有关键词，返回所有数据
  if (keyword && keyword.trim()) {
    // 将搜索关键词分解为核心词
    const coreTerms = segmentKeyword(keyword.trim());

    results = results.filter((policy) => {
      // 检查每个核心词是否在政策的关键字段中匹配
      return coreTerms.some((term) => {
        const normalizedTerm = term.toLowerCase();
        return (
          policy.title.toLowerCase().includes(normalizedTerm) ||
          policy.keywords.some((k) =>
            k.toLowerCase().includes(normalizedTerm),
          ) ||
          policy.publishOrg.toLowerCase().includes(normalizedTerm) ||
          policy.applicableIndustries.some((industry) =>
            industry.toLowerCase().includes(normalizedTerm),
          ) ||
          policy.district.toLowerCase().includes(normalizedTerm) ||
          policy.category.toLowerCase().includes(normalizedTerm)
        );
      });
    });
  }

  // 区域匹配
  if (districts && districts.length > 0) {
    results = results.filter((policy) => {
      return districts.some((district) => {
        const normalizedDistrict = district.replace("区", "").replace("市", "");
        const normalizedPolicyDistrict = policy.district
          .replace("区", "")
          .replace("市", "");
        return (
          policy.district.includes(district) ||
          district.includes(policy.district) ||
          normalizedPolicyDistrict.includes(normalizedDistrict) ||
          normalizedDistrict.includes(normalizedPolicyDistrict)
        );
      });
    });
  }

  // 行业匹配
  if (industries && industries.length > 0) {
    results = results.filter((policy) => {
      return policy.applicableIndustries.some((policyIndustry) => {
        return industries.some((filterIndustry) => {
          const keywords = filterIndustry
            .split(/\/|、|，| /)
            .filter((k) => k.trim().length > 1);

          if (
            policyIndustry
              .toLowerCase()
              .includes(filterIndustry.toLowerCase()) ||
            filterIndustry.toLowerCase().includes(policyIndustry.toLowerCase())
          ) {
            return true;
          }

          return keywords.some((k) => {
            const normalizedKeyword = k.trim().toLowerCase();
            const normalizedIndustry = policyIndustry.toLowerCase();
            return (
              normalizedIndustry.includes(normalizedKeyword) ||
              normalizedKeyword.includes(normalizedIndustry)
            );
          });
        });
      });
    });
  }

  // 级别匹配
  if (levels && levels.length > 0) {
    results = results.filter((policy) => levels.includes(policy.level));
  }

  // 类别匹配
  if (categories && categories.length > 0) {
    results = results.filter((policy) => categories.includes(policy.category));
  }

  // 排序
  if (sortBy === "latest") {
    results.sort((a, b) => {
      const dateA = new Date(
        a.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
      );
      const dateB = new Date(
        b.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
      );
      return dateB.getTime() - dateA.getTime();
    });
  } else if (sortBy === "comprehensive") {
    // 综合排序：优先显示匹配度高的，然后按发布时间
    results.sort((a, b) => {
      if (a.matchScore && b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      const dateA = new Date(
        a.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
      );
      const dateB = new Date(
        b.publishDate.replace(/年|月/g, "-").replace(/日/g, ""),
      );
      return dateB.getTime() - dateA.getTime();
    });
  }

  // console.log('筛选后结果数:', results.length);

  // 分页处理
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);

  // console.log('分页结果:', paginatedResults.length);

  return paginatedResults;
};
