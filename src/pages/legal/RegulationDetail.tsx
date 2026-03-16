import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Space,
  Button,
  Row,
  Col,
  List,
  message,
  Tooltip,
  Spin,
  Collapse,
  Layout,
  Menu,
  Divider,
  Breadcrumb,
} from "antd";
import {
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  BulbFilled,
  WarningOutlined,
  BellOutlined,
} from "@ant-design/icons";
import PageWrapper from "../../components/PageWrapper";
import dayjs from "dayjs";

const { Title, Paragraph, Text, Link } = Typography;
const { Panel } = Collapse;
const { Sider, Content } = Layout;

// --- Interfaces ---

interface Article {
  id: string;
  type?: "article" | "part" | "chapter" | "section";
  title: string; // e.g., "第二十条" or "第一编 总则"
  text?: string;
  isCore?: boolean;
  interpretation?: {
    title: string;
    content: string;
  };
  risk?: {
    title: string;
    link: string;
  };
}

interface RegulationDetail {
  id: string;
  title: string;
  publishDate: string;
  effectiveDate: string;
  docNumber: string; // 发文字号
  level: string; // 效力级别
  issuingAuthority: string; // 制定机关
  citationCode: string; // 法宝引证码
  category: string; // 法规类别
  topics: string[]; // 专题分类
  status: "effective" | "revised" | "abolished";
  articles: Article[];
  relatedCases: Array<{
    id: string;
    title: string;
    tag: string; // 指导性案例 / 地方法院
    caseNumber: string;
    views: number;
  }>;
  templates: Array<{
    id: string;
    title: string;
    type: "docx" | "pdf";
  }>;
}

// --- Mock Data Service ---

