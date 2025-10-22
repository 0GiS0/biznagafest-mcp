// 📝 Importar Zod para validación de esquemas
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { z } from "zod";

// 🛠️ Definición del tipo genérico 'tool' para crear herramientas MCP
// Este tipo define la estructura que debe tener cada herramienta del servidor
export type tool<Args extends z.ZodRawShape> = {
    // 📌 Nombre único de la herramienta (se usa para invocarla)
    name: string;

    // 📄 Descripción de lo que hace la herramienta (ayuda a la IA a entender cuándo usarla)
    description: string;

    // 📋 Esquema de validación de los argumentos usando Zod
    schema: Args;

    // ⚡ Función handler que procesa la lógica de la herramienta
    // Recibe los argumentos validados y devuelve el resultado
    handler: (
        args: z.infer<z.ZodObject<Args>>,
        extra: RequestHandlerExtra<any, any>
    ) =>
        // 🔄 Puede devolver una Promesa (async) o un resultado directo (sync)
        | Promise<{
            // 📦 Contenido de la respuesta en formato MCP
            content: Array<{
                type: "text"; // 📝 Tipo de contenido (texto)
                text: string; // 💬 El texto de la respuesta
            }>;
        }>
        | {
            // 📦 Contenido de la respuesta en formato MCP (versión síncrona)
            content: Array<{
                type: "text"; // 📝 Tipo de contenido (texto)
                text: string; // 💬 El texto de la respuesta
            }>;
        };
};