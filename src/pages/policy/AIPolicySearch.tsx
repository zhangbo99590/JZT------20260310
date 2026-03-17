import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Space,
  message,
  Spin,
  Alert,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import PageWrapper from "../../components/PageWrapper";
import SmartPolicyFilter from "./components/SmartPolicyFilter";
import SmartPolicyResults from "./components/SmartPolicyResults";
import SmartPolicyMatch from "./components/SmartPolicyMatch";

// Mock Data for demonstration
const MOCK_POLICIES = Array.from({ length: 65 }).map((_, i) => {
  const districts = [
    "海淀区",
    "朝阳区",
    "丰台区",
    "西城区",
    "东城区",
    "石景山区",
    "通州区",
    "昌平区",
    "大兴区",
    "顺义区",
  ];
  const policyTypes = [
    "高新技术企业认定",
    "中小企业发展",
    "科技创新支持",
    "人才引进",
    "产业升级",
    "绿色发展",
    "数字化转型",
  ];
  const departments = [
    "北京市科委",
    "北京市发改委",
    "北京市经信局",
    "北京市人社局",
    "北京市财政局",
  ];
  const allIndustries = [
    "城乡建设",
    "环境保护",
    "科技创新",
    "教育培训",
    "文化创意",
    "金融服务",
    "医疗健康",
    "农业农村",
    "交通运输",
    "旅游休闲",
    "能源电力",
    "先进制造",
    "生物医药",
    "人工智能",
    "集成电路",
    "新材料",
    "新能源",
    "高端装备",
  ];

  const district = districts[i % districts.length];
  const policyType = policyTypes[i % policyTypes.length];
  const dept = departments[i % departments.length];

  return {
    id: `policy-${i}`,
    title: `${district}关于支持${policyType}的实施办法（202${6 - (i % 3)}版）`,
    department: `${district}${dept}`,
    date: `202${6 - (i % 2)}-0${(i % 9) + 1}-15`,
    industry: [
      allIndustries[i % allIndustries.length],
      allIndustries[(i + 5) % allIndustries.length],
    ],
    status: (i % 5 === 0 ? "closed" : i % 3 === 0 ? "upcoming" : "active") as
      | "active"
      | "upcoming"
      | "closed",
    type: i % 2 === 0 ? "认定" : "补贴",
    content: `为进一步优化${district}营商环境，促进${policyType}发展，根据国家及本市有关规定，结合${district}实际情况，制定本措施，旨在推动企业创新发展，提升核心竞争力...`,
  };
});

const AIPolicySearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [keyword, setKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState([
    "高新技术",
    "专精特新",
    "研发补贴",
  ]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    region: string[];
    industry: string[];
    level: string[];
    agency: string[];
    subsidyType: string[];
  }>({
    region: [],
    industry: [],
    level: [],
    agency: [],
    subsidyType: [],
  });
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [feedback, setFeedback] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [searchTrigger, setSearchTrigger] = useState(0);

  const performSearch = () => {
    setLoading(true);
    setHasSearched(true);

    // Simulate API call latency
    setTimeout(() => {
      let filtered = MOCK_POLICIES;

      if (keyword) {
        const searchTerm = keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.department.toLowerCase().includes(searchTerm) ||
            p.content.toLowerCase().includes(searchTerm) ||
            p.industry.some((ind) => ind.toLowerCase().includes(searchTerm)) ||
            p.type.toLowerCase().includes(searchTerm),
        );
      }

      if (filters.industry.length > 0) {
        filtered = filtered.filter((p) =>
          filters.industry.some((ind) => p.industry.includes(ind)),
        );
      }

      if (filters.region.length > 0) {
        filtered = filtered.filter((p) =>
          filters.region.some(
            (region) =>
              p.title.includes(region) ||
              p.department.includes(region) ||
              p.content.includes(region),
          ),
        );
      }

      setTotal(filtered.length);

      // Pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setResults(filtered.slice(start, end));

      setLoading(false);

      // Feedback generation
      const regionText =
        filters.region.length > 0 ? filters.region.join("、") : "";
      const keyText = keyword ? `"${keyword}"` : "";

      if (filtered.length > 0) {
        setFeedback(
          `搜索完成，找到 ${filtered.length} 条 ${keyText} ${regionText ? `(${regionText})` : ""} 相关政策`,
        );
      } else {
        setFeedback("");
      }

      // Update history
      if (keyword && !searchHistory.includes(keyword)) {
        setSearchHistory((prev) => [keyword, ...prev].slice(0, 5));
      }
    }, 600);
  };

  // Unified effect for data fetching
  useEffect(() => {
    performSearch();
  }, [page, pageSize, filters, searchTrigger]);

  // Trigger search on filter change (and reset page)
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchClick = () => {
    setPage(1);
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        {activeTab === "match" && (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Typography.Title level={2} style={{ margin: "0 0 8px 0" }}>
              项目列表
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              展示可申报的政策项目列表，支持筛选和快速启动申报
              <br />
              精准匹配，辅助补贴申报
            </Typography.Text>
          </div>
        )}

        {/* Top Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            centered
            items={[
              {
                key: "search",
                label: (
                  <span style={{ fontSize: 16, padding: "0 8px" }}>
                    <SearchOutlined /> 政策搜索
                  </span>
                ),
              },
              {
                key: "match",
                label: (
                  <span style={{ fontSize: 16, padding: "0 8px" }}>
                    <RobotOutlined /> 政策匹配
                  </span>
                ),
              },
            ]}
          />
        </div>

        {activeTab === "search" ? (
          <>
            {/* Search Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Input.Search
                placeholder="请输入政策关键词、发文机构、地域等"
                enterButton={
                  <Button type="primary" size="large" style={{ height: 40 }}>
                    立即搜索
                  </Button>
                }
                size="large"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={handleSearchClick}
                style={{ maxWidth: 800, height: 40 }}
                className="policy-search-input"
              />
              <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
                <Space split={<span style={{ color: "#ddd" }}>|</span>}>
                  <span>
                    <InfoCircleOutlined style={{ marginRight: 4 }} />{" "}
                    主动检索政策：输入关键词快速查找
                  </span>
                  {searchHistory.length > 0 && (
                    <Space>
                      <ClockCircleOutlined />
                      <span>搜索历史：</span>
                      {searchHistory.map((h) => (
                        <span
                          key={h}
                          onClick={() => {
                            setKeyword(h);
                            handleSearchClick();
                          }}
                          style={{ cursor: "pointer", color: "#1890ff" }}
                        >
                          {h}
                        </span>
                      ))}
                    </Space>
                  )}
                </Space>
              </div>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <Alert
                message={feedback}
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 8 }}
                closable
                onClose={() => setFeedback("")}
              />
            )}

            {/* Filters */}
            <SmartPolicyFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={() =>
                handleFilterChange({
                  region: [],
                  industry: [],
                  level: [],
                  agency: [],
                  subsidyType: [],
                })
              }
            />

            {/* Main Content */}
            <SmartPolicyResults
              loading={loading}
              data={results}
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={(p, s) => {
                setPage(p);
                setPageSize(s);
              }}
              onSortChange={(val) => {}}
              searchKeyword={keyword}
              activeFilters={filters}
            />
          </>
        ) : (
          <SmartPolicyMatch />
        )}
      </div>
    </PageWrapper>
  );
};

export default AIPolicySearch;
