/**
 * 统一模板管理服务
 * 整合模板管理、版本管理和验证功能
 */

import { searchByKeyword } from '../utils/searchUtils';

export interface TemplateFile {
  id: string;
  name: string;
  fileName: string;
  version: string;
  format: 'docx' | 'xlsx' | 'pdf';
  size: number;
  description: string;
  instructions: string;
  examples: string[];
  downloadUrl: string;
  lastUpdated: string;
  isRequired: boolean;
  category: 'application' | 'financial' | 'technical';
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templates: TemplateFile[];
}

export interface TemplateVersion {
  version: string;
  releaseDate: string;
  changelog: string[];
  downloadUrl: string;
  fileSize: number;
  isLatest: boolean;
  isDeprecated: boolean;
}

export interface TemplateVersionHistory {
  templateId: string;
  templateName: string;
  versions: TemplateVersion[];
  currentVersion: string;
}

export interface VersionComparison {
  templateId: string;
  versionA: string;
  versionB: string;
  differences: VersionDiff[];
  summary: {
    added: number;
    removed: number;
    modified: number;
  };
}

export interface VersionDiff {
  type: 'added' | 'removed' | 'modified';
  section: string;
  content: string;
  oldContent?: string;
}

// 模板数据
const templateData: TemplateCategory[] = [
  {
    id: 'application',
    name: '申请书类',
    description: '各类资质申请书模板',
    templates: [
      {
        id: 'high_tech_application',
        name: '高新技术企业认定申请书',
        fileName: 'high_tech_application_v2.1.txt',
        version: 'v2.1',
        format: 'docx',
        size: 245760,
        description: '高新技术企业认定申请的标准格式申请书',
        instructions: '请按照模板格式填写企业基本信息、主要产品、核心技术、研发组织管理水平等内容。注意保持格式统一，确保信息准确完整。',
        examples: [
          '企业名称：深圳市创新科技有限公司',
          '主要产品：智能制造软件系统',
          '核心技术：人工智能算法、大数据分析'
        ],
        downloadUrl: '/templates/application/high_tech_application_v2.1.txt',
        lastUpdated: '2024-10-15',
        isRequired: true,
        category: 'application'
      },
      {
        id: 'tech_sme_application',
        name: '科技型中小企业评价申请书',
        fileName: '科技型中小企业评价申请书模板_v1.3.docx',
        version: 'v1.3',
        format: 'docx',
        size: 198400,
        description: '科技型中小企业评价申请的标准格式申请书',
        instructions: '请详细填写企业科技人员情况、研发投入、科技成果等信息，确保数据真实有效。',
        examples: [
          '科技人员占比：65%',
          '拥有知识产权：15件'
        ],
        downloadUrl: '/templates/tech_sme_application_v1.3.docx',
        lastUpdated: '2024-09-20',
        isRequired: true,
        category: 'application'
      }
    ]
  },
  {
    id: 'financial',
    name: '财务资料类',
    description: '企业财务相关证明材料模板',
    templates: [
      {
        id: 'financial_statement',
        name: '近三年财务报表汇总',
        fileName: 'financial_statement_v2.3.txt',
        version: 'v2.3',
        format: 'xlsx',
        size: 425984,
        description: '企业近三年完整财务报表及分析说明',
        instructions: '请按照企业会计准则编制完整的资产负债表、利润表、现金流量表，并提供详细的财务指标分析和说明。',
        examples: [
          '资产总计：5000万元',
          '营业收入：3000万元',
          '净利润：450万元'
        ],
        downloadUrl: '/templates/financial/financial_statement_v2.3.txt',
        lastUpdated: '2024-01-15',
        isRequired: true,
        category: 'financial'
      }
    ]
  },
  {
    id: 'technical',
    name: '技术资料类',
    description: '技术成果和知识产权相关模板',
    templates: [
      {
        id: 'tech_achievement',
        name: '科技成果转化说明',
        fileName: '科技成果转化说明模板_v2.2.docx',
        version: 'v2.2',
        format: 'docx',
        size: 267264,
        description: '企业科技成果转化能力的详细说明文档',
        instructions: '请详细描述企业的科技成果转化情况，包括转化项目、转化效果、产业化程度等。',
        examples: [
          '转化项目：AI智能识别系统',
          '转化周期：18个月',
          '产业化收入：1200万元'
        ],
        downloadUrl: '/templates/tech_achievement_v2.2.docx',
        lastUpdated: '2024-09-30',
        isRequired: false,
        category: 'technical'
      }
    ]
  }
];

