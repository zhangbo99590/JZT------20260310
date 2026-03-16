/**
 * 登录页面左侧内容组件
 * 创建时间: 2026-01-13
 * 功能: 渲染登录页面左侧的品牌介绍和功能特色
 */

import React from "react";

/**
 * 登录页面左侧内容组件
 * 组件创建时间: 2026-01-13
 */
export const LoginLeft: React.FC = () => {
  return (
    <div className="login-left">
      <h1>璟智通</h1>
      <p>
        一站式企业合规服务平台，为企业提供政策解读、法律咨询、产业对接、金融服务等全方位支持。
      </p>
      <div className="features">
        <div className="feature-item">政策中心 - 实时政策推送</div>
        <div className="feature-item">法律护航 - 专业法律咨询</div>
        <div className="feature-item">产业大厅 - 资源精准对接</div>
        <div className="feature-item">金融服务 - 融资一站解决</div>
      </div>
    </div>
  );
};
