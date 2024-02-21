SELECT Ofertadas.Cidade, Ocupação.Ocupação
FROM Ocupação
INNER JOIN Ofertadas
ON Ofertadas.CodCBO=Ocupadas.CodCBO;