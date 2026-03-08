/** 左侧栏：人才发展路径 = 个人情况 + 培养目标 + 人才信息 + 生成报告 */

import { useState, useEffect } from 'react'
import type { Candidate, JobRequirement } from '../types'

interface SidebarProps {
  mode: 'talent'
  jobRequirement: JobRequirement
  onConfirmJob: (title: string, requirements: string) => void
  candidates: Candidate[]
  onToggleCandidate: (id: string) => void
  onOpenAddModal: () => void
  onDeleteCandidate: (id: string) => void
  isGenerating: boolean
}

export function Sidebar({
  mode: _mode,
  jobRequirement,
  onConfirmJob,
  candidates,
  onToggleCandidate,
  onOpenAddModal,
  onDeleteCandidate,
  isGenerating,
}: SidebarProps) {
  const [personalSituation, setPersonalSituation] = useState(jobRequirement.jobTitle)
  const [developmentGoal, setDevelopmentGoal] = useState(jobRequirement.coreRequirements)

  useEffect(() => {
    setPersonalSituation(jobRequirement.jobTitle)
    setDevelopmentGoal(jobRequirement.coreRequirements)
  }, [jobRequirement.jobTitle, jobRequirement.coreRequirements])

  const handleConfirm = () => {
    onConfirmJob(personalSituation.trim(), developmentGoal.trim())
  }

  return (
    <aside className="w-80 shrink-0 bg-thinker-sidebar border-r border-gray-700 flex flex-col overflow-hidden">
      {/* 个人情况 + 培养目标 */}
      <section className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-sm font-medium text-gray-200">发展路径输入</h2>
        </div>
        <label className="block text-xs text-gray-400 mb-1">个人情况</label>
        <textarea
          value={personalSituation}
          onChange={(e) => setPersonalSituation(e.target.value)}
          rows={3}
          disabled={isGenerating}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-thinker-purple focus:border-transparent mb-3 resize-none disabled:opacity-50"
          placeholder="如：当前为高级工程师，5年经验，希望向技术管理或架构师方向发展"
        />
        <label className="block text-xs text-gray-400 mb-1">培养目标</label>
        <textarea
          value={developmentGoal}
          onChange={(e) => setDevelopmentGoal(e.target.value)}
          rows={3}
          disabled={isGenerating}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-thinker-purple focus:border-transparent mb-3 resize-none disabled:opacity-50"
          placeholder="如：3年内具备带团队与系统架构能力，能独立负责一条业务线技术"
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

      {/* 候选人管理 */}
      <section className="p-4 border-b border-gray-700 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-sm font-medium text-gray-200">人才信息</h2>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors mb-3 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {candidates.map((c) => (
            <div
              key={c.id}
              className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-2 ${
                c.selected
                  ? 'border-thinker-purple bg-thinker-purple/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggleCandidate(c.id)}
                disabled={isGenerating}
                className="flex-1 flex items-start gap-3 min-w-0 text-left disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-thinker-purple flex items-center justify-center text-white font-medium shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-100">{c.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {c.roleDesc}, {c.experience}
                  </div>
                </div>
                {c.selected && (
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              {!c.isOriginal && !isGenerating && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDeleteCandidate(c.id); }}
                  className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                  title="删除"
                  aria-label="删除候选人"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}
