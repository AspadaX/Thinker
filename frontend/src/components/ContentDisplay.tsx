/** Display nested content with boxes - handles both lists and dicts */

import { ReactNode } from 'react'

interface ContentDisplayProps {
  content: any
  level?: number
}

export function ContentDisplay({ content, level = 0 }: ContentDisplayProps): ReactNode {
  const indent = level * 16
  
  if (content === null || content === undefined) {
    return null
  }

  if (Array.isArray(content)) {
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        {content.map((item, idx) => (
          <div key={idx} className="mb-2">
            <div className="px-3 py-2 rounded-lg border border-thinker-purple/30 bg-thinker-purple/10">
              <div className="text-xs text-thinker-purple mb-1">Item {idx + 1}</div>
              <ContentDisplay content={item} level={level + 1} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (typeof content === 'object') {
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="mb-2">
            <div className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800/50">
              <div className="text-xs text-gray-400 mb-1 font-medium">{key}</div>
              <ContentDisplay content={value} level={level + 1} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div 
      style={{ marginLeft: `${indent}px` }}
      className="px-2 py-1 rounded bg-gray-900/50 text-gray-200 text-sm"
    >
      {String(content)}
    </div>
  )
}