/**
 * 隐藏浏览器开发者工具调试控件的工具函数
 */

export const hideDebugControls = () => {
  // 创建一个观察器来监听DOM变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            hideDebugElements(element);
          }
        });
      }
    });
  });

  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 立即隐藏现有的调试控件
  hideDebugElements(document.body);

  // 定期检查并隐藏调试控件
  const intervalId = setInterval(() => {
    hideDebugElements(document.body);
  }, 1000);

  // 返回清理函数
  return () => {
    observer.disconnect();
    clearInterval(intervalId);
  };
};

const hideDebugElements = (container: Element) => {
  // 查找包含 "Send element" 或 "Send console" 文本的元素
  const textSelectors = [
    'Send element',
    'Send console',
    'send element',
    'send console'
  ];

  textSelectors.forEach(text => {
    const elements = Array.from(container.querySelectorAll('*')).filter(el => 
      el.textContent?.includes(text)
    );
    
    elements.forEach(el => {
      hideElement(el as HTMLElement);
      // 也隐藏父元素
      if (el.parentElement) {
        hideElement(el.parentElement);
      }
    });
  });

  // 查找特定的调试控件选择器
  const selectors = [
    '[data-testid*="send-element"]',
    '[data-testid*="send-console"]',
    'button[title*="Send element"]',
    'button[title*="Send console"]',
    '.send-element-button',
    '.send-console-button',
    '[class*="send-element"]',
    '[class*="send-console"]',
    '[class*="debug-"]',
    '[class*="devtools-"]'
  ];

  selectors.forEach(selector => {
    try {
      const elements = container.querySelectorAll(selector);
      elements.forEach(el => hideElement(el as HTMLElement));
    } catch (e) {
      // 忽略无效选择器错误
    }
  });

  // 特殊处理：查找包含雷电图标和"性能监控"文本的元素
  const thunderboltElements = container.querySelectorAll('span[role="img"][aria-label="thunderbolt"]');
  thunderboltElements.forEach(el => {
    const parent = el.closest('.ant-card-body');
    if (parent && parent.textContent?.includes('Send')) {
      hideElement(parent as HTMLElement);
    }
  });
};

const hideElement = (element: HTMLElement) => {
  if (element) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    element.style.width = '0';
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.setAttribute('aria-hidden', 'true');
  }
};
