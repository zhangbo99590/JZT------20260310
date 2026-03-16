
import ReactDOM from 'react-dom';

/**
 * 元素删除结果接口
 */
export interface DeleteResult {
  success: boolean;
  message: string;
  element?: HTMLElement;
}

/**
 * 元素删除选项接口
 */
export interface DeleteOptions {
  // 是否同步执行（默认为 true，如果是 false 则返回 Promise）
  sync?: boolean;
  // 删除前的回调，如果返回 false 则取消删除
  beforeDelete?: () => boolean | Promise<boolean>;
  // 删除后的回调
  afterDelete?: () => void;
  // 是否需要解绑 React 组件（如果是 React 根节点）
  unmountReactRoot?: boolean;
}

/**
 * 安全删除 DOM 元素的通用函数
 * 
 * @param selector 选择器字符串或元素对象
 * @param options 删除选项
 * @returns 删除结果或 Promise<DeleteResult>
 */
export function removeElement(
  selector: string | HTMLElement, 
  options: DeleteOptions = {}
): DeleteResult | Promise<DeleteResult> {
  const { 
    sync = true, 
    beforeDelete, 
    afterDelete,
    unmountReactRoot = false
  } = options;

  // 查找元素
  let element: HTMLElement | null = null;
  if (typeof selector === 'string') {
    element = document.querySelector(selector);
  } else {
    element = selector;
  }

  // 执行删除逻辑的内部函数
  const performDelete = async (): Promise<DeleteResult> => {
    if (!element) {
      return {
        success: false,
        message: '元素不存在'
      };
    }

    // 检查元素是否在文档中
    if (!document.body.contains(element)) {
      return {
        success: false,
        message: '元素不在文档中'
      };
    }

    try {
      // 执行删除前钩子
      if (beforeDelete) {
        const shouldProceed = await Promise.resolve(beforeDelete());
        if (!shouldProceed) {
          return {
            success: false,
            message: '删除操作被 beforeDelete 钩子取消',
            element
          };
        }
      }

      // 尝试清理 React 组件挂载
      if (unmountReactRoot) {
        try {
          // 尝试卸载可能挂载在该节点上的 React 应用
          // 注意：这只适用于 React 18 createRoot 之前的挂载方式，或者如果是通过 ReactDOM.render 挂载的
          // 对于 React 18+ 的 createRoot，通常需要引用 root 实例来 unmount，这里只能做尽力而为的清理
          ReactDOM.unmountComponentAtNode(element);
        } catch (e) {
          console.warn('尝试卸载 React 组件失败:', e);
        }
      }

      // 清理事件监听器 (Clone 节点替换法)
      // 注意：这会移除所有通过 addEventListener 添加的事件，但不会移除内联事件 (onclick=...)
      // 对于现代框架管理的元素，框架通常会处理事件解绑，但手动删除时此步骤作为安全网
      const clone = element.cloneNode(true) as HTMLElement;
      if (element.parentNode) {
        element.parentNode.replaceChild(clone, element);
        // 现在移除克隆节点
        clone.remove();
      } else {
        element.remove();
      }

      // 执行删除后钩子
      if (afterDelete) {
        afterDelete();
      }

      return {
        success: true,
        message: '元素删除成功',
        element: clone // 返回被移除的元素（克隆体）
      };
    } catch (error) {
      return {
        success: false,
        message: `删除过程发生错误: ${error instanceof Error ? error.message : String(error)}`,
        element
      };
    }
  };

  // 根据 sync 选项决定同步执行还是异步执行
  if (sync) {
    // 同步模式下，beforeDelete 必须是同步的，否则会抛出错误或行为不符合预期
    // 这里为了简化实现，如果用户在同步模式下传入了返回 Promise 的 beforeDelete，
    // 我们无法等待它，所以建议异步操作使用 sync: false
    
    // 简单的同步执行包装（注意：这不支持异步的 beforeDelete）
    if (beforeDelete && beforeDelete.constructor.name === 'AsyncFunction') {
      console.warn('警告: 在同步模式下使用了异步 beforeDelete 回调，这可能导致不可预期的行为。建议设置 sync: false。');
    }

    if (!element) {
      return { success: false, message: '元素不存在' };
    }

    if (!document.body.contains(element)) {
      return { success: false, message: '元素不在文档中' };
    }

    // 同步执行删除前检查
    if (beforeDelete) {
      const result = beforeDelete();
      if (result === false) {
        return { success: false, message: '删除操作被 beforeDelete 钩子取消', element };
      }
      // 如果 result 是 Promise，这里无法等待，继续执行
    }

    try {
      if (unmountReactRoot) {
        try {
          ReactDOM.unmountComponentAtNode(element);
        } catch (e) {
          console.warn('尝试卸载 React 组件失败:', e);
        }
      }

      // 克隆替换以清除事件
      const parent = element.parentNode;
      if (parent) {
        const clone = element.cloneNode(true) as HTMLElement;
        parent.replaceChild(clone, element);
        clone.remove();
        
        if (afterDelete) afterDelete();
        
        return { success: true, message: '元素删除成功', element: clone };
      } else {
        element.remove();
        if (afterDelete) afterDelete();
        return { success: true, message: '元素删除成功', element };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `删除过程发生错误: ${error instanceof Error ? error.message : String(error)}`, 
        element 
      };
    }
  } else {
    // 异步模式
    return performDelete();
  }
}
