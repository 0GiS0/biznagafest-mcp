import { z } from "zod";
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';

// 🎬 Prompt para buscar videos en YouTube
export const prompts = [{
    // 📌 Nombre único del prompt
    name: "search_videos",

    // 📋 Configuración con descripción y esquema de argumentos
    config: {
        title: 'Buscar vídeos en YouTube',
        description: "🔍 Prompt para buscar videos en YouTube basados en una consulta, idioma y tema específicos.",
        // ✅ Schema de argumentos validados con Zod y con sugerencias automáticas
        argsSchema: {
            language: completable(z.string(), value => {
                // Language suggestions
                return ['español', 'inglés', 'francés', 'alemán'].filter(l => l.startsWith(value));
            }),
            topic: completable(z.string(), (value, context) => {
                // Topic suggestions
                return ['MCP Servers', 'IA Generativa', 'Chatbots', 'BiznagaFest'].filter(t => t.startsWith(value));
            }),
            level: completable(z.string(), (value, context) => {
                // Level suggestions based on selected topic
                const topic = context?.arguments?.['topic'];
                if (topic === 'MCP Servers') {
                    return ['Principiantes', 'Intermedio', 'Avanzado'].filter(n => n.startsWith(value));
                } else if (topic === 'IA Generativa') {
                    return ['Principiantes', 'Intermedio', 'Avanzado'].filter(n => n.startsWith(value));
                } else if (topic === 'Chatbots') {
                    return ['Principiantes', 'Intermedio', 'Avanzado'].filter(n => n.startsWith(value));
                }
                return ['Principiantes', 'Intermedio', 'Avanzado'].filter(n => n.startsWith(value));
            })
        }
    },

    // 🛠️ Handler que procesa los argumentos y retorna los mensajes del prompt
    handler: ({ language, topic, level }: { language: string; topic: string; level?: string }) => {

        return {
            // 📤 Retornar el array de mensajes para el LLM
            messages: [
                {
                    role: "assistant" as const,
                    content: {
                        type: "text" as const,
                        text: `Quiero buscar un video en YouTube sobre el tema "${topic}" en el idioma "${language}".` +
                                (level ? ` pensado para  ${level}.` : '')
                    }
                }
            ]
        };
    }
}];

