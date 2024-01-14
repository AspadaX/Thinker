import asyncio
import json
import re

from .MemoryComponents import *
from .mechanics.QueryOperations import QueryOperation
from .LLMCores import *


class QueryComponent:
    
    def __init__(
        self, 
        memory: MemoryComponent, 
        base_tree_size: int = 5, 
        branch_size_factor: int = 5, 
        top_n_advices: int = 5,
        inference_model: str = "gpt-3.5-turbo-1106",
        api_type: str = "openai",
    ) -> None:
        
        # initialized variables
        self.memory: MemoryComponent = memory
        self.base_tree_size: int = base_tree_size # the number determines how many predictions it makes for the query
        self.branch_size_factor: int = branch_size_factor # the number determines how many suggestions made for each prediction
        self.top_n_advices: int = top_n_advices # the number determines how many advices it will eventually sort out
        logging.info(f'QueryComponent initialized with base_tree_size: {base_tree_size}')
        logging.info(f'QueryComponent initialized with branch_size_factor: {branch_size_factor}')
        logging.info(f'QueryComponent initialized with top_n_advices: {top_n_advices}')
        
        # initialize the `text_generator`
        self.text_generator: TextGenerationCore = TextGenerationCore(api_type=api_type, model=inference_model)
        
        # other variables that we will get later on
        self.the_brief: dict = {}
        self.the_predictions: list = []
        self.the_suggestions: list = []
        self.the_final_output: list = []
    
    async def brief(self) -> None:
        """
        The `brief` function generates a brief prompt by combining various pieces of information and
        sends it to the OpenAI text generator to generate a brief.
        """
        with open('resources/prompts/prompt_03_brief', 'r') as prompt:
            prompt: str = prompt.read()
        
        # retrieve the historical events
        historical_events: list = await self.memory.retrieve_memory()
        
        # construct the prompt to send
        situation = "[situation]:" + self.memory.situation + "\n"
        context = "[context]:" + str(historical_events) + "\n"
        thoughts = "\n[my thoughts to the situation]:" + self.memory.thoughts + "\n"
        info_lookup = "[info_lookup]:" + "Current date is " + str(datetime.datetime.now()) + "\n"
        
        brief_prompt: str = prompt + thoughts + situation + info_lookup + context
        logging.info("Brief prompt generated.")
        logging.debug(brief_prompt)
        
        # get the brief
        try:
            while True:
                brief: ChatCompletion = await self.text_generator.get_json_response_OpenAI(message=brief_prompt)
                if brief is None:
                    continue
                
                logging.info("Brief generated.")
            
                # record the brief into the object instance
                self.the_brief = json.loads(brief.choices[0].message.content)
                logging.info("Brief recorded.")
                break
        except json.JSONDecodeError as e:
            logging.error(f"Brief generation failed due to {e}. Retry.")
    
    async def predict(self) -> None: 
        """
        The `predict` function reads a prompt from a file, appends a summary to it, generates a
        prediction using OpenAI's text generator, and records the prediction in the object instance.
        """
        with open('resources/prompts/prompt_04_predictions', 'r') as prompt:
            prompt: str = prompt.read()
        
        # construct the prompt to send
        prompt = prompt + "\n" + "[summary]:" + str(self.the_brief)
        
        # get the predictions based on the `base_tree_size`
        # original seed: seed=458282
        tasks = [self.text_generator.get_json_response_OpenAI(message=prompt) for i in range(self.base_tree_size)]
        predictions = await asyncio.gather(*tasks)
        logging.info("Predictions generated. ")
        
        for prediction in predictions:
            
            try:
                
                # we stop the current iteration and start the next in case if the API request failed.
                if prediction is None:
                    continue
                
                content: str = prediction.choices[0].message.content
                
                matches = re.findall(r"```json\n([\s\S]*?)\n```", content)
                
                if matches:
                    # record the prediction into the object instance
                    self.the_predictions.append(json.loads(matches[0]))
                    logging.info("Prediction recorded.")
                else:
                    self.the_predictions.append(json.loads(content))
                    logging.info("Prediction recorded.")
                        
            except json.JSONDecodeError as e:
                logging.error(f"Prediction generation failed due to {e}. Retry.")
                valid_prediction = False
                
                while valid_prediction == False:
                    prediction: ChatCompletion = self.text_generator.get_json_response_OpenAI(message=prompt)
                    
                    content: str = prediction.choices[0].message.content
                    matches = re.findall(r"```json\n([\s\S]*?)\n```", content)
                    
                    if matches:
                        # record the prediction into the object instance
                        self.the_predictions.append(json.loads(matches[0]))
                        valid_prediction = True
                        logging.info("Retry succeeded. Prediction recorded.")
                    else:
                        self.the_predictions.append(json.loads(content))
                        valid_prediction = True
                        logging.info("Retry succeeded. Prediction recorded.")
    
    async def suggest(self) -> None:
        # load the prompt
        with open('resources/prompts/prompt_05_suggestions', 'r') as prompt:
            prompt: str = prompt.read()

        # construct the prompt to send
        prompts: list = []
        counter: int = 0
        for prediction in self.the_predictions:
            iterative_prompt = prompt + "[predictions]:" + str(prediction) + "\n" + "[summary]:" + str(self.the_brief) + "\n" + "[thoughts]:" + self.memory.thoughts + "\n"
            prompts.append(iterative_prompt)
            counter += 1
            logging.info(f"Suggestions prompt generated ({counter}/{len(self.the_predictions)})")
            logging.debug(f"Suggestions prompt preview: {iterative_prompt}")

        # get the suggestions
        # list comprehension to schedule 5 generations for each prompt
        tasks = [self.text_generator.get_json_response_OpenAI(message=prompt) for prompt in prompts for i in range(self.branch_size_factor)]
        results: list = await asyncio.gather(*tasks)
        
        # post-process the results
        for result in results:
            
            # we stop the current iteration and start the next in case if the API request failed. 
            if result is None:
                continue
            
            content = result.choices[0].message.content
            
            # Use a regular expression to find JSON within triple backticks
            matches = re.findall(r"```json\n([\s\S]*?)\n```", content)
            try:
                if matches:
                    # Take the first match as the JSON content
                    json_str = matches[0]
                    json_result: dict = json.loads(json_str)
                else:
                    # Fallback to parsing the content directly if no markdown was found
                    json_result: dict = json.loads(content)
                
                # post-process the `success_rate_in_percentage`
                if isinstance(json_result['success_rate_in_percentage'], str) and json_result['success_rate_in_percentage'].endswith('%'):
                    json_result['success_rate_in_percentage'] = int(json_result['success_rate_in_percentage'].rstrip('%'))
                    logging.info(f"Success rate is in percentage: {json_result['success_rate_in_percentage']}, converted")
                    
                elif isinstance(json_result['success_rate_in_percentage'], int):
                    logging.info(f"Success rate is already an integer: {json_result['success_rate_in_percentage']}")
                    pass
                    
                else:
                    json_result['success_rate_in_percentage'] = int(json_result['success_rate_in_percentage'])
                    logging.info(f"Success rate is not an integer: {json_result['success_rate_in_percentage']}, converted.")
                
                # Append the parsed JSON to the suggestions list
                self.the_suggestions.append(json_result)
            
            except json.JSONDecodeError as e:
                logging.error(f"Could not decode the JSON response: {e}")
                logging.error(f"Problematic content: {content}")
            
            except Exception as e:
                logging.error(f"An unexpected error occurred while parsing the JSON: {e}")
        
        # remove the duplicated branches
        self.the_suggestions = QueryOperation(query_object=self.the_suggestions).prune_branches(key='move')
        
        # for suggestion in self.the_suggestions:
        #     print(suggestion['move'])
        #     print(suggestion['rationale'])
        #     print(suggestion['success_rate_in_percentage'])
    
    async def evaluate(self):
        """
        Evaluate the suggestions and decide whether to keep making branches or not.
        """
        
        self.the_suggestions.sort(key=lambda x: x['success_rate_in_percentage'], reverse=True)
        
        # we keep the `top_n_advices`
        self.the_suggestions = self.the_suggestions[:self.top_n_advices]
        logging.info(f"The top {self.top_n_advices} suggestions are kept.")