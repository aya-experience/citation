import path from 'path';
import 'isomorphic-fetch';
import fs from 'fs-promise';
import {queries} from 'citation-react-router';
import winston from 'winston';
import urls from './urls';
import load from './load';
import prepare from './prepare';
import renderPage from './render-page';

const logger = winston.loggers.get('ReactRenderer');

export default async function render(options) {
	const context = {};
	context.components = require(options.components); // eslint-disable-line import/no-dynamic-require
	if (context.components.default) { // Handle ES2015 default export
		context.components = context.components.default;
	}
	context.pages = await queries.queryPages(options.serverUrl);
	context.urls = await urls(context.pages);
	context.contents = await load(options.serverUrl, context.pages);
	await fs.remove(options.renderDir);
	await fs.copy(options.buildDir, options.renderDir);
	const indexContentBuffer = await fs.readFile(path.join(options.renderDir, 'index.html'));
	context.indexContent = indexContentBuffer.toString();
	let loadedPage = 0;
	for (const url of context.urls) {
		try {
			context.preparedContents = prepare(url, context.contents);
			const markup = await renderPage(url, context, options);
			const indexDir = path.join(options.renderDir, url);
			const indexPath = path.join(indexDir, 'index.html');
			await fs.mkdir(indexDir);
			await fs.writeFile(indexPath, markup);
			loadedPage++;
		} catch (error) {}
	}
	logger.debug(`Sucessfully loaded ${loadedPage} pages`);
}
