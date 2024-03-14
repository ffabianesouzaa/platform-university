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

@app.get("/list/campi/ocup/{campi}")
def list_campi_ocup(campi):
    conn = sqlite3.connect('../db/dbthesis.db')
    conn.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute('''
        SELECT Ocupação FROM Ocupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0)
        UNION SELECT Ocupação FROM NaoOcupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0) 
    ''', (campi, campi,)).fetchall()
    
    conn.commit()
    conn.close()
    
    # return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON
    return rows