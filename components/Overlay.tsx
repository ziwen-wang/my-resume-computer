"use client";

export function Overlay({
  data,
  onClose,
}: {
  data: {
    title: string;
    role: string;
    period: string;
    desc: string;
    highlights: string[];
  };
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
      {/* 卡片容器 */}
      <div className="bg-gray-900/90 border border-white/20 p-8 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden">
        {/* 装饰性光晕背景 */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* 标题区 */}
        <div className="mb-6 relative z-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {data.title}
          </h2>
          <p className="text-gray-400 mt-1 text-sm font-mono">
            {data.role} | {data.period}
          </p>
        </div>

        {/* 内容区 */}
        <div className="space-y-4 text-gray-300 relative z-10">
          <p className="text-sm leading-relaxed border-l-4 border-blue-500 pl-4 bg-white/5 p-3 rounded-r">
            {data.desc}
          </p>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              核心产出 (Highlights)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
              {data.highlights.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex gap-2">
            {data.stack.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-1 bg-white/10 rounded text-xs text-blue-300 font-mono border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
