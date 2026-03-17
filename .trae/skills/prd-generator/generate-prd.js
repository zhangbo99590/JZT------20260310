import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  scanTsxFiles, 
  analyzeComponent, 
  extractMenuStructure, 
  extractRouteMenuMap,
  organizeByModule 
} from './code-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PRD智能生成器 v4.0
 * 
 * 本脚本采用"深度代码分析 + AI生成"的双阶段模式：
 * 1. **第一阶段**：从 menuConfig.tsx 严格读取模块和功能层级结构，深度分析项目代码
 *    - 严格匹配菜单中的模块规划
 *    - 将页面组件归类到对应的功能下
 * 2. **第二阶段**：AI基于功能清单，为每个功能生成详细的PRD文档
 *    - 一个模块一个目录
 *    - 一个功能一个MD文档
 * 3. **第三阶段**：校验生成的PRD是否覆盖清单中的所有功能
 * 
 * v4.0 改进点：
 * - 严格从菜单配置读取模块和功能结构
 * - 功能归属在模块下面
 * - 生成PRD时，一个模块一个目录，一个功能一个MD文档
 */

// ==================== 工具函数 ====================

/**
 * 获取项目根目录路径
 * 优先级：1. 环境变量 PROJECT_ROOT  2. 命令行参数  3. 当前工作目录
 */
function getProjectRoot() {
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
 * 获取 src 目录路径
 * @param {string} projectRoot 
 * @returns {string|null}
 */
function getSrcDirectory(projectRoot) {
  const srcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(srcPath)) {
    return srcPath;
  }
  
  // 如果没有 src 目录，尝试在项目根目录下查找
  return projectRoot;
}

// ==================== 核心功能：生成功能清单 ====================

/**
 * 生成功能清单
 */
function generateFunctionList(projectRoot) {
  try {
    console.log('='.repeat(70));
    console.log('PRD智能生成器 v4.0 - 开始深度分析项目代码');
    console.log('='.repeat(70));
    console.log();
    console.log(`📁 项目路径: ${projectRoot}`);
    console.log();

    // 1. 从菜单配置中提取模块和功能结构
    const menuStructure = extractMenuStructure(projectRoot);
    if (menuStructure.length === 0) {
      console.error('❌ 错误：无法从菜单配置中读取模块结构');
      return;
    }
    
    // 2. 从 routeMenuMap 获取路由映射
    const routeToMenuKey = extractRouteMenuMap(projectRoot);
    
    console.log();

    // 3. 获取 src 目录
    const srcDir = getSrcDirectory(projectRoot);
    console.log(`📂 扫描目录: ${path.relative(projectRoot, srcDir) || '.'}`);
    console.log();

    // 4. 扫描所有 TSX 文件
    const tsxFiles = scanTsxFiles(srcDir);

    if (tsxFiles.length === 0) {
      console.log('⚠️ 未找到 TSX 文件');
      console.log('   请确保项目包含 React/TypeScript 组件文件');
      return;
    }

    console.log(`🔍 发现 ${tsxFiles.length} 个 TSX 文件，开始分析页面组件...`);
    console.log();

    // 5. 逐个分析文件，只保留页面组件
    const componentAnalyses = [];

    for (let i = 0; i < tsxFiles.length; i++) {
      const filePath = tsxFiles[i];
      const relativePath = path.relative(projectRoot, filePath);

      // 分析组件
      const analysis = analyzeComponent(filePath, projectRoot);

      if (analysis) {
        componentAnalyses.push(analysis);
        console.log(`  ✓ [${componentAnalyses.length}] ${path.basename(filePath)} (${relativePath})`);
      }
    }
    
    if (componentAnalyses.length === 0) {
      console.log('⚠️ 未识别到页面组件');
      console.log('   请确保 TSX 文件位于 pages、views、routes 等目录下');
      return;
    }
    
    console.log();
    console.log(`✅ 成功识别 ${componentAnalyses.length} 个页面组件`);
    console.log();
    
    // 6. 按模块组织分析结果
    const organizedModules = organizeByModule(componentAnalyses, menuStructure, routeToMenuKey);
    
    console.log('📊 模块组织结果:');
    organizedModules.forEach(m => {
      const funcCount = m.functions.length;
      const compCount = m.functions.reduce((sum, f) => sum + f.components.length, 0);
      console.log(`  • ${m.name}: ${funcCount} 个功能, ${compCount} 个组件`);
    });
    console.log();
    
    // 7. 生成功能清单文档
    const functionListContent = generateFunctionListMarkdown(organizedModules, projectRoot);
    
    // 8. 写入功能清单文件
    const docsDir = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const listPath = path.join(docsDir, '功能清单.md');
    fs.writeFileSync(listPath, functionListContent);
    
    // 9. 输出统计信息
    const totalFunctions = organizedModules.reduce((sum, m) => sum + m.functions.length, 0);
    const totalComponents = organizedModules.reduce((sum, m) => 
      sum + m.functions.reduce((s, f) => s + f.components.length, 0), 0);

    console.log('='.repeat(70));
    console.log('✅ 功能清单生成完成！');
    console.log('='.repeat(70));
    console.log();
    console.log(`📄 输出文件: ${path.relative(projectRoot, listPath)}`);
    console.log();
    console.log('📊 统计信息:');
    console.log(`   • 总模块数: ${organizedModules.length}`);
    console.log(`   • 总功能数: ${totalFunctions}`);
    console.log(`   • 总组件数: ${totalComponents}`);
    console.log();
    console.log('📋 模块详情:');
    organizedModules.forEach((m, i) => {
      const compCount = m.functions.reduce((sum, f) => sum + f.components.length, 0);
      console.log(`   ${i + 1}. ${m.name}: ${m.functions.length}个功能, ${compCount}个组件`);
      m.functions.forEach(f => {
        if (f.components.length > 0) {
          console.log(`      └─ ${f.name}: ${f.components.length}个组件`);
        }
      });
    });
    console.log();
    console.log('📝 下一步:');
    console.log('   1. AI阅读功能清单 docs/功能清单.md');
    console.log('   2. AI基于清单逐个生成详细PRD文档');
    console.log('   3. 运行校验命令检查PRD完整性');
    console.log();
    console.log('📁 PRD输出结构:');
    console.log('   docs/');
    organizedModules.forEach(m => {
      console.log(`   ├── ${m.name}/`);
      m.functions.forEach(f => {
        console.log(`   │   ├── ${f.name}.md`);
      });
    });
    
  } catch (error) {
    console.error('❌ 生成功能清单时出错:', error.message);
    console.error(error.stack);
  }
}

