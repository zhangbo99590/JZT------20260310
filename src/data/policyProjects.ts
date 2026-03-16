/**
 * 政策项目数据模块
 *
 * @file policyProjects.ts
 * @desc 定义政策项目数据结构及默认项目数据
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 类型定义 ---
 * - ApplicationProject: 政策申请项目接口
 *
 * --- 数据说明 ---
 * - policyProjects: 默认政策项目数据数组
 *
 * --- 项目类别说明 ---
 * - high_tech: 高新技术企业
 * - tech_sme: 科技型中小企业
 * - specialized: 专精特新企业
 * - rd_tax: 研发费用加计扣除
 * - innovation: 创新平台
 * - digital: 数字化转型
 *
 * @note 状态值说明：available-可申请, applying-申请中, completed-已完成, expired-已过期
 * @note 难度值说明：easy-简单, medium-中等, hard-困难
 * @warning 实际项目应从API获取数据，此为模拟数据
 */

/**
 * 政策申请项目接口
 *
 * @description
 * 定义政策申请项目的数据结构，包含项目基本信息、状态、难度、补贴标准等。
 */
export interface ApplicationProject {
  /** 项目唯一标识符 */
  id: string;
  /** 项目标题 */
  title: string;
  /** 项目类别 */
  category: string;
  /** 项目描述 */
  description: string;
  /** 申请截止日期 */
  deadline: string;
  /** 项目状态：available-可申请, applying-申请中, completed-已完成, expired-已过期 */
  status: "available" | "applying" | "completed" | "expired";
  /** 申请难度：easy-简单, medium-中等, hard-困难 */
  difficulty: "easy" | "medium" | "hard";
  /** 补贴金额或标准 */
  subsidy: string;
  /** 申请要求列表 */
  requirements: string[];
}

/**
 * 默认政策项目数据
 *
 * @description
 * 提供默认的政策申请项目数据，用于开发和测试环境。
 * 包含8个不同类别和难度的政策项目，覆盖北京市多个区域。
 *
 * @note 实际项目中应从API获取真实数据
 * @warning 此数据为模拟数据，生产环境需替换
 */
export const policyProjects: ApplicationProject[] = [
  {
    id: "1",
    title: "丰台区金融政策",
    category: "high_tech",
    description:
      "丰台区支持金融企业发展的相关政策，包括金融机构落户奖励、金融人才引进补贴等优惠措施。",
    deadline: "2024-04-30",
    status: "available",
    difficulty: "medium",
    subsidy: "最高200万元",
    requirements: ["金融机构", "注册资本", "纳税贡献"],
  },
  {
    id: "2",
    title: "北京市高新技术企业认定",
    category: "tech_sme",
    description: "北京市高新技术企业认定政策，享受企业所得税减免等优惠政策。",
    deadline: "2024-05-31",
    status: "available",
    difficulty: "easy",
    subsidy: "税收减免15%",
    requirements: ["研发人员", "知识产权", "科技成果"],
  },
  {
    id: "3",
    title: "朝阳区专精特新企业培育",
    category: "specialized",
    description:
      "朝阳区专精特新企业培育政策，支持中小企业向专业化、精细化、特色化、新颖化方向发展。",
    deadline: "2024-06-15",
    status: "available",
    difficulty: "hard",
    subsidy: "最高50万元",
    requirements: ["专业化", "精细化", "特色化", "新颖化"],
  },
  {
    id: "4",
    title: "海淀区科技创新政策",
    category: "rd_tax",
    description:
      "海淀区科技创新支持政策，包括研发费用补贴、创新平台建设支持等。",
    deadline: "2024-12-31",
    status: "available",
    difficulty: "medium",
    subsidy: "研发费用加计扣除200%",
    requirements: ["研发活动", "创新平台", "技术转化"],
  },
  {
    id: "5",
    title: "西城区数字经济发展政策",
    category: "innovation",
    description: "西城区数字经济发展支持政策，促进数字技术与实体经济深度融合。",
    deadline: "2024-07-31",
    status: "available",
    difficulty: "medium",
    subsidy: "最高100万元",
    requirements: ["数字化转型", "技术创新", "产业升级"],
  },
  {
    id: "6",
    title: "东城区绿色发展补贴政策",
    category: "digital",
    description: "东城区绿色发展补贴政策，支持企业节能减排和绿色技术应用。",
    deadline: "2024-08-15",
    status: "available",
    difficulty: "easy",
    subsidy: "最高30万元",
    requirements: ["绿色技术", "节能减排", "环保认证"],
  },
  {
    id: "7",
    title: "石景山区产业转型升级政策",
    category: "innovation",
    description:
      "石景山区产业转型升级支持政策，推动传统产业向高端化、智能化发展。",
    deadline: "2024-09-30",
    status: "available",
    difficulty: "medium",
    subsidy: "最高80万元",
    requirements: ["产业转型", "技术升级", "智能制造"],
  },
  {
    id: "8",
    title: "通州区文化创意产业政策",
    category: "specialized",
    description: "通州区文化创意产业发展政策，支持文化科技融合和创意产业发展。",
    deadline: "2024-10-31",
    status: "available",
    difficulty: "easy",
    subsidy: "最高60万元",
    requirements: ["文化创意", "科技融合", "原创内容"],
  },
];
