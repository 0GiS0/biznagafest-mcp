import winston from 'winston';

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
const baseLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
        })
    ),
    transports: [
        // 🖥️ Consola con colores para visualización en tiempo real
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                    return `${timestamp} ${level}: ${message}${metaStr}`;
                })
            )
        }),
        // 📄 Archivo para registrar TODOS los logs (incluyendo trace)
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'trace'
        }),
        // 🚨 Archivo dedicado solo para errores (error.log)
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});

winston.addColors(customLevels.colors);

// 🛠️ Wrapper (envoltorio) para agregar métodos personalizados al logger
class CustomLogger {
    // 🔐 Logger privado de winston
    private logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    // ❌ Registrar errores en el sistema
    error(message: string, meta?: any) {
        this.logger.error(message, meta);
    }

    // ⚠️ Registrar advertencias
    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }

    // ℹ️ Registrar información general
    info(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    // 🔍 Registrar información de debug
    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }

    // 🔎 Registrar trazas detalladas
    trace(message: string, meta?: any) {
        this.logger.log('trace', message, meta);
    }

    // 🚨 Registrar errores fatales
    fatal(message: string, meta?: any) {
        this.logger.log('fatal', message, meta);
    }
}

// 📤 Exportar instancia singleton del logger personalizado
export default new CustomLogger(baseLogger);
