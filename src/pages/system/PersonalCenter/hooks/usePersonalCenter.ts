/**
 * 个人中心 Hook
 * 创建时间: 2026-01-13
 */

import { useState, useCallback, useEffect } from "react";
import { message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getUserInfo as fetchUserInfo,
  logout,
  UserInfo as UserInfoType,
  updateUserProfile,
  updateUserPhone,
  updateUserPassword,
  uploadAvatar,
  sendPhoneCode,
} from "../../../../services/userService";
import { StorageUtils } from "../../../../utils/storage";
import type {
  OperationLog,
  NotificationSetting,
  ModulePreference,
  QuietHours,
  LogFilter,
} from "../types/index.ts";
import {
  defaultNotificationSettings,
  defaultModulePreferences,
  defaultQuietHours,
  moduleMap,
  typeMap,
} from "../config/defaultConfig.ts";
import { useAuth } from "../../../../context/auth";

export function usePersonalCenter() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [nicknameForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // 操作日志
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [logFilter, setLogFilter] = useState<LogFilter>({
    dateRange: "recent7",
    module: "all",
    type: "all",
  });
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >(defaultNotificationSettings);
  const [quietHours, setQuietHours] = useState<QuietHours>(defaultQuietHours);

  // 模块偏好设置
  const [modulePreferences, setModulePreferences] = useState<
    ModulePreference[]
  >(() => {
    return StorageUtils.getItem("modulePreferences", defaultModulePreferences);
  });
  const [defaultHomePage, setDefaultHomePage] = useState(() => {
    return StorageUtils.getItem("defaultHomePage", "home");
  });

  // 手机号修改
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 昵称修改
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);

  // 初始化获取用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setApiLoading(true);
        setApiError(null);
        const info = await fetchUserInfo();
        setUserInfo(info);
        setAvatarUrl(info.avatar || "");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "获取用户信息失败";
        setApiError(errorMessage);
      } finally {
        setApiLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // 发送验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 加载操作日志
  const loadOperationLogs = useCallback(() => {
    // 模拟操作日志数据 - 用于展示用户在系统中的操作记录
    const mockLogs: OperationLog[] = [
      {
        id: "1",
        time: dayjs().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss"),
        module: "政策中心",
        type: "查询",
        content: "查看政策详情：中小企业数字化转型促进政策",
        result: "success",
        ip: "192.168.1.100",
      },
      {
        id: "2",
        time: dayjs().subtract(3, "hour").format("YYYY-MM-DD HH:mm:ss"),
        module: "我的申报",
        type: "修改",
        content: "更新申报材料：高新技术企业认定申请书",
        result: "success",
        ip: "192.168.1.100",
      },
      {
        id: "3",
        time: dayjs().subtract(5, "hour").format("YYYY-MM-DD HH:mm:ss"),
        module: "商机大厅",
        type: "新增",
        content: "发布供应信息：智能制造设备",
        result: "success",
        ip: "192.168.1.100",
      },
      {
        id: "4",
        time: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        module: "融资诊断",
        type: "查询",
        content: "提交融资诊断申请",
        result: "success",
        ip: "192.168.1.100",
      },
      {
        id: "5",
        time: dayjs().subtract(2, "day").format("YYYY-MM-DD HH:mm:ss"),
        module: "系统管理",
        type: "修改",
        content: "尝试修改用户权限",
        result: "failed",
        ip: "192.168.1.100",
        failReason: "权限不足",
      },
      {
        id: "6",
        time: dayjs().subtract(10, "day").format("YYYY-MM-DD HH:mm:ss"),
        module: "法律护航",
        type: "查询",
        content: "查看合同模板",
        result: "success",
        ip: "192.168.1.100",
      },
      {
        id: "7",
        time: dayjs().subtract(15, "day").format("YYYY-MM-DD HH:mm:ss"),
        module: "政策中心",
        type: "删除",
        content: "删除收藏的政策",
        result: "success",
        ip: "192.168.1.100",
      },
    ];

    // 根据筛选条件过滤数据
    let filteredLogs = [...mockLogs];

    // 按时间范围筛选
    if (logFilter.dateRange === "recent7") {
      const sevenDaysAgo = dayjs().subtract(7, "day");
      filteredLogs = filteredLogs.filter((log) =>
        dayjs(log.time).isAfter(sevenDaysAgo),
      );
    } else if (logFilter.dateRange === "recent30") {
      const thirtyDaysAgo = dayjs().subtract(30, "day");
      filteredLogs = filteredLogs.filter((log) =>
        dayjs(log.time).isAfter(thirtyDaysAgo),
      );
    }

    // 按模块筛选
    if (logFilter.module !== "all") {
      const targetModule = moduleMap[logFilter.module];
      if (targetModule) {
        filteredLogs = filteredLogs.filter(
          (log) => log.module === targetModule,
        );
      }
    }

    // 按操作类型筛选
    if (logFilter.type !== "all") {
      const targetType = typeMap[logFilter.type];
      if (targetType) {
        filteredLogs = filteredLogs.filter((log) => log.type === targetType);
      }
    }

    setOperationLogs(filteredLogs);
  }, [logFilter]);

  useEffect(() => {
    loadOperationLogs();
  }, [loadOperationLogs]);

  // 用户退出处理
  const handleLogout = useCallback(() => {
    logout();
    window.location.href = "/login";
  }, []);

  // 头像上传
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("只能上传图片文件！");
        return false;
      }
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("只支持 JPG/PNG 格式的图片！");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过 2MB！");
        return false;
      }

      try {
        setLoading(true);
        const result = await uploadAvatar(file);
        setAvatarUrl(result.avatarUrl);
        if (userInfo) {
          setUserInfo({ ...userInfo, avatar: result.avatarUrl });
        }
        await refreshUser();
        message.success("头像上传成功！");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "头像上传失败，请重试！";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }

      return false;
    },
    [userInfo, refreshUser],
  );

  // 打开修改手机号弹窗
  const handleEditPhone = useCallback(() => {
    phoneForm.resetFields();
    setPhoneModalVisible(true);
  }, [phoneForm]);

  // 发送手机验证码
  const handleSendPhoneCode = useCallback(async () => {
    try {
      const phone = phoneForm.getFieldValue("newPhone");
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        message.error("请输入有效的手机号");
        return;
      }
      setSendingCode(true);
      await sendPhoneCode(phone);
      message.success("验证码已发送");
      setCountdown(60);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "发送验证码失败";
      message.error(errorMessage);
    } finally {
      setSendingCode(false);
    }
  }, [phoneForm]);

  // 提交修改手机号
  const handleSubmitPhone = useCallback(async () => {
    try {
      const values = await phoneForm.validateFields();
      setLoading(true);
      await updateUserPhone(values.newPhone, values.code);
      if (userInfo) {
        setUserInfo({ ...userInfo, phone: values.newPhone });
      }
      await refreshUser();
      message.success("手机号修改成功！");
      setPhoneModalVisible(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "修改手机号失败";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [phoneForm, userInfo, refreshUser]);

  // 打开修改昵称弹窗
  const handleEditNickname = useCallback(() => {
    nicknameForm.setFieldsValue({ nickName: userInfo?.nickName });
    setNicknameModalVisible(true);
  }, [nicknameForm, userInfo]);

  // 提交修改昵称
  const handleSubmitNickname = useCallback(async () => {
    try {
      const values = await nicknameForm.validateFields();
      setLoading(true);
      await updateUserProfile({ nickName: values.nickName });
      if (userInfo) {
        setUserInfo({ ...userInfo, nickName: values.nickName });
      }
      await refreshUser();
      message.success("昵称修改成功！");
      setNicknameModalVisible(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "修改昵称失败";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [nicknameForm, userInfo, refreshUser]);

  // 修改密码
  const handleChangePassword = useCallback(
    async (values: { oldPassword: string; newPassword: string }) => {
      setLoading(true);
      try {
        await updateUserPassword(values.oldPassword, values.newPassword);
        message.success("密码修改成功！请重新登录");
        passwordForm.resetFields();

        setTimeout(() => {
          logout();
          navigate("/login");
        }, 1500);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "密码修改失败，请重试！";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [passwordForm, navigate],
  );

  // 查看操作日志详情
  const viewLogDetail = useCallback((log: OperationLog) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  }, []);

  // 删除操作日志 (模拟删除 - 仅前端本地删除，实际应该调用后端接口)
  const handleDeleteLog = useCallback((id: string) => {
    // 从本地状态中移除日志 - 实际应该调用后端删除接口
    setOperationLogs((prev) => prev.filter((log) => log.id !== id));
    message.success("日志删除成功！");
  }, []);

  // 保存通知设置
  const handleSaveNotificationSettings = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用延迟 - 实际应该调用后端接口保存通知设置
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success("通知设置已保存！");
    } catch (error) {
      message.error("保存失败，请重试！");
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存模块偏好
  const handleSaveModulePreferences = useCallback(async () => {
    setLoading(true);
    try {
      // 保存到本地存储 - 实际应该同步到后端
      StorageUtils.setItem("modulePreferences", modulePreferences);
      StorageUtils.setItem("defaultHomePage", defaultHomePage);
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 300));
      message.success("模块偏好已保存！");
    } catch (error) {
      message.error("保存失败，请重试！");
    } finally {
      setLoading(false);
    }
  }, [modulePreferences, defaultHomePage]);

  return {
    // 表单
    form,
    passwordForm,
    phoneForm,
    nicknameForm,
    // 状态
    loading,
    avatarUrl,
    activeTab,
    setActiveTab,
    userInfo,
    apiLoading,
    apiError,
    // 操作日志
    operationLogs,
    logFilter,
    setLogFilter,
    selectedLog,
    logDetailVisible,
    setLogDetailVisible,
    // 通知设置
    notificationSettings,
    setNotificationSettings,
    quietHours,
    setQuietHours,
    // 模块偏好
    modulePreferences,
    setModulePreferences,
    defaultHomePage,
    setDefaultHomePage,
    // 手机号修改
    phoneModalVisible,
    setPhoneModalVisible,
    sendingCode,
    countdown,
    // 昵称修改
    nicknameModalVisible,
    setNicknameModalVisible,
    // 方法
    handleLogout,
    handleAvatarUpload,
    handleEditPhone,
    handleSendPhoneCode,
    handleSubmitPhone,
    handleEditNickname,
    handleSubmitNickname,
    handleDeleteLog,
    handleChangePassword,
    viewLogDetail,
    handleSaveNotificationSettings,
    handleSaveModulePreferences,
  };
}
