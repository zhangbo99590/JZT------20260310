/**
 * 用户认证服务
 * 基础路径：/qgb/portal/auth
 */

import { apiClient } from "./apiClient";
import { StorageUtils } from "../utils/storage";

// ==================== 类型定义 ====================

/** 验证码类型 */
export type CodeType = "register" | "login" | "reset";

/** 登录响应数据 */
export interface LoginResponse {
  /** JWT Token */
  token: string;
  /** 用户ID */
  userId: number;
  /** 手机号（脱敏显示） */
  phone: string;
  /** 用户昵称 */
  nickName: string;
  /** 头像URL */
  avatar?: string;
  /** 邮箱 */
  email?: string;
  /** 企业ID */
  enterpriseId: number;
  /** 企业名称 */
  enterpriseName: string;
  /** 租户ID */
  tenantId: number;
  /** 角色类型：0-管理员，1-普通成员 */
  roleType: string;
  /** 登录时间戳 */
  loginTime?: number;
  /** Token过期时间戳 */
  expireTime: number;
}

/** 发送验证码请求参数 */
export interface SendCodeParams {
  phone: string;
  type: CodeType;
}

/** 注册请求参数 */
export interface RegisterParams {
  phone: string;
  code: string;
  password: string;
  inviteCode?: string;
}

/** 密码登录请求参数 */
export interface LoginParams {
  phone: string;
  password: string;
}

/** 验证码登录请求参数 */
export interface LoginByCodeParams {
  phone: string;
  code: string;
}

/** 重置密码请求参数 */
export interface ResetPasswordParams {
  phone: string;
  code: string;
  newPassword: string;
}

/** 修改密码请求参数 */
export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}

/** 检查手机号响应 */
export interface CheckPhoneResponse {
  registered: boolean;
}

/** 刷新Token响应 */
export interface RefreshTokenResponse {
  token: string;
  expireTime: number;
}

// ==================== 认证服务 API ====================

export const authService = {
  /**
   * 1. 发送短信验证码
   * @param params 手机号和验证码类型
   * @returns 操作结果
   */
  sendCode: async (params: SendCodeParams): Promise<any> => {
    return apiClient.post("/qgb/portal/auth/sendCode", params);
  },

  /**
   * 2. 用户注册
   * @param params 注册参数
   * @returns 操作结果
   */
  register: async (params: RegisterParams): Promise<any> => {
    return apiClient.post("/qgb/portal/auth/register", params);
  },

  /**
   * 3. 密码登录
   * @description 使用手机号和密码登录，返回 JWT Token
   * @note 响应头中也会返回 Authorization: Bearer {token}，但我们从响应体获取
   * @param params 登录参数
   * @returns 登录响应（包含token和用户信息）
   */
  login: async (params: LoginParams): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/qgb/portal/auth/login", params);
  },

  /**
   * 4. 验证码登录
   * @description 使用手机号和短信验证码登录
   * @note 响应头中也会返回 Authorization: Bearer {token}，但我们从响应体获取
   * @param params 手机号和验证码
   * @returns 登录响应（包含token和用户信息）
   */
  loginByCode: async (params: LoginByCodeParams): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(
      "/qgb/portal/auth/loginByCode",
      params,
    );
  },

  /**
   * 5. 退出登录
   * @returns 操作结果
   */
  logout: async (): Promise<any> => {
    try {
      await apiClient.post("/qgb/portal/auth/logout");
    } finally {
      // 无论接口是否成功，都清除本地状态
      clearAuthState();
    }
  },

  /**
   * 6. 修改密码（已登录）
   * @param params 旧密码和新密码
   * @returns 操作结果
   */
  updatePassword: async (params: UpdatePasswordParams): Promise<any> => {
    return apiClient.post("/qgb/portal/auth/updatePassword", params);
  },

  /**
   * 7. 重置密码（未登录）
   * @param params 手机号、验证码和新密码
   * @returns 操作结果
   */
  resetPassword: async (params: ResetPasswordParams): Promise<any> => {
    return apiClient.post("/qgb/portal/auth/resetPassword", params);
  },

  /**
   * 8. 检查手机号是否已注册
   * @param phone 手机号
   * @returns 是否已注册
   */
  checkPhone: async (phone: string): Promise<CheckPhoneResponse> => {
    return apiClient.get<CheckPhoneResponse>(
      `/qgb/portal/auth/checkPhone?phone=${encodeURIComponent(phone)}`,
    );
  },

  /**
   * 9. 获取当前登录用户信息
   * @returns 用户信息
   */
  getUserInfo: async (): Promise<LoginResponse> => {
    return apiClient.get<LoginResponse>("/qgb/portal/auth/info");
  },

  /**
   * 10. 刷新Token
   * @returns 新的token和过期时间
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>(
      "/qgb/portal/auth/refreshToken",
    );
  },
};

// ==================== 辅助函数 ====================

/**
 * 保存登录状态到本地存储
 * @param data 登录响应数据
 */
export const saveAuthState = (data: LoginResponse) => {
  const authData = {
    portalToken: data.token,
    userId: String(data.userId),
    tenantId: String(data.tenantId || ""),
    isLoggedIn: "true",
    lastLoginTime: String(data.loginTime || Date.now()),
    username: data.nickName || "用户",
    userInfo: data,
    auth_user: {
      id: String(data.userId),
      name: data.nickName || "用户",
      phone: data.phone,
      email: data.email || "",
      role: data.roleType === "0" ? "admin" : "viewer",
      roleType: data.roleType,
      companyId: String(data.enterpriseId || ""),
      companyName: data.enterpriseName || "",
      tenantId: data.tenantId,
      avatar: data.avatar,
    }
  };
  
  StorageUtils.setItems(authData);

  // 设置 apiClient 的认证 token
  apiClient.setAuthToken(data.token);
};

/**
 * 清除本地登录状态
 */
export const clearAuthState = () => {
  const authKeys = [
    "portalToken", "userId", "tenantId", "userInfo", 
    "isLoggedIn", "lastLoginTime", "username", "auth_user"
  ];
  StorageUtils.removeItems(authKeys);

  // 清除 apiClient 的认证 token
  apiClient.setAuthToken("");
};

/**
 * 检查是否已登录
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  const token = StorageUtils.getItem("portalToken", null);
  const isLoggedIn = StorageUtils.getItem("isLoggedIn", null);
  return !!token && isLoggedIn === "true";
};

/**
 * 获取当前 token
 * @returns token 或 null
 */
export const getToken = (): string | null => {
  return StorageUtils.getItem("portalToken", null);
};

/**
 * 检查 token 是否过期
 * @param expiryHours 过期时间（小时），默认24小时
 * @returns 是否过期
 */
export const isTokenExpired = (expiryHours: number = 24): boolean => {
  const lastLoginTime = StorageUtils.getItem("lastLoginTime", null);
  if (!lastLoginTime) return true;

  const expiryMs = expiryHours * 60 * 60 * 1000;
  return Date.now() - parseInt(lastLoginTime) > expiryMs;
};
