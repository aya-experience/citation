import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../nodegit/read';

export const PageType = new GraphQLObjectType({
	name: 'Page',
	description: 'Page content',
	fields: () => ({
		slug: {type: GraphQLString},
		title: {type: GraphQLString},
		content: {type: GraphQLString}
	})
});

export const ContentSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			collection: {
				type: new GraphQLList(GraphQLString),
				args: {
					type: {type: GraphQLString}
				},
				resolve: (root, {type}) => readCollection(type)
			},
			object: {
				type: PageType,
				args: {
					type: {type: GraphQLString},
					slug: {type: GraphQLString}
				},
				resolve: (root, {type, slug}) => readObject(type, slug)
			}
		}
	})
});
