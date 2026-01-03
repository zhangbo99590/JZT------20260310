// 我的申报服务 - 处理所有申报相关的业务逻辑

import { StorageUtils } from '../utils/storage';

export interface ApplicationProject {
  id: string;
  policyNo?: string;
  name: string;
  policyType: string;
  status: 'draft' | 'reviewing' | 'supplement' | 'approved' | 'rejected' | 'expired';
  currentNode?: string;
  remainingDays?: number;
  supplementDeadline?: string;
  subsidyAmount?: string;
  qualificationNo?: string;
  applyDate: string;
  deadline: string;
  department: string;
  applicant: string;
  description?: string;
  materials?: MaterialFile[];
}

export interface MaterialFile {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadTime: string;
  uploader: string;
  status: 'approved' | 'pending' | 'rejected' | 'need_replace';
  version?: string;
  isSupplementVersion?: boolean;
  fileUrl: string;
  size?: string;
}

class MyApplicationService {
  private storageKey = 'my_applications_data';

  // 获取所有申报项目
  getAllProjects(): ApplicationProject[] {
    const stored = StorageUtils.getItem(this.storageKey, null);
    if (stored) {
      return stored;
    }
    
    // 初始化默认数据 - 与政策中心的政策列表一一对应
    const defaultProjects: ApplicationProject[] = [
      {
        id: 'APP001',
        policyNo: '20251100001',
        name: '中小企业数字化转型促进政策实施细则',
        policyType: '运营政策',
        status: 'reviewing',
        currentNode: '工信部初审',
        remainingDays: 15,
        applyDate: '2024-02-15',
        deadline: '2024-06-30',
        department: '工信部',
        applicant: '张三',
        description: '为促进中小企业数字化转型，提升企业竞争力，申请资金支持、技术指导、人才培养等方面的支持。'
      },
      {
        id: 'APP002',
        policyNo: '20251100002',
        name: '高新技术企业认定管理办法',
        policyType: '合规政策',
        status: 'supplement',
        supplementDeadline: '2024-03-25',
        remainingDays: 8,
        applyDate: '2024-02-01',
        deadline: '2024-05-31',
        department: '科技部',
        applicant: '李四',
        description: '申请高新技术企业认定，需补充研发费用专项审计报告。'
      },
      {
        id: 'APP003',
        policyNo: '20251100003',
        name: '小微企业创新创业扶持政策',
        policyType: '财务政策',
        status: 'approved',
        subsidyAmount: '30万元',
        applyDate: '2024-01-25',
        deadline: '2024-04-30',
        department: '发改委',
        applicant: '王五',
        description: '小微企业创新创业扶持，已获批税收优惠和融资支持。'
      },
      {
        id: 'APP004',
        policyNo: '20251100004',
        name: '企业信息安全管理规范',
        policyType: '安全政策',
        status: 'draft',
        applyDate: '2024-03-01',
        deadline: '2024-06-30',
        department: '网信办',
        applicant: '赵六',
        description: '建立健全企业信息安全管理体系申报，草稿待完善。'
      },
      {
        id: 'APP005',
        policyNo: '20251100005',
        name: '企业人才引进激励政策',
        policyType: '人事政策',
        status: 'reviewing',
        currentNode: '人社部复审',
        remainingDays: 20,
        applyDate: '2024-02-10',
        deadline: '2024-05-15',
        department: '人社部',
        applicant: '孙七',
        description: '申请人才引进住房补贴、子女教育、医疗保障等配套服务。'
      },
      {
        id: 'APP006',
        policyNo: '20251100006',
        name: '企业环保责任实施指南',
        policyType: '合规政策',
        status: 'approved',
        subsidyAmount: '20万元',
        applyDate: '2024-01-15',
        deadline: '2024-04-10',
        department: '生态环境部',
        applicant: '周八',
        description: '企业环保责任认证，已通过审核并获得绿色发展补贴。'
      },
      {
        id: 'APP007',
        policyNo: '20251100007',
        name: '2024年高新技术企业认定申报',
        policyType: '资质认定',
        status: 'rejected',
        applyDate: '2024-02-20',
        deadline: '2024-05-30',
        department: '市科技局',
        applicant: '张三',
        description: '高新技术企业认定申报，因材料问题被驳回。'
      },
      {
        id: 'APP008',
        policyNo: '20251100008',
        name: '企业社保缴费优惠政策',
        policyType: '人事政策',
        status: 'rejected',
        applyDate: '2024-02-25',
        deadline: '2024-05-20',
        department: '人社部',
        applicant: '李明',
        description: '社保缴费优惠申请，因企业资质不符被驳回。'
      },
      {
        id: 'APP009',
        policyNo: '20251100009',
        name: '外贸企业出口退税加快办理',
        policyType: '财务政策',
        status: 'rejected',
        applyDate: '2024-03-01',
        deadline: '2024-06-15',
        department: '税务总局',
        applicant: '王芳',
        description: '出口退税申请，因财务报表不完整被驳回。'
      }
    ];
    
    this.saveProjects(defaultProjects);
    return defaultProjects;
  }

