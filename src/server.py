from re import I
from fastapi import FastAPI
import pandas as pd
import json


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    info = pd.read_csv("../data/"+str(item_id)+'.csv').iloc[:, 1:]
    
    return {"item_id": item_id,"data":json.loads(info.to_json())}

@app.get("/items/")
async def read_item():
    temp_list = []
    for i in range(0, 9):
        info = pd.read_csv("../data/"+str(i)+'.csv').iloc[:, 1:]
        temp_list.append(json.loads(info.to_json()))
    return temp_list
