import { apiClient } from "./apiClient";
import { StorageUtils } from "../utils/storage";
import dayjs from "dayjs";
import { enterpriseService, AddMemberParams } from "./enterpriseService";

export interface UserRole {
  roleId: number;
  roleName: string;
}

export interface User {
  userId: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  gender: string;
  avatar?: string;
  status: string;
  deptId: number;
  deptName: string;
  roles?: UserRole[];
  postIds?: number[];
  roleIds?: number[];
  remark?: string;
  createTime: string;
  lastLoginTime?: string;
}

export interface UserListResponse {
  total: number;
  list: User[];
  pageNum: number;
  pageSize: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserListParams {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  nickname?: string;
  email?: string;
  status?: string;
  deptId?: number;
  sortField?: string;
  sortOrder?: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  phone: string;
  email?: string;
  nickName: string;
  avatar?: string;
  /** 角色类型：0-管理员，1-普通成员 */
  roleType: string; // Assuming RoleType is a string like "0" or "1"
  /** 状态：0-启用，1-禁用 */
  status?: string;
  enterpriseId: string;
  enterpriseName: string;
  loginTime: string | number;
  loginIp: string;
  token?: string;
  name?: string;
}

export const userService = {
  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表响应
   */
  getUserList: async (
    params: UserListParams = {},
  ): Promise<UserListResponse> => {
    // 原始 API 调用
    const queryParams = new URLSearchParams();
    if (params.pageNum)
      queryParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params.username) queryParams.append("username", params.username);
    if (params.nickname) queryParams.append("nickname", params.nickname);
    if (params.email) queryParams.append("email", params.email);
    if (params.status) queryParams.append("status", params.status);
    if (params.deptId) queryParams.append("deptId", params.deptId.toString());
    // 强制增加时间戳防止任何层面的缓存
    queryParams.append("_t", Date.now().toString());

    const response = await apiClient.get<UserListResponse>(
      `/qgb/portal/enterprise/members?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // 手动映射字段以匹配 User 接口
    if (response && response.list) {
      console.log("[UserList Raw Data Sample]", response.list[0]);
      console.log(
        "[UserList joinTime Sample]",
        (response.list[0] as any)?.joinTime,
        "-> dayjs:",
        dayjs((response.list[0] as any)?.joinTime).format("YYYY/M/D HH:mm:ss"),
      );
      response.list = response.list.map((item: any) => {
        // 尝试从本地存储获取当前用户的登录时间
        let lastLoginTime = item.lastLoginTime || "";
        try {
          const currentUserId = StorageUtils.getItem("userId", null);
          if (currentUserId && String(item.userId) === currentUserId) {
            const storedTime = StorageUtils.getItem("lastLoginTime", null);
            // 只有当接口未返回有效时间时才使用本地存储的时间
            if (!lastLoginTime && storedTime) {
              lastLoginTime = storedTime;
              console.log(
                "[UserList] Injected local login time for current user:",
                lastLoginTime,
              );
            }
          }
        } catch (e) {
          // 忽略 localStorage 访问错误
        }

        return {
          ...item,
          // 关键映射：接口返回的是 userId，前端 User 接口也叫 userId，通常没问题
          // 接口返回 nickName(大写N)，前端可能需 nickname
          nickname: item.nickName || item.nickname || "企业成员",
          // 接口可能不返回 username，用 nickName 或 phone 填充
          username: item.username || item.nickName || item.phone,
          // 角色映射：接口返回 roleName，前端需 roles 数组
          roles:
            item.roles ||
            (item.roleName ? [{ roleId: 0, roleName: item.roleName }] : []),
          // 状态映射
          status: item.status || "0",
          // 邮箱映射 (全选保护：如果后端返回的是 Email 或 mail 等)
          email: item.email || item.mail || item.userEmail || "",
          // 时间映射：直接传递原始值，由表格列渲染时处理格式化
          createTime: item.createTime || item.joinTime || "",
          lastLoginTime: lastLoginTime,
        };
      });
    }

    return response;
  },

  /**
   * 获取用户详情
   * @param userId 用户ID
   * @returns 用户详情
   */
  getUserDetail: async (userId: number): Promise<User> => {
    // 调用企业成员详情接口，而不是个人资料接口
    const response = await enterpriseService.getMemberDetail(userId);

    // 映射到 User 接口
    return {
      ...response,
      userId: response.userId,
      nickname: response.nickName || "企业成员",
      username: response.phone || response.nickName || "member",
      email: response.email || "",
      phone: response.phone,
      roles: response.roleName
        ? [{ roleId: Number(response.roleType), roleName: response.roleName }]
        : [],
      status: String(response.status ?? "0"), // 使用接口返回的真实状态，默认为"0"（启用）
      createTime: response.joinTime
        ? dayjs(response.joinTime).isValid()
          ? dayjs(response.joinTime).format("YYYY-MM-DD HH:mm:ss")
          : ""
        : "",
      lastLoginTime: "N/A", // 成员详情接口可能不带此字段
    } as unknown as User;
  },

  /**
   * 获取用户个人资料
   * @returns 用户个人资料
   */
  getUserProfile: async (): Promise<User> => {
    return apiClient.get<User>(
      "http://49.232.9.99:8080/qgb/portal/user/profile",
    );
  },

  createUser: async (user: Partial<User>): Promise<any> => {
    try {
      // 映射 User 类型到 AddMemberParams
      const params: AddMemberParams = {
        phone: user.phone || user.username || "",
        nickName: user.nickname || user.username,
        email: user.email,
        roleType: user.roleIds?.[0]?.toString() || "1",
        status: user.status === "0" ? "0" : "1",
      };
      return await enterpriseService.addMember(params);
    } catch (error) {
      console.error("userService.createUser failed:", error);
      throw error;
    }
  },

  /**
   * 更新用户资料
   * @param userId 用户ID
   * @param user 用户信息
   * @returns 操作结果
   */
  updateUser: async (userId: number, user: Partial<User>): Promise<any> => {
    try {
      // 企业成员管理应使用 enterpriseService.updateMember
      return await enterpriseService.updateMember({
        userId: userId,
        nickName: user.nickname,
        email: user.email,
        roleType: user.roleIds?.[0]?.toString(),
        status: user.status, // 直接使用表单的值，"0" 启用 "1" 禁用
      });
    } catch (error) {
      console.error("userService.updateUser failed:", error);
      throw error;
    }
  },

  /**
   * 删除用户（移除企业成员）
   * @param userId 用户ID
   * @returns 操作结果
   */
  deleteUser: async (userId: number): Promise<any> => {
    return apiClient.post(`/qgb/portal/enterprise/removeMember/${userId}`);
  },

  /**
   * 批量删除用户（移除企业成员）
   * @param userIds 用户ID列表
   * @returns 操作结果
   */
  batchDeleteUsers: async (userIds: number[]): Promise<any> => {
    // 批量移除企业成员，通过多次调用单个删除接口实现
    const promises = userIds.map((userId) =>
      apiClient.post(`/qgb/portal/enterprise/removeMember/${userId}`),
    );

    try {
      await Promise.all(promises);
      return { success: true, message: "批量删除成功" };
    } catch (error) {
      return { success: false, message: "批量删除失败", error };
    }
  },

  /**
   * 修改用户状态（启用/禁用企业成员）
   * @param userId 用户ID
   * @param status 状态 ("active" | "inactive")
   * @returns 操作结果
   */
  updateUserStatus: async (userId: number, status: string): Promise<any> => {
    // 企业成员状态管理，根据实际API调整
    return apiClient.post(`/qgb/portal/enterprise/memberStatus/${userId}`, {
      status: status === "active" ? "ENABLED" : "DISABLED",
    });
  },
};

/**
 * 获取当前登录用户信息
 * @returns 用户信息
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const userInfo = await apiClient.get<any>("/qgb/portal/auth/info");

    // 增强修复：API返回roleType为空或无效时，从本地存储恢复
    let roleType = userInfo.roleType;
    let enterpriseId = userInfo.enterpriseId;
    let enterpriseName = userInfo.enterpriseName;

    // 严谨判断：如果 roleType 是 null, undefined, "" 或者 "null" 字符串，都视为无效
    const isRoleTypeValid =
      roleType !== null &&
      roleType !== undefined &&
      roleType !== "" &&
      String(roleType) !== "null";
    const isEnterpriseIdValid =
      enterpriseId !== null &&
      enterpriseId !== undefined &&
      enterpriseId !== "" &&
      String(enterpriseId) !== "null";

    if (!isRoleTypeValid || !isEnterpriseIdValid) {
      try {
        const authUser = StorageUtils.getItem("auth_user", null);
        if (authUser) {

          if (!isRoleTypeValid && authUser.roleType !== undefined) {
            roleType = authUser.roleType;
            console.log(
              "[UserInfo] Recovered roleType from localStorage:",
              roleType,
            );
          }

          if (!isEnterpriseIdValid) {
            if (authUser.companyId && authUser.companyId !== "null") {
              enterpriseId = authUser.companyId;
            } else if (authUser.enterpriseId) {
              enterpriseId = authUser.enterpriseId;
            }
          }

          if (
            (!enterpriseName || enterpriseName === "null") &&
            authUser.companyName
          ) {
            enterpriseName = authUser.companyName;
          }
        }
      } catch (e) {
        console.warn("Failed to recover user info from localStorage", e);
      }
    }

    // 映射后端返回字段到 UserInfo 接口
    return {
      userId: userInfo.userId,
      username: userInfo.userName || userInfo.phone, // 优先用userName，没有则用手机号
      phone: userInfo.phone,
      email: userInfo.email,
      nickName: userInfo.nickName, // JSON返回是大写N
      avatar: userInfo.avatar,
      roleType: roleType,
      enterpriseId: enterpriseId,
      enterpriseName: enterpriseName,
      loginTime: userInfo.loginTime || Date.now(), // 使用后端返回的时间戳，如未返回则用当前时间戳
      loginIp: userInfo.loginIp || "127.0.0.1",
      token: userInfo.token,
      name: userInfo.nickName, // 兼容 name 字段
    } as UserInfo;
  } catch (error: any) {
    console.error("获取用户信息失败:", error);
    throw error;
  }
};

// ==================== 用户资料管理 API ====================

/**
 * 修改用户资料（昵称等基本信息）
 * @param data 用户资料数据
 * @returns 操作结果
 */
export const updateUserProfile = async (data: {
  nickName?: string;
}): Promise<any> => {
  return apiClient.put("/qgb/portal/user/profile", data);
};

/**
 * 修改手机号
 * @param newPhone 新手机号
 * @param code 短信验证码
 * @returns 操作结果
 */
export const updateUserPhone = async (
  newPhone: string,
  code: string,
): Promise<any> => {
  return apiClient.put("/qgb/portal/user/phone", { newPhone, code });
};

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 操作结果
 */
export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<any> => {
  return apiClient.put("/qgb/portal/user/password", {
    oldPassword,
    newPassword,
  });
};

/**
 * 上传头像
 * @param file 头像图片文件
 * @returns 包含头像URL的响应
 */
export const uploadAvatar = async (
  file: File,
): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  // 使用 fetch 直接发送 FormData，因为 apiClient 默认使用 JSON
  const token = StorageUtils.getItem("portalToken", null);
  const response = await fetch("/api/qgb/portal/user/avatar", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("头像上传失败");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "头像上传失败");
  }

  return result.data;
};

/**
 * 发送手机号修改验证码
 * @param phone 新手机号
 * @returns 操作结果
 */
export const sendPhoneCode = async (phone: string): Promise<any> => {
  return apiClient.get(
    `/qgb/portal/user/sendPhoneCode?phone=${encodeURIComponent(phone)}`,
  );
};

/**
 * 用户登出（兼容旧代码）
 * @deprecated 请使用 authService.logout()
 */
export const logout = () => {
  // 清除所有相关的localStorage字段
  localStorage.removeItem("portalToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("lastLoginTime");
  localStorage.removeItem("username");
  localStorage.removeItem("auth_user");

  // 清除apiClient的认证token
  apiClient.setAuthToken("");
};
