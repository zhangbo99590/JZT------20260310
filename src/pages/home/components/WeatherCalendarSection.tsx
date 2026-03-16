/**
 * 今日日程组件
 * 创建时间: 2026-02-26
 * 更新时间: 2026-03-04
 * 功能: 显示今日日程和申报提醒，支持折叠展开
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Badge, List, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Collapse, message } from 'antd';
import { 
  CalendarOutlined, 
  PlusOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
  priority: 'high' | 'medium' | 'low';
  relatedPolicy?: string;
}

export const WeatherCalendarSection: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: '技术创新补贴申报截止',
      time: '14:00',
      type: 'deadline',
      priority: 'high',
      relatedPolicy: '2026年技术创新补贴项目'
    },
    {
      id: 2,
      title: '政策解读会议',
      time: '16:30',
      type: 'meeting',
      priority: 'medium',
      relatedPolicy: '高新技术企业认定'
    },
    {
      id: 3,
      title: '财务材料准备提醒',
      time: '09:00',
      type: 'reminder',
      priority: 'low',
      relatedPolicy: '研发费用加计扣除'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [form] = Form.useForm();

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'high') return '#ff4d4f';
    if (type === 'meeting') return '#1890ff';
    if (type === 'deadline') return '#fa8c16';
    return '#52c41a';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <ClockCircleOutlined />;
      case 'deadline': return <ThunderboltOutlined />;
      default: return <CalendarOutlined />;
    }
  };

  const handleAddEvent = () => {
    form.validateFields().then(values => {
      const newEvent: CalendarEvent = {
        id: Date.now(),
        title: values.title,
        time: values.time.format('HH:mm'),
        type: values.type,
        priority: values.priority,
        relatedPolicy: values.relatedPolicy
      };
      setEvents(prev => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)));
      setIsModalVisible(false);
      form.resetFields();
      message.success('日程添加成功！');
    });
  };

  return (
    <Card
      className="hover-card"
      style={{ marginBottom: '24px' }}
    >
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? '16px' : '0'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarOutlined style={{ color: '#fa8c16', marginRight: '8px', fontSize: '18px' }} />
          <Title level={4} style={{ margin: 0 }}>
            今日日程
          </Title>
          <Badge 
            count={events.length} 
            style={{ backgroundColor: '#fa8c16', marginLeft: '12px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(true);
            }}
          >
            添加日程
          </Button>
          {isExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {isExpanded && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs().format('YYYY年MM月DD日 dddd')}
            </Text>
          </div>
          <List
            dataSource={events}
            renderItem={(event) => (
              <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Badge 
                    color={getEventColor(event.type, event.priority)} 
                    style={{ marginRight: '12px', marginTop: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <Text strong style={{ fontSize: '14px' }}>
                        {event.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {event.time}
                      </Text>
                    </div>
                    {event.relatedPolicy && (
                      <div style={{ marginBottom: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          关联政策：{event.relatedPolicy}
                        </Text>
                      </div>
                    )}
                    <div>
                      {getEventIcon(event.type)}
                      <Text type="secondary" style={{ fontSize: '12px', marginLeft: '4px' }}>
                        {event.type === 'meeting' ? '会议' : 
                         event.type === 'deadline' ? '截止日期' : '提醒'}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </>
      )}

      {/* 添加日程弹窗 */}
      <Modal
        title="添加日程"
        open={isModalVisible}
        onOk={handleAddEvent}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={500}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="事件标题"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input placeholder="请输入事件标题" />
          </Form.Item>
          <Form.Item
            name="relatedPolicy"
            label="关联政策项目"
          >
            <Input placeholder="请输入关联的政策项目（可选）" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="time"
                label="提醒时间"
                rules={[{ required: true, message: '请选择时间' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select placeholder="请选择类型">
                  <Option value="meeting">会议</Option>
                  <Option value="deadline">截止日期</Option>
                  <Option value="reminder">提醒</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
