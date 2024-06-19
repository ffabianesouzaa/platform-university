from fastapi import FastAPI
import sqlite3
import json
from fastapi.middleware.cors import CORSMiddleware

# Verificar questões de segurança
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Consulta para preencher ocupações e termômetro de vagas de acordo com a cidade selecionada
@app.get("/list/campi/ocup/{campi}")
def list_campi_ocup(campi):
    conn = sqlite3.connect('../db/dbthesis.db')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    
    # Seleciona a cidade e preenche as ocupações que tiveram pelo menos uma vaga ofertada
    rows = db.execute('''
        SELECT Ocupação FROM Ocupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0 OR Março2022 > 0 OR Abril2022 > 0 OR Maio2022 > 0 OR Junho2022 > 0 OR Julho2022 > 0 OR Agosto2022 > 0 OR Setembro2022 > 0 OR Outubro2022 > 0 OR Novembro2022 > 0 OR Dezembro2022 > 0)
        UNION SELECT Ocupação FROM NaoOcupadas WHERE Cidade = ? AND (Janeiro2022 > 0 OR Fevereiro2022 > 0 OR Março2022 > 0 OR Abril2022 > 0 OR Maio2022 > 0 OR Junho2022 > 0 OR Julho2022 > 0 OR Agosto2022 > 0 OR Setembro2022 > 0 OR Outubro2022 > 0 OR Novembro2022 > 0 OR Dezembro2022 > 0) 
    ''', (campi, campi,)).fetchall()
    resultsRows = [row[0] for row in rows]
    
    # Seleciona o total de vagas ocupadas (todas as ocupações) da cidade selecionada
    ocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) FROM Ocupadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    # Seleciona o total de vagas não ocupadas (todas as ocupações) da cidade selecionada
    nocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) FROM NaoOcupadas WHERE Cidade = ? 
    ''', (campi,)).fetchall()
    resultsNocupadas = nocupadas[0][0] #O resultado da primeira linha e coluna
    
    #Seleciona as 5 maiores vagas ocupadas
    topOcupadas = db.execute('''
        SELECT Ocupação, (Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) AS ocup_sum FROM Ocupadas WHERE Cidade = ?
        ORDER BY ocup_sum DESC LIMIT 5 
    ''', (campi,)).fetchall()
    resultsTopocupadas = topOcupadas
    
    #Seleciona as 5 maiores vagas não ocupadas
    topNocupadas = db.execute('''
        SELECT Ocupação, (Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) AS ocup_sum FROM NaoOcupadas WHERE Cidade = ?
        ORDER BY ocup_sum DESC LIMIT 5 
    ''', (campi,)).fetchall()
    resultsTopNocupadas = topNocupadas
    
    conn.commit()
    conn.close()
    
    return { 
        'rows': resultsRows, 
        'ocupadas': resultsOcupadas, 
        'nocupadas': resultsNocupadas, 
        'topOcup': resultsTopocupadas, 
        'topNocup': resultsTopNocupadas
    }

# Consulta para preencher termômetro de vagas e skills de acordo com a ocupação selecionada
@app.get("/list/campi/ocup/total/{campi}/{ocupacoes}")
def list_campi_ocup(campi, ocupacoes):
    conn = sqlite3.connect('../db/dbthesis.db')
    conn.row_factory = sqlite3.Row
    db = conn.cursor()
    
    # Seleciona o total de vagas ocupadas (todas as ocupações) da cidade e ocupação selecionadas
    ocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) FROM Ocupadas WHERE Cidade = ? AND Ocupação = ?
    ''', (campi, ocupacoes,)).fetchall()
    resultsOcupadas = ocupadas[0][0]
    
    # Seleciona o total de vagas não ocupadas (todas as ocupações) da cidade e ocupação selecionadas
    nocupadas = db.execute('''
        SELECT SUM(Janeiro2022 + Fevereiro2022 + Março2022 + Abril2022 + Junho2022 + Julho2022 + Agosto2022 + Setembro2022 + Outubro2022 + Novembro2022 + Dezembro2022) FROM NaoOcupadas WHERE Cidade = ? AND Ocupação = ?
    ''', (campi, ocupacoes)).fetchall()
    resultsNocupadas = nocupadas[0][0]
    
    # Seleciona as skills da ocupação selecionada
    hard = db.execute('''
        SELECT DISTINCT DesHabilidade FROM Hard WHERE Ocupação = ?
    ''', (ocupacoes,)).fetchall()
    resultsHard = [row[0] for row in hard]
        
    conn.commit()
    conn.close()
    
    return { 'ocupadas': resultsOcupadas, 'nocupadas': resultsNocupadas, 'hard': resultsHard }


