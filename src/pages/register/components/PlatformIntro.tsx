/**
 * 平台介绍组件
 * 创建时间: 2026-01-13
 * 功能: 展示平台介绍和功能特性
 */

import React from "react";
import { platformInfo, features } from "../config/contentConfig";

/**
 * 平台介绍组件
 * 组件创建时间: 2026-01-13
 */
const PlatformIntro: React.FC = () => {
  return (
    <div className="register-left">
      <h1>{platformInfo.title}</h1>
      <p>{platformInfo.description}</p>
      <div className="features">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            {feature.title} - {feature.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformIntro;
