// 📦 Importar todas las herramientas
import { createSearchVideoTool } from "./basic/index";
import { searchChannelTool } from "./elicitations/index";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// 🏭 Función que crea e instancia todas las tools
export const getTools = (server: McpServer) => [
    createSearchVideoTool(server),
    searchChannelTool,
];
