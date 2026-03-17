import fs from 'fs';
import path from 'path';

/**
 * 深度代码分析器 v3.0 - 从菜单配置读取模块结构，从 TSX 文件提取业务功能
 * 
 * 本模块提供深度解析 React/TSX 代码的能力：
 * 1. 从 menuConfig.tsx 严格读取模块和功能层级结构
 * 2. 递归扫描 src 目录，智能识别页面组件
 * 3. 将页面组件匹配到对应的功能下
 * 4. 提取数据模型（TypeScript 接口、useState、Props）
 * 5. 识别 UI 组件结构（表格、表单、弹窗、卡片、步骤条等）
 * 6. 分析业务功能（CRUD 操作、搜索筛选、状态管理、导入导出等）
 * 7. 提取业务规则、权限控制和交互流程
 */

// ==================== 菜单配置解析（核心）====================

/**
 * 从 menuConfig.tsx 提取模块和功能结构
 * @param {string} projectRoot - 项目根目录
 * @returns {Array<{key: string, label: string, children: Array, isModule: boolean}>} - 模块和功能结构
 */
function extractMenuStructure(projectRoot) {
  const menuConfigPath = path.join(projectRoot, 'src', 'config', 'menuConfig.tsx');
  
  if (!fs.existsSync(menuConfigPath)) {
    console.warn(`⚠️ 未找到菜单配置文件: ${menuConfigPath}`);
    return [];
  }
  
  console.log(`📋 读取菜单配置: ${path.relative(projectRoot, menuConfigPath)}`);
  
  const menuContent = fs.readFileSync(menuConfigPath, 'utf-8');
  
  // 提取 getMenuItems 函数中的菜单配置
  const menuItemsMatch = menuContent.match(/return\s*\[([\s\S]*?)\];\s*\}\s*$/m);
  if (!menuItemsMatch) {
    console.warn('⚠️ 无法解析菜单配置');
    return [];
  }
  
  // 解析模块结构
  const modules = [];
  
  // 匹配一级菜单项（模块）- 改进的正则，支持任意顺序的属性和多行
  const modulePattern = /\{\s*key:\s*["']([^"']+)["']\s*,[\s\S]*?label:\s*["']([^"']+)["'](?:[\s\S]*?children:\s*(\[[\s\S]*?\]))?[\s\S]*?\}(?=\s*,|\s*\])/g;
  
  let moduleMatch;
  while ((moduleMatch = modulePattern.exec(menuContent)) !== null) {
    const moduleKey = moduleMatch[1];
    const moduleLabel = moduleMatch[2];
    const childrenStr = moduleMatch[3];
    
    const moduleItem = {
      key: moduleKey,
      label: moduleLabel,
      isModule: true,
      children: []
    };
    
    // 如果有子菜单（功能），解析子菜单
    if (childrenStr) {
      // 匹配子菜单项 - 改进的正则，支持多行和任意属性顺序
      const childPattern = /\{\s*key:\s*["']([^"']+)["'][\s\S]*?label:\s*["']([^"']+)["'][\s\S]*?\}(?=\s*,|\s*\])/g;
      let childMatch;
      while ((childMatch = childPattern.exec(childrenStr)) !== null) {
        moduleItem.children.push({
          key: childMatch[1],
          label: childMatch[2],
          isModule: false
        });
      }
    }
    
    modules.push(moduleItem);
  }
  
  console.log(`  ✓ 解析到 ${modules.length} 个模块`);
  modules.forEach(m => {
    console.log(`    - ${m.label}: ${m.children.length} 个功能`);
  });
  
  return modules;
}

/**
 * 从 routeMenuMap 获取路由到菜单键的映射
 * @param {string} projectRoot - 项目根目录
 * @returns {Map<string, string>} - 路由路径到菜单键的映射
 */
