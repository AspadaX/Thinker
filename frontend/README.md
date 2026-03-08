# Thinker - 职业发展路径对比

**核心功能**：帮助 HR 高效筛选简历。支持批量上传简历并进行分析，筛出最优几份后由 HR 仔细分析并迭代。

## 技术栈

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- React Router 6

## 功能说明

### 首页（/）

- 突出「帮 HR 高效筛选简历」：批量上传、智能分析、筛出最优，再交由 HR 精细分析迭代。
- 底部三点：批量上传·一键分析 / 筛出最优 / HR 精细迭代。
- 点击「开始」或「进入应用」进入应用主界面（/app）。

### 顶部导航

- **Logo**：点击返回首页 `/`
- **思维树**：主内容区为思维树视图（十年/十五年/二十年/三十年发展预测、多维度评分、无效简历标记）
- **推荐结论**：主内容区为推荐结论（得分最高的人；无效简历单独列出）
- **开始演示**：跳转至 `/demo` 演示页

### 左侧栏

- **企业需求输入**：职位名称、招聘核心要求，点击「确定」后主内容区「针对职位」更新为已填职位。
- **候选人管理**：
  - **上传简历**：触发文件选择（可接后端批量解析）。
  - **添加**：打开弹窗，填写姓名、前公司+职位、经验、联系电话、邮箱、毕业院校、学历、教育背景等**全部必填项**，填好并点击「确定添加」后，该候选人才出现在左下方列表中。
- **生成报告**：下拉可选「生成完整报告」「导出 PDF」；生成报告后可接后端返回各候选人 `matchJob`、`finalScore`、`dimensionScores`、`careerPredictions`。

### 主内容区

- **思维树**（接入后端后）：
  - 对每个候选人展示：十年、十五年、二十年、三十年发展预测；各维度得分；最终得分。
  - 若简历与职位不匹配，该候选人卡片直接展示「**无效简历**」，不参与推荐结论。
- **推荐结论**：
  - **推荐结论**为得分最高的人（按 `finalScore` 排序取第一）。
  - 与职位不匹配的候选人统一在「无效简历」区块中列出。

## 后端对接

前端已预留统一 API 层（`src/api/index.ts`），未配置 `VITE_API_BASE_URL` 或请求失败时继续使用占位数据，不影响使用。

**环境变量**：在项目根目录新建 `.env`，参考 `.env.example` 配置：

```bash
VITE_API_BASE_URL=http://localhost:3000
```

**约定接口**（与 `src/types.ts` 中类型一致）：

| 模块 | 方法 | 路径 | 请求体 | 响应体 |
|------|------|------|--------|--------|
| 人才发展路径 | POST | `/api/talent/report` | `TalentReportRequest`: `personalSituation`, `developmentGoal`, `candidateIds`, `candidates` | `TalentReportResponse`: `mindTree`（`MindTreeData`）, `plan`（string） |
| 企业决策分析 | POST | `/api/decision/report` | `DecisionReportRequest`: `situation`, `problem` | `DecisionReportResponse`: `mindTree`, `recommendation`（string） |

思维树结构 `MindTreeData`：`{ branches: MindTreeBranch[] }`，每项 `MindTreeBranch` 含 `id`, `label`, `isRecommended?`, `yearNodes?`。后端按上述约定返回 JSON 即可，前端自动渲染思维树与方案文案。

## 开发与构建

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
src/
  main.tsx          # 入口
  App.tsx           # 路由与主布局状态
  types.ts          # 候选人、职位需求类型
  components/       # Header、Sidebar、MindMapView、ConclusionView
  pages/            # DemoPage（/demo）
```
