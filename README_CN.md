<p align="center">
  <img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/main/decision_maker_logo.png" alt="图片描述" width="200" height="200">
</p>

[English](#README)

# Thinker - 决策助手

Thinker使用基于您独特背景的~~Anthropic的Claude AI~~ GPT提供个性化建议。

此Python程序使用树状思维提示技术实现决策助手，使用~~Anthropic的Claude API~~ OpenAI的GPT。它允许用户通过模拟和讨论交互式建议来迭代地探索潜在行动。

欢迎添加个人微信交流：`baoxinyu2007`

## 背景
思维树是一种通过生成、模拟和排名的迭代循环，从广泛到具体的思考方法。

此程序遵循以下模式：

- 用户提供情境
- LLM生成潜在场景
- LLM为每个场景建议行动
- 通过模拟评估行动的可行性
- 通过递归提示LLM模拟并建立在其自己的想法上，助手可以快速探索选项空间并聚焦于有针对性的建议。

这是解释第二代Thinker工作原理的流程图：
<p align="center"><img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/1400ac9da54e58b69286a19dc7999d8c9e4dc3e4/Flowchart.png" alt="图片描述" <figcaption>Thinker Gen.2底层设计的流程图</figcaption></p>

## 特点
- 保存对话历史以保持上下文感知
- 使用NLP嵌入相似性查找相关的过去情境
- 生成多步思维树：
  - 情境摘要
  - 潜在场景
  - 建议的行动
  - 模拟评估
  - 交互式讨论
- 通过运行Claude模拟对建议进行排名
- 通过聚类提取代表性建议
- 允许对顶级建议进行交互式阐述

## 使用
要在本地运行：

首先，您需要在 openai.com 上获取一个OpenAI API密钥，因为当前的Thinker程序需要GPT模型来运行。

然后，在 `/resources/remote_services/api_key` 文件下，这是如何放置您的api-key：

```
{
"openai_api_key":"您的api密钥在这里",
"openai_base_url":"如果需要代理，请在此处放置您的基本url",
"openai_official_api_key":"您的api密钥在这里"
}
```

如果需要使用代理访问OpenAI服务，您需要修改 `commons/components/LLMCores.py` 如下：

更改
```
api_type: str = 'openai'
```

为
```
api_type: str = 'proxy'
```


最后，在使用 `python3 user_interface.py` 运行Gradio演示之前，请使用 `pip install -r requirements.txt` 安装所有依赖项。

## 路线图
欢迎提出想法和改进！一些可能性：

- 集成OpenAI模型，或其他功能强大的LLMs，作为底层引擎。
- 替代的模拟评分方法
- 用于更好体验的前端UI
- 与用户日历和任务跟踪的集成
- 用于轻松部署的容器化
- 更精细的聚类和排名方法
- 核心提示框架也可以扩展到其他用例，如创造性思维、战略规划等。如果您在此项目的基础上构建，请打开问题或PR！

## 如果你喜欢的话给我买杯咖啡 :))
<p align="center">
  <img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/main/WechatIMG325.jpg" alt="图片描述" width="200" height="200">
</p>

<p align="center">
  <img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/main/IMG_1851.JPG" alt="图片描述" width="200" height="200">
</p>

## 许可证
该项目采用MIT许可证。请随时加入我努力使此应用对人们更有用和有帮助！
只需在需要时引用此项目。