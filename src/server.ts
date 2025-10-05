import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { z } from 'zod';

// Creamos el servidor MCP
const server = new McpServer({
    name: 'biznagafest-mcp',
    version: '1.0.0'
});

// Añadimos una herramienta de suma
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a + b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);


const agendaResourceUri = 'event-agenda://biznagafest-2025';
const agendaMetadata = {
    title: 'BiznagaFest 2025 Agenda',
    description: 'Full schedule for BiznagaFest 2025 sessions.',
    mimeType: 'application/json',
    annotations: {
        audience: ['assistant', 'user'],
        priority: 0.8
    }
};
const agendaFilePath = path.resolve(process.cwd(), 'data', 'agenda.json');
const agendaContentName = 'agenda.json';

// Añado la agenda del evento como recurso estático compatible con MCP 2025-06-18
server.resource(
    'biznagafest-agenda',
    agendaResourceUri,
    agendaMetadata,
    async uri => {
        try {
            const [rawAgenda, fileStats] = await Promise.all([
                readFile(agendaFilePath, 'utf-8'),
                stat(agendaFilePath)
            ]);

            let formattedAgenda: string;
            try {
                formattedAgenda = JSON.stringify(JSON.parse(rawAgenda), null, 2);
            }
            catch (parseError) {
                throw new McpError(ErrorCode.InternalError, 'Agenda file contains invalid JSON', {
                    uri: uri.href,
                    cause: parseError instanceof Error ? parseError.message : String(parseError)
                });
            }

            return {
                contents: [
                    {
                        uri: uri.href,
                        name: agendaContentName,
                        title: agendaMetadata.title,
                        description: agendaMetadata.description,
                        mimeType: agendaMetadata.mimeType,
                        text: formattedAgenda,
                        annotations: {
                            ...agendaMetadata.annotations,
                            lastModified: fileStats.mtime.toISOString()
                        }
                    }
                ]
            };
        }
        catch (error) {
            if (error instanceof McpError) {
                throw error;
            }

            const err = error as NodeJS.ErrnoException;
            if (err?.code === 'ENOENT') {
                throw new McpError(-32002, 'Resource not found', { uri: uri.href });
            }

            throw new McpError(ErrorCode.InternalError, 'Unable to load event agenda', {
                uri: uri.href,
                cause: err instanceof Error ? err.message : String(err)
            });
        }
    }
);

// Añadimos un recurso dinámico de saludo
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI
        description: 'Dynamic greeting generator'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                mimeType: 'text/plain',
                text: `Hello, ${name}!`
            }
        ]
    })
);

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