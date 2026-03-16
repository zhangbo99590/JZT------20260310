/**
 * 模拟后端政策数据接口
 * 支持差异化筛选结果，根据不同筛选条件返回匹配的政策数据
 */

import { PolicyData } from '../data/mockPolicies';
import { simulateDelay } from '../../../utils/commonUtils';

// 扩展的模拟政策数据库
export const mockPolicyDatabase: PolicyData[] = [
  {
    id: '1',
    title: '北京市丰台区促进金融科技创新发展专项资金管理办法',
    originalTitle: '关于印发《北京市丰台区促进金融科技创新发展专项资金管理办法》的通知',
    content: '为深入贯彻落实国家金融科技发展战略，推动丰台区金融科技产业高质量发展，特制定本办法。支持金融科技企业技术创新、产品研发、场景应用等方面的发展。',
    summary: '支持丰台区金融科技企业创新发展，提供专项资金支持技术创新、产品研发等，最高补贴500万元。重点支持人工智能、区块链、大数据等前沿技术在金融领域的应用。',
    industry: '财政、金融、审计 / 金融服务',
    publishDate: '2024-03-15',
    department: '丰台区金融服务办公室',
    publishOrg: '丰台区金融服务办公室',
    region: '北京市',
    district: '丰台区',
    level: '区级',
    subsidyType: 'direct_subsidy',
    subsidyAmount: '最高500万元',
    amount: '最高500万元',
    approvedCompanies: 156,
    subsidyAmountDetail: {
      district: 500
    },
    tags: ['金融科技', '创新发展', '专项资金', '人工智能'],
    type: 'policy',
    category: '政策文件',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 92
  },
  {
    id: '2',
    title: '朝阳区高新技术企业认定奖励政策实施细则',
    originalTitle: '关于朝阳区高新技术企业认定奖励政策的实施细则',
    content: '为鼓励企业加大研发投入，提升自主创新能力，对通过高新技术企业认定的企业给予奖励支持。包括首次认定奖励、重新认定奖励等。',
    summary: '对通过高新技术企业认定的朝阳区企业给予奖励，首次认定奖励30万元，重新认定奖励20万元。支持企业持续创新发展。',
    industry: '科技、教育 / 科技创新',
    publishDate: '2024-02-20',
    department: '朝阳区科学技术委员会',
    publishOrg: '朝阳区科学技术委员会',
    region: '北京市',
    district: '朝阳区',
    level: '区级',
    subsidyType: 'reward',
    subsidyAmount: '首次30万元，重新认定20万元',
    amount: '首次30万元，重新认定20万元',
    approvedCompanies: 892,
    subsidyAmountDetail: {
      district: 30
    },
    tags: ['高新技术', '企业认定', '奖励政策'],
    type: 'policy',
    category: '政策文件',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 88
  },
  {
    id: '3',
    title: '国家科学技术奖申报指南',
    originalTitle: '2024年度国家科学技术奖申报工作指南',
    content: '国家科学技术奖是我国科技领域的最高奖项，包括国家自然科学奖、国家技术发明奖、国家科学技术进步奖等。',
    summary: '国家科学技术奖申报指南，包含自然科学奖、技术发明奖、科技进步奖等类别，奖金最高800万元。重点支持原创性科技成果。',
    industry: '科技、教育 / 科技创新',
    publishDate: '2024-01-10',
    department: '国家科学技术部',
    publishOrg: '国家科学技术部',
    region: '全国',
    district: '东城区',
    level: '国家级',
    subsidyType: 'award',
    subsidyAmount: '最高800万元',
    amount: '最高800万元',
    approvedCompanies: 1586,
    subsidyAmountDetail: {
      central: 800
    },
    tags: ['国家科学技术奖', '科技创新', '原创成果'],
    type: 'policy',
    category: '政策文件',
    orgType: 'government',
    policyOrg: 'central_gov',
    matchScore: 95
  },
  {
    id: '4',
    title: '东城区文化创意产业发展专项资金项目',
    originalTitle: '东城区文化创意产业发展专项资金管理办法实施项目',
    content: '支持东城区文化创意产业发展，重点扶持数字文化、创意设计、文化科技融合等领域的优质项目。',
    summary: '东城区文化创意产业专项资金项目，支持数字文化、创意设计等领域，单个项目最高支持200万元。',
    industry: '商贸、海关、旅游 / 文化创意',
    publishDate: '2024-03-01',
    department: '东城区文化和旅游局',
    publishOrg: '东城区文化和旅游局',
    region: '北京市',
    district: '东城区',
    level: '区级',
    subsidyType: 'project_funding',
    subsidyAmount: '最高200万元',
    amount: '最高200万元',
    approvedCompanies: 234,
    subsidyAmountDetail: {
      district: 200
    },
    tags: ['文化创意', '数字文化', '创意设计'],
    type: 'project',
    category: '相关项目',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 85
  },
  {
    id: '5',
    title: '海淀区人工智能产业扶持企业名单',
    originalTitle: '2024年海淀区人工智能产业重点扶持企业认定名单',
    content: '海淀区重点扶持的人工智能企业名单，包括算法创新、智能硬件、应用场景等多个细分领域的优秀企业。',
    summary: '海淀区人工智能产业扶持企业名单，涵盖算法创新、智能硬件等领域，入选企业可享受税收优惠、资金支持等政策。',
    industry: '工业、交通 / 信息产业（含电信）',
    publishDate: '2024-02-15',
    department: '海淀区经济和信息化局',
    publishOrg: '海淀区经济和信息化局',
    region: '北京市',
    district: '海淀区',
    level: '区级',
    subsidyType: 'tax_incentive',
    subsidyAmount: '税收优惠+资金支持',
    amount: '税收优惠+资金支持',
    approvedCompanies: 128,
    subsidyAmountDetail: {
      district: 100
    },
    tags: ['人工智能', '产业扶持', '税收优惠'],
    type: 'enterprise',
    category: '扶持企业',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 90
  },
  {
    id: '6',
    title: '西城区绿色金融创新试点政策',
    originalTitle: '西城区绿色金融创新发展试点实施方案',
    content: '推动西城区绿色金融创新发展，支持绿色信贷、绿色债券、绿色保险等金融产品创新，促进绿色产业发展。',
    summary: '西城区绿色金融创新试点政策，支持绿色信贷、绿色债券等金融产品创新，最高给予300万元资金支持。',
    industry: '财政、金融、审计 / 绿色金融',
    publishDate: '2024-01-25',
    department: '西城区金融服务办公室',
    publishOrg: '西城区金融服务办公室',
    region: '北京市',
    district: '西城区',
    level: '区级',
    subsidyType: 'innovation_support',
    subsidyAmount: '最高300万元',
    amount: '最高300万元',
    approvedCompanies: 67,
    subsidyAmountDetail: {
      district: 300
    },
    tags: ['绿色金融', '创新试点', '可持续发展'],
    type: 'policy',
    category: '政策文件',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 87
  },
  {
    id: '7',
    title: '石景山区数字经济产业园建设项目',
    originalTitle: '石景山区数字经济产业园区建设与招商引资项目',
    content: '建设石景山区数字经济产业园，重点引进数字技术、电子商务、智能制造等领域的优质企业和项目。',
    summary: '石景山区数字经济产业园建设项目，提供优质载体空间，入驻企业可享受租金减免、税收优惠等政策支持。',
    industry: '工业、交通 / 数字经济',
    publishDate: '2024-02-28',
    department: '石景山区发展和改革委员会',
    publishOrg: '石景山区发展和改革委员会',
    region: '北京市',
    district: '石景山区',
    level: '区级',
    subsidyType: 'park_support',
    subsidyAmount: '租金减免+税收优惠',
    amount: '租金减免+税收优惠',
    approvedCompanies: 45,
    subsidyAmountDetail: {
      district: 150
    },
    tags: ['数字经济', '产业园区', '招商引资'],
    type: 'project',
    category: '相关项目',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 83
  },
  {
    id: '8',
    title: '通州区城市副中心建设扶持企业政策',
    originalTitle: '北京城市副中心建设重点扶持企业认定管理办法',
    content: '支持通州区城市副中心建设，重点扶持基础设施建设、公共服务、绿色发展等领域的企业。',
    summary: '通州区城市副中心建设扶持企业政策，重点支持基础设施、公共服务等领域，入选企业可获得多项政策支持。',
    industry: '城乡建设、环境保护 / 城市建设',
    publishDate: '2024-03-10',
    department: '通州区发展和改革委员会',
    publishOrg: '通州区发展和改革委员会',
    region: '北京市',
    district: '通州区',
    level: '区级',
    subsidyType: 'comprehensive_support',
    subsidyAmount: '综合政策支持',
    amount: '综合政策支持',
    approvedCompanies: 89,
    subsidyAmountDetail: {
      district: 250
    },
    tags: ['城市副中心', '基础设施', '绿色发展'],
    type: 'enterprise',
    category: '扶持企业',
    orgType: 'government',
    policyOrg: 'local_gov',
    matchScore: 86
  }
];

