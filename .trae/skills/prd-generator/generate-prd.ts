import * as fs from 'fs';
import * as path from 'path';

/**
 * PRD生成功能清单工具 - TypeScript版本
 * 
 * 本脚本采用"代码分析 + AI生成"的双阶段模式：
 * 1. 分析项目代码，生成完整的模块功能清单
 * 2. AI基于功能清单，为每个模块生成详细的PRD文档
 * 
 * 使用方式：
 * - 使用当前工作目录: ts-node generate-prd.ts
 * - 指定项目路径: ts-node generate-prd.ts --root /path/to/project
 * - 使用环境变量: PROJECT_ROOT=/path/to/project ts-node generate-prd.ts
 */

// ==================== 类型定义 ====================

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  validation?: string;
  default?: string | number;
  min?: number;
  max?: number;
  step?: number;
}

interface FunctionConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  listFields?: string[];
  searchFields?: string[];
  filters?: Array<{ field: string; label: string; options: string[] }>;
  pagination?: { pageSize: number; pageSizeOptions?: number[]; totalPages?: number };
  formFields?: FieldConfig[];
  editableFields?: string[];
  readonlyFields?: string[];
  specialLogic?: string[];
  businessRules?: string[];
  deleteCondition?: string;
  confirmation?: string;
  cascadeEffect?: string;
  categories?: string[];
  autoFillFields?: string[];
  parameters?: FieldConfig[];
  features?: string[];
  saveModes?: string[];
  operation?: string;
  options?: Array<{ id: string; label: string; desc: string }>;
  editor?: string;
}

interface DataModel {
  entity: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    options?: string[];
    range?: string;
  }>;
}

interface ModuleConfig {
  dataModels: DataModel[];
  functions: FunctionConfig[];
  businessRules: string[];
  exceptionScenarios: Array<{ scenario: string; behavior: string }>;
}

interface ModuleDescription {
  description: string;
  coreFeatures: string[];
}

interface ExtractedState {
  name: string;
  type: string;
  initialValue: string;
}

// ==================== 配置数据 ====================

// 中英文映射表
const nameMapping: Record<string, string> = {
  'AccountManagement': '账户管理',
  'AgentBuilder': '智能体构建器',
  'AgentList': '智能体列表',
  'CollaborationModule': '协作模块',
  'Dashboard': '仪表盘',
  'DigitalHuman': '数字人',
  'DigitalHumanContent': '数字人内容',
  'DigitalHumanTemplate': '数字人模板',
  'FlowOrchestrator': '流程编排器',
  'KnowledgeModule': '知识模块',
  'Login': '登录',
  'MonitoringModule': '监控模块',
  'SystemIntegration': '系统集成',
  'SystemSettings': '系统设置'
};

