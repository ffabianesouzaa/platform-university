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
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    
    rows = db.execute('''
        SELECT Ocupação FROM Ocupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0)
        UNION SELECT Ocupação FROM NaoOcupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0) 
    ''', (campi, campi,)).fetchall()
    resultsRows = [row[0] for row in rows]
    
    ocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022) FROM Ocupadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    nocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022) FROM NaoOcupadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsNocupadas = nocupadas[0][0]
    
    conn.commit()
    conn.close()
    
    return { 'rows': resultsRows, 'ocupadas': resultsOcupadas, 'nocupadas': resultsNocupadas }

@app.get("/list/campi/ocup/total/{campi}/{ocupacoes}")
def list_campi_ocup(campi, ocupacoes):
    conn = sqlite3.connect('../db/dbthesis.db')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
       
    ocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022) FROM Ocupadas WHERE Cidade = ? AND Ocupação = ?
    ''', (campi, ocupacoes,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    nocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022) FROM NaoOcupadas WHERE Cidade = ? AND Ocupação = ?
    ''', (campi, ocupacoes)).fetchall()
    resultsNocupadas = nocupadas[0][0]
    
    conn.commit()
    conn.close()
    
    return { 'ocupadas': resultsOcupadas, 'nocupadas': resultsNocupadas }