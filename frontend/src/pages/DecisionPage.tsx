/** 企业决策分析：企业困惑点（情境 + 问题）、思维树、推荐方案 */

import { useState, useCallback } from 'react'
import type { MindTreeData } from '../types'
import { decisionReport } from '../api'
import { Header } from '../components/Header'
import { DecisionSidebar } from '../components/DecisionSidebar'
import { DecisionMindMapView } from '../components/DecisionMindMapView'
import { DecisionRecommendationView } from '../components/DecisionRecommendationView'
import { ContentDisplay } from '../components/ContentDisplay'

export function DecisionPage() {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'conclusion'>('mindmap')
  const [situation, setSituation] = useState('')
  const [problem, setProblem] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [treeData, setTreeData] = useState<MindTreeData | undefined>(undefined)
  const [recommendationText, setRecommendationText] = useState<string | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<string>('')
  const [currentContent, setCurrentContent] = useState<any>(undefined)
  const [deltas, setDeltas] = useState<{ message: string; content: any }[]>([])

  const onConfirm = useCallback(async (s: string, p: string) => {
    setSituation(s)
    setProblem(p)
    setConfirmed(true)
    
    if (isGenerating) return
    
    setIsGenerating(true)
    setDeltas([])
    setTreeData(undefined)
    setRecommendationText(undefined)

    try {
      const res = await decisionReport(
        { situation: s, problem: p },
        (message: string, content: any) => {
          setCurrentMessage(message)
          setCurrentContent(content)
          setDeltas((prev) => [...prev, { message, content }])
        }
      )
      
      if (res) {
        setTreeData(res.mindTree)
        setRecommendationText(res.recommendation)
      }
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating])

  return (
    <div className="min-h-screen bg-thinker-dark text-gray-100 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <DecisionSidebar
          situation={situation}
          problem={problem}
          onConfirm={onConfirm}
          isGenerating={isGenerating}
        />
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
            <DecisionMindMapView
              situation={situation}
              problem={problem}
              confirmed={confirmed}
              treeData={treeData}
            />
          )}
          {activeTab === 'conclusion' && (
            <DecisionRecommendationView
              situation={situation}
              problem={problem}
              confirmed={confirmed}
              recommendationText={recommendationText}
            />
          )}
        </main>
      </div>
    </div>
  )
}
