/**
 * 缓存工具测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { cache, withCache } from "../cache";

describe("CacheManager", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should set and get cache", () => {
    cache.set("test-key", { data: "test" });
    const result = cache.get("test-key");
    expect(result).toEqual({ data: "test" });
  });

  it("should return null for non-existent key", () => {
    const result = cache.get("non-existent");
    expect(result).toBeNull();
  });

  it("should expire cache after TTL", async () => {
    cache.set("test-key", "test-value", 100); // 100ms TTL

    // 立即获取应该成功
    expect(cache.get("test-key")).toBe("test-value");

    // 等待超过TTL
    await new Promise((resolve) => setTimeout(resolve, 150));

    // 应该已过期
    expect(cache.get("test-key")).toBeNull();
  });

  it("should delete cache", () => {
    cache.set("test-key", "test-value");
    expect(cache.has("test-key")).toBe(true);

    cache.delete("test-key");
    expect(cache.has("test-key")).toBe(false);
  });

  it("should clear all cache", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it("should track access count", () => {
    cache.set("test-key", "test-value");

    // 多次访问
    cache.get("test-key");
    cache.get("test-key");
    cache.get("test-key");

    const stats = cache.getStats();
    expect(stats.size).toBeGreaterThan(0);
  });
});

describe("withCache decorator", () => {
  it("should cache function results", async () => {
    let callCount = 0;

    const testFn = async (arg: string) => {
      callCount++;
      return `result-${arg}`;
    };

    const cachedFn = withCache(testFn, {
      keyGenerator: (arg) => `test-${arg}`,
      ttl: 1000,
    });

    // 第一次调用
    const result1 = await cachedFn("test");
    expect(result1).toBe("result-test");
    expect(callCount).toBe(1);

    // 第二次调用应该使用缓存
    const result2 = await cachedFn("test");
    expect(result2).toBe("result-test");
    expect(callCount).toBe(1); // 不应该增加
  });
});
