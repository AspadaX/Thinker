import datetime
import uuid
import asyncio

import chromadb

from .LLMCores import *

"""
[ ] Write down daily events, and then save them into the vector database for future retrieval
[ ] Query the current event, as well as saving the queried event to the vector database
    [ ] Automatically dissect the current events, if multiple events are entered
[ ] Feedback on events' eventual outcomes and records of the suggestions for the previous queried events
"""

# The `MemoryComponent` class is a Python class that represents a memory component, which allows for
# recording, storing, retrieving, and deleting memories based on a given situation.
class MemoryComponent:
    
    def __init__(self, situation: str, thoughts: str) -> None:
        """
        The above function is the initialization method for a class, which sets the initial values for the
        situation and thoughts attributes, and also initializes the database and collection for storing
        data.
        
        :param situation: The "situation" parameter is a string that represents the current situation or
        context in which the code is being executed. It could be any relevant information or description of
        the current state of the program
        :type situation: str
        :param thoughts: The "thoughts" parameter in the `__init__` method is a string that represents the
        initial thoughts or reflections of the object. It is used to store the thoughts or reflections
        related to the situation that the object is in
        :type thoughts: str
        """
        # initiated right away, the attributes of a memory
        self.situation = situation
        self.thoughts = thoughts
        self.historical_events: chromadb.QueryResult = None
        # added later on
        self.selected_recommendation: str = ""
        self.eventual_outcome: str = ""
        
        # initiate the database and the collection
        self.client = chromadb.PersistentClient('resources/VectorDB')
        self.collection = self.client.create_collection(
            name="ThinkerMemory",
            get_or_create=True
        )
    
    async def record_selected_recommendation(self, recommendation: str) -> None:
        """
        The function `record_selected_recommendation` assigns the value of the `recommendation` parameter to
        the `selected_recommendation` attribute of the object.
        
        :param recommendation: The parameter "recommendation" is a string that represents the recommendation
        that is being recorded
        :type recommendation: str
        """
        setattr(self, "selected_recommendation", recommendation)
    
    async def record_eventual_outcome(self, memory_uuid: str, eventual_outcome: str) -> None:
        """
        The function `record_eventual_outcome` sets the `eventual_outcome` attribute and then calls the
        `__edit_memory` method.
        
        :param memory_uuid: A unique identifier for a memory
        :type memory_uuid: str
        :param eventual_outcome: The `eventual_outcome` parameter is a string that represents the eventual
        outcome of an event or process. It is used to update the `eventual_outcome` attribute of the object
        :type eventual_outcome: str
        :return: a coroutine object.
        """
        self.eventual_outcome = eventual_outcome
        
        return await self.__edit_memory(memory_uuid=memory_uuid)
        
    async def store_memory(self) -> None:
        """
        The `store_memory` function adds an event to the memory collection, including the situation,
        timestamp, selected recommendation, and an empty field for eventual outcome.
        """
        # add the event to the memory
        self.collection.add(
            ids=[str(uuid.uuid4())],
            documents=[self.situation],
            metadatas=[
                {
                    "timestamp":str(datetime.datetime.now()), 
                    "selected_recommendation": self.selected_recommendation, 
                    "eventual_outcome": "", # this needs to be handled differently, as the eventual outcome usually won't be recorded along with the other threes
                }
            ]
        )
        logging.info("Memory stored")
    
    async def get_all_memories(self) -> list:
        """
        The function `get_all_memories` returns all the memories from a collection.
        :return: a list of all the memories.
        """
        return self.collection.get()
    
    async def delete_memories(self, ids: list) -> None:
        """
        The function `delete_a_memory` deletes a memory from a collection based on the given list of IDs.
        
        :param ids: A list of memory IDs that need to be deleted
        :type ids: list
        """
        self.collection.delete(
            ids=ids
        )
        logging.info("Memories deleted.")
    
    async def __edit_memory(self, memory_uuid: str) -> None:
        """
        The function edits the eventual outcome of an event in the memory collection.
        
        :param memory_uuid: A unique identifier for the memory that needs to be edited
        :type memory_uuid: str
        """
        # edit the event in the memory
        if self.eventual_outcome:
            self.collection.update(
                ids=[memory_uuid],
                metadatas=[
                    {"eventual_outcome": self.eventual_outcome}
                ]
            )
            logging.info("Eventual outcome is recorded.")
        else:
            logging.info("Eventual outcome is not recorded yet. Edit operation aborted.")
    
    async def __retrieve_memory_organizer(self, event_content: str, metadata: dict) -> str:
        return "event_content: " + event_content + "\n" + "eventual_outcome: " + metadata['eventual_outcome'] + "\n" + "selected_recommendation: " + metadata['selected_recommendation'] + "\n" + "timestamp: " + metadata['timestamp']
    
    async def retrieve_memory(self) -> chromadb.QueryResult:
        """
        The function retrieves the most relevant historical events based on a given situation.
        :return: The function `retrieve_memory` returns a list of historical events.
        """
        # get the most relevant historical events
        historical_events: chromadb.QueryResult = self.collection.query(
            query_texts=[self.situation],
            n_results=10
        )
        logging.info("Historical events retrieved.")
        logging.info(f"Historical events' distances: {historical_events['distances']}")
        logging.info(f"Historical events: {historical_events['documents']}")
        
        # organize the `historical_events`
        tasks = [
            self.__retrieve_memory_organizer(
                event_content, 
                metadata
            ) for event_content, metadata in zip(historical_events['documents'][0], historical_events['metadatas'][0])
        ]
        organized_historical_events: list = await asyncio.gather(*tasks)
        
        return organized_historical_events

class FeedbackComponent:
    
    def __init__(self) -> None:
        pass