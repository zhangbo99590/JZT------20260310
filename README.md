# 企规宝管理系统

一个基于 React + TypeScript + Ant Design 的企业规范管理系统。

## 功能特性

- 🏠 **首页概览** - 数据统计和快速导航
- 📋 **申报管理** - 资质申报、条件检查、申报向导
- ⚖️ **法规支持** - 法规查询、法规解读、时效性管理
- 🎯 **智能匹配** - 政策智能匹配和推荐
- 📚 **政策中心** - 政策文件管理和查询
- 🔧 **系统管理** - 用户管理、权限配置、系统设置

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **路由管理**: React Router 6
- **样式方案**: Tailwind CSS
- **构建工具**: Vite
- **代码规范**: ESLint + TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run serve
```

访问 http://localhost:4173

## 部署

### Vercel 部署

项目已配置 Vercel 部署，推送到 GitHub 后可自动部署。

### 手动部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到静态文件服务器

## 环境变量

- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本
- `VITE_API_BASE_URL` - API 基础地址
- `VITE_API_TIMEOUT` - API 超时时间

## 项目结构

```
src/
├── components/     # 公共组件
├── hooks/         # 自定义 Hooks
├── lib/           # 工具函数
├── pages/         # 页面组件
│   ├── application/  # 申报管理
│   ├── legal/       # 法规支持
│   └── system/      # 系统管理
└── main.tsx       # 应用入口
```

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 组件采用函数式组件 + Hooks
- 使用 Ant Design 组件库保持 UI 一致性

## 许可证

MIT License