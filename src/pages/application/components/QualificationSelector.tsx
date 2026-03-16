/**
 * 增强版资质类型选择器
 * 创建时间: 2026-03-04
 * 功能: 支持分组、搜索、多选、视觉区分的资质选择组件
 */

import React, { useState, useMemo } from 'react';
import { Select, Tag, Tooltip, Space, Button, Divider, Input } from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  SwapOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import type { SelectProps } from 'antd';

const { OptGroup, Option } = Select;

// 资质类型定义
interface QualificationType {
  value: string;
  label: string;
  level: 'national' | 'local' | 'industry' | 'innovation';
  region?: string;
  description: string;
  applicableIndustries: string[];
  conditions: string[];
  benefits: string[];
  isHighFrequency?: boolean;
  pinyin?: string;
}

// 资质分组定义
interface QualificationGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  qualifications: QualificationType[];
}

// 完整的资质数据
const QUALIFICATION_DATA: QualificationGroup[] = [
  {
    key: 'national',
    label: '国家级资质',
    icon: <TrophyOutlined />,
    color: '#ff4d4f',
    qualifications: [
      {
        value: 'national_high_tech',
        label: '国家高新技术企业认定',
        level: 'national',
        description: '国家级科技型企业认定，享受15%企业所得税优惠',
        applicableIndustries: ['电子信息', '生物医药', '新材料', '高技术服务'],
        conditions: ['研发费用占比≥4%', '高新技术产品收入占比≥60%', '科技人员占比≥10%'],
        benefits: ['企业所得税减免至15%', '研发费用加计扣除', '优先获得政府项目支持'],
        isHighFrequency: true,
        pinyin: 'gjgxjsqyrd'
      },
      {
        value: 'national_specialized',
        label: '专精特新"小巨人"企业',
        level: 'national',
        description: '国家级专精特新企业最高荣誉，享受多项政策扶持',
        applicableIndustries: ['制造业', '信息技术', '新材料'],
        conditions: ['营收增长率≥5%', '研发强度≥3%', '主导产品市场占有率高'],
        benefits: ['最高500万元奖励', '优先推荐上市', '金融支持'],
        isHighFrequency: true,
        pinyin: 'zjxtxjrqy'
      },
      {
        value: 'national_innovation_platform',
        label: '国家级企业技术中心',
        level: 'national',
        description: '国家认定的企业技术创新平台',
        applicableIndustries: ['制造业', '高新技术产业'],
        conditions: ['年研发投入≥3000万', '拥有省级以上研发平台', '技术人员≥100人'],
        benefits: ['设备进口免税', '研发费用加计扣除', '政府项目优先'],
        pinyin: 'gjjqyjszx'
      },
      {
        value: 'national_tech_innovation',
        label: '国家技术创新示范企业',
        level: 'national',
        description: '国家级技术创新标杆企业',
        applicableIndustries: ['制造业', '电子信息', '生物医药'],
        conditions: ['拥有自主知识产权', '创新能力强', '示范作用明显'],
        benefits: ['政策优先支持', '品牌提升', '市场认可度高'],
        pinyin: 'gjjscxsfqy'
      }
    ]
  },
  {
    key: 'local_beijing',
    label: '地方级资质 - 北京市',
    icon: <EnvironmentOutlined />,
    color: '#1890ff',
    qualifications: [
      {
        value: 'beijing_specialized',
        label: '北京市专精特新中小企业',
        level: 'local',
        region: '北京市',
        description: '北京市级专精特新企业认定',
        applicableIndustries: ['制造业', '软件信息', '科技服务'],
        conditions: ['营收≥1000万', '研发费用≥100万', '细分市场占有率前列'],
        benefits: ['最高100万元奖励', '融资支持', '政策优先'],
        isHighFrequency: true,
        pinyin: 'bjszjxtxzxqy'
      },
      {
        value: 'beijing_high_growth',
        label: '北京市高成长企业',
        level: 'local',
        region: '北京市',
        description: '北京市高成长性企业认定',
        applicableIndustries: ['科技服务', '文化创意', '现代服务业'],
        conditions: ['连续3年营收增长≥20%', '创新能力强'],
        benefits: ['资金奖励', '融资便利', '政策扶持'],
        pinyin: 'bjsgczqy'
      },
      {
        value: 'beijing_innovation_center',
        label: '北京市企业技术中心',
        level: 'local',
        region: '北京市',
        description: '北京市级企业技术创新平台',
        applicableIndustries: ['制造业', '高新技术'],
        conditions: ['年研发投入≥500万', '拥有研发团队', '创新成果显著'],
        benefits: ['研发补贴', '项目支持', '平台建设资金'],
        pinyin: 'bjsqyjszx'
      }
    ]
  },
  {
    key: 'local_shanghai',
    label: '地方级资质 - 上海市',
    icon: <EnvironmentOutlined />,
    color: '#1890ff',
    qualifications: [
      {
        value: 'shanghai_specialized',
        label: '上海市专精特新企业',
        level: 'local',
        region: '上海市',
        description: '上海市级专精特新企业认定',
        applicableIndustries: ['先进制造', '生物医药', '集成电路'],
        conditions: ['主营业务突出', '创新能力强', '成长性好'],
        benefits: ['资金支持', '融资便利', '政策优惠'],
        pinyin: 'shszjxtxqy'
      },
      {
        value: 'shanghai_tech_giant',
        label: '上海市科技小巨人企业',
        level: 'local',
        region: '上海市',
        description: '上海市科技型中小企业领军者',
        applicableIndustries: ['电子信息', '生物医药', '新材料'],
        conditions: ['拥有核心技术', '市场前景好', '成长性强'],
        benefits: ['最高200万元资助', '优先推荐认定', '融资支持'],
        pinyin: 'shskjxjrqy'
      }
    ]
  },
  {
    key: 'local_shenzhen',
    label: '地方级资质 - 深圳市',
    icon: <EnvironmentOutlined />,
    color: '#1890ff',
    qualifications: [
      {
        value: 'shenzhen_specialized',
        label: '深圳市专精特新企业',
        level: 'local',
        region: '深圳市',
        description: '深圳市级专精特新企业认定',
        applicableIndustries: ['电子信息', '智能制造', '生物医药'],
        conditions: ['专业化程度高', '创新能力强', '市场竞争力强'],
        benefits: ['资金奖励', '政策支持', '品牌提升'],
        pinyin: 'szszjxtxqy'
      },
      {
        value: 'shenzhen_high_tech',
        label: '深圳市高新技术企业',
        level: 'local',
        region: '深圳市',
        description: '深圳市级高新技术企业认定',
        applicableIndustries: ['高新技术产业'],
        conditions: ['研发投入占比≥3%', '高新产品收入占比≥50%'],
        benefits: ['税收优惠', '政策扶持', '项目支持'],
        pinyin: 'szsgxjsqy'
      }
    ]
  },
  {
    key: 'industry',
    label: '行业专项资质',
    icon: <SafetyOutlined />,
    color: '#52c41a',
    qualifications: [
      {
        value: 'software_enterprise',
        label: '软件企业认定',
        level: 'industry',
        description: '软件行业专项认定，享受税收优惠',
        applicableIndustries: ['软件和信息技术服务业'],
        conditions: ['软件产品收入占比≥50%', '研发人员占比≥40%'],
        benefits: ['企业所得税两免三减半', '增值税即征即退', '进口免税'],
        pinyin: 'rjqyrd'
      },
      {
        value: 'integrated_circuit',
        label: '集成电路设计企业认定',
        level: 'industry',
        description: '集成电路行业专项认定',
        applicableIndustries: ['集成电路设计'],
        conditions: ['IC设计收入占比≥60%', '研发费用占比≥6%'],
        benefits: ['企业所得税优惠', '增值税退税', '项目支持'],
        pinyin: 'jcdlsjqyrd'
      },
      {
        value: 'animation_enterprise',
        label: '动漫企业认定',
        level: 'industry',
        description: '动漫行业专项认定',
        applicableIndustries: ['动漫产业'],
        conditions: ['动漫产品收入占比≥50%', '拥有自主版权'],
        benefits: ['增值税即征即退', '所得税优惠', '项目扶持'],
        pinyin: 'dmqyrd'
      },
      {
        value: 'green_factory',
        label: '绿色工厂认定',
        level: 'industry',
        description: '工业绿色发展专项认定',
        applicableIndustries: ['制造业'],
        conditions: ['能源利用高效', '污染排放低', '资源综合利用好'],
        benefits: ['政策支持', '项目优先', '品牌提升'],
        pinyin: 'lsgcrd'
      }
    ]
  },
  {
    key: 'innovation',
    label: '创新平台资质',
    icon: <ExperimentOutlined />,
    color: '#722ed1',
    qualifications: [
      {
        value: 'key_laboratory',
        label: '重点实验室',
        level: 'innovation',
        description: '科研创新平台认定',
        applicableIndustries: ['科研机构', '高校', '企业'],
        conditions: ['研究方向明确', '研究基础好', '人才队伍强'],
        benefits: ['科研经费支持', '人才引进便利', '项目优先'],
        pinyin: 'zdsys'
      },
      {
        value: 'engineering_center',
        label: '工程技术研究中心',
        level: 'innovation',
        description: '工程技术创新平台',
        applicableIndustries: ['制造业', '工程技术'],
        conditions: ['技术研发能力强', '成果转化好', '产学研结合紧密'],
        benefits: ['平台建设资金', '项目支持', '成果转化便利'],
        pinyin: 'gcjsyjzx'
      },
      {
        value: 'innovation_alliance',
        label: '产业技术创新战略联盟',
        level: 'innovation',
        description: '产业协同创新平台',
        applicableIndustries: ['各行业'],
        conditions: ['成员单位≥10家', '协同创新机制完善', '成果显著'],
        benefits: ['项目支持', '资源共享', '政策优先'],
        pinyin: 'cyjscxzllm'
      },
      {
        value: 'maker_space',
        label: '众创空间',
        level: 'innovation',
        description: '创新创业服务平台',
        applicableIndustries: ['创新创业服务'],
        conditions: ['场地≥500㎡', '服务团队专业', '孵化成效好'],
        benefits: ['运营补贴', '项目支持', '政策优惠'],
        pinyin: 'zckj'
      }
    ]
  }
];

