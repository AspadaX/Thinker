/** 企业决策分析 - 思维树：对不同方案进行测试，展示多方案推演 */

import type { MindTreeData } from '../types'
import { GrowingTree } from './GrowingTree'

interface DecisionMindMapViewProps {
  situation: string
  problem: string
  confirmed: boolean
  /** 后端返回的思维树；有则展示树形，无则占位 */
  treeData?: MindTreeData
}

export function DecisionMindMapView({ situation, problem, confirmed, treeData }: DecisionMindMapViewProps) {
  const hasInput = (situation.trim() || problem.trim()) !== ''

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-1">思维树</h2>
        <p className="text-gray-400 text-sm">
          针对企业困惑点，分别进行不同方案的测试与推演，以思维树形式展示各方案的逻辑与结果，便于对比决策。
        </p>
        {confirmed && hasInput && (
          <div className="text-gray-500 text-xs mt-1 space-y-0.5">
            {situation && <p>情境: {situation}</p>}
            {problem && <p>问题: {problem}</p>}
          </div>
        )}
      </div>

      {!confirmed || !hasInput ? (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-8 text-center text-gray-400">
          <p className="mb-2">请先在左侧填写情境与问题并点击「确定」。</p>
          <p className="text-sm">确定后将在此展示不同方案的思维树推演，生成报告后可查看完整分析。</p>
        </div>
      ) : treeData?.branches?.length ? (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-6">
          <GrowingTree branches={treeData.branches} />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-6">
          <p className="text-gray-400 text-sm mb-4">
            思维树内容将根据情境与问题由后端生成：多方案分支、各方案假设与推演结果。配置 VITE_API_BASE_URL 并点击「生成报告」后可展示完整思维树。
          </p>
          <div className="text-gray-500 text-xs space-y-1">
            {situation && <p>情境：{situation}</p>}
            {problem && <p>问题：{problem}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
