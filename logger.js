const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Встановіть рівень логування (info, warn, error, тощо) прочитати та поняти
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Вивід логів у консоль
    ],
});

module.exports = logger;
