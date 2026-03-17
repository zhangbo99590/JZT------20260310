import dayjs from "dayjs";
import { cache, withCache } from "../utils/cache";
import type {
  Publication,
  Connection,
  IndustryStats,
  PublicationFilter,
  NewPublicationForm,
  PublicationType,
  ConnectionStatus,
} from "../types/industry";
import {
  mockPublications,
  mockConnections,
  mockStats,
} from "../mock/industryMock";
import {
  searchItems,
  SearchOptions,
  filterByFields,
} from "../utils/searchUtils";
import { createApiCall } from "./apiUtils";

// API 函数

/**
 * 获取发布列表
 */
// 内部实现函数
async function _getPublications(
  filter?: PublicationFilter,
): Promise<Publication[]> {
  const searchOptions: SearchOptions<Publication> = {
    filters: {},
  };

  if (filter) {
    // 设置搜索选项
    if (filter.keyword) {
      searchOptions.keyword = filter.keyword;
      searchOptions.searchFields = ["title", "description", "tags"];
    }

    // 设置过滤条件
    if (filter.type) searchOptions.filters!.type = filter.type;
    if (filter.subType) searchOptions.filters!.subType = filter.subType;
    if (filter.region) searchOptions.filters!.region = filter.region;
    if (filter.industry) searchOptions.filters!.industry = filter.industry;

    // 组合自定义过滤条件
    const customFilters: ((item: Publication) => boolean)[] = [];

    // 质量筛选
    if (filter.quality) {
      if (filter.quality === "gold") {
        customFilters.push((item) => item.rating && item.rating >= 4.5);
      } else if (filter.quality === "silver") {
        customFilters.push(
          (item) => item.rating && item.rating >= 3.5 && item.rating < 4.5,
        );
      }
    }

    // 预算范围筛选
    if (filter.budgetRange) {
      const budgetLimit = parseInt(filter.budgetRange);
      customFilters.push((item) => {
        // 检查是否有预算相关字段（使用类型安全的方式访问）
        const details = item.details as
          | { budgetRange?: { max?: number } }
          | undefined;
        const budget = item.budget || details?.budgetRange?.max || 0;
        if (budgetLimit === 10) {
          // 10万以下
          return budget < 100000;
        } else if (budgetLimit === 50) {
          // 10-50万
          return budget >= 100000 && budget < 500000;
        } else if (budgetLimit === 100) {
          // 50-100万
          return budget >= 500000 && budget < 1000000;
        }
        return true;
      });
    }

    // 发布日期筛选
    if (filter.publishedWithinDays) {
      const days = parseInt(filter.publishedWithinDays.toString());
      const now = dayjs();
      customFilters.push((item) => {
        if (item.publishTime) {
          const publishDate = dayjs(item.publishTime);
          const daysSincePublish = now.diff(publishDate, "day");
          return daysSincePublish <= days;
        }
        return true;
      });
    }

    // 截止日期筛选
    if (filter.expiringWithinDays) {
      const days = parseInt(filter.expiringWithinDays.toString());
      const now = dayjs();
      customFilters.push((item) => {
        if (item.expiryDate) {
          const expiryDate = dayjs(item.expiryDate);
          const daysUntilExpiry = expiryDate.diff(now, "day");
          return daysUntilExpiry >= 0 && daysUntilExpiry <= days;
        }
        return true;
      });
    }

    // 应用组合自定义过滤
    if (customFilters.length > 0) {
      searchOptions.customFilter = (item) => {
        return customFilters.every((filterFn) => filterFn(item));
      };
    }
  }

  // 使用增强的通用搜索工具
  const result = await searchItems(mockPublications, searchOptions);

  return result.data;
}

// 导出带缓存的版本
export const getPublications = withCache(_getPublications, {
  keyGenerator: (filter) => `publications_${JSON.stringify(filter || {})}`,
  ttl: 3 * 60 * 1000, // 3分钟缓存
});

/**
 * 创建新发布
 */
export const createPublication = createApiCall(
  async (form: NewPublicationForm): Promise<Publication> => {
    const newPublication: Publication = {
      id: `pub-${Date.now()}`,
      title: form.title,
      type: form.type,
      subType: form.subType,
      description: form.description,
      status: "pending",
      publisherId: "current-user-id",
      publisherName: "当前用户",
      publishTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      expiryDate: dayjs().add(form.validityDays, "day").format("YYYY-MM-DD"),
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
  },
  500,
);

/**
 * 更新发布
 */
export const updatePublication = createApiCall(
  async (id: string, updates: Partial<Publication>): Promise<Publication> => {
    const publication = mockPublications.find((p) => p.id === id);
    if (!publication) throw new Error("发布不存在");
    return { ...publication, ...updates } as Publication;
  },
  400,
);

/**
 * 检查是否为重复发布
 * 规则：1天内相同标题+类型
 */
export const checkDuplicatePublication = async (
  title: string,
  type: PublicationType,
): Promise<boolean> => {
  const oneDayAgo = dayjs().subtract(1, "day");

  // 检查内存中的数据
  const hasDuplicateInMemory = mockPublications.some(
    (p) =>
      p.title === title &&
      p.type === type &&
      dayjs(p.publishTime).isAfter(oneDayAgo) &&
      p.publisherId === "current-user-id", // 假设当前用户
  );

  return hasDuplicateInMemory;
};

/**
 * 获取推荐供应商
 */
export const getRecommendedSuppliers = createApiCall(
  async (publication: Publication): Promise<Publication[]> => {
    // 简单的匹配算法
    const scores = mockPublications
      .filter((p) => p.type === "supply" && p.status === "active") // 只匹配有效的供给方
      .map((supplier) => {
        let score = 0;
        // 1. 行业匹配 (权重高)
        if (supplier.industry === publication.industry) score += 30;

        // 2. 标签匹配
        if (supplier.tags && publication.tags) {
          const matchedTags = supplier.tags.filter((tag) =>
            publication.tags?.includes(tag),
          );
          score += matchedTags.length * 10;
        }

        // 3. 关键词匹配
        if (
          supplier.title.includes(publication.industry || "") ||
          (publication.industry &&
            supplier.description?.includes(publication.industry))
        ) {
          score += 10;
        }

        return { supplier, score };
      });

    // 按分数排序并返回前5名
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.supplier);
  },
);

