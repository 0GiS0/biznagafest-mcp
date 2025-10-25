"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideoTitleTool = void 0;
// 📦 Importar las dependencias necesarias
const zod_1 = require("zod");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const logger_1 = __importDefault(require("../../logger"));
// 📋 Esquema de validación para la generación de títulos de video
const generateVideoTitleSchema = {
    stack: zod_1.z
        .string()
        .min(1, "El stack no puede estar vacío.")
        .describe("Herramientas y frameworks utilizados como parte de este repositorio"),
    maxResults: zod_1.z.number().min(1).max(50).optional()
};
// 🎬 Herramienta de generación de títulos de video con sampling
exports.generateVideoTitleTool = {
    name: "generate_video_title",
    description: "Genera un título para un video de YouTube usando sampling (modelos del cliente).",
    schema: generateVideoTitleSchema,
    handler: async (args, extra) => {
        logger_1.default.trace('🎬 INICIO: Handler de generate_video_title invocado');
        logger_1.default.debug('📋 Parámetros recibidos:', { args });
        const { stack } = args;
        logger_1.default.info(`🎨 Generando título de video para stack="${stack}"`);
        try {
            // Elicitar el idioma preferido del usuario
            logger_1.default.trace('💬 Solicitando preferencia de idioma...');
            const response = await extra.sendRequest({
                method: "elicitation/create",
                params: {
                    message: "¿En qué idioma prefieres que sea el título del video?",
                    requestedSchema: {
                        type: "object",
                        properties: {
                            language: {
                                type: "string",
                                title: "Idioma del video",
                                description: "¿En qué idioma prefieres que sea el video?",
                                enum: ["spanish", "english", "chinese", "french", "german"],
                                enumNames: [
                                    "💃🏼 Español",
                                    "☕️ Inglés",
                                    "🐉 Chino",
                                    "🥐 Francés",
                                    "🍺 Alemán",
                                ],
                            },
                        },
                        required: ["language"],
                    },
                },
            }, zod_1.z.any());
            logger_1.default.debug('📨 Respuesta de elicitación recibida:', response);
            // Recuperar el idioma seleccionado
            const preferences = response;
            // Usar sampling para generar el título con los modelos del cliente
            logger_1.default.trace('🤖 Llamando a sampling/createMessage...');
            const result = await extra.sendRequest({
                method: "sampling/createMessage",
                params: {
                    messages: [
                        {
                            role: "user",
                            content: {
                                type: "text",
                                text: `Please generate a catchy title for a YouTube video that shows how to use the following technologies: ${stack}. The title should be in ${preferences.language} and include relevant emojis. Make it engaging and no longer than 100 characters.`,
                            },
                        },
                    ],
                    maxTokens: 500,
                    modelPreferences: {
                        costPriority: 0.5,
                        intelligencePriority: 0.5,
                        speedPriority: 0.5,
                    },
                },
            }, types_js_1.CreateMessageResultSchema);
            logger_1.default.info('✅ Título de video generado exitosamente');
            logger_1.default.debug('🎯 Resultado:', result);
            // Extraer el texto de la respuesta
            const titleText = result.content[0]?.type === "text"
                ? result.content[0].text
                : JSON.stringify(result, null, 2);
            logger_1.default.trace('✅ Respuesta construida exitosamente');
            return {
                content: [
                    {
                        type: "text",
                        text: `📺 Título generado para stack "${stack}" en ${preferences.language}:\n\n${titleText}`
                    }
                ]
            };
        }
        catch (error) {
            const e = error;
            logger_1.default.error('❌ Error en generate_video_title handler', {
                error: e.message,
                stack: e.stack,
                args
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `Error generando título: ${e.message}`
                    }
                ],
                isError: true
            };
        }
    }
};
//# sourceMappingURL=index.js.map