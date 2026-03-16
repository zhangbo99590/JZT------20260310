/**
 * 申报数据暂存工具
 * 创建时间: 2026-02-26
 * 功能: 管理未登录用户的申报数据暂存、恢复和清理
 */

import { StorageUtils } from './storage';

// 存储键前缀
const STORAGE_PREFIX = 'jzt_application_';

// 数据有效期（7天，单位：毫秒）
const DATA_EXPIRY = 7 * 24 * 60 * 60 * 1000;

/**
 * 获取设备ID（如果不存在则生成）
 */
export const getDeviceId = (): string => {
  let deviceId = StorageUtils.getItem('jzt_device_id', null);
  
  if (!deviceId) {
    // 生成唯一设备ID
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    StorageUtils.setItem('jzt_device_id', deviceId);
  }
  
  return deviceId;
};

/**
 * 生成存储键
 */
const getStorageKey = (projectId: string): string => {
  const deviceId = getDeviceId();
  return `${STORAGE_PREFIX}${deviceId}_${projectId}`;
};

/**
 * 编码数据（使用Base64）
 */
const encodeData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonStr));
  } catch (error) {
    console.error('数据编码失败:', error);
    throw new Error('数据编码失败');
  }
};

/**
 * 解码数据
 */
const decodeData = (encodedData: string): any => {
  try {
    const jsonStr = decodeURIComponent(atob(encodedData));
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('数据解码失败:', error);
    throw new Error('数据解码失败');
  }
};

/**
 * 检查数据是否过期
 */
const isDataExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > DATA_EXPIRY;
};

/**
 * 保存申报数据
 */
export const saveApplicationData = (projectId: string, data: any): boolean => {
  try {
    const storageKey = getStorageKey(projectId);
    
    const storageData = {
      data,
      timestamp: Date.now(),
      deviceId: getDeviceId(),
      projectId
    };
    
    const encodedData = encodeData(storageData);
    StorageUtils.setItem(storageKey, encodedData);
    
    console.log('申报数据暂存成功:', projectId);
    return true;
  } catch (error) {
    console.error('申报数据暂存失败:', error);
    return false;
  }
};

/**
 * 获取申报数据
 */
export const getApplicationData = (projectId: string): any | null => {
  try {
    const storageKey = getStorageKey(projectId);
    const encodedData = StorageUtils.getItem(storageKey, null);
    
    if (!encodedData) {
      return null;
    }
    
    const storageData = decodeData(encodedData);
    
    // 检查是否过期
    if (isDataExpired(storageData.timestamp)) {
      console.log('暂存数据已过期，自动清除');
      removeApplicationData(projectId);
      return null;
    }
    
    return storageData.data;
  } catch (error) {
    console.error('获取申报数据失败:', error);
    return null;
  }
};

/**
 * 删除申报数据
 */
export const removeApplicationData = (projectId: string): void => {
  try {
    const storageKey = getStorageKey(projectId);
    StorageUtils.removeItem(storageKey);
    console.log('申报数据已清除:', projectId);
  } catch (error) {
    console.error('删除申报数据失败:', error);
  }
};

/**
 * 清理所有过期数据
 */
export const cleanExpiredData = (): void => {
  try {
    const keys = StorageUtils.getAllKeys();
    const applicationKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
    
    applicationKeys.forEach(key => {
      try {
        const encodedData = StorageUtils.getItem(key, null);
        if (encodedData) {
          const storageData = decodeData(encodedData);
          if (isDataExpired(storageData.timestamp)) {
            StorageUtils.removeItem(key);
            console.log('已清理过期数据:', key);
          }
        }
      } catch (error) {
        // 解码失败的数据也删除
        StorageUtils.removeItem(key);
      }
    });
  } catch (error) {
    console.error('清理过期数据失败:', error);
  }
};

/**
 * 获取暂存数据的剩余有效天数
 */
export const getRemainingDays = (projectId: string): number => {
  try {
    const storageKey = getStorageKey(projectId);
    const encodedData = StorageUtils.getItem(storageKey, null);
    
    if (!encodedData) {
      return 0;
    }
    
    const storageData = decodeData(encodedData);
    const elapsed = Date.now() - storageData.timestamp;
    const remaining = DATA_EXPIRY - elapsed;
    
    return Math.ceil(remaining / (24 * 60 * 60 * 1000));
  } catch (error) {
    return 0;
  }
};

/**
 * 检查是否有暂存数据
 */
export const hasStoredData = (projectId: string): boolean => {
  const data = getApplicationData(projectId);
  return data !== null;
};