function extractRouteMenuMap(projectRoot) {
  const menuConfigPath = path.join(projectRoot, 'src', 'config', 'menuConfig.tsx');
  const routeToMenuKey = new Map();
  
  if (!fs.existsSync(menuConfigPath)) {
    return routeToMenuKey;
  }
  
  const menuContent = fs.readFileSync(menuConfigPath, 'utf-8');
  
  // 解析 routeMenuMap
  const routeMenuMapMatch = menuContent.match(/export\s+const\s+routeMenuMap[^{]*\{([^}]+)\}/s);
  if (routeMenuMapMatch) {
    const mapContent = routeMenuMapMatch[1];
    const entryPattern = /["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
    let entryMatch;
    while ((entryMatch = entryPattern.exec(mapContent)) !== null) {
      routeToMenuKey.set(entryMatch[1], entryMatch[2]);
    }
  }
  
  return routeToMenuKey;
}

/**
 * 根据文件路径匹配对应的功能
 * @param {string} filePath - 文件路径
 * @param {Array} menuStructure - 菜单结构
 * @param {Map} routeToMenuKey - 路由到菜单键的映射
 * @returns {Object|null} - 匹配到的模块和功能
 */
function matchFileToFunction(filePath, menuStructure, routeToMenuKey) {
  const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
  const baseName = path.basename(filePath, '.tsx').toLowerCase();
  
  // 文件名到功能的映射表（用于精确匹配）
  const fileToFunctionMap = {
    // 政策中心
    'policysearch': { module: '政策中心', function: '智慧政策' },
    'aipolicysearch': { module: '政策中心', function: '智慧政策' },
    'enhancedpolicysearch': { module: '政策中心', function: '智慧政策' },
    'policydetail': { module: '政策中心', function: '智慧政策' },
    'enhancedpolicydetail': { module: '政策中心', function: '智慧政策' },
    'policyapprovedlist': { module: '政策中心', function: '智慧政策' },
    'application': { module: '政策中心', function: '申报管理' },
    'applysuccess': { module: '政策中心', function: '申报管理' },
    'applywizard': { module: '政策中心', function: '申报管理' },
    'myapplications': { module: '政策中心', function: '我的申报' },
    'optimizedmyapplications': { module: '政策中心', function: '我的申报' },
    
    // 法律护航
    'ailawyer': { module: '法律护航', function: 'AI 问答' },
    'regulationquery': { module: '法律护航', function: '法规查询' },
    'regulationdetail': { module: '法律护航', function: '法规详情' },
    
    // 产业管理
    'servicematchhome': { module: '产业管理', function: '业务大厅' },
    'workbench': { module: '产业管理', function: '业务大厅' },
    'procurementhall': { module: '产业管理', function: '采购大厅' },
    'myservices': { module: '产业管理', function: '我的业务管理' },
    'servicepublish': { module: '产业管理', function: '我的业务管理' },
    'matchdetail': { module: '产业管理', function: '采购大厅' },
    'mymatches': { module: '产业管理', function: '我的业务管理' },
    'mymessages': { module: '产业管理', function: '我的业务管理' },
    
    // 金融服务
    'financingdiagnosis': { module: '金融服务', function: '融资诊断' },
    'diagnosisreport': { module: '金融服务', function: '诊断分析报告' },
    'diagnosisanalysis': { module: '金融服务', function: '诊断分析报告' },
    
    // 系统管理
    'usermanagement': { module: '系统管理', function: '用户管理' },
    'personalcenter': { module: '系统管理', function: '个人中心' },
    'myfavorites': { module: '系统管理', function: '我的收藏' },
    'companymanagement': { module: '系统管理', function: '企业管理' },
    
    // 首页
    'home': { module: '首页', function: '首页' },
    'index': { module: '首页', function: '首页' },
  };
  
  // 首先尝试文件名精确匹配
  if (fileToFunctionMap[baseName]) {
    return fileToFunctionMap[baseName];
  }
  
  // 尝试路径匹配
  for (const [key, mapping] of Object.entries(fileToFunctionMap)) {
    if (normalizedPath.includes(key)) {
      return mapping;
    }
  }
  
  // 尝试根据路由匹配
  for (const [route, menuKey] of routeToMenuKey) {
    const normalizedRoute = route.toLowerCase().replace(/\//g, '');
    if (normalizedPath.includes(normalizedRoute) || baseName.includes(normalizedRoute)) {
      // 找到对应的模块和功能
      for (const module of menuStructure) {
        if (module.key === menuKey) {
          return { module: module.label, function: module.label };
        }
        for (const func of module.children) {
          if (func.key === menuKey) {
            return { module: module.label, function: func.label };
          }
        }
      }
    }
  }
  
  return null;
}

// ==================== 类型定义（JSDoc）====================

/**
 * @typedef {Object} DataField
 * @property {string} name - 字段名
 * @property {string} type - 字段类型
 * @property {boolean} required - 是否必填
 * @property {string} description - 字段说明
 * @property {string[]} [options] - 枚举选项
 */

/**
 * @typedef {Object} DataModel
 * @property {string} entity - 实体名称
 * @property {DataField[]} fields - 字段列表
 */

/**
 * @typedef {Object} FunctionConfig
 * @property {string} id - 功能ID
 * @property {string} name - 功能名称
 * @property {string} type - 功能类型（列表展示/表单提交/搜索筛选等）
 * @property {string} description - 功能描述
 * @property {string[]} [listFields] - 列表展示字段
 * @property {string[]} [searchFields] - 搜索字段
 * @property {Array<{field: string, label: string, options: string[]}>} [filters] - 筛选条件
 * @property {Object} [pagination] - 分页配置
 * @property {Array<{name: string, label: string, type: string, required?: boolean, options?: string[], validation?: string}>} [formFields] - 表单字段
 * @property {string[]} [businessRules] - 业务规则
 */

/**
 * @typedef {Object} ModuleAnalysis
 * @property {string} name - 模块英文名称
 * @property {string} chineseName - 模块中文名称
 * @property {string} filePath - 文件相对路径
 * @property {string} description - 模块描述
 * @property {DataModel[]} dataModels - 数据模型
 * @property {FunctionConfig[]} functions - 功能列表
 * @property {string[]} businessRules - 业务规则
 * @property {Array<{scenario: string, behavior: string}>} exceptionScenarios - 异常场景
 */

// ==================== 目录和文件扫描 ====================

/**
 * 需要排除的目录
 */
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.trae',
  '__tests__',
  '__mocks__',
  'test',
  'tests',
  'stories',
  'storybook',
  '.storybook'
];

/**
 * 需要排除的文件模式
 */
const EXCLUDED_FILE_PATTERNS = [
  /^index\./,                    // index.tsx, index.ts
  /\.test\./,                   // *.test.tsx
  /\.spec\./,                   // *.spec.tsx
  /\.stories\./,                // *.stories.tsx
  /types?\./,                    // types.ts, type.ts
  /constants?\./,                // constants.ts, constant.ts
  /config\./,                    // config.ts
  /utils?\./,                    // utils.ts, util.ts
  /helpers?\./,                  // helpers.ts, helper.ts
  /\.d\.ts$/,                   // 类型声明文件
  /Content/,                     // 包含 Content 的文件
  /Template/,                    // 包含 Template 的文件
  /Context/,                     // Context 文件
  /Provider/,                    // Provider 文件
  /Hook/,                        // Hook 文件
  /use[A-Z]/,                    // useXxx hook 文件
];

/**
 * 组件目录优先级（用于判断是否是页面组件）
 */
const PAGE_DIRECTORIES = [
  'pages',
  'views',
  'routes',
  'screens',
  'modules'
];

/**
 * 非页面目录（通常是可复用组件）
 */
const NON_PAGE_DIRECTORIES = [
  'components',
  'common',
  'shared',
  'ui',
  'widgets',
  'elements',
  'layout',
  'layouts',
  'hooks',
  'utils',
  'helpers',
  'services',
  'api',
  'config',
  'types',
  'styles',
  'assets',
  'data',
  'mock',
  'context',
  'providers'
];

/**
 * 递归扫描目录获取所有 TSX 文件
 * @param {string} dir - 目录路径
 * @param {string} [baseDir] - 基础目录（用于计算相对路径）
 * @param {string[]} [files] - 文件列表（递归用）
 * @returns {string[]} - TSX 文件路径列表
 */
function scanTsxFiles(dir, baseDir = dir, files = []) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(baseDir, fullPath);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 排除不需要扫描的目录
        if (EXCLUDED_DIRS.includes(item) || item.startsWith('.')) {
          continue;
        }
        scanTsxFiles(fullPath, baseDir, files);
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        // 检查文件是否应该被排除
        if (!shouldExcludeFile(item, relativePath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`扫描目录出错: ${dir}`, error.message);
  }
  
  return files;
}

