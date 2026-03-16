
import { segmentSearchKeywords } from './src/pages/policy/utils/keywordHighlight';
import { performPreciseSearch } from './src/pages/policy/utils/preciseSearchMatcher';
import { EnhancedPolicyData } from './src/pages/policy/data/enhancedPolicyData';

// Mock data
const mockData: EnhancedPolicyData[] = [
  {
    id: 'policy_001',
    title: '北京市2025年第一批国家级科技型中小企业认定公示名单',
    tags: [],
    fundingAmount: '未公开',
    maxReward: '未公开',
    approvedCompanies: '3596家',
    applicableIndustries: [],
    publishDate: '2025年09月05日',
    publishOrg: '北京市科学技术委员会',
    district: '北京市',
    level: '国家级',
    category: '科技型企业认定',
    keywords: ['国家级', '科技型中小企业', '认定', '公示', '北京市'],
    matchScore: 95
  }
];

const searchTerm = '高新技术企业认定';

console.log('--- Testing segmentSearchKeywords ---');
const keywords = segmentSearchKeywords(searchTerm);
console.log('Keywords:', keywords);

console.log('--- Testing performPreciseSearch ---');
const result = performPreciseSearch(mockData, searchTerm);
console.log('Result count:', result.totalCount);
console.log('Matched policies:', result.policies.map(p => p.title));
console.log('Matched fields:', result.matchedFields);
