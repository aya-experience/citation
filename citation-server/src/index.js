import Hapi from 'hapi';
import inert from 'inert';
import GraphQL from 'hapi-graphql';

import {ContentSchema} from './graphql/schema';
import render from './rendering';
import conf, {setConfig} from './conf';

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
			handler: {
				directory: {
					path: conf.render.directory,
					listing: true
				}
			}
		});

		server.start(() => {
			console.log('Server running at:', server.info.uri);
			render();
		});
	});
}