/**
 * 判断文件是否应该被排除
 * @param {string} fileName - 文件名
 * @param {string} relativePath - 相对路径
 * @returns {boolean}
 */
function shouldExcludeFile(fileName, relativePath) {
  // 检查文件路径是否包含非页面目录
  const pathParts = relativePath.split(path.sep);
  for (const part of pathParts) {
    if (NON_PAGE_DIRECTORIES.includes(part.toLowerCase())) {
      return true;
    }
  }
  
  // 检查文件名是否匹配排除模式
  for (const pattern of EXCLUDED_FILE_PATTERNS) {
    if (pattern.test(fileName)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 判断是否是页面组件（而非普通组件）
 * @param {string} filePath - 文件路径
 * @param {string} sourceCode - 源代码
 * @returns {boolean}
 */
function isPageComponent(filePath, sourceCode) {
  const normalizedPath = filePath.toLowerCase();
  
  // 检查路径是否包含页面目录
  for (const pageDir of PAGE_DIRECTORIES) {
    if (normalizedPath.includes(`/${pageDir}/`) || normalizedPath.includes(`\\${pageDir}\\`)) {
      return true;
    }
  }
  
  // 检查是否是路由组件（包含路由相关代码）
  if (sourceCode.includes('useParams') || 
      sourceCode.includes('useNavigate') || 
      sourceCode.includes('useLocation') ||
      sourceCode.includes('Outlet') ||
      sourceCode.includes('<Route')) {
    return true;
  }
  
  // 检查是否是页面级组件（通常包含完整的页面结构）
  const pageIndicators = [
    'PageHeader',
    'PageWrapper',
    'Breadcrumb',
    'Layout',
    'title={',
    'document.title'
  ];
  
  for (const indicator of pageIndicators) {
    if (sourceCode.includes(indicator)) {
      return true;
    }
  }
  
  return false;
}

// ==================== 代码分析功能 ====================

/**
 * 从 TSX 代码中提取 TypeScript 接口定义
 * @param {string} sourceCode 
 * @returns {DataModel[]}
 */
function extractInterfaces(sourceCode) {
  const models = [];
  
  // 匹配接口定义
  const interfacePattern = /interface\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = interfacePattern.exec(sourceCode)) !== null) {
    const interfaceName = match[1];
    const interfaceBody = match[2];
    
    const fields = [];
    // 解析字段
    const fieldPattern = /(\w+)(\?)?:\s*([^;\n]+)/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldPattern.exec(interfaceBody)) !== null) {
      const fieldName = fieldMatch[1];
      const isOptional = !!fieldMatch[2];
      const fieldType = fieldMatch[3].trim();
      
      fields.push({
        name: fieldName,
        type: fieldType,
        required: !isOptional,
        description: ''
      });
    }
    
    if (fields.length > 0) {
      models.push({
        entity: interfaceName,
        fields
      });
    }
  }
  
  return models;
}

