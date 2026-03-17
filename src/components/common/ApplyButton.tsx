import React from "react";
import { Button, Tooltip } from "antd";
import { ButtonProps } from "antd/lib/button";

// 统一设计规范 Token
const DESIGN_TOKENS = {
  colors: {
    primary: "#1890FF",
    success: "#34D399", // 使用更温和的绿色
    disabled: "#9CA3AF",
    text: {
      white: "#FFFFFF",
    },
  },
  borderRadius: 6,
  fontFamily: "Microsoft YaHei",
};

export type ApplyStatus = "not_started" | "in_progress" | "ended";

export interface ApplyButtonProps extends Omit<ButtonProps, "type"> {
  status?: ApplyStatus;
  isApplied?: boolean;
  onApply?: () => void;
  onViewProgress?: () => void;
  showTooltip?: boolean;
  customTooltip?: string;
}

/**
 * ApplyButton 统一申报按钮组件
 *
 * @description
 * 标准化的申报操作按钮，根据项目状态自动切换样式和文案。
 * 集成了统一的 Tooltip 提示逻辑。
 */
const ApplyButton: React.FC<ApplyButtonProps> = ({
  status = "in_progress",
  isApplied = false,
  onApply,
  onViewProgress,
  onClick,
  style,
  disabled,
  showTooltip = true,
  customTooltip,
  ...rest
}) => {
  // 计算按钮状态配置
  const getConfig = () => {
    if (isApplied) {
      return {
        text: "查看进度",
        bg: DESIGN_TOKENS.colors.success,
        disabled: false,
        handler: onViewProgress || onClick,
        tooltip: "点击查看申报进度",
      };
    }

    switch (status) {
      case "in_progress":
        return {
          text: "立即申报",
          bg: DESIGN_TOKENS.colors.primary,
          disabled: false,
          handler: onApply || onClick,
          tooltip: "点击立即开始申报",
        };
      case "not_started":
        return {
          text: "未开始",
          bg: DESIGN_TOKENS.colors.disabled,
          disabled: true,
          handler: undefined,
          tooltip: "当前项目尚未开始申报",
        };
      case "ended":
        return {
          text: "已截止",
          bg: DESIGN_TOKENS.colors.disabled,
          disabled: true,
          handler: undefined,
          tooltip: "当前项目申报已截止",
        };
      default:
        return {
          text: "立即申报",
          bg: DESIGN_TOKENS.colors.primary,
          disabled: false,
          handler: onApply || onClick,
          tooltip: "点击立即开始申报",
        };
    }
  };

  const config = getConfig();
  const tooltipTitle = customTooltip || config.tooltip;

  const buttonNode = (
    <Button
      type="primary"
      disabled={disabled || config.disabled}
      onClick={config.handler}
      style={{
        borderRadius: DESIGN_TOKENS.borderRadius,
        backgroundColor: config.bg,
        borderColor: "transparent",
        fontFamily: DESIGN_TOKENS.fontFamily,
        color: DESIGN_TOKENS.colors.text.white,
        transition: "all 0.3s ease",
        boxShadow: config.disabled ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!config.disabled && !disabled) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = config.disabled
          ? "none"
          : "0 2px 4px rgba(0,0,0,0.1)";
      }}
      {...rest}
    >
      {config.text}
    </Button>
  );

  if (showTooltip && tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle}>
        {/* 包裹一层 div 以支持 disabled 按钮显示 Tooltip */}
        {config.disabled ? (
          <div style={{ display: "inline-block", cursor: "not-allowed" }}>
            {buttonNode}
          </div>
        ) : (
          buttonNode
        )}
      </Tooltip>
    );
  }

  return buttonNode;
};

export default ApplyButton;
