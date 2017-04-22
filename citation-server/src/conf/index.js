import path from 'path';
import assign from 'assign-deep';

const conf = {
	dev: false,
	updater: {
		cron: '*/5 * * * *'
	},
	content: {
		// repostory: no default value, keep for documentation
		// username: no default value, keep for documentation
		'password-env-var': 'GIT_PASSWORD'
	},
	components: [],
	builder: {
		directory: 'node_modules/citation-react-builder',
		'src-directory': 'src',
		'components-file': 'components.js',
		'build-directory': 'build'
	},
	render: {
		// framework: no default value, keep for documentation
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
	// repository: no default value, keep for documentation
	// username: no default value, keep for documentation
	// directory: no default value, keep for documentation
	// dependency: no default value, keep for documentation
	'install-command': 'yarn install',
	'build-command': 'yarn build'
};

export default conf;

export function setConfig(newConf) {
	assign(conf, newConf);
	conf.components = conf.components.map(components => assign(components, defaultComponents));
	conf.work.root = path.resolve(process.cwd(), conf.work.root);
	['content', 'components', 'render'].forEach(directory => {
		conf.work[directory] = path.resolve(conf.work.root, conf.work[directory]);
	});
}
