# Copilot Instructions for BiznagaFest MCP

> **Nota importante**: Tóate tu tiempo, tío. Explica las cosas como un andaluz, con salero y naturalidad. Sin prisa, pero sin pausa. 🎉

## Project Overview
**biznagafest-mcp** is a Model Context Protocol (MCP) server for the BiznagaFest 2025 demo. It provides AI agents with **tools to search YouTube** and **prompts for advanced searches**, all exposed via an HTTP endpoint on port 3001.

**Key Pattern**: MCP bridges LLMs with external services (YouTube API) through registered tools and prompts in a secure, permission-controlled manner.

## Architecture Overview

### Core Components (Read Files in This Order)
1. **`src/server.ts`** (Entry point, ~90 lines)
   - Initializes MCP server with name/version
   - Registers all tools from `src/tools/index.ts`
   - Registers elicitation tool from `src/elicitations/index.ts`
   - Registers prompts from `src/prompts/index.ts`
   - Sets up Express `POST /mcp` endpoint with HTTP streaming transport
   - Runs on port 3001 (default) or `process.env.PORT`

2. **`src/tools/index.ts`** (Tool definitions, ~40 lines)
   - Exports `search_video_tool`: Searches YouTube videos with optional result count
   - Uses `src/services/youtube.ts` for API calls
   - Schema: `{ query: string, maxResults?: number }`

3. **`src/elicitations/index.ts`** (Advanced tool with user prompts, ~50 lines)
   - Exports `search_channel_tool`: Searches YouTube channels with language preference
   - Uses `extra.sendRequest()` to trigger **elicitation dialog** asking user for language preference
   - Schema: `{ query: string, maxResults?: number }`
   - Demonstrates MCP's interactive capability

4. **`src/services/youtube.ts`** (External API wrapper, ~60 lines)
   - `searchVideos(query, maxResults)`: Returns `{ videoId, title, description, url }`
   - `searchChannel(params)`: Returns `{ channelId, title, description, url }`
   - Uses Google API v3 via `googleapis` package
   - Requires `YOUTUBE_API_KEY` in `.env`

5. **`src/prompts/index.ts`** (Advanced prompt with completions, ~50 lines)
   - Exports `search_youtube_videos` prompt with auto-completable arguments
   - Arguments: `query`, `language`, `sortBy`, `maxResults`
   - Each arg has suggestion function for agent auto-complete
   - Builds formatted prompt message for LLM context

6. **`src/logger.ts`** (Custom logging, ~80 lines)
   - Custom Winston logger with 6 levels: fatal, error, warn, info, debug, trace
   - Outputs to console (colored) + `logs/app.log` + `logs/error.log`
   - Exported as singleton `default` instance
   - Used throughout codebase for debugging

### Data Flow
```
Client HTTP POST /mcp
  ↓
Express router creates StreamableHTTPServerTransport
  ↓
MCP Server processes request (tool invoke, prompt completion, etc.)
  ↓
Tool handler calls YouTube service → returns results
  ↓
HTTP response streamed back to client
```

## Developer Workflows

### Build & Run
```bash
npm run build    # TypeScript compile: src → dist/, sets executable bit
npm start        # Starts server: node dist/server.js on PORT 3001
```

