import path from 'path';
import 'isomorphic-fetch';
import 'ignore-styles';
import fs from 'fs-extra';
import { queryPages, buildPageTree } from 'citation-react-router';
import winston from 'winston';

import requireComponents from './require';
import urls from './urls';
import load from './load';
import prepare from './prepare';
import renderPage from './render-page';

const logger = winston.loggers.get('ReactRenderer');

export default async function render(options) {
	const context = {};

	context.components = requireComponents(options.components);
	logger.debug(`${Object.keys(context.components).length} components loaded`);

	context.pages = await queryPages(options.serverUrl).then(buildPageTree);
	logger.debug(`${context.pages.length} root pages loaded`);

	context.urls = await urls(context.pages);
	if (context.urls.length === 0) {
		context.urls = [{ url: '', pages: [] }];
	}
	logger.debug(`${context.urls.length} urls computed`);

	context.contents = await load(options.serverUrl, context.pages);
	logger.debug(`${Object.keys(context.contents).length} contents loaded`);

	await fs.remove(options.renderDir);
	await fs.copy(options.buildDir, options.renderDir);
	const rootIndexPath = path.join(options.renderDir, 'index.html');
	const indexContentBuffer = await fs.readFile(rootIndexPath);
	await fs.move(rootIndexPath, path.join(options.renderDir, 'preview.html'));
	context.indexContent = indexContentBuffer.toString();
	logger.debug(`Index content ready with ${context.indexContent.length} chars`);

	let loadedPage = 0;
	for (const url of context.urls) {
		try {
			logger.debug('Rendering url', url.url);

			context.preparedContents = prepare(url, context.contents);
			// Logger.debug('Prepared contents', JSON.stringify(context.preparedContents, null, 2));

			const markup = await renderPage(url, context, options);
			const indexDir = path.join(options.renderDir, url.url);
			const indexPath = path.join(indexDir, 'index.html');
			if (indexDir !== options.renderDir) {
				await fs.mkdirs(indexDir);
			}
			await fs.writeFile(indexPath, markup);
			logger.debug(`Rendering success for ${url.url}`);
			loadedPage++;
		} catch (error) {
			logger.warn(`Something went wrong while writing rendered page`, error);
		}
	}
	logger.info(`Sucessfully rendered ${loadedPage} pages`);
}
