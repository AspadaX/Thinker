/** 进入应用后二选一：人才发展路径 / 企业决策分析 */

import { Link } from 'react-router-dom'

export function ModeSelectPage() {
  return (
    <div className="min-h-screen bg-thinker-dark text-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-thinker-purple flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-white">Thinker</span>
        </div>
        <Link to="/" className="text-sm text-gray-400 hover:text-white">返回首页</Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <h2 className="text-xl text-gray-400 mb-10">请选择功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          <Link
            to="/app/talent-path"
            className="block p-8 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-thinker-purple hover:bg-thinker-purple/10 transition-all text-center"
          >
            <div className="text-thinker-purple mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">人才发展路径</h3>
            <p className="text-sm text-gray-400">
              基于职位与培养核心，通过不同想法和路径生成思维树形式的发展路径，推荐方案为最推荐的人才培养路径。
            </p>
          </Link>
          <Link
            to="/app/decision"
            className="block p-8 rounded-2xl border-2 border-gray-600 bg-gray-800/50 hover:border-thinker-purple hover:bg-thinker-purple/10 transition-all text-center"
          >
            <div className="text-thinker-purple mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">企业决策分析</h3>
            <p className="text-sm text-gray-400">
              输入企业困惑点，对不同方案进行测试，思维树展示多方案推演，推荐方案给出最优决策建议。
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
