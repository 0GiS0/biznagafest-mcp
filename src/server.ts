// 📦 Importar las dependencias necesarias
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { tools } from './tools/index';
import logger from './logger';
import { prompts } from './prompts';


// ⚙️ Configurar el puerto del servidor (usa variable de entorno o 3001 por defecto)
const PORT = parseInt(process.env.PORT || '3001');


// 🚀 Crear una nueva instancia del servidor MCP
logger.info('🚀 Inicializando servidor MCP BiznagaFest...');

const server = new McpServer({
    name: 'biznagafest-mcp',
    version: '1.0.0'
});

logger.debug('Servidor MCP creado correctamente');

// 🛠️ Registrar todas las herramientas (tools) en el servidor
logger.info(`📋 Registrando ${tools.length} herramientas...`);
tools.forEach(tool => {
    server.tool(
        tool.name,
        tool.description,
        tool.schema,
        tool.handler
    );
    logger.debug(`✅ Herramienta registrada: ${tool.name}`);
});

// 📝 Registrar prompts
prompts.forEach(prompt => {
    server.registerPrompt(prompt.name, prompt.config, prompt.handler);
});


logger.debug(`✅ Prompt registrado: ${prompts.map(p => p.name).join(', ')}`);

// 🛠️ Configuramos Express y el transporte HTTP
logger.info('🔧 Configurando Express...');
const app = express();
app.use(express.json());


// 📬 Endpoint para manejar solicitudes MCP
app.post('/mcp', async (req, res) => {
    logger.debug('📥 Nueva solicitud POST /mcp recibida', {
        body: req.body,
        method: req.method,
        path: req.path
    });

    try {
        // Creamos un nuevo transporte para cada solicitud para evitar colisiones de ID de solicitud
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        logger.trace('🔗 Transporte HTTP creado');

        res.on('close', () => {
            logger.debug('🔌 Conexión cerrada');
            transport.close();
        });

        await server.connect(transport);
        logger.trace('✔️ Servidor conectado al transporte');

        await transport.handleRequest(req, res, req.body);
        logger.trace('✔️ Solicitud procesada exitosamente');
    } catch (error) {
        logger.error('❌ Error procesando solicitud MCP', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = parseInt(process.env.PORT || '3000');
logger.info(`🚀 Iniciando servidor en puerto ${port}...`);

// 🏁 Iniciar el servidor y escuchar en el puerto configurado
app.listen(port, () => {
    logger.info(`✅ MCP Server ejecutándose en http://localhost:${port}/mcp`);
    logger.info(`📊 Endpoint disponible: POST http://localhost:${port}/mcp`);
    logger.info(`💾 Logs guardados en: logs/app.log y logs/error.log`);
}).on('error', error => {
    logger.fatal('❌ Error fatal en el servidor', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
});