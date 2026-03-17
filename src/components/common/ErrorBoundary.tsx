/**
 * 错误边界组件
 * 创建时间: 2026-02-26
 * 功能: 捕获和处理React组件错误
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Result, Button, Card, Typography } from "antd";
import { ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: "50px 20px", textAlign: "center" }}>
          <Result
            status="error"
            title="页面出现错误"
            subTitle="抱歉，页面遇到了一些问题。您可以尝试刷新页面或联系技术支持。"
            extra={[
              <Button
                type="primary"
                key="reload"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
              >
                刷新页面
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                重试
              </Button>,
            ]}
          >
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Card
                title={
                  <span>
                    <ExclamationCircleOutlined
                      style={{ color: "#ff4d4f", marginRight: "8px" }}
                    />
                    错误详情 (开发环境)
                  </span>
                }
                style={{ textAlign: "left", marginTop: "20px" }}
              >
                <Paragraph>
                  <Text strong>错误信息:</Text>
                  <br />
                  <Text code>{this.state.error.message}</Text>
                </Paragraph>
                <Paragraph>
                  <Text strong>错误堆栈:</Text>
                  <br />
                  <Text
                    code
                    style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}
                  >
                    {this.state.error.stack}
                  </Text>
                </Paragraph>
                {this.state.errorInfo && (
                  <Paragraph>
                    <Text strong>组件堆栈:</Text>
                    <br />
                    <Text
                      code
                      style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}
                    >
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </Paragraph>
                )}
              </Card>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

// 轻量级错误边界组件
export const SimpleErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Result
            status="warning"
            title="模块加载失败"
            subTitle="该模块暂时无法显示，请稍后再试"
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            }
          />
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
