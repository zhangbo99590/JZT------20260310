/**
 * 首页企业画像引导与认证模块
 * 创建时间: 2026-03-17
 * 功能: 
 * 1. 引导企业用户完善核心画像信息
 * 2. 提供企业认证入口与邀请机制
 * 3. 基于画像提供智能推荐
 */

import React, { useState } from 'react';
import { Button, Typography, message } from 'antd';
import { 
  RightOutlined, 
  ExclamationCircleFilled,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCompanyProfileContext } from '../../../context/CompanyProfileContext';
import QuickProfileEditModal from './QuickProfileEditModal';
import { CompanyProfile } from '../../system/CompanyManagement/types';
import { EnterpriseCertificationModal } from './EnterpriseCertificationModal';

const { Title, Text } = Typography;

interface EnterpriseGuideSectionProps {
  loading?: boolean;
}

export const EnterpriseGuideSection: React.FC<EnterpriseGuideSectionProps> = ({ loading = false }) => {
  const navigate = useNavigate();
  const { profile, updateProfile, loading: contextLoading } = useCompanyProfileContext();
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editForm, setEditForm] = useState<Partial<CompanyProfile>>({});
  
  // Certification Modal State
  const [certifyModalVisible, setCertifyModalVisible] = useState(false);

  const handleOpenEdit = () => {
    // Cast context profile to component profile type if needed, or assume they are compatible
    // Since we updated types/index.ts, they should be compatible.
    setEditForm({ ...profile } as unknown as Partial<CompanyProfile>);
    setEditMode(true);
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleSave = () => {
    updateProfile(editForm as any); // Update context
    setModalVisible(false);
    message.success('企业画像已更新');
  };

  return (
    <div style={{ marginBottom: 24, display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* 企业画像引导 */}
        <div
          style={{
            flex: 1,
            minWidth: '300px',
            backgroundColor: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: '8px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div style={{ color: '#faad14', fontSize: '24px', lineHeight: 1 }}>
            <ExclamationCircleFilled />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.88)' }}>
                完善企业画像，获取精准推荐
              </span>
              <Button type="primary" onClick={handleOpenEdit} style={{ borderRadius: '4px' }}>
                立即完善 <RightOutlined />
              </Button>
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
              当前企业信息完善度仅为 <strong>{profile.completeness}%</strong>。完善企业标签与资质信息后，系统将为您提供更精准的政策匹配、供需对接与金融服务。
            </div>
          </div>
        </div>

        {/* 企业未认证时，展示认证引导 */}
        {!profile.isVerified && (
          <div
            style={{
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '8px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div style={{ color: '#1890ff', fontSize: '24px', lineHeight: 1 }}>
              <SafetyCertificateOutlined />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.88)' }}>
                  首次登录，请完成企业实名认证
                </span>
                <Button type="primary" onClick={() => setCertifyModalVisible(true)} style={{ borderRadius: '4px' }}>
                  立即认证 <RightOutlined />
                </Button>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
                完成认证后，您将成为企业<strong>超级管理员</strong>，并可生成专属<strong>邀请码</strong>，用于邀请企业员工注册并加入平台。
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 使用新的 QuickProfileEditModal */}
      <QuickProfileEditModal
        visible={modalVisible}
        editMode={editMode}
        loading={contextLoading}
        companyProfile={profile as unknown as CompanyProfile}
        editForm={editForm}
        currentStep={currentStep}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onCancelEdit={() => setModalVisible(false)}
        onEditModeChange={setEditMode}
        onStepChange={setCurrentStep}
        onFormChange={setEditForm}
      />

      {/* 企业实名认证弹窗 */}
      <EnterpriseCertificationModal 
        visible={certifyModalVisible}
        onCancel={() => setCertifyModalVisible(false)}
        onSuccess={() => {
          // 可选的认证成功后的额外逻辑
        }}
      />
    </div>
  );
};
