
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { removeElement } from './domUtils';

describe('removeElement', () => {
  let container: HTMLDivElement;
  let element: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    element = document.createElement('div');
    element.id = 'test-element';
    element.className = 'test-class';
    element.innerHTML = 'Test Content';
    container.appendChild(element);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  it('应该能通过 ID 选择器同步删除元素', () => {
    const result = removeElement('#test-element', { sync: true }) as any;
    
    expect(result.success).toBe(true);
    expect(document.getElementById('test-element')).toBeNull();
  });

  it('应该能通过 DOM 对象同步删除元素', () => {
    const result = removeElement(element, { sync: true }) as any;
    
    expect(result.success).toBe(true);
    expect(container.contains(element)).toBe(false);
  });

  it('当元素不存在时应返回失败', () => {
    const result = removeElement('#non-existent', { sync: true }) as any;
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('不存在');
  });

  it('应该执行 beforeDelete 钩子', () => {
    const beforeDelete = vi.fn().mockReturnValue(true);
    
    removeElement(element, { sync: true, beforeDelete });
    
    expect(beforeDelete).toHaveBeenCalled();
    expect(container.contains(element)).toBe(false);
  });

  it('当 beforeDelete 返回 false 时应取消删除', () => {
    const beforeDelete = vi.fn().mockReturnValue(false);
    
    const result = removeElement(element, { sync: true, beforeDelete }) as any;
    
    expect(beforeDelete).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.message).toContain('取消');
    expect(container.contains(element)).toBe(true);
  });

  it('应该执行 afterDelete 钩子', () => {
    const afterDelete = vi.fn();
    
    removeElement(element, { sync: true, afterDelete });
    
    expect(afterDelete).toHaveBeenCalled();
    expect(container.contains(element)).toBe(false);
  });

  it('异步模式下应该返回 Promise', async () => {
    const promise = removeElement(element, { sync: false });
    
    expect(promise).toBeInstanceOf(Promise);
    
    const result = await promise;
    expect(result.success).toBe(true);
    expect(container.contains(element)).toBe(false);
  });

  it('异步模式下应该支持异步 beforeDelete', async () => {
    const beforeDelete = vi.fn().mockResolvedValue(true);
    
    await removeElement(element, { sync: false, beforeDelete });
    
    expect(beforeDelete).toHaveBeenCalled();
    expect(container.contains(element)).toBe(false);
  });

  it('异步模式下应该支持异步 beforeDelete 取消操作', async () => {
    const beforeDelete = vi.fn().mockResolvedValue(false);
    
    const result = await removeElement(element, { sync: false, beforeDelete });
    
    expect(beforeDelete).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(container.contains(element)).toBe(true);
  });

  it('删除操作应移除元素上的事件监听器', () => {
    // 模拟事件监听
    const clickHandler = vi.fn();
    element.addEventListener('click', clickHandler);
    
    // 触发点击以确认监听器有效
    element.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);
    
    // 删除元素
    const result = removeElement(element, { sync: true }) as any;
    const removedElement = result.element;
    
    // 在返回的克隆元素上触发点击
    removedElement.click();
    
    // 计数不应增加，说明事件监听器已被移除（通过 cloneNode）
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('应该处理嵌套元素的删除', () => {
    const child = document.createElement('span');
    child.id = 'child-element';
    element.appendChild(child);
    
    removeElement(element);
    
    expect(document.getElementById('child-element')).toBeNull();
  });
});