const getMockData = (id: string): RegulationDetail => {
  if (id === "civil-code-2020") {
    return {
      id: "civil-code-2020",
      title: "中华人民共和国民法典",
      publishDate: "2020-05-28",
      effectiveDate: "2021-01-01",
      docNumber: "主席令第四十五号",
      level: "法律",
      issuingAuthority: "全国人民代表大会",
      citationCode: "CLI.1.342411",
      category: "民法",
      topics: ["民法典", "人工智能"],
      status: "effective",
      articles: [
        { id: "part-1", type: "part", title: "第一编 总则" },
        { id: "ch-1", type: "chapter", title: "第一章 基本规定" },
        {
          id: "art-7",
          type: "article",
          title: "第七条",
          text: "民事主体从事民事活动，应当遵循诚信原则，秉持诚实，恪守承诺。",
          isCore: true,
          interpretation: {
            title: "法理精释",
            content:
              "诚信原则被视为民法的“帝王条款”，贯穿民事活动全过程。在商业交易中，这意味着不能欺诈、恶意磋商。",
          },
        },
        { id: "ch-2", type: "chapter", title: "第二章 自然人" },
        {
          id: "sec-2-1",
          type: "section",
          title: "第一节 民事权利能力和民事行为能力",
        },
        { id: "sec-2-2", type: "section", title: "第二节 监护" },
        { id: "sec-2-3", type: "section", title: "第三节 宣告失踪和宣告死亡" },
        {
          id: "sec-2-4",
          type: "section",
          title: "第四节 个体工商户和农村承包经营户",
        },
        { id: "ch-3", type: "chapter", title: "第三章 法人" },
        { id: "sec-3-1", type: "section", title: "第一节 一般规定" },
        { id: "sec-3-2", type: "section", title: "第二节 营利法人" },
        { id: "sec-3-3", type: "section", title: "第三节 非营利法人" },
        { id: "sec-3-4", type: "section", title: "第四节 特别法人" },
        { id: "ch-4", type: "chapter", title: "第四章 非法人组织" },
        { id: "ch-5", type: "chapter", title: "第五章 民事权利" },
        { id: "ch-6", type: "chapter", title: "第六章 民事法律行为" },
        { id: "sec-6-1", type: "section", title: "第一节 一般规定" },
        { id: "sec-6-2", type: "section", title: "第二节 意思表示" },
        { id: "sec-6-3", type: "section", title: "第三节 民事法律行为的效力" },
        {
          id: "sec-6-4",
          type: "section",
          title: "第四节 民事法律行为的附条件和附期限",
        },
        { id: "ch-7", type: "chapter", title: "第七章 代理" },
        { id: "sec-7-1", type: "section", title: "第一节 一般规定" },
        { id: "sec-7-2", type: "section", title: "第二节 委托代理" },
        { id: "sec-7-3", type: "section", title: "第三节 代理终止" },
        { id: "ch-8", type: "chapter", title: "第八章 民事责任" },
        { id: "ch-9", type: "chapter", title: "第九章 诉讼时效" },
        {
          id: "art-188",
          type: "article",
          title: "第一百八十八条",
          text: "向人民法院请求保护民事权利的诉讼时效期间为三年。法律另有规定的，依照其规定。",
          risk: {
            title: "合规警示：诉讼时效管理",
            link: "查看时效管理指南",
          },
        },
        { id: "ch-10", type: "chapter", title: "第十章 期间计算" },
        { id: "part-2", type: "part", title: "第二编 物权" },
        { id: "part-2-sub-1", type: "part", title: "第一分编 通则" },
        { id: "p2-ch-1", type: "chapter", title: "第一章 一般规定" },
        {
          id: "p2-ch-2",
          type: "chapter",
          title: "第二章 物权的设立、变更、转让和消灭",
        },
        { id: "p2-sec-2-1", type: "section", title: "第一节 不动产登记" },
        { id: "p2-sec-2-2", type: "section", title: "第二节 动产交付" },
        { id: "p2-sec-2-3", type: "section", title: "第三节 其他规定" },
        { id: "p2-ch-3", type: "chapter", title: "第三章 物权的保护" },
        { id: "part-2-sub-2", type: "part", title: "第二分编 所有权" },
        { id: "p2-ch-4", type: "chapter", title: "第四章 一般规定" },
        {
          id: "p2-ch-5",
          type: "chapter",
          title: "第五章 国家所有权和集体所有权、私人所有权",
        },
        {
          id: "p2-ch-6",
          type: "chapter",
          title: "第六章 业主的建筑物区分所有权",
        },
        { id: "p2-ch-7", type: "chapter", title: "第七章 相邻关系" },
        { id: "p2-ch-8", type: "chapter", title: "第八章 共有" },
        {
          id: "p2-ch-9",
          type: "chapter",
          title: "第九章 所有权取得的特别规定",
        },
        // ... Missing intermediate parts for brevity, jumping to image 2 content
        { id: "ch-23", type: "chapter", title: "第二十三章 委托合同" },
        { id: "ch-24", type: "chapter", title: "第二十四章 物业服务合同" },
        { id: "ch-25", type: "chapter", title: "第二十五章 行纪合同" },
        { id: "ch-26", type: "chapter", title: "第二十六章 中介合同" },
        { id: "ch-27", type: "chapter", title: "第二十七章 合伙合同" },
        { id: "part-3-sub-3", type: "part", title: "第三分编 准合同" },
        { id: "ch-28", type: "chapter", title: "第二十八章 无因管理" },
        { id: "ch-29", type: "chapter", title: "第二十九章 不当得利" },
        { id: "part-4", type: "part", title: "第四编 人格权" },
        { id: "p4-ch-1", type: "chapter", title: "第一章 一般规定" },
        {
          id: "p4-ch-2",
          type: "chapter",
          title: "第二章 生命权、身体权和健康权",
        },
        { id: "p4-ch-3", type: "chapter", title: "第三章 姓名权和名称权" },
        { id: "p4-ch-4", type: "chapter", title: "第四章 肖像权" },
        { id: "p4-ch-5", type: "chapter", title: "第五章 名誉权和荣誉权" },
        {
          id: "p4-ch-6",
          type: "chapter",
          title: "第六章 隐私权和个人信息保护",
        },
        { id: "part-5", type: "part", title: "第五编 婚姻家庭" },
        { id: "p5-ch-1", type: "chapter", title: "第一章 一般规定" },
        { id: "p5-ch-2", type: "chapter", title: "第二章 结婚" },
        { id: "p5-ch-3", type: "chapter", title: "第三章 家庭关系" },
        { id: "p5-sec-3-1", type: "section", title: "第一节 夫妻关系" },
        {
          id: "p5-sec-3-2",
          type: "section",
          title: "第二节 父母子女关系和其他近亲属关系",
        },
        { id: "p5-ch-4", type: "chapter", title: "第四章 离婚" },
        { id: "p5-ch-5", type: "chapter", title: "第五章 收养" },
        { id: "p5-sec-5-1", type: "section", title: "第一节 收养关系的成立" },
        { id: "p5-sec-5-2", type: "section", title: "第二节 收养的效力" },
        { id: "p5-sec-5-3", type: "section", title: "第三节 收养关系的解除" },
        { id: "part-6", type: "part", title: "第六编 继承" },
        { id: "p6-ch-1", type: "chapter", title: "第一章 一般规定" },
        { id: "p6-ch-2", type: "chapter", title: "第二章 法定继承" },
        { id: "p6-ch-3", type: "chapter", title: "第三章 遗嘱继承和遗赠" },
        { id: "p6-ch-4", type: "chapter", title: "第四章 遗产的处理" },
        { id: "part-7", type: "part", title: "第七编 侵权责任" },
        { id: "p7-ch-1", type: "chapter", title: "第一章 一般规定" },
        { id: "p7-ch-2", type: "chapter", title: "第二章 损害赔偿" },
        { id: "p7-ch-3", type: "chapter", title: "第三章 责任主体的特殊规定" },
        { id: "p7-ch-4", type: "chapter", title: "第四章 产品责任" },
        { id: "p7-ch-5", type: "chapter", title: "第五章 机动车交通事故责任" },
        {
          id: "art-577",
          type: "article",
          title: "第五百七十七条",
          text: "当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。",
        },
      ],
      relatedCases: [
        {
          id: "c-civil-1",
          title: "最高法院：关于适用民法典总则编若干问题的解释",
          tag: "司法解释",
          caseNumber: "法释〔2022〕6号",
          views: 5600,
        },
        {
          id: "c-civil-2",
          title: "北京高院：民法典实施后首例居住权执行案",
          tag: "典型案例",
          caseNumber: "(2021) 京执复 21 号",
          views: 3200,
        },
      ],
      templates: [
        {
          id: "t-civil-1",
          title: "民法典合同编标准合同模板.docx",
          type: "docx",
        },
        { id: "t-civil-2", title: "企业民事法律风险防控手册.pdf", type: "pdf" },
      ],
    };
  }

  return {
    id: id || "1",
    title: "中华人民共和国公司法（2023修订）",
    publishDate: "2023-12-29",
    effectiveDate: "2024-07-01",
    docNumber: "主席令第十五号",
    level: "法律",
    issuingAuthority: "全国人民代表大会常务委员会",
    citationCode: "CLI.1.342412",
    category: "商法",
    topics: ["公司法", "企业治理"],
    status: "effective",
    articles: [
      {
        id: "art-20",
        title: "第二十条",
        text: "公司的股东应当遵守法律、行政法规和公司章程，依法行使股东权利，不得滥用股东权利损害公司或者其他股东的利益。",
        isCore: true,
        interpretation: {
          title: "专家解读",
          content:
            "本条强化了股东信义义务。特别是在新《公司法》背景下，控股股东滥用权利将面临穿透式审查。建议企业在章程中明确权力边界。",
        },
      },
      {
        id: "art-47",
        title: "第四十七条",
        text: "有限责任公司的注册资本为在公司登记机关登记的全体股东认缴的出资额。全体股东认缴的出资额由股东按照公司章程规定自公司成立之日起五年内缴足。",
        risk: {
          title: "涉及合规风险：出资期限新规",
          link: "查看应对方案",
        },
      },
    ],
    relatedCases: [
      {
        id: "c1",
        title: "最高法院：某科技公司股东损害公司利益责任纠纷案",
        tag: "指导性案例",
        caseNumber: "(2025) 最高法民终 82",
        views: 1200, // 1.2k
      },
      {
        id: "c2",
        title: "上海高院：关于认缴制出资期限纠纷的法律适用指南",
        tag: "地方法院",
        caseNumber: "2025-11-12",
        views: 0,
      },
    ],
    templates: [
      { id: "t1", title: "最新公司章程修订模版.docx", type: "docx" },
      { id: "t2", title: "董事忠实勤勉义务清单.pdf", type: "pdf" },
    ],
  };
};

