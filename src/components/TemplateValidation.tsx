import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Tooltip, Space, Alert, Spin } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { templateService } from '../services/templateService';

interface TemplateValidationProps {
  templateIds?: string[];
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // 分钟
}

interface ValidationResult {
  templateId: string;
  templateName: string;
  isValid: boolean;
  status: 'valid' | 'warning' | 'error';
  message: string;
  lastChecked: string;
}

const TemplateValidation: React.FC<TemplateValidationProps> = ({
  templateIds,
  showDetails = true,
  autoRefresh = false,
  refreshInterval = 30
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastValidation, setLastValidation] = useState<string>('');

  const validateTemplates = async () => {
    setLoading(true);
    try {
      const templates = templateService.getAllTemplates();
      const templatesToValidate = templateIds 
        ? templates.filter(t => templateIds.includes(t.id))
        : templates;

      const results: ValidationResult[] = [];
      
      for (const template of templatesToValidate) {
        const validation = await templateService.validateTemplate(template.id);
        results.push({
          templateId: template.id,
          templateName: template.name,
          isValid: validation.isValid,
          status: validation.status,
          message: validation.message,
          lastChecked: new Date().toLocaleString('zh-CN')
        });
      }

      setValidationResults(results);
      setLastValidation(new Date().toLocaleString('zh-CN'));
      
      // 保存验证结果到本地存储
      localStorage.setItem('template_validation_results', JSON.stringify({
        results,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('模板验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLastValidation = () => {
    const lastLog = templateService.getLastValidationLog();
    if (lastLog) {
      const convertedResults = lastLog.details.map(detail => ({
        templateId: detail.templateId,
        templateName: detail.name,
        isValid: detail.isValid,
        status: detail.isValid ? 'valid' as const : 'error' as const,
        message: detail.message,
        lastChecked: lastLog.timestamp
      }));
      setValidationResults(convertedResults);
      setLastValidation(new Date(lastLog.timestamp).toLocaleString('zh-CN'));
    }
  };

  useEffect(() => {
    // 加载上次验证结果
    loadLastValidation();
    
    // 执行初始验证
    validateTemplates();

    // 设置自动刷新
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(validateTemplates, refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [templateIds, autoRefresh, refreshInterval]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge status="success" text="正常" />;
      case 'warning':
        return <Badge status="warning" text="警告" />;
      case 'error':
        return <Badge status="error" text="错误" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const validCount = validationResults.filter(r => r.status === 'valid').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const errorCount = validationResults.filter(r => r.status === 'error').length;

  return (
    <Card
      title="模板文件验证状态"
      extra={
        <Space>
          <Tooltip title="刷新验证状态">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={validateTemplates}
              loading={loading}
              size="small"
            />
          </Tooltip>
        </Space>
      }
    >
      {/* 总体状态概览 */}
      <div style={{ marginBottom: '16px' }}>
        <Space size="large">
          <span>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
            正常: {validCount}
          </span>
          <span>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '4px' }} />
            警告: {warningCount}
          </span>
          <span>
            <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '4px' }} />
            错误: {errorCount}
          </span>
        </Space>
        {lastValidation && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            最后检查时间: {lastValidation}
          </div>
        )}
      </div>

      {/* 错误和警告提醒 */}
      {errorCount > 0 && (
        <Alert
          message="发现模板文件错误"
          description={`有 ${errorCount} 个模板文件存在问题，请及时处理以确保申报功能正常。`}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {warningCount > 0 && errorCount === 0 && (
        <Alert
          message="模板文件警告"
          description={`有 ${warningCount} 个模板文件需要注意，建议检查更新。`}
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* 详细验证结果 */}
      {showDetails && (
        <Spin spinning={loading}>
          <div>
            {validationResults.map((result) => (
              <Card
                key={result.templateId}
                size="small"
                style={{ marginBottom: '8px' }}
                bodyStyle={{ padding: '12px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      {getStatusIcon(result.status)}
                      <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                        {result.templateName}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {result.message}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                      检查时间: {result.lastChecked}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Spin>
      )}

      {validationResults.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          暂无验证数据
        </div>
      )}
    </Card>
  );
};

export default TemplateValidation;