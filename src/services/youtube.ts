// 🎬 Servicio de YouTube API
import * as dotenv from "dotenv";
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
import { google } from "googleapis"; // 🎥 Cliente oficial de APIs de Google
import logger from "../logger";
import { channel } from "diagnostics_channel";

// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
    logger.fatal('❌ YOUTUBE_API_KEY no está configurada en las variables de entorno');
} else {
    logger.info(`✅ YOUTUBE_API_KEY cargada correctamente (primeros 10 chars: ${apiKey.substring(0, 10)}...)`);
}

const youtube = google.youtube({
    version: "v3",
    auth: apiKey, // 🔑 API Key obtenida de las variables de entorno
});

/**
 * 🔍 Busca videos en YouTube
 * @param query - Término de búsqueda
 * @param maxResults - Número máximo de resultados (1-50, por defecto 5)
 * @returns Array de videos encontrados
 */
export async function searchVideos(query: string, maxResults: number = 5) {
    logger.trace('🎬 INICIO: searchVideos invocada');
    logger.info(`🔍 Búsqueda de videos en YouTube`);
    logger.debug(`   Query: "${query}"`);
    logger.debug(`   Max Results: ${maxResults}`);

    try {
        // Validar parámetros
        if (!query || query.trim().length === 0) {
            logger.warn('⚠️ Query vacía o indefinida');
            return [];
        }

        logger.trace('📡 Llamando a youtube.search.list()...');

        // Realizar la búsqueda en YouTube
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            maxResults: maxResults,
            type: ["video"]
        } as any);

        logger.trace(`✅ Respuesta recibida de YouTube API`);
        logger.debug(`   Items en respuesta: ${response.data.items?.length || 0}`);

        // Formatear los resultados para devolver solo la información relevante
        const results = response.data.items?.map((item: any) => ({
            videoId: item.id?.videoId,
            title: item.snippet?.title,
            channel: item.snippet?.channelTitle,
            description: item.snippet?.description,
            url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
        })) || [];

        logger.info(`✅ Búsqueda completada: ${results.length} videos encontrados`);
        logger.debug('📊 Títulos de videos:', results.map(r => r.title));

        logger.warn('📋 Resultados completos:', results);

        return results;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'sin stack trace';
        logger.error(`❌ ERROR en searchVideos`, {
            query,
            maxResults,
            error: errorMessage,
            stack: errorStack,
            errorType: error instanceof Error ? error.constructor.name : typeof error
        });
        throw error;
    }
}

export async function searchChannel(params: { query: string; includeVideos: boolean; maxResults?: number }) {
    const { query, includeVideos, maxResults = 3 } = params;

    logger.trace('🎬 INICIO: searchChannel invocada');
    logger.info(`🔍 Búsqueda de canales en YouTube`);
    logger.debug(`   Query: "${query}"`);
    logger.debug(`   includeVideos: "${includeVideos}"`);
    logger.debug(`   Max Results: ${maxResults}`);

    try {
        logger.trace('📡 Llamando a youtube.search.list()...');
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            type: ["channel"],
            maxResults: maxResults
        } as any);

        logger.trace(`✅ Respuesta recibida de YouTube API`);
        logger.debug(`   Items en respuesta: ${response.data.items?.length || 0}`);

        const results = response.data.items?.map((item: any) => ({
            channelId: item.id?.channelId,
            title: item.snippet?.title,
            description: item.snippet?.description,
            url: `https://www.youtube.com/channel/${item.id?.channelId}`
        })) || [];

        logger.info(`✅ Búsqueda completada: ${results.length} canales encontrados`);
        logger.debug('📊 Títulos de canales:', results.map(r => r.title));

        // Si se solicitan los vídeos, obtener los últimos vídeos de cada canal
        if (includeVideos) {
            logger.debug('📹 Obteniendo últimos vídeos de los canales...');

            for (let i = 0; i < results.length; i++) {
                try {
                    const result = results[i];
                    if (!result || !result.channelId) {
                        logger.warn(`⚠️ Canal sin ID en posición ${i}`);
                        continue;
                    }

                    logger.trace(`📡 Buscando vídeos del canal: ${result.channelId}`);

                    const videosResponse = await youtube.search.list({
                        part: ["snippet"],
                        channelId: result.channelId,
                        maxResults: maxResults,
                        order: "date",
                        type: ["video"]
                    } as any);

                    const videos = videosResponse.data.items?.map((item: any) => ({
                        videoId: item.id?.videoId,
                        title: item.snippet?.title,
                        description: item.snippet?.description,
                        publishedAt: item.snippet?.publishedAt,
                        url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
                    })) || [];

                    logger.debug(`   ✅ ${videos.length} vídeos obtenidos del canal ${result.title}`);
                    (result as any).videos = videos;
                } catch (error) {
                    const result = results[i];
                    logger.warn(`⚠️ Error obteniendo vídeos del canal ${result?.title}`, error);
                    if (result) {
                        (result as any).videos = [];
                    }
                }
            }
        }

        return results;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'sin stack trace';
        logger.error(`❌ ERROR en searchChannel`, {
            query,
            includeVideos,
            maxResults,
            error: errorMessage,
            stack: errorStack,
            errorType: error instanceof Error ? error.constructor.name : typeof error
        });
        throw error;
    }
}