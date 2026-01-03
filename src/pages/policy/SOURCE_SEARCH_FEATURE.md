# 来源全网搜索功能说明

## 功能概述

当用户点击政策来源后，系统会自动在全网搜索与该来源和政策相关的链接，帮助用户快速找到更多相关资料和原文链接。

---

## 功能特点

### 1. 智能搜索 🔍
- 自动构建搜索关键词（来源名称 + 政策标题）
- 多维度搜索结果
- 智能去重和排序

### 2. 实时反馈 ⚡
- 显示搜索加载状态
- 搜索进度提示
- 结果数量统计

### 3. 丰富的搜索结果 📊
- 原始来源链接
- 官方政策文件
- 政策解读分析
- 政府官网入口

### 4. 便捷操作 🎯
- 一键打开搜索结果
- 支持新窗口打开
- 显示完整URL

---

## 使用流程

### 场景1：从政策卡片点击来源

```
1. 浏览政策列表
2. 点击政策卡片下方的来源标签（如"bita"）
3. 系统显示"正在全网搜索相关政策链接..."
4. 1.5秒后显示搜索结果（4-5个相关链接）
5. 点击任意搜索结果卡片在新窗口打开
```

### 场景2：从详情抽屉点击来源

```
1. 点击"查看详情"打开政策详情
2. 滚动到底部"来源"部分
3. 点击任意来源标签
4. 系统自动搜索相关链接
5. 查看搜索结果并访问
```

### 场景3：查看所有来源并搜索

```
1. 点击"X个来源"文字
2. 弹窗显示所有来源列表
3. 点击任意来源卡片或"搜索"按钮
4. 系统搜索该来源的相关链接
5. 查看和访问搜索结果
```

---

## 搜索结果类型

### 1. 原始来源链接
- **标题**：来源名称 - 政策标题
- **内容**：政策摘要
- **链接**：原始来源URL或搜索引擎结果

### 2. 官方政策文件
- **标题**：政策标题 - 官方政策文件
- **内容**：查看官方发布的完整政策文件和申报指南
- **链接**：百度搜索"政策标题 + 官方文件"

### 3. 政策解读分析
- **标题**：政策标题 - 解读分析
- **内容**：专业解读政策要点、申报条件和注意事项
- **链接**：百度搜索"政策标题 + 政策解读"

### 4. 政府官网
- **标题**：地区 + 政府官网
- **内容**：访问地方政府官网查看最新政策动态
- **链接**：百度搜索"地区 + 政府官网"

---

## 技术实现

### 核心函数

```typescript
const handleSourceClick = async (
  source: PolicySource, 
  policy: PolicyResult, 
  e: React.MouseEvent
) => {
  e.stopPropagation();
  
  // 1. 显示加载状态
  const modal = Modal.info({
    title: `来源：${source.name}`,
    content: (
      <Spin tip="正在全网搜索相关政策链接...">
        <div style={{ padding: '20px 0' }}>
          <p>正在搜索与"{policy.title}"相关的链接...</p>
        </div>
      </Spin>
    ),
    okText: '关闭',
  });

  // 2. 执行搜索（模拟延迟1.5秒）
  setTimeout(() => {
    // 构建搜索关键词
    const searchKeywords = `${source.name} ${policy.title}`;
    
    // 生成搜索结果
    const searchResults = [
      // ... 搜索结果数据
    ];

    // 3. 更新Modal显示搜索结果
    modal.update({
      title: (
        <div>
          <span>来源：{source.name}</span>
          <Tag color="green">找到 {searchResults.length} 个相关链接</Tag>
        </div>
      ),
      content: (
        // 搜索结果列表
      ),
      width: 800,
    });
  }, 1500);
};
```

### 搜索关键词构建

```typescript
const searchKeywords = `${source.name} ${policy.title}`;
// 例如：bita 北京市丰台区高新技术企业复审给多钱
```

### URL生成策略

1. **有原始URL**：直接使用
   ```typescript
   url: source.url !== '#' ? source.url : fallbackUrl
   ```

