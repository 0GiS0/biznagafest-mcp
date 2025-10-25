"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompts = void 0;
const zod_1 = require("zod");
const completable_js_1 = require("@modelcontextprotocol/sdk/server/completable.js");
// 🎬 Prompt para buscar videos en YouTube con parámetros avanzados
exports.prompts = [{
        // 📌 Nombre único del prompt
        name: "search_youtube_videos",
        // 📋 Configuración con descripción y esquema de argumentos
        config: {
            title: 'Buscar vídeos en YouTube',
            description: "🔍 Prompt avanzado para buscar videos en YouTube con filtros por idioma, duración, calidad, nivel de aprendizaje y ordenamiento.",
            // ✅ Schema de argumentos validados con Zod y con sugerencias automáticas
            argsSchema: {
                query: (0, completable_js_1.completable)(zod_1.z.string().min(1), value => {
                    // Query suggestions
                    return ['MCP Servers', 'IA Generativa', 'Chatbots', 'BiznagaFest 2025', 'TypeScript tutorial'].filter(q => q.toLowerCase().startsWith(value.toLowerCase()));
                }),
                language: (0, completable_js_1.completable)(zod_1.z.string(), value => {
                    // Language suggestions
                    return ['español', 'inglés', 'francés', 'alemán', 'chino'].filter(l => l.toLowerCase().startsWith(value.toLowerCase()));
                }),
                sortBy: (0, completable_js_1.completable)(zod_1.z.string(), value => {
                    // Sort order suggestions
                    const options = ['relevancia', 'fecha', 'valoración', 'número de vistas', 'título'];
                    if (!value)
                        return options;
                    return options.filter(s => s.startsWith(value.toLowerCase()));
                }),
                maxResults: (0, completable_js_1.completable)(zod_1.z.string(), value => {
                    // Result count suggestions
                    const options = ['5', '10', '15', '20', '25', '50'];
                    if (!value)
                        return options;
                    return options.filter(n => n.startsWith(value));
                })
            }
        },
        // 🛠️ Handler que procesa los argumentos y retorna los mensajes del prompt
        handler: (params) => {
            const { query, language, sortBy = 'relevance', maxResults = '10' } = params;
            // 📝 Construir mensaje descriptivo detallado
            let details = `Quiero buscar contenido en YouTube sobre "${query}"`;
            if (language)
                details += ` en idioma ${language}`;
            if (sortBy !== 'relevance')
                details += `\nOrdenados por: ${sortBy === 'date' ? 'fecha más reciente' : sortBy === 'rating' ? 'mejor valoración' : sortBy === 'viewCount' ? 'más vistas' : 'título'}`;
            details += `\nMostrar hasta ${parseInt(maxResults) || 10} resultados.`;
            return {
                // 📤 Retornar el array de mensajes para el LLM
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: details
                        }
                    }
                ]
            };
        }
    }];
//# sourceMappingURL=index.js.map