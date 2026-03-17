import React, { useState, useRef, useEffect } from "react";
import {
  List,
  Avatar,
  Input,
  Button,
  Badge,
  Typography,
  Empty,
  Space,
  Upload,
  message,
} from "antd";
import {
  SendOutlined,
  PictureOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { THEME, COMMON_STYLES } from "./styles";

const { Text } = Typography;
const { TextArea } = Input;

// Mock Data
const MOCK_CHATS = [
  {
    id: 1,
    name: "上海微电子装备有限公司",
    avatar: "",
    lastMessage: "好的，我们可以安排下周二上午进行初步沟通。",
    time: "10:30",
    unread: 2,
  },
  {
    id: 2,
    name: "杭州海康威视",
    avatar: "",
    lastMessage: "请问贵公司的报价方案出来了吗？",
    time: "昨天",
    unread: 0,
  },
  {
    id: 3,
    name: "深圳大疆创新",
    avatar: "",
    lastMessage: "[图片] 需求说明书.pdf",
    time: "周一",
    unread: 0,
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    type: "text",
    content: "您好，我对贵公司的数字化转型服务很感兴趣。",
    isSelf: false,
    time: "10:00",
  },
  {
    id: 2,
    type: "text",
    content:
      "您好！非常感谢您的关注。我们专注于为制造企业提供全链路数字化解决方案。",
    isSelf: true,
    time: "10:05",
  },
  {
    id: 3,
    type: "text",
    content: "方便发一份详细的案例介绍吗？",
    isSelf: false,
    time: "10:10",
  },
  {
    id: 4,
    type: "text",
    content: "好的，我们可以安排下周二上午进行初步沟通。",
    isSelf: false,
    time: "10:30",
  },
];

const MyMessages: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      type: "text",
      content: inputText,
      isSelf: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setInputText("");

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "text",
          content: "收到，我们会尽快评估。",
          isSelf: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  };

  return (
    <div
      style={{
        ...COMMON_STYLES.pageContainer,
        padding: 0,
        height: "calc(100vh - 110px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar: Chat List */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#ccc" }} />}
            placeholder="搜索联系人"
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={MOCK_CHATS}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  background:
                    activeChat === item.id ? "#F2F8FF" : "transparent",
                  borderLeft:
                    activeChat === item.id
                      ? `3px solid ${THEME.primary}`
                      : "3px solid transparent",
                }}
                onClick={() => setActiveChat(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={item.unread} size="small">
                      <Avatar
                        icon={<UserOutlined />}
                        shape="square"
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Badge>
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text ellipsis style={{ width: 140, fontSize: "14px" }}>
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {item.time}
                      </Text>
                    </div>
                  }
                  description={
                    <Text
                      type="secondary"
                      ellipsis
                      style={{ fontSize: "12px", width: 180 }}
                    >
                      {item.lastMessage}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Right Content: Chat Window */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#F8F9FA",
        }}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "16px 24px",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Text strong style={{ fontSize: "16px" }}>
                {MOCK_CHATS.find((c) => c.id === activeChat)?.name}
              </Text>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.isSelf ? "flex-end" : "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  {!msg.isSelf && (
                    <Avatar
                      icon={<UserOutlined />}
                      size="small"
                      style={{ marginRight: "8px", backgroundColor: "#1890ff" }}
                    />
                  )}
                  <div style={{ maxWidth: "70%" }}>
                    <div
                      style={{
                        background: msg.isSelf ? "#165DFF" : "#fff",
                        color: msg.isSelf ? "#fff" : "#333",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        borderTopLeftRadius: !msg.isSelf ? 0 : 8,
                        borderTopRightRadius: msg.isSelf ? 0 : 8,
                      }}
                    >
                      {msg.content}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginTop: "4px",
                        textAlign: msg.isSelf ? "right" : "left",
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>
                  {msg.isSelf && (
                    <Avatar
                      icon={<UserOutlined />}
                      size="small"
                      style={{ marginLeft: "8px", backgroundColor: "#faad14" }}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "16px",
                background: "#fff",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Space style={{ marginBottom: "8px" }}>
                <Upload showUploadList={false} beforeUpload={() => false}>
                  <Button type="text" icon={<PictureOutlined />} size="small" />
                </Upload>
              </Space>
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入消息，按Enter发送"
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{
                  border: "none",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
              <div style={{ textAlign: "right", marginTop: "8px" }}>
                <Button
                  type="primary"
                  onClick={handleSend}
                  icon={<SendOutlined />}
                >
                  发送
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty description="选择左侧联系人开始聊天" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMessages;
