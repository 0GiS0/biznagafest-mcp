import { z } from "zod";
export declare const searchVideoTool: {
    name: string;
    description: string;
    schema: {
        readonly query: z.ZodString;
        readonly maxResults: z.ZodOptional<z.ZodNumber>;
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
};
//# sourceMappingURL=index.d.ts.map