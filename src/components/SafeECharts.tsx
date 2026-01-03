import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsInstance } from 'echarts-for-react';

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

/**
 * 安全的ECharts组件，解决ResizeObserver disconnect错误
 */
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
  onEvents
}) => {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    return () => {
      // 组件卸载时安全清理ECharts实例
      try {
        if (chartRef.current) {
          const echartsInstance = chartRef.current.getEchartsInstance();
          if (echartsInstance) {
            // 先手动移除事件监听器
            echartsInstance.off();
            // 再安全地调用dispose
            if (typeof echartsInstance.dispose === 'function') {
              echartsInstance.dispose();
            }
          }
        }
      } catch (error) {
        // 忽略dispose时的错误
        console.warn('ECharts dispose warning:', error);
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
