// AI智能助手服务
import dayjs from 'dayjs';
import { simulateDelay } from '../utils/searchUtils';
import { Message, CaseInquiry, LegalArticle, CaseReference, QUESTION_TYPES } from '../types/ai-assistant';

// 问题处理工具类
export class QuestionProcessor {
  private static readonly VAGUE_KEYWORDS = ['怎么办', '如何', '能不能', '是否', '无效', '有效', '合法'];
  
  /**
   * 生成问题前缀
   */
  static generatePrefix(question: string, types: string[]): string {
    if (types.length === 0) return question;
    
    const typeLabels = types
      .map(type => QUESTION_TYPES.find(t => t.value === type)?.label)
      .filter(Boolean)
      .join('、');
    
    return `法律咨询 - 企业场景 - ${typeLabels}：${question}`;
  }

  /**
   * 检测是否需要追问
   */
  static detectVagueQuestion(question: string): boolean {
    return this.VAGUE_KEYWORDS.some(keyword => question.includes(keyword)) && question.length < 30;
  }
}

// 生成追问
export const generateFollowUpQuestions = (question: string): CaseInquiry[] => {
  return [
    {
      step: 1,
      question: '请问涉及的主体是什么？（如：公司、个人、合伙企业等）',
      answer: '',
      completed: false,
    },
    {
      step: 2,
      question: '请简要描述事实经过（时间、地点、具体行为）',
      answer: '',
      completed: false,
    },
    {
      step: 3,
      question: '您的具体诉求是什么？（如：解除合同、赔偿损失、确认效力等）',
      answer: '',
      completed: false,
    },
    {
      step: 4,
      question: '目前掌握哪些证据？（如：合同、聊天记录、转账记录等）',
      answer: '',
      completed: false,
    },
  ];
};

// 模拟AI回答生成
export const generateAIResponse = async (question: string, types: string[] = []): Promise<Message> => {
  // 模拟API调用延迟
  await simulateDelay(1500 + Math.floor(Math.random() * 1000));

  const prefixedQuestion = QuestionProcessor.generatePrefix(question, types);

  // 模拟法条数据
  const legalArticles: LegalArticle[] = [
    {
      name: '《中华人民共和国民法典》',
      article: '第585条',
      content: '当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金，也可以约定因违约产生的损失赔偿额的计算方法。约定的违约金低于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以增加；约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。',
      status: '现行有效',
      effectiveDate: '2021-01-01',
    },
  ];

  // 模拟案例参考
  const caseReferences: CaseReference[] = [
    {
      caseId: 'CASE001',
      title: '某科技公司与供应商买卖合同纠纷案',
      court: '北京市第一中级人民法院',
      similarity: 87,
    },
    {
      caseId: 'CASE002',
      title: '制造企业劳动合同竞业限制纠纷案',
      court: '上海市第二中级人民法院',
      similarity: 75,
    },
  ];

  // 模拟操作建议
  const suggestions: string[] = [
    '建议收集合同原件及相关往来函件作为基础证据',
    '保存违约行为的证据材料（如邮件、短信、录音等）',
    '及时发送书面催告函，明确违约事实和法律后果',
    '评估损失金额，准备损失证明材料',
    '必要时可申请诉前财产保全，防止对方转移资产',
  ];

  // 生成核心结论
  let content = `**核心结论**\n\n`;
  content += `根据您描述的情况，关于"${question.substring(0, 30)}${question.length > 30 ? '...' : ''}"的问题，从法律角度分析如下：\n\n`;
  
  content += `**1. 法律规定**\n`;
  content += `根据《民法典》第585条规定，合同双方可以约定违约金。违约金具有补偿性和惩罚性双重性质，主要目的是弥补守约方因对方违约所遭受的损失。\n\n`;
  
  content += `**2. 违约金上限**\n`;
  content += `司法实践中，违约金一般不超过实际损失的30%。如果约定的违约金过分高于造成的损失，守约方可以请求人民法院或仲裁机构予以适当减少。最高人民法院相关司法解释规定，超过实际损失30%的部分可以认定为"过分高于造成的损失"。\n\n`;
  
  content += `**3. 调整标准**\n`;
  content += `违约金的调整应当以实际损失为基础，综合考虑合同履行情况、当事人的过错程度、预期利益等因素。法院在判断违约金是否过高时，会考虑：\n`;
  content += `- 合同的实际履行情况\n`;
  content += `- 守约方的实际损失（包括直接损失和可得利益损失）\n`;
  content += `- 违约方的过错程度\n`;
  content += `- 违约金条款的约定是否公平合理\n\n`;
  
  content += `**4. 实务建议**\n`;
  content += `在合同签订时，违约金的约定应当合理，既要起到督促履约的作用，又要避免过分高于实际损失。建议：\n`;
  content += `- 违约金数额设置为合同总价的10%-30%较为合理\n`;
  content += `- 明确约定违约金的计算方式和支付期限\n`;
  content += `- 可以设置违约金上限条款\n`;
  content += `- 保留调整违约金的协商空间\n`;

  const response: Message = {
    id: Date.now().toString(),
    type: 'assistant',
    content,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    legalArticles,
    caseReferences,
    suggestions,
  };

  return response;
};

// 保存问答历史到localStorage
export const saveQAHistory = (message: Message): void => {
  const history = getQAHistory();
  history.unshift({
    id: message.id,
    question: '',
    answer: message.content,
    questionType: message.questionType || '',
    timestamp: message.timestamp,
    rating: message.rating,
    starred: message.starred || false,
    tags: [],
  });
  
  // 最多保存100条记录
  if (history.length > 100) {
    history.pop();
  }
  
  localStorage.setItem('ai_assistant_history', JSON.stringify(history));
};

// 获取问答历史
export const getQAHistory = (): any[] => {
  const historyStr = localStorage.getItem('ai_assistant_history');
  return historyStr ? JSON.parse(historyStr) : [];
};

// 清空历史记录
export const clearQAHistory = (): void => {
  localStorage.removeItem('ai_assistant_history');
};

// 导出为PDF（需要集成pdfmake）
export const exportToPDF = (messages: Message[]): void => {
  // 这里应该使用 pdfmake 库来生成PDF
  console.log('导出PDF功能待实现', messages);
};

// 导出为Word（需要集成docx库）
export const exportToWord = (messages: Message[]): void => {
  // 这里应该使用 docx 库来生成Word文档
  console.log('导出Word功能待实现', messages);
};
