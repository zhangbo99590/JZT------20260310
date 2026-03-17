import React, { useState } from "react";
import {
  Card,
  Tag,
  Space,
  Button,
  Divider,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import {
  DownOutlined,
  UpOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

interface SmartPolicyFilterProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const BEIJING_DISTRICTS = [
  "东城区",
  "西城区",
  "朝阳区",
  "海淀区",
  "丰台区",
  "石景山区",
  "门头沟区",
  "房山区",
  "通州区",
  "顺义区",
  "昌平区",
  "大兴区",
  "怀柔区",
  "平谷区",
  "密云区",
  "延庆区",
];

const INDUSTRIES = [
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

const POLICY_LEVELS = ["国家级", "省级", "市级", "区级", "街道级"];
const AGENCIES = [
  "发改委",
  "科委",
  "经信局",
  "财政局",
  "商务局",
  "人社局",
  "市监局",
];
const SUBSIDY_TYPES = [
  "资金补贴",
  "税收优惠",
  "荣誉资质",
  "金融支持",
  "人才引进",
];

const SmartPolicyFilter: React.FC<SmartPolicyFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [expandRegion, setExpandRegion] = useState(false);
  const [expandIndustry, setExpandIndustry] = useState(false);
  const [expandAdvanced, setExpandAdvanced] = useState(false);

  const handleRegionSelect = (region: string) => {
    const newRegions = filters.region?.includes(region)
      ? filters.region.filter((r: string) => r !== region)
      : [...(filters.region || []), region];
    onFilterChange({ ...filters, region: newRegions });
  };

  const handleIndustrySelect = (ind: string) => {
    const newIndustries = filters.industry?.includes(ind)
      ? filters.industry.filter((i: string) => i !== ind)
      : [...(filters.industry || []), ind];
    onFilterChange({ ...filters, industry: newIndustries });
  };

  const renderFilterRow = (
    title: string,
    icon: React.ReactNode,
    items: string[],
    selected: string[],
    onSelect: (item: string) => void,
    expand: boolean,
    onExpand: (val: boolean) => void,
    maxShow: number = 8,
  ) => (
    <div
      style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}
    >
      <div
        style={{
          width: 100,
          flexShrink: 0,
          color: "#666",
          display: "flex",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        {icon}
        <span style={{ marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ flex: 1 }}>
        <Space
          size={[8, 8]}
          wrap
          style={{
            maxHeight: expand ? "none" : 32,
            overflow: "hidden",
            transition: "all 0.3s",
          }}
        >
          <Tag.CheckableTag
            checked={!selected || selected.length === 0}
            onChange={() =>
              onFilterChange({
                ...filters,
                [title === "行政区域" ? "region" : "industry"]: [],
              })
            }
          >
            全部
          </Tag.CheckableTag>
          {items.map((item) => (
            <Tag.CheckableTag
              key={item}
              checked={selected?.includes(item)}
              onChange={() => onSelect(item)}
            >
              {item}
            </Tag.CheckableTag>
          ))}
        </Space>
      </div>
      {items.length > maxShow && (
        <Button
          type="link"
          size="small"
          onClick={() => onExpand(!expand)}
          icon={expand ? <UpOutlined /> : <DownOutlined />}
        >
          {expand ? "收起" : "更多"}
        </Button>
      )}
    </div>
  );

  const hasActiveFilters = Object.values(filters).some(
    (val: any) => Array.isArray(val) && val.length > 0,
  );

  return (
    <Card
      bordered={false}
      className="smart-policy-filter"
      style={{ marginBottom: 24, borderRadius: 8 }}
    >
      {/* Region Filter */}
      {renderFilterRow(
        "行政区域",
        <EnvironmentOutlined />,
        BEIJING_DISTRICTS,
        filters.region,
        handleRegionSelect,
        expandRegion,
        setExpandRegion,
      )}

      {/* Industry Filter */}
      {renderFilterRow(
        "行业筛选",
        <AppstoreOutlined />,
        INDUSTRIES,
        filters.industry,
        handleIndustrySelect,
        expandIndustry,
        setExpandIndustry,
      )}

      {/* Advanced Filters Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          borderTop: "1px solid #f0f0f0",
          paddingTop: 16,
        }}
      >
        <Space>
          <Button
            type={expandAdvanced ? "primary" : "default"}
            ghost={!expandAdvanced}
            onClick={() => setExpandAdvanced(!expandAdvanced)}
            icon={<FilterOutlined />}
          >
            更多筛选
          </Button>

          {/* Selected Conditions Summary */}
          {hasActiveFilters && (
            <Space size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                已选条件：
              </Text>
              {filters.region?.map((r: string) => (
                <Tag
                  key={r}
                  closable
                  onClose={() => handleRegionSelect(r)}
                  color="blue"
                >
                  {r}
                </Tag>
              ))}
              {filters.industry?.map((i: string) => (
                <Tag
                  key={i}
                  closable
                  onClose={() => handleIndustrySelect(i)}
                  color="cyan"
                >
                  {i}
                </Tag>
              ))}
              {/* Add other filter tags here */}
            </Space>
          )}
        </Space>

        <Button
          icon={<ReloadOutlined />}
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          重置筛选
        </Button>
      </div>

      {/* Advanced Filter Content */}
      {expandAdvanced && (
        <div
          style={{
            marginTop: 16,
            padding: "16px",
            background: "#fafafa",
            borderRadius: 4,
          }}
        >
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Text style={{ display: "block", marginBottom: 8 }}>
                政策级别
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择政策级别"
                value={filters.level}
                onChange={(val) => onFilterChange({ ...filters, level: val })}
              >
                {POLICY_LEVELS.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Text style={{ display: "block", marginBottom: 8 }}>
                发文机构
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择发文机构"
                value={filters.agency}
                onChange={(val) => onFilterChange({ ...filters, agency: val })}
              >
                {AGENCIES.map((a) => (
                  <Option key={a} value={a}>
                    {a}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Text style={{ display: "block", marginBottom: 8 }}>
                补贴类型
              </Text>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择补贴类型"
                value={filters.subsidyType}
                onChange={(val) =>
                  onFilterChange({ ...filters, subsidyType: val })
                }
              >
                {SUBSIDY_TYPES.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

export default SmartPolicyFilter;
