import { createLogger, format, transports } from 'winston';

const _logger = createLogger({
  defaultMeta: { service: 'bedfinder-core-api', timestamp: Date.now() },
  transports: [
    new transports.Console(),
    // TODO: add google cloud storage logger transport
  ],
  format: format.combine(format.timestamp(), format.logstash()),
  level: 'info',
});

export const log = {
  info: _logger.info.bind(_logger),
  error: _logger.error.bind(_logger),
  warning: _logger.warn.bind(_logger),
};

export const logger = _logger;
