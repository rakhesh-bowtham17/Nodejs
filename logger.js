const winston = require('winston');
function log(){
    const logger = winston.createLogger({
        level: process.env.LOGGER_LEVEL || 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
            new winston.transports.Console({ format: winston.format.simple() })
        ]
    });
    return logger
}
module.exports = {
    log
}