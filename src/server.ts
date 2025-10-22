// 📦 Importar las dependencias necesarias
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getTools } from './tools/index';
import logger from './logger';
import { prompts } from './prompts';

// ⚙️ Inicializar logger
logger.info('🚀 Inicializando BiznagaFest MCP Server con stdio transport...');

// 🚀 Función para inicializar servidor MCP con herramientas
async function main() {
    logger.info('🚀 Inicializando servidor MCP BiznagaFest...');

    const server = new McpServer({
        name: 'biznagafest-mcp',
        version: '1.0.0'
    });

    logger.debug('Servidor MCP creado correctamente');

    // 🛠️ Obtener y registrar todas las herramientas (tools) en el servidor
    logger.info('📋 Registrando demos ✨...');
    const tools = getTools();

    tools.forEach((tool: any) => {
        server.tool(
            tool.name,
            tool.description,
            tool.schema,
            tool.handler
        );
        logger.debug(`✅ Herramienta registrada: ${tool.name}`);
    });

    logger.info(`📋 ${tools.length} herramientas registradas`);

    // 📝 Registrar prompts
    prompts.forEach(prompt => {
        server.registerPrompt(prompt.name, prompt.config, prompt.handler);
    });

    logger.debug(`✅ Prompts registrados: ${prompts.map(p => p.name).join(', ')}`);

    // 📡 Conectar el servidor al transporte stdio
    const transport = new StdioServerTransport();
    logger.info('📡 Conectando servidor al transporte stdio...');
    
    await server.connect(transport);
    logger.info('✅ Servidor conectado al transporte stdio');
    logger.info('🎉 BiznagaFest MCP Server listo y escuchando en stdin/stdout');
}

// 🏁 Ejecutar servidor
main().catch((error) => {
    logger.fatal('❌ Error fatal en el servidor', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
});
