/** 企业决策分析左侧栏：企业困惑点拆成「情境」与「问题」、生成报告 */

import { useState, useEffect } from 'react'

export interface DecisionInput {
  situation: string
  problem: string
}

interface DecisionSidebarProps {
  situation: string
  problem: string
  onConfirm: (situation: string, problem: string) => void
  isGenerating: boolean
}

export function DecisionSidebar({
  situation: initialSituation,
  problem: initialProblem,
  onConfirm,
  isGenerating,
}: DecisionSidebarProps) {
  const [situation, setSituation] = useState(initialSituation)
  const [problem, setProblem] = useState(initialProblem)

  useEffect(() => {
    setSituation(initialSituation)
    setProblem(initialProblem)
  }, [initialSituation, initialProblem])

  const handleConfirm = () => {
    onConfirm(situation.trim(), problem.trim())
  }

  return (
    <aside className="w-80 shrink-0 bg-thinker-sidebar border-r border-gray-700 flex flex-col overflow-hidden">
      <section className="p-4 border-b border-gray-700 flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-medium text-gray-200">企业困惑点</h2>
        </div>

        <label className="block text-xs text-gray-400 mb-1">情境</label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={3}
          disabled={isGenerating}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-thinker-purple focus:border-transparent mb-3 resize-none disabled:opacity-50"
          placeholder="如：公司正处于业务扩张期，新业务线投入与现有资源分配存在冲突"
        />

        <label className="block text-xs text-gray-400 mb-1">问题</label>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
          disabled={isGenerating}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-thinker-purple focus:border-transparent mb-3 resize-none disabled:opacity-50"
          placeholder="如：是否该投入新业务线、组织架构如何调整、关键岗位人选难以抉择等"
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isGenerating}
          className="w-full py-2 rounded-lg bg-thinker-purple text-white text-sm font-medium hover:bg-thinker-purple-hover transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : (
            '确定'
          )}
        </button>
      </section>
    </aside>
  )
}
