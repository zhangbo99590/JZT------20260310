import React, { useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsInstance } from "echarts-for-react";

/**
 * SafeECharts 安全图表组件
 *
 * @file SafeECharts.tsx
 * @desc ECharts 图表组件的安全封装，自动清理资源防止内存泄漏
 * @author 系统开发
 * @since 2026-02-09
 * @version 1.0.0
 *
 * --- 功能说明 ---
 * 1. 封装 echarts-for-react 组件，提供安全的图表渲染
 * 2. 组件卸载时自动清理图表实例和事件监听器
 * 3. 支持所有 ECharts 标准配置和回调
 * 4. 异常处理确保清理过程不会中断
 *
 * --- 技术要点 ---
 * - 使用 useRef 引用图表组件实例
 * - useEffect 清理函数执行资源释放
 * - 调用 echartsInstance.off() 移除事件监听
 * - 调用 echartsInstance.dispose() 销毁图表实例
 * - try-catch 包裹清理逻辑防止异常
 * - 支持自定义主题、加载状态、事件监听等
 *
 * @usage 替代 echarts-for-react 直接使用，确保图表资源正确释放
 * @warning 必须使用此组件而非直接使用 echarts-for-react，否则可能导致内存泄漏
 */

interface SafeEChartsProps {
  option: any;
  style?: React.CSSProperties;
  className?: string;
  theme?: string;
  onChartReady?: (instance: EChartsInstance) => void;
  showLoading?: boolean;
  loadingOption?: any;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onEvents?: Record<string, Function>;
}

const SafeECharts: React.FC<SafeEChartsProps> = ({
  option,
  style,
  className,
  theme,
  onChartReady,
  showLoading,
  loadingOption,
  notMerge,
  lazyUpdate,
  onEvents,
}) => {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const currentChartRef = chartRef.current;
    return () => {
      try {
        if (currentChartRef) {
          const echartsInstance = currentChartRef.getEchartsInstance();
          if (echartsInstance) {
            echartsInstance.off();
            if (typeof echartsInstance.dispose === "function") {
              echartsInstance.dispose();
            }
          }
        }
      } catch (error) {
        console.warn("ECharts dispose warning:", error);
      }
    };
  }, []);

  const handleChartReady = (instance: EChartsInstance) => {
    if (onChartReady) {
      onChartReady(instance);
    }
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={style}
      className={className}
      theme={theme}
      onChartReady={handleChartReady}
      showLoading={showLoading}
      loadingOption={loadingOption}
      notMerge={notMerge}
      lazyUpdate={lazyUpdate}
      onEvents={onEvents}
    />
  );
};

export default SafeECharts;
