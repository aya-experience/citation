import path from 'path';
import {spawn as spawnProcess} from 'child_process';
import react from 'citation-react-renderer';
import conf from '../conf';

export const renderers = {react};

export function spawn(cmd) {
	return new Promise((resolve, reject) => {
		const process = spawnProcess(cmd, [], {
			stdio: 'inherit',
			shell: true
		});

		process.on('exit', code => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});
	});
}

export default async function rendering() {
	try {
		const host = conf.server.host ? conf.server.host : 'localhost';
		await spawn(conf.build.command);
		await renderers[conf.render.framework]({
			serverUrl: `http://${host}:${conf.server.port}/${conf.server['graphql-context']}`,
			components: path.join(process.cwd(), conf.build['compile-directory'], conf.build.components),
			buildDir: path.join(process.cwd(), conf.build['build-directory']),
			renderDir: path.join(process.cwd(), conf.render.directory),
			anchor: conf.build.anchor
		});
	} catch (error) {
		console.error('Error during prerendering', error);
	}
}
