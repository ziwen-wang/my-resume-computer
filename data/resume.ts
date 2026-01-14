// data/resume.ts

export const RESUME_DATA = {
  profile: {
    name: "Wang Ziwen",
    role: "Senior Full Stack Dev",
    exp: "10 Years / Beihang Univ.", //
    avatar: "👨‍💻",
  },

  // 桌面图标数组 (DesktopOS 和 MobileScrolly 公用数据源)
  items: [
    // --- 1. My Computer (系统信息) ---
    {
      id: "my_computer",
      title: "My Computer",
      icon: "💻",
      type: "system", // 特殊类型：系统图标
      content: {
        type: "info", // 桌面端渲染逻辑：显示系统属性面板
        // 这里的 \n 会被 DesktopOS 渲染为换行
        text: "System: ResumeOS v2.0 Pro\nUser: Wang Ziwen (王子文)\nEducation: Beihang University (CS)\nLocation: Beijing, China\nStatus: Open for Opportunities",
      },
      // 移动端展示信息
      mobile: {
        tag: "About Me",
        shortDesc: "10 Years Experience Full Stack Developer.",
        icon: "💻",
      },
    },

    // --- 2. BIM Engine (核心视觉项目) ---
    {
      id: "bime",
      title: "BIM_Engine.exe",
      icon: "🏗️",
      type: "app",
      content: {
        type: "terminal", // 桌面端：黑色终端窗口
        desc: "Web-based BIM Visualization Engine",
        logs: [
          "> Initializing WebGL context...",
          "[LOAD] Loading 3D models without plugins", //
          "[OPTIMIZE] WebWorker multi-thread parsing", //
          "[FEATURE] 4D Construction Simulation (Gantt)", //
          "[STACK] Vue, Three.js, WebSocket",
        ],
      },
      mobile: {
        tag: "3D Visualization",
        shortDesc:
          "Browser-based BIM engine. No plugins required. Handles massive model data.", //
        icon: "🏗️",
      },
    },

    // --- 3. NexVault (Web3 钱包) ---
    {
      id: "nexvault",
      title: "NexVault_Wallet",
      icon: "🔐",
      type: "app",
      content: {
        type: "terminal", // 桌面端：黑色终端窗口
        desc: "Secure Multi-Sig Crypto Wallet",
        logs: [
          "> Refactoring Swift/Hybrid to Pure React Native...", //
          "[SUCCESS] Crash rate reduced significantly",
          "[CONNECT] Integrated WalletConnect & Ledger", //
          "[PERF] Cold wallet signing flow -30% time", //
          "Stack: React Native, TypeScript, Web3.js",
        ],
      },
      mobile: {
        tag: "Web3 Wallet",
        shortDesc:
          "Cross-chain multi-sig wallet with Ledger support & Cold wallet integration.", //
        icon: "🔐",
      },
    },

    // --- 4. Bitroo (算力金融平台) ---
    {
      id: "bitroo",
      title: "Bitroo_Admin",
      icon: "📈",
      type: "app",
      content: {
        type: "chart", // 桌面端：图表仪表盘
        desc: "Mining Platform Dashboard",
        metrics: [
          { label: "GMV/Year", value: "$15M+" }, //
          { label: "Miners", value: "500+" }, //
          { label: "Growth", value: "+20%" }, //
        ],
        features: [
          "Telegram Mini App (One-click mining)", //
          "Financial Funnel & Profit Prediction", //
          "Automated Sales CRM System", //
        ],
      },
      mobile: {
        tag: "FinTech SaaS",
        shortDesc:
          "Cloud mining platform generating $15M/yr revenue. Integrated Telegram Bot.", //
        icon: "📈",
      },
    },

    // --- 5. 企业级工具 (LowCode/Electron) ---
    {
      id: "enterprise",
      title: "Ent_Tools.box",
      icon: "🧰",
      type: "app",
      content: {
        type: "text", // 桌面端：记事本样式
        text: `
[PROJECT 1] Huobi/New Fire Tech - LowCode Platform
- Built a drag-and-drop dashboard builder based on DataEase.
- Developed "Mepal" desktop app using Electron.
- Implemented Micro-frontend (qiankun) architecture.

[PROJECT 2] Longfor Group - Smart Hotel System
- "Hidden Number" platform & Hotel Service App.
- Used WebAssembly (Wasm) to compress/process video on web.
- Standardized UI components (Element-Plus) for 5 business lines.
        `,
      },
      mobile: {
        tag: "Enterprise Tools",
        shortDesc:
          "Low-code platforms & Electron desktop apps for enterprise efficiency.",
        icon: "🧰",
      },
    },

    // --- 6. 技能栈 ---
    {
      id: "skills",
      title: "Skill_Tree.txt",
      icon: "🧠",
      type: "file",
      content: {
        type: "text", // 桌面端：记事本样式
        text: `
# TECHNICAL SKILLS

## 🎨 Visualization & Graphics
- Three.js / WebGL / Canvas
- BIM / GIS Data Processing
- ECharts / D3.js (Financial Charts)

## ⚛️ Frontend Engineering
- React / Next.js / React Native
- Vue 3 / Vite / Electron
- Micro-Frontends (qiankun)

## ⛓️ Backend & Web3
- Node.js / Go
- Solidity / Ethers.js
- Docker / CI/CD
        `,
      },
      mobile: {
        tag: "Tech Stack",
        shortDesc: "Expert in React, Vue, Three.js, and Web3 development.",
        icon: "🧠",
      },
    },

    // --- 7. 联系方式 (关键修复) ---
    {
      id: "contact",
      title: "Contact_Me.msg",
      icon: "📬",
      type: "email", // 外层 type: 决定图标外观
      content: {
        // 🚨 关键点：这里必须有 type: "email" 才能触发 DesktopOS 的渲染逻辑
        // 如果这里不写 type，系统会 fallback 到默认的“光盘”图标
        type: "email",

        // 数据字段
        email: "wangziwenluck@gmail.com", // (修正了gamil拼写以便功能可用)
        phone: "1860-1223-473", //
        msg: "Based in Beijing. 10+ years experience. Ready for new challenges.",
      },
      mobile: {
        tag: "Contact",
        shortDesc: "Let's build something cool together.",
        icon: "📬",
      },
    },
  ],
};
