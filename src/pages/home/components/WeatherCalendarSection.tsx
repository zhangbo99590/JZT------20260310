/**
 * 天气与日历组件
 * 创建时间: 2026-02-26
 * 功能: 显示实时天气信息和工作日历
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Badge, List, Button, Modal, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import { 
  CloudOutlined, 
  CalendarOutlined, 
  PlusOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  city: string;
  icon: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'reminder';
  priority: 'high' | 'medium' | 'low';
}

export const WeatherCalendarSection: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: '晴朗',
    humidity: 65,
    windSpeed: 12,
    city: '北京',
    icon: '☀️'
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: '技术创新补贴申报截止',
      time: '14:00',
      type: 'deadline',
      priority: 'high'
    },
    {
      id: 2,
      title: '政策解读会议',
      time: '16:30',
      type: 'meeting',
      priority: 'medium'
    },
    {
      id: 3,
      title: '财务材料准备提醒',
      time: '09:00',
      type: 'reminder',
      priority: 'low'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟获取天气数据
  useEffect(() => {
    const fetchWeather = () => {
      // 模拟天气数据更新
      const conditions = ['晴朗', '多云', '小雨', '阴天'];
      const icons = ['☀️', '⛅', '🌧️', '☁️'];
      const randomIndex = Math.floor(Math.random() * conditions.length);
      
      setWeather(prev => ({
        ...prev,
        temperature: 18 + Math.floor(Math.random() * 15),
        condition: conditions[randomIndex],
        icon: icons[randomIndex],
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 20)
      }));
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5分钟更新一次
    return () => clearInterval(interval);
  }, []);

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
        priority: values.priority
      };
      setEvents(prev => [...prev, newEvent]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Row gutter={[16, 16]}>
      {/* 天气信息卡片 */}
      <Col xs={24} md={12}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CloudOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              实时天气
            </div>
          }
          style={{ height: '280px' }}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {weather.icon}
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
              {weather.temperature}°C
            </Title>
            <Text style={{ fontSize: '16px', color: '#666' }}>
              {weather.condition}
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div>
                    <EnvironmentOutlined style={{ color: '#52c41a' }} />
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {weather.city}
                    </div>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div>
                    <Text strong>{weather.humidity}%</Text>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      湿度
                    </div>
                  </div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div>
                    <Text strong>{weather.windSpeed}km/h</Text>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      风速
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </Col>

      {/* 今日日程卡片 */}
      <Col xs={24} md={12}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
              今日日程
            </div>
          }
          extra={
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              添加
            </Button>
          }
          style={{ height: '280px' }}
        >
          <div style={{ height: '180px', overflowY: 'auto' }}>
            <List
              dataSource={events}
              renderItem={(event) => (
                <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Badge 
                      color={getEventColor(event.type, event.priority)} 
                      style={{ marginRight: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '13px' }}>
                          {event.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {event.time}
                        </Text>
                      </div>
                      <div style={{ marginTop: '2px' }}>
                        {getEventIcon(event.type)}
                        <Text type="secondary" style={{ fontSize: '11px', marginLeft: '4px' }}>
                          {event.type === 'meeting' ? '会议' : 
                           event.type === 'deadline' ? '截止' : '提醒'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs().format('YYYY年MM月DD日 dddd')}
            </Text>
          </div>
        </Card>
      </Col>

      {/* 添加日程弹窗 */}
      <Modal
        title="添加日程"
        open={isModalVisible}
        onOk={handleAddEvent}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="事件标题"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input placeholder="请输入事件标题" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="time"
                label="时间"
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
    </Row>
  );
};
