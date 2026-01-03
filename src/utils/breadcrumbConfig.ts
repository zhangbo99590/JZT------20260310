/**
 * 面包屑导航配置
 * 定义所有页面的面包屑路径和标题
 */

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbConfig {
  [key: string]: BreadcrumbItem[];
}

// 面包屑配置映射
export const breadcrumbConfig: BreadcrumbConfig = {
  // 首页
  '/': [
  ],

  // 智慧政策模块
  '/policy-center': [
    { title: '智慧政策' }
  ],
  '/policy-center/main': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '政策查询' }
  ],
  '/policy-center/smart-matching': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '智能匹配' }
  ],
  '/policy-center/application-management': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理' }
  ],
  '/policy-center/my-applications': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '我的申报' }
  ],
  '/policy-center/my-applications/detail': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '我的申报', path: '/policy-center/my-applications' },
    { title: '申报详情' }
  ],
  '/policy-center/application-management/qualification': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '资质列表' }
  ],
  '/policy-center/application-management/qualification/detail': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '资质列表', path: '/policy-center/application-management/qualification' },
    { title: '资质详情' }
  ],
  '/policy-center/application-management/apply': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '申报向导' }
  ],
  '/policy-center/application-management/condition-check': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '条件检查' }
  ],
  '/policy-center/application-management/drafts': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报管理', path: '/policy-center/application-management' },
    { title: '草稿管理' }
  ],
  '/policy-center/application-guide': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报指导' }
  ],
  '/policy-center/application-guide/history': [
    { title: '智慧政策', path: '/policy-center' },
    { title: '申报指导', path: '/policy-center/application-guide' },
    { title: '历史记录' }
  ],

  // 法律护航模块
  '/legal-support': [
    { title: '法律护航' }
  ],
  '/legal-support/judicial-cases': [
    { title: '法律护航', path: '/legal-support' },
    { title: '司法案例库' }
  ],
  '/legal-support/judicial-cases/detail': [
    { title: '法律护航', path: '/legal-support' },
    { title: '司法案例库', path: '/legal-support/judicial-cases' },
    { title: '案例详情' }
  ],
  '/legal-support/regulation-query': [
    { title: '法律护航', path: '/legal-support' },
    { title: '法规查询' }
  ],
  '/legal-support/contract-management': [
    { title: '法律护航', path: '/legal-support' },
    { title: '合同管理' }
  ],
  '/legal-support/contract-management/detail': [
    { title: '法律护航', path: '/legal-support' },
    { title: '合同管理', path: '/legal-support/contract-management' },
    { title: '合同详情' }
  ],
  '/system/my-contracts': [
    { title: '系统管理', path: '/system' },
    { title: '我的合同' }
  ],
  '/system/my-contracts/detail': [
    { title: '系统管理', path: '/system' },
    { title: '我的合同', path: '/system/my-contracts' },
    { title: '合同详情' }
  ],
  '/system/my-favorites': [
    { title: '系统管理', path: '/system' },
    { title: '我的收藏' }
  ],
  '/legal-support/contract-detail': [
    { title: '法律护航', path: '/legal-support' },
    { title: '合同管理', path: '/legal-support/contract-management' },
    { title: '合同详情' }
  ],

  // 产业大厅模块
  '/industry-hall': [
    { title: '产业大厅' }
  ],
  '/industry-hall/supply-demand': [
    { title: '产业大厅', path: '/industry-hall' },
    { title: '商机对接' }
  ],
  '/industry-hall/supply-demand/detail': [
    { title: '产业大厅', path: '/industry-hall' },
    { title: '商机对接', path: '/industry-hall/supply-demand' },
    { title: '商机详情' }
  ],
  '/industry-hall/new-publication': [
    { title: '产业大厅', path: '/industry-hall' },
    { title: '发布商机' }
  ],
  '/industry-hall/my-opportunities': [
    { title: '产业大厅', path: '/industry-hall' },
    { title: '我的商机' }
  ],
  '/industry/connection-application-success': [
    { title: '产业大厅', path: '/industry-hall' },
    { title: '我的商机', path: '/industry-hall/my-opportunities' },
    { title: '申请成功' }
  ],

  // 金融服务模块
  '/supply-chain-finance': [
    { title: '金融服务' }
  ],
  '/supply-chain-finance/financing-diagnosis': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '融资诊断' }
  ],
  '/supply-chain-finance/financing-diagnosis-result': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '融资诊断', path: '/supply-chain-finance/financing-diagnosis' },
    { title: '诊断结果' }
  ],
  '/supply-chain-finance/diagnosis-report': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '融资诊断', path: '/supply-chain-finance/financing-diagnosis' },
    { title: '诊断报告' }
  ],
  '/supply-chain-finance/financing-option-detail': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '融资方案详情' }
  ],
  '/supply-chain-finance/application-success': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '申请成功' }
  ],
  '/supply-chain-finance/diagnosis-analysis': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '诊断分析' }
  ],
  '/supply-chain-finance/data-visualization': [
    { title: '金融服务', path: '/supply-chain-finance' },
    { title: '数据可视化' }
  ],

  // 系统管理模块
  '/system': [
    { title: '系统管理' }
  ],
  '/system/users': [
    { title: '系统管理', path: '/system' },
    { title: '用户管理' }
  ],
  '/system/roles': [
    { title: '系统管理', path: '/system' },
    { title: '角色管理' }
  ],
  '/system/permissions': [
    { title: '系统管理', path: '/system' },
    { title: '权限管理' }
  ],
  '/system/personal-center': [
    { title: '系统管理', path: '/system' },
    { title: '个人中心' }
  ],
  '/system/company-management': [
    { title: '系统管理', path: '/system' },
    { title: '企业管理' }
  ],
};

/**
 * 根据当前路径获取面包屑配置
 * @param pathname 当前路径
 * @param params 路由参数（用于动态路由）
 * @returns 面包屑项目数组
 */
export const getBreadcrumbItems = (pathname: string, params?: Record<string, string>): BreadcrumbItem[] => {
  // 处理动态路由，将参数替换为通用路径
  let normalizedPath = pathname;
  
  // 处理带参数的路由
  if (params) {
    Object.keys(params).forEach(key => {
      normalizedPath = normalizedPath.replace(`/${params[key]}`, '');
    });
  }
  
  // 处理特殊的动态路由模式
  normalizedPath = normalizedPath
    .replace(/\/detail\/[^/]+$/, '/detail')
    .replace(/\/apply\/[^/]+$/, '/apply')
    .replace(/\/condition-check\/[^/]+$/, '/condition-check')
    .replace(/\/qualification\/[^/]+$/, '/qualification/detail')
    .replace(/\/financing-option-detail\/[^/]+$/, '/financing-option-detail');

  return breadcrumbConfig[normalizedPath] || breadcrumbConfig['/'];
};
