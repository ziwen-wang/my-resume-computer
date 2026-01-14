"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  Scroll,
  useScroll,
  Stars,
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { RESUME_DATA } from "@/data/resume";

// 1. 定义不同的 3D 形状组件，让每个项目看起来不一样
const ShapeMesh = ({ index, visible }: { index: number; visible: boolean }) => {
  const meshRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 进场/出场动画：根据可见度缩放
      const targetScale = visible ? 1.2 : 0;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );

      // 自转动画 (奇偶数方向不同)
      const dir = index % 2 === 0 ? 1 : -1;
      meshRef.current.rotation.y += delta * 0.5 * dir;
      meshRef.current.rotation.x += delta * 0.2 * dir;
    }
  });

  // 根据索引轮换展示不同的几何体
  const geometryType = index % 4;

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        {/* 0: 八面体 (Web3感) */}
        {geometryType === 0 && <octahedronGeometry args={[1, 0]} />}
        {/* 1: 扭曲球体 (算力感) */}
        {geometryType === 1 && <icosahedronGeometry args={[1, 0]} />}
        {/* 2: 线框立方体 (工程/BIM感) */}
        {geometryType === 2 && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {/* 3: 环形结 (抽象技能感) */}
        {geometryType === 3 && (
          <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />
        )}

        {/* 材质轮换：紫色 -> 绿色 -> 蓝色 -> 黄色 */}
        {geometryType === 0 && (
          <meshStandardMaterial color="#8b5cf6" wireframe />
        )}
        {geometryType === 1 && (
          <MeshDistortMaterial color="#10b981" speed={4} distort={0.6} />
        )}
        {geometryType === 2 && (
          <meshStandardMaterial color="#3b82f6" wireframe />
        )}
        {geometryType === 3 && (
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.2}
            metalness={0.8}
          />
        )}
      </mesh>
    </Float>
  );
};

// 2. 场景内容管理器
function SceneContent() {
  const scroll = useScroll();
  const { height } = useThree((state) => state.viewport);
  const introRef = useRef<any>(null);

  // 过滤出有 mobile 字段的项目
  const items = useMemo(() => RESUME_DATA.items.filter((i) => i.mobile), []);

  useFrame((state, delta) => {
    // 首页 Intro 的淡出逻辑
    const r0 = scroll.range(0, 1 / (items.length + 1));
    if (introRef.current) {
      introRef.current.scale.setScalar(1 - r0);
      introRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group>
      {/* 首页 Intro 物体 (始终在最顶端) */}
      <Float>
        <mesh ref={introRef} position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <MeshDistortMaterial color="#42a5f5" distort={0.4} speed={2} />
        </mesh>
      </Float>

      {/* 遍历生成每个项目的 3D 物体 */}
      {items.map((item, i) => {
        // 计算这一页的滚动区间
        // 页面总数 = items.length + 1 (首页)
        const totalPages = items.length + 1;
        // 这一页的起始点 (offset)
        const pageOffset = (i + 1) / totalPages;
        const duration = 1 / totalPages;

        // 使用 hooks 必须在组件内部，所以这里我们在 map 里调用 useScroll 是不行的
        // 解决办法：把 useScroll 的结果传给子组件，或者在子组件里用 useScroll
        // 这里为了简单，我们把“可见性计算”放进 ShapeMesh 组件里去算不太好传，
        // 更好的方式是：在 SceneContent 里算好，但这里是 map 循环。
        // --- 修正方案：直接传索引给 ShapeMesh，让它自己根据 scroll global state 计算
        return (
          <group key={item.id} position={[0, -height * (i + 1), 0]}>
            <ConnectedItem index={i} total={items.length} />
          </group>
        );
      })}

      <Sparkles
        count={150}
        scale={10}
        size={4}
        speed={0.4}
        opacity={0.5}
        color="#fff"
      />
    </group>
  );
}

// 辅助组件：用于连接 Scroll 状态和 Mesh
const ConnectedItem = ({ index, total }: { index: number; total: number }) => {
  const scroll = useScroll();
  // 计算当前项是否可见
  // pageOffset 偏移量：第1个项目实际上是第2页（第1页是 Intro）
  const pageIndex = index + 1;
  const totalPages = total + 1;

  // curve(offset, duration)
  // offset 应该是 pageIndex / totalPages
  // duration 稍微给宽一点，0.3 左右
  const visible = scroll.curve(
    pageIndex / totalPages - 0.5 / totalPages,
    1 / totalPages
  );

  return <ShapeMesh index={index} visible={visible} />;
};

export default function MobileScrolly() {
  // 过滤出需要展示的项目
  const items = RESUME_DATA.items.filter((i) => i.mobile);
  // 总页数 = 项目数 + 1 (Intro页)
  const pageCount = items.length + 1;

  return (
    <div className="w-full h-full bg-black">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 60 }}>
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#42a5f5"
        />
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
        />

        {/* 动态计算页数 */}
        <ScrollControls pages={pageCount} damping={0.2}>
          <SceneContent />

          <Scroll html style={{ width: "100%" }}>
            {/* --- 1. 首页 Intro --- */}
            <div className="w-full h-screen flex flex-col items-center justify-end pb-32 text-center pointer-events-none px-6">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-purple-600 mb-2">
                {RESUME_DATA.profile.name}
              </h1>
              <p className="text-gray-400 font-mono text-sm border-t border-gray-600 pt-4 mt-2">
                {RESUME_DATA.profile.role} <br /> {RESUME_DATA.profile.exp}
              </p>
              <div className="animate-bounce text-gray-600 text-xs mt-12">
                SCROLL DOWN ↓
              </div>
            </div>

            {/* --- 2. 动态生成项目页 --- */}
            {items.map((item, i) => (
              <div
                key={item.id}
                className="w-full h-screen flex flex-col items-center justify-start pt-24 text-center pointer-events-none px-6"
              >
                {/* 标题 */}
                <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-2 justify-center drop-shadow-md">
                  <span className="text-3xl">
                    {item.mobile.icon || item.icon}
                  </span>
                  {/* 如果标题太长，手机上可以截断或换行 */}
                  <span className="whitespace-nowrap">{item.mobile.tag}</span>
                </h2>

                {/* 内容卡片 */}
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 mt-4 shadow-2xl">
                  <p className="text-gray-200 text-base leading-relaxed font-light">
                    {item.mobile.shortDesc}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {/* 这里放个 View Details 假按钮，增加交互感 */}
                    <span className="text-[10px] uppercase tracking-widest text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full">
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* 最后一个项目显示 End */}
                {i === items.length - 1 && (
                  <div className="mt-auto pb-10 text-gray-600 text-xs">
                    - END OF RESUME -
                  </div>
                )}
              </div>
            ))}
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
