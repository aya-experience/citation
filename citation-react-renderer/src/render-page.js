import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Router from 'citation-react-router';
import winston from 'winston';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import './log';

const logger = winston.loggers.get('ReactRenderer');

export default async function renderPage(url, context, options) {
	try {
		const serverRenderContext = {};

		const sheet = new ServerStyleSheet();

		global.window = {
			__pages__: context.pages,
			__contents__: context.preparedContents
		};

		const markup = renderToString(
			sheet.collectStyles(
				<StyleSheetManager sheet={sheet.instance}>
					<StaticRouter location={url.url} context={serverRenderContext}>
						<Router serverUrl={options.serverUrl} components={context.components} />
					</StaticRouter>
				</StyleSheetManager>
			)
		);

		const replacementStyle = `</head>${sheet.getStyleTags()}`;

		const replacementMarkup = `
			<div id="root">${markup}</div>
			<script>
				window.__pages__=${JSON.stringify(global.window.__pages__)};
				window.__contents__=${JSON.stringify(global.window.__contents__)};
			</script>
		`.replace(/[\t\n]/g, '');

		return context.indexContent.replace('</head>', replacementStyle).replace(options.anchor, replacementMarkup);
	} catch (error) {
		logger.error(`Error while rendering ${url} ${error}`);
		throw error;
	}
}
