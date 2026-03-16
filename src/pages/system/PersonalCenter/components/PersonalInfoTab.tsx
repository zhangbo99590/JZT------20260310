/**
 * 个人信息标签页组件
 * 创建时间: 2026-01-13
 */

import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Descriptions,
  Space,
  Typography,
  Divider,
  Alert,
} from "antd";
import { LockOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import dayjs from "dayjs";
import type { UserInfo as UserInfoType } from "../../../../services/userService";

const { Title } = Typography;

interface PersonalInfoTabProps {
  userInfo: UserInfoType;
  passwordForm: FormInstance;
  loading: boolean;
  onEditPhone: () => void;
  onEditNickname: () => void;
  onChangePassword: (values: {
    oldPassword: string;
    newPassword: string;
  }) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  userInfo,
  passwordForm,
  loading,
  onEditPhone,
  onEditNickname,
  onChangePassword,
}) => {
  return (
    <>
      <Title level={4}>基本信息</Title>
      <Descriptions column={2} bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="用户ID">{userInfo.userId}</Descriptions.Item>
        <Descriptions.Item label="角色权限">
          {userInfo.roleType === "0" ? "企业管理员" : "普通成员"}
        </Descriptions.Item>
        <Descriptions.Item label="所属企业">
          {userInfo.enterpriseName}
        </Descriptions.Item>
        <Descriptions.Item label="企业ID">
          {userInfo.enterpriseId}
        </Descriptions.Item>
        <Descriptions.Item label="联系电话">
          {userInfo.phone}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={onEditPhone}
          >
            修改
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="昵称">
          {userInfo.nickName}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={onEditNickname}
          >
            修改
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="登录时间" span={2}>
          {dayjs(userInfo.loginTime).format("YYYY-MM-DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="登录IP" span={2}>
          {userInfo.loginIp}
        </Descriptions.Item>
      </Descriptions>

      <Alert
        message="提示"
        description="企业信息（如所属企业）为系统自动关联，不可编辑。修改手机号需要短信验证。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Divider />

      <Title level={4}>密码与安全设置</Title>
      <Card bordered={false} style={{ background: "#fafafa" }}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={onChangePassword}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="当前密码"
            name="oldPassword"
            rules={[{ required: true, message: "请输入当前密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入当前密码"
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 8, message: "密码长度至少为8位" },
              {
                pattern:
                  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "密码必须包含字母、数字和特殊符号",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码（8位以上，含字母/数字/特殊符号）"
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                修改密码
              </Button>
              <Button onClick={() => passwordForm.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        <Alert
          message="安全提示"
          description="修改密码成功后将强制重新登录，请妥善保管您的新密码。"
          type="warning"
          showIcon
        />
      </Card>
    </>
  );
};

export default PersonalInfoTab;
