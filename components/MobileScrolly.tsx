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

// --- 1. 修复 ShapeMesh: visible 类型改为 number ---
const ShapeMesh = ({ index, visible }: { index: number; visible: number }) => {
  const meshRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 可见度逻辑修复：visible 现在是一个 0-1 的浮点数
      // 这里的逻辑是：让物体根据 scroll 的曲线大小进行缩放
      const targetScale = visible * 1.2;

      // 使用 lerp 平滑过渡缩放
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );

      // 自转动画
      const dir = index % 2 === 0 ? 1 : -1;
      meshRef.current.rotation.y += delta * 0.5 * dir;
      meshRef.current.rotation.x += delta * 0.2 * dir;
    }
  });

  const geometryType = index % 4;

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        {geometryType === 0 && <octahedronGeometry args={[1, 0]} />}
        {geometryType === 1 && <icosahedronGeometry args={[1, 0]} />}
        {geometryType === 2 && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {geometryType === 3 && (
          <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />
        )}

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

// --- 2. 场景内容 ---
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
      {/* 首页 Intro 物体 */}
      <Float>
        <mesh ref={introRef} position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <MeshDistortMaterial color="#42a5f5" distort={0.4} speed={2} />
        </mesh>
      </Float>

      {/* 动态生成每个项目的 3D 物体 */}
      {items.map((item, i) => (
        <group key={item.id} position={[0, -height * (i + 1), 0]}>
          <ConnectedItem index={i} total={items.length} />
        </group>
      ))}

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

// --- 3. 连接组件 ---
const ConnectedItem = ({ index, total }: { index: number; total: number }) => {
  const scroll = useScroll();

  const pageIndex = index + 1;
  const totalPages = total + 1;

  // curve 返回的是 number (0到1)，所以传入 ShapeMesh 的 visible 也是 number
  const visible = scroll.curve(
    pageIndex / totalPages - 0.5 / totalPages,
    1 / totalPages
  );

  return <ShapeMesh index={index} visible={visible} />;
};

export default function MobileScrolly() {
  const items = RESUME_DATA.items.filter((i) => i.mobile);
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

        <ScrollControls pages={pageCount} damping={0.2}>
          <SceneContent />

          <Scroll html style={{ width: "100%" }}>
            {/* Intro */}
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

            {/* 项目页 */}
            {items.map((item, i) => (
              <div
                key={item.id}
                className="w-full h-screen flex flex-col items-center justify-start pt-24 text-center pointer-events-none px-6"
              >
                <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-2 justify-center drop-shadow-md">
                  <span className="text-3xl">
                    {item.mobile.icon || item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.mobile.tag}</span>
                </h2>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/10 mt-4 shadow-2xl">
                  <p className="text-gray-200 text-base leading-relaxed font-light">
                    {item.mobile.shortDesc}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full">
                      {item.title}
                    </span>
                  </div>
                </div>

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
