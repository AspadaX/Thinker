/** 开始演示跳转页：演示模式说明或引导 */

import { Link } from 'react-router-dom'

export function DemoPage() {
  return (
    <div className="min-h-screen bg-thinker-dark text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-thinker-purple flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-white">演示模式</h1>
        <p className="text-gray-400">
          在此可接入演示流程：如自动填充示例数据、分步演示思维树推演等。当前为占位页，完成后可在此实现具体演示逻辑。
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-thinker-purple text-white font-medium hover:bg-thinker-purple-hover transition-colors"
        >
          返回主界面
        </Link>
      </div>
    </div>
  )
}
