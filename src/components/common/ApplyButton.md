# ApplyButton 申报按钮组件规范

## 1. 组件概述

`ApplyButton` 是系统中统一的申报操作按钮，旨在标准化所有“立即申报”相关的交互体验。该组件根据项目状态自动处理文案、样式、禁用状态和交互逻辑。

## 2. 设计规范

### 2.1 视觉样式
- **字体**: Microsoft YaHei
- **圆角**: 6px (DESIGN_TOKENS.borderRadius)
- **阴影**: 
  - 默认: `0 2px 4px rgba(0,0,0,0.1)`
  - 悬停: `0 4px 6px rgba(0,0,0,0.15)` (仅当非禁用时)
- **过渡效果**: `all 0.3s ease`

### 2.2 状态颜色
- **立即申报 (进行中)**: Primary Blue (`#1890FF`)
- **查看进度 (已申报)**: Success Green (`#34D399`)
- **未开始/已截止**: Disabled Gray (`#9CA3AF`)

### 2.3 交互行为
- **点击**: 触发 `onApply` (申报) 或 `onViewProgress` (查看进度)。
- **悬停**: 按钮上浮 1px 并加深阴影。
- **禁用**: 鼠标样式为 `not-allowed`，无悬停效果。
- **Tooltip**: 
  - 进行中: "点击立即开始申报"
  - 已申报: "点击查看申报进度"
  - 未开始: "当前项目尚未开始申报"
  - 已截止: "当前项目申报已截止"

## 3. 组件接口 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|Data |Type |Default |Description |
|---|---|---|---|
| status | `'not_started' \| 'in_progress' \| 'ended'` | `'in_progress'` | 项目当前的申报状态 |
| isApplied | `boolean` | `false` | 用户是否已申报该项目 |
| onApply | `() => void` | - | 点击"立即申报"时的回调 |
| onViewProgress | `() => void` | - | 点击"查看进度"时的回调 (若不提供则使用 `onClick`) |
| showTooltip | `boolean` | `true` | 是否显示 Tooltip 提示 |
| customTooltip | `string` | - | 自定义 Tooltip 内容 (覆盖默认逻辑) |
| size | `'large' \| 'middle' \| 'small'` | `'middle'` | 按钮尺寸 |
| style | `React.CSSProperties` | - | 自定义样式覆盖 |

## 4. 使用示例

```tsx
import ApplyButton from '@/components/common/ApplyButton';

// 基础用法
<ApplyButton 
  status="in_progress" 
  onApply={() => console.log('Apply')} 
/>

// 已申报状态
<ApplyButton 
  status="in_progress" 
  isApplied={true} 
  onViewProgress={() => console.log('View Progress')} 
/>

// 自定义样式与提示
<ApplyButton 
  status="ended" 
  customTooltip="该项目已于昨日截止"
  style={{ width: 120 }}
/>
```
