"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
// 使用 next/dynamic 动态导入，进一步优化性能（手机端不下载桌面端代码，反之亦然）
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// 动态加载组件，ssr: false 表示不在服务器端渲染（因为 3D 库依赖浏览器对象）
const DesktopOS = dynamic(() => import("@/components/DesktopOS"), {
  ssr: false,
});
const MobileScrolly = dynamic(() => import("@/components/MobileScrolly"), {
  ssr: false,
});

export default function Portfolio() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  // 防止 Next.js 水合不匹配错误 (Hydration Mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-black h-screen w-screen" />; // 加载前的黑屏或 Loading 动画

  return (
    <main className="w-screen h-screen overflow-hidden">
      {isMobile ? (
        // 移动端：显示 Ghost 风格滚动
        <MobileScrolly />
      ) : (
        // 桌面端：显示 Windows 风格系统
        <DesktopOS />
      )}
    </main>
  );
}
