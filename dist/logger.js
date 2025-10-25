"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// 🎨 Definir los niveles de log personalizados con colores para mejor visualización
const customLevels = {
    levels: {
        // 🚨 Fatal: errores críticos que detienen la aplicación
        fatal: 0,
        // ❌ Error: errores que impiden operaciones
        error: 1,
        // ⚠️ Warn: advertencias importantes
        warn: 2,
        // ℹ️ Info: información general del flujo
        info: 3,
        // 🔍 Debug: información detallada para debugging
        debug: 4,
        // 🔎 Trace: seguimiento muy detallado
        trace: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        trace: 'gray'
    }
};
// 📝 Crear el logger base con winston configurando formato y transportes
const baseLogger = winston_1.default.createLogger({
    levels: customLevels.levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
    })),
    transports: [
        // 🖥️ Consola con colores para visualización en tiempo real
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize({ colors: customLevels.colors }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                return `${timestamp} ${level}: ${message}${metaStr}`;
            }))
        }),
        // 📄 Archivo para registrar TODOS los logs (incluyendo trace)
        new winston_1.default.transports.File({
            filename: 'logs/app.log',
            level: 'trace'
        }),
        // 🚨 Archivo dedicado solo para errores (error.log)
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});
winston_1.default.addColors(customLevels.colors);
// 🛠️ Wrapper (envoltorio) para agregar métodos personalizados al logger
class CustomLogger {
    // 🔐 Logger privado de winston
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    // ❌ Registrar errores en el sistema
    error(message, meta) {
        this.logger.error(message, meta);
    }
    // ⚠️ Registrar advertencias
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    // ℹ️ Registrar información general
    info(message, meta) {
        this.logger.info(message, meta);
    }
    // 🔍 Registrar información de debug
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    // 🔎 Registrar trazas detalladas
    trace(message, meta) {
        this.logger.log('trace', message, meta);
    }
    // 🚨 Registrar errores fatales
    fatal(message, meta) {
        this.logger.log('fatal', message, meta);
    }
}
// 📤 Exportar instancia singleton del logger personalizado
exports.default = new CustomLogger(baseLogger);
//# sourceMappingURL=logger.js.map