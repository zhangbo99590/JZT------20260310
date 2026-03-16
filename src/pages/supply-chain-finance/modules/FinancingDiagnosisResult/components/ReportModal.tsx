/**
 * 诊断报告弹窗组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Divider,
  Alert,
  Tag,
  Typography,
  Button,
  message,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { generatePDFReport } from "../utils/reportGenerator";

const { Title, Text } = Typography;

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose }) => {
  const handleDownload = () => {
    message.loading("正在生成PDF报告...", 3);
    setTimeout(() => {
      try {
        generatePDFReport();
        message.success("PDF报告下载成功！");
      } catch (error) {
        console.error("PDF生成错误:", error);
        message.error("报告生成失败，请重试");
      }
    }, 1000);
  };

  return (
    <Modal
      title="融资诊断分析报告"
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={handleDownload}
        >
          下载PDF报告
        </Button>,
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <div style={{ maxHeight: "70vh", overflow: "auto", padding: "16px 0" }}>
        {/* 报告基础信息 */}
        <Card title="一、报告基础信息" style={{ marginBottom: "16px" }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>
                <Text strong>报告名称：</Text>某制造企业有限公司
                融资诊断分析报告
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>企业名称：</Text>某制造企业有限公司
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>统一社会信用代码：</Text>91110000MA01****XX
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>所属行业：</Text>制造业
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>成立时间：</Text>2018年3月
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>企业规模：</Text>中型企业
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>报告生成时间：</Text>
                {new Date().toLocaleDateString()}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong>报告有效期：</Text>30天（基于当前企业数据）
              </div>
            </Col>
          </Row>
        </Card>

        {/* 融资需求分析 */}
        <Card title="二、融资需求分析" style={{ marginBottom: "16px" }}>
          <Title level={5}>企业申报的融资需求：</Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>融资金额：</Text>100-200万元
            </Col>
            <Col span={12}>
              <Text strong>融资用途：</Text>采购原材料、补充流动资金
            </Col>
            <Col span={12}>
              <Text strong>期望期限：</Text>3-6个月
            </Col>
            <Col span={12}>
              <Text strong>可接受利率：</Text>≤8.5%
            </Col>
          </Row>
          <Divider />
          <Title level={5}>还款来源评估：</Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>核心还款来源：</Text>主营业务营收
            </Col>
            <Col span={12}>
              <Text strong>辅助还款来源：</Text>应收账款回款
            </Col>
          </Row>
        </Card>

        {/* 企业融资资质画像 */}
        <Card title="三、企业融资资质画像" style={{ marginBottom: "16px" }}>
          <Title level={5}>财务状况（近1年核心数据）：</Title>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <Text strong>年营业收入：</Text>2,800万元
            </Col>
            <Col span={8}>
              <Text strong>净利润：</Text>280万元
            </Col>
            <Col span={8}>
              <Text strong>资产负债率：</Text>65%
            </Col>
          </Row>
          <div style={{ marginTop: "8px" }}>
            <Text strong>现金流情况：</Text>经营性现金流净额为正
          </div>

          <Divider />
          <Title level={5}>信用状况：</Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>企业征信记录：</Text>无逾期、无不良信用记录
            </Col>
            <Col span={12}>
              <Text strong>企业资质认证：</Text>已获得高新技术企业认证
            </Col>
          </Row>

          <Divider />
          <Title level={5}>经营稳定性：</Title>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>核心业务占比：</Text>主营业务占比90%
            </Col>
            <Col span={12}>
              <Text strong>合作客户情况：</Text>长期合作客户≥5家
            </Col>
          </Row>
        </Card>

        {/* 融资风险评估 */}
        <Card title="四、融资风险评估" style={{ marginBottom: "16px" }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Alert
                message="信用风险"
                description="低风险，无不良征信记录"
                type="success"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="财务风险"
                description="中风险，资产负债率略高于行业均值"
                type="warning"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="经营风险"
                description="低风险，主营业务营收稳定"
                type="success"
                showIcon
              />
            </Col>
          </Row>
          <div style={{ marginTop: "16px" }}>
            <Text strong>综合风险等级：</Text>
            <Tag color="orange" style={{ marginLeft: "8px" }}>
              低-中风险
            </Tag>
          </div>
          <div style={{ marginTop: "8px" }}>
            <Text strong>风险说明：</Text>
            资产负债率65%，高于制造业平均50%的水平，建议优化资产结构
          </div>
        </Card>

        {/* 适配融资方案匹配 */}
        <Card title="五、适配融资方案匹配" style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Title level={5}>推荐方案：供应链金融-应收账款融资</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>产品类型：</Text>供应链类融资
              </Col>
              <Col span={12}>
                <Text strong>适配额度：</Text>100-200万元
              </Col>
              <Col span={12}>
                <Text strong>利率范围：</Text>6.5%-8.5%
              </Col>
              <Col span={12}>
                <Text strong>期限范围：</Text>3-6个月
              </Col>
              <Col span={12}>
                <Text strong>申请通过率：</Text>85%
              </Col>
              <Col span={12}>
                <Text strong>办理机构：</Text>工商银行
              </Col>
            </Row>

            <Divider />
            <Title level={5}>产品细节：</Title>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>核心优势：</Text>无需抵押、审批快（3个工作日）
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>申请条件：</Text>企业成立满1年、有稳定应收账款
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text strong>所需材料：</Text>
              营业执照、应收账款凭证、近3个月银行流水
            </div>
            <div>
              <Text strong>适配理由：</Text>
              额度、期限与企业需求高度匹配；无需抵押适配轻资产企业
            </div>
          </div>
        </Card>

        {/* 专业融资建议 */}
        <Card title="六、专业融资建议">
          <Alert
            message="优先推荐方案"
            description="供应链金融-应收账款融资，适配度最高"
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <Title level={5}>风险规避建议：</Title>
          <div style={{ marginBottom: "12px" }}>
            • 针对资产负债率略高的问题，可补充核心资产证明降低审核顾虑
          </div>
          <div style={{ marginBottom: "12px" }}>
            • 建议提供主要客户的合作协议，证明应收账款的稳定性
          </div>

          <Title level={5}>材料准备指南：</Title>
          <div style={{ marginBottom: "12px" }}>
            • 应收账款融资需提前准备"应收账款确认函"
          </div>
          <div style={{ marginBottom: "12px" }}>
            • 准备近6个月的银行流水和财务报表
          </div>
          <div>• 核心客户的合作协议和历史交易记录</div>
        </Card>
      </div>
    </Modal>
  );
};

export default ReportModal;
