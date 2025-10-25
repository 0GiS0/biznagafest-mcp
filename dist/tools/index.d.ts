export declare const getTools: () => ({
    name: string;
    description: string;
    schema: {
        readonly query: import("zod").ZodString;
        readonly maxResults: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: (args: {
        query: any;
        maxResults?: number;
    }) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    schema: {
        readonly query: import("zod").ZodString;
        readonly maxResults: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: (args: {
        query: any;
    }, extra: import("@modelcontextprotocol/sdk/shared/protocol.js").RequestHandlerExtra<any, any>) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
} | {
    name: string;
    description: string;
    schema: {
        readonly stack: import("zod").ZodString;
        readonly maxResults: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: (args: {
        stack: string;
        maxResults?: number;
    }, extra: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
})[];
//# sourceMappingURL=index.d.ts.map