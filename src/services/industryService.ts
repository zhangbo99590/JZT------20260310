import dayjs from 'dayjs';
import { cache, withCache } from '../utils/cache';
import type {
  Publication,
  SupplyPublication,
  DemandPublication,
  Connection,
  IndustryStats,
  PublicationFilter,
  NewPublicationForm,
  PublicationType,
  ConnectionStatus,
} from '../types/industry';
import { mockPublications, mockConnections, mockStats } from '../mock/industryMock';
import { searchItems, SearchOptions } from '../utils/searchUtils';
import { simulateDelay, filterByFields } from '../utils/searchUtils';

// API 函数

/**
 * 获取发布列表
 */
// 内部实现函数
async function _getPublications(filter?: PublicationFilter): Promise<Publication[]> {
  const searchOptions: SearchOptions<Publication> = {
    delay: 300,
    filters: {}
  };
  
  if (filter) {
    // 设置搜索选项
    if (filter.keyword) {
      searchOptions.keyword = filter.keyword;
      searchOptions.searchFields = ['title', 'description', 'tags'];
    }
    
    // 设置过滤条件
    if (filter.type) searchOptions.filters!.type = filter.type;
    if (filter.subType) searchOptions.filters!.subType = filter.subType;
    if (filter.region) searchOptions.filters!.region = filter.region;
    if (filter.industry) searchOptions.filters!.industry = filter.industry;
  }
  
  // 使用增强的通用搜索工具
  const result = await searchItems(mockPublications, searchOptions);
  
  return result.data;
}

// 导出带缓存的版本
export const getPublications = withCache(_getPublications, {
  keyGenerator: (filter) => `publications_${JSON.stringify(filter || {})}`,
  ttl: 3 * 60 * 1000 // 3分钟缓存
});

/**
 * 创建新发布
 */
export async function createPublication(form: NewPublicationForm): Promise<Publication> {
  await simulateDelay(500);
  
  const newPublication: Publication = {
    id: `pub-${Date.now()}`,
    title: form.title,
    type: form.type,
    subType: form.subType,
    description: form.description,
    status: 'pending',
    publisherId: 'current-user-id',
    publisherName: '当前用户',
    publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    expiryDate: dayjs().add(form.validityDays, 'day').format('YYYY-MM-DD'),
    validityDays: form.validityDays,
    visibilityScope: form.visibilityScope,
    visibleTo: form.visibleTo,
    viewCount: 0,
    connectionCount: 0,
    attachments: [],
    tags: form.tags,
    region: form.region,
    industry: form.industry,
    details: form.details,
  } as Publication;
  
  // 将新发布添加到模拟数据数组的开头，使其在列表中最先显示
  mockPublications.unshift(newPublication);
  
  // 清除相关缓存，确保数据同步
  cache.clear();
  
  return newPublication;
}

/**
 * 更新发布
 */
export async function updatePublication(id: string, updates: Partial<Publication>): Promise<Publication> {
  await simulateDelay(400);
  const publication = mockPublications.find((p) => p.id === id);
  if (!publication) throw new Error('发布不存在');
  return { ...publication, ...updates } as Publication;
}

/**
 * 删除发布
 */
export async function deletePublication(id: string): Promise<void> {
  await simulateDelay(300);
  
  // 从模拟数据中删除该发布
  const index = mockPublications.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPublications.splice(index, 1);
  }
  
  // 清除相关缓存
  cache.clear();
}

/**
 * 下架发布
 */
export async function offlinePublication(id: string, reason: string): Promise<void> {
  await simulateDelay(300);
  
  // 更新发布状态为已下架
  const publication = mockPublications.find((p) => p.id === id);
  if (publication) {
    publication.status = 'offline';
  }
  
  // 清除相关缓存
  cache.clear();
}

/**
 * 刷新发布（延长有效期）
 */
export async function refreshPublication(id: string): Promise<Publication> {
  await simulateDelay(300);
  const publication = mockPublications.find((p) => p.id === id);
  if (!publication) throw new Error('发布不存在');
  
  // 直接更新原对象的到期日期
  publication.expiryDate = dayjs(publication.expiryDate).add(30, 'day').format('YYYY-MM-DD');
  
  // 清除相关缓存
  cache.clear();
  
  return publication;
}

/**
 * 获取我的发布列表
 */
export async function getMyPublications(status?: string): Promise<Publication[]> {
  await simulateDelay(300);
  let result = [...mockPublications];
  
  if (status && status !== 'all') {
    // 使用通用过滤工具进行状态过滤
    result = filterByFields(result, { status });
  }
  
  return result;
}

/**
 * 获取对接列表
 */
export async function getConnections(filter?: { status?: ConnectionStatus }): Promise<Connection[]> {
  await simulateDelay(300);
  
  let result = [...mockConnections];
  
  if (filter) {
    // 使用通用过滤工具进行字段过滤
    result = filterByFields(result, filter as Partial<Record<keyof Connection, any>>);
  }
  
  return result;
}

/**
 * 创建对接请求
 */
export async function createConnection(
  publicationId: string,
  message: string,
  applicationId?: string
): Promise<Connection> {
  await simulateDelay(400);
  
  const publication = mockPublications.find((p) => p.id === publicationId);
  if (!publication) throw new Error('发布不存在');
  
  const newConnection: Connection = {
    id: `conn-${Date.now()}`,
    applicationId,
    publicationId,
    publicationType: publication.type,
    publicationTitle: publication.title,
    initiatorId: 'current-user-id',
    initiatorName: '当前用户',
    receiverId: publication.publisherId,
    receiverName: publication.publisherName,
    status: 'pending',
    message,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    chatMessages: [],
    attachments: [],
  };
  
  // 将新的对接记录添加到模拟数据中
  mockConnections.unshift(newConnection);
  
  return newConnection;
}

/**
 * 更新对接状态
 */
export async function updateConnectionStatus(
  id: string,
  status: ConnectionStatus
): Promise<Connection> {
  await simulateDelay(300);
  const connection = mockConnections.find((c) => c.id === id);
  if (!connection) throw new Error('对接记录不存在');
  
  return { ...connection, status, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
}

/**
 * 获取统计数据
 */
async function _getIndustryStats(): Promise<IndustryStats> {
  await simulateDelay(400);
  return mockStats;
}

// 导出带缓存的版本
export const getIndustryStats = withCache(_getIndustryStats, {
  keyGenerator: () => 'industry_stats',
  ttl: 5 * 60 * 1000 // 5分钟缓存
});

/**
 * 获取推荐发布
 */
export async function getRecommendedPublications(limit: number = 6): Promise<Publication[]> {
  await simulateDelay(300);
  return mockPublications.slice(0, limit);
}

/**
 * 计算匹配度
 */
export async function calculateMatchScore(
  publicationId: string,
  userId: string
): Promise<number> {
  await simulateDelay(200);
  return Math.floor(Math.random() * 30) + 70; // 70-100
}

/**
 * 根据ID获取商机详情
 */
async function _getPublicationById(id: string): Promise<Publication | null> {
  await simulateDelay(300);
  const publication = mockPublications.find(pub => pub.id === id);
  return publication || null;
}

// 导出带缓存的版本
export const getPublicationById = withCache(_getPublicationById, {
  keyGenerator: (id) => `publication_${id}`,
  ttl: 5 * 60 * 1000 // 5分钟缓存
});
