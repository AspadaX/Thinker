"""
The code defines a class called `TextGenerationCore` that initializes an OpenAI instance and
provides a method to get a JSON response from the OpenAI language model. The main function
demonstrates the usage of the class by generating responses to multiple prompts.
"""

from typing import List, Any, Dict
import random
import json
import logging

import openai
from openai.types.chat import ChatCompletion
from openai import AsyncOpenAI

import google.generativeai as genai

class TextGenerationCore:
    
    def __init__(self, api_type: str = 'openai', model: str = 'gpt-3.5-turbo-1106') -> None:
        self.api_type = api_type
        self.overall_token_consumption: int = 0
        # initialize the variables
        match self.api_type:
            case 'proxy':
                try:
                    with open('resources/remote_services/api_key', 'r') as config:
                        config = json.load(config)
                        self.model = model
                        self.base_url = config['openai_base_url']
                        self.api_key = config['openai_api_key']
                except IOError as e:
                    logging.error(f'Error: {e}')
                    raise
            
            case 'openai':
                try:
                    with open('resources/remote_services/api_key', 'r') as config:
                        config = json.load(config)
                        self.model = model
                        self.api_key = config['openai_official_api_key']
                except IOError as e:
                    logging.error(f'Error: {e}')
                    raise
            
            case 'google':
                ...
    
    def __initialize_OpenAI(self) -> AsyncOpenAI:
        """
        initialize an OpenAI instance.
        """
        if self.api_type == 'proxy':
            self.client: AsyncOpenAI = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        else:
            self.client: AsyncOpenAI = AsyncOpenAI(
                api_key=self.api_key,
            )
        
        return self.client
    
    async def __response(
        self, 
        message: list, 
        response_format: dict = None, 
        seed: int = None
    ) -> ChatCompletion:
        
        """
        The function `__response` is an asynchronous function that takes in a list of messages, a
        response format dictionary, and a seed integer as parameters. It uses the OpenAI API to create a
        chat completion based on the given parameters and returns the response. If there is a timeout
        error, it logs the error message.
        
        :param message: The `message` parameter is a list of message objects that represent the
        conversation between the user and the AI model. Each message object has two properties: `role`
        and `content`. The `role` can be either "system", "user", or "assistant", and the `content`
        contains
        :type message: list
        :param response_format: The `response_format` parameter is an optional dictionary that allows
        you to specify the format in which you want the response to be returned. It can include the
        following keys:
        :type response_format: dict
        :param seed: The `seed` parameter is an optional integer that can be used to control the
        randomness of the model's response. By setting a specific seed value, you can ensure that the
        model generates the same response for the same input message. This can be useful for debugging
        or reproducibility purposes. If no
        :type seed: int
        :return: a ChatCompletion object.
        """
        
        try: 
            response: ChatCompletion = await self.client.chat.completions.create(
                model=self.model,
                messages=message,
                response_format=response_format,
                seed=seed
            )
            
            remote_system_fingerprint: str = response.system_fingerprint
            logging.info(f"Current remote system fingerprint is {remote_system_fingerprint}")
            
            completion_tokens: int = response.usage.completion_tokens
            prompt_tokens: int = response.usage.prompt_tokens
            total_tokens: int = response.usage.total_tokens
            logging.info(
                f"Completion tokens: {completion_tokens}"
                f"\nPrompt tokens: {prompt_tokens}"
                f"\nTotal tokens: {total_tokens}"
            )
        
            # update the `self.overall_token_consumption`
            self.overall_token_consumption += total_tokens
            logging.info(f"Overall token consumption by far: {self.overall_token_consumption}")
        
        except openai.APITimeoutError as e:
            logging.error(f"Timeout error: {e}")
        
        except TimeoutError as e:
            logging.error(f"Timeout error: {e}")
        
        except openai.APIConnectionError as e:
            logging.error(f"Connection error: {e}")
        
        else:
            return response
    
    async def get_chat_response_OpenAI(self, message: str, seed: int = None) -> ChatCompletion:
        
        # we randomize the seed here instead of in the parameter input
        # to prevent the case, in which concurrent callings result in the same seeds
        if seed is None:
            seed = random.randint(a=0, b=999999)
        
        # OpenAI instance initiated
        self.__initialize_OpenAI()
        
        # log the generation specifications
        logging.info(f"Seed for generation: {seed}")
        logging.info("Generation mode: generic / all at once")
        
        # initiate an empty chat history for stateful conversation
        self.chat_message: list = []
        self.chat_message.append(
            {"role":"user", "content": str(message)}
        )
        
        response: ChatCompletion = await self.__response(
            message=self.chat_message,
            seed=seed
        )
        
        # append the assistant response to the `self.chat_message`
        self.chat_message.append(
            {"role":"assistant", "content":response.choices[0].message.content}
        )
        
        return response
    
    async def get_json_response_OpenAI(self, message: str, seed: int = None) -> ChatCompletion:
        
        # we randomize the seed here instead of in the parameter input
        # to prevent the case, in which concurrent callings result in the same seeds
        if seed is None:
            seed = random.randint(a=0, b=999999)
        
        # OpenAI instance initiated
        self.__initialize_OpenAI()
        
        # response format
        response_format: dict = {
            "type": "json_object"
        }
        
        # log the generation specifications
        logging.info(f"Seed for generation: {seed}")
        logging.info("Generation mode: json")
        
        message: List(Dict(str, str)) = [
            {"role":"user", "content": message}
        ]
        
        # get the response from the LLM
        response: ChatCompletion = await self.__response(
            message=message,
            response_format=response_format,
            seed=seed
        )
        
        return response

if __name__ == "__main__":
    
    import asyncio
    
    logging.basicConfig(level=logging.INFO)
    
    async def main():
        
        TGC = TextGenerationCore()
        
        situation = "I lost my purse."
        prompt: str = f"""
        YOUR RESPONSE SHOULD BE IN JSON ONLY.
        [Task_01]:"breakdown the [situation] and [goal], then analyse it. Print it out in JSON."
        [Task_02]:"Give 5 [inference] on how the [situation] is going to develop. Then, provide 5 [prediction]. Give a score by percentage for each [predicted_scenario] on the probability. Print it out in JSON."
        [Task_03]:"Give 5 [suggestion] based on [Task_01] and [predicted_scenario]. Also, for each [suggestion], evaluate the pros and cons, then give a [recommendation_score] by percentage on how much that you recommend to execute. Print it out in JSON."
        [situation]:{situation}
        """
        
        messages: list = [
            [{"role":"user", "content":prompt}],
            [{"role":"user", "content":prompt}],
            [{"role":"user", "content":prompt}],
        ]
        
        tasks = [TGC.get_json_response_OpenAI(messages=message) for message in messages]
        
        results = await asyncio.gather(*tasks)
    
        for result in results:
            print(result.choices[0].message.content)
    
    asyncio.run(main())