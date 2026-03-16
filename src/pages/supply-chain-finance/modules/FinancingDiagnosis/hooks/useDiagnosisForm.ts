/**
 * 融资诊断表单Hook
 * 创建时间: 2026-01-13
 */

import { useCallback, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { FormData } from "../types";
import { STORAGE_KEYS } from "../config";

export function useDiagnosisForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormData>();

  // 保存草稿
  const saveDraft = useCallback(() => {
    const formData = form.getFieldsValue();
    localStorage.setItem(
      STORAGE_KEYS.DRAFT,
      JSON.stringify({
        ...formData,
        saveTime: new Date().toISOString(),
      })
    );
    message.success("草稿已保存");
  }, [form]);

  // 提交表单
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      // 保存表单数据到localStorage，供结果页面使用
      localStorage.setItem(
        STORAGE_KEYS.DATA,
        JSON.stringify({
          ...values,
          submitTime: new Date().toISOString(),
        })
      );

      message.success("诊断完成，正在生成报告...");

      // 跳转到结果页面
      setTimeout(() => {
        navigate("/supply-chain-finance/diagnosis-report");
      }, 1500);
    } catch {
      message.error("请完善必填信息");
    }
  }, [form, navigate]);

  // 加载草稿数据
  useEffect(() => {
    const draftData = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (draftData) {
      try {
        const data = JSON.parse(draftData);
        form.setFieldsValue(data);
        message.info("已加载草稿数据");
      } catch (error) {
        console.error("加载草稿失败:", error);
      }
    }
  }, [form]);

  return {
    form,
    saveDraft,
    handleSubmit,
  };
}
