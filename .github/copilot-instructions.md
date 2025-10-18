# Copilot Instructions for BiznagaFest MCP

> **Nota importante**: Tóate tu tiempo, tío. Explica las cosas como un andaluz, con salero y naturalidad. Sin prisa, pero sin pausa. 🎉

## Project Overview
**biznagafest-mcp** is a Model Context Protocol (MCP) server built for the BiznagaFest 2025 conference demo. It exposes event agenda data as a resource and provides tools that AI agents can safely invoke.

**Key Pattern**: MCP bridges LLMs with external resources through registered tools and resources in a secure, permission-controlled manner.

## Architecture Overview

### The MCP Pattern (Critical Understanding)
This project implements the MCP server side of the protocol:
1. **Server** (`src/server.ts`): Express-based MCP server running on `localhost:3000/mcp`
2. **Resources**: Static data (event agenda) exposed as MCP resources with metadata
3. **Tools**: Callable functions (like `add`) that agents can invoke
4. **Transport**: HTTP streaming transport using `/mcp` POST endpoint

### Three Main Components

1. **MCP Server Setup** (lines 1-15 in `src/server.ts`)
   - Instantiate with `new McpServer({ name, version })`
   - Register tools with `server.registerTool()` and resources with `server.resource()`
   - Each tool needs: name, metadata (title, description), inputSchema (Zod validators), handler function

2. **Event Agenda Resource** (lines 33-91 in `src/server.ts`)
   - URI: `event-agenda://biznagafest-2025`
   - Loads JSON from `data/agenda.json`
   - Returns formatted, parsed JSON with file metadata (lastModified)
   - Error handling: catches JSON parse errors and file not found errors (ENOENT)

3. **HTTP Transport Layer** (lines 93-113 in `src/server.ts`)
   - Express app routes `POST /mcp` requests
   - Creates new `StreamableHTTPServerTransport` per request to avoid ID collisions
   - Handles connection closing and streaming responses

## Developer Workflows

### Build & Run
```bash
npm run build    # TypeScript → dist/server.js, sets executable permissions
npm start        # Starts HTTP server on PORT (default 3000)
```

### Data Flow
1. Agent makes request to `http://localhost:3000/mcp`
2. Express router creates transport, connects server to it
3. Server processes request (reads tool input or fetches resource)
4. Returns response via HTTP transport to agent

## Project-Specific Conventions

### Error Handling Pattern
The project uses `McpError` with specific error codes:
- `ErrorCode.InternalError` for JSON parse failures or unexpected errors
- `-32002` for resource not found (ENOENT)
- Always include `uri` and `cause` in error details for debugging

Example from `src/server.ts`:
```typescript
throw new McpError(ErrorCode.InternalError, 'Agenda file contains invalid JSON', {
    uri: uri.href,
    cause: parseError instanceof Error ? parseError.message : String(parseError)
});
```

### Resource Metadata Structure
All resources include:
- `title`, `description`: Human-readable labels
- `mimeType`: Content type (e.g., `application/json`)
- `annotations.audience`: Who can use it (`['assistant', 'user']`)
- `annotations.priority`: Relevance score (0-1, here 0.8)
- `annotations.lastModified`: Timestamp from file stats

### Data Location
- **Source data**: `data/agenda.json` (manually curated or populated by agent)
- **Format**: JSON array of session objects with fields: `titulo`, `ponente`, `hora_inicio`, `hora_fin`, `descripcion`
- **Path resolution**: Uses `path.resolve(process.cwd(), 'data', 'agenda.json')` for cross-platform consistency

## Integration Points

### External Dependencies
- `@modelcontextprotocol/sdk`: Core MCP protocol implementation
- `express`: HTTP server framework
- `zod`: Schema validation for tool inputs (not heavy use, just `z.number()`)
- `typescript`: Development tooling

### Demo Workflow (From `.github/prompts/recuperar_agenda.prompt.md`)
Agents use browser tools (Playwright MCP) to:
1. Navigate to `https://www.biznagafest.com/#schedule`
2. Extract agenda HTML
3. Convert to JSON and save to `data/agenda.json`
4. Then the MCP server exposes this data to other agents

### VS Code Integration
- `.vscode/mcp.json` registers this server as an MCP resource for VS Code
- Type: HTTP, URL: `http://localhost:3000/mcp`
- Allows VS Code's Copilot to use this server's tools and resources

## Key Files & Their Responsibilities

| File | Purpose |
|------|---------|
| `src/server.ts` | Complete MCP server implementation (134 lines, no splitting) |
| `data/agenda.json` | Event schedule data; auto-discovered by resource handler |
| `.vscode/mcp.json` | VS Code MCP server registration |
| `tsconfig.json` | Strict TypeScript settings (noUncheckedIndexedAccess, strict mode) |
| `.github/prompts/` | Agent prompts for automated tasks |

## Testing & Debugging
- **No test files** currently; verify via HTTP client (curl/Postman) to `http://localhost:3000/mcp`
- **Common issues**: 
  - Missing `data/agenda.json` → resource returns -32002 error
  - Invalid JSON in agenda → InternalError with parse details
  - Port already in use → catches with `.on('error')` and exits
