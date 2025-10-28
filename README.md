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

## 📺 Vídeos Sugeridos

¿Quieres profundizar en las tecnologías que usamos en este repo? Aquí tienes algunos vídeos que te van a molar un montón:

### 🎯 Model Context Protocol (MCP)

**Introducción a MCP Servers**
- 🎬 [Model Context Protocol Explained - Anthropic](https://www.youtube.com/watch?v=8EbpbJ_hZKA)
- 📝 Tutorial completo sobre qué es MCP y cómo funciona
- ⏱️ Ideal para empezar desde cero

**Building MCP Servers**
- 🎬 [Creating Your First MCP Server](https://www.youtube.com/watch?v=d_W1xVV4gvQ)
- 📝 Guía práctica para crear tu propio servidor MCP
- ⏱️ Perfecto para seguir después de estas demos

### 💻 TypeScript

**TypeScript para Principiantes**
- 🎬 [TypeScript Crash Course en Español](https://www.youtube.com/watch?v=fUgxxhI_bvc)
- 📝 Todo lo que necesitas saber sobre TypeScript
- ⏱️ Fundamental si vienes de JavaScript

**TypeScript Avanzado**
- 🎬 [TypeScript Advanced Types](https://www.youtube.com/watch?v=nNse0r0aRT8)
- 📝 Tipos avanzados, genéricos y utilidades
- ⏱️ Para llevar tu código al siguiente nivel

### 🎥 YouTube API

**Trabajando con YouTube Data API**
- 🎬 [YouTube Data API v3 Tutorial](https://www.youtube.com/watch?v=RjUlmco7v2M)
- 📝 Cómo usar la API de YouTube en tus proyectos
- ⏱️ Igual que la que usamos en este repo

**Node.js + YouTube API**
- 🎬 [Building with Google APIs in Node.js](https://www.youtube.com/watch?v=e-WgJ9fRIOA)
- 📝 Integración de APIs de Google con Node.js
- ⏱️ Perfecto para entender googleapis package

### 🤖 IA y Desarrollo

**Anthropic Claude**
- 🎬 [Claude AI - Getting Started](https://www.youtube.com/watch?v=lL3uGaJy3cU)
- 📝 Introducción a Claude y sus capacidades
- ⏱️ El motor detrás de MCP

**AI Tools para Developers**
- 🎬 [AI-Powered Development Tools](https://www.youtube.com/watch?v=1j3vO2pRLzA)
- 📝 Herramientas de IA que revolucionan el desarrollo
- ⏱️ Para estar al día con las últimas tendencias

---

> 💡 **Consejo:** Dale a estos vídeos mientras practicas con el código del repo. ¡Aprenderás el doble de rápido, tío! 🚀

---

## 💝 ¿Te gustó la charla?

Si disfrutaste con las demos y quieres más contenido sobre MCP Servers, desarrollo y tecnología con salero:

<div align="center">

🎥 **[Suscríbete a mi canal](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)** para nuevas demos y tutoriales

📧 **Sígueme en redes** para estar al día:
[YouTube](https://www.youtube.com/c/GiselaTorres) · [GitHub](https://github.com/0GiS0) · [LinkedIn](https://www.linkedin.com/in/giselatorresbuitrago/) · [X](https://twitter.com/0GiS0)

---

**Gisela Torres** · BiznagaFest 2025 · ¡Nos vemos en la próxima! 🚀

</div>
