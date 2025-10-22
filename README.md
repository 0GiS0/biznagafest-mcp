# 🎉 BiznagaFest 2025 · Demos "IA con salero"

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

¡Hola, developer 👋🏻! Este repositorio contiene un **Servidor MCP para YouTube** que demostraré en BiznagaFest 2025 durante la charla "IA con salero: Descubre MCP Servers en Málaga". Con él podrás buscar videos y canales de YouTube directamente desde GitHub Copilot, sin salir del editor.

> "La magia ocurre cuando conectamos un LLM con YouTube de forma segura y directa desde el editor."

## 🧭 Tabla de contenidos
- [✨ ¿Qué vamos a demostrar?](#-qué-vamos-a-demostrar)
- [¿Qué es Model Context Protocol (MCP)?](#-qué-es-model-context-protocol-mcp)
- [🔄 Arquitectura de la demo](#-arquitectura-de-la-demo)
- [🚀 Guía rápida para reproducir](#-guía-rápida-para-reproducir)
- [🗂️ Estructura del repositorio](#-estructura-del-repositorio)
- [📚 Recursos extra](#-recursos-extra)
- [🙌 Gracias](#-gracias)

## ✨ ¿Qué vamos a demostrar?

En BiznagaFest 2025 mostraremos **tres demostraciones prácticas**:

### 1️⃣ **Búsqueda de Videos de YouTube**
Desde Copilot, solicitaremos "Busca videos sobre MCP" y veremos cómo el servidor consulta la API de YouTube en tiempo real y devuelve resultados enriquecidos.

### 2️⃣ **Búsqueda de Canales con Elicitación**
Demostraremos la capacidad del MCP de hacer **preguntas interactivas**. Cuando busques un canal (ej: "returngis"), el servidor preguntará por tu preferencia de idioma antes de devolver resultados.

### 3️⃣ **Prompts Inteligentes con Auto-completado**
Usaremos un prompt avanzado que sugiere automáticamente parámetros (query, idioma, ordenamiento, etc.) para que Copilot complete búsquedas de forma más inteligente.


## 🤖 ¿Qué es Model Context Protocol (MCP)?
Model Context Protocol (MCP) es un estándar impulsado por Anthropic para conectar modelos de lenguaje con datos y servicios externos de manera controlada. Permite:

- 🔐 Definir permisos y límites claros entre el modelo y el recurso externo.
- 🔌 Exponer capacidades a través de servidores MCP reutilizables.
- 🚀 Extender el alcance de un LLM sin renunciar a la seguridad ni al seguimiento.

La documentación oficial lo describe como "un puente seguro entre la inteligencia del modelo y la información del mundo real".

## 🔄 Arquitectura de la demo
En esta demo intervienen tres componentes clave:

1. **GitHub Copilot** (Cliente): tu asistente en VS Code que invoca las herramientas.
2. **Servidor MCP** (Este repositorio): expone herramientas de búsqueda de YouTube mediante HTTP streaming.
3. **YouTube API**: fuente de datos en tiempo real que el servidor consulta.

**Flujo de la interacción:**
```
Usuario en VS Code pide: "Busca videos sobre MCP"
        ↓
GitHub Copilot invoca la herramienta search_video
        ↓
Servidor MCP recibe la solicitud via HTTP POST en puerto 3001
        ↓
Servidor consulta YouTube API con la query
        ↓
Devuelve resultados como { videoId, title, description, url }
        ↓
Copilot presenta los resultados al usuario
```

## 🔄 ¿Cómo funciona MCP en la demo?
En nuestras demos intervienen dos piezas clave:

1. **Cliente MCP**: el punto de entrada que utiliza el LLM (por ejemplo, desde VS Code) para lanzar peticiones.
2. **Servidor MCP**: recibe la petición, la procesa y devuelve datos enriquecidos al modelo.

Para BiznagaFest creé un servidor MCP que consulta la agenda del evento. La idea es que, según el repositorio que tengas abierto, el servidor te recomiende qué charlas encajan mejor con tus intereses técnicos.

Como paso previo reutilizamos el MCP Server de **Playwright** (disponible en el Marketplace de VS Code) para automatizar la extracción de la agenda y convertirla en JSON.

## 🚀 Guía rápida para reproducir

### Requisitos previos
- **Node.js** 18+
- **Visual Studio Code** (última versión)
- **GitHub Copilot** activado
- **Google YouTube API Key** (crea una en [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### Pasos para reproducir la demo

#### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/0gis0/biznagafest-mcp.git
cd biznagafest-mcp
```

#### 2️⃣ Instala las dependencias
```bash
npm install
```

#### 3️⃣ Configura tus credenciales
Crea un archivo `.env` con tu clave de YouTube API:
```bash
cp .env-sample .env
# Abre .env y añade tu YOUTUBE_API_KEY
```

#### 4️⃣ Compila y ejecuta el servidor
```bash
npm run build    # Compila TypeScript → dist/
npm start        # Inicia servidor en puerto 3001
```

#### 5️⃣ Configura VS Code para usar el servidor MCP
El archivo `.vscode/mcp.json` ya está configurado para apuntar a `http://localhost:3001/mcp`. Si cambias el puerto, actualiza este archivo.

#### 6️⃣ ¡Abre Copilot y prueba!
Desde VS Code (⌘⇧I o Ctrl+Shift+I):
- **Demo 1**: "Busca videos sobre MCP en YouTube"
- **Demo 2**: "Busca el canal de returngis"
- **Demo 3**: "Usa el prompt de búsqueda avanzada de YouTube"

### Testing manual con curl
Para probar el servidor sin Copilot:

**Buscar videos:**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_video","arguments":{"query":"MCP"}}}'
```

**Buscar canales (con elicitación):**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_channel","arguments":{"query":"returngis"}}}'
```
	```

> 💡 Consejo: guarda el JSON en tu workspace (`data/agenda.json`) para reutilizarlo mientras estés offline.


