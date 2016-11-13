import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../gitasdb/read';
import {writeObject} from '../gitasdb/write';

export const ObjectType = new GraphQLObjectType({
	name: 'Object',
	description: 'Object content',
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
				type: ObjectType,
				args: {
					type: {type: GraphQLString},
					slug: {type: GraphQLString}
				},
				resolve: (root, {type, slug}) => readObject(type, slug)
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			editObject: {
				type: ObjectType,
				args: {
					type: {type: GraphQLString},
					slug: {type: GraphQLString},
					title: {type: GraphQLString},
					content: {type: GraphQLString}
				},
				resolve: async (root, params) => {
					const {type, slug, ...object} = params;
					return writeObject(type, slug, object);
				}
			}
		}
	})
});
