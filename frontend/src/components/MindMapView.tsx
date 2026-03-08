/**
 * 思维树：一棵不断生长的树，根据十年/几十年发展情况生成；
 * 每个枝丫代表一种可能，推荐方案即最好的那一枝。仅在左侧选择或添加人才后展示。
 */

import type { Candidate, JobRequirement, MindTreeData } from '../types'
import { GrowingTree } from './GrowingTree'

interface MindMapViewProps {
  jobRequirement: JobRequirement
  candidates: Candidate[]
  /** 接入后端后传入思维树数据（根据十年/几十年发展生成），不传则展示占位树形 */
  treeData?: MindTreeData
}

export function MindMapView({ jobRequirement, candidates, treeData }: MindMapViewProps) {
  const selectedCandidates = candidates.filter((c) => c.selected)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-1">思维树</h2>
        <p className="text-gray-400 text-sm">
          根据后续十年、二十年乃至几十年的发展情况生成一棵不断生长的树，每个枝丫代表一种可能的发展路径，推荐方案即其中最好的那一枝。
        </p>
      </div>

      {selectedCandidates.length === 0 ? (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-8 text-center text-gray-400">
          <p className="mb-2">请在左侧选择或添加人才，并填写个人情况与培养目标、点击确定。</p>
          <p className="text-sm">选择人才后，将在此展示思维树推演与相关信息。</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-6">
          <p className="text-gray-400 text-sm mb-2">
            已选人才：{selectedCandidates.map((c) => c.name).join('、')}
          </p>
          {jobRequirement.confirmed && (jobRequirement.jobTitle || jobRequirement.coreRequirements) && (
            <div className="text-gray-500 text-xs mb-4 space-y-0.5">
              {jobRequirement.jobTitle && <p>个人情况: {jobRequirement.jobTitle}</p>}
              {jobRequirement.coreRequirements && <p>培养目标: {jobRequirement.coreRequirements}</p>}
            </div>
          )}

          {/* 不断生长的树：枝丫 = 可能，推荐方案 = 最好的一枝 */}
          <GrowingTree branches={treeData?.branches} />
        </div>
      )}
    </div>
  )
}
