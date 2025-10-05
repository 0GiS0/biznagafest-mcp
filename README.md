# 🎉 BiznagaFest 2025 · Demos "IA con salero"

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

¡Hola, developer 👋🏻! Este repositorio reúne las demos que presenté en BiznagaFest 2025 durante la charla “IA con salero: Descubre MCP Servers en Málaga”. Aquí encontrarás material complementario, pasos para reproducirlas y enlaces para seguir profundizando.

> "La magia ocurre cuando conectamos un LLM con el mundo real de forma segura."

## 🧭 Tabla de contenidos
- [¿Por qué este repo?](#-por-qué-este-repo)
- [¿Qué es Model Context Protocol (MCP)?](#-qué-es-model-context-protocol-mcp)
- [¿Cómo funciona MCP en la demo?](#-cómo-funciona-mcp-en-la-demo)
- [🚀 Guía rápida para reproducir la demo](#-guía-rápida-para-reproducir-la-demo)
- [🗂️ Estructura del repositorio](#-estructura-del-repositorio)
- [📚 Recursos extra](#-recursos-extra)
- [🙌 Gracias](#-gracias)


## 🤖 ¿Qué es Model Context Protocol (MCP)?
Model Context Protocol (MCP) es un estándar impulsado por Anthropic para conectar modelos de lenguaje con datos y servicios externos de manera controlada. Permite:

- 🔐 Definir permisos y límites claros entre el modelo y el recurso externo.
- 🔌 Exponer capacidades a través de servidores MCP reutilizables.
- 🚀 Extender el alcance de un LLM sin renunciar a la seguridad ni al seguimiento.

La documentación oficial lo describe como “un puente seguro entre la inteligencia del modelo y la información del mundo real”.

## 🔄 ¿Cómo funciona MCP en la demo?
En nuestras demos intervienen dos piezas clave:

1. **Cliente MCP**: el punto de entrada que utiliza el LLM (por ejemplo, desde VS Code) para lanzar peticiones.
2. **Servidor MCP**: recibe la petición, la procesa y devuelve datos enriquecidos al modelo.

Para BiznagaFest creé un servidor MCP que consulta la agenda del evento. La idea es que, según el repositorio que tengas abierto, el servidor te recomiende qué charlas encajan mejor con tus intereses técnicos.

Como paso previo reutilizamos el MCP Server de **Playwright** (disponible en el Marketplace de VS Code) para automatizar la extracción de la agenda y convertirla en JSON.

## 🚀 Guía rápida para reproducir la demo
1. 🧰 **Prepara tus herramientas**  
	- Visual Studio Code
	- Extensión “Playwright MCP Server” desde el Marketplace.
2. 📦 **Clona este repositorio**  
	```bash
	git clone https://github.com/0gis0/biznagafest-mcp.git
	cd biznagafest-mcp
	```
	Ajusta la URL al origen que utilices (fork o repositorio principal).

3. 🕸️ **Pide la agenda del evento**  
	Lanza el siguiente prompt desde tu cliente MCP:
	```
	Navega a https://www.biznagafest.com/#schedule y devuelve la agenda en JSON con estos campos: título, ponente, hora de inicio, hora de fin y descripción. Almacena el resultado en un archivo llamado `data/agenda.json`.
	```
4. 🧠 **Vectoriza la agenda**  
	Para este ejemplo usé [Pinecone](https://www.pinecone.io/) como base de datos vectorial.
	```

> 💡 Consejo: guarda el JSON en tu workspace (`data/agenda.json`) para reutilizarlo mientras estés offline.


