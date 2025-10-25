"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = searchVideos;
exports.searchChannel = searchChannel;
// 🎬 Servicio de YouTube API
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // 🔐 Cargar las variables de entorno desde el archivo .env
const googleapis_1 = require("googleapis"); // 🎥 Cliente oficial de APIs de Google
const logger_1 = __importDefault(require("../logger"));
// 🎬 Configurar el cliente de YouTube API v3 con la clave de autenticación
const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
    logger_1.default.fatal('❌ YOUTUBE_API_KEY no está configurada en las variables de entorno');
}
else {
    logger_1.default.info(`✅ YOUTUBE_API_KEY cargada correctamente (primeros 10 chars: ${apiKey.substring(0, 10)}...)`);
}
const youtube = googleapis_1.google.youtube({
    version: "v3",
    auth: apiKey, // 🔑 API Key obtenida de las variables de entorno
});
/**
 * 🔍 Busca videos en YouTube
 * @param query - Término de búsqueda
 * @param maxResults - Número máximo de resultados (1-50, por defecto 5)
 * @returns Array de videos encontrados
 */
async function searchVideos(query, maxResults = 5) {
    logger_1.default.trace('🎬 INICIO: searchVideos invocada');
    logger_1.default.info(`🔍 Búsqueda de videos en YouTube`);
    logger_1.default.debug(`   Query: "${query}"`);
    logger_1.default.debug(`   Max Results: ${maxResults}`);
    try {
        // Validar parámetros
        if (!query || query.trim().length === 0) {
            logger_1.default.warn('⚠️ Query vacía o indefinida');
            return [];
        }
        logger_1.default.trace('📡 Llamando a youtube.search.list()...');
        // Realizar la búsqueda en YouTube
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            maxResults: maxResults,
            type: ["video"]
        });
        logger_1.default.trace(`✅ Respuesta recibida de YouTube API`);
        logger_1.default.debug(`   Items en respuesta: ${response.data.items?.length || 0}`);
        // Formatear los resultados para devolver solo la información relevante
        const results = response.data.items?.map((item) => ({
            videoId: item.id?.videoId,
            title: item.snippet?.title,
            channel: item.snippet?.channelTitle,
            description: item.snippet?.description,
            url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
        })) || [];
        logger_1.default.info(`✅ Búsqueda completada: ${results.length} videos encontrados`);
        logger_1.default.debug('📊 Títulos de videos:', results.map(r => r.title));
        logger_1.default.warn('📋 Resultados completos:', results);
        return results;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'sin stack trace';
        logger_1.default.error(`❌ ERROR en searchVideos`, {
            query,
            maxResults,
            error: errorMessage,
            stack: errorStack,
            errorType: error instanceof Error ? error.constructor.name : typeof error
        });
        throw error;
    }
}
async function searchChannel(params) {
    const { query, includeVideos, maxResults = 3 } = params;
    logger_1.default.trace('🎬 INICIO: searchChannel invocada');
    logger_1.default.info(`🔍 Búsqueda de canales en YouTube`);
    logger_1.default.debug(`   Query: "${query}"`);
    logger_1.default.debug(`   includeVideos: "${includeVideos}"`);
    logger_1.default.debug(`   Max Results: ${maxResults}`);
    try {
        logger_1.default.trace('📡 Llamando a youtube.search.list()...');
        const response = await youtube.search.list({
            part: ["snippet"],
            q: query,
            type: ["channel"],
            maxResults: maxResults
        });
        logger_1.default.trace(`✅ Respuesta recibida de YouTube API`);
        logger_1.default.debug(`   Items en respuesta: ${response.data.items?.length || 0}`);
        const results = response.data.items?.map((item) => ({
            channelId: item.id?.channelId,
            title: item.snippet?.title,
            description: item.snippet?.description,
            url: `https://www.youtube.com/channel/${item.id?.channelId}`
        })) || [];
        logger_1.default.info(`✅ Búsqueda completada: ${results.length} canales encontrados`);
        logger_1.default.debug('📊 Títulos de canales:', results.map(r => r.title));
        // Si se solicitan los vídeos, obtener los últimos vídeos de cada canal
        if (includeVideos) {
            logger_1.default.debug('📹 Obteniendo últimos vídeos de los canales...');
            for (let i = 0; i < results.length; i++) {
                try {
                    const result = results[i];
                    if (!result || !result.channelId) {
                        logger_1.default.warn(`⚠️ Canal sin ID en posición ${i}`);
                        continue;
                    }
                    logger_1.default.trace(`📡 Buscando vídeos del canal: ${result.channelId}`);
                    const videosResponse = await youtube.search.list({
                        part: ["snippet"],
                        channelId: result.channelId,
                        maxResults: maxResults,
                        order: "date",
                        type: ["video"]
                    });
                    const videos = videosResponse.data.items?.map((item) => ({
                        videoId: item.id?.videoId,
                        title: item.snippet?.title,
                        description: item.snippet?.description,
                        publishedAt: item.snippet?.publishedAt,
                        url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
                    })) || [];
                    logger_1.default.debug(`   ✅ ${videos.length} vídeos obtenidos del canal ${result.title}`);
                    result.videos = videos;
                }
                catch (error) {
                    const result = results[i];
                    logger_1.default.warn(`⚠️ Error obteniendo vídeos del canal ${result?.title}`, error);
                    if (result) {
                        result.videos = [];
                    }
                }
            }
        }
        return results;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'sin stack trace';
        logger_1.default.error(`❌ ERROR en searchChannel`, {
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
//# sourceMappingURL=youtube.js.map