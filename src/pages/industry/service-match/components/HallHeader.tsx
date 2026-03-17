import React, { useState } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  Space,
  Select,
  DatePicker,
  Card,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { THEME } from "../styles";

const { Option } = Select;

interface HallHeaderProps {
  onSearch: (value: string) => void;
  onFilterChange: (filters: any) => void;
  onCreateClick: () => void;
  isProcurement?: boolean; // To distinguish filter options if needed
}

const HallHeader: React.FC<HallHeaderProps> = ({
  onSearch,
  onFilterChange,
  onCreateClick,
  isProcurement = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    category: undefined,
    demandType: undefined,
    date: undefined,
    region: undefined,
    budget: undefined, // for procurement
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Real-time search
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filterMenu = (
    <Card
      style={{ width: 400, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      bodyStyle={{ padding: "20px" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div>
          <div style={{ marginBottom: 8, color: THEME.textBody }}>
            {isProcurement ? "采购品类" : "产品类别"}
          </div>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择"
            allowClear
            onChange={(val) => handleFilterChange("category", val)}
          >
            <Option value="tech">技术类</Option>
            <Option value="service">服务类</Option>
            <Option value="hardware">硬件类</Option>
          </Select>
        </div>

        <div>
          <div style={{ marginBottom: 8, color: THEME.textBody }}>
            {isProcurement ? "采购需求" : "需求分类"}
          </div>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择"
            allowClear
            onChange={(val) => handleFilterChange("demandType", val)}
          >
            <Option value="urgent">急需</Option>
            <Option value="longTerm">长期</Option>
            <Option value="project">项目级</Option>
          </Select>
        </div>

        {isProcurement ? (
          <>
            <div>
              <div style={{ marginBottom: 8, color: THEME.textBody }}>
                采购数量
              </div>
              <Select
                style={{ width: "100%" }}
                placeholder="请选择"
                allowClear
                onChange={(val) => handleFilterChange("quantity", val)}
              >
                <Option value="small">小批量</Option>
                <Option value="medium">中批量</Option>
                <Option value="large">大批量</Option>
              </Select>
            </div>
            <div>
              <div style={{ marginBottom: 8, color: THEME.textBody }}>
                采购预算
              </div>
              <Select
                style={{ width: "100%" }}
                placeholder="请选择"
                allowClear
                onChange={(val) => handleFilterChange("budget", val)}
              >
                <Option value="low">10万以下</Option>
                <Option value="medium">10-50万</Option>
                <Option value="high">50万以上</Option>
              </Select>
            </div>
            <div>
              <div style={{ marginBottom: 8, color: THEME.textBody }}>
                截止日期
              </div>
              <DatePicker
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleFilterChange("deadline", dateString)
                }
              />
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 8, color: THEME.textBody }}>
              报价区间
            </div>
            <Select
              style={{ width: "100%" }}
              placeholder="请选择"
              allowClear
              onChange={(val) => handleFilterChange("priceRange", val)}
            >
              <Option value="low">1万以下</Option>
              <Option value="medium">1-10万</Option>
              <Option value="high">10万以上</Option>
            </Select>
          </div>
        )}

        <div>
          <div style={{ marginBottom: 8, color: THEME.textBody }}>地域</div>
          <Select
            style={{ width: "100%" }}
            placeholder="请选择"
            allowClear
            onChange={(val) => handleFilterChange("region", val)}
          >
            <Option value="beijing">北京</Option>
            <Option value="shanghai">上海</Option>
            <Option value="guangzhou">广州</Option>
            <Option value="shenzhen">深圳</Option>
          </Select>
        </div>

        {!isProcurement && (
          <div>
            <div style={{ marginBottom: 8, color: THEME.textBody }}>
              发布日期
            </div>
            <DatePicker
              style={{ width: "100%" }}
              onChange={(date, dateString) =>
                handleFilterChange("date", dateString)
              }
            />
          </div>
        )}
      </Space>
    </Card>
  );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#fff",
        padding: "15px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Row gutter={16} align="middle">
        {/* Search Bar - 40% */}
        <Col span={9} style={{ flex: "0 0 40%", maxWidth: "40%" }}>
          <Input
            placeholder={
              isProcurement
                ? "搜索采购企业 / 采购品类 / 采购需求"
                : "搜索企业名称 / 业务类型 / 产品名称"
            }
            prefix={<SearchOutlined style={{ color: THEME.textHint }} />}
            value={searchValue}
            onChange={handleSearchChange}
            onPressEnter={() => onSearch(searchValue)}
            allowClear
            style={{ borderRadius: THEME.borderRadius }}
          />
        </Col>

        {/* Filter Bar - 40% */}
        <Col span={10} style={{ flex: "0 0 40%", maxWidth: "40%" }}>
          <Dropdown
            dropdownRender={() => filterMenu}
            trigger={["click"]}
            onOpenChange={setFilterOpen}
            open={filterOpen}
          >
            <Button block style={{ textAlign: "left", color: THEME.textBody }}>
              <FilterOutlined /> 筛选
              <span
                style={{
                  float: "right",
                  fontSize: "12px",
                  color: THEME.textHint,
                }}
              >
                {filterOpen ? "收起" : "展开"}
              </span>
            </Button>
          </Dropdown>
        </Col>

        {/* Create Button - 20% */}
        <Col span={5} style={{ flex: "0 0 20%", maxWidth: "20%" }}>
          <Button
            type="primary"
            block
            icon={<PlusOutlined />}
            style={{
              backgroundColor: THEME.primary,
              borderColor: THEME.primary,
              borderRadius: THEME.borderRadius,
              fontWeight: 500,
            }}
            onClick={onCreateClick}
          >
            {isProcurement ? "发布采购" : "发布业务"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default HallHeader;
