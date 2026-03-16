/**
 * 企业管理服务
 * 基础路径：/qgb/portal/enterprise
 */

import { apiClient } from "./apiClient";

// ==================== 类型定义 ====================

/** 认证状态：0-待审核，1-审核通过，2-审核拒绝 */
export type AuthStatus = "0" | "1" | "2";

/** 角色类型：0-管理员，1-普通成员 */
export type RoleType = "0" | "1";

/** 创建企业请求参数 */
export interface CreateEnterpriseParams {
  /** 企业名称 */
  name: string;
  /** 统一社会信用代码（18位） */
  creditCode: string;
  /** 法定代表人 */
  legalPerson?: string;
  /** 企业类型 */
  enterpriseType?: string;
  /** 注册资本 */
  registeredCapital?: string;
  /** 成立日期 */
  establishDate?: string;
  /** 企业地址 */
  address?: string;
  /** 联系人 */
  contact?: string;
  /** 联系电话 */
  contactPhone?: string;
}

/** 企业信息 */
export interface EnterpriseInfo {
  /** 企业ID */
  enterpriseId: number;
  /** 企业名称 */
  name: string;
  /** 统一社会信用代码 */
  creditCode: string;
  /** 认证状态 */
  authStatus: AuthStatus;
  /** 创建时间 */
  createTime: string;
}

/** 我的企业信息（包含角色） */
export interface MyEnterpriseInfo extends EnterpriseInfo {
  /** 用户在企业中的角色：admin-管理员，member-普通成员 */
  role: "admin" | "member";
}

/** 企业成员信息 */
export interface EnterpriseMember {
  /** 用户ID */
  userId: number;
  /** 手机号（脱敏） */
  phone: string;
  /** 昵称 */
  nickName: string;
  /** 头像 */
  avatar?: string;
  /** 角色类型：0-管理员，1-普通成员 */
  roleType: RoleType;
  /** 状态：0-启用，1-禁用 */
  status?: string;
  /** 角色名称 */
  roleName: string;
  /** 别名/名称 (兼容) */
  name?: string;
  /** 邮箱 */
  email?: string;
  /** 加入时间 */
  joinTime: string;
}

/** 成员列表响应 */
export interface MemberListResponse {
  /** 总数 */
  total: number;
  /** 当前页码 */
  pageNum: number;
  /** 每页条数 */
  pageSize: number;
  /** 成员列表 */
  list: EnterpriseMember[];
}

/** 邀请码响应 */
export interface InviteCodeResponse {
  /** 邀请码 */
  inviteCode: string;
}

/** 校验信用代码响应 */
export interface ValidateCreditCodeResponse {
  /** 是否有效 */
  valid: boolean;
}

/** 检查信用代码是否已注册响应 */
export interface CheckCreditCodeResponse {
  /** 是否已注册 */
  registered: boolean;
}

/** 添加成员请求参数 */
export interface AddMemberParams {
  /** 成员手机号 */
  phone: string;
  /** 昵称 */
  nickName?: string;
  /** 邮箱 */
  email?: string;
  /** 角色类型: 0管理员 1普通成员，默认1 */
  roleType?: string;
  /** 状态: 0启用 1禁用 */
  status?: string;
}

/** 编辑成员请求参数 */
export interface UpdateMemberParams {
  /** 成员用户ID */
  userId: number;
  /** 昵称 */
  nickName?: string;
  /** 邮箱 */
  email?: string;
  /** 角色类型: 0管理员 1普通成员 */
  roleType?: string;
  /** 状态: 0启用 1禁用 */
  status?: string;
}

// ==================== 企业管理服务 API ====================