// 版本历史数据
const versionHistory: TemplateVersionHistory[] = [
  {
    templateId: 'high_tech_application',
    templateName: '高新技术企业认定申请书',
    currentVersion: 'v2.1',
    versions: [
      {
        version: 'v2.1',
        releaseDate: '2024-01-15',
        changelog: [
          '优化申请表格式，提高填写便利性',
          '增加企业创新能力评价指标',
          '完善知识产权统计表格',
          '修正部分字段的填写说明'
        ],
        downloadUrl: '/templates/application/high_tech_application_v2.1.docx',
        fileSize: 245760,
        isLatest: true,
        isDeprecated: false
      },
      {
        version: 'v2.0',
        releaseDate: '2023-08-20',
        changelog: [
          '重新设计申请书结构',
          '增加研发项目详细描述模块',
          '优化财务数据填写格式'
        ],
        downloadUrl: '/templates/application/high_tech_application_v2.0.docx',
        fileSize: 238592,
        isLatest: false,
        isDeprecated: false
      }
    ]
  }
];

class UnifiedTemplateService {
  // ===== 基础模板管理 =====
  
  getAllCategories(): TemplateCategory[] {
    return templateData;
  }

  getAllTemplates(): TemplateFile[] {
    const allTemplates: TemplateFile[] = [];
    templateData.forEach(category => {
      allTemplates.push(...category.templates);
    });
    return allTemplates;
  }

  getTemplatesByCategory(categoryId: string): TemplateFile[] {
    const category = templateData.find(cat => cat.id === categoryId);
    return category ? category.templates : [];
  }

  getTemplateById(templateId: string): TemplateFile | null {
    for (const category of templateData) {
      const template = category.templates.find(t => t.id === templateId);
      if (template) return template;
    }
    return null;
  }

  searchTemplates(keyword: string): TemplateFile[] {
    const allTemplates = this.getAllTemplates();
    // 使用统一的搜索工具
    return searchByKeyword(allTemplates, keyword, ['name', 'description', 'instructions']);
  }

  // ===== 版本管理 =====
  
  getTemplateVersionHistory(templateId: string): TemplateVersionHistory | null {
    return versionHistory.find(history => history.templateId === templateId) || null;
  }

  getLatestVersion(templateId: string): TemplateVersion | null {
    const history = this.getTemplateVersionHistory(templateId);
    if (!history) return null;
    
    return history.versions.find(version => version.isLatest) || null;
  }

  checkForUpdates(templateId: string, currentVersion: string): {
    hasUpdate: boolean;
    latestVersion?: TemplateVersion;
    updateInfo?: string;
  } {
    const latestVersion = this.getLatestVersion(templateId);
    
    if (!latestVersion) {
      return { hasUpdate: false };
    }

    const hasUpdate = latestVersion.version !== currentVersion;
    
    return {
      hasUpdate,
      latestVersion: hasUpdate ? latestVersion : undefined,
      updateInfo: hasUpdate ? `发现新版本 ${latestVersion.version}，建议更新` : undefined
    };
  }

  compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.replace('v', '').split('.').map(Number);
    const v2Parts = version2.replace('v', '').split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  compareTemplateVersions(templateId: string, versionA: string, versionB: string): VersionComparison {
    const history = this.getTemplateVersionHistory(templateId);
    if (!history) {
      throw new Error('模板不存在或无版本记录');
    }

    const vA = history.versions.find(v => v.version === versionA);
    const vB = history.versions.find(v => v.version === versionB);

    if (!vA || !vB) {
      throw new Error('版本不存在');
    }

    const changelogA = vA.changelog || [];
    const changelogB = vB.changelog || [];

    const added = changelogA.filter(item => !changelogB.includes(item));
    const removed = changelogB.filter(item => !changelogA.includes(item));

    const differences: VersionDiff[] = [];
    differences.push(
      ...added.map((content): VersionDiff => ({ type: 'added', section: 'changelog', content })),
      ...removed.map((content): VersionDiff => ({ type: 'removed', section: 'changelog', content })),
    );

    return {
      templateId,
      versionA,
      versionB,
      differences,
      summary: {
        added: added.length,
        removed: removed.length,
        modified: 0,
      },
    };
  }

