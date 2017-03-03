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

winston.loggers.add('GraphQL', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'GraphQL'
	}
});

winston.loggers.add('Server', {
	console: {
		level: 'debug',
		colorize: true,
		label: 'Server'
	}
});
