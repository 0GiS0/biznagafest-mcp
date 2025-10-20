// 📦 Importar las dependencias necesarias
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { tools } from './tools/index';


// ⚙️ Configurar el puerto del servidor (usa variable de entorno o 3001 por defecto)
const PORT = parseInt(process.env.PORT || '3001');


// 🚀 Crear una nueva instancia del servidor MCP
const server = new McpServer({
    name: 'biznagafest-mcp',
    version: '1.0.0'
});

// 🛠️ Registrar todas las herramientas (tools) en el servidor
// Itera sobre cada herramienta y la registra con su nombre, descripción, esquema y handler
tools.forEach(tool => {
    server.tool(
        tool.name,
        tool.description,
        tool.schema,
        tool.handler
    );
});


// Configuramos Express y el transporte HTTP
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
    // Creamos un nuevo transporte para cada solicitud para evitar colisiones de ID de solicitud
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {

    console.log(`🚀 MCP Server en http://localhost:${port}/mcp`);

}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});