// 模块业务描述映射
const moduleDescriptions: Record<string, ModuleDescription> = {
  'AccountManagement': {
    description: '提供组织账号治理功能，支持成员管理、权限分配、部门归属配置和账号状态控制。实现企业级RBAC权限管理体系，确保系统访问安全可控。',
    coreFeatures: ['成员列表管理', '角色权限分配', '部门组织架构', '账号状态控制', '访问凭证管理']
  },
  'AgentBuilder': {
    description: '提供智能体构建功能，支持从40+行业模板快速启动或创建空白项目。实现智能体身份配置、能力设定、参数调优的全流程管理。',
    coreFeatures: ['模板库选择', '智能体身份配置', '系统提示词编辑', '模型参数调优', '实时对话测试']
  },
  'AgentList': {
    description: '提供智能体资产管理功能，支持智能体的列表展示、搜索筛选、编辑配置、版本回滚和性能监控。实现智能体全生命周期管理。',
    coreFeatures: ['智能体卡片展示', '搜索筛选', '编辑配置', '删除管理', '版本回滚', '性能监控']
  },
  'CollaborationModule': {
    description: '提供多智能体协同编排功能，支持策略市场、工作流实例管理、多机性能监控。实现复杂业务场景下的智能体协作调度。',
    coreFeatures: ['策略市场', '协同实例管理', '多机性能监控', '分布式流量监控', '异常日志队列']
  },
  'Dashboard': {
    description: '提供系统仪表盘功能，展示关键业务指标、资产分布、任务动态和资源监控。实现系统运行状态的全景可视化管理。',
    coreFeatures: ['关键指标展示', '资产分布概览', '业务动态报告', '算力集群状态', '快捷操作入口']
  },
  'DigitalHuman': {
    description: '提供数字人资产管理功能，支持形象库、背景库、动作库的统一管理。实现数字人资源的选择、预览和绑定。',
    coreFeatures: ['形象资产管理', '背景资产管理', '动作资产管理', '资源筛选搜索', '资源预览']
  },
  'DigitalHumanContent': {
    description: '提供数字人内容制作功能，支持脚本编辑、TTS语音配置、交互渲染设置和视频合成。实现数字人播报内容的端到端生产。',
    coreFeatures: ['脚本制作', 'TTS参数调优', '交互渲染配置', '视频合成', '导出下载']
  },
  'DigitalHumanTemplate': {
    description: '提供数字人模板精修功能，支持可视化编辑、资源插槽管理、源码编辑和部署发布。实现数字人模板的精细化定制。',
    coreFeatures: ['可视化编辑', '资源插槽管理', '源码编辑', '模板预览', '部署发布']
  },
  'FlowOrchestrator': {
    description: '提供流程编排功能，支持可视化流程设计、节点编排、调试仿真和执行记录查看。实现复杂业务流程的可视化编排和管理。',
    coreFeatures: ['可视化流程设计', '节点库', '连线编排', '调试仿真', '执行记录']
  },
  'KnowledgeModule': {
    description: '提供知识库管理功能，支持文档上传、索引构建、语义搜索测试和版本管理。实现企业知识资产的统一管理和智能检索。',
    coreFeatures: ['文档库管理', '索引与快照', '语义回显测试', '批量上传', '加工策略配置']
  },
  'Login': {
    description: '提供用户认证功能，支持账号密码登录和角色选择。实现基于RBAC的安全访问控制。',
    coreFeatures: ['账号密码登录', '角色选择', '安全加密', '访问控制']
  },
  'MonitoringModule': {
    description: '提供全链路监控功能，支持指标驾驶舱、日志检索、告警规则和链路追踪。实现系统运行状态的全面可观测性。',
    coreFeatures: ['指标全景驾驶舱', '日志检索', '告警规则', '链路追踪', '拓扑可视化']
  },
  'SystemIntegration': {
    description: '提供系统集成功能，支持数据库连接池管理、第三方应用集成和安全策略配置。实现与外部系统的无缝对接。',
    coreFeatures: ['数据库连接池', '第三方应用集成', '安全策略管理', '密钥托管']
  },
  'SystemSettings': {
    description: '提供系统设置功能，支持模型推理引擎配置、GPU弹性算力管理、安全合规策略和系统备份。实现系统级的全局配置管理。',
    coreFeatures: ['模型推理引擎', 'GPU算力集群', '向量库存储', '安全合规', '系统备份']
  }
};

