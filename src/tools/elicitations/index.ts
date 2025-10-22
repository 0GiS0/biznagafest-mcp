// 📦 Importar las dependencias necesarias
import { z } from "zod"; // 📝 Librería para validación de esquemas
import { searchChannel } from "../../services/youtube"; // 🎬 Servicio de YouTube
import logger from "../../logger"; // 📊 Logger personalizado
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";

// �📋 Esquema de validación para la búsqueda de canales
const searchChannelSchema = {
    query: z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: z.number().min(1).max(50).optional()
} as const;

// 🎯 Herramienta de búsqueda de canales con elicitation - SIN FACTORY
export const searchChannelTool = {
    name: "search_channel",
    description: "Busca canales en YouTube basados en una consulta dada.",
    schema: searchChannelSchema,
    handler: async (args: { query: any; }, extra: RequestHandlerExtra<any, any>) => {

        const { query } = args;

        // Con Elicitations podemos pedir directamente inputs al usuario

        const response = await extra.sendRequest(
            {
                method: "elicitation/create",
                params: {
                    message:
                        "¿Deseas recuperar también los últimos vídeos del canal?",
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
            },
            z.any()
        );

        console.debug("Elicitation response", response);

        const includeVideos = response.content.includeVideos === "si";

        try {
            const results = await searchChannel({ query, includeVideos });
            
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
        } catch (err) {
            const e = err as Error;
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