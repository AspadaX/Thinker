from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class OpenAISettings(BaseSettings):
    api_key: str | None = Field(None, description="OpenAI API key")
    base_url: str | None = Field(None, description="Basic URL of OpenAI API")
    model: str | None = Field(..., description="Specify the OpenAI model to be used")

    model_config = SettingsConfigDict(
        env_prefix="openai_"
    )
