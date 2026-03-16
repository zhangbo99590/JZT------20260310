/**
 * 首页趋势图表组件
 * 创建时间: 2026-01-13
 * 功能: 渲染首页的申报趋势分析图表
 */

import React from "react";
import { Card } from "antd";
import { BellOutlined } from "@ant-design/icons";
import SafeECharts from "../../../components/SafeECharts";
import { getTrendChartOption } from "../config/chartConfig.ts";

interface TrendChartSectionProps {
  loading?: boolean;
}

/**
 * 趋势图表组件
 * 组件创建时间: 2026-01-13
 */
export const TrendChartSection: React.FC<TrendChartSectionProps> = ({
  loading = false,
}) => {
  return (
    <Card
      loading={loading}
      className="hover-card"
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <BellOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
          申报趋势分析
        </div>
      }
      style={{ height: "100%" }}
    >
      <SafeECharts option={getTrendChartOption()} style={{ height: "280px" }} />
    </Card>
  );
};
