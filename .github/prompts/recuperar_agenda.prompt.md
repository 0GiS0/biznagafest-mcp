---
mode: agent
model: Claude Haiku 4.5 (copilot)
tools: ['microsoft/playwright-mcp/browser_click', 'microsoft/playwright-mcp/browser_navigate', 'microsoft/playwright-mcp/browser_select_option', 'microsoft/playwright-mcp/browser_wait_for']
---
Navega a https://www.biznagafest.com/ y busca la agenda en JSON con estos campos: título, ponente, hora de inicio, hora de fin y descripción. Almacena el resultado en un archivo llamado `data/agenda_biznagafest.json`