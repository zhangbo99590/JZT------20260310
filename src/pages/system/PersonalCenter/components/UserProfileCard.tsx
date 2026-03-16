/**
 * 用户头像卡片组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Upload,
  Button,
  Space,
  Typography,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  SafetyOutlined,
  BankOutlined,
} from "@ant-design/icons";
import type { UserInfo as UserInfoType } from "../../../../services/userService";

const { Title, Text } = Typography;

interface UserProfileCardProps {
  userInfo: UserInfoType;
  avatarUrl: string;
  onAvatarUpload: (file: File) => boolean | Promise<boolean>;
  onLogout: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userInfo,
  avatarUrl,
  onAvatarUpload,
  onLogout,
}) => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={24} align="middle">
        <Col>
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={onAvatarUpload}
          >
            <div
              style={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={avatarUrl}
                style={{ border: "4px solid #f0f0f0" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "#1890ff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid white",
                }}
              >
                <CameraOutlined style={{ color: "white", fontSize: 14 }} />
              </div>
            </div>
          </Upload>
        </Col>
        <Col flex={1}>
          <Title level={3} style={{ marginBottom: 8 }}>
            {userInfo.nickName}
          </Title>
          <Space size="large">
            <Text type="secondary">
              <SafetyOutlined />{" "}
              {userInfo.roleType === "0" ? "企业管理员" : "普通成员"}
            </Text>
            <Text type="secondary">
              <UserOutlined /> 用户ID: {userInfo.userId}
            </Text>
            <Text type="secondary">
              <BankOutlined /> {userInfo.enterpriseName}
            </Text>
          </Space>
        </Col>
        <Col>
          <Button danger onClick={onLogout}>
            退出登录
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UserProfileCard;
