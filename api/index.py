from fastapi import FastAPI
import sqlite3
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ocupacoes")
def list_ocup():
    # Creating a database connection
    connection = sqlite3.connect('../db/dbthesis.db')

    # Creating a cursor
    cursor = connection.cursor()
    cursor.execute("pragma enconding=UTF8")
    cursor.execute("SELECT Ocupação FROM Ocupacoes")
    data = cursor.fetchall()
    cursor.close()
    connection.close()
    return json.dumps(data)
