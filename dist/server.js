"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 📦 Importar las dependencias necesarias
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const index_1 = require("./tools/index");
const logger_1 = __importDefault(require("./logger"));
const prompts_1 = require("./prompts");
// ⚙️ Inicializar logger
logger_1.default.info('🚀 Inicializando BiznagaFest MCP Server con stdio transport...');
// 🚀 Función para inicializar servidor MCP con herramientas
async function main() {
    logger_1.default.info('🚀 Inicializando servidor MCP BiznagaFest...');
    const server = new mcp_js_1.McpServer({
        name: 'biznagafest-mcp',
        version: '1.0.0'
    });
    logger_1.default.debug('Servidor MCP creado correctamente');
    // 🛠️ Obtener y registrar todas las herramientas (tools) en el servidor
    logger_1.default.info('📋 Registrando demos ✨...');
    const tools = (0, index_1.getTools)();
    tools.forEach((tool) => {
        server.tool(tool.name, tool.description, tool.schema, tool.handler);
        logger_1.default.debug(`✅ Herramienta registrada: ${tool.name}`);
    });
    logger_1.default.info(`📋 ${tools.length} herramientas registradas`);
    // 📝 Registrar prompts
    prompts_1.prompts.forEach(prompt => {
        server.registerPrompt(prompt.name, prompt.config, prompt.handler);
    });
    logger_1.default.debug(`✅ Prompts registrados: ${prompts_1.prompts.map(p => p.name).join(', ')}`);
    // 📡 Conectar el servidor al transporte stdio
    const transport = new stdio_js_1.StdioServerTransport();
    logger_1.default.info('📡 Conectando servidor al transporte stdio...');
    await server.connect(transport);
    logger_1.default.info('✅ Servidor conectado al transporte stdio');
    logger_1.default.info('🎉 BiznagaFest MCP Server listo y escuchando en stdin/stdout');
}
// 🏁 Ejecutar servidor
main().catch((error) => {
    logger_1.default.fatal('❌ Error fatal en el servidor', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
});
//# sourceMappingURL=server.js.map