import winston from 'winston';

winston.loggers.add('GitAsDb', {
	console: {
		level: 'info',
		colorize: true,
		label: 'GitAsDb'
	}
});

winston.loggers.add('GitUpdater', {
	console: {
		level: 'info',
		colorize: true,
		label: 'GitUpdater'
	}
});

winston.loggers.add('NodeGit', {
	console: {
		level: 'info',
		colorize: true,
		label: 'NodeGit'
	}
});

winston.loggers.add('Renderer', {
	console: {
		level: 'info',
		colorize: true,
		label: 'Renderer'
	}
});

winston.loggers.add('GraphQL', {
	console: {
		level: 'info',
		colorize: true,
		label: 'GraphQL'
	}
});

winston.loggers.add('Server', {
	console: {
		level: 'info',
		colorize: true,
		label: 'Server'
	}
});
