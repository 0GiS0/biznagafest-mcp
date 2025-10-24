// 📦 Importar las dependencias necesarias
import { z } from "zod"; // 📝 Librería para validación de esquemas
import { searchVideos } from "../../services/youtube"; // 🎬 Servicio de YouTube
import logger from "../../logger";

// 📋 Esquema de validación para la búsqueda de videos
const searchVideoSchema = {
    query: z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: z.number().min(1).max(50).optional()
} as const;

// � Herramienta de búsqueda de videos - SIN FACTORY
export const searchVideoTool = {
    name: "search_video",
    description: "Busca videos en YouTube basados en una consulta dada.",
    schema: searchVideoSchema,
    handler: async (args: { query: any; maxResults?: number }) => {
        logger.trace('🎬 INICIO: Handler de search_video invocado');
        logger.debug('📋 Parámetros recibidos:', { args });
        
        const { query, maxResults = 5 } = args;
        logger.info(`🔍 Buscando videos con query="${query}" y maxResults=${maxResults}`);

        try {
            // Usar el servicio de YouTube para buscar videos
            logger.trace('📡 Llamando a searchVideos...');
            const results = await searchVideos(query, maxResults);
            logger.info(`✅ ${results.length} resultados encontrados`);

            if (results.length > 0) {
                logger.debug('📊 Resultados:', results.map(r => ({ title: r.title, channel: r.channel, url: r.url })));
            }

            const resultText = results.length > 0
                ? results.map((r: any) => {
                    const channelInfo = r.channel ? `\nCanal: ${r.channel}` : '';
                    const descriptionInfo = r.description ? `\nDescripción: ${r.description}` : '';
                    return `Título: ${r.title}${channelInfo}\nURL: ${r.url}${descriptionInfo}`;
                }).join('\n---\n')
                : "No se encontraron videos";

            logger.trace('✅ Respuesta construida exitosamente');
            return {
                content: [
                    {
                        type: "text",
                        text: resultText
                    }
                ]
            };
        } catch (error) {
            const e = error as Error;
            logger.error('❌ Error en search_video handler', {
                error: e.message,
                stack: e.stack,
                query,
                maxResults
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error consultando YouTube: ${e.message}`
                    }
                ],
                isError: true
            };
        }
    }
};