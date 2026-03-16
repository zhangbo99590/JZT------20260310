
import { enhancedPolicyDatabase } from './src/pages/policy/data/enhancedPolicyData';
import { performPreciseSearch } from './src/pages/policy/utils/preciseSearchMatcher';

console.log('--- Verifying enhancedPolicyDatabase ---');
console.log('Total policies:', enhancedPolicyDatabase.length);

const mockPolicy = enhancedPolicyDatabase.find(p => p.id.startsWith('mock_'));
if (mockPolicy) {
  console.log('Found mock policy:', mockPolicy.title);
} else {
  console.error('Mock policies not found in database!');
}

console.log('--- Verifying Search for Hot Keywords ---');
const searchTerm = '高新技术企业认定';
const result = performPreciseSearch(enhancedPolicyDatabase, searchTerm);
console.log(`Search for "${searchTerm}": found ${result.totalCount} results`);
if (result.totalCount > 0) {
  console.log('First match:', result.policies[0].title);
} else {
  console.error('Search failed!');
}

const searchTerm2 = '专精特新';
const result2 = performPreciseSearch(enhancedPolicyDatabase, searchTerm2);
console.log(`Search for "${searchTerm2}": found ${result2.totalCount} results`);
