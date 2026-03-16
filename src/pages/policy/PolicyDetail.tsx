import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Layout,
  Breadcrumb,
  Typography,
  Button,
  Space,
  Avatar,
  List,
  Card,
  Input,
  Divider,
  Tag,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  ReloadOutlined,
  RightOutlined,
  ThunderboltFilled,
  DownloadOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Title, Text, Link: AntLink } = Typography;

// --- 用户提供的 Tailwind UI 组件 ---
const MainTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-[#111827] text-[28px] text-left mb-[25px] font-extrabold leading-[1.4]">
    {children}
  </h1>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-black text-[20px] text-left mt-[30px] mb-[15px] border-b-2 border-black pb-[8px] font-bold">
    {children}
  </h2>
);

const ContentText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`text-sm leading-[1.8] text-justify text-[#374151] whitespace-pre-wrap ${className}`}
  >
    {children}
  </div>
);

const ProcessStep = ({
  index,
  title,
  description,
  isLast,
}: {
  index: number;
  title: string;
  description: string;
  isLast: boolean;
}) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-6">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#be123c] text-white font-bold text-sm shrink-0 z-10">
        {index + 1}
      </div>
      {!isLast && <div className="w-[2px] bg-gray-200 flex-1 my-1"></div>}
    </div>
    <div className={`flex-1 ${!isLast ? "pb-8" : "pb-0"}`}>
      <h3 className="text-lg text-[#111827] mb-2 mt-0.5 text-left font-normal">
        {title}
      </h3>
      <ContentText className="text-left text-gray-600">
        {description}
      </ContentText>
    </div>
  </div>
);

const TableContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <table
    className={`w-full border-collapse mb-[20px] border border-[#e5e7eb] text-sm ${className}`}
  >
    {children}
  </table>
);

const TableHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`border border-[#e5e7eb] p-[12px] align-middle text-left bg-[#f9fafb] font-semibold text-[#111827] text-sm ${className}`}
  >
    {children}
  </th>
);

const TableLabelCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`border border-[#e5e7eb] p-[12px] align-middle text-left bg-[#f9fafb] font-semibold text-[#111827] whitespace-nowrap ${className}`}
  >
    {children}
  </td>
);

const TableValueCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`border border-[#e5e7eb] p-[12px] align-middle text-left ${className}`}
  >
    <ContentText className="text-left">{children}</ContentText>
  </td>
);

const RequiredTag = () => (
  <span className="text-[#dc2626] font-bold">【必须】</span>
);

const DownloadLink = ({
  children,
  href = "#",
}: {
  children: React.ReactNode;
  href?: string;
}) => (
  <a
    href={href}
    className="text-[#b91c1c] underline hover:text-[#991b1b] decoration-1 underline-offset-2"
  >
    {children}
  </a>
);

const SpecialInstructions = ({
  content,
  url,
}: {
  content?: string;
  url?: string;
}) => {
  if (!content) return null;
  return (
    <>
      <SectionTitle>特别说明</SectionTitle>
      {url ? (
        <ContentText className="mb-[10px]">
          <DownloadLink href={url}>{content}</DownloadLink>
        </ContentText>
      ) : (
        <ContentText className="mb-[10px]">{content}</ContentText>
      )}
    </>
  );
};

const BasicInfoTable = ({
  basicInfo,
  className = "",
}: {
  basicInfo: any;
  className?: string;
}) => (
  <TableContainer className={className}>
    <tbody>
      <tr>
        <TableLabelCell className="w-[15%]">实施主体名称</TableLabelCell>
        <TableValueCell className="w-[35%]">
          {basicInfo.implementationBody}
        </TableValueCell>
        <TableLabelCell className="w-[15%]">申领对象</TableLabelCell>
        <TableValueCell className="w-[35%]">{basicInfo.target}</TableValueCell>
      </tr>
      <tr>
        <TableLabelCell className="w-[15%]">到现场次数</TableLabelCell>
        <TableValueCell className="w-[35%]">{basicInfo.visits}</TableValueCell>
        <TableLabelCell className="w-[15%]">扶持金额</TableLabelCell>
        <TableValueCell className="w-[35%]">
          {basicInfo.supportAmount}
        </TableValueCell>
      </tr>
    </tbody>
  </TableContainer>
);