/**
 * 从 TSX 代码中提取 useState 定义的状态
 * @param {string} sourceCode 
 * @returns {DataModel[]}
 */
function extractUseStateModels(sourceCode) {
  const models = [];
  const fields = [];
  
  // 匹配 useState 定义
  const useStatePattern = /const\s+\[([^,]+),\s*set(\w+)\]\s*=\s*useState(?:<([^>]+)>)?\(([^)]*)\)/g;
  let match;
  
  while ((match = useStatePattern.exec(sourceCode)) !== null) {
    const stateName = match[1].trim();
    const stateType = match[3] || inferTypeFromValue(match[4]);
    const defaultValue = match[4];
    
    fields.push({
      name: stateName,
      type: stateType,
      required: false,
      description: defaultValue && defaultValue !== 'undefined' ? `默认值: ${defaultValue}` : ''
    });
  }
  
  if (fields.length > 0) {
    models.push({
      entity: 'ComponentState',
      fields
    });
  }
  
  return models;
}

/**
 * 根据默认值推断类型
 * @param {string} value 
 * @returns {string}
 */
function inferTypeFromValue(value) {
  if (!value || value === 'undefined') return 'any';
  if (value.startsWith('"') || value.startsWith("'")) return 'string';
  if (value === 'true' || value === 'false') return 'boolean';
  if (!isNaN(Number(value))) return 'number';
  if (value.startsWith('[')) return 'array';
  if (value.startsWith('{')) return 'object';
  return 'any';
}

