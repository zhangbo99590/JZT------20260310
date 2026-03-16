/**
 * 通用工具函数
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 生成UUID
 * @returns UUID字符串
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


/**
 * 格式化日期时间
 * @param date 日期对象或字符串
 * @param format 格式化模式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};


/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 检查值是否为空
 * @param value 要检查的值
 * @returns 是否为空
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 安全的JSON解析
 * @param str JSON字符串
 * @param defaultValue 默认值
 * @returns 解析后的对象或默认值
 */
export const safeJsonParse = <T>(str: string, defaultValue: T): T => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

/**
 * 获取随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 获取随机数组元素
 * @param array 数组
 * @returns 随机元素
 */
export const getRandomArrayElement = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 模拟API延迟
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 生成申请ID
 * 统一的申请ID生成逻辑
 */
export function generateApplicationId(): string {
  return "FA" + Date.now().toString().slice(-8);
}

/**
 * 根据匹配度获取颜色
 * 统一的匹配度颜色映射逻辑
 */
export function getMatchColor(score: number): string {
  if (score >= 90) return "#52c41a";
  if (score >= 80) return "#1890ff";
  if (score >= 70) return "#faad14";
  return "#ff4d4f";
}

/**
 * 根据匹配度获取标签配置
 * 统一的匹配度标签映射逻辑
 */
export function getMatchTag(score: number): { color: string; text: string } {
  if (score >= 90) return { color: "green", text: "极度推荐" };
  if (score >= 80) return { color: "blue", text: `匹配度 ${score}%` };
  if (score >= 70) return { color: "orange", text: `匹配度 ${score}%` };
  return { color: "red", text: `匹配度 ${score}%` };
}
