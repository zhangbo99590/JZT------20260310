/**
 * 精准搜索匹配工具
 * 实现严格的关键词匹配逻辑，仅显示包含关键词的政策
 */

import { EnhancedPolicyData } from '../data/enhancedPolicyData';
import { segmentSearchKeywords, containsKeywords } from './keywordHighlight';

/**
 * 搜索匹配结果接口
 */
export interface SearchMatchResult {
  policies: EnhancedPolicyData[];
  totalCount: number;
  searchKeywords: string[];
  matchedFields: { [policyId: string]: string[] };
}

/**
 * 政策字段权重配置
 */
const FIELD_WEIGHTS = {
  district: 10,      // 适用城市权重最高
  title: 8,          // 标题权重高
  keywords: 6,       // 关键词权重中等
  publishOrg: 5,     // 发文机构权重中等
  category: 4,       // 类别权重较低
  applicableIndustries: 3  // 适用行业权重最低
};

/**
 * 检查政策是否匹配搜索关键词
 * @param policy 政策数据
 * @param searchKeywords 搜索关键词数组
 * @returns 匹配结果和匹配的字段
 */
const checkPolicyMatch = (
  policy: EnhancedPolicyData, 
  searchKeywords: string[]
): { isMatch: boolean; matchedFields: string[]; score: number } => {
  const matchedFields: string[] = [];
  let totalScore = 0;

  // 检查适用城市/区域（最高优先级）
  if (containsKeywords(policy.district, searchKeywords)) {
    matchedFields.push('district');
    totalScore += FIELD_WEIGHTS.district;
  }

  // 检查标题
  if (containsKeywords(policy.title, searchKeywords)) {
    matchedFields.push('title');
    totalScore += FIELD_WEIGHTS.title;
  }

  // 检查关键词
  const policyKeywordsText = policy.keywords.join(' ');
  if (containsKeywords(policyKeywordsText, searchKeywords)) {
    matchedFields.push('keywords');
    totalScore += FIELD_WEIGHTS.keywords;
  }

  // 检查发文机构
  if (containsKeywords(policy.publishOrg, searchKeywords)) {
    matchedFields.push('publishOrg');
    totalScore += FIELD_WEIGHTS.publishOrg;
  }

  // 检查类别
  if (containsKeywords(policy.category, searchKeywords)) {
    matchedFields.push('category');
    totalScore += FIELD_WEIGHTS.category;
  }

  // 检查适用行业
  const industriesText = policy.applicableIndustries.join(' ');
  if (containsKeywords(industriesText, searchKeywords)) {
    matchedFields.push('applicableIndustries');
    totalScore += FIELD_WEIGHTS.applicableIndustries;
  }

  const isMatch = matchedFields.length > 0;

  return {
    isMatch,
    matchedFields,
    score: totalScore
  };
};

/**
 * 执行精准搜索匹配
 * @param policies 政策数据数组
 * @param searchTerm 搜索词
 * @returns 匹配结果
 */
export const performPreciseSearch = (
  policies: EnhancedPolicyData[],
  searchTerm: string
): SearchMatchResult => {
  if (!searchTerm || !searchTerm.trim()) {
    return {
      policies: [],
      totalCount: 0,
      searchKeywords: [],
      matchedFields: {}
    };
  }

  // 分词处理搜索关键词
  const searchKeywords = segmentSearchKeywords(searchTerm);
  
  const matchedPolicies: EnhancedPolicyData[] = [];
  const matchedFields: { [policyId: string]: string[] } = {};

  // 遍历所有政策进行匹配
  policies.forEach(policy => {
    const matchResult = checkPolicyMatch(policy, searchKeywords);
    
    if (matchResult.isMatch) {
      // 添加匹配分数到政策数据
      const enhancedPolicy = {
        ...policy,
        matchScore: matchResult.score
      };
      
      matchedPolicies.push(enhancedPolicy);
      matchedFields[policy.id] = matchResult.matchedFields;
    }
  });

  // 按匹配分数排序（分数高的在前）
  matchedPolicies.sort((a, b) => {
    // 优先按适用城市匹配排序
    const aHasDistrictMatch = matchedFields[a.id]?.includes('district') || false;
    const bHasDistrictMatch = matchedFields[b.id]?.includes('district') || false;
    
    if (aHasDistrictMatch && !bHasDistrictMatch) return -1;
    if (!aHasDistrictMatch && bHasDistrictMatch) return 1;
    
    // 其次按总分排序
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  return {
    policies: matchedPolicies,
    totalCount: matchedPolicies.length,
    searchKeywords,
    matchedFields
  };
};
