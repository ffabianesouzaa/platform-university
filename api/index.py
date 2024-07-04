from fastapi import FastAPI
from typing import Union
import sqlite3
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ffabianesouzaa.github.io/"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Consulta para preencher ocupações e termômetro de vagas de acordo com a cidade selecionada
@app.get("/list/campi/ocup/{campi}")
def list_campi_ocup(campi):
    conn = sqlite3.connect('platformdatabase.db')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    
    # Seleciona a cidade e preenche as ocupações que tiveram pelo menos uma vaga ofertada
    rows = db.execute('''
        SELECT Ocupacao FROM Ofertadas WHERE Cidade = ? AND Vaga > 0 
        ORDER BY Ocupacao ASC
    ''', (campi,)).fetchall()
    resultsRows = [row[0] for row in rows]
    
    # Seleciona o total de vagas ocupadas da cidade selecionada (todas as ocupações)
    ocupadas = db.execute('''
        SELECT SUM(Vaga) FROM Ocupadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    # Seleciona o total de vagas não ocupadas da cidade selecionada (todas as ocupações)
    ofertadas = db.execute('''
        SELECT SUM(Vaga) FROM Ofertadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsOfertadas = ofertadas[0][0] # O resultado da primeira linha e coluna
    
    #Seleciona as 5 maiores vagas ofertadas
    topOfertadas = db.execute('''
        SELECT Ocupacao, SUM(Vaga) AS ofert_sum FROM Ofertadas 
        WHERE Cidade = ? AND Ano IN ("2022", "2023")
        GROUP BY Ocupacao ORDER BY ofert_sum DESC LIMIT 5
    ''', (campi,)).fetchall()
    resultsTopOfertadas = topOfertadas
    
    #Seleciona as 5 maiores vagas ocupadas
    topOcupadas = db.execute('''
        SELECT Ocupacao, SUM(Vaga) AS ocup_sum FROM Ocupadas 
        WHERE Cidade = ? AND Ano IN ("2022", "2023")
        GROUP BY Ocupacao ORDER BY ocup_sum DESC LIMIT 5 
    ''', (campi,)).fetchall()
    resultsTopOcupadas = topOcupadas
    
    #Seleciona as 5 maiores vagas não ocupadas
    topNocupadas = db.execute('''
        WITH vagas_totais AS (SELECT O.Ocupacao, SUM(O.Vaga) AS Vagas_Ofertadas,
        COALESCE((SELECT SUM(OC.Vaga)
            FROM Ocupadas OC
            WHERE OC.Ocupacao = O.Ocupacao 
              AND OC.Cidade = O.Cidade 
              AND OC.Ano IN (2022, 2023)
        ), 0) AS Vagas_Ocupadas
        FROM Ofertadas O
        WHERE O.Cidade = ? AND O.Ano IN (2022, 2023)
        GROUP BY O.Ocupacao
        ), diferenca_vagas AS (SELECT Ocupacao, Vagas_Ofertadas - Vagas_Ocupadas AS nocup_sum
        FROM vagas_totais)
        SELECT Ocupacao, nocup_sum 
        FROM diferenca_vagas
        ORDER BY nocup_sum DESC LIMIT 5;
    ''', (campi,)).fetchall()
    resultsTopNocupadas = topNocupadas
    
    conn.commit()
    conn.close()
    
    return { 
        'rows': resultsRows, 
        'ocupadas': resultsOcupadas, 
        'ofertadas': resultsOfertadas, 
        'topOcup': resultsTopOcupadas, 
        'topOfert': resultsTopOfertadas,
        'topNocup': resultsTopNocupadas
    }

# Consulta para preencher termômetro de vagas e skills de acordo com a ocupação selecionada
@app.get("/list/campi/ocup/total/{campi}/{ocupacoes}")
def list_campi_ocup(campi, ocupacoes):
    conn = sqlite3.connect('platformdatabase.db')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    
    # Seleciona o total de vagas ocupadas (todas as ocupações) da cidade e ocupação selecionadas
    ocupadas = db.execute('''
        SELECT SUM(Vaga)
        FROM Ocupadas WHERE Cidade = ? AND Ocupacao = ?
    ''', (campi, ocupacoes,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    # Seleciona o total de vagas não ocupadas (todas as ocupações) da cidade e ocupação selecionadas
    ofertadas = db.execute('''
        SELECT SUM(Vaga)
        FROM Ofertadas WHERE Cidade = ? AND Ocupacao = ?
    ''', (campi, ocupacoes)).fetchall()
    resultsOfertadas = ofertadas[0][0]
    
    # Seleciona as skills da ocupação selecionada
    hard = db.execute('''
        SELECT DISTINCT Skill FROM Skills WHERE Ocupacao = ?
    ''', (ocupacoes,)).fetchall()
    resultsHard = [row[0] for row in hard]
        
    conn.commit()
    conn.close()
    
    return {
        'ocupadas': resultsOcupadas,
        'ofertadas': resultsOfertadas,
        'hard': resultsHard
    }


