import 'babel-polyfill';
import './conf/log';

import path from 'path';
import Hapi from 'hapi';
import inert from 'inert';
import winston from 'winston';

import GraphQL from './hapi-graphql';
import { buildSchema } from './graphql/schema';
import conf, { setConfig } from './conf';
import { start as startUpdater, updateContent } from './gitupdater';
import { start as startDevMode } from './rendering/build';

const boDirectory = path.join(__dirname, '..', 'node_modules/citation-backoffice/build');
const boIndex = path.join(boDirectory, 'index.html');
const previewIndex = path.join(process.cwd(), conf.work.root, conf.work.render, 'preview.html');
const logger = winston.loggers.get('Server');

let server;
let schema;

export async function updateSchema() {
	schema = await buildSchema();
}

async function getSchema() {
	return schema ? schema : buildSchema();
}

export default async function start(inputConfig) {
	setConfig(inputConfig);

	await updateContent();

	schema = await buildSchema();

	server = new Hapi.Server();

	server.connection({
		host: conf.server.host,
		port: conf.server.port,
		routes: { cors: true }
	});

	server.register(
		[
			{
				register: inert
			},
			{
				register: GraphQL,
				options: {
					query: {
						schemaFunc: getSchema
					},
					route: {
						path: `/${conf.server['graphql-context']}`,
						config: {}
					}
				}
			}
		],
		() => {
			server.route({
				method: 'GET',
				path: '/{param*}',
				handler: { directory: { path: conf.work.render } }
			});

			server.route({
				method: 'GET',
				path: '/admin/{param*}',
				handler: { directory: { path: boDirectory } }
			});

			server.ext('onPostHandler', (request, reply) => {
				const response = request.response;
				if (response.isBoom && response.output.statusCode === 404) {
					if (request.url.path.startsWith('/preview') || request.url.path.startsWith('/edition')) {
						return reply.file(previewIndex, { confine: false });
					}
					if (request.url.path.startsWith('/admin')) {
						return reply.file(boIndex, { confine: false });
					}
				}
				return reply.continue();
			});

			server.start(async () => {
				logger.info(`Server running at: ${server.info.uri}`);

				await startUpdater();
				if (conf.dev) {
					startDevMode();
				}
			});
		}
	);
}