// --- Component ---

const RegulationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [data, setData] = useState<RegulationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["art-20-interp"]);

  // 收藏状态管理
  const [isFavorited, setIsFavorited] = useState(false);

  // 检查收藏状态
  useEffect(() => {
    if (!data) return;
    const checkFavorite = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("my-favorites") || "[]");
        setIsFavorited(
          stored.some(
            (item: any) => item.id === data.id && item.type === "regulation",
          ),
        );
      } catch (e) {
        console.error("Failed to check favorite status", e);
      }
    };
    checkFavorite();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "my-favorites") {
        checkFavorite();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [data]);

  // 切换收藏状态
  const toggleFavorite = () => {
    if (!data) return;
    try {
      const stored = JSON.parse(localStorage.getItem("my-favorites") || "[]");
      const index = stored.findIndex(
        (item: any) => item.id === data.id && item.type === "regulation",
      );

      let newFavorites;
      if (index > -1) {
        // 取消收藏
        newFavorites = [...stored];
        newFavorites.splice(index, 1);
        setIsFavorited(false);
        message.success("已取消收藏");
      } else {
        // 添加收藏
        const newFavorite = {
          id: data.id,
          title: data.title,
          description: `发文字号：${data.docNumber} | 效力级别：${data.level}`,
          type: "regulation",
          category: data.level,
          addedDate: dayjs().format("YYYY-MM-DD"),
          sourceModule: "合规管理",
          url: `/legal-support/regulation-query/detail/${data.id}`,
          tags: [data.level, data.status === "effective" ? "现行有效" : "其他"],
          status: data.status,
          amount: 0,
        };
        newFavorites = [newFavorite, ...stored];
        setIsFavorited(true);
        message.success("已添加至收藏");
      }

      localStorage.setItem("my-favorites", JSON.stringify(newFavorites));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "my-favorites",
          newValue: JSON.stringify(newFavorites),
        }),
      );
    } catch (error) {
      console.error("操作失败:", error);
      message.error("操作失败");
    }
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(getMockData(id || "1"));
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading || !data) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" tip="正在加载..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ padding: "0 24px" }}>
        <Breadcrumb
          items={[{ title: "法律护航" }, { title: "法规详情" }]}
          style={{ margin: "16px 0" }}
        />
      </div>
      <Layout style={{ background: "#fff", padding: "24px 0" }}>
        <Sider
          width={250}
          style={{
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            overflowY: "auto",
            height: "calc(100vh - 150px)",
            position: "sticky",
            top: 0,
          }}
        >
          <div style={{ padding: "0 16px 16px" }}>
            <Title level={5}>目录</Title>
            {/* Mock Directory Tree */}
            <Menu
              mode="inline"
              defaultOpenKeys={["part1", "part2"]}
              style={{ borderRight: 0 }}
              items={[
                {
                  key: "part1",
                  label: "第一编 总则",
                  children: [
                    { key: "ch1", label: "第一章 基本规定" },
                    { key: "ch2", label: "第二章 自然人" },
                    { key: "ch3", label: "第三章 法人" },
                    { key: "ch4", label: "第四章 非法人组织" },
                    { key: "ch5", label: "第五章 民事权利" },
                    { key: "ch6", label: "第六章 民事法律行为" },
                    { key: "ch7", label: "第七章 代理" },
                    { key: "ch8", label: "第八章 民事责任" },
                    { key: "ch9", label: "第九章 诉讼时效" },
                    { key: "ch10", label: "第十章 期间计算" },
                  ],
                },
                {
                  key: "part2",
                  label: "第二编 物权",
                  children: [
                    { key: "p2ch1", label: "第一分编 通则" },
                    { key: "p2ch2", label: "第二分编 所有权" },
                    { key: "p2ch3", label: "第三分编 用益物权" },
                  ],
                },
              ]}
            />
          </div>
        </Sider>
        <Content style={{ padding: "0 48px", minHeight: 280 }}>
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {data.title}
            </Title>
          </div>

          <Divider />

          {/* Info Grid */}
          <div
            style={{
              background: "#f8f9fa",
              padding: "24px",
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    制定机关：
                  </Text>{" "}
                  <Text style={{ color: "#1890ff" }}>
                    {data.issuingAuthority}
                  </Text>{" "}
                  <BellOutlined style={{ color: "#999" }} />
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    发文字号：
                  </Text>{" "}
                  <Text type="secondary">{data.docNumber}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    公布日期：
                  </Text>{" "}
                  <Text type="secondary">{data.publishDate}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    施行日期：
                  </Text>{" "}
                  <Text type="secondary">{data.effectiveDate}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    时效性：
                  </Text>{" "}
                  <Text style={{ color: "#52c41a" }}>
                    {data.status === "effective" ? "现行有效" : "已失效"}
                  </Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    效力位阶：
                  </Text>{" "}
                  <Text style={{ color: "#1890ff" }}>{data.level}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    法规类别：
                  </Text>{" "}
                  <Text style={{ color: "#1890ff" }}>{data.category}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text
                    type="secondary"
                    style={{ width: 80, display: "inline-block" }}
                  >
                    专题分类：
                  </Text>
                  {data.topics?.map((topic, index) => (
                    <Text
                      key={index}
                      style={{ color: "#1890ff", marginRight: 8 }}
                    >
                      {topic}
                    </Text>
                  ))}
                </Space>
              </Col>
            </Row>
          </div>

          {/* Preamble */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Paragraph style={{ fontSize: 16, marginBottom: 8 }}>
              中华人民共和国主席令
            </Paragraph>
            <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
              （第四十五号）
            </Paragraph>
            <Paragraph
              style={{ textIndent: "2em", textAlign: "left", lineHeight: 2 }}
            >
              《{data.title}
              》已由中华人民共和国第十三届全国人民代表大会第三次会议于2020年5月28日通过，现予公布，自2021年1月1日起施行。
            </Paragraph>
            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Paragraph style={{ marginBottom: 4 }}>
                中华人民共和国主席 习近平
              </Paragraph>
              <Paragraph>
                {dayjs(data.publishDate).format("YYYY年M月D日")}
              </Paragraph>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              {data.title}
            </Title>
            <Paragraph>
              （{dayjs(data.publishDate).format("YYYY年M月D日")}
              第十三届全国人民代表大会第三次会议通过）
            </Paragraph>
            <Title level={4} style={{ marginTop: 24 }}>
              目录
            </Title>
          </div>

          {/* Main Articles Content - Rendered as Document */}
          <div style={{ padding: "0 24px" }}>
            <List
              itemLayout="vertical"
              dataSource={data.articles}
              split={false}
              renderItem={(item) => {
                if (item.type === "part") {
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 48,
                        marginBottom: 24,
                      }}
                    >
                      <Title level={3}>{item.title}</Title>
                    </div>
                  );
                }
                if (item.type === "chapter") {
                  return (
                    <div style={{ marginTop: 32, marginBottom: 16 }}>
                      <Title level={4}>{item.title}</Title>
                    </div>
                  );
                }
                if (item.type === "section") {
                  return (
                    <div style={{ marginTop: 24, marginBottom: 12 }}>
                      <Title level={5} style={{ color: "#666" }}>
                        {item.title}
                      </Title>
                    </div>
                  );
                }

                return (
                  <div style={{ marginBottom: 32 }}>
                    {/* Article Header */}
                    <div style={{ marginBottom: 12 }}>
                      <Text strong style={{ fontSize: 16 }}>
                        {item.title}
                      </Text>
                    </div>

                    {/* Article Text */}
                    <Paragraph
                      style={{
                        fontSize: 16,
                        lineHeight: 1.8,
                        marginBottom: 16,
                        textIndent: "2em",
                      }}
                    >
                      {item.text}
                    </Paragraph>

                    {/* Interpretation */}
                    {item.interpretation && (
                      <Collapse
                        activeKey={expandedKeys}
                        onChange={(keys) =>
                          setExpandedKeys(
                            typeof keys === "string" ? [keys] : keys,
                          )
                        }
                        ghost
                        expandIconPosition="end"
                      >
                        <Panel
                          header={
                            <Space>
                              <BulbFilled style={{ color: "#d48806" }} />
                              <Text strong style={{ color: "#d48806" }}>
                                {item.interpretation.title}
                              </Text>
                            </Space>
                          }
                          key={`${item.id}-interp`}
                          style={{
                            background: "#fffbe6",
                            borderRadius: 4,
                            border: "1px solid #ffe58f",
                          }}
                        >
                          <Paragraph
                            style={{
                              color: "#d48806",
                              opacity: 0.8,
                              marginBottom: 0,
                            }}
                          >
                            {item.interpretation.content}
                          </Paragraph>
                        </Panel>
                      </Collapse>
                    )}
                    {/* Risk Warning */}
                    {item.risk && (
                      <div
                        style={{
                          background: "#fff2f0",
                          border: "1px solid #ffccc7",
                          borderRadius: 4,
                          padding: "8px 16px",
                          marginTop: 8,
                        }}
                      >
                        <Space>
                          <WarningOutlined style={{ color: "#ff4d4f" }} />
                          <Text strong style={{ color: "#ff4d4f" }}>
                            {item.risk.title}
                          </Text>
                          <a href="#">{item.risk.link}</a>
                        </Space>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </Content>
        {/* Right Action Bar (Floating) */}
        <div
          style={{
            position: "fixed",
            right: 40,
            bottom: 100,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Tooltip title={isFavorited ? "取消收藏" : "收藏本法"}>
            <Button
              shape="circle"
              size="large"
              type={isFavorited ? "primary" : "default"}
              icon={isFavorited ? <StarFilled /> : <StarOutlined />}
              onClick={toggleFavorite}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
          </Tooltip>
          <Tooltip title="分享">
            <Button
              shape="circle"
              size="large"
              icon={<ShareAltOutlined />}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
          </Tooltip>
        </div>
      </Layout>
    </PageWrapper>
  );
};

export default RegulationDetail;
