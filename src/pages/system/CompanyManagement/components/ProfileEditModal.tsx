/**
 * 企业画像编辑弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Tag,
  Divider,
  Steps,
} from "antd";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { CompanyProfile } from "../types/index.ts";
import {
  industryOptions,
  scaleOptions,
  companyTypeOptions,
  qualificationOptions,
  certificationOptions,
} from "../config/mockData.ts";

const { Title, Text } = Typography;
const { Option } = Select;

interface ProfileEditModalProps {
  visible: boolean;
  editMode: boolean;
  loading: boolean;
  companyProfile: CompanyProfile | null;
  editForm: Partial<CompanyProfile>;
  currentStep: number;
  onClose: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onEditModeChange: (mode: boolean) => void;
  onStepChange: (step: number) => void;
  onFormChange: (form: Partial<CompanyProfile>) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  editMode,
  loading,
  companyProfile,
  editForm,
  currentStep,
  onClose,
  onSave,
  onCancelEdit,
  onEditModeChange,
  onStepChange,
  onFormChange,
}) => {
  if (!companyProfile) return null;

  // 渲染基础信息步骤
  const renderBasicInfoStep = () => (
    <>
      <Title level={4}>基础信息</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text type="secondary">企业名称 *</Text>
          {editMode ? (
            <Input
              value={editForm.companyName}
              onChange={(e) =>
                onFormChange({ ...editForm, companyName: e.target.value })
              }
              placeholder="请输入企业名称"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.companyName}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">统一社会信用代码 *</Text>
          {editMode ? (
            <Input
              value={editForm.creditCode}
              onChange={(e) =>
                onFormChange({ ...editForm, creditCode: e.target.value })
              }
              placeholder="请输入信用代码"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.creditCode}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">法定代表人 *</Text>
          {editMode ? (
            <Input
              value={editForm.legalPerson}
              onChange={(e) =>
                onFormChange({ ...editForm, legalPerson: e.target.value })
              }
              placeholder="请输入法人姓名"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.legalPerson}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">注册资本 *</Text>
          {editMode ? (
            <Input
              value={editForm.registeredCapital}
              onChange={(e) =>
                onFormChange({ ...editForm, registeredCapital: e.target.value })
              }
              placeholder="如：1000万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.registeredCapital}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">成立日期 *</Text>
          {editMode ? (
            <Input
              value={editForm.establishDate}
              onChange={(e) =>
                onFormChange({ ...editForm, establishDate: e.target.value })
              }
              placeholder="如：2018-03-15"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.establishDate}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">行业分类 *</Text>
          {editMode ? (
            <Select
              value={editForm.industry}
              onChange={(value) =>
                onFormChange({ ...editForm, industry: value })
              }
              placeholder="请选择行业"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {industryOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.industry}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">企业规模 *</Text>
          {editMode ? (
            <Select
              value={editForm.scale}
              onChange={(value) => onFormChange({ ...editForm, scale: value })}
              placeholder="请选择规模"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {scaleOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.scale}
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">企业类型 *</Text>
          {editMode ? (
            <Select
              value={editForm.companyType}
              onChange={(value) =>
                onFormChange({ ...editForm, companyType: value })
              }
              placeholder="请选择类型"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {companyTypeOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.companyType}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Text type="secondary">注册地址 *</Text>
          {editMode ? (
            <Input
              value={editForm.address}
              onChange={(e) =>
                onFormChange({ ...editForm, address: e.target.value })
              }
              placeholder="请输入注册地址"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.address}
            </div>
          )}
        </Col>
      </Row>
    </>
  );

  // 渲染财务信息步骤
  const renderFinanceStep = () => (
    <>
      <Divider />
      <Title level={4}>财务数据</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Text type="secondary">年度营收 *</Text>
          {editMode ? (
            <Input
              value={editForm.revenue}
              onChange={(e) =>
                onFormChange({ ...editForm, revenue: e.target.value })
              }
              placeholder="如：5000万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.revenue}
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">年度利润 *</Text>
          {editMode ? (
            <Input
              value={editForm.profit}
              onChange={(e) =>
                onFormChange({ ...editForm, profit: e.target.value })
              }
              placeholder="如：800万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.profit}
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">年度纳税额 *</Text>
          {editMode ? (
            <Input
              value={editForm.taxAmount}
              onChange={(e) =>
                onFormChange({ ...editForm, taxAmount: e.target.value })
              }
              placeholder="如：150万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.taxAmount}
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">总资产 *</Text>
          {editMode ? (
            <Input
              value={editForm.assets}
              onChange={(e) =>
                onFormChange({ ...editForm, assets: e.target.value })
              }
              placeholder="如：3000万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.assets}
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>研发数据</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Text type="secondary">研发投入金额 *</Text>
          {editMode ? (
            <Input
              value={editForm.rdInvestment}
              onChange={(e) =>
                onFormChange({ ...editForm, rdInvestment: e.target.value })
              }
              placeholder="如：500万元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.rdInvestment}
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">研发投入占比 *</Text>
          {editMode ? (
            <Input
              value={editForm.rdRatio}
              onChange={(e) =>
                onFormChange({ ...editForm, rdRatio: e.target.value })
              }
              placeholder="如：10%"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.rdRatio}
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">研发人员数量 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.rdPersonnel}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  rdPersonnel: parseInt(e.target.value) || 0,
                })
              }
              placeholder="人数"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.rdPersonnel} 人
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">研发项目数量 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.rdProjects}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  rdProjects: parseInt(e.target.value) || 0,
                })
              }
              placeholder="项目数"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.rdProjects} 个
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>知识产权</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Text type="secondary">专利总数 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.patents}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  patents: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.patents} 项
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">发明专利 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.inventionPatents}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  inventionPatents: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.inventionPatents} 项
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">软件著作权 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.softwareCopyrights}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  softwareCopyrights: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.softwareCopyrights} 项
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">商标数量 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.trademarks}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  trademarks: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.trademarks} 个
            </div>
          )}
        </Col>
        <Col span={6}>
          <Text type="secondary">科技成果转化 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.achievements}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  achievements: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.achievements} 项
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>人员信息</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text type="secondary">员工总数 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.totalEmployees}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  totalEmployees: parseInt(e.target.value) || 0,
                })
              }
              placeholder="人数"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.totalEmployees} 人
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">技术人员数量 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.technicalPersonnel}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  technicalPersonnel: parseInt(e.target.value) || 0,
                })
              }
              placeholder="人数"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.technicalPersonnel} 人
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">本科及以上学历 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.bachelorAbove}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  bachelorAbove: parseInt(e.target.value) || 0,
                })
              }
              placeholder="人数"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.bachelorAbove} 人
            </div>
          )}
        </Col>
      </Row>
    </>
  );

  // 渲染资质信息步骤
  const renderQualificationStep = () => (
    <>
      <Divider />
      <Title level={4}>资质认证</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text type="secondary">企业资质</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.qualifications}
              onChange={(value) =>
                onFormChange({ ...editForm, qualifications: value })
              }
              placeholder="请选择或输入资质"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {qualificationOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.qualifications?.map((q, i) => (
                <Tag key={i} color="blue">
                  {q}
                </Tag>
              )) || <Text type="secondary">暂无资质</Text>}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Text type="secondary">认证证书</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.certifications}
              onChange={(value) =>
                onFormChange({ ...editForm, certifications: value })
              }
              placeholder="请选择或输入认证"
              style={{ width: "100%", marginTop: "4px" }}
            >
              {certificationOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.certifications?.map((c, i) => (
                <Tag key={i} color="green">
                  {c}
                </Tag>
              )) || <Text type="secondary">暂无认证</Text>}
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>经营信息</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text type="secondary">主营业务 *</Text>
          {editMode ? (
            <Input.TextArea
              value={editForm.mainBusiness}
              onChange={(e) =>
                onFormChange({ ...editForm, mainBusiness: e.target.value })
              }
              placeholder="请输入主营业务"
              rows={2}
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              {companyProfile.mainBusiness}
            </div>
          )}
        </Col>
        <Col span={12}>
          <Text type="secondary">主要产品 *</Text>
          {editMode ? (
            <Input.TextArea
              value={editForm.mainProducts}
              onChange={(e) =>
                onFormChange({ ...editForm, mainProducts: e.target.value })
              }
              placeholder="请输入主要产品"
              rows={2}
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div style={{ fontSize: "14px", marginTop: "4px" }}>
              {companyProfile.mainProducts}
            </div>
          )}
        </Col>
        <Col span={12}>
          <Text type="secondary">市场占有率</Text>
          {editMode ? (
            <Input
              value={editForm.marketShare}
              onChange={(e) =>
                onFormChange({ ...editForm, marketShare: e.target.value })
              }
              placeholder="如：行业前10%"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.marketShare}
            </div>
          )}
        </Col>
        <Col span={12}>
          <Text type="secondary">出口额</Text>
          {editMode ? (
            <Input
              value={editForm.exportVolume}
              onChange={(e) =>
                onFormChange({ ...editForm, exportVolume: e.target.value })
              }
              placeholder="如：200万美元"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.exportVolume}
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>项目经验</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text type="secondary">已完成项目数 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.completedProjects}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  completedProjects: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.completedProjects} 个
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">在研项目数 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.ongoingProjects}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  ongoingProjects: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.ongoingProjects} 个
            </div>
          )}
        </Col>
        <Col span={8}>
          <Text type="secondary">政府项目数 *</Text>
          {editMode ? (
            <Input
              type="number"
              value={editForm.governmentProjects}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  governmentProjects: parseInt(e.target.value) || 0,
                })
              }
              placeholder="数量"
              style={{ marginTop: "4px" }}
            />
          ) : (
            <div
              style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}
            >
              {companyProfile.governmentProjects} 个
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>荣誉奖项</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text type="secondary">获得奖项</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.awards}
              onChange={(value) => onFormChange({ ...editForm, awards: value })}
              placeholder="请输入获得的奖项"
              style={{ width: "100%", marginTop: "4px" }}
            />
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.awards?.map((a, i) => (
                <Tag key={i} color="gold">
                  {a}
                </Tag>
              )) || <Text type="secondary">暂无奖项</Text>}
            </div>
          )}
        </Col>
      </Row>
    </>
  );

  // 渲染动态标签步骤 (新增)
  const renderTagsStep = () => (
    <>
      <Divider />
      <Title level={4}>动态画像标签</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text type="secondary">行为标签 (如：搜索裁员、关注研发补贴)</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.behaviorTags}
              onChange={(value) =>
                onFormChange({ ...editForm, behaviorTags: value })
              }
              placeholder="输入或选择行为标签"
              style={{ width: "100%", marginTop: "4px" }}
            >
              <Option value="搜索裁员">搜索裁员</Option>
              <Option value="关注研发补贴">关注研发补贴</Option>
              <Option value="高频访问政策库">高频访问政策库</Option>
            </Select>
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.behaviorTags?.map((t, i) => (
                <Tag key={i} color="geekblue">
                  {t}
                </Tag>
              )) || <Text type="secondary">暂无行为标签</Text>}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Text type="secondary">业务状态 (如：近期中标、新增专利)</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.businessStatus}
              onChange={(value) =>
                onFormChange({ ...editForm, businessStatus: value })
              }
              placeholder="输入或选择业务状态"
              style={{ width: "100%", marginTop: "4px" }}
            >
              <Option value="近期中标">近期中标</Option>
              <Option value="新增专利">新增专利</Option>
              <Option value="发生融资">发生融资</Option>
              <Option value="主要人员变更">主要人员变更</Option>
            </Select>
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.businessStatus?.map((t, i) => (
                <Tag key={i} color="purple">
                  {t}
                </Tag>
              )) || <Text type="secondary">暂无业务状态</Text>}
            </div>
          )}
        </Col>
      </Row>

      <Divider />
      <Title level={4}>分层标签体系</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text type="secondary">L1 基础标签 (行业、规模)</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.tags?.l1}
              onChange={(value) =>
                onFormChange({
                  ...editForm,
                  tags: { ...editForm.tags!, l1: value },
                })
              }
              placeholder="输入基础标签"
              style={{ width: "100%", marginTop: "4px" }}
            />
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.tags?.l1?.map((t, i) => (
                <Tag key={i} color="cyan">
                  {t}
                </Tag>
              )) || <Text type="secondary">暂无基础标签</Text>}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Text type="secondary">L2 资质标签 (高新、专精特新)</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.tags?.l2}
              onChange={(value) =>
                onFormChange({
                  ...editForm,
                  tags: { ...editForm.tags!, l2: value },
                })
              }
              placeholder="输入资质标签"
              style={{ width: "100%", marginTop: "4px" }}
            />
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.tags?.l2?.map((t, i) => (
                <Tag key={i} color="volcano">
                  {t}
                </Tag>
              )) || <Text type="secondary">暂无资质标签</Text>}
            </div>
          )}
        </Col>
        <Col span={24}>
          <Text type="secondary">L3 意向标签 (融资偏好、采购意向)</Text>
          {editMode ? (
            <Select
              mode="tags"
              value={editForm.tags?.l3}
              onChange={(value) =>
                onFormChange({
                  ...editForm,
                  tags: { ...editForm.tags!, l3: value },
                })
              }
              placeholder="输入意向标签"
              style={{ width: "100%", marginTop: "4px" }}
            />
          ) : (
            <div style={{ marginTop: "4px" }}>
              {companyProfile.tags?.l3?.map((t, i) => (
                <Tag key={i} color="magenta">
                  {t}
                </Tag>
              )) || <Text type="secondary">暂无意向标签</Text>}
            </div>
          )}
        </Col>
      </Row>
    </>
  );

  // 构建 footer 按钮
  const buildFooter = () => {
    if (editMode) {
      const buttons = [
        <Button
          key="cancel"
          onClick={() => {
            onCancelEdit();
            onStepChange(0);
          }}
        >
          取消
        </Button>,
      ];
      if (currentStep > 0) {
        buttons.push(
          <Button key="prev" onClick={() => onStepChange(currentStep - 1)}>
            上一步
          </Button>,
        );
      }
      if (currentStep < 3) {
        buttons.push(
          <Button
            key="next"
            type="primary"
            onClick={() => onStepChange(currentStep + 1)}
          >
            下一步
          </Button>,
        );
      } else {
        buttons.push(
          <Button key="save" type="primary" loading={loading} onClick={onSave}>
            保存
          </Button>,
        );
      }
      return buttons;
    }
    return [
      <Button key="close" onClick={onClose}>
        关闭
      </Button>,
      <Button
        key="edit"
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEditModeChange(true)}
      >
        编辑
      </Button>,
    ];
  };

  return (
    <Modal
      title={editMode ? "编辑企业画像" : "企业画像详情"}
      open={visible}
      onCancel={onClose}
      footer={buildFooter()}
      width={1000}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <div>
        {/* 分步骤导航 */}
        {editMode && (
          <Steps
            current={currentStep}
            onChange={onStepChange}
            style={{ marginBottom: 24 }}
            items={[
              { title: "基础信息" },
              { title: "财务信息" },
              { title: "资质信息" },
              { title: "动态标签" },
            ]}
          />
        )}

        {/* 步骤1：基础信息 */}
        {(!editMode || currentStep === 0) && renderBasicInfoStep()}

        {/* 步骤2：财务信息 */}
        {(!editMode || currentStep === 1) && renderFinanceStep()}

        {/* 步骤3：资质信息 */}
        {(!editMode || currentStep === 2) && renderQualificationStep()}

        {/* 步骤4：动态标签 */}
        {(!editMode || currentStep === 3) && renderTagsStep()}

        <Divider />

        <div
          style={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#f0f8ff",
            borderRadius: "4px",
          }}
        >
          <InfoCircleOutlined
            style={{ color: "#1890ff", marginRight: "8px" }}
          />
          <Text type="secondary">
            {editMode
              ? "编辑模式：您可以修改企业画像信息，修改后将用于智能匹配政策"
              : "企业画像包含40+个字段，涵盖基础信息、财务、研发、知识产权、人员、资质、经营、项目、荣誉等全方位数据"}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;
