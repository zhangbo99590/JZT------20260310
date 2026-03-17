/**
 * 用户管理搜索栏组件
 * 创建时间: 2026-01-13
 * 功能: 提供用户搜索和新增按钮
 */

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Typography,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { enterpriseService } from "../../../../services/enterpriseService";

const { Text, Title } = Typography;

/**
 * 搜索栏组件Props
 * 类型定义时间: 2026-01-13
 */
interface SearchBarProps {
  searchText: string;
  status: string | undefined;
  onSearchTextChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onSearch: () => void;
  onAdd: () => void;
}

/**
 * 搜索栏组件
 * 组件创建时间: 2026-01-13
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  status,
  onSearchTextChange,
  onStatusChange,
  onSearch,
  onAdd,
}) => {
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateInviteCode = async () => {
    try {
      setLoading(true);
      const res = await enterpriseService.getInviteCode();
      if (res && res.inviteCode) {
        setInviteCode(res.inviteCode);
        setInviteModalVisible(true);
      } else {
        message.error("生成邀请码失败");
      }
    } catch (error) {
      console.error("Failed to generate invite code", error);
      message.error("获取邀请码失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInviteCode = async () => {
    try {
      setLoading(true);
      const res = await enterpriseService.refreshInviteCode();
      if (res && res.inviteCode) {
        setInviteCode(res.inviteCode);
        message.success("刷新成功");
      }
    } catch (error) {
      console.error("Failed to refresh invite code", error);
      message.error("刷新邀请码失败");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    message.success("邀请码已复制到剪贴板");
  };

  return (
    <>
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Input.Search
              placeholder="搜索用户名、邮箱或用户 ID..."
              allowClear
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              onSearch={onSearch}
              enterButton={<Button icon={<SearchOutlined />} />}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="账号状态"
              allowClear
              style={{ width: "100%" }}
              value={status}
              onChange={onStatusChange}
            >
              <Select.Option value={undefined}>全部状态</Select.Option>
              <Select.Option value="0">已启用</Select.Option>
              <Select.Option value="1">已禁用</Select.Option>
            </Select>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Button
              type="default"
              icon={<UsergroupAddOutlined />}
              onClick={handleGenerateInviteCode}
              style={{ marginRight: 8 }}
              loading={loading}
            >
              邀请员工
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              新增用户
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal
        title="邀请员工注册"
        open={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        footer={[
          <Button
            key="refresh"
            onClick={handleRefreshInviteCode}
            loading={loading}
          >
            刷新邀请码
          </Button>,
          <Button
            key="copy"
            type="primary"
            icon={<CopyOutlined />}
            onClick={copyInviteCode}
          >
            复制邀请码
          </Button>,
        ]}
      >
        <div
          style={{
            background: "#f5f5f5",
            padding: "24px",
            borderRadius: "8px",
            marginTop: "16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            企业专属邀请码
          </Text>
          <Title
            level={2}
            style={{ margin: 0, color: "#1890ff", letterSpacing: "2px" }}
          >
            {inviteCode}
          </Title>
        </div>
        <Text type="secondary">
          将此邀请码发送给企业员工，员工在注册时填写该邀请码即可加入您的企业。
        </Text>
      </Modal>
    </>
  );
};
