/**
 * 关键词分词工具 - 用于将搜索关键词拆解为核心词
 * 支持中文分词和智能提取
 */

/**
 * 简单的中文分词函数
 * 将长关键词拆解为有意义的核心词
 * @param keyword 原始关键词
 * @returns 核心词数组
 */
export const segmentKeyword = (keyword: string): string[] => {
  if (!keyword || !keyword.trim()) return [];

  const trimmedKeyword = keyword.trim();
  const segments: string[] = [];

  // 常见的地区词
  const districts = [
    "东城区",
    "西城区",
    "朝阳区",
    "海淀区",
    "丰台区",
    "石景山区",
    "门头沟区",
    "房山区",
    "通州区",
    "顺义区",
    "昌平区",
    "大兴区",
    "怀柔区",
    "平谷区",
    "密云区",
    "延庆区",
    "北京市",
    "北京",
  ];

  // 常见的行业/领域词
  const industries = [
    "金融",
    "科技",
    "文化",
    "教育",
    "医疗",
    "制造",
    "服务",
    "建筑",
    "房地产",
    "农业",
    "商业",
    "贸易",
    "物流",
    "旅游",
    "互联网",
    "软件",
    "硬件",
    "电子",
    "通信",
    "能源",
    "环保",
    "交通",
    "运输",
    "餐饮",
    "零售",
    "批发",
    "创业",
    "创新",
  ];

  // 常见的政策类型词
  const policyTypes = [
    "补贴",
    "资助",
    "奖励",
    "扶持",
    "优惠",
    "减免",
    "贷款",
    "融资",
    "投资",
    "税收",
    "人才",
    "项目",
    "认定",
    "申报",
    "评审",
    "公示",
    "政策",
    "办法",
    "通知",
    "指南",
    "条例",
  ];

  // 提取地区词
  for (const district of districts) {
    if (trimmedKeyword.includes(district)) {
      segments.push(district);
    }
  }

  // 提取行业词
  for (const industry of industries) {
    if (trimmedKeyword.includes(industry)) {
      segments.push(industry);
    }
  }

  // 提取政策类型词
  for (const policyType of policyTypes) {
    if (trimmedKeyword.includes(policyType)) {
      segments.push(policyType);
    }
  }

  // 如果没有提取到任何核心词，则将整个关键词作为一个核心词
  if (segments.length === 0) {
    // 按长度分割（每2-4个字符为一个词）
    if (trimmedKeyword.length <= 4) {
      segments.push(trimmedKeyword);
    } else {
      // 尝试智能分割
      const words = trimmedKeyword.match(/.{2,4}/g) || [];
      segments.push(...words);
    }
  }

  // 去重并返回
  return Array.from(new Set(segments));
};

/**
 * 格式化关键词显示（用于搜索结果提示）
 * 将核心词用特殊标记包裹，便于后续高亮处理
 * @param keyword 原始关键词
 * @returns 格式化后的关键词对象数组
 */
export const formatKeywordDisplay = (
  keyword: string,
): Array<{ text: string; isCore: boolean }> => {
  if (!keyword || !keyword.trim()) return [];

  const segments = segmentKeyword(keyword);
  const result: Array<{ text: string; isCore: boolean }> = [];

  let remainingText = keyword.trim();
  let lastIndex = 0;

  // 按照核心词在原文中的位置进行分割
  segments.forEach((segment) => {
    const index = remainingText.indexOf(segment, lastIndex);
    if (index !== -1) {
      // 添加核心词之前的文本（非核心词）
      if (index > lastIndex) {
        const nonCoreText = remainingText.substring(lastIndex, index);
        if (nonCoreText) {
          result.push({ text: nonCoreText, isCore: false });
        }
      }

      // 添加核心词
      result.push({ text: segment, isCore: true });
      lastIndex = index + segment.length;
    }
  });

  // 添加剩余的文本
  if (lastIndex < remainingText.length) {
    result.push({ text: remainingText.substring(lastIndex), isCore: false });
  }

  return result;
};
