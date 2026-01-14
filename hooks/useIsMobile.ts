"use client";
import { useState, useEffect } from "react";

export function useIsMobile() {
  // 默认设为 false，防止服务端渲染时闪烁
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 768px 是 iPad/手机的分界线
      setIsMobile(window.innerWidth < 768);
    };

    // 初始化检查
    checkMobile();

    // 监听窗口大小变化
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
