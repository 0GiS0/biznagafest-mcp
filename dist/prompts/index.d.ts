import { z } from "zod";
interface YouTubeSearchParams {
    query: string;
    language?: string;
    sortBy?: string;
    maxResults?: string;
}
export declare const prompts: {
    name: string;
    config: {
        title: string;
        description: string;
        argsSchema: {
            query: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
            language: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
            sortBy: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
            maxResults: import("@modelcontextprotocol/sdk/server/completable.js").Completable<z.ZodString>;
        };
    };
    handler: (params: YouTubeSearchParams) => {
        messages: {
            role: "assistant";
            content: {
                type: "text";
                text: string;
            };
        }[];
    };
}[];
export {};
//# sourceMappingURL=index.d.ts.map