// 模块详细功能配置
const moduleFunctionConfigs: Record<string, ModuleConfig> = {
  'AccountManagement': {
    dataModels: [
      {
        entity: 'User',
        fields: [
          { name: 'id', type: 'string', required: true, description: '用户唯一标识' },
          { name: 'name', type: 'string', required: true, description: '真实姓名' },
          { name: 'email', type: 'string', required: true, description: '业务邮箱（作为登入标识）' },
          { name: 'role', type: 'enum', required: true, description: '系统角色等级', options: ['SuperAdmin', 'Developer', 'Auditor', 'DevOps'] },
          { name: 'dept', type: 'string', required: true, description: '所属部门' },
          { name: 'status', type: 'enum', required: true, description: '访问状态', options: ['active', 'disabled'] },
          { name: 'avatar', type: 'string', required: false, description: '头像URL' }
        ]
      }
    ],
    functions: [
      {
        id: 'FUNC-001',
        name: '成员列表展示',
        type: '列表展示',
        description: '以表格形式展示组织成员列表，支持搜索、筛选、分页',
        listFields: ['身份识别', '组织部门', '权限角色', '访问状态', '操作控制'],
        searchFields: ['name', 'email', 'dept', 'role'],
        filters: [
          { field: 'status', label: '访问状态', options: ['全部', '启用', '停用'] }
        ],
        pagination: { pageSize: 10, pageSizeOptions: [10, 20, 50] }
      },
      {
        id: 'FUNC-002',
        name: '新增成员',
        type: '表单提交',
        description: '创建新成员账号，填写基本信息并分配权限',
        formFields: [
          { name: 'name', label: '真实姓名', type: 'text', required: true, validation: '不能为空' },
          { name: 'email', label: '业务邮箱', type: 'email', required: true, validation: '邮箱格式，唯一性校验' },
          { name: 'password', label: '登录密码', type: 'password', required: true, validation: '至少8位，含大小写和数字' },
          { name: 'role', label: '系统角色等级', type: 'select', required: true, options: ['SuperAdmin', 'Developer', 'Auditor', 'DevOps'] },
          { name: 'dept', label: '所属部门', type: 'select', required: true, options: ['核心研发组', '合规部', '模型精调组', '基础设施组', '交互体验组', '法务部', '产品运营中心', '算力调度组'] }
        ],
        businessRules: [
          '邮箱作为唯一登入标识，不可重复',
          '密码必须符合安全强度要求'
        ]
      },
      {
        id: 'FUNC-003',
        name: '编辑成员',
        type: '表单编辑',
        description: '编辑现有成员的信息和权限',
        editableFields: ['name', 'password', 'role', 'dept'],
        readonlyFields: ['email'],
        specialLogic: [
          '密码留空表示不修改',
          '业务邮箱作为登录标识不可修改'
        ]
      },
      {
        id: 'FUNC-004',
        name: '切换账号状态',
        type: '状态切换',
        description: '启用或停用成员账号',
        operation: '启用/停用切换',
        businessRules: [
          '停用后账号无法登录系统',
          '切换后即时生效'
        ]
      },
      {
        id: 'FUNC-005',
        name: '删除成员',
        type: '删除操作',
        description: '删除成员账号，撤销所有权限',
        deleteCondition: '任何状态下均可删除',
        confirmation: '二次确认对话框',
        cascadeEffect: '删除后该账号所有权限失效'
      }
    ],
    businessRules: [
      '邮箱作为唯一登入标识，不可重复',
      'SuperAdmin角色拥有全量系统权限',
      '停用状态的账号无法访问系统',
      '删除账号前需确认，操作不可撤销'
    ],
    exceptionScenarios: [
      { scenario: '邮箱重复', behavior: '阻止保存，提示"该邮箱已被注册"' },
      { scenario: '必填为空', behavior: '阻止保存，提示"请填写必填字段"' },
      { scenario: '格式错误', behavior: '阻止保存，提示"邮箱格式不正确"' },
      { scenario: '密码强度不足', behavior: '阻止保存，提示"密码强度不足"' }
    ]
  },
  'AgentBuilder': {
    dataModels: [
      {
        entity: 'Agent',
        fields: [
          { name: 'id', type: 'string', required: true, description: '智能体唯一标识' },
          { name: 'name', type: 'string', required: true, description: '内部唯一ID' },
          { name: 'displayName', type: 'string', required: true, description: '显示名称' },
          { name: 'description', type: 'string', required: false, description: '功能描述' },
          { name: 'avatar', type: 'string', required: false, description: '头像URL' },
          { name: 'tags', type: 'array', required: false, description: '人格标签' },
          { name: 'model', type: 'string', required: true, description: 'AI模型', options: ['gemini-3-flash-preview'] },
          { name: 'systemPrompt', type: 'text', required: true, description: '系统提示词' },
          { name: 'temperature', type: 'number', required: true, description: '推理温度', range: '0-2' },
          { name: 'topP', type: 'number', required: true, description: '核采样', range: '0-1' },
          { name: 'maxLength', type: 'number', required: true, description: '最大Token数' },
          { name: 'memoryDepth', type: 'number', required: true, description: '记忆深度' },
          { name: 'capabilities', type: 'array', required: false, description: '能力配置' },
          { name: 'tools', type: 'array', required: false, description: '工具集' },
          { name: 'status', type: 'enum', required: true, description: '状态', options: ['active', 'draft'] }
        ]
      }
    ],
    functions: [
      {
        id: 'FUNC-001',
        name: '模板库浏览',
        type: '列表展示',
        description: '浏览40+行业模板，支持分类筛选和搜索',
        categories: ['客户服务', '内容创作', '技术效率', '专家顾问', '生活助手'],
        searchFields: ['name', 'category', 'desc'],
        pagination: { pageSize: 8, totalPages: 5 }
      },
      {
        id: 'FUNC-002',
        name: '应用模板',
        type: '数据填充',
        description: '选择模板后自动填充智能体配置',
        autoFillFields: ['displayName', 'systemPrompt', 'tags', 'description']
      },
      {
        id: 'FUNC-003',
        name: '智能体身份配置',
        type: '表单配置',
        description: '配置智能体的基本身份信息',
        formFields: [
          { name: 'displayName', label: '显示名称', type: 'text', required: true },
          { name: 'description', label: '功能描述', type: 'textarea', required: false },
          { name: 'avatar', label: '头像', type: 'image', required: false },
          { name: 'tags', label: '人格标签', type: 'multiSelect', required: false, options: ['友好', '专业', '幽默', '严谨', '创新', '稳重', '活泼', '冷静', '热情', '理性', '温柔', '果断'] }
        ]
      },
      {
        id: 'FUNC-004',
        name: '系统提示词编辑',
        type: '富文本编辑',
        description: '编辑智能体的系统提示词，定义行为准则',
        editor: 'textarea',
        features: ['实时预览', '语法高亮']
      },
      {
        id: 'FUNC-005',
        name: '能力配置',
        type: '多选配置',
        description: '配置智能体的能力模块',
        options: [
          { id: 'knowledge', label: '知识库问答', desc: '支持RAG检索增强' },
          { id: 'api', label: '外部API调用', desc: '支持自定义工具' },
          { id: 'code', label: '代码解释/生成', desc: '支持多语言编程' },
          { id: 'image', label: '图像理解', desc: '支持视觉输入' }
        ]
      },
      {
        id: 'FUNC-006',
        name: '模型参数调优',
        type: '参数配置',
        description: '调整AI模型的推理参数',
        parameters: [
          { name: 'model', label: '基础模型', type: 'select', options: ['gemini-3-flash-preview'], default: 'gemini-3-flash-preview' },
          { name: 'temperature', label: '推理温度', type: 'range', min: 0, max: 2, step: 0.1, default: 0.7 },
          { name: 'topP', label: '核采样', type: 'range', min: 0, max: 1, step: 0.1, default: 0.9 },
          { name: 'maxLength', label: '最大Token数', type: 'number', default: 2048 },
          { name: 'memoryDepth', label: '记忆深度', type: 'number', default: 5 }
        ]
      },
      {
        id: 'FUNC-007',
        name: '实时对话测试',
        type: '交互测试',
        description: '与智能体实时对话，测试响应效果',
        features: ['实时对话', '上下文保持', '响应时间显示']
      },
      {
        id: 'FUNC-008',
        name: '保存智能体',
        type: '数据保存',
        description: '保存智能体配置',
        saveModes: ['保存为草稿', '直接发布']
      }
    ],
    businessRules: [
      '支持40+行业最佳实践模板',
      '人格标签从预设12个标签中选择',
      'Temperature控制输出随机性，值越大创造性越强',
      '系统提示词定义智能体的行为准则',
      '构建过程支持实时测试验证'
    ],
    exceptionScenarios: [
      { scenario: '名称重复', behavior: '提示"智能体名称已存在"' },
      { scenario: '提示词为空', behavior: '提示"请填写系统提示词"' },
      { scenario: '参数超出范围', behavior: '自动校正到边界值' }
    ]
  }
  // 其他模块配置省略，实际使用时需要补充完整
};

