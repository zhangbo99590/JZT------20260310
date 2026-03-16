import React from 'react';
import { Modal, Button, Table, Tag, Rate, Progress, Space, message, Typography } from 'antd';
import { DownloadOutlined, SafetyCertificateFilled } from '@ant-design/icons';

const { Text, Title } = Typography;

interface ComparisonModalProps {
  open: boolean;
  onCancel: () => void;
  items: any[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ open, onCancel, items }) => {
  
  const handleExport = () => {
    message.loading({ content: '正在生成对比报告...', key: 'export' });
    setTimeout(() => {
      message.success({ content: '对比报告导出成功！', key: 'export' });
    }, 1500);
  };

  const columns = [
    {
      title: '对比维度',
      dataIndex: 'dimension',
      key: 'dimension',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => <Text strong>{text}</Text>,
      onCell: (record: any) => {
        return {
          style: { backgroundColor: '#fafafa' }
        };
      }
    },
    ...items.map((item, index) => ({
      title: (
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{item.name}</div>
          {item.isRecommend && <Tag color="red">推荐</Tag>}
        </div>
      ),
      dataIndex: `item_${index}`,
      key: `item_${index}`,
      width: 250,
      render: (val: any, record: any) => {
          if (record.type === 'tags') {
              return (
                  <Space size={[0, 8]} wrap>
                      {val.map((tag: string) => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                  </Space>
              );
          }
          if (record.type === 'rate') {
              return <Rate disabled allowHalf defaultValue={val} style={{ fontSize: 14 }} />;
          }
          return val;
      }
    }))
  ];

  const dataSource = [
    {
      key: 'region',
      dimension: '所在地区',
      ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: item.region }), {})
    },
    {
        key: 'qual',
        dimension: '企业资质',
        ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: (
            <Space>
                <SafetyCertificateFilled style={{ color: '#faad14' }} />
                {item.qualification || '未认证'}
            </Space>
        ) }), {})
    },
    {
      key: 'score',
      dimension: '质量评分',
      type: 'rate',
      ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: item.score }), {})
    },
    {
      key: 'tags',
      dimension: '业务标签',
      type: 'tags',
      ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: item.tags }), {})
    },
    {
      key: 'scope',
      dimension: '需求/业务',
      ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: item.scope }), {})
    },
    {
        key: 'budget',
        dimension: '预算/规模',
        ...items.reduce((acc, item, idx) => ({ ...acc, [`item_${idx}`]: item.budget || '-' }), {})
    }
  ];

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>企业横向对比</Title>}
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>关闭</Button>,
        <Button key="export" type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          导出对比报告
        </Button>
      ]}
      styles={{ body: { padding: '24px 0' } }}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </Modal>
  );
};

export default ComparisonModal;