interface QualificationSelectorProps extends Omit<SelectProps, 'options'> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const QualificationSelector: React.FC<QualificationSelectorProps> = ({
  value = [],
  onChange,
  ...restProps
}) => {
  const [searchText, setSearchText] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // 获取所有资质的扁平列表
  const allQualifications = useMemo(() => {
    return QUALIFICATION_DATA.flatMap(group => 
      group.qualifications.map(q => ({ ...q, groupKey: group.key, groupColor: group.color }))
    );
  }, []);

  // 高频资质
  const highFrequencyQualifications = useMemo(() => {
    return allQualifications.filter(q => q.isHighFrequency);
  }, [allQualifications]);

  // 搜索过滤
  const filteredGroups = useMemo(() => {
    if (!searchText) return QUALIFICATION_DATA;

    const lowerSearch = searchText.toLowerCase();
    return QUALIFICATION_DATA.map(group => ({
      ...group,
      qualifications: group.qualifications.filter(q => 
        q.label.toLowerCase().includes(lowerSearch) ||
        q.pinyin?.includes(lowerSearch) ||
        q.description.toLowerCase().includes(lowerSearch)
      )
    })).filter(group => group.qualifications.length > 0);
  }, [searchText]);

  // 处理全选/反选
  const handleGroupAction = (groupKey: string, action: 'selectAll' | 'invert') => {
    const group = QUALIFICATION_DATA.find(g => g.key === groupKey);
    if (!group) return;

    const groupValues = group.qualifications.map(q => q.value);
    let newValue: string[];

    if (action === 'selectAll') {
      // 全选：添加该组所有未选中的项
      newValue = [...new Set([...value, ...groupValues])];
    } else {
      // 反选：已选的移除，未选的添加
      const selectedInGroup = value.filter(v => groupValues.includes(v));
      const unselectedInGroup = groupValues.filter(v => !value.includes(v));
      newValue = value.filter(v => !groupValues.includes(v)).concat(unselectedInGroup);
    }

    onChange?.(newValue);
  };

  // 渲染资质选项
  const renderOption = (qualification: QualificationType & { groupColor: string }) => {
    const levelConfig = {
      national: { color: '#ff4d4f', text: '国家级' },
      local: { color: '#1890ff', text: '地方级' },
      industry: { color: '#52c41a', text: '行业级' },
      innovation: { color: '#722ed1', text: '平台级' }
    };

    const config = levelConfig[qualification.level];

    return (
      <Option key={qualification.value} value={qualification.value}>
        <Tooltip
          title={
            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>{qualification.label}</strong>
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>适用行业：</strong>{qualification.applicableIndustries.join('、')}
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>申报条件：</strong>
                <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                  {qualification.conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>核心价值：</strong>{qualification.benefits.join('、')}
              </div>
            </div>
          }
          placement="right"
          overlayStyle={{ maxWidth: 400 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              {qualification.isHighFrequency && (
                <Tag color="gold" style={{ margin: 0 }}>热门</Tag>
              )}
              <span style={{ fontWeight: qualification.level === 'national' ? 'bold' : 'normal' }}>
                {qualification.label}
              </span>
            </Space>
            <Tag color={config.color} style={{ margin: 0 }}>
              {config.text}
            </Tag>
          </div>
        </Tooltip>
      </Option>
    );
  };

  // 自定义下拉渲染
  const dropdownRender = (menu: React.ReactElement) => (
    <div>
      {/* 搜索框 */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索资质名称或拼音首字母"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      {/* 高频资质置顶 */}
      {!searchText && highFrequencyQualifications.length > 0 && (
        <>
          <div style={{ padding: '8px 12px', background: '#fafafa', fontWeight: 'bold', fontSize: 12 }}>
            <Space>
              <TrophyOutlined style={{ color: '#faad14' }} />
              高频资质（推荐）
            </Space>
          </div>
          <div style={{ padding: '4px 0' }}>
            {highFrequencyQualifications.map(q => renderOption(q))}
          </div>
          <Divider style={{ margin: 0 }} />
        </>
      )}

      {/* 分组资质 */}
      {filteredGroups.map(group => (
        <div key={group.key}>
          <div 
            style={{ 
              padding: '8px 12px', 
              background: '#fafafa', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Space style={{ fontWeight: 'bold', fontSize: 12 }}>
              {group.icon}
              <span style={{ color: group.color }}>{group.label}</span>
              <span style={{ color: '#999', fontWeight: 'normal' }}>
                ({group.qualifications.length}项)
              </span>
            </Space>
            <Space size={4}>
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleGroupAction(group.key, 'selectAll')}
              >
                全选
              </Button>
              <Button
                type="text"
                size="small"
                icon={<SwapOutlined />}
                onClick={() => handleGroupAction(group.key, 'invert')}
              >
                反选
              </Button>
            </Space>
          </div>
          <div style={{ padding: '4px 0' }}>
            {group.qualifications.map(q => renderOption({ ...q, groupKey: group.key, groupColor: group.color }))}
          </div>
        </div>
      ))}

      {filteredGroups.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          未找到匹配的资质类型
        </div>
      )}
    </div>
  );

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder="请选择申报资质类型（支持多选）"
      size="large"
      showSearch={false}
      maxTagCount="responsive"
      dropdownRender={dropdownRender}
      optionFilterProp="children"
      style={{ width: '100%' }}
      {...restProps}
    >
      {/* 这里的children会被dropdownRender覆盖，但保留以满足类型要求 */}
      {allQualifications.map(q => (
        <Option key={q.value} value={q.value}>
          {q.label}
        </Option>
      ))}
    </Select>
  );
};

export default QualificationSelector;
export { QUALIFICATION_DATA };
export type { QualificationType, QualificationGroup };
