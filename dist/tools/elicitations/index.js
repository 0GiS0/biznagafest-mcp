"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchChannelTool = void 0;
// 📦 Importar las dependencias necesarias
const zod_1 = require("zod"); // 📝 Librería para validación de esquemas
const youtube_1 = require("../../services/youtube"); // 🎬 Servicio de YouTube
// �📋 Esquema de validación para la búsqueda de canales
const searchChannelSchema = {
    query: zod_1.z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: zod_1.z.number().min(1).max(50).optional()
};
// 🎯 Herramienta de búsqueda de canales con elicitation - SIN FACTORY
exports.searchChannelTool = {
    name: "search_channel",
    description: "Busca canales en YouTube basados en una consulta dada.",
    schema: searchChannelSchema,
    handler: async (args, extra) => {
        const { query } = args;
        // Con Elicitations podemos pedir directamente inputs al usuario
        const response = await extra.sendRequest({
            method: "elicitation/create",
            params: {
                message: "¿Deseas recuperar también los últimos vídeos del canal?",
                requestedSchema: {
                    type: "object",
                    properties: {
                        includeVideos: {
                            type: "string",
                            title: "Incluir vídeos",
                            description: "¿Deseas recuperar también los últimos vídeos del canal?",
                            enum: ["si", "no"],
                            enumNames: [
                                "✅ Sí, incluir vídeos",
                                "❌ No, solo información del canal",
                            ],
                        },
                    },
                    required: ["includeVideos"],
                },
            },
        }, zod_1.z.any());
        console.debug("Elicitation response", response);
        const includeVideos = response.content.includeVideos === "si";
        try {
            const results = await (0, youtube_1.searchChannel)({ query, includeVideos });
            let responseText = JSON.stringify(results, null, 2);
            if (includeVideos) {
                responseText += "\n\n📹 Nota: Se incluirán los últimos vídeos del canal en la búsqueda completa.";
            }
            return {
                content: [
                    {
                        type: "text",
                        text: responseText,
                    },
                ],
            };
        }
        catch (err) {
            const e = err;
            return {
                content: [
                    {
                        type: "text",
                        text: `Error consultando YouTube: ${e.message}`,
                    },
                ],
                isError: true,
            };
        }
    }
};
//# sourceMappingURL=index.js.map