// ==================== 工具函数 ====================

/**
 * 获取项目根目录路径
 * 优先级：1. 环境变量 PROJECT_ROOT  2. 命令行参数  3. 当前工作目录
 */
function getProjectRoot(): string {
  // 从环境变量获取
  if (process.env.PROJECT_ROOT) {
    return path.resolve(process.env.PROJECT_ROOT);
  }
  
  // 从命令行参数获取
  const args = process.argv.slice(2);
  const rootIndex = args.findIndex(arg => arg === '--root' || arg === '-r');
  if (rootIndex !== -1 && args[rootIndex + 1]) {
    return path.resolve(args[rootIndex + 1]);
  }
  
  // 默认使用当前工作目录
  return process.cwd();
}

/**
 * 分析项目结构，识别功能模块
 */
function analyzeProjectStructure(projectRoot: string): string[] {
  const components: string[] = [];
  const files = fs.readdirSync(projectRoot);
  
  console.log('扫描项目文件...\n');
  console.log(`项目根目录: ${projectRoot}\n`);
  
  files.forEach(file => {
    if (file.endsWith('.tsx') && !file.startsWith('index.') && !file.includes('Content') && !file.includes('Template')) {
      const componentName = file.replace('.tsx', '');
      components.push(componentName);
    }
  });
  
  return components;
}

