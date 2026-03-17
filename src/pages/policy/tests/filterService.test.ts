/**
 * 筛选服务单元测试
 * 验证筛选功能的准确性和性能
 */

import FilterService from "../services/filterService";
import {
  FilterType,
  FilterOperator,
  PolicyItem,
  FilterCondition,
} from "../types/filterTypes";

// 模拟政策数据生成器
const generateMockPolicies = (count: number): PolicyItem[] => {
  const districts = ["朝阳区", "海淀区", "丰台区", "东城区", "西城区"];
  const industries = [
    "工业、交通 / 信息产业（含电信）",
    "科技、教育 / 科技",
    "城乡建设、环境保护 / 节能与资源综合利用",
  ];
  const levels = ["国家级", "省级", "市级", "区县级"];
  const orgTypes = ["政府部门", "金融机构", "行业协会"];

  return Array.from({ length: count }, (_, index) => ({
    id: `policy_${index}`,
    title: `政策标题 ${index}`,
    summary: `政策摘要内容 ${index}`,
    district: districts[index % districts.length],
    industry: industries[index % industries.length],
    level: levels[index % levels.length],
    orgType: orgTypes[index % orgTypes.length],
    policyOrg: `发文机构 ${index}`,
    subsidyType: "direct_subsidy",
    subsidyAmount: `${(index + 1) * 10}万元`,
    publishDate: new Date(2024, 0, (index % 30) + 1)
      .toISOString()
      .split("T")[0],
    tags: [`标签${index}`, `类别${index % 3}`],
    matchScore: 0,
  }));
};

