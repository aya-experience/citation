/* eslint-env node */

import path from 'path';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerRouter, createServerRenderContext} from 'react-router';
import fs from 'fs-promise';
import XRouter from '../router/XRouter';

export default async function render(url, context, options) {
	try {
		const serverRenderContext = createServerRenderContext();

		global.window = {
			__pages__: context.pages,
			__contents__: {}
		};

		url
			.split('/')
			.splice(1)
			.map(path => `/${path}`)
			.reduce((acc, path) => {
				if (acc.length === 0) {
					acc.push(path);
				} else {
					acc.push(acc[acc.length - 1] + path);
				}
				return acc;
			}, [])
			.forEach(path => {
				global.window.__contents__[path] = context.contents[path];
			});

		console.log('renderToString', url);

		const markup = renderToString(
			<ServerRouter location={url} context={serverRenderContext}>
				<XRouter serverUrl={options.serverUrl} components={options.components}/>
			</ServerRouter>
		);

		// TODO Handle context errors and redirects

		const replacement = `
			<div id="root">${markup}</div>
			<script>
				window.__pages__=${JSON.stringify(global.window.__pages__)};
				window.__contents__=${JSON.stringify(global.window.__contents__)};
			</script>
		`.replace(/[\t\n]/g, '');

		const indexContent = context.indexContent.replace(options.selector, replacement);
		const indexDir = path.join(options.renderDir, url);
		const indexPath = path.join(indexDir, 'index.html');
		await fs.mkdir(indexDir);
		await fs.writeFile(indexPath, indexContent);
	} catch (error) {
		console.error('Something went wrong while rendering', url, error);
		throw error;
	}
}
