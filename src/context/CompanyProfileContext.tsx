/**
 * 企业画像上下文
 * 创建时间: 2026-03-17
 * 功能: 统一管理企业画像数据，实现跨模块数据共享
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';

// 定义统一的企业画像数据模型
export interface CompanyProfile {
  id: string;
  // 基础信息
  companyName: string;
  creditCode: string;
  legalPerson: string;
  registeredCapital: string;
  establishDate: string;
  industry: string;
  scale: string;
  companyType: string;
  address: string;
  region: string;

  // 财务数据
  revenue: string;
  profit: string;
  taxAmount: string;
  assets: string;
  rdInvestment: string;
  rdRatio: string;

  // 知识产权
  patents: number;
  inventionPatents: number;
  softwareCopyrights: number;
  trademarks: number;

  // 资质认证
  qualifications: string[];
  certifications: string[];

  // 动态画像 (新增)
  behaviorTags: string[]; // 行为标签：如"搜索裁员"、"关注研发补贴"
  businessStatus: string[]; // 业务状态：如"近期中标"、"新增专利"
  
  // 标签体系 (新增)
  tags: {
    l1: string[]; // 基础标签：行业、规模
    l2: string[]; // 资质标签：高新、专精特新
    l3: string[]; // 意向标签：融资偏好、采购意向
  };

  // 系统信息
  isVerified: boolean;
  completeness: number; // 0-100
  lastSyncTime: string;
}

// 初始默认数据
export const defaultCompanyProfile: CompanyProfile = {
  id: "1",
  companyName: "未认证企业",
  creditCode: "",
  legalPerson: "",
  registeredCapital: "",
  establishDate: "",
  industry: "",
  scale: "",
  companyType: "",
  address: "",
  region: "",
  revenue: "",
  profit: "",
  taxAmount: "",
  assets: "",
  rdInvestment: "",
  rdRatio: "0",
  patents: 0,
  inventionPatents: 0,
  softwareCopyrights: 0,
  trademarks: 0,
  qualifications: [],
  certifications: [],
  behaviorTags: [],
  businessStatus: [],
  tags: {
    l1: [],
    l2: [],
    l3: []
  },
  isVerified: false,
  completeness: 30,
  lastSyncTime: "",
};

interface CompanyProfileContextType {
  profile: CompanyProfile;
  updateProfile: (newProfile: Partial<CompanyProfile>) => void;
  loading: boolean;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined);

export const CompanyProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [loading, setLoading] = useState(false);

  // 模拟从后端获取数据
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 尝试从本地存储获取，模拟持久化
        const savedProfile = localStorage.getItem('company_profile_data');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 更新画像数据
  const updateProfile = (newProfile: Partial<CompanyProfile>) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setProfile(prev => {
        const updated = { 
          ...prev, 
          ...newProfile,
          lastSyncTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
        };
        
        // 计算完善度
        let filledFields = 0;
        const totalFields = 20; // 关键字段数量增加

        // 基础信息 (5分)
        if (updated.companyName && updated.companyName !== '未认证企业') filledFields++;
        if (updated.creditCode) filledFields++;
        if (updated.industry) filledFields++;
        if (updated.scale) filledFields++;
        if (updated.region) filledFields++;

        // 财务/研发 (5分)
        if (updated.revenue) filledFields++;
        if (updated.taxAmount) filledFields++;
        if (updated.rdInvestment) filledFields++;
        if (updated.rdRatio && updated.rdRatio !== '0') filledFields++;
        if (updated.patents > 0) filledFields++;

        // 资质认证 (2分)
        if (updated.qualifications && updated.qualifications.length > 0) filledFields++;
        if (updated.certifications && updated.certifications.length > 0) filledFields++;

        // 动态画像 (3分)
        if (updated.behaviorTags && updated.behaviorTags.length > 0) filledFields++;
        if (updated.businessStatus && updated.businessStatus.length > 0) filledFields++;
        
        // 标签体系 (3分)
        if (updated.tags?.l1 && updated.tags.l1.length > 0) filledFields++;
        if (updated.tags?.l2 && updated.tags.l2.length > 0) filledFields++;
        if (updated.tags?.l3 && updated.tags.l3.length > 0) filledFields++;
        
        // 计算逻辑：基础分20 + (完成项/总项)*80
        // totalFields = 17 (above counts) -> Let's simplify
        // totalFields = 17. 
        // completeness = 20 + Math.round((filledFields / 17) * 80)
        
        updated.completeness = Math.min(100, 20 + Math.round((filledFields / 17) * 80));
        
        // 本地持久化
        localStorage.setItem('company_profile_data', JSON.stringify(updated));
        
        return updated;
      });
      setLoading(false);
      message.success('企业信息已同步更新');
    }, 500);
  };

  return (
    <CompanyProfileContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </CompanyProfileContext.Provider>
  );
};

export const useCompanyProfileContext = () => {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error('useCompanyProfileContext must be used within a CompanyProfileProvider');
  }
  return context;
};
