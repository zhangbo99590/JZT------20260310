import React, { useState } from 'react';
import { 
  Card, 
  Space, 
  Switch, 
  Button, 
  message, 
  Typography,
  Row,
  Col,
  Select,
  TimePicker,
  Divider,
  List,
  Tag,
  Checkbox
} from 'antd';
import { 
  HomeOutlined,
  BellOutlined,
  SaveOutlined,
  DragOutlined,
  LayoutOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface ModuleItem {
  key: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface NotificationSetting {
  key: string;
  name: string;
  description: string;
  channels: {
    system: boolean;
    sms: boolean;
    email: boolean;
  };
}

const PersonalizationSettings: React.FC = () => {
  const [defaultHomePage, setDefaultHomePage] = useState<string>('home');
  const [doNotDisturbEnabled, setDoNotDisturbEnabled] = useState(false);
  const [doNotDisturbTime, setDoNotDisturbTime] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('20:00', 'HH:mm'),
    dayjs('08:00', 'HH:mm')
  ]);

  const [moduleOrder, setModuleOrder] = useState<ModuleItem[]>([
    { key: 'policy', name: '政策中心', icon: <HomeOutlined />, enabled: true },
    { key: 'opportunity', name: '商机大厅', icon: <HomeOutlined />, enabled: true },
    { key: 'financing', name: '金融服务', icon: <HomeOutlined />, enabled: true },
    { key: 'legal', name: '法律护航', icon: <HomeOutlined />, enabled: true },
    { key: 'application', name: '我的申报', icon: <HomeOutlined />, enabled: true },
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      key: 'application_progress',
      name: '申报进度更新',
      description: '当您的申报项目状态发生变化时通知您',
      channels: { system: true, sms: true, email: false }
    },
    {
      key: 'policy_update',
      name: '政策更新',
      description: '有新的政策发布或政策内容更新时通知您',
      channels: { system: true, sms: false, email: false }
    },
    {
      key: 'opportunity_match',
      name: '商机匹配',
      description: '发现与您企业匹配的商机时通知您',
      channels: { system: true, sms: false, email: true }
    },
    {
      key: 'financing_result',
      name: '融资诊断结果',
      description: '融资诊断报告生成完成时通知您',
      channels: { system: true, sms: true, email: true }
    },
    {
      key: 'contract_reminder',
      name: '合同到期提醒',
      description: '合同即将到期时提前提醒您',
      channels: { system: true, sms: true, email: false }
    },
    {
      key: 'system_announcement',
      name: '系统公告',
      description: '系统维护、功能更新等重要通知',
      channels: { system: true, sms: false, email: false }
    },
  ]);

  const handleSaveLayoutSettings = () => {
    localStorage.setItem('defaultHomePage', defaultHomePage);
    localStorage.setItem('moduleOrder', JSON.stringify(moduleOrder));
    message.success('页面布局设置已保存');
  };

  const handleSaveNotificationSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('doNotDisturbEnabled', String(doNotDisturbEnabled));
    if (doNotDisturbEnabled) {
      localStorage.setItem('doNotDisturbTime', JSON.stringify([
        doNotDisturbTime[0].format('HH:mm'),
        doNotDisturbTime[1].format('HH:mm')
      ]));
    }
    message.success('通知提醒设置已保存');
  };

  const handleModuleToggle = (key: string, enabled: boolean) => {
    setModuleOrder(moduleOrder.map(item => 
      item.key === key ? { ...item, enabled } : item
    ));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...moduleOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setModuleOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === moduleOrder.length - 1) return;
    const newOrder = [...moduleOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setModuleOrder(newOrder);
  };

  const handleNotificationChannelChange = (key: string, channel: 'system' | 'sms' | 'email', checked: boolean) => {
    setNotificationSettings(notificationSettings.map(item => 
      item.key === key 
        ? { ...item, channels: { ...item.channels, [channel]: checked } }
        : item
    ));
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card 
        title={
          <Space>
            <LayoutOutlined />
            <span>页面布局偏好</span>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSaveLayoutSettings}
          >
            保存设置
          </Button>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Text strong>默认首页模块</Text>
              </Col>
              <Col span={18}>
                <Select
                  value={defaultHomePage}
                  onChange={setDefaultHomePage}
                  style={{ width: 300 }}
                >
                  <Option value="home">系统首页</Option>
                  <Option value="policy">政策中心</Option>
                  <Option value="opportunity">商机大厅</Option>
                  <Option value="financing">金融服务</Option>
                  <Option value="legal">法律护航</Option>
                  <Option value="application">我的申报</Option>
                </Select>
              </Col>
            </Row>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 8 }}>
              设置登录后默认展示的页面
            </Text>
          </div>

          <Divider />

          <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>导航栏模块排序</Text>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
                  拖拽调整左侧导航栏的模块显示顺序，设置后仅对当前用户生效
                </Text>
              </div>
              
              <List
                bordered
                dataSource={moduleOrder}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        size="small"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                      >
                        上移
                      </Button>,
                      <Button 
                        type="text" 
                        size="small"
                        disabled={index === moduleOrder.length - 1}
                        onClick={() => handleMoveDown(index)}
                      >
                        下移
                      </Button>,
                      <Switch
                        checked={item.enabled}
                        onChange={(checked) => handleModuleToggle(item.key, checked)}
                        checkedChildren="显示"
                        unCheckedChildren="隐藏"
                      />
                    ]}
                  >
                    <Space>
                      <DragOutlined style={{ color: '#999', cursor: 'move' }} />
                      <Text strong>{index + 1}.</Text>
                      {item.icon}
                      <Text>{item.name}</Text>
                      {!item.enabled && <Tag color="default">已隐藏</Tag>}
                    </Space>
                  </List.Item>
                )}
              />
            </Space>
          </div>
        </Space>
      </Card>

      <Card 
        title={
          <Space>
            <NotificationOutlined />
            <span>通知提醒偏好</span>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSaveNotificationSettings}
          >
            保存设置
          </Button>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Text strong>免打扰模式</Text>
              </Col>
              <Col span={18}>
                <Switch
                  checked={doNotDisturbEnabled}
                  onChange={setDoNotDisturbEnabled}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </Col>
            </Row>
            
            {doNotDisturbEnabled && (
              <Row gutter={16} align="middle">
                <Col span={6}>
                  <Text>免打扰时段</Text>
                </Col>
                <Col span={18}>
                  <Space>
                    <TimePicker
                      value={doNotDisturbTime[0]}
                      format="HH:mm"
                      onChange={(time) => time && setDoNotDisturbTime([time, doNotDisturbTime[1]])}
                    />
                    <Text>至</Text>
                    <TimePicker
                      value={doNotDisturbTime[1]}
                      format="HH:mm"
                      onChange={(time) => time && setDoNotDisturbTime([doNotDisturbTime[0], time])}
                    />
                  </Space>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 8 }}>
                    在此时段内不推送短信和邮件通知，系统消息不受影响
                  </Text>
                </Col>
              </Row>
            )}
          </div>

          <Divider />

          <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>通知类型设置</Text>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
                  自定义各类通知的接收方式
                </Text>
              </div>

              <div style={{ background: '#fafafa', padding: '12px 16px', borderRadius: 4 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>通知类型</Text>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <Text strong>系统消息</Text>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <Text strong>短信</Text>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <Text strong>邮箱</Text>
                  </Col>
                </Row>
              </div>

              {notificationSettings.map((setting) => (
                <Card key={setting.key} size="small" style={{ background: '#fff' }}>
                  <Row gutter={16} align="middle">
                    <Col span={12}>
                      <Space direction="vertical" size={0}>
                        <Text strong>{setting.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {setting.description}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={setting.channels.system}
                        onChange={(e) => handleNotificationChannelChange(setting.key, 'system', e.target.checked)}
                      />
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={setting.channels.sms}
                        onChange={(e) => handleNotificationChannelChange(setting.key, 'sms', e.target.checked)}
                      />
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Checkbox
                        checked={setting.channels.email}
                        onChange={(e) => handleNotificationChannelChange(setting.key, 'email', e.target.checked)}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    </Space>
  );
};

export default PersonalizationSettings;