/**
 * 删除发布
 */
export const deletePublication = createApiCall(
  async (id: string): Promise<void> => {
    // 从模拟数据中删除该发布
    const index = mockPublications.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPublications.splice(index, 1);
    }

    // 清除相关缓存
    cache.clear();
  },
);

/**
 * 下架发布
 */
export const offlinePublication = createApiCall(
  async (id: string, _reason: string): Promise<void> => {
    // 更新发布状态为已下架
    const publication = mockPublications.find((p) => p.id === id);
    if (publication) {
      publication.status = "offline";
    }

    cache.clear();
  },
);

/**
 * 上架发布
 */
export const onlinePublication = createApiCall(
  async (id: string): Promise<void> => {
    // 更新发布状态为已生效
    const publication = mockPublications.find((p) => p.id === id);
    if (publication) {
      publication.status = "active";
    }

    // 清除相关缓存
    cache.clear();
  },
);

/**
 * 刷新发布（延长有效期）
 */
export const refreshPublication = createApiCall(
  async (id: string): Promise<Publication> => {
    const publication = mockPublications.find((p) => p.id === id);
    if (!publication) throw new Error("发布不存在");

    // 直接更新原对象的到期日期
    publication.expiryDate = dayjs(publication.expiryDate)
      .add(30, "day")
      .format("YYYY-MM-DD");

    // 清除相关缓存
    cache.clear();

    return publication;
  },
);

/**
 * 获取我的发布列表
 */
export const getMyPublications = createApiCall(
  async (status?: string): Promise<Publication[]> => {
    let result = [...mockPublications];

    if (status && status !== "all") {
      // 使用通用过滤工具进行状态过滤
      result = filterByFields(result, { status });
    }

    return result;
  },
);

/**
 * 获取对接列表
 */
export const getConnections = createApiCall(
  async (filter?: { status?: ConnectionStatus }): Promise<Connection[]> => {
    let result = [...mockConnections];

    if (filter) {
      // 使用通用过滤工具进行字段过滤
      result = filterByFields(
        result,
        filter as Partial<Record<keyof Connection, any>>,
      );
    }

    return result;
  },
);

/**
 * 创建对接请求
 */
export const createConnection = createApiCall(
  async (
    publicationId: string,
    message: string,
    applicationId?: string,
  ): Promise<Connection> => {
    const publication = mockPublications.find((p) => p.id === publicationId);
    if (!publication) throw new Error("发布不存在");

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      applicationId,
      publicationId,
      publicationType: publication.type,
      publicationTitle: publication.title,
      initiatorId: "current-user-id",
      initiatorName: "当前用户",
      receiverId: publication.publisherId,
      receiverName: publication.publisherName,
      status: "pending",
      message,
      createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      chatMessages: [],
      attachments: [],
    };

    // 将新的对接记录添加到模拟数据中
    mockConnections.unshift(newConnection);

    return newConnection;
  },
  400,
);

/**
 * 更新对接状态
 */
export const updateConnectionStatus = createApiCall(
  async (id: string, status: ConnectionStatus): Promise<Connection> => {
    const connection = mockConnections.find((c) => c.id === id);
    if (!connection) throw new Error("对接记录不存在");

    return {
      ...connection,
      status,
      updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
  },
);

/**
 * 获取统计数据
 */
async function _getIndustryStats(): Promise<IndustryStats> {
  return mockStats;
}

// 导出带缓存的版本
export const getIndustryStats = withCache(_getIndustryStats, {
  keyGenerator: () => "industry_stats",
  ttl: 5 * 60 * 1000, // 5分钟缓存
});

/**
 * 获取推荐发布
 */
export const getRecommendedPublications = createApiCall(
  async (limit: number = 6): Promise<Publication[]> => {
    return mockPublications.slice(0, limit);
  },
);

/**
 * 计算匹配度
 */
export const calculateMatchScore = createApiCall(
  async (_publicationId: string, _userId: string): Promise<number> => {
    return Math.floor(Math.random() * 30) + 70; // 70-100
  },
  200,
);

/**
 * 根据ID获取商机详情
 */
async function _getPublicationById(id: string): Promise<Publication | null> {
  const publication = mockPublications.find((pub) => pub.id === id);
  return publication || null;
}

// 导出带缓存的版本
export const getPublicationById = withCache(_getPublicationById, {
  keyGenerator: (id) => `publication_${id}`,
  ttl: 5 * 60 * 1000, // 5分钟缓存
});
