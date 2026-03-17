/**
 * 首页轮播图组件
 * 创建时间: 2026-03-02
 * 更新时间: 2026-03-05
 * 功能: 展示产业对接、政策申报、平台能力三大核心业务轮播图
 * 特性: 自动轮播、手动切换、hover暂停、响应式设计、登录检查
 */

import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./BannerSection.css";

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  link: string;
  requireLogin: boolean;
}

const bannerData: BannerItem[] = [
  {
    id: 1,
    title: "【产业对接】数据驱动产业生态",
    subtitle: "依托企业数据构建产业画像，精准匹配上下游资源",
    buttonText: "立即对接",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800&q=90",
    link: "/industry/service-match/workbench",
    requireLogin: true,
  },
  {
    id: 2,
    title: "【最新政策】高新技术企业认定申报",
    subtitle: "全面解读最新认定标准，助您轻松通过认定享受税收优惠",
    buttonText: "查看详情",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800&q=90",
    link: "/policy-center/main",
    requireLogin: true,
  },
  {
    id: 3,
    title: "【平台能力】双轮驱动企业发展",
    subtitle: "AI精准匹配政策，全链路产业资源对接，累计赋能企业超1000家",
    buttonText: "了解更多",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800&q=90",
    link: "/about",
    requireLogin: false,
  },
];

interface BannerSectionProps {
  loading?: boolean;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  loading = false,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDelayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 检查用户是否登录
  const isLoggedIn = () => {
    return !!localStorage.getItem("username");
  };

  // 处理按钮点击
  const handleButtonClick = (item: BannerItem) => {
    if (item.requireLogin && !isLoggedIn()) {
      Modal.confirm({
        title: "登录提示",
        content: "请先登录后再进行操作",
        okText: "去登录",
        cancelText: "取消",
        onOk: () => {
          navigate("/login");
        },
      });
      return;
    }
    navigate(item.link);
  };

  // 切换到下一张
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerData.length);
  };

  // 切换到上一张
  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + bannerData.length) % bannerData.length,
    );
  };

  // 切换到指定索引
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // 清除所有定时器
  const clearTimers = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    if (initialDelayTimerRef.current) {
      clearTimeout(initialDelayTimerRef.current);
      initialDelayTimerRef.current = null;
    }
  };

  // 启动自动轮播
  const startAutoPlay = () => {
    clearTimers();
    autoPlayTimerRef.current = setInterval(() => {
      goToNext();
    }, 5000); // 5秒切换间隔
  };

  // 初始化自动轮播（3秒延迟启动）
  useEffect(() => {
    initialDelayTimerRef.current = setTimeout(() => {
      startAutoPlay();
    }, 3000); // 3秒后启动自动轮播

    return () => {
      clearTimers();
    };
  }, []);

  // hover时暂停，离开时恢复
  useEffect(() => {
    if (isHovered) {
      clearTimers();
    } else {
      startAutoPlay();
    }
  }, [isHovered]);

  // 手动切换后重置定时器
  useEffect(() => {
    if (!isHovered) {
      startAutoPlay();
    }
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="banner-section-wrapper">
        <div className="banner-carousel loading">
          <div className="banner-slide active">
            <div className="banner-overlay">
              <div className="banner-content">
                <div className="loading-placeholder title"></div>
                <div className="loading-placeholder subtitle"></div>
                <div className="loading-placeholder button"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="banner-section-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="banner-carousel">
        {bannerData.map((item, index) => (
          <div
            key={item.id}
            className={`banner-slide ${index === currentIndex ? "active" : ""}`}
            style={{
              backgroundImage: `url(${item.image})`,
            }}
          >
            <div className="banner-overlay">
              <div className="banner-content">
                <h1 className="banner-title">{item.title}</h1>
                <p className="banner-subtitle">{item.subtitle}</p>
                <Button
                  type="primary"
                  size="large"
                  icon={<RightOutlined />}
                  className="banner-button"
                  onClick={() => handleButtonClick(item)}
                >
                  <span className="button-text">{item.buttonText}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* 左右箭头 */}
        <button
          className="banner-arrow banner-arrow-left"
          onClick={goToPrev}
          aria-label="上一张"
        >
          <LeftOutlined />
        </button>
        <button
          className="banner-arrow banner-arrow-right"
          onClick={goToNext}
          aria-label="下一张"
        >
          <RightOutlined />
        </button>

        {/* 指示器 */}
        <div className="banner-indicators">
          {bannerData.map((_, index) => (
            <button
              key={index}
              className={`banner-indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToIndex(index)}
              aria-label={`切换到第${index + 1}张`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
