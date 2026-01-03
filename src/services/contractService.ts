/**
 * 合同管理服务
 * 提供合同搜索、统计、数据管理等功能
 */

import { simulateDelay, searchByKeyword, filterByFields, paginateArray, searchItems, SearchOptions } from '../utils/searchUtils';

import type {
  Contract,
  SearchParams,
  SearchResult,
  CommonKeyword,
  ContractStatistics,
  Region,
  ContractCategory,
  ContractDetail,
} from '../types/contract';
import { ContractCategoryLabels } from '../types/contract';

class ContractService {
  // 模拟数据存储
  private contracts: Contract[] = [];
  private commonKeywords: CommonKeyword[] = [];

  constructor() {
    this.initMockData();
  }

  /**
   * 初始化模拟数据
   */
  private initMockData(): void {
    // 生成模拟合同数据
    const categories = Object.keys(ContractCategoryLabels) as ContractCategory[];
    const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '湖南'];
    const years = [2020, 2021, 2022, 2023, 2024, 2025];

    for (let i = 1; i <= 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const year = years[Math.floor(Math.random() * years.length)];

      this.contracts.push({
        id: `CONTRACT_${i.toString().padStart(4, '0')}`,
        title: `${ContractCategoryLabels[category]}合同示例 ${i}`,
        category,
        year,
        region: province,
        province,
        city: `${province}市`,
        content: `这是一份${ContractCategoryLabels[category]}合同的详细内容，包含了各项条款和规定...`,
        createTime: new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
        updateTime: new Date().toISOString(),
        tags: ['标准模板', '常用', '推荐'],
        downloadCount: Math.floor(Math.random() * 1000),
        viewCount: Math.floor(Math.random() * 5000),
      });
    }

