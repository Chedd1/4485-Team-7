import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class Fruit(BaseModel):
    name: str

class Fruits(BaseModel):
    fruits: List[Fruit]

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

# Temporary in-memory database
memory_db = { "fruits": [] }

# GET endpoint that calls get_fruits(), returning all the fruits stored in memory_db
# FastAPI automatically converts the python object into JSON
@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

# POST endpoint that adds a fruit to the memory_db list
# FastAPI verifies the parameter is of the right type
@app.post("/fruits")
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)