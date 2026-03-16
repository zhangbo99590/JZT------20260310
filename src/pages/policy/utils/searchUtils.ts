/**
 * 搜索工具函数
 * 支持分词搜索和模糊搜索功能
 */

// 简单的中文分词函数
export const segmentText = (text: string): string[] => {
  if (!text) return [];
  
  // 移除标点符号和特殊字符
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
  
  // 基础分词规则
  const segments: string[] = [];
  
  // 按空格分割
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  words.forEach(word => {
    // 如果是纯英文或数字，直接添加
    if (/^[a-zA-Z0-9]+$/.test(word)) {
      segments.push(word);
      return;
    }
    
    // 中文分词 - 简单的基于词典的方法
    const chineseSegments = segmentChinese(word);
    segments.push(...chineseSegments);
  });
  
  return [...new Set(segments)]; // 去重
};

// 中文分词函数
const segmentChinese = (text: string): string[] => {
  const segments: string[] = [];
  
  // 常见词汇词典
  const dictionary = [
    '北京市', '丰台区', '朝阳区', '海淀区', '东城区', '西城区', '石景山区',
    '通州区', '顺义区', '昌平区', '大兴区', '房山区', '门头沟区', '怀柔区', '平谷区', '密云区', '延庆区',
    '金融', '科技', '创新', '补贴', '政策', '企业', '高新技术', '专精特新',
    '税收优惠', '研发费用', '加计扣除', '人才引进', '产业扶持',
    '国家级', '省级', '市级', '区县级', '政府部门', '科技部', '工信部', '发改委',
    '直接补贴', '贷款贴息', '基金支持', '资质认定', '奖励表彰'
  ];
  
  let i = 0;
  while (i < text.length) {
    let matched = false;
    
    // 从最长的词开始匹配
    for (let len = Math.min(6, text.length - i); len >= 2; len--) {
      const substr = text.substring(i, i + len);
      if (dictionary.includes(substr)) {
        segments.push(substr);
        i += len;
        matched = true;
        break;
      }
    }
    
    // 如果没有匹配到词典中的词，按单字处理
    if (!matched) {
      const char = text.charAt(i);
      if (char.trim()) {
        segments.push(char);
      }
      i++;
    }
  }
  
  return segments;
};

// 模糊搜索匹配函数
export const fuzzyMatch = (searchTerms: string[], targetText: string): {
  isMatch: boolean;
  matchedTerms: string[];
  score: number;
} => {
  if (!searchTerms.length || !targetText) {
    return { isMatch: false, matchedTerms: [], score: 0 };
  }
  
  const targetLower = targetText.toLowerCase();
  const matchedTerms: string[] = [];
  let totalScore = 0;
  
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    
    // 完全匹配 - 最高分
    if (targetLower.includes(termLower)) {
      matchedTerms.push(term);
      totalScore += 10;
      return;
    }
    
    // 部分匹配 - 中等分
    if (term.length >= 2) {
      for (let i = 0; i <= term.length - 2; i++) {
        const substr = term.substring(i, i + 2);
        if (targetLower.includes(substr.toLowerCase())) {
          matchedTerms.push(term);
          totalScore += 3;
          break;
        }
      }
    }
    
    // 单字匹配 - 低分
    if (term.length === 1 && targetLower.includes(termLower)) {
      matchedTerms.push(term);
      totalScore += 1;
    }
  });
  
  const score = totalScore / searchTerms.length;
  const isMatch = matchedTerms.length > 0 && score >= 1;
  
  return { isMatch, matchedTerms: [...new Set(matchedTerms)], score };
};

// 高亮匹配的关键词
export const highlightKeywords = (text: string, keywords: string[]): string => {
  if (!keywords.length) return text;
  
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark style="background-color: #ff4d4f; color: white; padding: 1px 2px; border-radius: 2px;">$1</mark>');
  });
  
  return highlightedText;
};

// 搜索政策数据
export const searchPolicies = (
  query: string,
  policies: any[],
  filters: {
    beijingDistricts?: string[];
    industries?: string[];
    moreFilters?: Record<string, string[]>;
  } = {}
) => {
  if (!query.trim() && !Object.keys(filters).some(key => filters[key as keyof typeof filters]?.length)) {
    return [];
  }
  
  // 分词处理
  const searchTerms = segmentText(query);
  
  // 筛选和搜索
  let results = policies.filter(policy => {
    // 应用筛选条件
    if (filters.beijingDistricts?.length) {
      const policyDistrict = policy.district || policy.region;
      if (!filters.beijingDistricts.some(district => 
        policyDistrict?.includes(district) || district.includes(policyDistrict || '')
      )) {
        return false;
      }
    }
    
    if (filters.industries?.length) {
      const policyIndustry = policy.industry || policy.category;
      if (!filters.industries.some(industry => 
        policyIndustry?.includes(industry) || industry.includes(policyIndustry || '')
      )) {
        return false;
      }
    }
    
    // 更多筛选条件
    if (filters.moreFilters) {
      for (const [filterType, filterValues] of Object.entries(filters.moreFilters)) {
        if (filterValues.length > 0) {
          const policyValue = policy[filterType];
          if (!filterValues.some(value => 
            policyValue?.includes(value) || value.includes(policyValue || '')
          )) {
            return false;
          }
        }
      }
    }
    
    // 如果没有搜索关键词，只应用筛选条件
    if (!searchTerms.length) {
      return true;
    }
    
    // 搜索匹配
    const searchFields = [
      policy.title || '',
      policy.content || '',
      policy.description || '',
      policy.industry || '',
      policy.district || policy.region || '',
      policy.department || '',
      policy.subsidyType || ''
    ].join(' ');
    
    const matchResult = fuzzyMatch(searchTerms, searchFields);
    
    if (matchResult.isMatch) {
      policy._searchScore = matchResult.score;
      policy._matchedTerms = matchResult.matchedTerms;
      return true;
    }
    
    return false;
  });
  
  // 按搜索得分排序
  if (searchTerms.length > 0) {
    results.sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
  }
  
  return results;
};

// 生成搜索建议
export const generateSearchSuggestions = (query: string): string[] => {
  const suggestions: string[] = [];
  
  // 基于输入内容生成建议
  if (query.includes('北京') || query.includes('丰台') || query.includes('朝阳')) {
    suggestions.push('北京市丰台区金融补贴', '北京市朝阳区科技创新政策');
  }
  
  if (query.includes('金融') || query.includes('补贴')) {
    suggestions.push('金融发展专项资金', '金融科技创新补贴');
  }
  
  if (query.includes('科技') || query.includes('创新')) {
    suggestions.push('科技创新券', '高新技术企业认定', '研发费用加计扣除');
  }
  
  if (query.includes('人才')) {
    suggestions.push('高层次人才引进', '博士后工作站', '海外人才创业');
  }
  
  // 默认热门搜索
  if (!suggestions.length) {
    suggestions.push(
      '高新技术企业认定',
      '专精特新企业',
      '研发费用加计扣除',
      '科技创新券',
      '人才引进政策'
    );
  }
  
  return suggestions.slice(0, 5);
};
