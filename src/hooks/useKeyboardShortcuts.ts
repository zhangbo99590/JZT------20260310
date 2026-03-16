/**
 * 键盘快捷键Hook
 * 创建时间: 2026-02-26
 * 功能: 提供全局键盘快捷键支持
 */

import { useEffect, useCallback } from 'react';
import { message } from 'antd';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // 忽略在输入框中的快捷键
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const matchedShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey
      );
    });

    if (matchedShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchedShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  // 显示快捷键帮助
  const showShortcutsHelp = useCallback(() => {
    const helpText = shortcuts
      .map(shortcut => {
        const keys = [];
        if (shortcut.ctrlKey) keys.push('Ctrl');
        if (shortcut.altKey) keys.push('Alt');
        if (shortcut.shiftKey) keys.push('Shift');
        keys.push(shortcut.key.toUpperCase());
        return `${keys.join(' + ')}: ${shortcut.description}`;
      })
      .join('\n');

    message.info({
      content: `键盘快捷键：\n${helpText}`,
      duration: 5
    });
  }, [shortcuts]);

  return {
    showShortcutsHelp
  };
};

// 预定义的首页快捷键
export const getHomePageShortcuts = (actions: {
  refresh: () => void;
  toggleSettings: () => void;
  focusSearch?: () => void;
  showHelp: () => void;
}): KeyboardShortcut[] => [
  {
    key: 'F5',
    action: actions.refresh,
    description: '刷新数据'
  },
  {
    key: 'r',
    ctrlKey: true,
    action: actions.refresh,
    description: '刷新数据'
  },
  {
    key: ',',
    ctrlKey: true,
    action: actions.toggleSettings,
    description: '打开设置面板'
  },
  {
    key: 'k',
    ctrlKey: true,
    action: actions.focusSearch || (() => {}),
    description: '聚焦搜索框'
  },
  {
    key: '?',
    shiftKey: true,
    action: actions.showHelp,
    description: '显示快捷键帮助'
  },
  {
    key: 'F1',
    action: actions.showHelp,
    description: '显示快捷键帮助'
  }
];
