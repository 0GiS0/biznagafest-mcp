import winston from 'winston';
declare class CustomLogger {
    private logger;
    constructor(logger: winston.Logger);
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    trace(message: string, meta?: any): void;
    fatal(message: string, meta?: any): void;
}
declare const _default: CustomLogger;
export default _default;
//# sourceMappingURL=logger.d.ts.map