from .LLMCores import TextGenerationCore
from .mechanics.Loaders import PromptLoader
from .QueryComponents import QueryComponent
from .MemoryComponents import MemoryComponent

class StrategyComponent:
    
    def __init__(self) -> None:
        self.text_generation_core: TextGenerationCore = TextGenerationCore()
        
    async def elaborate(self, suggestion: str, query: QueryComponent, memory: MemoryComponent):
        """
        This component is used to expand the suggestions into concrete steps.
        """
        prompt: str = PromptLoader("prompt_07_finalOutput").prompt_constructor(
            summary=query.the_brief,
            thoughts=memory.thoughts,
            suggestion=suggestion,
        )
        
        response = await self.text_generation_core.get_chat_response_OpenAI(message=prompt)
        
        return response.choices[0].message.content