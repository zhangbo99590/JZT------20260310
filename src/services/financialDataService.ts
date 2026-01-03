/**
 * 财务数据服务
 * 负责财务数据的管理、验证、清除和日志记录
 */

import { generateUUID } from '../utils/commonUtils';
import { StorageUtils } from '../utils/storage';

export interface FinancialData {
  annualRevenue: number;
  rdExpense: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  assetLiabilityRatio: number;
}

export interface OperationLog {
  id: string;
  timestamp: string;
  operation: 'create' | 'update' | 'delete' | 'clear';
  field: string;
  oldValue: any;
  newValue: any;
  operator: string;
  description: string;
}

class FinancialDataService {
  private logs: OperationLog[] = [];
  private storageKey = 'financial_data_logs';

  constructor() {
    this.loadLogs();
  }

  /**
   * 加载操作日志
   */
  private loadLogs(): void {
    this.logs = StorageUtils.getItem(this.storageKey, []);
  }

  /**
   * 保存操作日志
   */
  private saveLogs(): void {
    StorageUtils.setItem(this.storageKey, this.logs);
  }

  /**
   * 记录操作日志
   */
  logOperation(
    operation: 'create' | 'update' | 'delete' | 'clear',
    field: string,
    oldValue: any,
    newValue: any,
    description: string,
    operator: string = '系统用户'
  ): void {
    const log: OperationLog = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      operation,
      field,
      oldValue,
      newValue,
      operator,
      description
    };

    this.logs.unshift(log);
    
    // 只保留最近1000条日志
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    this.saveLogs();
  }

  /**
   * 获取操作日志
   */
  getOperationLogs(limit?: number): OperationLog[] {
    return limit ? this.logs.slice(0, limit) : [...this.logs];
  }

  /**
   * 清除操作日志
   */
  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * 计算资产负债率
   */
  calculateAssetLiabilityRatio(totalLiabilities: number, totalAssets: number): number {
    if (totalAssets <= 0) return 0;
    return Number(((totalLiabilities / totalAssets) * 100).toFixed(2));
  }

  /**
   * 验证财务数据
   */
  validateFinancialData(data: Partial<FinancialData>): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证数值范围
    if (data.annualRevenue !== undefined && data.annualRevenue < 0) {
      errors.push('年销售收入不能为负数');
    }

    if (data.rdExpense !== undefined && data.rdExpense < 0) {
      errors.push('研发费用不能为负数');
    }

    if (data.netProfit !== undefined && data.netProfit < -1000000) {
      warnings.push('净利润为大额负数，请确认数据准确性');
    }

    if (data.totalAssets !== undefined && data.totalAssets < 0) {
      errors.push('总资产不能为负数');
    }

    if (data.totalLiabilities !== undefined && data.totalLiabilities < 0) {
      errors.push('总负债不能为负数');
    }

    // 验证逻辑关系
    if (data.totalAssets !== undefined && data.totalLiabilities !== undefined) {
      if (data.totalLiabilities > data.totalAssets) {
        warnings.push('总负债超过总资产，企业可能存在资不抵债风险');
      }
    }

    if (data.rdExpense !== undefined && data.annualRevenue !== undefined) {
      if (data.rdExpense > data.annualRevenue) {
        warnings.push('研发费用超过年销售收入，请确认数据准确性');
      }
    }

    // 资产负债率建议
    if (data.assetLiabilityRatio !== undefined && data.assetLiabilityRatio > 70) {
      warnings.push('资产负债率较高(>70%)，建议关注企业财务风险');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 清除研发费用数据
   */
  clearRdExpenseData(currentData: FinancialData): FinancialData {
    const oldRdExpense = currentData.rdExpense;

    // 记录清除操作
    this.logOperation(
      'clear',
      'rdExpense',
      { rdExpense: oldRdExpense },
      { rdExpense: 0 },
      '清除研发费用数据'
    );

    return {
      ...currentData,
      rdExpense: 0
    };
  }

  /**
   * 清除所有财务数据
   */
  clearAllFinancialData(currentData: FinancialData): FinancialData {
    this.logOperation(
      'clear',
      'all_financial_data',
      currentData,
      this.getEmptyFinancialData(),
      '清除所有财务数据'
    );

    return this.getEmptyFinancialData();
  }

  /**
   * 获取空的财务数据对象
   */
  getEmptyFinancialData(): FinancialData {
    return {
      annualRevenue: 0,
      rdExpense: 0,
      netProfit: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      assetLiabilityRatio: 0
    };
  }

  /**
   * 保存财务数据
   */
  saveFinancialData(data: FinancialData, applicationId?: string): boolean {
    try {
      const key = applicationId ? `financial_data_${applicationId}` : 'financial_data_current';
      StorageUtils.setItem(key, data);
      
      this.logOperation(
        'update',
        'financial_data',
        null,
        data,
        `保存财务数据${applicationId ? ` (申报ID: ${applicationId})` : ''}`
      );

      return true;
    } catch (error) {
      console.error('保存财务数据失败:', error);
      return false;
    }
  }

  /**
   * 加载财务数据
   */
  loadFinancialData(applicationId?: string): FinancialData | null {
    try {
      const key = applicationId ? `financial_data_${applicationId}` : 'financial_data_current';
      const data = StorageUtils.getItem(key, null);
      
      if (data) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('加载财务数据失败:', error);
      return null;
    }
  }

  /**
   * 获取财务数据历史记录
   */
  getFinancialDataHistory(field: string, limit: number = 10): OperationLog[] {
    return this.logs
      .filter(log => log.field === field || log.field === 'financial_data' || log.field === 'all_financial_data')
      .slice(0, limit);
  }


  /**
   * 导出操作日志
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 获取数据完整性报告
   */
  getDataIntegrityReport(data: FinancialData): {
    completeness: number;
    missingFields: string[];
    filledFields: string[];
  } {
    const fields = [
      { key: 'annualRevenue', name: '年销售收入' },
      { key: 'rdExpense', name: '研发费用' },
      { key: 'netProfit', name: '净利润' },
      { key: 'totalAssets', name: '总资产' },
      { key: 'totalLiabilities', name: '总负债' }
    ];

    const filledFields: string[] = [];
    const missingFields: string[] = [];

    fields.forEach(field => {
      if (data[field.key as keyof FinancialData] > 0) {
        filledFields.push(field.name);
      } else {
        missingFields.push(field.name);
      }
    });

    const completeness = (filledFields.length / fields.length) * 100;

    return {
      completeness: Number(completeness.toFixed(2)),
      missingFields,
      filledFields
    };
  }
}

export const financialDataService = new FinancialDataService();