const ApplicationMaterialsTable = ({
  materials,
  className = "",
}: {
  materials: any[];
  className?: string;
}) => (
  <TableContainer className={className}>
    <thead>
      <tr>
        <TableHeader>序号</TableHeader>
        <TableHeader className="w-[40%]">材料名称</TableHeader>
        <TableHeader className="w-[20%] whitespace-nowrap">
          上传要求
        </TableHeader>
        <TableHeader className="w-[15%] text-[#333]">模版下载</TableHeader>
        <TableHeader className="w-[15%]">其他信息</TableHeader>
      </tr>
    </thead>
    <tbody>
      {materials.map((item) => (
        <tr
          key={item.id}
          className="transition-colors duration-200 hover:bg-[#f8f9fa]"
        >
          <TableValueCell>{item.id}</TableValueCell>
          <TableValueCell>
            {item.isRequired && <RequiredTag />} {item.name}
          </TableValueCell>
          <TableValueCell>
            {item.requirements.map((r: string, i: number) => (
              <ContentText
                key={i}
                className={`text-left ${
                  i < item.requirements.length - 1 ? "mb-[4px]" : ""
                }`}
              >
                {r}
              </ContentText>
            ))}
          </TableValueCell>
          <TableValueCell>
            {item.template && (
              <DownloadLink href={item.templateUrl}>
                {item.template}
              </DownloadLink>
            )}
          </TableValueCell>
          <TableValueCell>
            {item.guide && (
              <div className="group relative inline-block cursor-help text-[#b91c1c] underline decoration-1 underline-offset-2 hover:text-[#991b1b]">
                {item.guide}
                {item.guideDesc && (
                  <div className="absolute right-0 bottom-full mb-2 hidden w-48 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block z-10 text-left">
                    {item.guideDesc}
                    <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-gray-800"></div>
                  </div>
                )}
              </div>
            )}
          </TableValueCell>
        </tr>
      ))}
    </tbody>
  </TableContainer>
);

const ConsultationPhoneTable = ({
  consultationPhone,
  className = "",
}: {
  consultationPhone: any[];
  className?: string;
}) => (
  <TableContainer className={className}>
    <thead>
      <tr>
        <TableHeader>区划</TableHeader>
        <TableHeader>联系人</TableHeader>
        <TableHeader>联系方式</TableHeader>
      </tr>
    </thead>
    <tbody>
      {consultationPhone.map((item, index) => (
        <tr
          key={index}
          className="transition-colors duration-200 hover:bg-[#f8f9fa]"
        >
          <TableValueCell>{item.region}</TableValueCell>
          <TableValueCell>{item.contact}</TableValueCell>
          <TableValueCell>{item.phone}</TableValueCell>
        </tr>
      ))}
    </tbody>
  </TableContainer>
);

const PolicyContent = ({
  data,
  onApply,
}: {
  data: any;
  onApply: () => void;
}) => (
  <div className="min-h-screen bg-white text-[#333] font-sans text-sm leading-relaxed p-8 rounded-lg shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <MainTitle>{data.title}</MainTitle>
      <Button
        type="primary"
        size="large"
        onClick={onApply}
        className="shrink-0 ml-6"
        style={{
          background: "#1890ff",
          borderRadius: "4px",
          height: "40px",
          padding: "0 24px",
          fontSize: "14px",
        }}
      >
        我要申报
      </Button>
    </div>

    <SectionTitle>基本信息</SectionTitle>
    <BasicInfoTable basicInfo={data.basicInfo} />

    <SectionTitle>受理条件</SectionTitle>
    <ContentText className="mb-[10px]">{data.acceptanceConditions}</ContentText>

    <SectionTitle>事项描述</SectionTitle>
    <ContentText className="mb-[10px]">
      {data.itemDescription.summary}
    </ContentText>

    <SectionTitle>申报材料</SectionTitle>
    <ApplicationMaterialsTable materials={data.applicationMaterials} />

    <SectionTitle>办理程序</SectionTitle>
    <div className="mt-8">
      {data.handlingProcedure.map((step: any, index: number) => (
        <ProcessStep
          key={index}
          index={index}
          title={step.title}
          description={step.description}
          isLast={index === data.handlingProcedure.length - 1}
        />
      ))}
    </div>

    <SectionTitle>申报时间</SectionTitle>
    <ContentText className="mb-[10px]">{data.applicationTime}</ContentText>

    <SectionTitle>咨询电话</SectionTitle>
    <ConsultationPhoneTable consultationPhone={data.consultationPhone} />

    <SpecialInstructions
      content={data.specialInstructions}
      url={data.specialInstructionsUrl}
    />
  </div>
);

