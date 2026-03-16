/**
 * AI律师(律多多)页面
 * 创建时间: 2026-01-30
 * 功能: 提供智能法律咨询对话服务
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Tabs,
  Button,
  Input,
  Radio,
  Tag,
  Space,
  Avatar,
  message,
  Modal,
  Breadcrumb,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  HistoryOutlined,
  ClearOutlined,
  HomeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/PageWrapper";
import { getBreadcrumbItems } from "../../../utils/breadcrumbConfig";

const { TextArea } = Input;

// 对话消息类型
interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  mode?: "normal" | "deep";
}

// 历史对话记录类型
interface HistoryItem {
  id: string;
  title: string;
  mode: "normal" | "deep";
  timestamp: Date;
  messages: Message[];
}

// 热门咨询标签
const hotTags = [
  "夫妻共同财产认定标准",
  "如何申请撤销监护权",
  "合伙企业债务承担规则",
  "劳动合同解除补偿",
  "房产继承纠纷处理",
  "公司股权转让流程",
];

/**
 * AI律师主页面组件
 */
const AILawyer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [consultMode, setConsultMode] = useState<"normal" | "deep">("normal");
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
    {
      id: "1",
      title: "夫妻共同财产认定标准",
      mode: "normal",
      timestamp: new Date("2026-01-28 19:23"),
      messages: [],
    },
    {
      id: "2",
      title: "如何申请撤销监护权",
      mode: "deep",
      timestamp: new Date("2026-01-27 14:15"),
      messages: [],
    },
    {
      id: "3",
      title: "合伙企业债务承担规则",
      mode: "normal",
      timestamp: new Date("2026-01-26 10:30"),
      messages: [],
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 面包屑配置
  const breadcrumbItems = getBreadcrumbItems("/legal-support/ai-lawyer");

  // 滚动到消息底部
  const scrollToBottom = () => {
    // 只有当消息区域确实有滚动条且不在底部时才滚动
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      // 使用 setTimeout 确保 DOM 更新后再滚动
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isTyping]);

  // 发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      message.warning("请输入您的法律问题");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      mode: consultMode,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    // 更新或创建历史记录
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      setCurrentChatId(chatId);
      // 创建新历史记录
      const newHistoryItem: HistoryItem = {
        id: chatId,
        title:
          inputValue.substring(0, 20) + (inputValue.length > 20 ? "..." : ""),
        mode: consultMode,
        timestamp: new Date(),
        messages: newMessages,
      };
      setHistoryList((prev) => [newHistoryItem, ...prev]);
    } else {
      // 更新现有历史记录
      setHistoryList((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                messages: newMessages,
                timestamp: new Date(),
              }
            : item,
        ),
      );
    }

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue, consultMode),
        timestamp: new Date(),
        mode: consultMode,
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      setIsTyping(false);

      // 更新历史记录中的 AI 回复
      setHistoryList((prev) =>
        prev.map((item) =>
          item.id === chatId
            ? {
                ...item,
                messages: updatedMessages,
                timestamp: new Date(),
              }
            : item,
        ),
      );
    }, 1500);
  };

  // 生成AI回复（模拟）
  const generateAIResponse = (
    question: string,
    mode: "normal" | "deep",
  ): string => {
    if (mode === "deep") {
      return `针对您的问题"${question}"，我为您提供深度分析：

## 法律依据
根据相关法律法规，这个问题涉及多个法律条款...

## 案例分析
类似案例的处理结果和参考价值...

## 风险评估
当前情况可能存在的法律风险...

## 建议方案
基于以上分析，建议您采取以下措施...

如需更详细的法律意见，建议咨询专业律师。`;
    } else {
      return `您好！关于您提到的"${question}"问题，我为您提供以下解答：

根据相关法律规定，您可以采取以下措施：
1. 首先尝试协商解决
2. 收集相关证据材料
3. 必要时寻求法律援助

如需更详细的法律指导，建议您选择"深度分析"模式或咨询专业律师。`;
    }
  };

  // 新对话
  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setCurrentChatId(""); // 重置当前会话ID
  };

  // 清空历史记录
  const handleClearHistory = () => {
    Modal.confirm({
      title: "确认清空",
      content: "确定要清空所有历史对话记录吗？此操作不可恢复。",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        setHistoryList([]);
        message.success("历史记录已清空");
      },
    });
  };

  // 加载历史对话
  const loadHistory = (historyItem: HistoryItem) => {
    setMessages(historyItem.messages);
    setConsultMode(historyItem.mode);
    setCurrentChatId(historyItem.id); // 设置当前会话ID
    setActiveTab("chat");
  };

  // 删除单个历史记录
  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这条对话记录吗？此操作不可恢复。",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
        message.success("记录已删除");
      },
    });
  };

  // 点击热门标签
  const handleTagClick = (tag: string) => {
    setInputValue(tag);
  };

  const items = [
    {
      key: "chat",
      label: "智能咨询",
    },
    {
      key: "history",
      label: "历史记录",
    },
  ];

  return (
    <PageWrapper module="legal">
      {/* 页面容器 */}
      <div
        style={{
          margin: "0 24px 24px 24px",
          display: "flex",
          gap: "24px",
          height: "calc(100vh - 140px)",
        }}
      >
        {/* 左侧边栏 - 导航菜单 */}
        <div
          style={{
            width: "240px",
            flexShrink: 0,
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            padding: "16px 0",
          }}
        >
          {/* Logo 区域 */}
          <div
            style={{
              padding: "0 20px 20px 20px",
              borderBottom: "1px solid #f0f0f0",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#1890ff",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <RobotOutlined style={{ fontSize: "20px" }} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#262626",
              }}
            >
              AI 律多多
            </h3>
          </div>

          {/* 菜单区域 */}
          <div
            style={{
              padding: "0 12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: activeTab === "chat" ? "#e6f7ff" : "transparent",
                color: activeTab === "chat" ? "#1890ff" : "#666",
                fontWeight: activeTab === "chat" ? 500 : "normal",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveTab("chat")}
            >
              <SendOutlined />
              智能咨询
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: activeTab === "history" ? "#e6f7ff" : "transparent",
                color: activeTab === "history" ? "#1890ff" : "#666",
                fontWeight: activeTab === "history" ? 500 : "normal",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveTab("history")}
            >
              <HistoryOutlined />
              历史记录
            </div>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* 头部区域 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: "1px solid #f0f0f0",
              height: "64px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                DeepSeek-V3.2
              </span>
              <Tag color="green" style={{ margin: 0 }}>
                已在线
              </Tag>
            </div>
            {activeTab === "chat" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleNewChat}
                style={{ borderRadius: "6px" }}
              >
                新对话
              </Button>
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {activeTab === "chat" ? (
              // 聊天视图
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        maxWidth: "600px",
                        padding: "0 24px",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          background: "#f0f5ff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 24px",
                          color: "#1890ff",
                        }}
                      >
                        <RobotOutlined style={{ fontSize: "32px" }} />
                      </div>
                      <h3
                        style={{
                          color: "#333",
                          marginBottom: "16px",
                          fontSize: "20px",
                        }}
                      >
                        您好，我是您的智能法律顾问"律多多"
                      </h3>
                      <p style={{ color: "#666", marginBottom: "32px" }}>
                        我可以为您解答法律疑问、分析案件风险、提供专业建议。请直接在下方输入您的问题。
                      </p>

                      <div style={{ marginBottom: "32px" }}>
                        <Radio.Group
                          value={consultMode}
                          onChange={(e) => setConsultMode(e.target.value)}
                          optionType="button"
                          buttonStyle="solid"
                        >
                          <Radio.Button value="normal">普通咨询</Radio.Button>
                          <Radio.Button value="deep">深度分析</Radio.Button>
                        </Radio.Group>
                      </div>

                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            marginBottom: "12px",
                            color: "#999",
                            fontSize: "12px",
                          }}
                        >
                          热门咨询：
                        </div>
                        <Space wrap>
                          {hotTags.map((tag) => (
                            <Tag
                              key={tag}
                              style={{
                                cursor: "pointer",
                                padding: "4px 12px",
                                height: "28px",
                                lineHeight: "20px",
                                background: "#f5f5f5",
                                border: "none",
                                borderRadius: "4px",
                                marginBottom: "8px",
                                fontSize: "13px",
                              }}
                              onClick={() => handleTagClick(tag)}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "24px",
                      background: "#fff",
                    }}
                  >
                    {messages.map((message) => (
                      <div key={message.id} style={{ marginBottom: "24px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              message.type === "user"
                                ? "flex-end"
                                : "flex-start",
                            alignItems: "flex-start",
                            gap: "12px",
                          }}
                        >
                          {message.type === "ai" && (
                            <Avatar
                              icon={<RobotOutlined />}
                              style={{
                                backgroundColor: "#1890ff",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div
                            style={{
                              maxWidth: "70%",
                              padding: "12px 16px",
                              borderRadius:
                                message.type === "user"
                                  ? "12px 0 12px 12px"
                                  : "0 12px 12px 12px",
                              background:
                                message.type === "user" ? "#1890ff" : "#f5f7fa",
                              color: message.type === "user" ? "#fff" : "#333",
                              lineHeight: "1.6",
                            }}
                          >
                            <div style={{ whiteSpace: "pre-line" }}>
                              {message.content}
                            </div>
                          </div>
                          {message.type === "user" && (
                            <Avatar
                              icon={<UserOutlined />}
                              style={{
                                backgroundColor: "#87d068",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Avatar
                          icon={<RobotOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                        <div
                          style={{
                            padding: "12px 16px",
                            background: "#f5f7fa",
                            borderRadius: "0 12px 12px 12px",
                            color: "#666",
                          }}
                        >
                          正在思考中...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* 输入区域 */}
                <div
                  style={{ padding: "24px", borderTop: "1px solid #f0f0f0" }}
                >
                  <div
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "8px",
                      background: "#fff",
                      transition: "all 0.3s",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                    }}
                  >
                    <TextArea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="请详细描述您的法律问题..."
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      bordered={false}
                      style={{ resize: "none", marginBottom: "8px" }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 8px",
                      }}
                    >
                      <Space size={16}>
                        <Radio.Group
                          value={consultMode}
                          onChange={(e) => setConsultMode(e.target.value)}
                          size="small"
                        >
                          <Radio value="normal">普通</Radio>
                          <Radio value="deep">深度</Radio>
                        </Radio.Group>
                      </Space>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        loading={isTyping}
                        style={{ borderRadius: "6px", padding: "0 24px" }}
                      >
                        发送
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 历史记录视图
              <div
                style={{ padding: "24px", overflowY: "auto", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>历史咨询记录</h3>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearHistory}
                    disabled={historyList.length === 0}
                  >
                    清空历史
                  </Button>
                </div>

                {historyList.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 0",
                      color: "#999",
                    }}
                  >
                    暂无历史记录
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {historyList.map((item) => (
                      <div
                        key={item.id}
                        className="group"
                        style={{ position: "relative" }}
                      >
                        <Card
                          hoverable
                          style={{ borderRadius: "8px" }}
                          onClick={() => loadHistory(item)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "12px",
                            }}
                          >
                            <Tag
                              color={item.mode === "deep" ? "blue" : "green"}
                            >
                              {item.mode === "deep" ? "深度分析" : "普通咨询"}
                            </Tag>
                            <span style={{ color: "#999", fontSize: "12px" }}>
                              {item.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <h4
                            style={{
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginBottom: "8px",
                              paddingRight: "24px",
                            }}
                          >
                            {item.title}
                          </h4>
                          <div
                            style={{
                              color: "#666",
                              fontSize: "13px",
                              height: "40px",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.messages[0]?.content || "无内容"}
                          </div>
                        </Card>

                        <Button
                          className="delete-btn opacity-0 group-hover:opacity-100 transition-opacity"
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          danger
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "8px",
                            zIndex: 1,
                            background: "rgba(255,255,255,0.8)",
                          }}
                          onClick={(e) => handleDeleteHistory(e, item.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AILawyer;
