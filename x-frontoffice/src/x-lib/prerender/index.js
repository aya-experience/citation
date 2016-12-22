import path from 'path';
import 'isomorphic-fetch';
import fs from 'fs-promise';
import XQueries from '../router/XQueries';
import urls from './urls';
import load from './load';
import prepare from './prepare';
import render from './render';

export default async function prerender(options) {
	const context = {};
	context.pages = await XQueries.queryPages(options.serverUrl);
	context.urls = await urls(context.pages);
	context.contents = await load(options.serverUrl, context.pages);
	await fs.remove(options.renderDir);
	await fs.copy(options.buildDir, options.renderDir);
	const indexContentBuffer = await fs.readFile(path.join(options.renderDir, 'index.html'));
	context.indexContent = indexContentBuffer.toString();
	for (const url of context.urls) {
		context.preparedContents = prepare(url, context.contents);
		const markup = await render(url, context, options);
		const indexDir = path.join(options.renderDir, url);
		const indexPath = path.join(indexDir, 'index.html');
		await fs.mkdir(indexDir);
		await fs.writeFile(indexPath, markup);
	}
}
