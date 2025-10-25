# 🎉 BiznagaFest 2025 · Demos "IA con salero"

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

¡Hola, developer 👋🏻! Este repositorio contiene las demos que mostré en BiznagaFest 2025 durante la charla "IA con salero: Descubre MCP Servers en Málaga". Con él podrás aprender las características principales de un servidor de este tipo.

---

<div align="center">

![MCP Servers en Málaga](./images/MCP%20servers%20en%20Malaga.png)

</div>

---

## 🎬 Las Demostraciones

Tres demos progresivas que demuestran desde lo básico hasta lo avanzado:

---

### 🟢 1️⃣ **Search Video** — _Herramienta Básica_

> 🎯 La puerta de entrada: aprende lo fundamental de los MCP Servers

Busca videos en YouTube basándote en una consulta simple. Esta es la demo perfecta para entender cómo todo funciona bajo el capó.

| Concepto | Descripción |
|----------|-------------|
| 📁 **Ubicación** | `src/tools/basic/index.ts` |
| 🎓 **Complejidad** | ⭐ Muy sencilla |
| 🔧 **Tecnologías** | YouTube API, Zod, Logger |

**Lo que aprenderás:**
- ✅ Definir una herramienta con esquema de validación
- ✅ Llamar a servicios externos (YouTube API)
- ✅ Manejo robusto de errores
- ✅ Estructura correcta de respuestas MCP

---

### 🟡 2️⃣ **Search Channel** — _Herramienta Interactiva (Elicitations)_

> 💬 Un paso adelante: interacción en tiempo real con el usuario

Una herramienta que busca canales en YouTube y **dialoga con el usuario** mediante elicitations. Pregunta si deseas recuperar los últimos vídeos del canal.

| Concepto | Descripción |
|----------|-------------|
| 📁 **Ubicación** | `src/tools/elicitations/index.ts` |
| 🎓 **Complejidad** | ⭐⭐ Media |
| 🔧 **Tecnologías** | Elicitations, RequestHandlerExtra, Diálogos |

**Lo que aprenderás:**
- ✅ Crear herramientas interactivas bidireccionales
- ✅ Usar elicitations para formularios y diálogos
- ✅ Validación de esquemas más complejos
- ✅ Comunicación cliente-servidor avanzada

---

### 🔴 3️⃣ **Generate Video Title** — _Herramienta Creativa (Sampling)_

> 🚀 La bestia: delega en modelos de IA para máxima potencia

Genera títulos **creativos y únicos** para videos usando **sampling**. El servidor elicita el idioma preferido del usuario y luego el modelo del cliente genera múltiples sugerencias basadas en tu stack de tecnologías.

| Concepto | Descripción |
|----------|-------------|
| 📁 **Ubicación** | `src/tools/sampling/index.ts` |
| 🎓 **Complejidad** | ⭐⭐⭐ Avanzada |
| 🔧 **Tecnologías** | Sampling, CreateMessageResult, Multilingüe |

**Lo que aprenderás:**
- ✅ Delegar generación de contenido al modelo del cliente
- ✅ Elicitations con selectores (enums) bonitos
- ✅ Generar múltiples variantes creativas
- ✅ Construir herramientas verdaderamente inteligentes

---

---

## 📺 Vídeos Recomendados

¿Quieres profundizar en las tecnologías que usamos en este repo? Aquí tienes una selección de vídeos de YouTube que te ayudarán a dominar el stack tecnológico:

### 🎯 Model Context Protocol (MCP)

| Vídeo | Canal | Descripción |
|-------|-------|-------------|
| [Getting Started with Cloudflare MCP Server](https://www.youtube.com/watch?v=vGajZpl_9yA) | Cloudflare Developers | Introducción práctica para lanzar un servidor MCP y conectarlo con Claude de Anthropic |
| [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | Anthropic Academy | Curso completo (+1h) sobre arquitectura MCP, construcción de servidores con Python SDK, y debugging |

### 💻 TypeScript & Node.js

| Vídeo | Canal | Descripción |
|-------|-------|-------------|
| [TypeScript - Curso COMPLETO desde 0](https://www.youtube.com/watch?v=sBgcHD1JsL4) | YouTube | Curso extenso en español: instalación, POO, genéricos, testing con Jest |
| [Tutorial TypeScript con Node.js y Express](https://www.youtube.com/watch?v=ZpY5KdGQvwI) | YouTube | Crea tu API REST con tipos estáticos - enfoque práctico y profesional |
| [Curso Avanzado de NodeJS y TypeScript](https://www.youtube.com/playlist?list=PLHYqV_0PS9KMqSHZTVT0NTFJDACC0AWCb) | YouTube | Playlist completa para desarrollar APIs avanzadas con arquitectura robusta |

### 🎬 YouTube Data API v3

| Vídeo | Canal | Descripción |
|-------|-------|-------------|
| [Node.js Quickstart - YouTube Data API](https://developers.google.com/youtube/v3/quickstart/nodejs) | Google Developers | Guía oficial de Google para empezar con la API de YouTube en Node.js |
| [Retrieve Videos from YouTube Data API](https://blog.tericcabrel.com/retrieve-videos-youtube-data-api-v3-nodejs/) | Tech Blog | Tutorial paso a paso para obtener vídeos con Node.js y TypeScript |

---

## 💝 ¿Te gustó la charla?

Si disfrutaste con las demos y quieres más contenido sobre MCP Servers, desarrollo y tecnología con salero:

<div align="center">

🎥 **[Suscríbete a mi canal](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)** para nuevas demos y tutoriales

📧 **Sígueme en redes** para estar al día:
[YouTube](https://www.youtube.com/c/GiselaTorres) · [GitHub](https://github.com/0GiS0) · [LinkedIn](https://www.linkedin.com/in/giselatorresbuitrago/) · [X](https://twitter.com/0GiS0)

---

**Gisela Torres Buitrago** · BiznagaFest 2025 · ¡Nos vemos en la próxima! 🚀

</div>