// --- Mock Data ---
const NEW_MOCK_DATA = {
  title: "2024-2025年北京市节能技术改造项目奖励",
  basicInfo: {
    implementationBody: "北京市发展和改革委员会",
    target: "北京市范围内符合条件的企事业单位",
    visits: "1次",
    supportAmount: "最高500万元",
  },
  acceptanceConditions:
    "1. 在北京市注册的企事业单位\n2. 实施节能技术改造项目\n3. 节能量达到要求标准\n4. 项目已通过验收",
  itemDescription: {
    summary:
      "为推动北京市节能减排工作，鼓励企业实施节能技术改造项目，对符合条件的节能改造项目给予资金奖励。",
  },
  applicationMaterials: [
    {
      id: 1,
      name: "项目申请表",
      isRequired: true,
      requirements: ["填写完整", "加盖单位公章"],
      template: "示例文本",
      templateUrl: "#",
    },
    {
      id: 2,
      name: "项目可行性研究报告",
      isRequired: true,
      requirements: ["需第三方机构出具", "有效期1年"],
      template: "示例文本",
      templateUrl: "#",
    },
    {
      id: 3,
      name: "节能效果评估报告",
      isRequired: true,
      requirements: ["由有资质机构出具"],
      guide: "填报须知",
      guideDesc: "需提供详细的节能计算方法和数据来源",
    },
  ],
  handlingProcedure: [
    {
      title: "在线申报",
      description:
        "登录北京市节能改造项目申报系统，填写项目基本信息并提交申请材料",
    },
    {
      title: "材料审核",
      description: "相关部门对提交的申请材料进行初步审核，审核周期为5个工作日",
    },
    {
      title: "现场核查",
      description: "通过初审的项目，组织专家进行现场核查，核实项目实施情况",
    },
    {
      title: "公示与拨付",
      description: "审核通过的项目进行公示，公示期7天，无异议后拨付奖励资金",
    },
  ],
  specialInstructions: "更多详情请访问北京市发改委官方网站",
  specialInstructionsUrl: "https://fgw.beijing.gov.cn",
  applicationTime: "2024年1月1日至2025年12月31日",
  consultationPhone: [
    {
      region: "朝阳区",
      contact: "张老师",
      phone: "010-88881234",
    },
    {
      region: "海淀区",
      contact: "李老师",
      phone: "010-88885678",
    },
    {
      region: "丰台区",
      contact: "王老师",
      phone: "010-88889012",
    },
  ],
};

const CONSULTANT = {
  name: "王老师",
  title: "资深政策规划师",
  intro: "具有丰富的政策申报规划经验，能为不同阶段的企业定制补贴申报方案",
  avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
};

const RECOMMENDATIONS = [
  {
    title: "北京市高精尖产业发展资金",
    amount: "最高补贴500万元",
    target: "在北京市注册登记",
  },
  {
    title: "中关村国家自主创新示范区资金支持",
    amount: "最高补贴300万元",
    target: "中关村示范区企业",
  },
  {
    title: "丰台区促进高精尖产业发展扶持措施",
    amount: "最高补贴1000万元",
    target: "丰台区重点企业",
  },
];

const FAQS = [
  "成长期的企业适合申报哪些政策？",
  "高新技术企业认定需要满足哪些硬性条件？",
  "申报资金支持后，后续需要配合哪些审计工作？",
  "如何判断企业是否符合“专精特新”标准？",
];

const PolicyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("北京积分时代科技有限公司");
  const [faqList, setFaqList] = useState(FAQS.slice(0, 3));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleApply = () => {
    message.success("正在跳转至申报向导页面...");
    navigate(`/policy-center/application-management/apply/${id}`);
  };

  const handleConsult = () => {
    Modal.info({
      title: "在线咨询",
      content: "正在连接咨询师，请稍候...",
      okText: "关闭",
    });
  };

  const handleMatch = () => {
    if (!companyName) {
      message.warning("请输入企业名称");
      return;
    }
    message.loading("正在为您重新匹配政策...", 1.5).then(() => {
      message.success("匹配完成！已更新适配度");
    });
  };

  const handleShuffleFaq = () => {
    const shuffled = [...FAQS].sort(() => 0.5 - Math.random());
    setFaqList(shuffled.slice(0, 3));
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: "'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 顶部面包屑 */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
          <Breadcrumb
            items={[
              { title: <Link to="/policy-center">政策中心</Link> },
              { title: "政策详情" },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "24px auto",
          padding: "0 24px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* 左侧主要内容区 - 使用用户提供的组件重构 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PolicyContent data={NEW_MOCK_DATA} onApply={handleApply} />
        </div>

        {/* 右侧辅助功能模块 - 保留原有结构 */}
        <div style={{ width: "320px", flexShrink: 0 }}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {/* 1. 政策申报规划咨询模块 */}
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  政策申报规划咨询
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  src={CONSULTANT.avatar}
                  style={{ flexShrink: 0, marginRight: "12px" }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {CONSULTANT.name}{" "}
                    <Tag
                      color="blue"
                      style={{ marginLeft: "4px", fontSize: "10px" }}
                    >
                      {CONSULTANT.title}
                    </Tag>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                      lineHeight: "1.5",
                    }}
                  >
                    {CONSULTANT.intro}
                  </div>
                </div>
              </div>
              <Button
                block
                style={{
                  color: "#1890ff",
                  borderColor: "#91d5ff",
                  background: "#e6f7ff",
                  borderRadius: "4px",
                }}
                onClick={handleConsult}
              >
                在线咨询
              </Button>
            </Card>

            {/* 2. 申报推荐模块 */}
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  申报推荐
                </span>
              </div>
              <List
                dataSource={RECOMMENDATIONS}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: "0 0 16px 0", display: "block" }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        marginBottom: "4px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {item.title}
                    </div>
                    <Space size={8}>
                      <Tag color="orange" style={{ margin: 0 }}>
                        {item.amount}
                      </Tag>
                      <Tag style={{ margin: 0, color: "#666" }}>
                        {item.target}
                      </Tag>
                    </Space>
                  </List.Item>
                )}
              />
              <Button
                type="text"
                block
                style={{ color: "#666", marginTop: "-8px" }}
              >
                查看更多 <RightOutlined style={{ fontSize: "10px" }} />
              </Button>
            </Card>

            {/* 3. 企业常见问题模块 */}
            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  企业常见问题
                </span>
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  style={{ color: "#666", fontSize: "12px" }}
                  onClick={handleShuffleFaq}
                >
                  换一换
                </Button>
              </div>
              <List
                dataSource={faqList}
                split={false}
                renderItem={(item, index) => (
                  <List.Item style={{ padding: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          background: "#f0f0f0",
                          borderRadius: "50%",
                          textAlign: "center",
                          lineHeight: "18px",
                          fontSize: "12px",
                          color: "#999",
                          marginRight: "8px",
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <Text style={{ fontSize: "14px", color: "#333" }}>
                        {item}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            <Card
              bordered={false}
              style={{
                borderRadius: "8px",
                background: "linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)",
                border: "1px solid #bae7ff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <ThunderboltFilled
                  style={{
                    color: "#1890ff",
                    fontSize: "18px",
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                >
                  政策匹配
                </span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginBottom: "16px",
                  lineHeight: "1.5",
                }}
              >
                全国产业政策实时更新，智能匹配资金支持、紧跟政策导向
              </div>
              <Input
                placeholder="请输入企业名称"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Button type="primary" block onClick={handleMatch}>
                立即匹配
              </Button>
            </Card>
          </Space>
        </div>
      </div>
    </Layout>
  );
};

export default PolicyDetail;