  getLastValidationLog(): null | {
    timestamp: string;
    details: Array<{ templateId: string; name: string; isValid: boolean; message: string }>;
  } {
    try {
      const raw = localStorage.getItem('template_validation_results');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as any;
      const results = Array.isArray(parsed?.results) ? parsed.results : [];
      const timestamp = typeof parsed?.timestamp === 'string' ? parsed.timestamp : new Date().toISOString();

      return {
        timestamp,
        details: results.map((r: any) => ({
          templateId: String(r.templateId ?? ''),
          name: String(r.templateName ?? ''),
          isValid: Boolean(r.isValid),
          message: String(r.message ?? ''),
        })),
      };
    } catch {
      return null;
    }
  }

  // ===== 文件操作 =====
  
  async downloadTemplate(templateId: string): Promise<{ success: boolean; message: string; url?: string }> {
    const template = this.getTemplateById(templateId);
    
    if (!template) {
      return { success: false, message: '模板不存在' };
    }

    try {
      const filePath = `/templates/${template.category}/${template.fileName}`;
      
      const response = await fetch(filePath, { method: 'HEAD' });
      if (!response.ok) {
        const txtFilePath = filePath.replace(/\.(docx|xlsx|pdf)$/, '.txt');
        const txtResponse = await fetch(txtFilePath);
        if (txtResponse.ok) {
          const blob = await txtResponse.blob();
          this.downloadBlob(blob, template.fileName.replace(/\.(docx|xlsx|pdf)$/, '.txt'));
          return { 
            success: true, 
            message: `模板示例文件 "${template.name}" 下载成功`,
            url: txtFilePath 
          };
        }
        return { success: false, message: '模板文件不存在' };
      }

      const fileResponse = await fetch(filePath);
      const blob = await fileResponse.blob();
      this.downloadBlob(blob, template.fileName);

      return { 
        success: true, 
        message: `模板 "${template.name}" 下载成功`,
        url: filePath 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `下载失败: ${error instanceof Error ? error.message : '未知错误'}` 
      };
    }
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ===== 验证功能 =====
  
  async validateTemplate(templateId: string): Promise<{ isValid: boolean; status: 'valid' | 'warning' | 'error'; message: string }> {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return { isValid: false, status: 'error', message: '模板不存在' };
    }
    
    const result = await this.validateTemplateFile(template);
    return {
      isValid: result.isValid,
      status: result.isValid ? 'valid' : 'error',
      message: result.message
    };
  }

  private async validateTemplateFile(template: TemplateFile): Promise<{ isValid: boolean; message: string }> {
    try {
      const expectedExtension = template.format;
      const fileExtension = template.fileName.split('.').pop()?.toLowerCase();
      
      if (fileExtension !== expectedExtension && fileExtension !== 'txt') {
        return { isValid: false, message: '文件格式不匹配' };
      }

      if (template.size <= 0) {
        return { isValid: false, message: '文件大小无效' };
      }

      const filePath = template.downloadUrl.startsWith('/') 
        ? `${window.location.origin}${template.downloadUrl}`
        : template.downloadUrl;
      
      const response = await fetch(filePath, { method: 'HEAD' });
      
      if (response.ok) {
        return { isValid: true, message: '文件有效且可访问' };
      } else {
        const txtFilePath = filePath.replace(/\.(docx|xlsx|pdf)$/, '.txt');
        const txtResponse = await fetch(txtFilePath, { method: 'HEAD' });
        
        if (txtResponse.ok) {
          return { isValid: true, message: '模板示例文件可访问' };
        }
        
        return { isValid: false, message: `文件不可访问 (HTTP ${response.status})` };
      }
    } catch (error) {
      return { isValid: false, message: `验证失败: ${error instanceof Error ? error.message : '网络错误'}` };
    }
  }

  // ===== 统计功能 =====
  
  getTemplateStats(): { total: number; byCategory: Record<string, number>; byFormat: Record<string, number> } {
    const stats = {
      total: 0,
      byCategory: {} as Record<string, number>,
      byFormat: {} as Record<string, number>
    };

    templateData.forEach(category => {
      stats.byCategory[category.name] = category.templates.length;
      stats.total += category.templates.length;

      category.templates.forEach(template => {
        stats.byFormat[template.format] = (stats.byFormat[template.format] || 0) + 1;
      });
    });

    return stats;
  }
}

export const templateService = new UnifiedTemplateService();
export default templateService;
