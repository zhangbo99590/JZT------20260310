/**
 * 搜索调试工具 - 用于测试和调试搜索匹配逻辑
 */

import { enhancedPolicyDatabase } from '../data/enhancedPolicyData';
import { performPreciseSearch } from './preciseSearchMatcher';
import { segmentSearchKeywords, containsKeywords } from './keywordHighlight';

/**
 * 调试搜索匹配过程
 */
export const debugSearch = (searchTerm: string) => {
  console.log('=== 搜索调试开始 ===');
  console.log('搜索词:', searchTerm);
  
  // 1. 测试分词
  const keywords = segmentSearchKeywords(searchTerm);
  console.log('分词结果:', keywords);
  
  // 2. 测试每个政策的匹配情况
  console.log('\n=== 政策匹配测试 ===');
  enhancedPolicyDatabase.forEach(policy => {
    const titleMatch = containsKeywords(policy.title, keywords);
    const districtMatch = containsKeywords(policy.district, keywords);
    const keywordsMatch = containsKeywords(policy.keywords.join(' '), keywords);
    const categoryMatch = containsKeywords(policy.category, keywords);
    const orgMatch = containsKeywords(policy.publishOrg, keywords);
    
    if (titleMatch || districtMatch || keywordsMatch || categoryMatch || orgMatch) {
      console.log(`\n匹配政策: ${policy.title}`);
      console.log(`- 标题匹配: ${titleMatch} (${policy.title})`);
      console.log(`- 区域匹配: ${districtMatch} (${policy.district})`);
      console.log(`- 关键词匹配: ${keywordsMatch} (${policy.keywords.join(', ')})`);
      console.log(`- 类别匹配: ${categoryMatch} (${policy.category})`);
      console.log(`- 机构匹配: ${orgMatch} (${policy.publishOrg})`);
    }
  });
  
  // 3. 测试完整搜索流程
  console.log('\n=== 完整搜索测试 ===');
  const result = performPreciseSearch(enhancedPolicyDatabase, searchTerm);
  console.log('搜索结果数量:', result.totalCount);
  console.log('匹配的政策:', result.policies.map(p => p.title));
  
  console.log('=== 搜索调试结束 ===');
  
  return result;
};

// 在浏览器控制台中可用的全局调试函数
if (typeof window !== 'undefined') {
  (window as any).debugSearch = debugSearch;
}
