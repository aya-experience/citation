import Hapi from 'hapi';
import inert from 'inert';
import GraphQL from 'hapi-graphql';

import {ContentSchema} from './graphql/schema';
import prerender from './prerendering';

const server = new Hapi.Server();

server.connection({
	port: 4000,
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
			path: '/graphql',
			config: {}
		}
	}
}], () => {
	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'prerender',
				listing: true
			}
		}
	});

	server.start(() => {
		console.log('Server running at:', server.info.uri);
		prerender();
	});
});
