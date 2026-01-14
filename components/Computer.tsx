"use client";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";

export function Computer({
  position = [0, 0, 0],
  onClick,
}: {
  position?: [number, number, number];
  onClick?: () => void;
}) {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}>
      {/* 这里我们用 RigidBody 包裹，类型是 fixed (固定不动的物体)
         colliders="cuboid" 会自动根据外形生成碰撞体，让你的小人能撞到它
      */}
      <RigidBody type="fixed" colliders="cuboid">
        <group
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={onClick}
          scale={1.5} // 整体放大一点
        >
          {/* --- 1. 显示器外壳 (Monitor Frame) --- */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[1.4, 1.0, 0.2]} />
            <meshStandardMaterial color={hovered ? "#444" : "#222"} />
          </mesh>

          {/* --- 2. 屏幕 (Screen) - 带发光效果 --- */}
          <mesh position={[0, 1.2, 0.11]}>
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#000"
              emissive="#42a5f5" // 屏幕发蓝光
              emissiveIntensity={1.5} // 发光强度
            />
          </mesh>

          {/* --- 3. 显示器支架 (Stand Neck) --- */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>

          {/* --- 4. 底座 (Base) --- */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      </RigidBody>
    </group>
  );
}
