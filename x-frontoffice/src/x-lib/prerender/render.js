/* eslint-env node */

import React from 'react';
import {renderToString} from 'react-dom/server';
import {ServerRouter, createServerRenderContext} from 'react-router';
import XRouter from '../router/XRouter';

export default async function render(url, context, options) {
	try {
		const serverRenderContext = createServerRenderContext();

		global.window = {
			__pages__: context.pages,
			__contents__: context.preparedContents
		};

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

		return context.indexContent.replace(options.selector, replacement);
	} catch (error) {
		console.error('Something went wrong while rendering', url, error);
		throw error;
	}
}
