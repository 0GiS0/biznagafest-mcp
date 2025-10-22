// 📦 Importar las dependencias necesarias
import { z } from "zod"; // 📝 Librería para validación de esquemas
import type { tool } from "./types"; // 🛠️ Tipo personalizado para definir herramientas
import { searchVideos } from "../services/youtube"; // 🎬 Servicio de YouTube

// 📋 Esquema de validación para la búsqueda de videos
const searchVideoSchema = {
    query: z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: z.number().min(1).max(50).optional()
} as const;

const search_video_tool: tool<typeof searchVideoSchema> = {
    name: "search_video",
    description: "Busca videos en YouTube basados en una consulta dada.",
    schema: searchVideoSchema,
    handler: async (input) => {
        const { query, maxResults = 5 } = input;

        try {
            // Usar el servicio de YouTube para buscar videos
            const results = await searchVideos(query, maxResults);

            const resultText = results.length > 0
                ? results.map((r: any) => `- ${r.title} (${r.url})`).join('\n')
                : "No se encontraron videos";

            return {
                content: [
                    {
                        type: "text" as const,
                        text: resultText
                    }
                ]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Error al buscar videos en YouTube: ${errorMessage}`
                    }
                ]
            };
        }
    }
};

// 📚 Exportar todas las herramientas disponibles
export const tools = [
    search_video_tool,
];