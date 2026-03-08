/** 简历主要信息 */
export interface ResumeInfo {
  phone?: string
  email?: string
  university?: string
  degree?: string
  education?: string
}

/** 职业发展预测（接入后端后由接口返回） */
export interface CareerPredictions {
  year10?: string
  year15?: string
  year20?: string
  year30?: string
}

/** 候选人信息 */
export interface Candidate {
  id: string
  name: string
  /** 前公司 + 职位，如 "前 阿里巴巴 高级AI架构师" */
  roleDesc: string
  /** 经验描述，如 "12年经验" */
  experience: string
  /** 是否在侧边栏被选中 */
  selected: boolean
  /** 简历与当前职位是否匹配；不匹配时展示「无效简历」 */
  matchJob?: boolean
  /** 最终得分（接入后端后返回）；推荐结论按此排序取最高 */
  finalScore?: number
  /** 各维度得分（接入后端后返回） */
  dimensionScores?: Record<string, number>
  /** 十年 / 十五年 / 二十年 / 三十年 发展预测（接入后端后返回） */
  careerPredictions?: CareerPredictions
  /** 简历主要信息 */
  resume?: ResumeInfo
  /** 是否为原有固定候选人（张伟、李娜、王强），原有候选人不可删除 */
  isOriginal?: boolean
}

/** 添加候选人弹窗表单（必填项填好后才可提交并出现在列表） */
export interface AddCandidateForm {
  name: string
  roleDesc: string
  experience: string
  phone: string
  email: string
  university: string
  degree: string
  education: string
}

/** 企业需求 */
export interface JobRequirement {
  jobTitle: string
  coreRequirements: string
  /** 是否已确认（确定按钮点击后） */
  confirmed: boolean
}

/** 思维树 - 单个枝丫（一种可能的发展路径）；接入后端后由接口返回 */
export interface MindTreeBranch {
  id: string
  /** 该路径的简述或标签 */
  label: string
  /** 是否为推荐方案（最好的那一枝） */
  isRecommended?: boolean
  /** 可选：该枝丫上各时间节点的描述，如 { year10: '...', year20: '...' } */
  yearNodes?: Record<string, string>
}

/** 思维树 - 整棵树的数据；接入后端后由接口返回，根据十年/几十年发展情况生成 */
export interface MindTreeData {
  /** 各枝丫，每个枝丫代表一种可能 */
  branches: MindTreeBranch[]
}

// ---------- 后端对接：请求/响应类型（与后端约定一致即可） ----------

/** 人才发展路径 - 生成报告请求体 */
export interface TalentReportRequest {
  personalSituation: string
  developmentGoal: string
  candidateIds: string[]
  /** 可选：选中人才的简要信息，便于后端做推演 */
  candidates: { id: string; name: string; roleDesc: string; experience: string; resume?: ResumeInfo }[]
}

/** 人才发展路径 - 生成报告响应 */
export interface TalentReportResponse {
  mindTree: MindTreeData
  /** 最推荐的人才培养方案（阶段、目标、举措等，可 Markdown） */
  plan: string
}

/** 企业决策分析 - 生成报告请求体 */
export interface DecisionReportRequest {
  situation: string
  problem: string
}

/** 企业决策分析 - 生成报告响应 */
export interface DecisionReportResponse {
  mindTree: MindTreeData
  /** 推荐的企业决策方案文案，可 Markdown */
  recommendation: string
}
