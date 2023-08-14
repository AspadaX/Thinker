<p align="center">
  <img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/main/decision_maker_logo.png" alt="Image description" width="200" height="200">
</p>

# Thinker - A Decision Making Assistant

Thinker provides personalized advice using Anthropic's Claude AI assistant based on your unique context.

This Python script implements a decision making assistant using the Tree of Thoughts prompting technique with the Claude API from Anthropic. It allows the user to iteratively explore potential actions by simulating and discussing interactive advice.

FIND ME ON DISCORD! I am pretty sure that guys like you who find this project are talented to make it BETTER! My discord: `https://discord.gg/7bmgzFkn`

## Background
The Tree of Thoughts is a prompting approach that starts broad and gradually narrows down on useful specific ideas through an iterative cycle of generation, simulation, and ranking.

This script follows that pattern:

- The user provides a situation
- Claude generates potential scenarios
- Claude suggests actions for each scenario
- The actions are scored by feasibility via simulation
- Top ranked suggestions are discussed interactively
- By recursively prompting Claude to simulate and build on its own ideas, the assistant can rapidly explore the space of options and zoom in on targeted, relevant advice.

Here is a flowchart that explains how the second generation of Thinker works:
<p align="center"><img src="https://github.com/AspadaX/Thinker_DecisionMakingAssistant/blob/1400ac9da54e58b69286a19dc7999d8c9e4dc3e4/Flowchart.png" alt="Image description" <figcaption>A flowchart for the underneath design of Thinker Gen.2</figcaption></p>

## Features
- Saves conversation history for contextual awareness
- Uses NLP embedding similarity to find relevant past situations
- Generates multi-step Tree of Thoughts:
- Situational summary
- Potential scenarios
- Suggested actions
- Simulated evaluations
- Interactive discussion
- Ranks suggestions by running Claude simulations
- Extracts representative suggestions via clustering
- Allows interactive elaboration on top advice

## Usage
To run locally:

- Sign up for Claude API key at anthropic.com
- Clone repo and install requirements
- Set `ANTHROPIC_API_KEY` environment variable
- Run `python claude_decision_maker.py`
- Enter your situation and thought process when prompted
- Interactively discuss top recommendations
- The core prompting cycle is implemented in `get_scenario_responses`, `parse_suggestions`, `add_scores`, `interactive_advice` and other functions defined in the script.

## Roadmap
Ideas and improvements welcome! Some possibilities:

- Integrate OpenAI models, or other capable LLMs, as the underneath engine.
- Alternative simulation scoring methods
- Front-end UI for better experience
- Integration with user calendar and task tracking
- Containerization for easy deployment
- More refined clustering and ranking approaches
- The core prompting framework could also be extended to other use cases like creative ideation, strategic planning, and more. Please open issues or PRs if you build on this project!

## License
This project is licensed under the MIT license. Feel free join my efforts in making this app more useful and helpful to people!
Just do not forget to reference this project when needed. 
