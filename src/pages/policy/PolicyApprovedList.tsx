import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Breadcrumb,
  Pagination,
  Input,
} from "antd";
import {
  HomeOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const PolicyApprovedList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Mock Data
  const policyInfo = {
    name: "朝阳区促进商务经济高质量发展引导资金",
    maxAmount: "3000万",
  };

  const dataSource = Array.from({ length: 118 }).map((_, i) => ({
    key: i,
    companyName: `北京${["积分时代", "乐益通", "创新未来", "华科", "智汇"][i % 5]}科技有限公司${i + 1}`,
    industry: ["软件服务", "金融业", "制造业", "科技推广", "商务服务"][i % 5],
    region: "北京市朝阳区",
    year: `202${3 - (i % 3)}`,
    amount: `${[50, 100, 200, 500, 1000][i % 5]}万`,
    status: i % 10 === 0 ? "失效" : "有效", // Mock status
  }));

  const columns = [
    {
      title: "公司名称",
      dataIndex: "companyName",
      key: "companyName",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "所属行业",
      dataIndex: "industry",
      key: "industry",
    },
    {
      title: "注册地",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "公示年份",
      dataIndex: "year",
      key: "year",
      sorter: (a: any, b: any) => parseInt(a.year) - parseInt(b.year),
    },
    {
      title: "补贴金额",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: any, b: any) => parseInt(a.amount) - parseInt(b.amount),
      render: (text: string) => (
        <Text type="warning" strong>
          {text}
        </Text>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "有效" ? "green" : "default"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <div
        style={{
          background: "#fff",
          padding: "24px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                  >
                    <HomeOutlined /> 首页
                  </span>
                ),
              },
              {
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/policy-center/main")}
                  >
                    政策中心
                  </span>
                ),
              },
              {
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/policy-center/smart-matching")}
                  >
                    智能匹配
                  </span>
                ),
              },
              { title: "历史获批企业名单" },
            ]}
            style={{ marginBottom: "24px" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={3} style={{ margin: "0 0 8px 0" }}>
                {policyInfo.name}
              </Title>
              <Space>
                <Text type="secondary">最高补贴：</Text>
                <Text strong style={{ color: "#faad14", fontSize: "20px" }}>
                  {policyInfo.maxAmount}
                </Text>
              </Space>
            </div>
            <Button type="primary" size="large" icon={<DownloadOutlined />}>
              我要申报
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: "1200px", margin: "24px auto", padding: "0 24px" }}
      >
        <div
          style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
        >
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              历史获批企业名单 ({dataSource.length})
            </Title>
            <Input
              placeholder="搜索企业名称"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={dataSource.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize,
            )}
            pagination={false}
            rowKey="key"
          />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={dataSource.length}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条数据`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyApprovedList;
