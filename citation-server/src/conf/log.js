import winston from 'winston';

winston.loggers.add('GitUpdater', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'GitUpdater'
	}
});

winston.loggers.add('NodeGit', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'NodeGit'
	}
});

winston.loggers.add('Renderer', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'Renderer'
	}
});
