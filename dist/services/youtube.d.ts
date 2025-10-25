/**
 * 🔍 Busca videos en YouTube
 * @param query - Término de búsqueda
 * @param maxResults - Número máximo de resultados (1-50, por defecto 5)
 * @returns Array de videos encontrados
 */
export declare function searchVideos(query: string, maxResults?: number): Promise<{
    videoId: any;
    title: any;
    channel: any;
    description: any;
    url: string;
}[]>;
export declare function searchChannel(params: {
    query: string;
    includeVideos: boolean;
    maxResults?: number;
}): Promise<{
    channelId: any;
    title: any;
    description: any;
    url: string;
}[]>;
//# sourceMappingURL=youtube.d.ts.map