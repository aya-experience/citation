import 'babel-polyfill';
import './conf/log';

import path from 'path';
import Hapi from 'hapi';
import inert from 'inert';
import GraphQL from 'hapi-graphql';
import winston from 'winston';

import {ContentSchema} from './graphql/schema';
import render from './rendering';
import conf, {setConfig} from './conf';
import {start as gitUpdaterStart} from './gitasdb/update';

const boDirectory = path.join(__dirname, '..', 'node_modules/citation-backoffice/build');
const boIndex = path.join(boDirectory, 'index.html');
const logger = winston.loggers.get('Server');

export default function start(inputConfig) {
	setConfig(inputConfig);

	const server = new Hapi.Server();

	server.connection({
		host: conf.server.host,
		port: conf.server.port,
		routes: {cors: true}
	});

	server.register([{
		register: inert
	}, {
		register: GraphQL,
		options: {
			query: {
				schema: ContentSchema
			},
			route: {
				path: `/${conf.server['graphql-context']}`,
				config: {}
			}
		}
	}], () => {
		server.route({
			method: 'GET',
			path: '/{param*}',
			handler: {directory: {path: conf.render.directory}}
		});

		server.route({
			method: 'GET',
			path: '/admin/{param*}',
			handler: {directory: {path: boDirectory}}
		});

		server.ext('onPostHandler', (request, reply) => {
			const response = request.response;
			if (request.url.path.startsWith('/admin') && response.isBoom && response.output.statusCode === 404) {
				return reply.file(boIndex, {confine: false});
			}
			return reply.continue();
		});

		server.start(async () => {
			logger.info(`Server running at: ${server.info.uri}`);
			await gitUpdaterStart();
			await render();
		});
	});
}
