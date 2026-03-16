# 编码规范 (Coding Guidelines)

## 1. 项目结构规范 (Project Structure Standards)

本项目采用模块化与分层相结合的目录结构，所有源代码位于 `src` 目录下。

- **目录职责**:
  - `src/components/`: **全局公共组件**。仅存放跨业务通用的基础组件（如 `ApplyButton`, `SkeletonLoader`）。
  - `src/pages/`: **页面视图**。按业务路由划分，每个页面文件夹包含该页面专属的组件、配置和样式。
  - `src/layouts/`: **布局组件**。存放全局布局（如 `MainLayout`）。
  - `src/hooks/`: **全局 Hooks**。存放跨业务复用的自定义 Hooks（如 `useDebounce`）。
  - `src/services/`: **API 服务**。存放后端接口请求封装，按业务模块划分文件。
  - `src/utils/`: **工具函数**。存放纯函数工具（如日期格式化、数据转换）。
  - `src/types/`: **类型定义**。存放全局 TypeScript 类型定义。
  - `src/config/`: **全局配置**。存放静态配置项、菜单配置、图表配置等。
  - `src/context/`: **全局状态**。存放 React Context 定义（如 `AuthContext`）。
  - `src/styles/`: **全局样式**。存放 Tailwind 配置扩展或全局 CSS 变量。

- **引用原则**:
  - **就近原则**: 页面专属的子组件、样式、工具函数应优先存放在该页面目录下，而非全局目录。
  - **禁止循环依赖**: 避免组件间产生循环引用。
  - **路径别名**: 使用 `@/` 前缀引用 `src` 下的资源，避免使用 `../../` 等相对路径。

## 2. 技术栈限制 (Tech Stack Constraints)

为维护项目的一致性和可维护性，需严格遵守以下技术选型限制。

- **核心框架**:
  - **React 18+**: 使用 Functional Components + Hooks 模式，**严禁**使用 Class Components（错误边界 ErrorBoundary 除外）。
  - **TypeScript**: 推荐启用严格类型检查（当前项目暂未开启 strict 模式，建议逐步迁移），**严禁**随意使用 `any`。
  - **Vite**: 构建工具。

- **UI 组件库**:
  - **Ant Design 5**: 基础组件库。
  - **Tailwind CSS**: 样式优先使用 Tailwind Utility Classes，复杂样式可使用 CSS Modules。
  - **Lucide React / Ant Design Icons**: 图标库。

- **数据处理**:
  - **Day.js**: 日期处理库（**严禁**引入 Moment.js）。
  - **ECharts / Recharts**: 图表可视化库。

- **状态管理**:
  - 优先使用 **React Context + Hooks** 进行轻量级状态管理。
  - 避免引入 Redux/MobX 等重型状态管理库，除非业务极其复杂。

## 3. 命名规则 (Naming Conventions)

### 3.1 变量与函数
- 使用 **camelCase**（小驼峰命名法）。
- 变量名应具有描述性，避免缩写（除非是约定俗成的，如循环中的 `i`）。
- 布尔值建议使用 `is`, `has`, `should`, `can` 等前缀（如 `isVisible`, `hasError`）。
- 事件处理函数建议以 `handle` 开头（如 `handleSubmit`），Props 中的事件属性以 `on` 开头（如 `onSubmit`）。

### 3.2 组件与文件
- 组件文件及组件名称使用 **PascalCase**（大驼峰命名法），如 `ApplyButton.tsx`。
- 文件夹名称若包含组件入口，通常使用 **PascalCase**；若为纯工具/配置类，使用 **camelCase**。
- 接口（Interface）通常以组件名或实体名开头，Props 接口命名为 `ComponentNameProps`。

### 3.3 常量
- 全局常量或配置项使用 **UPPER_SNAKE_CASE**（全大写下划线），如 `MAX_RETRY_COUNT`。

## 4. 代码风格与最佳实践 (Code Style & Best Practices)

### 4.1 通用原则
- **避免不必要的对象复制**: 善用 ES6+ 特性（如 Spread Operator）进行浅拷贝。
- **避免多层嵌套**: 使用“卫语句”（Guard Clauses）提前返回，减少 `if/else` 嵌套层级。
- **组件纯净性**: 保持组件副作用可控，副作用逻辑统一在 `useEffect` 中管理。

### 4.2 代码组织
- **单一职责**: 一个函数只做一件事，一个组件只关注一个主要功能。若组件超过 300 行，应考虑拆分。
- **结构顺序**:
  1. Imports (第三方 -> 内部组件 -> 工具/样式)
  2. Types/Interfaces
  3. Component Definition
  4. Hooks & State
  5. Helper Functions (inside component)
  6. Render (JSX)

### 4.3 注释与文档
- **解释意图**: 注释重点解释“为什么”（Why），代码本身应尽可能自解释。
- **JSDoc**: 为公共组件和工具函数编写 JSDoc 注释。

## 5. 性能优化 (Performance Optimization)

### 5.1 内存与计算
- **避免不必要的对象创建**: 避免在 Render 中定义常量对象，尽量提取到组件外或使用 `useMemo`。
- **资源释放**: 在 `useEffect` 清理函数中及时清除定时器和事件监听。
- **避免重复计算**: 对耗时逻辑使用 `useMemo` 缓存。

### 5.2 渲染优化
- **列表渲染**: 必须提供稳定且唯一的 `key`。
- **懒加载**: 使用 `React.lazy` 和 `Suspense` 加载非首屏组件。
