/**
 * 璟智通政策搜索模块 - 筛选组件错误边界
 * 捕获和处理React组件错误，防止整个应用崩溃
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Card, Result } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class FilterErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error('FilterErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 可以将错误日志上报给服务
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // 这里可以集成错误监控服务，如 Sentry
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 发送到错误监控服务
    console.warn('Error logged:', errorData);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <Card className="m-4">
          <Result
            status="error"
            title="筛选组件加载失败"
            subTitle="抱歉，筛选功能遇到了问题。请尝试刷新页面或联系技术支持。"
            extra={[
              <Button type="primary" key="retry" onClick={this.handleRetry} icon={<ReloadOutlined />}>
                重试
              </Button>,
              <Button key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>
            ]}
          />
          
          {/* 开发环境下显示详细错误信息 */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Alert
              message="开发调试信息"
              description={
                <div>
                  <p><strong>错误信息:</strong> {this.state.error.message}</p>
                  <details>
                    <summary>错误堆栈</summary>
                    <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
                      {this.state.error.stack}
                    </pre>
                  </details>
                  {this.state.errorInfo && (
                    <details>
                      <summary>组件堆栈</summary>
                      <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              }
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              className="mt-4"
            />
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}

export default FilterErrorBoundary;