// 搜索参数接口
export interface SearchParams {
  keyword?: string;
  districts?: string[];
  industries?: string[];
  levels?: string[];
  categories?: string[];
  orgTypes?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'default' | 'date' | 'amount' | 'score';
}

// 搜索结果接口
export interface SearchResult {
  total: number;
  items: PolicyData[];
  facets: {
    districts: { [key: string]: number };
    industries: { [key: string]: number };
    levels: { [key: string]: number };
    categories: { [key: string]: number };
  };
  executionTime: number;
  hasMore: boolean;
}

// 关键词匹配函数
const matchKeyword = (text: string, keyword: string): boolean => {
  if (!keyword) return true;
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();
  return normalizedText.includes(normalizedKeyword);
};

// 数组匹配函数
const matchArray = (itemValue: string, filterValues: string[]): boolean => {
  if (!filterValues || filterValues.length === 0) return true;
  return filterValues.some(filter => 
    itemValue.toLowerCase().includes(filter.toLowerCase()) ||
    filter.toLowerCase().includes(itemValue.toLowerCase())
  );
};

// 计算匹配分数
const calculateMatchScore = (item: PolicyData, params: SearchParams): number => {
  let score = 0;
  
  // 关键词匹配分数
  if (params.keyword) {
    if (matchKeyword(item.title, params.keyword)) score += 30;
    if (matchKeyword(item.summary, params.keyword)) score += 20;
    if (matchKeyword(item.content, params.keyword)) score += 10;
    if (item.tags.some(tag => matchKeyword(tag, params.keyword))) score += 15;
  }
  
  // 区域匹配分数
  if (params.districts && params.districts.length > 0) {
    if (params.districts.includes(item.district)) score += 25;
  }
  
  // 行业匹配分数
  if (params.industries && params.industries.length > 0) {
    if (matchArray(item.industry, params.industries)) score += 20;
  }
  
  // 级别匹配分数
  if (params.levels && params.levels.length > 0) {
    if (params.levels.includes(item.level)) score += 15;
  }
  
  // 基础分数
  score += Math.random() * 10;
  
  return Math.min(100, Math.max(0, score));
};

