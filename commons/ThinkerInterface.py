from .components.MemoryComponents import MemoryComponent
from .components.QueryComponents import QueryComponent
from .components.ThinkComponents import StrategyComponent
from .components.mechanics.Loaders import ConfigLoader

# The `Thinker` class is a component that processes queries, retrieves suggestions, and elaborates on
# selected suggestions using a strategy component.
class Thinker:
    
    def __init__(
        self, 
        situation: str, 
        thoughts: str
    ) -> None:
        
        # retrieve configs
        self.config: dict = ConfigLoader().configurations()
        
        # extract relevant memories from the database
        self.memory: MemoryComponent = MemoryComponent(situation=situation, thoughts=thoughts)
        
        # initialize `QueryComponent` with the config
        self.query: QueryComponent = QueryComponent(
            memory=self.memory, 
            base_tree_size=self.config['base_tree_size'],
            branch_size_factor=self.config['branch_size_factor'],
            top_n_advices=self.config['top_n_advices'],
            inference_model=self.config['inference_model']
        )
        
        # initialize `StrategyComponent`
        self.strategizer: StrategyComponent = StrategyComponent()
    
    async def query_process(self) -> None:
        """
        The `query_process` function saves the current situation into memory, performs a series of queries,
        and retrieves the suggestions from the `QueryComponent`.
        """
        
        # save the current situation into the memory
        await self.memory.store_memory()
        
        # query
        await self.query.brief()
        await self.query.predict()
        await self.query.suggest()
        await self.query.evaluate()
        
        # retrieve the final outputs of the `QueryComponent`
        self.the_suggestions: list = self.query.the_suggestions
    
    async def think_process(self, selected_suggestion: int) -> str:
        """
        The `think_process` function takes a selected suggestion, elaborates on it using the `strategizer`,
        and returns the suggestion steps.
        
        :param selected_suggestion: An integer representing the index of the selected suggestion from a list
        of suggestions
        :type selected_suggestion: int
        :return: The function `think_process` returns a string, which is the value of the variable
        `suggestion_steps`.
        """
        
        selection: str = self.the_suggestions[selected_suggestion]
        suggestion_steps: str = await self.strategizer.elaborate(
            suggestion=selection, 
            query=self.query, 
            memory=self.memory
        )
        
        return suggestion_steps