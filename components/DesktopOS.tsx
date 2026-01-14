"use client";

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import {
  X,
  Minus,
  Maximize2,
  Terminal,
  FolderOpen,
  Power,
  Settings,
  FileText,
  Mail,
  Search,
} from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

// --- 1. 子组件：窗口内容渲染器 (根据类型渲染不同样式) ---
const WindowContent = ({ content }: any) => {
  if (content.type === "terminal") {
    return (
      <div className="bg-black text-green-400 font-mono text-sm p-4 h-full overflow-auto">
        <div className="mb-2 border-b border-green-900 pb-2">
          &gt; RUNNING: {content.desc}
        </div>
        {content.logs.map((log: string, i: number) => (
          <div key={i} className="mb-1">
            <span className="text-gray-500">
              [{new Date().toLocaleTimeString()}]
            </span>{" "}
            {log}
          </div>
        ))}
        <div className="animate-pulse mt-2">_</div>
      </div>
    );
  }

  if (content.type === "chart") {
    return (
      <div className="bg-white text-gray-900 font-sans h-full p-4 overflow-auto">
        <h3 className="font-bold text-lg border-b-2 border-blue-800 mb-4 text-blue-800">
          📊 {content.desc}
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {content.metrics.map((m: any, i: number) => (
            <div
              key={i}
              className="bg-gray-100 p-3 border border-gray-400 text-center shadow-sm"
            >
              <div className="text-2xl font-black text-blue-600">{m.value}</div>
              <div className="text-xs text-gray-500 uppercase">{m.label}</div>
            </div>
          ))}
        </div>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {content.features.map((f: string, i: number) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (content.type === "text" || content.type === "email") {
    return (
      <div className="bg-white text-gray-900 font-mono text-sm p-4 h-full whitespace-pre-wrap overflow-auto">
        {content.text || content.msg}
        {content.email && (
          <div className="mt-4 pt-4 border-t border-dashed">
            <p>
              📧 Email:{" "}
              <a
                href={`mailto:${content.email}`}
                className="text-blue-600 underline"
              >
                {content.email}
              </a>
            </p>
            <p>📞 Phone: {content.phone}</p>
          </div>
        )}
      </div>
    );
  }

  // Default Info
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-200">
      <div className="text-4xl mb-4">💿</div>
      <pre className="text-sm font-bold text-gray-600">{content.text}</pre>
    </div>
  );
};

// --- 2. 窗口组件 ---
const Window = ({ app, onClose, isActive, onFocus, style }: any) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" onMouseDown={onFocus}>
      <div
        ref={nodeRef}
        className={`absolute w-[500px] h-[350px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-[4px_4px_10px_rgba(0,0,0,0.5)] flex flex-col ${
          isActive ? "z-50" : "z-10"
        }`}
        style={style}
      >
        <div
          className={`window-header h-8 px-2 flex items-center justify-between select-none ${
            isActive ? "bg-[#000080] text-white" : "bg-gray-400 text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2 font-bold font-mono text-sm">
            {app.icon} {app.title}
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center hover:bg-red-600 group"
          >
            <X size={12} className="text-black group-hover:text-white" />
          </button>
        </div>
        {/* 内容容器 */}
        <div className="flex-1 border-2 border-t-gray-600 border-l-gray-600 border-r-white border-b-white m-1 bg-white overflow-hidden">
          <WindowContent content={app.content} />
        </div>
      </div>
    </Draggable>
  );
};

// --- 3. Start 菜单组件 (新增!) ---
const StartMenu = ({ isOpen, onClose, onShutdown }: any) => {
  if (!isOpen) return null;
  return (
    <div className="absolute bottom-10 left-0 w-64 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-xl z-[100] flex">
      {/* 侧边栏 */}
      <div className="w-8 bg-[#000080] flex items-end justify-center pb-2">
        <span className="text-white font-bold -rotate-90 text-lg whitespace-nowrap tracking-widest">
          RESUME <span className="font-light">98</span>
        </span>
      </div>
      {/* 菜单项 */}
      <div className="flex-1 flex flex-col p-1">
        <MenuItem icon={<FolderOpen size={16} />} label="Documents" />
        <MenuItem icon={<Settings size={16} />} label="Settings" />
        <MenuItem icon={<Search size={16} />} label="Find Files" />
        <div className="h-[1px] bg-gray-400 border-b border-white my-1" />
        <MenuItem
          icon={<Power size={16} />}
          label="Shut Down..."
          onClick={onShutdown}
          isRed
        />
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, isRed }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 hover:bg-[#000080] hover:text-white text-sm font-bold w-full text-left group ${
      isRed ? "hover:bg-red-600" : ""
    }`}
  >
    <span className="text-gray-800 group-hover:text-white">{icon}</span>
    {label}
  </button>
);

// --- 4. 主桌面 ---
export default function DesktopOS() {
  const [openApps, setOpenApps] = useState<any[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isStartOpen, setStartOpen] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false); // 关机状态

  const openApp = (app: any) => {
    if (!openApps.find((a) => a.id === app.id)) {
      setOpenApps([...openApps, app]);
    }
    setActiveAppId(app.id);
    setStartOpen(false); // 打开APP时关闭菜单
  };

  const closeApp = (id: string) => {
    setOpenApps(openApps.filter((app) => app.id !== id));
  };

  // 关机逻辑 (BSOD)
  const handleShutdown = () => {
    setStartOpen(false);
    setIsShutdown(true);
  };

  if (isShutdown) {
    return (
      <div className="w-full h-full bg-[#0000AA] text-white font-mono flex flex-col items-center justify-center p-20 cursor-none">
        <h1 className="bg-white text-[#0000AA] px-2 mb-8 font-bold text-xl">
          Windows
        </h1>
        <p className="mb-8 text-center max-w-2xl">
          A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
          00010E36. The current application will be terminated.
        </p>
        <p className="text-center">
          * Press any key to terminate the current application.
          <br />* Press CTRL+ALT+DEL again to restart your computer. You will
          lose any unsaved information in all applications.
        </p>
        <p className="mt-10 animate-pulse">Press any key to continue _</p>
        {/* 点击任意处重启 */}
        <div
          className="absolute inset-0 z-50"
          onClick={() => setIsShutdown(false)}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-[#008080] overflow-hidden relative font-sans"
      onClick={() => isStartOpen && setStartOpen(false)} // 点击桌面关闭 Start 菜单
    >
      {/* 桌面图标 */}
      <div className="p-6 grid grid-cols-1 gap-6 w-fit content-start">
        {RESUME_DATA.items.map((app) => (
          <div
            key={app.id}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(app);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer w-20"
          >
            <div className="w-10 h-10 flex items-center justify-center text-3xl mb-1 relative">
              {/* 选中时的蓝色遮罩效果 */}
              <div className="absolute inset-0 bg-blue-800 opacity-0 group-hover:opacity-50 blur-sm rounded-full"></div>
              <span className="relative z-10 drop-shadow-md">{app.icon}</span>
            </div>
            <span className="text-white text-xs text-center px-1 bg-transparent group-hover:bg-[#000080] line-clamp-2 leading-tight border border-transparent group-hover:border-dotted group-hover:border-white">
              {app.title}
            </span>
          </div>
        ))}
      </div>

      {/* 窗口层 */}
      {openApps.map((app, index) => (
        <Window
          key={app.id}
          app={app}
          isActive={activeAppId === app.id}
          onFocus={() => setActiveAppId(app.id)}
          onClose={() => closeApp(app.id)}
          style={{ top: 50 + index * 30, left: 200 + index * 40 }}
        />
      ))}

      {/* Start 菜单 */}
      <div
        className="absolute bottom-10 left-0"
        onClick={(e) => e.stopPropagation()}
      >
        <StartMenu isOpen={isStartOpen} onShutdown={handleShutdown} />
      </div>

      {/* 底部任务栏 */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 gap-1 z-[100] shadow-lg">
        {/* Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen(!isStartOpen);
          }}
          className={`h-7 px-2 flex items-center gap-1 font-bold border-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white
            ${
              isStartOpen
                ? "bg-[#e0e0e0] border-t-black border-l-black border-r-white border-b-white shadow-inner"
                : "bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black shadow-outter"
            }
          `}
        >
          <div className="w-4 h-4 bg-black p-[1px]">
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 opacity-80" />
          </div>
          <span className="text-sm">Start</span>
        </button>

        <div className="w-[2px] h-6 bg-gray-400 mx-1 border-r border-white"></div>

        {/* 任务栏上的应用列表 */}
        {openApps.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveAppId(app.id)}
            className={`h-7 px-2 max-w-[140px] truncate text-xs font-bold flex items-center gap-2 border-2 
              ${
                activeAppId === app.id
                  ? "bg-[#e0e0e0] border-t-black border-l-black border-r-white border-b-white"
                  : "bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black"
              }
            `}
          >
            {app.icon} {app.title}
          </button>
        ))}

        {/* 右下角时钟 */}
        <div className="ml-auto px-3 py-1 border-2 border-gray-400 border-b-white border-r-white bg-[#c0c0c0] text-xs shadow-inner flex gap-2 items-center">
          <span className="w-4 h-4 text-gray-600">🔈</span>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
