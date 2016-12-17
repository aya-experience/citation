import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';

import {ContentSchema} from './graphql/schema';

const server = new Hapi.Server();

server.connection({
	port: 4000,
	routes: {cors: true}
});

server.register({
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
}, () =>
	server.start(() => {
		console.log('Server running at:', server.info.uri);
	})
);
