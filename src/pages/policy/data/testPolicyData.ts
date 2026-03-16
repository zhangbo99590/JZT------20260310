/**
 * 测试政策数据 - 包含北京市丰台金融补贴政策相关数据
 */

import { EnhancedPolicyData } from './enhancedPolicyData';

export const testPolicyData: EnhancedPolicyData = {
  id: 'policy_test_001',
  title: '北京市丰台区金融补贴政策实施细则',
  tags: [
    { text: '政策文件', type: 'category', color: '#52c41a', bgColor: '#f6ffed' },
    { text: '市级', type: 'level', color: '#faad14', bgColor: '#fffbe6' }
  ],
  fundingAmount: '年度预算5000万元',
  maxReward: '单项最高200万元',
  approvedCompanies: '234家',
  applicableIndustries: [
    '金融业',
    '金融科技',
    '保险业',
    '证券业',
    '银行业'
  ],
  publishDate: '2024年03月20日',
  publishOrg: '北京市丰台区金融服务办公室',
  publishOrgIcon: 'government',
  district: '丰台区',
  level: '市级',
  category: '金融补贴',
  keywords: ['北京市', '丰台区', '金融', '补贴', '政策'],
  matchScore: 95
};
