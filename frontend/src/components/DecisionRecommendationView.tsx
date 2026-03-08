/** 企业决策分析 - 推荐方案：推荐的企业决策建议 */

interface DecisionRecommendationViewProps {
  situation: string
  problem: string
  confirmed: boolean
  /** 后端返回的推荐方案文案；有则展示，无则占位 */
  recommendationText?: string
}

export function DecisionRecommendationView({ situation, problem, confirmed, recommendationText }: DecisionRecommendationViewProps) {
  const hasInput = (situation.trim() || problem.trim()) !== ''

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-1">推荐方案</h2>
        <p className="text-gray-400 text-sm">
          在思维树多方案测试基础上，给出最推荐的企业决策方案与实施建议。
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
          请先填写情境与问题、确定并生成报告后，在此查看推荐的企业决策方案。
        </div>
      ) : (
        <div className="rounded-xl border border-thinker-purple/50 bg-thinker-purple/10 p-6">
          <div className="text-thinker-purple font-medium mb-3">推荐的企业决策方案</div>
          {recommendationText ? (
            <div className="text-gray-300 text-sm whitespace-pre-wrap">{recommendationText}</div>
          ) : (
            <p className="text-gray-300 text-sm">
              配置 VITE_API_BASE_URL 并点击「生成报告」后，将在此展示针对当前情境与问题的最优决策建议与理由。
            </p>
          )}
        </div>
      )}
    </div>
  )
}
