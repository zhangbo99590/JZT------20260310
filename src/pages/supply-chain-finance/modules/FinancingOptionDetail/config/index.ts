/**
 * 融资方案详情页面配置
 * 创建时间: 2026-01-13
 */

import type { FinancingOption } from "../types";

// 融资方案详情数据
export const FINANCING_OPTIONS_DATA: Record<string, FinancingOption> = {
  "1": {
    id: "1",
    name: "供应链金融-应收账款融资",
    type: "供应链金融",
    matchScore: 95,
    matchLevel: "极度推荐",
    interestRate: "6.5%-8.5%",
    amount: "100-2000万",
    term: "3-12个月",
    description:
      "基于企业真实贸易背景，以应收账款为质押的融资产品。适合有稳定核心客户、应收账款质量良好的企业。审批快速，无需传统抵押担保，可循环使用。",
    requirements: [
      "应收账款真实有效，有完整的贸易合同和发票",
      "核心企业信用良好，为知名企业或上市公司",
      "历史交易记录完整，合作关系稳定",
      "企业成立满2年，经营状况良好",
      "无重大违法违规记录",
    ],
    advantages: [
      "审批快速，最快3个工作日放款",
      "无需抵押担保，降低融资门槛",
      "可循环使用，提高资金使用效率",
      "成本相对较低，利率优惠",
      "手续简便，线上化操作",
      "灵活还款，支持多种还款方式",
    ],
    risks: [
      "依赖核心企业信用状况",
      "应收账款质量直接影响融资额度",
      "贸易背景真实性审核严格",
      "核心企业付款延迟风险",
    ],
    provider: "工商银行",
    processingTime: "3-5个工作日",
    successRate: 85,
    rating: 5,
    applicationProcess: [
      "提交申请材料，包括营业执照、财务报表等",
      "银行初步审核，评估企业基本情况",
      "应收账款真实性核查，确认贸易背景",
      "核心企业信用调查，评估付款能力",
      "综合评估，确定融资额度和利率",
      "签署融资协议，办理相关手续",
      "资金放款，开始使用融资资金",
    ],
    requiredDocuments: [
      "营业执照副本",
      "组织机构代码证",
      "税务登记证",
      "近三年财务报表",
      "应收账款明细表",
      "贸易合同原件",
      "发票复印件",
      "核心企业资信证明",
      "企业征信报告",
      "法人身份证明",
    ],
    contactInfo: {
      phone: "400-888-9999",
      email: "scf@icbc.com.cn",
      address: "北京市西城区复兴门内大街55号",
      contactPerson: "张经理",
    },
    caseStudies: [
      {
        companyName: "某制造企业",
        industry: "机械制造",
        amount: "800万",
        term: "6个月",
        result: "成功获得融资，解决了生产资金周转问题，订单按时交付",
      },
      {
        companyName: "某贸易公司",
        industry: "进出口贸易",
        amount: "1200万",
        term: "3个月",
        result: "快速获得资金支持，扩大了进货规模，提升了市场竞争力",
      },
      {
        companyName: "某科技公司",
        industry: "软件开发",
        amount: "500万",
        term: "12个月",
        result: "获得研发资金支持，成功推出新产品，实现业务突破",
      },
    ],
  },
  "2": {
    id: "2",
    name: "银行流动资金贷款",
    type: "银行贷款",
    matchScore: 88,
    matchLevel: "匹配度 88%",
    interestRate: "4.5%-6.5%",
    amount: "50-5000万",
    term: "1-3年",
    description:
      "传统银行信贷产品，适合有稳定经营收入、良好信用记录的企业。利率相对较低，额度较大，但审批周期较长，需要提供担保或抵押。",
    requirements: [
      "企业信用良好，无不良征信记录",
      "财务状况稳定，盈利能力强",
      "提供足值担保或抵押物",
      "企业成立满3年，经营稳定",
      "符合国家产业政策导向",
    ],
    advantages: [
      "利率较低，融资成本优势明显",
      "额度较大，可满足大额资金需求",
      "期限灵活，支持中长期融资",
      "银行信誉保障，资金安全可靠",
      "可享受银行综合金融服务",
    ],
    risks: [
      "审批周期长，资金到账时间较慢",
      "需要担保或抵押，增加融资成本",
      "还款压力大，需按期还本付息",
      "审批条件严格，门槛相对较高",
    ],
    provider: "建设银行",
    processingTime: "15-30个工作日",
    successRate: 70,
    rating: 4,
    applicationProcess: [
      "企业提交贷款申请及相关材料",
      "银行受理申请，进行初步审查",
      "实地调研，了解企业经营状况",
      "财务分析，评估还款能力",
      "担保物评估，确定担保方式",
      "信贷审批，确定贷款条件",
      "签署合同，办理担保手续",
      "放款到账，开始计息",
    ],
    requiredDocuments: [
      "贷款申请书",
      "营业执照等证照",
      "近三年审计报告",
      "最近月度财务报表",
      "贷款卡或征信报告",
      "担保物权属证明",
      "担保物评估报告",
      "企业章程",
      "董事会决议",
      "法人身份证明",
    ],
    contactInfo: {
      phone: "400-820-0588",
      email: "loan@ccb.com",
      address: "北京市西城区金融大街25号",
      contactPerson: "李经理",
    },
    caseStudies: [
      {
        companyName: "某房地产企业",
        industry: "房地产开发",
        amount: "3000万",
        term: "2年",
        result: "获得开发资金支持，项目顺利推进，实现预期收益",
      },
      {
        companyName: "某零售连锁",
        industry: "零售业",
        amount: "1500万",
        term: "3年",
        result: "扩大门店规模，提升市场占有率，营收大幅增长",
      },
    ],
  },
  "3": {
    id: "3",
    name: "融资租赁",
    type: "融资租赁",
    matchScore: 82,
    matchLevel: "匹配度 82%",
    interestRate: "7.0%-10.0%",
    amount: "设备价值80%",
    term: "2-5年",
    description:
      "以设备为载体的融资方式，企业可以在不占用银行授信额度的情况下获得设备使用权和资金支持。适合需要更新设备、扩大生产的企业。",
    requirements: [
      "设备价值评估合理，权属清晰",
      "企业经营稳定，有持续盈利能力",
      "租赁物权属清晰，无争议",
      "企业信用良好，无重大违约记录",
      "符合融资租赁公司准入标准",
    ],
    advantages: [
      "保留设备使用权，不影响生产经营",
      "享受税收优惠政策",
      "提升资产使用效率",
      "不占用银行授信额度",
      "灵活的还款安排",
    ],
    risks: [
      "融资成本相对较高",
      "设备贬值风险",
      "租赁期间设备所有权归租赁公司",
      "提前终止成本较高",
    ],
    provider: "中信金融租赁",
    processingTime: "10-20个工作日",
    successRate: 75,
    rating: 4,
    applicationProcess: [
      "提交租赁申请及企业资料",
      "设备评估，确定租赁价值",
      "企业资信调查",
      "制定租赁方案",
      "签署租赁合同",
      "设备交付使用",
      "按期支付租金",
    ],
    requiredDocuments: [
      "租赁申请书",
      "企业营业执照",
      "财务报表",
      "设备购买合同",
      "设备技术资料",
      "设备评估报告",
      "企业征信报告",
      "法人身份证明",
    ],
    contactInfo: {
      phone: "400-600-1818",
      email: "leasing@citicfl.com",
      address: "北京市朝阳区光华路2号",
      contactPerson: "王经理",
    },
    caseStudies: [
      {
        companyName: "某印刷企业",
        industry: "印刷包装",
        amount: "600万",
        term: "3年",
        result: "更新生产设备，提升产能和产品质量，订单量显著增加",
      },
    ],
  },
};

// 资金用途选项
export const PURPOSE_OPTIONS = [
  { value: "equipment", label: "设备采购" },
  { value: "working-capital", label: "流动资金" },
  { value: "expansion", label: "业务扩张" },
  { value: "rd", label: "研发投入" },
  { value: "other", label: "其他" },
];

// 获取融资方案详情
export function getFinancingOptionDetail(optionId: string): FinancingOption {
  return FINANCING_OPTIONS_DATA[optionId] || FINANCING_OPTIONS_DATA["1"];
}
