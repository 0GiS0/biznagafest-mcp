// 📦 Importar las dependencias necesarias
import { z } from "zod"; // 📝 Librería para validación de esquemas
import type { toolFactory } from "../types"; // 🛠️ Tipo personalizado para definir herramientas
import { searchVideos } from "../../services/youtube"; // 🎬 Servicio de YouTube
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../../logger";

// 📋 Esquema de validación para la búsqueda de videos
const searchVideoSchema = {
    query: z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: z.number().min(1).max(50).optional()
} as const;

// 🏭 Factory para crear la herramienta con acceso al servidor
export const createSearchVideoTool: toolFactory<typeof searchVideoSchema> = (
    server: McpServer
) => ({
    name: "search_video",
    description: "Busca videos en YouTube basados en una consulta dada.",
    schema: searchVideoSchema,
    handler: async (input) => {
        logger.trace('🎬 INICIO: Handler de search_video invocado');
        logger.debug('📋 Parámetros recibidos:', { input });
        
        const { query, maxResults = 5 } = input;
        logger.info(`🔍 Buscando videos con query="${query}" y maxResults=${maxResults}`);

        try {
            // Usar el servicio de YouTube para buscar videos
            logger.trace('📡 Llamando a searchVideos...');
            const results = await searchVideos(query, maxResults);
            logger.info(`✅ ${results.length} resultados encontrados`);

            if (results.length > 0) {
                logger.debug('📊 Resultados:', results.map(r => ({ title: r.title, url: r.url })));
            }

            const resultText = results.length > 0
                ? results.map((r: any) => `- ${r.title} (${r.url})`).join('\n')
                : "No se encontraron videos";

            logger.trace('✅ Respuesta construida exitosamente');
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
            logger.error('❌ Error en search_video handler', {
                error: errorMessage,
                stack: error instanceof Error ? error.stack : undefined,
                query,
                maxResults
            });
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Error al buscar videos en YouTube: ${errorMessage}`
                    }
                ],
                isError: true
            };
        }
    }
});