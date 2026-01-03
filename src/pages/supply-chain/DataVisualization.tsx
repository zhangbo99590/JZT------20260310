import React from 'react';
import { 
  Card, 
  Typography,
  Empty
} from 'antd';

const { Title } = Typography;

interface DataVisualizationProps {}

const DataVisualization: React.FC<DataVisualizationProps> = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '16px' }}>
            数据可视化
          </Title>
          <Empty 
            description="页面内容已清空，保留模块名称"
            style={{ marginTop: '40px' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default DataVisualization;