import winston from 'winston';

winston.loggers.add('ReactRenderer', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'ReactRenderer'
	}
});
