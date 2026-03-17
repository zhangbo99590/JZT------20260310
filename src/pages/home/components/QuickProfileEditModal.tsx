/**
 * 快速企业画像编辑弹窗组件
 * 创建时间: 2026-03-17
 * 说明: 用于首页等需要快速完善企业核心信息的场景
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
  Divider,
  Steps,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { CompanyProfile } from "../../system/CompanyManagement/types/index.ts";
import {
  industryOptions,
  scaleOptions,
  companyTypeOptions,
} from "../../system/CompanyManagement/config/mockData.ts";

const { Title, Text } = Typography;
const { Option } = Select;

interface QuickProfileEditModalProps {
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

const QuickProfileEditModal: React.FC<QuickProfileEditModalProps> = ({
  visible,
  editMode,
  loading,
  companyProfile,
  editForm,
  currentStep,
  onClose,
  onSave,
  onCancelEdit,
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
          <Input
            value={editForm.companyName}
            onChange={(e) =>
              onFormChange({ ...editForm, companyName: e.target.value })
            }
            placeholder="请输入企业名称"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={8}>
          <Text type="secondary">统一社会信用代码 *</Text>
          <Input
            value={editForm.creditCode}
            onChange={(e) =>
              onFormChange({ ...editForm, creditCode: e.target.value })
            }
            placeholder="请输入信用代码"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={8}>
          <Text type="secondary">法定代表人 *</Text>
          <Input
            value={editForm.legalPerson}
            onChange={(e) =>
              onFormChange({ ...editForm, legalPerson: e.target.value })
            }
            placeholder="请输入法人姓名"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={8}>
          <Text type="secondary">注册资本 *</Text>
          <Input
            value={editForm.registeredCapital}
            onChange={(e) =>
              onFormChange({ ...editForm, registeredCapital: e.target.value })
            }
            placeholder="如：1000万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={8}>
          <Text type="secondary">成立日期 *</Text>
          <Input
            value={editForm.establishDate}
            onChange={(e) =>
              onFormChange({ ...editForm, establishDate: e.target.value })
            }
            placeholder="如：2018-03-15"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={8}>
          <Text type="secondary">行业分类 *</Text>
          <Select
            value={editForm.industry}
            onChange={(value) => onFormChange({ ...editForm, industry: value })}
            placeholder="请选择行业"
            style={{ width: "100%", marginTop: "4px" }}
          >
            {industryOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Text type="secondary">企业规模 *</Text>
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
        </Col>
        <Col span={8}>
          <Text type="secondary">企业类型 *</Text>
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
        </Col>
        <Col span={24}>
          <Text type="secondary">注册地址 *</Text>
          <Input
            value={editForm.address}
            onChange={(e) =>
              onFormChange({ ...editForm, address: e.target.value })
            }
            placeholder="请输入注册地址"
            style={{ marginTop: "4px" }}
          />
        </Col>
      </Row>
    </>
  );

  // 渲染财务信息步骤
  const renderFinanceStep = () => (
    <>
      <Title level={4}>财务数据</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text type="secondary">年度营收 *</Text>
          <Input
            value={editForm.revenue}
            onChange={(e) =>
              onFormChange({ ...editForm, revenue: e.target.value })
            }
            placeholder="如：5000万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">年度利润 *</Text>
          <Input
            value={editForm.profit}
            onChange={(e) =>
              onFormChange({ ...editForm, profit: e.target.value })
            }
            placeholder="如：800万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">年度纳税额 *</Text>
          <Input
            value={editForm.taxAmount}
            onChange={(e) =>
              onFormChange({ ...editForm, taxAmount: e.target.value })
            }
            placeholder="如：150万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">总资产 *</Text>
          <Input
            value={editForm.assets}
            onChange={(e) =>
              onFormChange({ ...editForm, assets: e.target.value })
            }
            placeholder="如：3000万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
      </Row>

      <Divider />
      <Title level={4}>研发数据</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Text type="secondary">研发投入金额 *</Text>
          <Input
            value={editForm.rdInvestment}
            onChange={(e) =>
              onFormChange({ ...editForm, rdInvestment: e.target.value })
            }
            placeholder="如：500万元"
            style={{ marginTop: "4px" }}
          />
        </Col>
        <Col span={12}>
          <Text type="secondary">研发投入占比 *</Text>
          <Input
            value={editForm.rdRatio}
            onChange={(e) =>
              onFormChange({ ...editForm, rdRatio: e.target.value })
            }
            placeholder="如：10%"
            style={{ marginTop: "4px" }}
          />
        </Col>
      </Row>
    </>
  );

  // 构建 footer 按钮
  const buildFooter = () => {
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
        </Button>
      );
    }
    if (currentStep < 1) {
      buttons.push(
        <Button
          key="next"
          type="primary"
          onClick={() => onStepChange(currentStep + 1)}
        >
          下一步
        </Button>
      );
    } else {
      buttons.push(
        <Button key="save" type="primary" loading={loading} onClick={onSave}>
          保存并提交
        </Button>
      );
    }
    return buttons;
  };

  return (
    <Modal
      title="快速完善企业画像"
      open={visible}
      onCancel={onClose}
      footer={buildFooter()}
      width={800}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <div>
        {/* 分步骤导航 */}
        <Steps
          current={currentStep}
          onChange={onStepChange}
          style={{ marginBottom: 24 }}
          items={[
            { title: "基础信息" },
            { title: "财务信息" },
          ]}
        />

        {/* 步骤1：基础信息 */}
        {currentStep === 0 && renderBasicInfoStep()}

        {/* 步骤2：财务信息 */}
        {currentStep === 1 && renderFinanceStep()}

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
            快速完善基础与财务信息，即可解锁精准的政策匹配服务。
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default QuickProfileEditModal;
