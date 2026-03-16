// 我的申报服务 - 处理所有申报相关的业务逻辑

import { StorageUtils } from "../utils/storage";

export interface ApplicationProject {
  id: string;
  policyNo?: string;
  name: string;
  policyType: string;
  status:
    | "draft" // 待提交
    | "reviewing" // 审核中
    | "supplement" // 需补正
    | "approved" // 已通过
    | "rejected" // 已驳回
    | "expired"; // 已过期
  currentNode?: string;
  remainingDays?: number;
  rejectionReason?: string;
  supplementDeadline?: string;
  subsidyAmount?: string;
  qualificationNo?: string;
  applyDate: string;
  deadline: string;
  department: string;
  applicant: string;
  description?: string;
  materials?: MaterialFile[];
  // 扩展字段用于动态绑定
  annualRevenue?: number;
  rdExpense?: number;
  qualificationType?: string;
}

export interface MaterialFile {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadTime: string;
  uploader: string;
  status: "approved" | "pending" | "rejected" | "need_replace";
  version?: string;
  isSupplementVersion?: boolean;
  fileUrl: string;
  size?: string;
}

class MyApplicationService {
  private storageKey = "my_applications_data";
  // 清除本地存储
  private isFirstLoad = true;

  // 获取所有申报项目
  getAllProjects(): ApplicationProject[] {
    // 仅在首次加载（页面刷新时）清除缓存
    if (this.isFirstLoad) {
      StorageUtils.removeItem(this.storageKey);
      this.isFirstLoad = false;
    }

    const stored = StorageUtils.getItem(this.storageKey, null);
    if (stored) {
      return stored;
    }

    // 初始化默认数据 - 与政策中心的政策列表一一对应
    // 初始化默认数据 - 与政策中心的政策列表一一对应
    const defaultProjects: ApplicationProject[] = [
      {
        id: "APP202601001",
        name: "2026年度高新技术企业认定",
        policyType: "高新技术企业认定",
        status: "reviewing",
        currentNode: "专家评审中",
        remainingDays: 15,
        applyDate: "2026-01-15",
        deadline: "2026-03-31",
        department: "北京市科学技术委员会",
        applicant: "北京积分时代科技有限公司",
        description: "高新技术企业认定申请，包含研发费用专项审计报告",
        materials: [
          {
            id: "MAT001",
            name: "高新技术企业认定申请书.pdf",
            type: "application/pdf",
            category: "申请书",
            uploadTime: "2026-01-15 10:30:00",
            uploader: "张三",
            status: "approved",
            fileUrl: "#",
            size: "2.5 MB",
          },
        ],
      },
      {
        id: "APP202601002",
        name: "科技型中小企业评价",
        policyType: "科技型中小企业",
        status: "approved",
        currentNode: "已公示",
        subsidyAmount: "资质认定",
        applyDate: "2025-12-10",
        deadline: "2026-12-31",
        department: "科技部火炬中心",
        applicant: "北京积分时代科技有限公司",
        description: "2026年度科技型中小企业评价入库",
      },
      {
        id: "APP202601003",
        name: "企业研发费用加计扣除",
        policyType: "税收优惠",
        status: "supplement",
        currentNode: "材料补正",
        supplementDeadline: "2026-02-20",
        rejectionReason: "研发费用辅助账缺少2025年12月凭证，请补充上传",
        applyDate: "2026-01-20",
        deadline: "2026-05-31",
        department: "北京市税务局",
        applicant: "北京积分时代科技有限公司",
        description: "2025年度研发费用加计扣除备案",
      },
      {
        id: "APP202601004",
        name: "专精特新中小企业认定",
        policyType: "专精特新",
        status: "draft",
        currentNode: "草稿",
        applyDate: "2026-02-08",
        deadline: "2026-04-15",
        department: "北京市经济和信息化局",
        applicant: "北京积分时代科技有限公司",
        description: "北京市专精特新中小企业认定申请",
      },
      {
        id: "APP202511005",
        name: "首台（套）重大技术装备保险补偿",
        policyType: "资金补贴",
        status: "rejected",
        currentNode: "审核不通过",
        rejectionReason: "申请产品不符合首台（套）目录要求，核心技术指标未达标",
        applyDate: "2025-11-05",
        deadline: "2025-12-31",
        department: "工业和信息化部",
        applicant: "北京积分时代科技有限公司",
        description: "基于AI的智能风控系统首台套认定",
      },
      {
        id: "APP001",
        policyNo: "GK-2026-001",
        name: "2026年度高新技术企业认定",
        policyType: "资质认定",
        status: "draft",
        applyDate: "2026-02-10",
        deadline: "2026-03-31",
        department: "科学技术部",
        applicant: "张三",
        description: "高新技术企业认定申请，预计补贴30-50万",
      },
      {
        id: "APP002",
        policyNo: "CS-2026-015",
        name: "企业研发费用加计扣除",
        policyType: "税收优惠",
        status: "reviewing",
        currentNode: "税务局初审",
        remainingDays: 5,
        applyDate: "2026-01-15",
        deadline: "2026-05-31",
        department: "税务局",
        applicant: "李四",
        description: "2025年度研发费用加计扣除申报",
      },
      {
        id: "APP003",
        policyNo: "CX-2025-088",
        name: "专精特新中小企业认定",
        policyType: "资质认定",
        status: "supplement",
        supplementDeadline: "2026-02-15",
        rejectionReason: "审计报告缺少盖章页，请补充上传。",
        applyDate: "2025-12-20",
        deadline: "2026-01-31",
        department: "经济和信息化局",
        applicant: "王五",
        description: "市级专精特新中小企业认定申请",
        materials: [
          {
            id: "MAT001",
            name: "审计报告.pdf",
            type: "application/pdf",
            category: "财务报表",
            uploadTime: "2025-12-20",
            uploader: "王五",
            status: "need_replace",
            fileUrl: "",
            size: "2.5 MB",
          },
        ],
      },
      {
        id: "APP004",
        policyNo: "RJ-2025-102",
        name: "软件企业所得税减免备案",
        policyType: "税收优惠",
        status: "approved",
        subsidyAmount: "15%",
        applyDate: "2025-11-10",
        deadline: "2025-12-31",
        department: "发改委",
        applicant: "赵六",
        description: "两免三减半优惠政策备案",
      },
      {
        id: "APP005",
        policyNo: "KC-2025-055",
        name: "科技型中小企业技术创新基金",
        policyType: "资金补贴",
        status: "rejected",
        rejectionReason: "项目技术创新性不足，未达到评审标准。",
        applyDate: "2025-10-05",
        deadline: "2025-11-30",
        department: "科技局",
        applicant: "孙七",
        description: "基于AI的智能物流系统研发项目",
      },
      {
        id: "APP006",
        policyNo: "RC-2025-009",
        name: "高层次人才引进计划",
        policyType: "人才补贴",
        status: "expired",
        applyDate: "2025-08-15",
        deadline: "2025-09-30",
        department: "人力资源和社会保障局",
        applicant: "周八",
        description: "引进海外高层次人才申报",
      },
    ];

    this.saveProjects(defaultProjects);
    return defaultProjects;
  }