// 主搜索函数
export const searchPolicies = async (params: SearchParams): Promise<SearchResult> => {
  const startTime = Date.now();
  
  // 模拟网络延迟
  await simulateDelay(600 + Math.random() * 400);
  
  try {
    let filteredItems = [...mockPolicyDatabase];
    
    // 关键词筛选
    if (params.keyword && params.keyword.trim()) {
      filteredItems = filteredItems.filter(item =>
        matchKeyword(item.title, params.keyword!) ||
        matchKeyword(item.summary, params.keyword!) ||
        matchKeyword(item.content, params.keyword!) ||
        item.tags.some(tag => matchKeyword(tag, params.keyword!))
      );
    }
    
    // 区域筛选
    if (params.districts && params.districts.length > 0) {
      filteredItems = filteredItems.filter(item =>
        params.districts!.includes(item.district)
      );
    }
    
    // 行业筛选
    if (params.industries && params.industries.length > 0) {
      filteredItems = filteredItems.filter(item =>
        matchArray(item.industry, params.industries!)
      );
    }
    
    // 级别筛选
    if (params.levels && params.levels.length > 0) {
      filteredItems = filteredItems.filter(item =>
        params.levels!.includes(item.level)
      );
    }
    
    // 类别筛选
    if (params.categories && params.categories.length > 0) {
      filteredItems = filteredItems.filter(item =>
        params.categories!.includes(item.category)
      );
    }
    
    // 计算匹配分数
    filteredItems = filteredItems.map(item => ({
      ...item,
      matchScore: calculateMatchScore(item, params)
    }));
    
    // 排序
    switch (params.sortBy) {
      case 'date':
        filteredItems.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case 'amount':
        filteredItems.sort((a, b) => {
          const amountA = a.subsidyAmountDetail ? 
            Object.values(a.subsidyAmountDetail).reduce((sum, val) => sum + val, 0) : 0;
          const amountB = b.subsidyAmountDetail ? 
            Object.values(b.subsidyAmountDetail).reduce((sum, val) => sum + val, 0) : 0;
          return amountB - amountA;
        });
        break;
      case 'score':
        filteredItems.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      default:
        filteredItems.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
    
    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
    
    // 生成统计信息
    const facets = {
      districts: {} as { [key: string]: number },
      industries: {} as { [key: string]: number },
      levels: {} as { [key: string]: number },
      categories: {} as { [key: string]: number }
    };
    
    filteredItems.forEach(item => {
      facets.districts[item.district] = (facets.districts[item.district] || 0) + 1;
      facets.levels[item.level] = (facets.levels[item.level] || 0) + 1;
      facets.categories[item.category] = (facets.categories[item.category] || 0) + 1;
      
      const industryKey = item.industry.split(' / ')[0];
      facets.industries[industryKey] = (facets.industries[industryKey] || 0) + 1;
    });
    
    const executionTime = Date.now() - startTime;
    
    return {
      total: filteredItems.length,
      items: paginatedItems,
      facets,
      executionTime,
      hasMore: startIndex + pageSize < filteredItems.length
    };
    
  } catch (error) {
    // 模拟不同类型的错误
    const errorType = Math.random();
    if (errorType < 0.1) {
      throw { status: 400, message: '筛选条件异常，请重新选择后重试' };
    } else if (errorType < 0.15) {
      throw { status: 500, message: '服务器繁忙，请稍后重试' };
    } else if (errorType < 0.2) {
      throw { status: 0, message: '网络连接失败，请检查网络后重试' };
    }
    throw error;
  }
};
