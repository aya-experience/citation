import path from 'path';
import {spawn as spawnProcess} from 'child_process';
import react from 'citation-react-renderer';
import winston from 'winston';

import conf from '../conf';

const logger = winston.loggers.get('Renderer');

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
		if (conf.render.disable) {
			logger.info('Skipped due to configuration');
			return;
		}
		const host = conf.server.host ? conf.server.host : 'localhost';
		// await spawn(conf.build.command);
		await renderers[conf.render.framework]({
			serverUrl: `http://${host}:${conf.server.port}/${conf.server['graphql-context']}`,
			components: path.join(process.cwd(), conf.build['compile-directory'], conf.build.components),
			buildDir: path.join(process.cwd(), conf.build['build-directory']),
			renderDir: path.join(process.cwd(), conf.render.directory),
			anchor: conf.render.anchor
		});
	} catch (error) {
		logger.error(`Error during prerendering ${error}`);
	}
}