/**
 * 生成功能清单 Markdown 文档
 */
function generateFunctionListMarkdown(organizedModules, projectRoot) {
  let content = `# 项目功能清单

> 生成时间：${new Date().toLocaleString('zh-CN')}
> 生成方式：代码深度分析 + 菜单配置解析
> 项目路径：${projectRoot}
> 分析引擎：prd-generator v4.0

## 目录

- [模块概览](#模块概览)
`;

  // 添加目录
  organizedModules.forEach((m, i) => {
    content += `- [模块${i + 1}：${m.name}](#模块${i + 1}${m.name.replace(/\s+/g, '-')})\n`;
    m.functions.forEach((f, j) => {
      content += `  - [功能${j + 1}：${f.name}](#功能${j + 1}${f.name.replace(/\s+/g, '-')})\n`;
    });
  });

  content += `
---

## 模块概览

| 序号 | 模块名称 | 模块路由 | 功能数量 | 组件数量 | PRD输出目录 |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  organizedModules.forEach((m, i) => {
    const compCount = m.functions.reduce((sum, f) => sum + f.components.length, 0);
    content += `| ${i + 1} | ${m.name} | ${m.key} | ${m.functions.length} | ${compCount} | docs/${m.name}/ |\n`;
  });

  // 统计信息
  const totalFunctions = organizedModules.reduce((sum, m) => sum + m.functions.length, 0);
  const totalComponents = organizedModules.reduce((sum, m) => 
    sum + m.functions.reduce((s, f) => s + f.components.length, 0), 0);

  content += `
**统计信息**：
- 总模块数：${organizedModules.length}
- 总功能数：${totalFunctions}
- 总组件数：${totalComponents}

---

`;

  // 逐个模块详细说明
  organizedModules.forEach((module, moduleIndex) => {
    content += `## 模块${moduleIndex + 1}：${module.name}

### 模块信息
- **模块名称**：${module.name}
- **模块路由**：${module.key}
- **功能数量**：${module.functions.length}
- **组件数量**：${module.functions.reduce((sum, f) => sum + f.components.length, 0)}
- **PRD输出目录**：\`docs/${module.name}/\`

`;

    // 逐个功能详细说明
    module.functions.forEach((func, funcIndex) => {
      content += `### 功能${funcIndex + 1}：${func.name}

#### 基本信息
- **功能名称**：${func.name}
- **功能路由**：${func.key}
- **所属模块**：${module.name}
- **PRD输出文件**：\`docs/${module.name}/${func.name}.md\`
- **组件数量**：${func.components.length}

`;

      // 组件列表
      if (func.components.length > 0) {
        content += `#### 关联组件

| 序号 | 组件名称 | 文件路径 |
| :--- | :--- | :--- |
`;
        func.components.forEach((comp, compIndex) => {
          content += `| ${compIndex + 1} | ${comp.name} | ${comp.filePath} |\n`;
        });
        content += `
`;

        // 数据模型（合并所有组件的数据模型）
        const allDataModels = func.components.flatMap(c => c.dataModels);
        if (allDataModels.length > 0) {
          content += `#### 数据模型

`;
          
          // 去重
          const modelMap = new Map();
          allDataModels.forEach(model => {
            if (!modelMap.has(model.entity)) {
              modelMap.set(model.entity, model);
            }
          });
          
          modelMap.forEach(model => {
            content += `**实体：${model.entity}**

| 字段名 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
`;
            model.fields.forEach(field => {
              const options = field.options ? `选项：${field.options.join('/')}` : '';
              content += `| ${field.name} | ${field.type} | ${field.required ? '是' : '否'} | ${field.description} ${options}|\n`;
            });
            content += `
`;
          });
        }

        // 功能清单（合并所有组件的功能）
        const allFunctions = func.components.flatMap(c => c.functions);
        if (allFunctions.length > 0) {
          content += `#### 功能清单

`;
          
          // 去重
          const funcMap = new Map();
          allFunctions.forEach(f => {
            if (!funcMap.has(f.name)) {
              funcMap.set(f.name, f);
            }
          });
          
          funcMap.forEach(f => {
            content += `- **${f.id}：${f.name}**
`;
            content += `  - 功能类型：${f.type}
`;
            content += `  - 功能描述：${f.description}
`;
            if (f.pagination) {
              content += `  - 分页配置：每页${f.pagination.pageSize}条
`;
            }
            content += `
`;
          });
        }

        // 业务规则（合并所有组件的规则）
        const allRules = func.components.flatMap(c => c.businessRules);
        if (allRules.length > 0) {
          const uniqueRules = [...new Set(allRules)];
          content += `#### 业务规则

`;
          uniqueRules.forEach((rule, rIndex) => {
            content += `${rIndex + 1}. ${rule}\n`;
          });
          content += `
`;
        }

        // 异常场景（合并所有组件的异常场景）
        const allScenarios = func.components.flatMap(c => c.exceptionScenarios);
        if (allScenarios.length > 0) {
          // 去重
          const scenarioMap = new Map();
          allScenarios.forEach(s => {
            if (!scenarioMap.has(s.scenario)) {
              scenarioMap.set(s.scenario, s);
            }
          });
          
          content += `#### 异常场景

| 异常场景 | 系统行为 |
| :--- | :--- |
`;
          scenarioMap.forEach(s => {
            content += `| ${s.scenario} | ${s.behavior} |\n`;
          });
          content += `
`;
        }
      } else {
        content += `> ⚠️ 该功能暂未识别到关联的页面组件\n\n`;
      }

      content += `---

`;
    });

    content += `---

`;
  });

  // 添加使用说明
  content += `## 使用说明

### PRD文档生成规则

基于本功能清单，AI将为每个功能生成详细PRD文档：

1. **读取功能清单**：AI首先阅读本清单，理解所有模块的功能需求
2. **逐个生成PRD**：按照功能清单，为每个功能生成详细PRD
3. **输出位置**：
   - 模块目录：\`docs/{模块名}/\`
   - 功能PRD：\`docs/{模块名}/{功能名}.md\`

### 目录结构示例

\`\`\`
docs/
├── 功能清单.md
├── 首页/
│   └── 首页.md
├── 政策中心/
│   ├── 智慧政策.md
│   ├── 申报管理.md
│   └── 我的申报.md
├── 法律护航/
│   ├── AI 问答.md
│   ├── 法规查询.md
│   └── 法规详情.md
├── 产业管理/
│   ├── 业务大厅.md
│   ├── 采购大厅.md
│   └── 我的业务管理.md
├── 金融服务/
│   ├── 融资诊断.md
│   └── 诊断分析报告.md
└── 系统管理/
    ├── 用户管理.md
    ├── 个人中心.md
    ├── 我的收藏.md
    └── 企业管理.md
\`\`\`

### PRD文档结构要求

每个PRD文档必须包含：
- **功能描述**：详细说明功能价值和使用场景
- **业务功能流程图**：使用 Mermaid 绘制完整的业务流程
- **数据模型**：详细说明每个字段的用途和约束
- **功能详细说明**：
  - 功能描述和业务逻辑
  - 交互流程（步骤分解）
  - 输入/输出参数
  - 界面元素和布局
- **业务规则**：数据校验、权限控制等
- **异常场景处理**：各种异常情况的处理方式
- **权限控制**：不同角色的功能访问权限

### AI生成要求

⚠️ **重要提示**：
1. PRD内容必须**基于功能清单**生成，不能凭空捏造
2. 必须**完美还原**代码中的业务功能、交互流程和逻辑规则
3. 所有功能点必须在PRD中有对应的详细说明
4. 数据模型必须与代码中的定义一致
5. 业务流程必须准确反映代码逻辑
6. **一个功能一个PRD文档**，不要合并多个功能到一个文档

### 校验PRD完整性

生成完成后，运行以下命令校验：

\`\`\`bash
node .trae/skills/prd-generator/generate-prd.js validate --root ${projectRoot}
\`\`\`

---

*本清单由代码深度分析工具自动生成，请基于本清单生成准确的PRD文档*
`;

  return content;
}

