// AI智能助手相关类型定义

// 问题类型
export interface QuestionType {
  value: string;
  label: string;
  color: string;
}

// 法律条文
export interface LegalArticle {
  name: string;
  article: string;
  content: string;
  status: '现行有效' | '已废止' | '已修订';
  effectiveDate: string;
}

// 案例参考
export interface CaseReference {
  caseId: string;
  title: string;
  court: string;
  similarity: number;
}

// 对话消息
export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  questionType?: string;
  rating?: number;
  feedback?: string;
  legalArticles?: LegalArticle[];
  caseReferences?: CaseReference[];
  suggestions?: string[];
  starred?: boolean;
}

// 案情挖掘步骤
export interface CaseInquiry {
  step: number;
  question: string;
  answer: string;
  completed: boolean;
}

// 问答历史记录
export interface QAHistory {
  id: string;
  question: string;
  answer: string;
  questionType: string;
  timestamp: string;
  rating?: number;
  starred: boolean;
  tags: string[];
}

// 问题类型常量
export const QUESTION_TYPES: QuestionType[] = [
  { value: 'contract', label: '合同纠纷', color: 'blue' },
  { value: 'labor', label: '劳动用工', color: 'green' },
  { value: 'tax', label: '财税合规', color: 'orange' },
  { value: 'intellectual', label: '知识产权', color: 'purple' },
  { value: 'corporate', label: '公司治理', color: 'cyan' },
  { value: 'finance', label: '金融法律', color: 'red' },
  { value: 'trade', label: '贸易争议', color: 'magenta' },
  { value: 'environment', label: '环保合规', color: 'lime' },
  { value: 'data', label: '数据合规', color: 'geekblue' },
  { value: 'other', label: '其他咨询', color: 'default' },
];

// TOP10 高频问题
export const TOP_QUESTIONS = [
  '合同违约金上限是多少？',
  '员工试用期最长可以设置多久？',
  '如何合法解除劳动合同？',
  '增值税专用发票如何抵扣？',
  '商标侵权如何认定和赔偿？',
  '股东会决议效力如何判断？',
  '借款合同逾期利息计算标准？',
  '竞业限制补偿金如何支付？',
  '公司注销需要哪些法律程序？',
  '个人信息保护法对企业有哪些要求？',
];
