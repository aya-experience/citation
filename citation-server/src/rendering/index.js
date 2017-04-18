import path from 'path';
import {spawn as spawnProcess} from 'child_process';

import _ from 'lodash';
import react from 'citation-react-renderer';
import winston from 'winston';

import conf from '../conf';
import build from './build';

const logger = winston.loggers.get('Renderer');

export const renderers = {react};

export function spawn(cmd, cwd) {
	return new Promise((resolve, reject) => {
		const process = spawnProcess(cmd, [], {
			stdio: 'inherit',
			shell: true,
			cwd
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

		const buildPath = await build();

		const componentsConf = _.get(conf, 'components[0]', {});
		await renderers[conf.render.framework]({
			serverUrl: `http://${conf.server.host}:${conf.server.port}/${conf.server['graphql-context']}`,
			components: path.join(conf.work.components, '0', 'master', componentsConf['compile-directory'], componentsConf.components),
			// buildDir: path.join(conf.work.components, '0', 'master', componentsConf['build-directory']),
			buildDir: buildPath,
			renderDir: path.join(process.cwd(), conf.render.directory),
			anchor: conf.render.anchor
		});
	} catch (error) {
		logger.error('Error during rendering', error);
	}
}
