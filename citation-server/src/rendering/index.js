import path from 'path';

import _ from 'lodash';
import react from 'citation-react-renderer';
import winston from 'winston';

import conf from '../conf';
import build from './build';

const logger = winston.loggers.get('Renderer');

export const renderers = {react};

export default async function rendering() {
	try {
		if (conf.render.disable) {
			logger.info('Skipped due to configuration');
			return;
		}

		const buildPath = await build();

		await renderers[conf.render.framework]({
			serverUrl: `http://${conf.server.host}:${conf.server.port}/${conf.server['graphql-context']}`,
			components: path.join(conf.work.components, '0', 'master'),
			buildDir: buildPath,
			renderDir: conf.work.render,
			anchor: conf.render.anchor
		});
	} catch (error) {
		logger.error('Error during rendering', error);
	}
}
