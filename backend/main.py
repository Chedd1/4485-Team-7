import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlmodel import SQLModel, Session, create_engine, Field, select

# SQLModel database object representing a fruit
# A SQLModel object essentially links database objects to object classes in the code
class dbFruit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    name: str

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

# Set up database
DATABASE_URL = "postgresql://neondb_owner:PASS@ep-dawn-rice-aafg5mw4-pooler.westus3.azure.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL, connect_args={})
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# GET endpoint that calls read_fruits(), executnig a GET query on the database
# FastAPI automatically converts the returned python object into JSON
@app.get("/fruits", response_model=list[dbFruit])
def read_fruits(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    # Database query- it gets the dbFruit table
    # Note: using dbFruit.name would get the name along with id (because id is the primary key)
    statement = select(dbFruit)
    
    # This is how to use the offset and limit options:
    # statement = select(dbFruit).offset(skip).limit(limit)

    # Executes the query
    fruits = session.exec(statement).all()
    return fruits

# POST endpoint that adds a fruit to the database table
# FastAPI verifies the parameter is of the right type
@app.post("/fruits")
def add_fruit(fruit: dbFruit, session: Session = Depends(get_session)):
    session.add(fruit)
    session.commit()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)