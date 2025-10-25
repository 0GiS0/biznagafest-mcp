import { z } from "zod";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
export declare const searchChannelTool: {
    name: string;
    description: string;
    schema: {
        readonly query: z.ZodString;
        readonly maxResults: z.ZodOptional<z.ZodNumber>;
    };
    handler: (args: {
        query: any;
    }, extra: RequestHandlerExtra<any, any>) => Promise<{
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