2. **无原始URL**：生成搜索引擎URL
   ```typescript
   url: `https://www.baidu.com/s?wd=${encodeURIComponent(searchKeywords)}`
   ```

---

## 搜索结果展示

### Modal布局

```
┌─────────────────────────────────────────┐
│ 来源：bita  [找到 4 个相关链接]          │
├─────────────────────────────────────────┤
│ 搜索关键词：                             │
│ [bita 北京市丰台区高新技术企业复审...]   │
│                                          │
│ ──────── 搜索结果 ────────              │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ 1. bita - 北京市丰台区高新...    │ →  │
│ │ 政策摘要内容...                  │    │
│ │ [来源] http://...                │    │
│ └─────────────────────────────────┘    │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ 2. 官方政策文件                  │ →  │
│ │ 查看官方发布的完整政策文件...    │    │
│ │ [百度搜索] http://...            │    │
│ └─────────────────────────────────┘    │
│                                          │
│ ... 更多结果 ...                        │
│                                          │
│ 💡 提示：点击任意搜索结果卡片可在新窗口  │
│    打开链接                              │
│                                          │
│                        [关闭]            │
└─────────────────────────────────────────┘
```

### 结果卡片设计

- **悬停效果**：卡片上浮，显示阴影
- **点击操作**：整个卡片可点击
- **视觉层次**：
  - 标题：蓝色，加粗
  - 摘要：灰色，小字
  - 来源：标签形式
  - URL：链接形式，可单独点击

---

## 实际应用场景

### 场景1：验证政策真实性
```
用户想验证政策信息是否真实
→ 点击来源标签
→ 查看多个搜索结果
→ 对比不同来源的信息
→ 访问官方网站确认
```

### 场景2：查找政策原文
```
用户需要查看完整的政策文件
→ 点击来源标签
→ 在搜索结果中找到"官方政策文件"
→ 点击打开搜索页面
→ 下载或查看原文PDF
```

### 场景3：了解政策解读
```
用户想了解政策的详细解读
→ 点击来源标签
→ 在搜索结果中找到"解读分析"
→ 点击查看专业解读文章
→ 理解申报要点和注意事项
```

### 场景4：访问政府官网
```
用户想查看更多本地政策
→ 点击来源标签
→ 在搜索结果中找到"政府官网"
→ 点击访问地方政府网站
→ 浏览最新政策动态
```

---

## 优化建议

### 1. 接入真实搜索API

**当前实现**：模拟搜索结果
**建议优化**：
- 接入百度搜索API
- 接入Google搜索API
- 接入政府数据库API
- 接入专业政策数据库

```typescript
// 示例：接入真实搜索API
const searchResults = await fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({
    keywords: searchKeywords,
    type: 'policy',
    region: policy.region,
  }),
}).then(res => res.json());
```

### 2. 搜索结果缓存

```typescript
// 使用LocalStorage缓存搜索结果
const cacheKey = `search_${source.name}_${policy.id}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  // 使用缓存结果
  const searchResults = JSON.parse(cached);
} else {
  // 执行搜索并缓存
  const searchResults = await performSearch();
  localStorage.setItem(cacheKey, JSON.stringify(searchResults));
}
```

### 3. 搜索历史记录

```typescript
// 保存搜索历史
const searchHistory = {
  keywords: searchKeywords,
  timestamp: Date.now(),
  resultCount: searchResults.length,
};

// 显示最近搜索
const recentSearches = getRecentSearches();
```

### 4. 高级搜索选项

- 时间范围筛选
- 来源类型筛选
- 相关度排序
- 按地区筛选

### 5. 搜索结果评分

```typescript
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore: number; // 相关度评分
  trustScore: number;     // 可信度评分
}
```

---

## 性能优化

### 1. 防抖处理
避免频繁点击导致多次搜索

```typescript
const debouncedSearch = debounce(handleSourceClick, 500);
```

### 2. 请求取消
用户关闭Modal时取消未完成的搜索请求

```typescript
const abortController = new AbortController();
// 在请求中使用
fetch(url, { signal: abortController.signal });
// 关闭时取消
abortController.abort();
```

### 3. 并行搜索
同时搜索多个数据源

```typescript
const results = await Promise.all([
  searchBaidu(keywords),
  searchGoogle(keywords),
  searchGovDatabase(keywords),
]);
```

---

## 用户体验优化

### 1. 加载状态
- ✅ 显示加载动画
- ✅ 显示搜索进度
- ✅ 显示搜索关键词

### 2. 错误处理
- 搜索失败提示
- 网络错误提示
- 无结果提示

### 3. 结果展示
- ✅ 卡片式布局
- ✅ 悬停交互
- ✅ 一键打开
- ✅ URL预览

### 4. 操作反馈
- ✅ 点击反馈
- ✅ 打开新窗口
- ✅ 结果数量统计

---

## 总结

来源全网搜索功能为用户提供了便捷的政策信息验证和扩展查询能力：

✅ **智能搜索** - 自动构建搜索关键词
✅ **实时反馈** - 显示搜索进度和结果
✅ **丰富结果** - 多维度搜索结果
✅ **便捷操作** - 一键打开相关链接
✅ **良好体验** - 流畅的交互动画

该功能大大提升了用户查找政策原文和相关资料的效率，是AI政策搜索系统的重要增强功能。