  // 根据ID获取项目
  getProjectById(id: string): ApplicationProject | null {
    const projects = this.getAllProjects();
    return projects.find((p) => p.id === id) || null;
  }

  // 保存项目列表
  saveProjects(projects: ApplicationProject[]): void {
    StorageUtils.setItem(this.storageKey, projects);
  }

  // 更新项目
  updateProject(id: string, updates: Partial<ApplicationProject>): boolean {
    const projects = this.getAllProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) return false;

    projects[index] = { ...projects[index], ...updates };
    this.saveProjects(projects);
    return true;
  }

  // 删除项目
  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) return false;

    this.saveProjects(filtered);
    return true;
  }

  // 创建新项目
  createProject(project: Omit<ApplicationProject, "id">): ApplicationProject {
    const projects = this.getAllProjects();
    const newProject: ApplicationProject = {
      ...project,
      id: `APP${Date.now()}`,
    };

    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  // 提交申报
  submitApplication(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = this.updateProject(id, {
          status: "reviewing",
          currentNode: "初审中",
          applyDate: new Date().toISOString().split("T")[0],
        });

        resolve({
          success,
          message: success ? "申报已提交，等待审核" : "提交失败",
        });
      }, 1000);
    });
  }

  // 上传材料
  uploadMaterial(
    projectId: string,
    file: File,
    category: string,
  ): Promise<{ success: boolean; file?: MaterialFile }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material: MaterialFile = {
          id: `MAT${Date.now()}`,
          name: file.name,
          type: file.type,
          category,
          uploadTime: new Date().toISOString(),
          uploader: "当前用户",
          status: "pending",
          fileUrl: URL.createObjectURL(file),
          size: `${(file.size / 1024).toFixed(2)} KB`,
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
        const blob = new Blob(["模拟文件内容"], {
          type: "application/octet-stream",
        });
        resolve(blob);
      }, 500);
    });
  }

  // 批量下载材料
  downloadAllMaterials(projectId: string): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(["模拟压缩包内容"], { type: "application/zip" });
        resolve(blob);
      }, 2000);
    });
  }

  // 补正材料
  supplementMaterial(
    projectId: string,
    file: File,
    category: string,
  ): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material: MaterialFile = {
          id: `MAT${Date.now()}`,
          name: file.name,
          type: file.type,
          category,
          uploadTime: new Date().toISOString(),
          uploader: "当前用户",
          status: "pending",
          fileUrl: URL.createObjectURL(file),
          isSupplementVersion: true,
          version: "v2.0",
          size: `${(file.size / 1024).toFixed(2)} KB`,
        };

        const project = this.getProjectById(projectId);
        if (project) {
          const materials = project.materials || [];
          materials.push(material);
          this.updateProject(projectId, {
            materials,
            status: "reviewing",
            currentNode: "补正材料审核中",
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
            status: "draft",
            applyDate: new Date().toISOString().split("T")[0],
            currentNode: undefined,
            remainingDays: undefined,
          });

          resolve({ success: true, newId: newProject.id });
        } else {
          resolve({ success: false, newId: "" });
        }
      }, 1000);
    });
  }

  // 获取统计数据
  getStatistics() {
    const projects = this.getAllProjects();
    return {
      total: projects.length,
      draft: projects.filter((p) => p.status === "draft").length,
      reviewing: projects.filter((p) => p.status === "reviewing").length,
      supplement: projects.filter((p) => p.status === "supplement").length,
      approved: projects.filter((p) => p.status === "approved").length,
      rejected: projects.filter((p) => p.status === "rejected").length,
      expired: projects.filter((p) => p.status === "expired").length,
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
      supplement: projects.filter((p) => p.status === "supplement").length,
      expiring: projects.filter((p) => p.remainingDays && p.remainingDays <= 3)
        .length,
      updates: projects.filter(
        (p) => p.status === "approved" || p.status === "rejected",
      ).length,
    };
  }
}

export const myApplicationService = new MyApplicationService();
