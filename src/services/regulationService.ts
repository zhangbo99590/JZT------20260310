import dayjs from 'dayjs';
import { filterByFields, SearchOptions } from '../utils/searchUtils';

export type EffectLevel = '全部' | '法律' | '行政法规' | '部门规章';

export interface FilterCriteria {
  effectLevel: EffectLevel;
  fields: string[]; // 领域分类
  industries: string[]; // 行业分类（树选择返回的节点值）
  dateRange?: { start?: string; end?: string }; // YYYY-MM-DD
  keyword?: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  criteria: FilterCriteria;
  createdAt: number;
}

export interface RegulationRecord {
  id: string;
  title: string;
  level: string;
  field: string;
  industry?: string;
  publishOrg: string;
  publishDate: string; // YYYY-MM-DD
  effectiveDate: string; // YYYY-MM-DD
  status: 'effective' | 'revised' | 'abolished';
  tags: string[];
  summary: string;
  viewCount: number;
  downloadCount: number;
  favoriteCount: number;
  hasEnglish: boolean;
  lastRevisionDate?: string; // YYYY-MM-DD
  content?: string; // 条款全文（模拟）
}

export interface SearchHistoryItem {
  id: string;
  keyword?: string;
  criteria: FilterCriteria;
  timestamp: number;
  resultCount: number;
}

import { StorageUtils } from '../utils/storage';

const SAVED_FILTER_KEY = 'regulation_saved_filters';
const SEARCH_HISTORY_KEY = 'regulation_search_history';

export function saveFilterProfile(name: string, criteria: FilterCriteria): SavedFilter {
  const profiles: SavedFilter[] = StorageUtils.getItem(SAVED_FILTER_KEY, []);
  const item: SavedFilter = {
    id: `${Date.now()}`,
    name,
    criteria,
    createdAt: Date.now(),
  };
  profiles.unshift(item);
  StorageUtils.setItem(SAVED_FILTER_KEY, profiles);
  return item;
}

export function getSavedFilters(): SavedFilter[] {
  return StorageUtils.getItem(SAVED_FILTER_KEY, []);
}

export function removeSavedFilter(id: string) {
  const profiles: SavedFilter[] = StorageUtils.getItem(SAVED_FILTER_KEY, []);
  const next = profiles.filter(p => p.id !== id);
  StorageUtils.setItem(SAVED_FILTER_KEY, next);
}

export function pushSearchHistory(record: SearchHistoryItem) {
  const list: SearchHistoryItem[] = StorageUtils.getItem(SEARCH_HISTORY_KEY, []);
  list.unshift(record);
  // 保留最近90天与最多100条
  const ninetyDaysAgo = Date.now() - 90 * 24 * 3600 * 1000;
  const filtered = list.filter(item => item.timestamp >= ninetyDaysAgo).slice(0, 100);
  StorageUtils.setItem(SEARCH_HISTORY_KEY, filtered);
}

export function getSearchHistory(): SearchHistoryItem[] {
  return StorageUtils.getItem(SEARCH_HISTORY_KEY, []);
}

export function clearSearchHistory(ids?: string[]) {
  if (!ids || ids.length === 0) {
    StorageUtils.removeItem(SEARCH_HISTORY_KEY);
    return;
  }
  const list: SearchHistoryItem[] = StorageUtils.getItem(SEARCH_HISTORY_KEY, []);
  const next = list.filter(item => !ids.includes(item.id));
  StorageUtils.setItem(SEARCH_HISTORY_KEY, next);
}

// 简单布尔检索解析 AND / OR / NOT
function matchesBooleanQuery(text: string, query: string): boolean {
  const source = text.toLowerCase();
  const tokens = query.trim().toLowerCase().split(/\s+/);
  // naive evaluation: start with first term
  let result = false;
  let op: 'AND' | 'OR' = 'AND';
  let negateNext = false;
  for (const tk of tokens) {
    if (tk === 'and' || tk === 'or') {
      op = tk.toUpperCase() as 'AND' | 'OR';
      continue;
    }
    if (tk === 'not') {
      negateNext = true;
      continue;
    }
    const hit = source.includes(tk);
    const val = negateNext ? !hit : hit;
    negateNext = false;
    if (op === 'AND') {
      result = result ? val : val; // if first term, set; otherwise AND will be checked below
      if (!val) return false;
    } else {
      result = result || val;
    }
  }
  return result;
}

// 解析“法规简称+条款”格式（如：劳动法第36条）
export function parseArticleRef(keyword: string): { law?: string; article?: number } | null {
  const m = keyword.match(/([\u4e00-\u9fa5A-Za-z0-9]+)第(\d+)条/);
  if (m) {
    return { law: m[1], article: Number(m[2]) };
  }
  return null;
}

// 计算匹配度（前缀优先 + 语义加权可扩展）
export function computeMatchScore(record: RegulationRecord, keyword: string): number {
  const k = keyword.toLowerCase();
  let score = 0;
  if (record.title.toLowerCase().startsWith(k)) score += 60; // 前缀优先
  if (record.title.toLowerCase().includes(k)) score += 25;
  if (record.summary.toLowerCase().includes(k)) score += 15;
  // 时效加分：2020年后颁布 +10
  if (dayjs(record.publishDate).isAfter(dayjs('2020-01-01'))) score += 10;
  return Math.min(score, 100);
}

export interface RegulationSearchOptions extends Partial<SearchOptions<RegulationRecord>> {
  booleanQuery?: boolean;
}

export function filterRecords(records: RegulationRecord[], criteria: FilterCriteria, options?: RegulationSearchOptions): RegulationRecord[] {
  // 首先使用通用的filterByFields处理简单的过滤条件
  let filteredRecords = records;
  
  // 处理effectLevel（排除'全部'选项）
  if (criteria.effectLevel && criteria.effectLevel !== '全部') {
    filteredRecords = filterByFields(filteredRecords, { level: criteria.effectLevel });
  }
  
  // 处理其他需要特殊逻辑的过滤条件
  filteredRecords = filteredRecords.filter(r => {
    // 处理fields数组
    if (criteria.fields && criteria.fields.length > 0) {
      if (!criteria.fields.includes(r.field)) return false;
    }
    
    // 处理industries数组（需要特殊的startsWith逻辑）
    if (criteria.industries && criteria.industries.length > 0) {
      if (!r.industry || !criteria.industries.some(id => r.industry?.startsWith(id))) return false;
    }
    
    // 处理日期范围
    if (criteria.dateRange) {
      const eff = dayjs(r.effectiveDate);
      if (criteria.dateRange.start && eff.isBefore(dayjs(criteria.dateRange.start))) return false;
      if (criteria.dateRange.end && eff.isAfter(dayjs(criteria.dateRange.end))) return false;
    }
    
    // 处理关键词搜索
    if (options?.keyword) {
      const kw = options.keyword;
      if (options.booleanQuery) {
        return matchesBooleanQuery((r.content || r.summary), kw!);
      }
      return (
        r.title.includes(kw!) || r.summary.includes(kw!) || (r.content || '').includes(kw!)
      );
    }
    
    return true;
  });
  
  return filteredRecords;
}