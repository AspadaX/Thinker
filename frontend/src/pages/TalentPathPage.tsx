/** 人才发展路径：个人情况 + 培养目标 + 人才信息，右侧思维树与推荐方案 */

import { useState, useCallback } from 'react'
import type { Candidate, JobRequirement, AddCandidateForm, MindTreeData } from '../types'
import { talentReport } from '../api'
import { AddCandidateModal } from '../components/AddCandidateModal'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { MindMapView } from '../components/MindMapView'
import { ConclusionView } from '../components/ConclusionView'
import { ContentDisplay } from '../components/ContentDisplay'

const INITIAL_JOB: JobRequirement = {
  jobTitle: '',
  coreRequirements: '',
  confirmed: false,
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: '张伟',
    isOriginal: true,
    roleDesc: '前 阿里巴巴 高级AI架构师',
    experience: '12年经验',
    selected: true,
    matchJob: true,
    finalScore: 92,
    dimensionScores: { 技术匹配度: 95, 经验匹配度: 90, 发展潜力: 88, 稳定性: 94 },
    careerPredictions: {
      year10: '资深AI架构师或技术专家，主导大型AI系统架构。',
      year15: '技术总监或CTO候选人，负责公司技术战略。',
      year20: '可能出任技术VP或创业公司技术合伙人。',
      year30: '行业资深顾问或顶尖技术决策者。',
    },
    resume: {
      phone: '138****8001',
      email: 'zhangwei@alibaba.com',
      university: '浙江大学',
      degree: '计算机硕士 (2012)',
      education: '2009-2012 浙江大学 计算机科学与技术硕士, 方向: 机器学习与数据挖掘',
    },
  },
  {
    id: '2',
    name: '李娜',
    isOriginal: true,
    roleDesc: '前 字节跳动 高级AI架构师',
    experience: '8年经验',
    selected: true,
    matchJob: true,
    finalScore: 88,
    dimensionScores: { 技术匹配度: 90, 经验匹配度: 85, 发展潜力: 92, 稳定性: 86 },
    careerPredictions: {
      year10: '高级AI架构师，具备跨业务线落地经验。',
      year15: '技术专家或架构委员会核心成员。',
      year20: '技术管理或首席架构师方向。',
      year30: '资深技术领袖或顾问。',
    },
    resume: {
      phone: '139****8002',
      email: 'lina@bytedance.com',
      university: '清华大学',
      degree: '计算机硕士 (2016)',
      education: '2013-2016 清华大学 计算机科学与技术硕士, 方向: 深度学习',
    },
  },
  {
    id: '3',
    name: '王强',
    isOriginal: true,
    roleDesc: '前 腾讯 高级AI架构师',
    experience: '10年经验',
    selected: false,
    matchJob: true,
    finalScore: 85,
    dimensionScores: { 技术匹配度: 88, 经验匹配度: 87, 发展潜力: 84, 稳定性: 82 },
    careerPredictions: {
      year10: '资深AI架构师或技术专家。',
      year15: '技术总监或架构委员会成员。',
      year20: '技术VP或首席架构师方向。',
      year30: '资深技术领袖或顾问。',
    },
    resume: {
      phone: '137****8003',
      email: 'wangqiang@tencent.com',
      university: '北京大学',
      degree: '计算机博士 (2014)',
      education: '2008-2014 北京大学 计算机科学与技术博士, 方向: 自然语言处理',
    },
  },
]

export function TalentPathPage() {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'conclusion'>('mindmap')
  const [jobRequirement, setJobRequirement] = useState<JobRequirement>(INITIAL_JOB)
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [treeData, setTreeData] = useState<MindTreeData | undefined>(undefined)
  const [planText, setPlanText] = useState<string | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [currentContent, setCurrentContent] = useState<any>(undefined)
  const [deltas, setDeltas] = useState<{ message: string; content: any }[]>([])

  const onConfirmJob = useCallback(async (title: string, requirements: string) => {
    setJobRequirement({ jobTitle: title, coreRequirements: requirements, confirmed: true })
    
    if (isGenerating) return
    
    const selected = candidates.filter((c) => c.selected)
    setIsGenerating(true)
    setDeltas([])
    setTreeData(undefined)
    setPlanText(undefined)

    try {
      const res = await talentReport(
        {
          personalSituation: title,
          developmentGoal: requirements,
          candidateIds: selected.map((c) => c.id),
          candidates: selected.map((c) => ({
            id: c.id,
            name: c.name,
            roleDesc: c.roleDesc,
            experience: c.experience,
            resume: c.resume,
          })),
        },
        (message: string, content: any) => {
          setCurrentMessage(message)
          setCurrentContent(content)
          setDeltas((prev) => [...prev, { message, content }])
        }
      )
      
      if (res) {
        setTreeData(res.mindTree)
        setPlanText(res.plan)
      }
    } finally {
      setIsGenerating(false)
    }
  }, [candidates, isGenerating])

  const onToggleCandidate = useCallback((id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }, [])

  const onOpenAddModal = useCallback(() => setAddModalOpen(true), [])
  const onCloseAddModal = useCallback(() => setAddModalOpen(false), [])

  const onDeleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => {
      const c = prev.find((x) => x.id === id)
      if (c?.isOriginal) return prev
      return prev.filter((x) => x.id !== id)
    })
  }, [])

  const onAddCandidate = useCallback((form: AddCandidateForm) => {
    const newId = String(Date.now())
    setCandidates((prev) => [
      ...prev,
      {
        id: newId,
        name: form.name.trim(),
        roleDesc: form.roleDesc.trim(),
        experience: form.experience.trim(),
        selected: true,
        isOriginal: false,
        resume: {
          phone: form.phone.trim(),
          email: form.email.trim(),
          university: form.university.trim(),
          degree: form.degree.trim(),
          education: form.education.trim(),
        },
      },
    ])
  }, [])

  const selectedCandidates = candidates.filter((c) => c.selected)

  return (
    <div className="min-h-screen bg-thinker-dark text-gray-100 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          mode="talent"
          jobRequirement={jobRequirement}
          onConfirmJob={onConfirmJob}
          candidates={candidates}
          onToggleCandidate={onToggleCandidate}
          onOpenAddModal={onOpenAddModal}
          onDeleteCandidate={onDeleteCandidate}
          isGenerating={isGenerating}
        />
        <AddCandidateModal open={addModalOpen} onClose={onCloseAddModal} onSubmit={onAddCandidate} />
        <main className="flex-1 overflow-auto p-6">
          {isGenerating && (
            <div className="mb-6 p-4 rounded-xl border border-thinker-purple bg-gray-800/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-thinker-purple animate-pulse" />
                <span className="font-medium text-white">{currentMessage}</span>
              </div>
              {currentContent && (
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Current Content:</div>
                  <ContentDisplay content={currentContent} />
                </div>
              )}
              {deltas.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-xs text-gray-500 mb-3">Recent Updates:</div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {deltas.slice(-5).map((delta, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-xs text-gray-400">{delta.message}</div>
                        {delta.content && <ContentDisplay content={delta.content} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'mindmap' && (
            <MindMapView
              jobRequirement={jobRequirement}
              candidates={candidates}
              treeData={treeData}
            />
          )}
          {activeTab === 'conclusion' && (
            <ConclusionView
              jobRequirement={jobRequirement}
              candidates={selectedCandidates}
              planText={planText}
            />
          )}
        </main>
      </div>
    </div>
  )
}
