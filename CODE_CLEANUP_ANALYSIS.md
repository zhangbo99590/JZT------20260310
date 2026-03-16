# 代码清理分析报告

**分析日期**: 2026-03-04  
**分析范围**: 重复和冗余代码检查

---

## 一、发现的重复文件

### 1. PolicyDetail 组件重复（3个文件）

#### 文件清单：
1. **`src/pages/policy/PolicyDetail.tsx`** (23,987 bytes)
   - 原始政策详情页
   - 较简单的实现
   - **状态**: ❌ 已被 EnhancedPolicyDetail 替代

2. **`src/pages/policy/EnhancedPolicyDetail.tsx`** (34,023 bytes)
   - 增强版政策详情页（2026-03-04创建）
   - 完整功能：申报状态、竞争力分析、专家咨询等
   - **状态**: ✅ 当前使用中（路由已指向）

3. **`src/pages/application/PolicyDetail.tsx`** (62,612 bytes)
   - 申报管理模块的政策详情页
   - 包含申报流程、审核日志等
   - **状态**: ✅ 当前使用中（不同路由）

#### 路由配置：
```typescript
// src/routes/index.tsx
// 政策中心路由
<Route path="/policy-center/detail/:id" element={<Pages.EnhancedPolicyDetail />} />

// 申报管理路由
<Route path="/application/detail/:id" element={<Pages.ApplicationPolicyDetail />} />
```

#### 结论：
- ✅ **保留**: `EnhancedPolicyDetail.tsx` - 政策中心使用
- ✅ **保留**: `application/PolicyDetail.tsx` - 申报管理使用
- ❌ **删除**: `policy/PolicyDetail.tsx` - 已被替代，未被使用

---

### 2. QualificationSelector 组件（2个文件）

#### 文件清单：
1. **`src/pages/application/components/QualificationSelector.tsx`** (18,312 bytes)
   - 下拉式资质选择器（旧版）
   - 提供 QUALIFICATION_DATA 数据源
   - **状态**: ⚠️ 仅作为数据源使用

2. **`src/pages/application/components/QualificationDrawer.tsx`** (14,958 bytes)
   - 抽屉式资质选择器（新版，2026-03-04创建）
   - 依赖 QualificationSelector 的数据
   - **状态**: ✅ 当前使用中

#### 使用情况：
```typescript
// ApplyWizardWithLayout.tsx
import QualificationDrawer from './components/QualificationDrawer';
import { QUALIFICATION_DATA } from './components/QualificationSelector';
```

#### 结论：
- ✅ **保留**: `QualificationSelector.tsx` - 提供数据源
- ✅ **保留**: `QualificationDrawer.tsx` - 当前使用的UI组件

---

### 3. AIPolicySearch 组件

#### 文件清单：
1. **`src/pages/policy/AIPolicySearch.tsx`** (155,820 bytes)
   - 完整的AI政策搜索页面
   - **状态**: ✅ 当前使用中

2. **`src/pages/policy/AIPolicySearchMinimal.tsx`** (16,572 bytes)
   - 精简版AI政策搜索
   - **状态**: ❓ 需要确认是否使用

#### 路由检查：
```typescript
// src/routes/index.tsx
<Route path="/policy-center/main" element={<Pages.AIPolicySearchV2 />} />
// AIPolicySearchV2 指向 AIPolicySearch.tsx
```

#### 结论：
- ✅ **保留**: `AIPolicySearch.tsx` - 当前使用
- ❓ **待确认**: `AIPolicySearchMinimal.tsx` - 可能是备用或测试版本

---

## 二、建议的清理操作

### 立即删除（安全）：
1. ❌ `src/pages/policy/PolicyDetail.tsx` - 已被 EnhancedPolicyDetail 完全替代

### 待确认后删除：
1. ❓ `src/pages/policy/AIPolicySearchMinimal.tsx` - 需确认是否有其他地方引用

### 保留但需优化：
1. ⚠️ `src/pages/application/components/QualificationSelector.tsx`
   - 建议：将 QUALIFICATION_DATA 提取到独立的数据文件
   - 原因：避免组件文件过大，提高可维护性

---

## 三、清理后的文件结构

```
src/pages/
├── policy/
│   ├── AIPolicySearch.tsx ✅
│   ├── EnhancedPolicyDetail.tsx ✅ (替代了 PolicyDetail.tsx)
│   ├── PolicyApprovedList.tsx ✅
│   ├── components/ ✅
│   └── data.ts ✅
│
└── application/
    ├── index.tsx ✅
    ├── PolicyDetail.tsx ✅ (申报详情，不同于政策详情)
    ├── ApplyWizardWithLayout.tsx ✅
    ├── ApplySuccess.tsx ✅
    ├── MyApplications.tsx ✅
    └── components/
        ├── QualificationDrawer.tsx ✅ (新版UI)
        └── QualificationSelector.tsx ✅ (数据源)
```

---

## 四、路由配置验证

### 当前路由映射：
```typescript
// 政策中心
/policy-center/main → AIPolicySearch.tsx ✅
/policy-center/detail/:id → EnhancedPolicyDetail.tsx ✅

// 申报管理
/application → index.tsx ✅
/application/detail/:id → application/PolicyDetail.tsx ✅
/application/apply/:id → ApplyWizardWithLayout.tsx ✅
```

### 验证结果：
✅ 所有路由指向正确的组件  
✅ 没有路由指向已删除的文件  
✅ 没有循环依赖

---

## 五、依赖关系检查

### EnhancedPolicyDetail 依赖：
- ✅ React, Ant Design
- ✅ ReactECharts
- ✅ dayjs
- ✅ react-router-dom

### QualificationDrawer 依赖：
- ✅ QualificationSelector (仅导入数据)
- ✅ Ant Design Drawer
- ✅ React Hooks

### 无循环依赖 ✅

---

## 六、建议的清理步骤

### 步骤1: 删除冗余文件
```bash
# 删除已被替代的 PolicyDetail
rm src/pages/policy/PolicyDetail.tsx
```

### 步骤2: 验证项目启动
```bash
npm run dev
# 或
yarn dev
```

### 步骤3: 测试关键路由
- [ ] /policy-center/main
- [ ] /policy-center/detail/1
- [ ] /application
- [ ] /application/detail/1
- [ ] /application/apply/1

### 步骤4: 检查控制台错误
- [ ] 无导入错误
- [ ] 无路由404错误
- [ ] 无组件渲染错误

---

## 七、风险评估

### 低风险操作：
✅ 删除 `policy/PolicyDetail.tsx` - 已确认未被使用

### 中风险操作：
⚠️ 删除 `AIPolicySearchMinimal.tsx` - 需要先全局搜索引用

### 建议：
1. 先删除确认未使用的文件
2. 提交代码到版本控制
3. 测试所有功能正常
4. 再考虑删除其他可疑文件

---

## 八、优化建议

### 1. 数据分离
将 `QUALIFICATION_DATA` 从组件文件提取到：
```
src/pages/application/data/qualifications.ts
```

### 2. 类型定义统一
创建共享类型文件：
```
src/pages/application/types/qualification.ts
```

### 3. 组件命名规范
- PolicyDetail (policy) → 已删除
- EnhancedPolicyDetail (policy) → 保留
- PolicyDetail (application) → 考虑重命名为 ApplicationDetail

---

**清理建议**: 立即删除 `src/pages/policy/PolicyDetail.tsx`，其他文件保持现状，项目可正常运行。