/**
 * 分析表格结构
 * @param {string} sourceCode 
 * @returns {Object}
 */
function analyzeTableStructure(sourceCode) {
  const result = {
    hasTable: false,
    columns: [],
    hasPagination: false,
    hasSearch: false,
    hasFilters: false
  };
  
  // 检查是否有表格
  if (sourceCode.includes('<Table') || sourceCode.includes('Table ')) {
    result.hasTable = true;
  }
  
  // 检查是否有分页
  if (sourceCode.includes('Pagination') || sourceCode.includes('pagination')) {
    result.hasPagination = true;
  }
  
  // 检查是否有搜索
  if (sourceCode.includes('Search') || sourceCode.includes('search') || 
      sourceCode.includes('Input') && sourceCode.includes('onSearch')) {
    result.hasSearch = true;
  }
  
  // 检查是否有筛选
  if (sourceCode.includes('Filter') || sourceCode.includes('filter') ||
      sourceCode.includes('Select') && sourceCode.includes('onChange')) {
    result.hasFilters = true;
  }
  
  return result;
}

/**
 * 分析表单结构
 * @param {string} sourceCode 
 * @returns {Object}
 */
function analyzeFormStructure(sourceCode) {
  const result = {
    hasForm: false,
    fields: [],
    hasValidation: false
  };
  
  // 检查是否有表单
  if (sourceCode.includes('<Form') || sourceCode.includes('Form ')) {
    result.hasForm = true;
  }
  
  // 检查是否有验证
  if (sourceCode.includes('rules=') || sourceCode.includes('validator') ||
      sourceCode.includes('required:') || sourceCode.includes('message:')) {
    result.hasValidation = true;
  }
  
  return result;
}

/**
 * 分析弹窗/对话框
 * @param {string} sourceCode 
 * @returns {Array}
 */
function analyzeModals(sourceCode) {
  const modals = [];
  
  // 检查是否有弹窗
  if (sourceCode.includes('Modal') || sourceCode.includes('Drawer') || sourceCode.includes('Dialog')) {
    // 尝试提取弹窗标题
    const titlePattern = /title[=:]\s*["']([^"']+)["']/g;
    let match;
    while ((match = titlePattern.exec(sourceCode)) !== null) {
      modals.push({ title: match[1] });
    }
  }
  
  return modals;
}

/**
 * 分析事件处理器
 * @param {string} sourceCode 
 * @returns {Object}
 */
function analyzeHandlers(sourceCode) {
  const handlers = {
    hasCreate: false,
    hasEdit: false,
    hasDelete: false,
    hasView: false,
    hasImport: false,
    hasExport: false,
    hasSearch: false,
    hasFilter: false
  };
  
  const code = sourceCode.toLowerCase();
  
  if (code.includes('create') || code.includes('add') || code.includes('new')) handlers.hasCreate = true;
  if (code.includes('edit') || code.includes('update')) handlers.hasEdit = true;
  if (code.includes('delete') || code.includes('remove')) handlers.hasDelete = true;
  if (code.includes('view') || code.includes('detail')) handlers.hasView = true;
  if (code.includes('import')) handlers.hasImport = true;
  if (code.includes('export')) handlers.hasExport = true;
  if (code.includes('search') || code.includes('query')) handlers.hasSearch = true;
  if (code.includes('filter')) handlers.hasFilter = true;
  
  return handlers;
}

/**
 * 提取业务规则
 * @param {string} sourceCode 
 * @returns {string[]}
 */
function extractBusinessRules(sourceCode) {
  const rules = [];
  
  // 从注释中提取规则
  const commentPattern = /\/\*\s*([^*]+)\*\//g;
  let match;
  while ((match = commentPattern.exec(sourceCode)) !== null) {
    const comment = match[1].trim();
    if (comment.includes('规则') || comment.includes('必须') || comment.includes('校验')) {
      rules.push(comment);
    }
  }
  
  // 从验证逻辑中提取规则
  if (sourceCode.includes('required: true') || sourceCode.includes('required={true}')) {
    rules.push('必填字段校验');
  }
  
  if (sourceCode.includes('email') && sourceCode.includes('validator')) {
    rules.push('邮箱格式校验');
  }
  
  return rules;
}