### Environment Setup
1. Create `.env` file (copy from `.env-sample`)
2. Add `YOUTUBE_API_KEY` from Google Cloud Console (https://console.cloud.google.com/apis/credentials)
3. Optional: Set `PORT` env var (defaults to 3001)

### Testing Tools
```bash
# Test search_video tool
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_video","arguments":{"query":"MCP"}}}'

# Test search_channel tool (triggers elicitation)
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_channel","arguments":{"query":"returngis"}}}'
```

## Project-Specific Conventions

### Tool Definition Pattern (from `src/tools/types.ts`)
All tools follow strict `tool<Args>` type:
```typescript
export type tool<Args extends z.ZodRawShape> = {
    name: string;                           // Tool ID
    description: string;                    // For LLM understanding
    schema: Args;                           // Zod validation rules
    handler: (args, extra) => Promise<...> // Async/sync processor
};
```
- Schema uses Zod's raw shape format (not `.ZodObject`)
- Handler receives `RequestHandlerExtra` for advanced features (elicitations)
- Return format: `{ content: [{ type: "text", text: "..." }] }`

### Logging Pattern
All files import logger: `import logger from "../logger"`
Log at appropriate levels:
```typescript
logger.trace('Very detailed tracking')
logger.debug('Development info')
logger.info('User-facing events')
logger.warn('Non-critical issues')
logger.error('Error messages')
logger.fatal('App-stopping errors')
```

### Elicitation Pattern (from `src/elicitations/index.ts`)
Use `extra.sendRequest()` to ask user for input during tool execution:
```typescript
const response = await extra.sendRequest({
    method: "elicitation/create",
    params: {
        message: "Please choose...",
        requestedSchema: {
            type: "object",
            properties: { /* form fields */ }
        }
    }
}, z.any());
```

### Error Handling
- Wrap API calls in try/catch
- Return `{ content: [...], isError: true }` for tool errors (not exceptions)
- Log errors with context (query, error message, stack)
- YouTube API errors: catch and return user-friendly messages

## Integration Points

### External Dependencies
- `@modelcontextprotocol/sdk` (v1.20.1): Core MCP protocol
- `googleapis` (v164.0.0): YouTube API v3 client
- `express` (v5.1.0): HTTP server framework
- `winston` (v3.18.3): Structured logging
- `zod` (implicit via types): Schema validation
- `dotenv`: Load `.env` secrets

### VS Code Integration
- `.vscode/mcp.json` registers server for Copilot
- URL: `http://localhost:3001/mcp` (note: port 3001, not 3000!)
- Type: HTTP with streaming
- Allows Copilot to invoke tools and prompts

## Key Files & Their Responsibilities

| File | Lines | Purpose |
|------|-------|---------|
| `src/server.ts` | ~90 | MCP server init, tool/prompt registration, HTTP endpoint |
| `src/tools/index.ts` | ~40 | Video search tool definition |
| `src/elicitations/index.ts` | ~50 | Channel search tool with language elicitation |
| `src/services/youtube.ts` | ~60 | YouTube API wrapper (searchVideos, searchChannel) |
| `src/prompts/index.ts` | ~50 | Advanced search prompt with auto-complete |
| `src/logger.ts` | ~80 | Custom Winston logger singleton |
| `src/tools/types.ts` | ~35 | TypeScript `tool<T>` generic type definition |
| `.vscode/mcp.json` | ~7 | VS Code MCP server registration |
| `.github/prompts/` | - | Future agent automation prompts |

## Common Tasks

### Adding a New Tool
1. Create handler function in appropriate service (e.g., `src/services/`)
2. Define schema in `src/tools/` or `src/elicitations/`
3. Import and add to `tools` export in `src/tools/index.ts` or `src/elicitations/index.ts`
4. Tool auto-registers in `src/server.ts`
5. Test via curl or HTTP client

### Adding a New Prompt
1. Define in `src/prompts/index.ts` with name, config, handler
2. Add to `prompts` array export
3. Config must include `title`, `description`, `argsSchema`
4. Handler receives params and returns `{ messages: [...] }`
5. Prompt auto-registers in `src/server.ts`

### Debugging
- Check `logs/app.log` for all activity (includes trace level)
- Check `logs/error.log` for errors only
- Increase verbosity: Ensure handlers call `logger.debug()` or `logger.trace()`
- Test tools with curl and check JSON-RPC response format

## Notes & Quirks
- **Port**: Default is 3001 (not 3000)—update `.vscode/mcp.json` if changed
- **API Key Required**: Tools fail silently if `YOUTUBE_API_KEY` not set
- **Elicitation UX**: Dialog appears in client (VS Code) when `search_channel_tool` invoked
- **Prompts vs Tools**: Prompts are non-executable suggestions; tools are callable functions
- **No Tests**: Verify manually or via integration with VS Code