/**
 * 读取组件源代码
 */
function readComponentSource(componentName: string, projectRoot: string): string {
  const filePath = path.join(projectRoot, `${componentName}.tsx`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
}

/**
 * 从代码中提取数据模型
 */
function extractDataModels(sourceCode: string): ExtractedState[] {
  const models: ExtractedState[] = [];
  
  // 匹配 useState 定义的状态
  const stateRegex = /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  
  while ((match = stateRegex.exec(sourceCode)) !== null) {
    const stateName = match[1];
    const initialValue = match[2];
    
    // 尝试推断类型
    let type = 'any';
    if (initialValue.includes('[')) type = 'array';
    else if (initialValue.includes('{')) type = 'object';
    else if (initialValue.includes('true') || initialValue.includes('false')) type = 'boolean';
    else if (!isNaN(parseFloat(initialValue))) type = 'number';
    else if (initialValue.includes("'") || initialValue.includes('"')) type = 'string';
    
    models.push({
      name: stateName,
      type: type,
      initialValue: initialValue.slice(0, 50) + (initialValue.length > 50 ? '...' : '')
    });
  }
  
  return models;
}

/**
 * 从代码中提取函数/操作
 */
function extractFunctions(sourceCode: string): string[] {
  const functions: string[] = [];
  
  // 匹配 handle 开头的函数
  const funcRegex = /const\s+(handle\w+)\s*=\s*\(/g;
  let match: RegExpExecArray | null;
  
  while ((match = funcRegex.exec(sourceCode)) !== null) {
    functions.push(match[1]);
  }
  
  return functions;
}

// ==================== 核心功能 ====================

/**
 * 生成功能清单
 */
function generateFunctionList(projectRoot: string): void {
  try {
    console.log('='.repeat(60));
    console.log('开始生成功能清单');
    console.log('='.repeat(60));
    console.log();
    
    // 分析项目结构
    const components = analyzeProjectStructure(projectRoot);
    
    // 转换为中文名称显示
    const chineseNames = components.map(name => nameMapping[name] || name);
    console.log(`识别到 ${components.length} 个功能模块：\n`);
    components.forEach((name, index) => {
      const config = moduleFunctionConfigs[name];
      const funcCount = config ? config.functions.length : 0;
      console.log(`  ${index + 1}. ${chineseNames[index]} (${name}) - ${funcCount}个功能`);
    });
    console.log();
    
    // 开始生成功能清单内容
    let functionListContent = `# 项目功能清单

> 生成时间：${new Date().toLocaleString('zh-CN')}
> 生成方式：代码自动分析
> 项目路径：${projectRoot}

## 模块概览

| 序号 | 模块名称 | 英文标识 | 功能数量 | 数据模型 | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

    let totalFunctions = 0;
    let totalDataModels = 0;
    
    components.forEach((component, index) => {
      const chineseName = nameMapping[component] || component;
      const config = moduleFunctionConfigs[component];
      const funcCount = config?.functions?.length || 0;
      const modelCount = config?.dataModels?.length || 0;
      totalFunctions += funcCount;
      totalDataModels += modelCount;
      
      functionListContent += `| ${index + 1} | ${chineseName} | ${component} | ${funcCount} | ${modelCount} | 待生成 |\n`;
    });

    functionListContent += `
**统计信息**：
- 总模块数：${components.length}
- 总功能数：${totalFunctions}
- 总数据模型：${totalDataModels}

---
`;

    // 逐个模块生成详细功能清单
    components.forEach((component, index) => {
      const chineseName = nameMapping[component] || component;
      const moduleConfig = moduleDescriptions[component];
      const functionConfig = moduleFunctionConfigs[component] || { 
        functions: [], 
        dataModels: [], 
        businessRules: [], 
        exceptionScenarios: [] 
      };
      
      console.log(`[${index + 1}/${components.length}] 分析 ${chineseName}...`);
      
      // 读取组件源码
      const sourceCode = readComponentSource(component, projectRoot);
      
      // 提取代码信息
      const extractedStates = extractDataModels(sourceCode);
      const extractedFunctions = extractFunctions(sourceCode);
      
      console.log(`  - 代码分析：${extractedStates.length}个状态变量, ${extractedFunctions.length}个处理函数`);
      
      // 生成模块功能清单
      functionListContent += `## 模块${index + 1}：${chineseName}

### 基本信息
- **模块名称**：${chineseName}
- **英文标识**：${component}
- **业务描述**：${moduleConfig?.description || '提供' + chineseName + '管理功能'}
- **核心功能**：${moduleConfig?.coreFeatures?.join('、') || '列表展示、新增、编辑、删除'}

`;

      // 数据模型
      if (functionConfig.dataModels && functionConfig.dataModels.length > 0) {
        functionListContent += `### 数据模型\n\n`;
        functionConfig.dataModels.forEach((model, mIndex) => {
          functionListContent += `#### 实体${mIndex + 1}：${model.entity}\n\n`;
          functionListContent += `| 字段名 | 类型 | 必填 | 说明 | 枚举值/范围 |\n`;
          functionListContent += `| :--- | :--- | :--- | :--- | :--- |\n`;
          
          if (model.fields) {
            model.fields.forEach(field => {
              const enumValue = field.options ? field.options.join('/') : (field.range || '-');
              functionListContent += `| ${field.name} | ${field.type} | ${field.required ? '是' : '否'} | ${field.description} | ${enumValue} |\n`;
            });
          }
          functionListContent += `\n`;
        });
      }

      // 功能清单
      if (functionConfig.functions && functionConfig.functions.length > 0) {
        functionListContent += `### 功能清单\n\n`;
        functionConfig.functions.forEach((func, fIndex) => {
          functionListContent += `#### 功能${fIndex + 1}：${func.name}\n`;
          functionListContent += `- **功能ID**：${func.id}\n`;
          functionListContent += `- **功能名称**：${func.name}\n`;
          functionListContent += `- **功能类型**：${func.type}\n`;
          functionListContent += `- **功能描述**：${func.description}\n`;
          
          if (func.listFields) {
            functionListContent += `- **列表字段**：${func.listFields.join('、')}\n`;
          }
          if (func.searchFields) {
            functionListContent += `- **搜索字段**：${func.searchFields.join('、')}\n`;
          }
          if (func.filters) {
            const filterStr = func.filters.map(f => `${f.label}(${f.options.join('/')})`).join('、');
            functionListContent += `- **筛选条件**：${filterStr}\n`;
          }
          if (func.pagination) {
            functionListContent += `- **分页配置**：每页${func.pagination.pageSize}条\n`;
          }
          if (func.formFields) {
            functionListContent += `- **表单字段**：\n`;
            func.formFields.forEach(field => {
              const options = field.options ? `，选项：${field.options.join('/')}` : '';
              const validation = field.validation ? `，校验：${field.validation}` : '';
              functionListContent += `  - ${field.label}（${field.type}${field.required ? '，必填' : ''}${options}${validation}）\n`;
            });
          }
          if (func.editableFields) {
            functionListContent += `- **可编辑字段**：${func.editableFields.join('、')}\n`;
          }
          if (func.readonlyFields) {
            functionListContent += `- **只读字段**：${func.readonlyFields.join('、')}\n`;
          }
          if (func.specialLogic) {
            functionListContent += `- **特殊逻辑**：${func.specialLogic.join('；')}\n`;
          }
          if (func.businessRules) {
            functionListContent += `- **业务规则**：${func.businessRules.join('；')}\n`;
          }
          if (func.deleteCondition) {
            functionListContent += `- **删除条件**：${func.deleteCondition}\n`;
          }
          if (func.confirmation) {
            functionListContent += `- **确认机制**：${func.confirmation}\n`;
          }
          if (func.cascadeEffect) {
            functionListContent += `- **级联影响**：${func.cascadeEffect}\n`;
          }
          
          functionListContent += `\n`;
        });
      }

      // 业务规则
      if (functionConfig.businessRules && functionConfig.businessRules.length > 0) {
        functionListContent += `### 业务规则\n\n`;
        functionConfig.businessRules.forEach((rule, rIndex) => {
          functionListContent += `${rIndex + 1}. ${rule}\n`;
        });
        functionListContent += `\n`;
      }

      // 异常场景
      if (functionConfig.exceptionScenarios && functionConfig.exceptionScenarios.length > 0) {
        functionListContent += `### 异常场景\n\n`;
        functionListContent += `| 异常场景 | 系统行为 |\n`;
        functionListContent += `| :--- | :--- |\n`;
        functionConfig.exceptionScenarios.forEach(scenario => {
          functionListContent += `| ${scenario.scenario} | ${scenario.behavior} |\n`;
        });
        functionListContent += `\n`;
      }

      functionListContent += `---\n\n`;
      
      console.log(`  ✓ 已提取 ${functionConfig.functions.length} 个功能\n`);
    });

    // 添加使用说明
    functionListContent += `## 使用说明

### 生成PRD文档

基于本功能清单，AI将为每个模块生成详细PRD文档：

1. **读取功能清单**：AI首先阅读本清单，理解所有模块的功能需求
2. **逐个生成PRD**：按照模块顺序，为每个功能生成详细PRD
3. **输出位置**：\`docs/{模块名}/{模块名}.md\`

### PRD文档结构

每个PRD文档应包含：
- 功能描述（基于清单中的业务描述）
- 业务功能流程图（Mermaid）
- 数据模型（基于清单中的字段定义）
- 功能详细说明（基于清单中的功能项）
- 业务规则（基于清单中的规则）
- 异常场景处理（基于清单中的异常）

### 校验要求

生成完成后，需要校验：
- [ ] 每个功能清单项都有对应的PRD章节
- [ ] 数据字段与清单一致
- [ ] 业务流程覆盖所有功能点
- [ ] 异常场景处理完整

---

*本清单由代码分析工具自动生成，请基于本清单生成PRD文档*
`;

    // 写入功能清单文件
    const docsDir = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    const listPath = path.join(docsDir, '功能清单.md');
    fs.writeFileSync(listPath, functionListContent);
    
    console.log('='.repeat(60));
    console.log('功能清单生成完成！');
    console.log('='.repeat(60));
    console.log();
    console.log(`输出文件：${path.relative(projectRoot, listPath)}`);
    console.log();
    console.log('统计信息：');
    console.log(`  - 总模块数：${components.length}`);
    console.log(`  - 总功能数：${totalFunctions}`);
    console.log(`  - 总数据模型：${totalDataModels}`);
    console.log();
    console.log('下一步：');
    console.log('  1. AI阅读功能清单 docs/功能清单.md');
    console.log('  2. AI基于清单逐个生成PRD文档');
    console.log('  3. 校验PRD完整性');
    
  } catch (error) {
    console.error('生成功能清单时出错:', error);
  }
}

