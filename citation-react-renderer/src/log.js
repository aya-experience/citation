import winston from 'winston';

winston.loggers.add('ReactRenderer', {
	console: {
		level: 'info',
		colorize: true,
		label: 'ReactRenderer'
	}
});
