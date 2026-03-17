/**
 * 增强版政策搜索页面
 * 集成所有优化功能：品牌标识、导航、搜索反馈、结果列表等
 */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  Checkbox,
  Typography,
  Spin,
  message,
  Divider,
  Tag,
  AutoComplete,
  Collapse,
  Slider,
  DatePicker,
  Radio,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
  ThunderboltOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchFeedback from "../../components/policy/SearchFeedback";
import EmptyStateOptimized from "../../components/policy/EmptyStateOptimized";
import PolicyResultsList from "../../components/policy/PolicyResultsList";
import { searchEnhancedPolicies } from "./data/enhancedPolicyData";
import { simulateDelay } from "../../utils/commonUtils";
import type { EnhancedPolicyData } from "./data/enhancedPolicyData";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

interface SearchFilters {
  regions: string[];
  industries: string[];
  levels: string[];
  categories: string[];
  orgTypes: string[];
  subsidyTypes: string[];
  amountRange?: [number, number];
  dateRange?: [string, string];
}

const EnhancedPolicySearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 搜索状态
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<EnhancedPolicyData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string>("");

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<
    "comprehensive" | "latest" | "deadline" | "amount"
  >("comprehensive");

  // 筛选状态
  const [filters, setFilters] = useState<SearchFilters>({
    regions: [],
    industries: [],
    levels: [],
    categories: [],
    orgTypes: [],
    subsidyTypes: [],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 搜索建议
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<
    { value: string }[]
  >([]);

  // 热门搜索关键词
  const hotSearchKeywords = [
    "高新技术企业",
    "科技创新",
    "研发补贴",
    "人才引进",
    "金融科技",
    "数字经济",
    "绿色发展",
    "专精特新",
  ];

  // 筛选选项配置
  const filterOptions = {
    regions: [
      "北京市",
      "上海市",
      "广东省",
      "江苏省",
      "浙江省",
      "山东省",
      "河南省",
      "四川省",
      "湖北省",
      "湖南省",
      "安徽省",
      "河北省",
    ],
    industries: [
      "信息技术",
      "生物医药",
      "新能源",
      "新材料",
      "高端装备",
      "节能环保",
      "数字创意",
      "现代服务业",
      "金融服务",
      "教育培训",
    ],
    levels: ["国家级", "省级", "市级", "区县级"],
    categories: [
      "资金补贴",
      "税收优惠",
      "贷款贴息",
      "担保支持",
      "人才政策",
      "土地优惠",
      "技术支持",
      "市场准入",
    ],
    orgTypes: ["政府机构", "事业单位", "国有企业", "民营企业", "外资企业"],
    subsidyTypes: ["直接补贴", "税收减免", "贷款优惠", "担保支持", "其他优惠"],
  };

  // 初始化搜索参数
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    const region = searchParams.get("region");
    const industry = searchParams.get("industry");

    if (keyword) {
      setSearchKeyword(keyword);
      handleSearch(keyword);
    }

    if (region || industry) {
      setFilters((prev) => ({
        ...prev,
        regions: region ? [region] : prev.regions,
        industries: industry ? [industry] : prev.industries,
      }));
    }
  }, []);

  // 监听搜索建议事件
  useEffect(() => {
    const handleSearchSuggestion = (event: CustomEvent) => {
      const keyword = event.detail.keyword;
      setSearchKeyword(keyword);
      handleSearch(keyword);
    };

    window.addEventListener(
      "searchSuggestion",
      handleSearchSuggestion as EventListener,
    );
    return () => {
      window.removeEventListener(
        "searchSuggestion",
        handleSearchSuggestion as EventListener,
      );
    };
  }, []);

  // 执行搜索
  const handleSearch = useCallback(
    async (
      keyword: string = searchKeyword,
      newFilters: SearchFilters = filters,
    ) => {
      // 允许空关键词搜索，只要有筛选条件或者是初始搜索
      const hasKeyword = keyword.trim().length > 0;
      const hasFilters = Object.values(newFilters).some((arr) =>
        Array.isArray(arr) ? arr.length > 0 : !!arr,
      );

      if (!hasKeyword && !hasFilters) {
        // 如果没有关键词和筛选条件，显示所有政策
        keyword = "";
      }

      setSearchLoading(true);
      setSearchError("");

      try {
        // 模拟搜索延迟
        await simulateDelay(500);

        // 执行搜索 - 修改为支持空关键词搜索
        const results = await searchEnhancedPolicies({
          keyword: keyword.trim() || "", // 允许空关键词
          filters: {
            districts: newFilters.regions,
            industries: newFilters.industries,
            levels: newFilters.levels,
            categories: newFilters.categories,
          },
          page: currentPage,
          pageSize: pageSize,
          sortBy: sortBy,
        });

        // console.log('搜索结果:', results); // 调试日志

        setSearchResults(results);
        setTotalResults(results.length);
        setHasSearched(true);

        // 更新URL参数
        const params = new URLSearchParams();
        if (keyword.trim()) params.set("keyword", keyword.trim());
        if (newFilters.regions.length > 0)
          params.set("region", newFilters.regions[0]);
        if (newFilters.industries.length > 0)
          params.set("industry", newFilters.industries[0]);
        setSearchParams(params);

        // 生成搜索建议
        if (results.length === 0) {
          setSearchSuggestions(hotSearchKeywords.slice(0, 4));
        }
      } catch (error) {
        console.error("搜索失败:", error);
        setSearchError("搜索服务暂时不可用，请稍后重试");
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setSearchLoading(false);
      }
    },
    [searchKeyword, filters, currentPage, pageSize, sortBy],
  );

  // 处理筛选变更
  const handleFilterChange = useCallback(
    (filterType: keyof SearchFilters, values: string[]) => {
      const newFilters = { ...filters, [filterType]: values };
      setFilters(newFilters);

      if (hasSearched) {
        setCurrentPage(1);
        handleSearch(searchKeyword, newFilters);
      }
    },
    [filters, hasSearched, searchKeyword, handleSearch],
  );

  // 清除单个筛选条件
  const handleClearFilter = useCallback(
    (filterType: string, value: string) => {
      const newFilters = { ...filters };
      if (filterType in newFilters) {
        const filterArray = newFilters[
          filterType as keyof SearchFilters
        ] as string[];
        newFilters[filterType as keyof SearchFilters] = filterArray.filter(
          (item) => item !== value,
        ) as any;
        setFilters(newFilters);
        handleSearch(searchKeyword, newFilters);
      }
    },
    [filters, searchKeyword, handleSearch],
  );

  // 清除所有筛选条件
  const handleClearAllFilters = useCallback(() => {
    const emptyFilters: SearchFilters = {
      regions: [],
      industries: [],
      levels: [],
      categories: [],
      orgTypes: [],
      subsidyTypes: [],
    };
    setFilters(emptyFilters);
    handleSearch(searchKeyword, emptyFilters);
  }, [searchKeyword, handleSearch]);

  // 处理自动完成
  const handleAutoCompleteSearch = useCallback((value: string) => {
    if (value) {
      const options = hotSearchKeywords
        .filter((keyword) =>
          keyword.toLowerCase().includes(value.toLowerCase()),
        )
        .map((keyword) => ({ value: keyword }));
      setAutoCompleteOptions(options);
    } else {
      setAutoCompleteOptions([]);
    }
  }, []);

  // 处理分页变更
  const handlePageChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    // 这里可以实现真实的分页搜索
  }, []);

  // 处理排序变更
  const handleSortChange = useCallback(
    (newSortBy: string) => {
      setSortBy(newSortBy as any);
      if (hasSearched) {
        handleSearch(searchKeyword, filters);
      }
    },
    [hasSearched, searchKeyword, filters, handleSearch],
  );

  // 查看政策详情
  const handleViewDetail = useCallback(
    (id: string) => {
      navigate(`/policy/detail/${id}`);
    },
    [navigate],
  );

  // 批量操作
  const handleBatchEdit = useCallback(
    (selectedIds: string[], action: string) => {
      message.success(`已对 ${selectedIds.length} 条政策执行${action}操作`);
    },
    [],
  );

  // 导出数据
  const handleExport = useCallback(
    (selectedIds?: string[]) => {
      const count = selectedIds ? selectedIds.length : totalResults;
      message.success(`正在导出 ${count} 条政策数据...`);
    },
    [totalResults],
  );

  // 转换数据格式
  const convertedResults = useMemo(() => {
    return searchResults.map((item) => ({
      id: item.id,
      title: item.title,
      publishDate: item.publishDate,
      department: item.publishOrg,
      industry: item.applicableIndustries,
      level: item.level,
      region: item.district,
      subsidyAmount: item.subsidyAmount,
      status: "active" as const,
      tags: item.keywords,
      summary: item.summary,
      matchScore: item.matchScore,
    }));
  }, [searchResults]);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          <RobotOutlined style={{ color: "#1890ff", marginRight: 8 }} />
          智慧政策搜索
        </Title>
        <Text type="secondary">
          基于AI技术的智能政策匹配，为您精准推荐适合的政策项目
        </Text>
      </div>

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          {/* 主搜索框 */}
          <div>
            <AutoComplete
              style={{ width: "100%" }}
              options={autoCompleteOptions}
              onSearch={handleAutoCompleteSearch}
              value={searchKeyword}
              onChange={setSearchKeyword}
            >
              <Input.Search
                placeholder="输入政策名称、关键词或描述信息..."
                size="large"
                enterButton={
                  <Button
                    type="primary"
                    size="large"
                    loading={searchLoading}
                    icon={<SearchOutlined />}
                  >
                    搜索政策
                  </Button>
                }
                onSearch={() => handleSearch()}
              />
            </AutoComplete>
          </div>

          {/* 热门搜索 */}
          <div>
            <Text type="secondary" style={{ marginRight: 12 }}>
              热门搜索：
            </Text>
            <Space wrap>
              {hotSearchKeywords.map((keyword, index) => (
                <Tag
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchKeyword(keyword);
                    handleSearch(keyword);
                  }}
                >
                  {keyword}
                </Tag>
              ))}
              <Button
                size="small"
                type="link"
                onClick={() => handleSearch("")}
                style={{ padding: "0 8px" }}
              >
                查看所有政策
              </Button>
            </Space>
          </div>

          {/* 快速筛选 */}
          <Row gutter={16}>
            <Col span={6}>
              <Select
                mode="multiple"
                placeholder="选择地区"
                style={{ width: "100%" }}
                value={filters.regions}
                onChange={(values) => handleFilterChange("regions", values)}
                maxTagCount={2}
              >
                {filterOptions.regions.map((region) => (
                  <Option key={region} value={region}>
                    {region}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                mode="multiple"
                placeholder="选择行业"
                style={{ width: "100%" }}
                value={filters.industries}
                onChange={(values) => handleFilterChange("industries", values)}
                maxTagCount={2}
              >
                {filterOptions.industries.map((industry) => (
                  <Option key={industry} value={industry}>
                    {industry}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                mode="multiple"
                placeholder="政策级别"
                style={{ width: "100%" }}
                value={filters.levels}
                onChange={(values) => handleFilterChange("levels", values)}
                maxTagCount={2}
              >
                {filterOptions.levels.map((level) => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                高级筛选{" "}
                {showAdvancedFilters ? <UpOutlined /> : <DownOutlined />}
              </Button>
            </Col>
          </Row>

          {/* 高级筛选 */}
          {showAdvancedFilters && (
            <Card size="small" style={{ background: "#fafafa" }}>
              <Collapse ghost>
                <Panel header="更多筛选条件" key="1">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Text strong>政策类别：</Text>
                      <Select
                        mode="multiple"
                        placeholder="选择政策类别"
                        style={{ width: "100%", marginTop: 8 }}
                        value={filters.categories}
                        onChange={(values) =>
                          handleFilterChange("categories", values)
                        }
                      >
                        {filterOptions.categories.map((category) => (
                          <Option key={category} value={category}>
                            {category}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Text strong>机构类型：</Text>
                      <Select
                        mode="multiple"
                        placeholder="选择机构类型"
                        style={{ width: "100%", marginTop: 8 }}
                        value={filters.orgTypes}
                        onChange={(values) =>
                          handleFilterChange("orgTypes", values)
                        }
                      >
                        {filterOptions.orgTypes.map((orgType) => (
                          <Option key={orgType} value={orgType}>
                            {orgType}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={8}>
                      <Text strong>补贴类型：</Text>
                      <Select
                        mode="multiple"
                        placeholder="选择补贴类型"
                        style={{ width: "100%", marginTop: 8 }}
                        value={filters.subsidyTypes}
                        onChange={(values) =>
                          handleFilterChange("subsidyTypes", values)
                        }
                      >
                        {filterOptions.subsidyTypes.map((subsidyType) => (
                          <Option key={subsidyType} value={subsidyType}>
                            {subsidyType}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Card>
          )}
        </Space>
      </Card>

      {/* 搜索反馈 */}
      {(hasSearched || searchLoading) && (
        <SearchFeedback
          loading={searchLoading}
          resultCount={totalResults}
          searchKeyword={searchKeyword}
          filters={filters}
          onClearFilter={handleClearFilter}
          onClearAllFilters={handleClearAllFilters}
        />
      )}

      {/* 搜索结果或空状态 */}
      {searchLoading ? (
        <Card>
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>正在搜索政策，请稍候...</Text>
            </div>
          </div>
        </Card>
      ) : searchError ? (
        <EmptyStateOptimized type="error" onRetry={() => handleSearch()} />
      ) : hasSearched ? (
        totalResults > 0 ? (
          <PolicyResultsList
            data={convertedResults}
            loading={searchLoading}
            total={totalResults}
            current={currentPage}
            pageSize={pageSize}
            sortBy={sortBy}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            onViewDetail={handleViewDetail}
            onBatchEdit={handleBatchEdit}
            onExport={handleExport}
          />
        ) : (
          <EmptyStateOptimized
            type="no-results"
            searchKeyword={searchKeyword}
            hasFilters={Object.values(filters).some((arr) => arr.length > 0)}
            onClearFilters={handleClearAllFilters}
            suggestions={searchSuggestions}
          />
        )
      ) : (
        <EmptyStateOptimized type="no-search" />
      )}
    </div>
  );
};

export default EnhancedPolicySearch;