/**
 * 校验PRD完整性
 */
function validatePRDCompleteness(projectRoot: string): void {
  try {
    console.log('='.repeat(60));
    console.log('开始校验PRD完整性');
    console.log('='.repeat(60));
    console.log();
    
    // 读取功能清单
    const listPath = path.join(projectRoot, 'docs', '功能清单.md');
    if (!fs.existsSync(listPath)) {
      console.error('错误：功能清单不存在，请先运行"生成功能清单"');
      return;
    }
    
    const functionList = fs.readFileSync(listPath, 'utf-8');
    
    // 解析功能清单中的模块和功能
    const moduleMatches = functionList.match(/## 模块\d+：([^\n]+)/g) || [];
    
    console.log(`从功能清单中识别到 ${moduleMatches.length} 个模块\n`);
    
    let report = `# PRD完整性校验报告\n\n`;
    report += `> 校验时间：${new Date().toLocaleString('zh-CN')}\n`;
    report += `> 项目路径：${projectRoot}\n\n`;
    
    let totalModules = 0;
    let passedModules = 0;
    let failedModules = 0;
    
    moduleMatches.forEach((match) => {
      const moduleName = match.replace(/## 模块\d+：/, '');
      totalModules++;
      
      // 检查对应的PRD文件是否存在
      const prdPath = path.join(projectRoot, 'docs', moduleName, `${moduleName}.md`);
      const exists = fs.existsSync(prdPath);
      
      if (exists) {
        const prdContent = fs.readFileSync(prdPath, 'utf-8');
        
        // 简单检查PRD是否包含关键章节
        const hasFunctionDesc = prdContent.includes('功能描述');
        const hasDataModel = prdContent.includes('数据模型');
        const hasFlowChart = prdContent.includes('mermaid');
        
        const score = [hasFunctionDesc, hasDataModel, hasFlowChart].filter(Boolean).length;
        const coverage = Math.round((score / 3) * 100);
        
        if (coverage >= 66) {
          passedModules++;
          report += `## ✅ ${moduleName}\n\n`;
          report += `- 状态：通过\n`;
          report += `- PRD文件：存在\n`;
          report += `- 完整度：${coverage}%\n`;
          report += `  - 功能描述：${hasFunctionDesc ? '✓' : '✗'}\n`;
          report += `  - 数据模型：${hasDataModel ? '✓' : '✗'}\n`;
          report += `  - 流程图表：${hasFlowChart ? '✓' : '✗'}\n\n`;
        } else {
          failedModules++;
          report += `## ⚠️ ${moduleName}\n\n`;
          report += `- 状态：未通过\n`;
          report += `- PRD文件：存在但内容不完整\n`;
          report += `- 完整度：${coverage}%\n`;
          report += `  - 功能描述：${hasFunctionDesc ? '✓' : '✗'}\n`;
          report += `  - 数据模型：${hasDataModel ? '✓' : '✗'}\n`;
          report += `  - 流程图表：${hasFlowChart ? '✓' : '✗'}\n\n`;
        }
      } else {
        failedModules++;
        report += `## ❌ ${moduleName}\n\n`;
        report += `- 状态：未通过\n`;
        report += `- PRD文件：不存在\n`;
        report += `- 缺失文件：docs/${moduleName}/${moduleName}.md\n\n`;
      }
    });
    
    // 添加汇总
    report += `## 校验汇总\n\n`;
    report += `| 指标 | 数值 |\n`;
    report += `| :--- | :--- |\n`;
    report += `| 总模块数 | ${totalModules} |\n`;
    report += `| 通过 | ${passedModules} |\n`;
    report += `| 未通过 | ${failedModules} |\n`;
    report += `| 通过率 | ${Math.round((passedModules / totalModules) * 100)}% |\n\n`;
    
    if (failedModules === 0) {
      report += `**✅ 所有模块校验通过！**\n`;
    } else {
      report += `**⚠️ 有 ${failedModules} 个模块未通过校验，请补充生成。**\n`;
    }
    
    // 写入校验报告
    const reportPath = path.join(projectRoot, 'docs', 'PRD校验报告.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(report);
    console.log(`\n校验报告已保存：${path.relative(projectRoot, reportPath)}`);
    
  } catch (error) {
    console.error('校验PRD时出错:', error);
  }
}

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
PRD生成功能清单工具 (TypeScript版本)

用法:
  ts-node generate-prd.ts [命令] [选项]

命令:
  (无)          生成功能清单
  validate      校验PRD完整性
  校验          校验PRD完整性（中文别名）

选项:
  --root, -r    指定项目根目录路径
                示例: ts-node generate-prd.ts --root /path/to/project
                
  --help, -h    显示帮助信息

环境变量:
  PROJECT_ROOT  设置项目根目录路径（优先级最高）
                示例: PROJECT_ROOT=/path/to/project ts-node generate-prd.ts

使用示例:
  1. 使用当前工作目录作为项目根目录:
     ts-node generate-prd.ts

  2. 指定项目路径:
     ts-node generate-prd.ts --root /path/to/project

  3. 校验PRD完整性:
     ts-node generate-prd.ts validate --root /path/to/project

  4. 使用环境变量指定项目路径:
     PROJECT_ROOT=/path/to/project ts-node generate-prd.ts
`);
}

// ==================== 主函数 ====================

function main(): void {
  const args = process.argv.slice(2);
  
  // 显示帮助
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // 获取项目根目录
  const projectRoot = getProjectRoot();
  
  // 检查项目目录是否存在
  if (!fs.existsSync(projectRoot)) {
    console.error(`错误：项目目录不存在: ${projectRoot}`);
    console.error('\n请使用 --root 参数指定正确的项目路径，或设置 PROJECT_ROOT 环境变量。');
    console.error('运行 --help 查看详细用法。');
    process.exit(1);
  }
  
  console.log(`项目根目录: ${projectRoot}\n`);
  
  // 解析命令
  const command = args.find(arg => !arg.startsWith('-') && arg !== projectRoot);
  
  if (command === 'validate' || command === '校验') {
    validatePRDCompleteness(projectRoot);
  } else {
    generateFunctionList(projectRoot);
  }
}

// 执行
if (require.main === module) {
  main();
}

// 导出模块供外部使用
export { generateFunctionList, validatePRDCompleteness, nameMapping, moduleFunctionConfigs };
