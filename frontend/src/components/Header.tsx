/** 顶部导航：Logo（可点击回首页）、思维树/推荐结论 Tab、开始演示（跳转 /demo） */

import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  activeTab: 'mindmap' | 'conclusion'
  onTabChange: (tab: 'mindmap' | 'conclusion') => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const navigate = useNavigate()

  const handleStartDemo = () => {
    navigate('/demo')
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-700/50 glass shrink-0">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Thinker</h1>
          <p className="text-xs text-slate-400">职业规划智能推演</p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <nav className="flex rounded-xl bg-slate-800/60 p-1.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => onTabChange('mindmap')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'mindmap'
                ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              思维树
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('conclusion')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'conclusion'
                ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              推荐方案
            </span>
          </button>
        </nav>
        <button
          type="button"
          onClick={handleStartDemo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          开始演示
        </button>
      </div>
    </header>
  )
}
