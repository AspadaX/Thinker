/** 添加候选人弹窗：必填项填好后提交，候选人才出现在左侧列表 */

import { useState, useCallback } from 'react'
import type { AddCandidateForm } from '../types'

const INITIAL_FORM: AddCandidateForm = {
  name: '',
  roleDesc: '',
  experience: '',
  phone: '',
  email: '',
  university: '',
  degree: '',
  education: '',
}

interface AddCandidateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (form: AddCandidateForm) => void
}

function isFormValid(form: AddCandidateForm): boolean {
  return (
    form.name.trim() !== '' &&
    form.roleDesc.trim() !== '' &&
    form.experience.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.university.trim() !== '' &&
    form.degree.trim() !== '' &&
    form.education.trim() !== ''
  )
}

export function AddCandidateModal({ open, onClose, onSubmit }: AddCandidateModalProps) {
  const [form, setForm] = useState<AddCandidateForm>(INITIAL_FORM)
  const [touched, setTouched] = useState(false)

  const update = useCallback((field: keyof AddCandidateForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setTouched(true)
      if (!isFormValid(form)) return
      onSubmit(form)
      setForm(INITIAL_FORM)
      setTouched(false)
      onClose()
    },
    [form, onSubmit, onClose]
  )

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM)
    setTouched(false)
    onClose()
  }, [onClose])

  if (!open) return null

  const valid = isFormValid(form)
  const showError = touched && !valid

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} aria-hidden />
      <div
        className="relative w-full max-w-lg rounded-xl bg-thinker-sidebar border border-gray-600 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-600 bg-thinker-sidebar">
          <h3 className="text-lg font-semibold text-white">添加候选人</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
            aria-label="关闭"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {showError && (
            <p className="text-sm text-red-400">请填写全部必填项后再提交，候选人将出现在左侧列表中。</p>
          )}
          <div>
            <label className="block text-xs text-gray-400 mb-1">姓名 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：张伟"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">前公司 + 职位 *</label>
            <input
              type="text"
              value={form.roleDesc}
              onChange={(e) => update('roleDesc', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：前 阿里巴巴 高级AI架构师"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">经验描述 *</label>
            <input
              type="text"
              value={form.experience}
              onChange={(e) => update('experience', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：12年经验"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">联系电话 *</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：138****8001"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">邮箱 *</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：zhangwei@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">毕业院校 *</label>
            <input
              type="text"
              value={form.university}
              onChange={(e) => update('university', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：浙江大学"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">学历 *</label>
            <input
              type="text"
              value={form.degree}
              onChange={(e) => update('degree', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple"
              placeholder="如：计算机硕士 (2012)"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">教育背景 *</label>
            <textarea
              value={form.education}
              onChange={(e) => update('education', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-thinker-purple resize-none"
              placeholder="如：2009-2012 浙江大学 计算机科学与技术硕士, 方向: 机器学习与数据挖掘"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm font-medium hover:bg-gray-600"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-thinker-purple text-white text-sm font-medium hover:bg-thinker-purple-hover disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!valid}
            >
              确定添加
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
