# The code defines two classes, `ConfigLoader` and `PromptLoader`, which are used to load
# configurations from a JSON file and prompts from text files, respectively.
import json

# The `ConfigLoader` class loads a JSON configuration file and provides a method to access the loaded
# configurations.
class ConfigLoader:
    
    def __init__(self) -> None:
        self.config_path: str = "resources/references/config.json"
        
        with open(self.config_path, "r") as file:
            self.config: dict = json.load(file)
    
    def configurations(self) -> dict:
        return self.config


# The `PromptLoader` class is a Python class that loads prompts from a file and allows for the
# construction of prompts with provided arguments.
class PromptLoader:
    
    def __init__(self, prompt_name: str) -> None:
        self.prompts_path: str = "resources/prompts/"
        self.prompt_name: str = prompt_name
        self.prompt: str = self.__load_prompt()
    
    def __repr__(self) -> str:
        return self.prompt
    
    def __len__(self) -> int:
        return len(self.prompt)
    
    def __load_prompt(self) -> str:
        with open(self.prompts_path + self.prompt_name, "r") as self.file:
            self.prompt: str = self.file.read()
            return self.prompt
    
    def prompt_constructor(self, *args, **kwargs) -> str:
        """
        The function `prompt_constructor` takes in arguments and keyword arguments, constructs a prompt
        using a predefined format, and returns the constructed prompt as a string.
        :return: The function `prompt_constructor` returns a string that is constructed using the
        `self.prompt` attribute, which is a string format template. The template is formatted with the
        `args` and `kwargs` arguments passed to the function.
        """
        constructed_prompt: str = self.prompt.format(*args, **kwargs)
        
        return constructed_prompt