  // 根据ID获取项目
  getProjectById(id: string): ApplicationProject | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  // 保存项目列表
  saveProjects(projects: ApplicationProject[]): void {
    StorageUtils.setItem(this.storageKey, projects);
  }

  // 更新项目
  updateProject(id: string, updates: Partial<ApplicationProject>): boolean {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    projects[index] = { ...projects[index], ...updates };
    this.saveProjects(projects);
    return true;
  }

  // 删除项目
  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    
    if (filtered.length === projects.length) return false;
    
    this.saveProjects(filtered);
    return true;
  }

  // 创建新项目
  createProject(project: Omit<ApplicationProject, 'id'>): ApplicationProject {
    const projects = this.getAllProjects();
    const newProject: ApplicationProject = {
      ...project,
      id: `APP${Date.now()}`
    };
    
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  // 提交申报
  submitApplication(id: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = this.updateProject(id, { 
          status: 'reviewing',
          currentNode: '初审中',
          applyDate: new Date().toISOString().split('T')[0]
        });
        
        resolve({
          success,
          message: success ? '申报已提交，等待审核' : '提交失败'
        });
      }, 1000);
    });
  }

  // 上传材料
  uploadMaterial(projectId: string, file: File, category: string): Promise<{ success: boolean; file?: MaterialFile }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material: MaterialFile = {
          id: `MAT${Date.now()}`,
          name: file.name,
          type: file.type,
          category,
          uploadTime: new Date().toISOString(),
          uploader: '当前用户',
          status: 'pending',
          fileUrl: URL.createObjectURL(file),
          size: `${(file.size / 1024).toFixed(2)} KB`
        };
        
        const project = this.getProjectById(projectId);
        if (project) {
          const materials = project.materials || [];
          materials.push(material);
          this.updateProject(projectId, { materials });
        }
        
        resolve({ success: true, file: material });
      }, 1500);
    });
  }

  // 下载材料
  downloadMaterial(materialId: string): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(['模拟文件内容'], { type: 'application/octet-stream' });
        resolve(blob);
      }, 500);
    });
  }

  // 批量下载材料
  downloadAllMaterials(projectId: string): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(['模拟压缩包内容'], { type: 'application/zip' });
        resolve(blob);
      }, 2000);
    });
  }

  // 补正材料
  supplementMaterial(projectId: string, file: File, category: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material: MaterialFile = {
          id: `MAT${Date.now()}`,
          name: file.name,
          type: file.type,
          category,
          uploadTime: new Date().toISOString(),
          uploader: '当前用户',
          status: 'pending',
          fileUrl: URL.createObjectURL(file),
          isSupplementVersion: true,
          version: 'v2.0',
          size: `${(file.size / 1024).toFixed(2)} KB`
        };
        
        const project = this.getProjectById(projectId);
        if (project) {
          const materials = project.materials || [];
          materials.push(material);
          this.updateProject(projectId, { 
            materials,
            status: 'reviewing',
            currentNode: '补正材料审核中'
          });
        }
        
        resolve({ success: true });
      }, 1500);
    });
  }

  // 重新申报
  reapplyProject(id: string): Promise<{ success: boolean; newId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = this.getProjectById(id);
        if (project) {
          const newProject = this.createProject({
            ...project,
            status: 'draft',
            applyDate: new Date().toISOString().split('T')[0],
            currentNode: undefined,
            remainingDays: undefined
          });
          
          resolve({ success: true, newId: newProject.id });
        } else {
          resolve({ success: false, newId: '' });
        }
      }, 1000);
    });
  }

  // 获取统计数据
  getStatistics() {
    const projects = this.getAllProjects();
    return {
      total: projects.length,
      draft: projects.filter(p => p.status === 'draft').length,
      reviewing: projects.filter(p => p.status === 'reviewing').length,
      supplement: projects.filter(p => p.status === 'supplement').length,
      approved: projects.filter(p => p.status === 'approved').length,
      rejected: projects.filter(p => p.status === 'rejected').length,
      expired: projects.filter(p => p.status === 'expired').length
    };
  }

  // 清除本地存储数据（用于重置）
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }

  // 获取待办提醒
  getReminders() {
    const projects = this.getAllProjects();
    return {
      supplement: projects.filter(p => p.status === 'supplement').length,
      expiring: projects.filter(p => p.remainingDays && p.remainingDays <= 3).length,
      updates: projects.filter(p => p.status === 'approved' || p.status === 'rejected').length
    };
  }
}

export const myApplicationService = new MyApplicationService();
