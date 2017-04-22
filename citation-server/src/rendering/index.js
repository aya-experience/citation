import path from 'path';

import _ from 'lodash';
import react from 'citation-react-renderer';
import winston from 'winston';

import conf from '../conf';
import {getBuilderPath, getComponentsPaths} from './build';

const logger = winston.loggers.get('Renderer');

export const renderers = {react};

export default async function rendering() {
	try {
		await renderers[conf.render.framework]({
			serverUrl: `http://${conf.server.host}:${conf.server.port}/${conf.server['graphql-context']}`,
			components: await getComponentsPaths(),
			buildDir: path.join(await getBuilderPath(), conf.builder['build-directory']),
			renderDir: conf.work.render,
			anchor: conf.render.anchor
		});
	} catch (error) {
		logger.error('Error during rendering', error);
	}
}
