from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class CommonSettings(BaseSettings):
    type: str | None = Field("openai", description="API type")

    model_config = SettingsConfigDict(
        env_prefix="api_"
    )
