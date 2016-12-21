import path from 'path';
import 'isomorphic-fetch';
import fs from 'fs-promise';
import XQueries from '../router/XQueries';
import getPaths from './paths';
import load from './load';
import render from './render';

export default async function prerender(options) {
	const context = {};
	context.pages = await XQueries.queryPages(options.serverUrl);
	context.paths = await getPaths(context.pages);
	context.contents = await load(options.serverUrl, context.pages);
	await fs.remove(options.renderDir);
	await fs.copy(options.buildDir, options.renderDir);
	const indexContentBuffer = await fs.readFile(path.join(options.renderDir, 'index.html'));
	context.indexContent = indexContentBuffer.toString();
	for (const path of context.paths) {
		await render(path, context, options);
	}
}
