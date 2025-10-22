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
                        "Por favor, configura tus preferencias para la búsqueda del canal:",
                    requestedSchema: {
                        type: "object",
                        properties: {
                            language: {
                                type: "string",
                                title: "Idioma del canal",
                                description: "¿En qué idioma prefieres que sea el canal?",
                                enum: ["es", "en", "zh", "fr", "de"],
                                enumNames: [
                                    "💃🏼 Español",
                                    "☕️ Inglés",
                                    "🇨🇳 Chino",
                                    "🥐 Francés",
                                    "🍺 Alemán",
                                ],
                            },
                        },
                        required: ["language"],
                    },
                },
            },
            z.any()
        );

        console.debug("Elicitation response", response);

        const language = response.content.language;

        try {
            const results = await searchChannel({ query, language });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
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