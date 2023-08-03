![Image description](decision_maker_logo.png)
# Thinker - A Decision Making Assistant

Thinker provides personalized advice using Anthropic's Claude AI assistant based on your unique context.

## Features

- Stores history of your past situations and decisions  
- Uses NLP to find your most similar past situations
- Formulates prompt for Claude combining your current situation, goal, context, and lookup info
- Calls Claude API to generate tailored recommendations
- Caches Claude's suggestions to surface relevant advice over time

## Getting Started

### Prerequisites

- Python 3
- Anthropic API Key (set in `ANTHROPIC_API_KEY` environment variable)

### Installation

```bash
git clone https://github.com/yourname/claude-decision-maker.git
cd claude-decision-maker
pip install -r requirements.txt
```

### Usage

```
python claude_decision_maker.py
```
When prompted, enter your current situation and goal. Claude will provide personalized suggestions based on your conversation history.

See examples for sample input and output. (Will be posted later.)

### Credits

Thinker was created by Xinyu Bao. It uses the Anthropic Claude API and spaCy.

### License
This project is licensed under the MIT license. Feel free join my efforts in making this app more useful and helpful to people!
