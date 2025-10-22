// 🎬 Servicio de YouTube API
import * as dotenv from "dotenv";
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
import { google } from "googleapis"; // 🎥 Cliente oficial de APIs de Google
import logger from "../logger";

// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY, // 🔑 API Key obtenida de las variables de entorno
});

/**
 * 🔍 Busca videos en YouTube
 * @param query - Término de búsqueda
 * @param maxResults - Número máximo de resultados (1-50, por defecto 5)
 * @returns Array de videos encontrados
 */
export async function searchVideos(query: string, maxResults: number = 5) {
    logger.info(`🔍 Iniciando búsqueda de videos en YouTube para la consulta: "${query}" con un máximo de ${maxResults} resultados.`);

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

        logger.info(`✅ Se encontraron ${results.length} videos`);
        return results;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`❌ Error al buscar videos en YouTube: ${errorMessage}`);
        throw error;
    }
}