    // 生成常用关键词
    this.commonKeywords = [
      { keyword: '买卖合同', count: 1250 },
      { keyword: '劳动合同', count: 980 },
      { keyword: '租赁合同', count: 856 },
      { keyword: '服务合同', count: 723 },
      { keyword: '借款合同', count: 645 },
      { keyword: '保密协议', count: 534 },
      { keyword: '股权转让', count: 456 },
      { keyword: '合作协议', count: 389 },
      { keyword: '采购合同', count: 312 },
      { keyword: '销售合同', count: 278 },
    ];
  }

  /**
   * 搜索合同
   */
  async searchContracts(params: SearchParams): Promise<SearchResult> {
    // 使用增强的通用搜索工具
    const searchOptions: SearchOptions<Contract> = {
      keyword: params.keyword,
      searchFields: params.keyword ? ['title', 'content', 'tags'] : undefined,
      page: params.page,
      pageSize: params.pageSize,
      delay: 300,
      filters: {}
    };
    
    // 构建过滤条件
    if (params.category) searchOptions.filters!.category = params.category;
    if (params.year) searchOptions.filters!.year = params.year;
    if (params.province) searchOptions.filters!.province = params.province;
    if (params.city) searchOptions.filters!.city = params.city;
    
    // 处理年份范围过滤
    if (params.yearRange) {
      const [startYear, endYear] = params.yearRange;
      searchOptions.filters!.year = { min: startYear, max: endYear };
    }

    const result = await searchItems(this.contracts, searchOptions);

    return {
      total: result.total,
      list: result.data,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  /**
   * 获取常用关键词
   */
  async getCommonKeywords(limit: number = 10): Promise<CommonKeyword[]> {
    await simulateDelay(100);
    return this.commonKeywords.slice(0, limit);
  }

  /**
   * 获取统计数据
   */
  async getStatistics(): Promise<ContractStatistics> {
    await simulateDelay(200);

    // 分类分布统计
    const categoryMap = new Map<ContractCategory, number>();
    this.contracts.forEach(contract => {
      categoryMap.set(contract.category, (categoryMap.get(contract.category) || 0) + 1);
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: (count / this.contracts.length) * 100,
    }));

    // 年度趋势统计
    const yearMap = new Map<number, number>();
    this.contracts.forEach(contract => {
      yearMap.set(contract.year, (yearMap.get(contract.year) || 0) + 1);
    });

    const yearlyTrend = Array.from(yearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    // 地区分布统计
    const regionMap = new Map<string, number>();
    this.contracts.forEach(contract => {
      regionMap.set(contract.province, (regionMap.get(contract.province) || 0) + 1);
    });

    const regionDistribution = Array.from(regionMap.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCount: this.contracts.length,
      categoryDistribution,
      yearlyTrend,
      regionDistribution,
    };
  }

  /**
   * 获取地区数据（省市二级联动）
   */
  async getRegions(): Promise<Region[]> {
    await simulateDelay(100);

    return [
      {
        code: '110000',
        name: '北京',
        children: [
          { code: '110100', name: '北京市' },
        ],
      },
      {
        code: '310000',
        name: '上海',
        children: [
          { code: '310100', name: '上海市' },
        ],
      },
      {
        code: '440000',
        name: '广东',
        children: [
          { code: '440100', name: '广州市' },
          { code: '440300', name: '深圳市' },
          { code: '440600', name: '佛山市' },
        ],
      },
      {
        code: '330000',
        name: '浙江',
        children: [
          { code: '330100', name: '杭州市' },
          { code: '330200', name: '宁波市' },
          { code: '330300', name: '温州市' },
        ],
      },
      {
        code: '320000',
        name: '江苏',
        children: [
          { code: '320100', name: '南京市' },
          { code: '320200', name: '无锡市' },
          { code: '320500', name: '苏州市' },
        ],
      },
    ];
  }

  /**
   * 获取合同详情
   */
  async getContractDetail(id: string): Promise<ContractDetail | null> {
    await simulateDelay(300);
    const contract = this.contracts.find(c => c.id === id);
    
    if (!contract) {
      return null;
    }

    // 构造详细信息
    const detail: ContractDetail = {
      ...contract,
      signDate: '2024-01-15',
      effectiveDate: '2024-02-01',
      expiryDate: '2025-01-31',
      amount: Math.floor(Math.random() * 1000000) + 100000,
      partyA: '甲方公司名称',
      partyB: '乙方公司名称',
      status: ['draft', 'pending', 'approved', 'rejected'][Math.floor(Math.random() * 4)],
      sections: [
        {
          title: '第一章 总则',
          clauses: [
            {
              number: '1.1',
              title: '合同目的',
              content: '为明确双方的权利和义务，根据《中华人民共和国合同法》及相关法律法规，经双方友好协商，订立本合同。',
            },
            {
              number: '1.2',
              title: '合同范围',
              content: '本合同适用于双方之间的所有业务往来，包括但不限于产品销售、服务提供等。',
            },
          ],
        },
        {
          title: '第二章 合同条款',
          clauses: [
            {
              number: '2.1',
              title: '产品规格',
              content: '甲方向乙方提供符合国家标准的产品，具体规格详见附件一。',
            },
            {
              number: '2.2',
              title: '价格条款',
              content: `合同总金额为人民币 ${(Math.floor(Math.random() * 1000000) + 100000).toLocaleString()} 元整。`,
              important: true,
              note: '此为重要条款，请特别注意价格变更需双方书面确认。',
            },
            {
              number: '2.3',
              title: '付款方式',
              content: '乙方应在合同签订后7个工作日内支付30%预付款，货物交付后支付60%，验收合格后支付剩余10%。',
              important: true,
              note: '付款时间节点请严格遵守，逾期将产生违约责任。',
            },
          ],
        },
        {
          title: '第三章 违约责任',
          clauses: [
            {
              number: '3.1',
              title: '违约情形',
              content: '任何一方违反本合同约定，应承担相应的违约责任。',
            },
            {
              number: '3.2',
              title: '违约金',
              content: '违约方应向守约方支付合同总金额10%的违约金。',
            },
          ],
        },
      ],
      attachments: [
        {
          id: 'ATT001',
          name: '合同附件一-产品规格说明.pdf',
          size: '2.5MB',
          type: 'pdf',
          url: '/files/att001.pdf',
          uploadTime: '2024-01-15 10:30:00',
          uploader: '张三',
        },
        {
          id: 'ATT002',
          name: '合同附件二-技术参数.docx',
          size: '1.2MB',
          type: 'docx',
          url: '/files/att002.docx',
          uploadTime: '2024-01-15 11:00:00',
          uploader: '李四',
        },
        {
          id: 'ATT003',
          name: '报价单.xlsx',
          size: '856KB',
          type: 'xlsx',
          url: '/files/att003.xlsx',
          uploadTime: '2024-01-16 09:15:00',
          uploader: '王五',
        },
      ],
      history: [
        {
          version: 'v1.3',
          action: '修改',
          description: '更新了价格条款和付款方式',
          time: '2024-01-20 14:30:00',
          operator: '张三',
          changes: ['修改第2.2条价格', '调整第2.3条付款比例'],
        },
        {
          version: 'v1.2',
          action: '修改',
          description: '补充了违约责任条款',
          time: '2024-01-18 10:00:00',
          operator: '李四',
          changes: ['新增第三章违约责任'],
        },
        {
          version: 'v1.1',
          action: '修改',
          description: '调整了合同生效日期',
          time: '2024-01-16 16:20:00',
          operator: '王五',
          changes: ['修改生效日期为2024-02-01'],
        },
        {
          version: 'v1.0',
          action: '创建',
          description: '初始版本创建',
          time: '2024-01-15 09:00:00',
          operator: '张三',
        },
      ],
      statusHistory: [
        {
          status: 'approved',
          time: '2024-01-22 15:00:00',
          operator: '审批人',
          comment: '审核通过，同意签订',
        },
        {
          status: 'pending',
          time: '2024-01-20 14:35:00',
          operator: '张三',
          comment: '提交审核',
        },
        {
          status: 'draft',
          time: '2024-01-15 09:00:00',
          operator: '张三',
          comment: '创建草稿',
        },
      ],
      relatedContracts: [
        {
          id: 'CONTRACT_0050',
          title: '相关采购合同示例',
          year: 2023,
        },
        {
          id: 'CONTRACT_0051',
          title: '补充协议示例',
          year: 2024,
        },
      ],
      remarks: '本合同一式两份，甲乙双方各执一份，具有同等法律效力。合同自双方签字盖章之日起生效。',
    };

    return detail;
  }

  /**
   * 记录关键词搜索（用于更新常用关键词）
   */
  async recordKeywordSearch(keyword: string): Promise<void> {
    const existing = this.commonKeywords.find(k => k.keyword === keyword);
    if (existing) {
      existing.count++;
    } else {
      this.commonKeywords.push({ keyword, count: 1 });
    }
    // 按使用频率排序
    this.commonKeywords.sort((a, b) => b.count - a.count);
  }
}

export const contractService = new ContractService();
