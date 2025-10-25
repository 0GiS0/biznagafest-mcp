"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideoTool = void 0;
// 📦 Importar las dependencias necesarias
const zod_1 = require("zod"); // 📝 Librería para validación de esquemas
const youtube_1 = require("../../services/youtube"); // 🎬 Servicio de YouTube
const logger_1 = __importDefault(require("../../logger"));
// 📋 Esquema de validación para la búsqueda de videos
const searchVideoSchema = {
    query: zod_1.z.string().min(1, "La consulta no puede estar vacía."),
    maxResults: zod_1.z.number().min(1).max(50).optional()
};
// � Herramienta de búsqueda de videos - SIN FACTORY
exports.searchVideoTool = {
    name: "search_video",
    description: "Busca videos en YouTube basados en una consulta dada.",
    schema: searchVideoSchema,
    handler: async (args) => {
        logger_1.default.trace('🎬 INICIO: Handler de search_video invocado');
        logger_1.default.debug('📋 Parámetros recibidos:', { args });
        const { query, maxResults = 5 } = args;
        logger_1.default.info(`🔍 Buscando videos con query="${query}" y maxResults=${maxResults}`);
        try {
            // Usar el servicio de YouTube para buscar videos
            logger_1.default.trace('📡 Llamando a searchVideos...');
            const results = await (0, youtube_1.searchVideos)(query, maxResults);
            logger_1.default.info(`✅ ${results.length} resultados encontrados`);
            if (results.length > 0) {
                logger_1.default.debug('📊 Resultados:', results.map(r => ({ title: r.title, channel: r.channel, url: r.url })));
            }
            const resultText = results.length > 0
                ? results.map((r) => {
                    const channelInfo = r.channel ? `\nCanal: ${r.channel}` : '';
                    const descriptionInfo = r.description ? `\nDescripción: ${r.description}` : '';
                    return `Título: ${r.title}${channelInfo}\nURL: ${r.url}${descriptionInfo}`;
                }).join('\n---\n')
                : "No se encontraron videos";
            logger_1.default.trace('✅ Respuesta construida exitosamente');
            return {
                content: [
                    {
                        type: "text",
                        text: resultText
                    }
                ]
            };
        }
        catch (error) {
            const e = error;
            logger_1.default.error('❌ Error en search_video handler', {
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
//# sourceMappingURL=index.js.map