describe("FilterService", () => {
  let filterService: FilterService;
  let mockPolicies: PolicyItem[];

  beforeEach(() => {
    filterService = FilterService.getInstance();
    filterService.resetFilters();
    mockPolicies = generateMockPolicies(100);
  });

  afterEach(() => {
    filterService.cleanup();
  });

  describe("基础功能测试", () => {
    test("应该能够添加筛选条件", () => {
      const condition: Omit<FilterCondition, "id"> = {
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
        priority: 1,
      };

      const conditionId = filterService.addCondition(condition);

      expect(conditionId).toBeDefined();
      expect(typeof conditionId).toBe("string");

      const state = filterService.getFilterState();
      expect(state.conditions).toHaveLength(1);
      expect(state.conditions[0].type).toBe(FilterType.DISTRICT);
    });

    test("应该能够移除筛选条件", () => {
      const conditionId = filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const removed = filterService.removeCondition(conditionId);

      expect(removed).toBe(true);

      const state = filterService.getFilterState();
      expect(state.conditions).toHaveLength(0);
    });

    test("应该能够更新筛选条件", () => {
      const conditionId = filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const updated = filterService.updateCondition(conditionId, {
        value: ["朝阳区", "海淀区"],
        label: "朝阳区, 海淀区",
      });

      expect(updated).toBe(true);

      const state = filterService.getFilterState();
      expect(state.conditions[0].value).toEqual(["朝阳区", "海淀区"]);
    });

    test("应该能够重置所有筛选条件", () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addCondition({
        type: FilterType.INDUSTRY,
        value: ["科技、教育 / 科技"],
        label: "科技",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.resetFilters();

      const state = filterService.getFilterState();
      expect(state.conditions).toHaveLength(0);
    });
  });

  describe("筛选逻辑测试", () => {
    test("应该正确筛选单个条件", async () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const result = await filterService.executeSearch(mockPolicies);

      expect(result.total).toBeGreaterThan(0);
      expect(result.items.every((item) => item.district === "朝阳区")).toBe(
        true,
      );
    });

    test("应该正确筛选多个条件（AND逻辑）", async () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addCondition({
        type: FilterType.INDUSTRY,
        value: ["科技、教育 / 科技"],
        label: "科技",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const result = await filterService.executeSearch(mockPolicies);

      expect(
        result.items.every(
          (item) =>
            item.district === "朝阳区" && item.industry === "科技、教育 / 科技",
        ),
      ).toBe(true);
    });

    test("应该正确处理空筛选条件", async () => {
      const result = await filterService.executeSearch(mockPolicies);

      expect(result.total).toBe(mockPolicies.length);
      expect(result.items).toHaveLength(mockPolicies.length);
    });

    test("应该正确计算匹配分数", async () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
        priority: 2,
      });

      const result = await filterService.executeSearch(mockPolicies);

      expect(
        result.items.every(
          (item) => typeof item.matchScore === "number" && item.matchScore >= 0,
        ),
      ).toBe(true);
    });

    test("应该按匹配分数排序结果", async () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区", "海淀区"],
        label: "朝阳区, 海淀区",
        operator: FilterOperator.IN,
        isActive: true,
        priority: 1,
      });

      const result = await filterService.executeSearch(mockPolicies);

      // 检查结果是否按匹配分数降序排列
      for (let i = 0; i < result.items.length - 1; i++) {
        const currentScore = result.items[i].matchScore || 0;
        const nextScore = result.items[i + 1].matchScore || 0;
        expect(currentScore).toBeGreaterThanOrEqual(nextScore);
      }
    });
  });

  describe("性能测试", () => {
    test("小数据集性能测试（100条）", async () => {
      const smallDataset = generateMockPolicies(100);

      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const startTime = performance.now();
      const result = await filterService.executeSearch(smallDataset);
      const executionTime = performance.now() - startTime;

      expect(executionTime).toBeLessThan(100); // 应该在100ms内完成
      expect(result.executionTime).toBeLessThan(100);
    });

    test("中等数据集性能测试（1000条）", async () => {
      const mediumDataset = generateMockPolicies(1000);

      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区", "海淀区"],
        label: "朝阳区, 海淀区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addCondition({
        type: FilterType.INDUSTRY,
        value: ["科技、教育 / 科技"],
        label: "科技",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const startTime = performance.now();
      const result = await filterService.executeSearch(mediumDataset);
      const executionTime = performance.now() - startTime;

      expect(executionTime).toBeLessThan(500); // 应该在500ms内完成
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    test("大数据集性能测试（5000条）", async () => {
      const largeDataset = generateMockPolicies(5000);

      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const startTime = performance.now();
      const result = await filterService.executeSearch(largeDataset);
      const executionTime = performance.now() - startTime;

      expect(executionTime).toBeLessThan(1000); // 应该在1秒内完成
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    test("复杂筛选条件性能测试", async () => {
      const dataset = generateMockPolicies(2000);

      // 添加多个筛选条件
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区", "海淀区", "丰台区"],
        label: "多区域",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addCondition({
        type: FilterType.INDUSTRY,
        value: ["科技、教育 / 科技", "工业、交通 / 信息产业（含电信）"],
        label: "多行业",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addCondition({
        type: FilterType.LEVEL,
        value: ["国家级", "省级"],
        label: "多级别",
        operator: FilterOperator.IN,
        isActive: true,
      });

      const startTime = performance.now();
      const result = await filterService.executeSearch(dataset);
      const executionTime = performance.now() - startTime;

      expect(executionTime).toBeLessThan(800); // 复杂查询应该在800ms内完成
      expect(
        result.items.every(
          (item) =>
            ["朝阳区", "海淀区", "丰台区"].includes(item.district) &&
            ["科技、教育 / 科技", "工业、交通 / 信息产业（含电信）"].includes(
              item.industry,
            ) &&
            ["国家级", "省级"].includes(item.level),
        ),
      ).toBe(true);
    });
  });

  describe("缓存机制测试", () => {
    test("应该缓存相同的查询结果", async () => {
      const dataset = generateMockPolicies(500);

      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      // 第一次查询
      const startTime1 = performance.now();
      const result1 = await filterService.executeSearch(dataset);
      const executionTime1 = performance.now() - startTime1;

      // 第二次相同查询（应该使用缓存）
      const startTime2 = performance.now();
      const result2 = await filterService.executeSearch(dataset);
      const executionTime2 = performance.now() - startTime2;

      expect(result1.total).toBe(result2.total);
      expect(executionTime2).toBeLessThan(executionTime1); // 缓存查询应该更快
    });
  });

  describe("边界条件测试", () => {
    test("应该处理空数据集", async () => {
      const result = await filterService.executeSearch([]);

      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    test("应该处理无效的筛选条件", () => {
      expect(() => {
        filterService.addCondition({
          type: FilterType.DISTRICT,
          value: "",
          label: "",
          operator: FilterOperator.IN,
          isActive: true,
        });
      }).toThrow();
    });

    test("应该处理不存在的条件ID", () => {
      const result = filterService.removeCondition("non-existent-id");
      expect(result).toBe(false);
    });

    test("应该处理非活跃的筛选条件", async () => {
      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: false, // 非活跃条件
      });

      const result = await filterService.executeSearch(mockPolicies);

      // 非活跃条件不应该影响筛选结果
      expect(result.total).toBe(mockPolicies.length);
    });
  });

  describe("事件系统测试", () => {
    test("应该触发条件添加事件", (done) => {
      filterService.addEventListener("condition_added" as any, (event) => {
        expect(event.type).toBe("condition_added");
        expect(event.payload.condition).toBeDefined();
        done();
      });

      filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });
    });

    test("应该触发条件移除事件", (done) => {
      const conditionId = filterService.addCondition({
        type: FilterType.DISTRICT,
        value: ["朝阳区"],
        label: "朝阳区",
        operator: FilterOperator.IN,
        isActive: true,
      });

      filterService.addEventListener("condition_removed" as any, (event) => {
        expect(event.type).toBe("condition_removed");
        expect(event.payload.condition).toBeDefined();
        done();
      });

      filterService.removeCondition(conditionId);
    });
  });

  describe("内存管理测试", () => {
    test("应该正确清理资源", () => {
      // 添加多个筛选条件
      for (let i = 0; i < 10; i++) {
        filterService.addCondition({
          type: FilterType.DISTRICT,
          value: [`区域${i}`],
          label: `区域${i}`,
          operator: FilterOperator.IN,
          isActive: true,
        });
      }

      // 清理资源
      filterService.cleanup();

      // 验证状态已重置
      const state = filterService.getFilterState();
      expect(state.conditions).toHaveLength(0);
    });
  });
});

// 集成测试
describe("FilterService Integration Tests", () => {
  let filterService: FilterService;

  beforeEach(() => {
    filterService = FilterService.getInstance();
    filterService.resetFilters();
  });

  test("完整的筛选流程测试", async () => {
    const policies = generateMockPolicies(1000);

    // 1. 添加区域筛选
    const districtConditionId = filterService.addCondition({
      type: FilterType.DISTRICT,
      value: ["朝阳区", "海淀区"],
      label: "朝阳区, 海淀区",
      operator: FilterOperator.IN,
      isActive: true,
      priority: 2,
    });

    // 2. 执行搜索
    let result = await filterService.executeSearch(policies);
    const firstResultCount = result.total;

    expect(firstResultCount).toBeGreaterThan(0);
    expect(
      result.items.every((item) =>
        ["朝阳区", "海淀区"].includes(item.district),
      ),
    ).toBe(true);

    // 3. 添加行业筛选
    filterService.addCondition({
      type: FilterType.INDUSTRY,
      value: ["科技、教育 / 科技"],
      label: "科技",
      operator: FilterOperator.IN,
      isActive: true,
      priority: 3,
    });

    // 4. 再次执行搜索
    result = await filterService.executeSearch(policies);
    const secondResultCount = result.total;

    expect(secondResultCount).toBeLessThanOrEqual(firstResultCount);
    expect(
      result.items.every(
        (item) =>
          ["朝阳区", "海淀区"].includes(item.district) &&
          item.industry === "科技、教育 / 科技",
      ),
    ).toBe(true);

    // 5. 移除区域筛选
    filterService.removeCondition(districtConditionId);

    result = await filterService.executeSearch(policies);

    expect(
      result.items.every((item) => item.industry === "科技、教育 / 科技"),
    ).toBe(true);

    // 6. 重置所有筛选
    filterService.resetFilters();

    result = await filterService.executeSearch(policies);
    expect(result.total).toBe(policies.length);
  });
});
