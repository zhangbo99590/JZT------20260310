/**
 * 法律护航统计数据组件
 * 创建时间: 2026-01-13
 * 功能: 渲染法律护航页面的统计数据卡片
 */

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { statisticsConfig } from "../config/statisticsConfig.ts";

/**
 * 统计数据组件
 * 组件创建时间: 2026-01-13
 */
export const StatisticsSection: React.FC = () => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      {statisticsConfig.map((item, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card>
            <Statistic
              title={item.title}
              value={item.value}
              prefix={item.prefix}
              valueStyle={{ color: item.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