/**
 * 提取异常场景
 * @param {string} sourceCode 
 * @returns {Array}
 */
function extractExceptionScenarios(sourceCode) {
  const scenarios = [];
  
  // 检查错误处理
  if (sourceCode.includes('try') && sourceCode.includes('catch')) {
    scenarios.push({ scenario: '接口异常', behavior: '捕获异常并提示错误信息' });
  }
  
  if (sourceCode.includes('loading') || sourceCode.includes('setLoading')) {
    scenarios.push({ scenario: '加载状态', behavior: '显示加载中状态' });
  }
  
  if (sourceCode.includes('empty') || sourceCode.includes('no data')) {
    scenarios.push({ scenario: '空数据', behavior: '显示空数据提示' });
  }
  
  return scenarios;
}

/**
 * 生成功能配置
 * @param {string} moduleName 
 * @param {Object} tableInfo 
 * @param {Object} formInfo 
 * @param {Array} modals 
 * @param {Object} handlers 
 * @param {Object} constants 
 * @param {string} sourceCode 
 * @returns {FunctionConfig[]}
 */
function generateFunctionConfigs(moduleName, tableInfo, formInfo, modals, handlers, constants, sourceCode) {
  const functions = [];
  let funcIndex = 1;
  
  // 列表展示功能
  if (tableInfo.hasTable) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '列表展示',
      type: '列表展示',
      description: '以表格形式展示数据列表，支持搜索、筛选、排序、分页',
      pagination: tableInfo.hasPagination ? { pageSize: 10 } : null
    });
    funcIndex++;
  }
  
  // 搜索功能
  if (handlers.hasSearch || tableInfo.hasSearch) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '搜索查询',
      type: '搜索筛选',
      description: '支持关键词搜索和多条件筛选'
    });
    funcIndex++;
  }
  
  // 新增功能
  if (handlers.hasCreate && formInfo.hasForm) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '新增数据',
      type: '新增功能',
      description: '创建新数据记录，包含表单填写和数据校验'
    });
    funcIndex++;
  }
  
  // 编辑功能
  if (handlers.hasEdit && formInfo.hasForm) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '编辑数据',
      type: '编辑功能',
      description: '编辑现有数据记录，支持数据回显和更新'
    });
    funcIndex++;
  }
  
  // 删除功能
  if (handlers.hasDelete) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '删除数据',
      type: '删除功能',
      description: '删除数据记录，包含删除确认和级联处理'
    });
    funcIndex++;
  }
  
  // 查看详情功能
  if (handlers.hasView) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '查看详情',
      type: '查看功能',
      description: '查看数据详情信息'
    });
    funcIndex++;
  }
  
  // 导入导出功能
  if (handlers.hasImport || handlers.hasExport) {
    functions.push({
      id: `FUNC-${String(funcIndex).padStart(3, '0')}`,
      name: '导入导出',
      type: '导入导出',
      description: '支持数据的批量导入和导出'
    });
    funcIndex++;
  }
  
  // 如果没有识别到任何功能，添加一个默认功能
  if (functions.length === 0) {
    functions.push({
      id: 'FUNC-001',
      name: '页面展示',
      type: '展示功能',
      description: '页面内容展示功能'
    });
  }
  
  return functions;
}

/**
 * 生成模块描述
 * @param {string} chineseName 
 * @param {FunctionConfig[]} functions 
 * @returns {string}
 */
function generateModuleDescription(chineseName, functions) {
  const funcNames = functions.map(f => f.name).join('、');
  return `${chineseName}模块，提供${funcNames}等功能`;
}

// ==================== 核心分析函数 ====================

/**
 * 分析单个组件文件
 * @param {string} filePath - 文件路径
 * @param {string} projectRoot - 项目根目录
 * @returns {Object|null} - 分析结果
 */