export const enterpriseService = {
  /**
   * 1. 创建企业
   * @description 创建新企业并成为管理员
   * @param params 创建参数
   * @returns 企业信息
   */
  create: async (params: CreateEnterpriseParams): Promise<EnterpriseInfo> => {
    return apiClient.post<EnterpriseInfo>(
      "/qgb/portal/enterprise/create",
      params,
    );
  },

  /**
   * 2. 获取我的企业
   * @description 获取当前用户的企业信息及角色
   * @returns 企业信息（包含角色）
   */
  getMyEnterprise: async (): Promise<MyEnterpriseInfo> => {
    return apiClient.get<MyEnterpriseInfo>("/qgb/portal/enterprise/my");
  },

  /**
   * 3. 获取企业列表
   * @description 获取当前用户加入的所有企业
   * @returns 企业列表
   */
  getList: async (): Promise<EnterpriseInfo[]> => {
    return apiClient.get<EnterpriseInfo[]>("/qgb/portal/enterprise/list");
  },

  /**
   * 4. 获取邀请码
   * @description 仅管理员 - 获取或生成企业邀请码
   * @returns 邀请码
   */
  getInviteCode: async (): Promise<InviteCodeResponse> => {
    return apiClient.post<InviteCodeResponse>("/qgb/portal/enterprise/invite");
  },

  /**
   * 5. 刷新邀请码
   * @description 仅管理员 - 生成新邀请码，旧码失效
   * @returns 新邀请码
   */
  refreshInviteCode: async (): Promise<InviteCodeResponse> => {
    return apiClient.post<InviteCodeResponse>(
      "/qgb/portal/enterprise/refreshInviteCode",
    );
  },

  /**
   * 6. 接受邀请
   * @description 使用邀请码加入企业
   * @param inviteCode 企业邀请码
   * @returns 操作结果
   */
  acceptInvite: async (inviteCode: string): Promise<any> => {
    return apiClient.post("/qgb/portal/enterprise/acceptInvite", {
      inviteCode,
    });
  },

  /**
   * 7. 获取成员列表
   * @description 分页获取企业所有成员信息
   * @param pageNum 页码，默认1
   * @param pageSize 每页条数，默认10
   * @returns 成员列表
   */
  getMembers: async (
    pageNum: number = 1,
    pageSize: number = 10,
  ): Promise<MemberListResponse> => {
    return apiClient.get<MemberListResponse>(
      `/qgb/portal/enterprise/members?pageNum=${pageNum}&pageSize=${pageSize}`,
    );
  },

  /**
   * 8. 添加成员
   * @description 仅管理员 - 通过手机号添加企业成员，被添加用户必须已注册
   * @param params 添加成员参数
   * @returns 操作结果
   */
  addMember: async (params: AddMemberParams): Promise<any> => {
    return apiClient.post("/qgb/portal/enterprise/addMember", params);
  },

  /**
   * 9. 获取成员详情
   * @description 获取单个企业成员的详细信息
   * @param userId 成员用户ID
   * @returns 成员详情
   */
  getMemberDetail: async (userId: number): Promise<EnterpriseMember> => {
    return apiClient.get<EnterpriseMember>(
      `/qgb/portal/enterprise/member/${userId}`,
    );
  },

  /**
   * 10. 编辑成员
   * @description 仅管理员 - 编辑企业成员角色或状态
   * @param params 编辑成员参数
   * @returns 操作结果
   */
  updateMember: async (params: UpdateMemberParams): Promise<any> => {
    return apiClient.post("/qgb/portal/enterprise/updateMember", params);
  },

  /**
   * 11. 移除成员
   * @description 仅管理员 - 移除企业成员，不能移除自己
   * @param userId 要移除的用户ID
   * @returns 操作结果
   */
  removeMember: async (userId: number): Promise<any> => {
    return apiClient.post(`/qgb/portal/enterprise/removeMember/${userId}`);
  },

  /**
   * 12. 校验信用代码格式
   * @description 校验统一社会信用代码格式是否正确
   * @param creditCode 统一社会信用代码
   * @returns 是否有效
   */
  validateCreditCode: async (
    creditCode: string,
  ): Promise<ValidateCreditCodeResponse> => {
    return apiClient.get<ValidateCreditCodeResponse>(
      `/qgb/portal/enterprise/validateCreditCode?creditCode=${encodeURIComponent(
        creditCode,
      )}`,
    );
  },

  /**
   * 13. 检查信用代码是否已注册
   * @description 检查统一社会信用代码是否已被其他企业使用
   * @param creditCode 统一社会信用代码
   * @returns 是否已注册
   */
  checkCreditCode: async (
    creditCode: string,
  ): Promise<CheckCreditCodeResponse> => {
    return apiClient.get<CheckCreditCodeResponse>(
      `/qgb/portal/enterprise/checkCreditCode?creditCode=${encodeURIComponent(
        creditCode,
      )}`,
    );
  },
};

// ==================== 辅助函数 ====================

/** 认证状态映射 */
export const AUTH_STATUS_MAP: Record<
  AuthStatus,
  { text: string; color: string }
> = {
  "0": { text: "待审核", color: "processing" },
  "1": { text: "已认证", color: "success" },
  "2": { text: "审核拒绝", color: "error" },
};

/** 角色类型映射 */
export const ROLE_TYPE_MAP: Record<RoleType, { text: string; color: string }> =
  {
    "0": { text: "管理员", color: "blue" },
    "1": { text: "普通成员", color: "default" },
  };

/**
 * 获取认证状态文本
 * @param status 认证状态码
 * @returns 状态文本
 */
export const getAuthStatusText = (status: AuthStatus): string => {
  return AUTH_STATUS_MAP[status]?.text || "未知状态";
};

/**
 * 获取认证状态颜色
 * @param status 认证状态码
 * @returns 状态颜色
 */
export const getAuthStatusColor = (status: AuthStatus): string => {
  return AUTH_STATUS_MAP[status]?.color || "default";
};

/**
 * 获取角色类型文本
 * @param roleType 角色类型码
 * @returns 角色文本
 */
export const getRoleTypeText = (roleType: RoleType): string => {
  return ROLE_TYPE_MAP[roleType]?.text || "未知角色";
};

/**
 * 获取角色类型颜色
 * @param roleType 角色类型码
 * @returns 角色颜色
 */
export const getRoleTypeColor = (roleType: RoleType): string => {
  return ROLE_TYPE_MAP[roleType]?.color || "default";
};

/**
 * 本地校验统一社会信用代码格式
 * @param creditCode 信用代码
 * @returns 是否有效
 */
export const validateCreditCodeFormat = (creditCode: string): boolean => {
  // 统一社会信用代码为18位，由数字和大写字母组成
  const regex = /^[0-9A-Z]{18}$/;
  return regex.test(creditCode);
};
