/**
 * 收藏管理 Hook
 * 创建时间: 2026-01-13
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { message, Modal } from "antd";
import type { FavoriteItem, FavoriteStats } from "../types/index";
import { mockFavorites } from "../mock/index";
import { StorageUtils } from "../../../../utils/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [stats, setStats] = useState<FavoriteStats>({
    total: 0,
    policy: 0,
    opportunity: 0,
    financing: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  // 从localStorage加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      let storedFavorites = StorageUtils.getItem("my-favorites", null);

      // 如果本地没有数据，加载模拟数据
      if (storedFavorites === null) {
        storedFavorites = mockFavorites;
        StorageUtils.setItem("my-favorites", storedFavorites);
      }

      setFavorites(storedFavorites);

      // 计算统计数据
      const newStats: FavoriteStats = {
        total: storedFavorites.length,
        policy: storedFavorites.filter(
          (item: FavoriteItem) => item.type === "policy",
        ).length,
        opportunity: storedFavorites.filter(
          (item: FavoriteItem) => item.type === "opportunity",
        ).length,
        financing: storedFavorites.filter(
          (item: FavoriteItem) => item.type === "financing",
        ).length,
        thisMonth: storedFavorites.filter(
          (item: FavoriteItem) =>
            new Date(item.addedDate).getMonth() === new Date().getMonth(),
        ).length,
        lastMonth: storedFavorites.filter(
          (item: FavoriteItem) =>
            new Date(item.addedDate).getMonth() === new Date().getMonth() - 1,
        ).length,
      };
      setStats(newStats);
    };

    loadFavorites();

    // 监听localStorage变化，实现实时同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "my-favorites") {
        loadFavorites();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 定期检查localStorage变化（用于同一页面内的更新）
    const interval = setInterval(loadFavorites, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 筛选收藏项目
  const filteredFavorites = useMemo(() => {
    return favorites
      .filter((item) => {
        const matchesSearch =
          !searchKeyword ||
          item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          item.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (item.tags &&
            item.tags.some((tag) =>
              tag.toLowerCase().includes(searchKeyword.toLowerCase()),
            ));

        const matchesTab = activeTab === "all" || item.type === activeTab;

        const matchesDate =
          !dateRange ||
          (new Date(item.addedDate) >= new Date(dateRange[0]) &&
            new Date(item.addedDate) <= new Date(dateRange[1]));

        return matchesSearch && matchesTab && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.addedDate).getTime();
        const dateB = new Date(b.addedDate).getTime();
        return dateB - dateA; // 按最新排序
      });
  }, [favorites, searchKeyword, activeTab, dateRange]);

  // 批量选择处理
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(filteredFavorites.map((item) => item.id));
      } else {
        setSelectedItems([]);
      }
    },
    [filteredFavorites],
  );

  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  }, []);

  // 批量删除收藏
  const handleBatchDelete = useCallback(() => {
    if (selectedItems.length === 0) {
      message.warning("请选择要删除的收藏项");
      return;
    }

    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${selectedItems.length} 项收藏吗？`,
      onOk: () => {
        const updatedFavorites = favorites.filter(
          (item) => !selectedItems.includes(item.id),
        );
        setFavorites(updatedFavorites);
        StorageUtils.setItem("my-favorites", updatedFavorites);
        setSelectedItems([]);
        message.success(`已删除 ${selectedItems.length} 项收藏`);
      },
    });
  }, [selectedItems, favorites]);

  // 批量导出
  const handleBatchExport = useCallback(() => {
    if (selectedItems.length === 0) {
      message.warning("请选择要导出的收藏项");
      return;
    }
    setExportModalVisible(true);
  }, [selectedItems]);

  // 确认导出
  const confirmExport = useCallback(
    (format: "excel" | "pdf") => {
      const selectedFavorites = favorites.filter((item) =>
        selectedItems.includes(item.id),
      );

      // 模拟导出过程
      message.loading("正在导出...", 2);
      setTimeout(() => {
        message.success(
          `已导出 ${
            selectedFavorites.length
          } 项收藏为 ${format.toUpperCase()} 格式`,
        );
        setExportModalVisible(false);
        setSelectedItems([]);
      }, 2000);
    },
    [favorites, selectedItems],
  );

  // 删除单个收藏
  const handleRemoveFavorite = useCallback(
    (id: string) => {
      const updatedFavorites = favorites.filter((item) => item.id !== id);
      setFavorites(updatedFavorites);
      StorageUtils.setItem("my-favorites", updatedFavorites);
      message.success("已取消收藏");
    },
    [favorites],
  );

  return {
    favorites,
    filteredFavorites,
    searchKeyword,
    setSearchKeyword,
    activeTab,
    setActiveTab,
    selectedItems,
    setSelectedItems,
    dateRange,
    setDateRange,
    exportModalVisible,
    setExportModalVisible,
    stats,
    handleSelectAll,
    handleSelectItem,
    handleBatchDelete,
    handleBatchExport,
    confirmExport,
    handleRemoveFavorite,
  };
}
