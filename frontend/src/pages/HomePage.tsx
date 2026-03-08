/** 网站首页：保留企业智能决策系统，下方点击「开始」进入两个模块选择页 */

import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-thinker-dark text-gray-100 flex flex-col">
      {/* 顶部：品牌 + 进入 */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-thinker-purple flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-white">Thinker</span>
        </div>
        <Link
          to="/app"
          className="px-5 py-2.5 rounded-xl bg-thinker-purple text-white font-medium hover:bg-thinker-purple-hover transition-colors shadow-lg shadow-thinker-purple/20"
        >
          进入
        </Link>
      </header>

      {/* 主视觉：企业智能决策系统，下方点击开始进入两个模块界面 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight max-w-4xl">
          <span className="text-white">企业智能</span>
          <span className="text-thinker-purple">决策系统</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          支持人才发展路径推演与企业决策分析，智能推演多方案与长期发展路径，多维度评分，助力科学决策。
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-thinker-purple text-white text-lg font-medium hover:bg-thinker-purple-hover transition-colors shadow-xl shadow-thinker-purple/30"
        >
          开始
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </main>

      {/* 底部简要说明 */}
      <footer className="border-t border-gray-700/50 px-6 py-8">
        <div className="max-w-3xl mx-auto text-center text-sm text-gray-500">
          <p>职业发展路径对比 · 思维树推演 · 推荐结论</p>
        </div>
      </footer>
    </div>
  )
}
