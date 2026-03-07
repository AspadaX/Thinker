from contextlib import asynccontextmanager
from fastapi import FastAPI

from commons.ThinkerInterface import Thinker

thinker_instances = {}

# instance on demand
# 
# multi-instance?
# 
# 
# user inputs -> thinker instance -> stream

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    thinker_instances["answer_to_everything"] = Thinker()
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()

app = FastAPI()

@app.post("/")
async def query():
    
    instance = thinker_instances.get(id)
    
    return {"message": "Hello World"}
