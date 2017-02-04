import assign from 'assign-deep';

const conf = {
	content: {
		directory: 'work'
	},
	build: {
		command: 'npm run build',
		'build-directory': 'build',
		'compile-directory': '.tmp-render',
		components: 'components'
	},
	render: {
		disable: false,
		directory: 'render',
		anchor: '<div id="root"></div>'
	},
	server: {
		port: 4000,
		'graphql-context': 'graphql'
	}
};

export default conf;

export function setConfig(newConf) {
	assign(conf, newConf);
}
