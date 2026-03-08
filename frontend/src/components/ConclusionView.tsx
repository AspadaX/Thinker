/** 推荐方案：输出为培养方案（阶段、目标、举措等），而非推荐某一个人 */

import type { Candidate, JobRequirement } from '../types'

interface ConclusionViewProps {
  jobRequirement: JobRequirement
  candidates: Candidate[]
  /** 后端返回的培养方案文案；有则展示，无则占位 */
  planText?: string
}

export function ConclusionView({ jobRequirement, candidates, planText }: ConclusionViewProps) {
  const invalidList = candidates.filter((c) => c.matchJob === false)
  const hasValidCandidates = candidates.some((c) => c.matchJob !== false)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-1">推荐方案</h2>
        <p className="text-gray-400 text-sm">
          基于个人情况与培养目标、多维度评分与长期发展预测，输出最推荐的人才培养方案（阶段、目标与举措），而非具体人选；与培养目标不匹配的标记为「无效简历」。
        </p>
        {jobRequirement.confirmed && (jobRequirement.jobTitle || jobRequirement.coreRequirements) && (
          <div className="text-gray-500 text-xs mt-1 space-y-0.5">
            {jobRequirement.jobTitle && <p>个人情况: {jobRequirement.jobTitle}</p>}
            {jobRequirement.coreRequirements && <p>培养目标: {jobRequirement.coreRequirements}</p>}
          </div>
        )}
      </div>

      {!hasValidCandidates && candidates.length === 0 ? (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-8 text-center text-gray-400">
          请在左侧人才信息中勾选至少一名人才，并点击「生成报告」后查看推荐方案。
        </div>
      ) : (
        <div className="space-y-4">
          {/* 推荐方案：培养方案（后端返回 planText 则展示，否则占位） */}
          <div className="rounded-xl border border-thinker-purple/50 bg-thinker-purple/10 p-6">
            <div className="text-thinker-purple font-medium mb-4">最推荐的人才培养方案</div>
            {planText ? (
              <div className="text-gray-300 text-sm whitespace-pre-wrap">{planText}</div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-4">
                  根据个人情况与培养目标的匹配分析，生成以下培养方案。接入后端并点击「生成报告」后此处将展示完整方案内容。
                </p>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-400 font-medium mb-1">阶段一（近期）</div>
                    <div className="text-gray-300">目标与关键举措、学习与实践安排等。</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium mb-1">阶段二（中期）</div>
                    <div className="text-gray-300">能力进阶目标、项目与带人机会等。</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium mb-1">阶段三（长期）</div>
                    <div className="text-gray-300">职业发展路径与评估节点。</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium mb-1">建议与注意事项</div>
                    <div className="text-gray-300">资源投入、风险与复盘建议。</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 无效简历列表 */}
          {invalidList.length > 0 && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4">
              <div className="text-sm font-medium text-red-400 mb-3">无效简历</div>
              <p className="text-gray-400 text-sm mb-2">
                以下与当前培养目标不匹配，不参与推荐方案。
              </p>
              <ul className="space-y-1">
                {invalidList.map((c) => (
                  <li key={c.id} className="text-sm text-gray-300">
                    {c.name} · {c.roleDesc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
