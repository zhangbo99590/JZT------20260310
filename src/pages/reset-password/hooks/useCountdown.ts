/**
 * 倒计时自定义Hook
 * 创建时间: 2026-01-13
 * 功能: 管理验证码发送倒计时逻辑
 */

import { useState, useEffect } from "react";

/**
 * 倒计时Hook
 * Hook创建时间: 2026-01-13
 *
 * @param initialCount 初始倒计时秒数
 * @returns 倒计时状态和控制函数
 */
export const useCountdown = (initialCount: number = 60) => {
  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /**
   * 开始倒计时
   * 函数创建时间: 2026-01-13
   */
  const startCountdown = () => {
    setCountdown(initialCount);
  };

  /**
   * 重置倒计时
   * 函数创建时间: 2026-01-13
   */
  const resetCountdown = () => {
    setCountdown(0);
  };

  return {
    countdown,
    startCountdown,
    resetCountdown,
    isCountingDown: countdown > 0,
  };
};
