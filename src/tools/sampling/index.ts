// 📦 Importar las dependencias necesarias
import { z } from "zod";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import logger from "../../logger";

// 📋 Esquema de validación para la generación de títulos de video
const generateVideoTitleSchema = {
    stack: z
        .string()
        .min(1, "El stack no puede estar vacío.")
        .describe("Herramientas y frameworks utilizados como parte de este repositorio"),
    maxResults: z.number().min(1).max(50).optional()
} as const;

// 🎬 Herramienta de generación de títulos de video con sampling
export const generateVideoTitleTool = {
    name: "generate_video_title",
    description: "Genera un título para un video de YouTube usando sampling (modelos del cliente).",
    schema: generateVideoTitleSchema,
    handler: async (args: { stack: string; maxResults?: number }, extra: any) => {
        logger.trace('🎬 INICIO: Handler de generate_video_title invocado');
        logger.debug('📋 Parámetros recibidos:', { args });

        const { stack } = args;
        logger.info(`🎨 Generando título de video para stack="${stack}"`);

        try {
            // Elicitar el idioma preferido del usuario
            logger.trace('💬 Solicitando preferencia de idioma...');
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
            }, z.any());

            logger.debug('📨 Respuesta de elicitación recibida:', response);

            // Recuperar el idioma seleccionado
            const preferences = response as { language: string };

            // Usar sampling para generar el título con los modelos del cliente
            logger.trace('🤖 Llamando a sampling/createMessage...');
            const result = await extra.sendRequest(
                {
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
                },
                CreateMessageResultSchema
            );

            logger.info('✅ Título de video generado exitosamente');
            logger.debug('🎯 Resultado:', result);

            // Extraer el texto de la respuesta
            const titleText = result.content[0]?.type === "text" 
                ? result.content[0].text 
                : JSON.stringify(result, null, 2);

            logger.trace('✅ Respuesta construida exitosamente');
            return {
                content: [
                    {
                        type: "text",
                        text: `📺 Título generado para stack "${stack}" en ${preferences.language}:\n\n${titleText}`
                    }
                ]
            };
        } catch (error) {
            const e = error as Error;
            logger.error('❌ Error en generate_video_title handler', {
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