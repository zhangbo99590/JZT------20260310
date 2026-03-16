/**
 * Home页面图表配置
 * 创建时间: 2026-01-13
 * 功能: 定义首页图表的配置选项
 */

/**
 * 政策申报趋势图配置
 * 配置创建时间: 2026-01-13
 */
export const getTrendChartOption = () => {
  return {
    title: {
      text: "近6个月政策申报趋势",
      textStyle: {
        fontSize: 14,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["申报数量", "通过数量"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["7月", "8月", "9月", "10月", "11月", "12月"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "申报数量",
        type: "line",
        data: [12, 15, 18, 20, 25, 23],
        itemStyle: { color: "#1890ff" },
      },
      {
        name: "通过数量",
        type: "line",
        data: [10, 13, 15, 17, 21, 20],
        itemStyle: { color: "#52c41a" },
      },
    ],
  };
};

/**
 * 智能看板-申报趋势图配置
 */
export const getSmartTrendOption = (data: any[], onPointClick?: (params: any) => void) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const monthData = data[dataIndex];
        let res = `<div style="padding: 8px;">`;
        res += `<div style="font-weight: bold; margin-bottom: 8px;">${monthData.month}</div>`;
        res += `<div style="margin-bottom: 4px;">申报数量: <span style="color: #1890ff; font-weight: bold;">${monthData.applications}</span></div>`;
        res += `<div style="margin-bottom: 4px;">成功数量: <span style="color: #52c41a; font-weight: bold;">${monthData.success}</span></div>`;
        res += `<div style="margin-bottom: 4px;">成功率: <span style="color: #722ed1; font-weight: bold;">${((monthData.success / monthData.applications) * 100).toFixed(1)}%</span></div>`;
        res += `<div style="color: #999; font-size: 12px; margin-top: 8px;">点击查看该月申报记录</div>`;
        res += `</div>`;
        return res;
      }
    },
    legend: {
      data: ['申报数量', '成功数量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.month)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '申报数量',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.applications),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '成功数量',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.success),
        itemStyle: { color: '#52c41a' }
      }
    ]
  };
};

/**
 * 智能看板-资金流向柱状图配置
 */
export const getFundFlowOption = (data: any[]) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let res = params[0].name + '<br/>';
        params.forEach((item: any) => {
          res += item.marker + item.seriesName + ': ¥' + (item.value / 10000).toFixed(0) + '万<br/>';
        });
        return res;
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.category)
    },
    series: [
      {
        name: 'Q1',
        type: 'bar',
        data: data.map(item => item.Q1),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: 'Q2',
        type: 'bar',
        data: data.map(item => item.Q2),
        itemStyle: { color: '#52c41a' }
      },
      {
        name: 'Q3',
        type: 'bar',
        data: data.map(item => item.Q3),
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: 'Q4',
        type: 'bar',
        data: data.map(item => item.Q4),
        itemStyle: { color: '#722ed1' }
      }
    ]
  };
};

/**
 * 智能看板-政策分布饼图配置
 */
export const getPolicyDistributionOption = (data: any[]) => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '政策类型',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};
