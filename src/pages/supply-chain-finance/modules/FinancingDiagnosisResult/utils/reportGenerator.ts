/**
 * PDF报告生成工具
 * 创建时间: 2026-01-13
 */

import html2pdf from "html2pdf.js";

// 生成PDF报告
export function generatePDFReport(): void {
  const currentDate = new Date().toLocaleDateString();
  const reportId = `FD${Date.now().toString().slice(-8)}`;
  const generateTime = new Date().toLocaleString();

  // 创建临时的HTML元素
  const element = document.createElement("div");
  element.innerHTML = getReportHTML(currentDate, reportId, generateTime);

  // 配置PDF选项
  const opt = {
    margin: 0.5,
    filename: `融资诊断分析报告_${currentDate.replace(/\//g, "")}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait" as const,
    },
  };

  // 生成PDF并下载
  html2pdf().set(opt).from(element).save();
}

// 获取报告HTML内容
function getReportHTML(
  currentDate: string,
  reportId: string,
  generateTime: string
): string {
  return `
    <div style="font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1890ff; padding-bottom: 15px;">
        <h1 style="color: #1890ff; margin: 0; font-size: 20px; font-weight: bold;">某制造企业有限公司 融资诊断分析报告</h1>
        <p style="color: #666; margin: 8px 0 0 0; font-size: 12px;">报告生成时间：${currentDate} | 报告有效期：30天</p>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">一、报告基础信息</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px;">
          <div><span style="font-weight: bold; color: #1890ff;">企业名称：</span>某制造企业有限公司</div>
          <div><span style="font-weight: bold; color: #1890ff;">统一社会信用代码：</span>91110000MA01****XX</div>
          <div><span style="font-weight: bold; color: #1890ff;">所属行业：</span>制造业</div>
          <div><span style="font-weight: bold; color: #1890ff;">成立时间：</span>2018年3月</div>
          <div><span style="font-weight: bold; color: #1890ff;">企业规模：</span>中型企业</div>
          <div><span style="font-weight: bold; color: #1890ff;">数据来源：</span>企业填报 + 系统关联数据</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">二、融资需求分析</div>
        <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">企业申报的融资需求：</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
          <div><span style="font-weight: bold; color: #1890ff;">融资金额：</span>100-200万元</div>
          <div><span style="font-weight: bold; color: #1890ff;">融资用途：</span>采购原材料、补充流动资金</div>
          <div><span style="font-weight: bold; color: #1890ff;">期望期限：</span>3-6个月</div>
          <div><span style="font-weight: bold; color: #1890ff;">可接受利率：</span>≤8.5%</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">三、企业融资资质画像</div>
        <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">财务状况（近1年核心数据）：</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
          <div><span style="font-weight: bold; color: #1890ff;">年营业收入：</span>2,800万元</div>
          <div><span style="font-weight: bold; color: #1890ff;">净利润：</span>280万元</div>
          <div><span style="font-weight: bold; color: #1890ff;">资产负债率：</span>65%</div>
          <div><span style="font-weight: bold; color: #1890ff;">现金流情况：</span>经营性现金流净额为正</div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">四、融资风险评估</div>
        <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #f6ffed; border-left: 4px solid #52c41a; font-size: 12px;">
          <strong>信用风险：低风险</strong><br>无不良征信记录，企业信用状况良好
        </div>
        <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #fff7e6; border-left: 4px solid #faad14; font-size: 12px;">
          <strong>财务风险：中风险</strong><br>资产负债率略高于行业均值，需关注资金流动性
        </div>
        <div style="padding: 10px; margin: 6px 0; border-radius: 4px; background: #f6ffed; border-left: 4px solid #52c41a; font-size: 12px;">
          <strong>经营风险：低风险</strong><br>主营业务营收稳定，经营状况良好
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="background: #f0f8ff; padding: 10px 15px; border-left: 4px solid #1890ff; font-size: 14px; font-weight: bold; margin-bottom: 12px;">五、适配融资方案匹配</div>
        <h4 style="color: #1890ff; margin: 15px 0 8px 0; font-size: 13px;">推荐方案：供应链金融-应收账款融资</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; margin-bottom: 15px;">
          <div><span style="font-weight: bold; color: #1890ff;">产品类型：</span>供应链类融资</div>
          <div><span style="font-weight: bold; color: #1890ff;">适配额度：</span>100-200万元</div>
          <div><span style="font-weight: bold; color: #1890ff;">利率范围：</span>6.5%-8.5%</div>
          <div><span style="font-weight: bold; color: #1890ff;">期限范围：</span>3-6个月</div>
          <div><span style="font-weight: bold; color: #1890ff;">申请通过率：</span>85%</div>
          <div><span style="font-weight: bold; color: #1890ff;">办理机构：</span>工商银行</div>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 10px; border-top: 1px solid #ddd; padding-top: 15px;">
        <p>本报告由璟智通融资诊断系统生成 | 报告编号：${reportId} | 生成时间：${generateTime}</p>
        <p>注：本报告基于企业提供的信息和公开数据分析生成，仅供参考，不构成投资建议</p>
      </div>
    </div>
  `;
}
