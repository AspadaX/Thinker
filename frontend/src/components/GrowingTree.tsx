/**
 * 思维树可视化：一棵不断生长的树，每个枝丫代表一种可能的发展路径，推荐方案为最好的那一枝。
 * 后端接入后可根据十年/几十年发展情况生成 branches 数据。
 */

import type { MindTreeBranch } from '../types'

interface GrowingTreeProps {
  /** 接入后端后传入，不传则用占位枝丫 */
  branches?: MindTreeBranch[]
}

const DEFAULT_BRANCHES: MindTreeBranch[] = [
  { id: '1', label: '路径一', isRecommended: false },
  { id: '2', label: '路径二', isRecommended: false },
  { id: '3', label: '路径三', isRecommended: true },
  { id: '4', label: '路径四', isRecommended: false },
]

export function GrowingTree({ branches = DEFAULT_BRANCHES }: GrowingTreeProps) {
  const list = branches.length > 0 ? branches : DEFAULT_BRANCHES
  const recommended = list.find((b) => b.isRecommended)

  // 布局：主干在下，枝丫向上、向两侧展开；枝丫末端为节点
  const w = 800
  const h = 420
  const trunkX = w / 2
  const trunkTop = 80
  const trunkBottom = h - 40
  const branchStartY = 180

  // 根据枝丫数量生成枝丫端点坐标（左右交替，推荐枝高亮）
  const getBranchPoints = () => {
    const n = list.length
    const points: { x: number; y: number; branch: MindTreeBranch }[] = []
    const leftCount = Math.ceil(n / 2)
    const rightCount = n - leftCount
    const leftXs = leftCount === 1 ? [trunkX - 180] : Array.from({ length: leftCount }, (_, i) => trunkX - 220 + (i * 160) / Math.max(leftCount - 1, 1))
    const rightXs = rightCount === 1 ? [trunkX + 180] : Array.from({ length: rightCount }, (_, i) => trunkX + 60 + (i * 160) / Math.max(rightCount - 1, 1))
    list.forEach((b, i) => {
      if (i < leftCount) {
        points.push({ x: leftXs[i], y: trunkTop + 25 + (i % 2) * 50, branch: b })
      } else {
        const j = i - leftCount
        points.push({ x: rightXs[j], y: trunkTop + 25 + (j % 2) * 50, branch: b })
      }
    })
    return points
  }

  const points = getBranchPoints()

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full max-w-4xl mx-auto h-auto"
        style={{ minHeight: 380 }}
      >
        <defs>
          <linearGradient id="trunkGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
          <linearGradient id="branchGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 主干：从下往上生长 */}
        <path
          d={`M ${trunkX} ${trunkBottom} L ${trunkX} ${trunkTop}`}
          fill="none"
          stroke="url(#trunkGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${trunkX} ${trunkBottom} L ${trunkX} ${trunkTop}`}
          fill="none"
          stroke="url(#trunkGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 时间刻度（十年、二十年、几十年） */}
        {[trunkBottom - 80, trunkBottom - 160, branchStartY, trunkTop + 20].map((y, i) => (
          <g key={i}>
            <line x1={trunkX - 8} x2={trunkX + 8} y1={y} y2={y} stroke="#6b7280" strokeWidth="2" />
            <text
              x={trunkX - 16}
              y={y + 4}
              textAnchor="end"
              className="fill-gray-500 text-xs"
              style={{ fontSize: 10 }}
            >
              {i === 0 ? '当前' : i === 1 ? '十年' : i === 2 ? '二十年' : '更长期'}
            </text>
          </g>
        ))}

        {/* 枝丫：每个枝丫代表一种可能 */}
        {points.map((p) => {
          const isRec = p.branch.isRecommended
          const ctrlX = p.x > trunkX ? trunkX + 80 : trunkX - 80
          const pathD = `M ${trunkX} ${branchStartY} C ${ctrlX} ${branchStartY}, ${ctrlX} ${p.y}, ${p.x} ${p.y}`
          return (
            <g key={p.branch.id}>
              <path
                d={pathD}
                fill="none"
                stroke={isRec ? '#a78bfa' : '#6b7280'}
                strokeWidth={isRec ? 4 : 2.5}
                strokeLinecap="round"
                filter={isRec ? 'url(#glow)' : undefined}
                opacity={isRec ? 1 : 0.85}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={isRec ? 20 : 14}
                fill={isRec ? '#7c3aed' : '#374151'}
                stroke={isRec ? '#a78bfa' : '#4b5563'}
                strokeWidth={isRec ? 2 : 1}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className="fill-white"
                style={{ fontSize: isRec ? 11 : 10, fontWeight: isRec ? 600 : 400 }}
              >
                {p.branch.label.length > 4 ? p.branch.label.slice(0, 4) + '…' : p.branch.label}
              </text>
              {isRec && (
                <text
                  x={p.x}
                  y={p.y + 36}
                  textAnchor="middle"
                  className="fill-thinker-purple text-xs font-medium"
                >
                  推荐方案
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* 图例与说明 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
        <span>每个枝丫 = 一种可能的发展路径</span>
        {recommended && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-thinker-purple" />
            推荐方案（最优路径）
          </span>
        )}
      </div>
    </div>
  )
}
