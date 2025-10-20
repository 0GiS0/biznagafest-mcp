// 📦 Importar las dependencias necesarias
import * as dotenv from "dotenv";
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
import { google } from "googleapis"; // 🎥 Cliente oficial de APIs de Google
import { z } from "zod"; // 📝 Librería para validación de esquemas
import type { tool } from "./types"; // 🛠️ Tipo personalizado para definir herramientas

// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY, // 🔑 API Key obtenida de las variables de entorno
});

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
            // Realizar la búsqueda en YouTube
            const response = await youtube.search.list({
                part: ["snippet"],
                q: query,
                maxResults: maxResults,
                type: ["video"]
            } as any);

            // Formatear los resultados para devolver solo la información relevante
            const results = response.data.items?.map((item: any) => ({
                videoId: item.id?.videoId,
                title: item.snippet?.title,
                description: item.snippet?.description,
                url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
            })) || [];

            const resultText = results.length > 0
                ? results.map(r => `- ${r.title} (${r.url})`).join('\n')
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