function analyzeComponent(filePath, projectRoot) {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否是页面组件
  if (!isPageComponent(filePath, sourceCode)) {
    return null;
  }
  
  const relativePath = path.relative(projectRoot, filePath);
  const baseName = path.basename(filePath, '.tsx');
  
  // 1. 提取数据模型
  const interfaceModels = extractInterfaces(sourceCode);
  const stateModels = extractUseStateModels(sourceCode);
  const dataModels = [...interfaceModels, ...stateModels];
  
  // 2. 分析 UI 结构
  const tableInfo = analyzeTableStructure(sourceCode);
  const formInfo = analyzeFormStructure(sourceCode);
  const modals = analyzeModals(sourceCode);
  const handlers = analyzeHandlers(sourceCode);
  
  // 3. 生成功能配置
  const functions = generateFunctionConfigs(
    baseName,
    tableInfo,
    formInfo,
    modals,
    handlers,
    {},
    sourceCode
  );
  
  // 4. 提取业务规则
  const businessRules = extractBusinessRules(sourceCode);
  
  // 5. 提取异常场景
  const exceptionScenarios = extractExceptionScenarios(sourceCode);
  
  return {
    name: baseName,
    filePath: relativePath,
    sourceCode,
    dataModels,
    functions,
    businessRules,
    exceptionScenarios,
    tableInfo,
    formInfo,
    handlers
  };
}

/**
 * 按模块组织分析结果
 * @param {Array} componentAnalyses - 组件分析结果列表
 * @param {Array} menuStructure - 菜单结构
 * @param {Map} routeToMenuKey - 路由到菜单键的映射
 * @returns {Array} - 按模块组织的结果
 */
function organizeByModule(componentAnalyses, menuStructure, routeToMenuKey) {
  const moduleMap = new Map();
  
  // 初始化模块映射
  for (const module of menuStructure) {
    moduleMap.set(module.label, {
      name: module.label,
      key: module.key,
      isModule: true,
      functions: new Map()
    });
    
    // 初始化功能映射
    for (const func of module.children) {
      moduleMap.get(module.label).functions.set(func.label, {
        name: func.label,
        key: func.key,
        components: []
      });
    }
    
    // 如果模块没有子功能，模块本身就是一个功能
    if (module.children.length === 0) {
      moduleMap.get(module.label).functions.set(module.label, {
        name: module.label,
        key: module.key,
        components: []
      });
    }
  }
  
  // 将组件分析结果分配到对应的功能下
  for (const analysis of componentAnalyses) {
    const match = matchFileToFunction(analysis.filePath, menuStructure, routeToMenuKey);
    
    if (match) {
      const moduleData = moduleMap.get(match.module);
      if (moduleData) {
        const functionData = moduleData.functions.get(match.function);
        if (functionData) {
          functionData.components.push(analysis);
        } else {
          // 如果功能不存在，创建一个
          moduleData.functions.set(match.function, {
            name: match.function,
            key: '',
            components: [analysis]
          });
        }
      }
    } else {
      // 未匹配的组件，尝试根据路径推断
      const normalizedPath = analysis.filePath.toLowerCase();
      
      for (const module of menuStructure) {
        const moduleKeyNormalized = module.key.toLowerCase().replace(/\//g, '');
        if (normalizedPath.includes(moduleKeyNormalized)) {
          // 找到模块，尝试匹配功能
          let matched = false;
          for (const func of module.children) {
            const funcKeyNormalized = func.key.toLowerCase().replace(/\//g, '');
            if (normalizedPath.includes(funcKeyNormalized)) {
              moduleMap.get(module.label).functions.get(func.label).components.push(analysis);
              matched = true;
              break;
            }
          }
          
          // 如果没有匹配到具体功能，添加到第一个功能
          if (!matched && module.children.length > 0) {
            const firstFunc = module.children[0];
            moduleMap.get(module.label).functions.get(firstFunc.label).components.push(analysis);
          }
          break;
        }
      }
    }
  }
  
  // 转换为数组格式
  return Array.from(moduleMap.values()).map(module => ({
    ...module,
    functions: Array.from(module.functions.values())
  }));
}

// ==================== 模块导出 ====================

export {
  scanTsxFiles,
  analyzeComponent,
  extractMenuStructure,
  extractRouteMenuMap,
  matchFileToFunction,
  organizeByModule,
  isPageComponent,
  shouldExcludeFile,
  extractInterfaces,
  extractUseStateModels,
  analyzeTableStructure,
  analyzeFormStructure,
  analyzeModals,
  analyzeHandlers,
  extractBusinessRules,
  extractExceptionScenarios,
  generateFunctionConfigs
};
