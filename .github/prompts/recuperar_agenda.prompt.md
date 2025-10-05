---
mode: agent
name: Recuperar agenda BiznagaFest
model: GPT-4.1 (copilot)
tools: ['browser_navigate']
---
Navega a https://www.biznagafest.com/#schedule y devuelve la agenda en JSON con estos campos: título, ponente, hora de inicio, hora de fin y descripción. Almacena el resultado en un archivo llamado `data/agenda_biznagafest.json`