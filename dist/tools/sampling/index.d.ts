import { z } from "zod";
export declare const generateVideoTitleTool: {
    name: string;
    description: string;
    schema: {
        readonly stack: z.ZodString;
        readonly maxResults: z.ZodOptional<z.ZodNumber>;
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
};
//# sourceMappingURL=index.d.ts.map