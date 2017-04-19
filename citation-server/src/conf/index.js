import path from 'path';
import assign from 'assign-deep';

const conf = {
	content: {
		repostory: undefined, // no default value, keep undefined for documentation
		username: undefined, // no default value, keep undefined for documentation
		'password-env-var': 'GIT_PASSWORD',
		cron: '*/5 * * * *'
	},
	components: [],
	render: {
		framework: undefined, // no default value, keep undefined for documentation
		disable: false,
		anchor: '<div id="root"></div>'
	},
	server: {
		host: 'localhost',
		port: 4000,
		'graphql-context': 'graphql'
	},
	work: {
		root: 'work',
		content: 'content',
		components: 'components',
		render: 'render'
	}
};

const defaultComponents = {
	repository: undefined, // no default value, keep undefined for documentation
	username: undefined, // no default value, keep undefined for documentation
	'install-command': 'yarn install',
	'build-command': 'yarn build',
	'build-directory': 'build',
	cron: '*/5 * * * *'
};

export default conf;

export function setConfig(newConf) {
	assign(conf, newConf);
	conf.components = conf.components.map(components =>
		assign(defaultComponents, components)
	);
	conf.work.root = path.resolve(process.cwd(), conf.work.root);
	['content', 'components', 'render'].forEach(directory => {
		conf.work[directory] = path.resolve(conf.work.root, conf.work[directory]);
	});
}
