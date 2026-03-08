/**
 * 后端 API 对接层：统一 baseURL、处理 SSE 流式响应。
 */

import type {
  TalentReportRequest,
  TalentReportResponse,
  DecisionReportRequest,
  DecisionReportResponse,
  MindTreeData,
} from '../types'

const BASE_URL = (import.meta as unknown as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? ''

export interface QueryDelta {
  message: string
  content: Record<string, string> | Array<unknown> | unknown
}

export async function* query(situation: string, thoughts: string): AsyncGenerator<QueryDelta> {
  try {
    console.log('Making SSE request to:', `${BASE_URL.replace(/\/$/, '')}/query`)
    console.log('Request body:', { situation, thoughts })
    
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation, thoughts }),
    })

    console.log('Response status:', res.status)
    
    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      console.log('Received chunk:', buffer)
      
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        console.log('Processing line:', trimmed)
        
        if (trimmed.startsWith('data: ')) {
          try {
            const dataStr = trimmed.slice(6)
            console.log('Parsing JSON:', dataStr)
            const data = JSON.parse(dataStr)
            console.log('Parsed data:', data)
            yield data as QueryDelta
          } catch (e) {
            console.error('Failed to parse SSE data:', trimmed, e)
          }
        } else if (trimmed) {
          console.log('Non-data line:', trimmed)
        }
      }
    }
  } catch (error) {
    console.error('SSE query failed:', error)
    throw error
  }
}

/** 企业决策分析 - 生成报告：使用 SSE 流式响应 */
export async function decisionReport(
  params: DecisionReportRequest,
  onUpdate: (message: string, data?: unknown) => void
): Promise<DecisionReportResponse | null> {
  let mindTree: MindTreeData | null = null
  let recommendation: string | null = null
  const suggestions: string[] = []

  try {
    for await (const delta of query(params.situation, params.problem)) {
      onUpdate(delta.message, delta.content)

      if (delta.message.includes('brief generated')) {
        const brief = delta.content as Record<string, string>
        recommendation = Object.values(brief).join('\n\n')
      } else if (delta.message.includes('suggestions') || delta.message.includes('✅')) {
        const s = delta.content as Array<Record<string, string>>
        if (Array.isArray(s)) {
          for (const item of s) {
            if (typeof item === 'object' && item) {
              suggestions.push(Object.values(item).join('\n'))
            }
          }
        }
      } else if (delta.message.includes('output tree structure')) {
        const tree = delta.content as Record<string, unknown>
        const branches = []
        for (const [key, value] of Object.entries(tree)) {
          branches.push({
            id: key,
            label: key,
            yearNodes: typeof value === 'object' ? (value as Record<string, string>) : {},
          })
        }
        if (branches.length > 0) {
          mindTree = { branches }
        }
      }
    }
  } catch (error) {
    console.error('decisionReport failed:', error)
  }

  if (!mindTree) {
    mindTree = {
      branches: [
        { id: 'branch1', label: '推荐方案', yearNodes: {} },
      ],
    }
  }

  if (!recommendation) {
    recommendation = suggestions.join('\n\n') || '正在生成推荐方案...'
  }

  return {
    mindTree,
    recommendation,
  }
}

/** 人才发展路径 - 生成报告：使用 SSE 流式响应 */
export async function talentReport(
  params: TalentReportRequest,
  onUpdate: (message: string, data?: unknown) => void
): Promise<TalentReportResponse | null> {
  let mindTree: MindTreeData | null = null
  let plan: string | null = null
  const suggestions: string[] = []

  try {
    const situation = `${params.personalSituation}\n${params.developmentGoal}`
    const thoughts = JSON.stringify(params.candidates || [])
    
    for await (const delta of query(situation, thoughts)) {
      onUpdate(delta.message, delta.content)

      if (delta.message.includes('brief generated')) {
        const brief = delta.content as Record<string, string>
        plan = Object.values(brief).join('\n\n')
      } else if (delta.message.includes('suggestions') || delta.message.includes('✅')) {
        const s = delta.content as Array<Record<string, string>>
        if (Array.isArray(s)) {
          for (const item of s) {
            if (typeof item === 'object' && item) {
              suggestions.push(Object.values(item).join('\n'))
            }
          }
        }
      } else if (delta.message.includes('output tree structure')) {
        const tree = delta.content as Record<string, unknown>
        const branches = []
        for (const [key, value] of Object.entries(tree)) {
          branches.push({
            id: key,
            label: key,
            yearNodes: typeof value === 'object' ? (value as Record<string, string>) : {},
          })
        }
        if (branches.length > 0) {
          mindTree = { branches }
        }
      }
    }
  } catch (error) {
    console.error('talentReport failed:', error)
  }

  if (!mindTree) {
    mindTree = {
      branches: [
        { id: 'branch1', label: '培养方案', yearNodes: {} },
      ],
    }
  }

  if (!plan) {
    plan = suggestions.join('\n\n') || '正在生成培养方案...'
  }

  return {
    mindTree,
    plan,
  }
}