// ==================== PRD校验功能 ====================

/**
 * 校验PRD完整性
 */
function validatePRDCompleteness(projectRoot) {
  try {
    console.log('='.repeat(70));
    console.log('PRD完整性校验');
    console.log('='.repeat(70));
    console.log();
    
    // 读取功能清单
    const listPath = path.join(projectRoot, 'docs', '功能清单.md');
    if (!fs.existsSync(listPath)) {
      console.error('❌ 错误：功能清单不存在');
      console.log('   请先运行：node generate-prd.js --root ' + projectRoot);
      return;
    }
    
    const functionList = fs.readFileSync(listPath, 'utf-8');
    
    // 解析功能清单中的模块和功能
    const moduleMatches = functionList.match(/## 模块\d+：([^\n]+)/g) || [];
    
    console.log(`📋 从功能清单中识别到 ${moduleMatches.length} 个模块\n`);
    
    let report = `# PRD完整性校验报告\n\n`;
    report += `> 校验时间：${new Date().toLocaleString('zh-CN')}\n`;
    report += `> 项目路径：${projectRoot}\n\n`;
    
    let totalModules = 0;
    let totalFunctions = 0;
    let passedFunctions = 0;
    let failedFunctions = 0;
    
    // 解析每个模块的功能
    const moduleSections = functionList.split(/## 模块\d+：/);
    
    for (let i = 1; i < moduleSections.length; i++) {
      const section = moduleSections[i];
      const moduleName = section.split('\n')[0].trim();
      
      totalModules++;
      report += `## 模块：${moduleName}\n\n`;
      
      // 解析功能
      const functionMatches = section.match(/### 功能\d+：([^\n]+)/g) || [];
      
      for (const funcMatch of functionMatches) {
        const funcName = funcMatch.replace(/### 功能\d+：/, '');
        totalFunctions++;
        
        // 检查对应的PRD文件是否存在
        const prdPath = path.join(projectRoot, 'docs', moduleName, `${funcName}.md`);
        const exists = fs.existsSync(prdPath);
        
        if (exists) {
          const prdContent = fs.readFileSync(prdPath, 'utf-8');
          
          // 检查PRD是否包含关键章节
          const checks = {
            '功能描述': prdContent.includes('功能描述') || prdContent.includes('## 1.'),
            '数据模型': prdContent.includes('数据模型') || prdContent.includes('## 3.'),
            '流程图表': prdContent.includes('mermaid') || prdContent.includes('\`\`\`mermaid'),
            '功能详细说明': prdContent.includes('功能详细') || prdContent.includes('## 4.'),
            '业务规则': prdContent.includes('业务规则') || prdContent.includes('## 5.')
          };
          
          const score = Object.values(checks).filter(Boolean).length;
          const coverage = Math.round((score / 5) * 100);
          
          if (coverage >= 60) {
            passedFunctions++;
            report += `### ✅ ${funcName}\n\n`;
            report += `- 状态：通过\n`;
            report += `- PRD文件：存在\n`;
            report += `- 完整度：${coverage}%\n`;
            Object.entries(checks).forEach(([key, value]) => {
              report += `  - ${key}：${value ? '✓' : '✗'}\n`;
            });
          } else {
            failedFunctions++;
            report += `### ⚠️ ${funcName}\n\n`;
            report += `- 状态：未通过\n`;
            report += `- PRD文件：存在但内容不完整\n`;
            report += `- 完整度：${coverage}%\n`;
            Object.entries(checks).forEach(([key, value]) => {
              report += `  - ${key}：${value ? '✓' : '✗'}\n`;
            });
          }
        } else {
          failedFunctions++;
          report += `### ❌ ${funcName}\n\n`;
          report += `- 状态：未通过\n`;
          report += `- PRD文件：不存在\n`;
          report += `- 缺失文件：docs/${moduleName}/${funcName}.md\n`;
        }
        
        report += `\n`;
      }
    }
    
    // 校验汇总
    const passRate = totalFunctions > 0 ? Math.round((passedFunctions / totalFunctions) * 100) : 0;
    
    report += `## 校验汇总\n\n`;
    report += `| 指标 | 数值 |\n`;
    report += `| :--- | :--- |\n`;
    report += `| 总模块数 | ${totalModules} |\n`;
    report += `| 总功能数 | ${totalFunctions} |\n`;
    report += `| 通过 | ${passedFunctions} |\n`;
    report += `| 未通过 | ${failedFunctions} |\n`;
    report += `| 通过率 | ${passRate}% |\n`;
    report += `\n`;
    
    if (failedFunctions > 0) {
      report += `**⚠️ 有 ${failedFunctions} 个功能未通过校验，请补充生成。**\n`;
    } else {
      report += `**✅ 所有功能校验通过！**\n`;
    }
    
    // 写入校验报告
    const reportPath = path.join(projectRoot, 'docs', 'PRD校验报告.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(report);
    console.log(`📄 校验报告已保存: ${path.relative(projectRoot, reportPath)}`);
    
  } catch (error) {
    console.error('❌ 校验PRD时出错:', error.message);
    console.error(error.stack);
  }
}

// ==================== 主程序入口 ====================

function main() {
  const projectRoot = getProjectRoot();
  const args = process.argv.slice(2);
  
  // 检查是否是校验命令
  if (args.includes('validate')) {
    validatePRDCompleteness(projectRoot);
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
PRD智能生成器 v4.0

用法:
  node generate-prd.js [命令] [选项]

命令:
  validate          校验PRD完整性
  --help, -h        显示帮助信息

选项:
  --root, -r <path> 指定项目根目录

示例:
  # 生成功能清单
  node generate-prd.js --root /path/to/project

  # 在当前目录生成
  node generate-prd.js

  # 校验PRD
  node generate-prd.js validate --root /path/to/project

环境变量:
  PROJECT_ROOT      项目根目录路径

功能:
  1. 从 menuConfig.tsx 严格读取模块和功能结构
  2. 深度分析项目代码，提取业务功能
  3. 按模块-功能层级组织功能清单
  4. 支持校验生成的PRD文档完整性

输出结构:
  docs/
  ├── 功能清单.md          # 功能清单
  ├── PRD校验报告.md       # 校验报告
  ├── {模块1}/
  │   ├── {功能1}.md
  │   ├── {功能2}.md
  │   └── ...
  ├── {模块2}/
  │   ├── {功能1}.md
  │   └── ...
  └── ...
`);
  } else {
    generateFunctionList(projectRoot);
  }
}

// 运行主程序
main();
