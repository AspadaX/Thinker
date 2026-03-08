import logging

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse
from pydantic import BaseModel
from typing_extensions import AsyncIterable

from commons.ThinkerInterface import Thinker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class QueryRequest(BaseModel):
    situation: str
    thoughts: str


class QueryDelta(BaseModel):
    message: str
    content: dict[str, str] | list = {}


app = FastAPI()


@app.post("/query", response_class=EventSourceResponse)
async def query(request: QueryRequest):
    logger.info(f"Starting query for situation: {request.situation[:50]}...")
    instance = Thinker(situation=request.situation, thoughts=request.thoughts)

    # save the current situation into the memory
    yield QueryDelta(message="recording memories")
    logger.debug("Storing memory...")
    await instance.memory.store_memory()
    logger.info("Memory stored successfully")
    yield QueryDelta(message="memories recorded")

    # query
    yield QueryDelta(message="generating brief")
    logger.debug("Generating brief...")
    await instance.query.brief()
    logger.info(f"Brief generated: {instance.query.the_brief}")
    yield QueryDelta(
        message="brief generated",
        content=instance.query.the_brief,
    )

    yield QueryDelta(message="generating predictions")
    logger.debug("Generating predictions...")
    await instance.query.predict()
    logger.info(f"Generated {len(instance.query.the_predictions)} predictions")
    yield QueryDelta(
        message=f"generated {len(instance.query.the_predictions)} predictions",
        content=instance.query.the_predictions,
    )

    yield QueryDelta(message="generating suggestions")
    logger.debug("Generating suggestions...")
    await instance.query.suggest()
    logger.info(
        f"Generated {len(instance.query.the_suggestions)} raw suggestions"
    )
    yield QueryDelta(
        message=f"✅ Generated {len(instance.query.the_suggestions)} raw suggestions.",
        content=instance.query.the_suggestions,
    )

    yield QueryDelta(message="evaluating suggestions")
    logger.debug("Evaluating suggestions...")
    _, instance.tree_structure = await instance.query.evaluate()
    logger.info("Suggestions evaluated, tree structure created")
    yield QueryDelta(
        message="suggestions evaluated, output tree structure",
        content=instance.tree_structure,
    )

    # retrieve the final outputs of the `QueryComponent`
    logger.debug("Retrieving final suggestions...")
    final_suggestions = instance.the_suggestions
    logger.info(
        f"Evaluation completed with {len(final_suggestions) if hasattr(final_suggestions, '__len__') else 'unknown'} suggestions"
    )
    yield QueryDelta(
        message="evaluation completed",
        content=final_suggestions,
    )
