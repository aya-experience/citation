import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLUnionType,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../gitasdb/read';
import {writeObject} from '../gitasdb/write';

export const ComponentType = new GraphQLObjectType({
	name: 'Component',
	description: 'Object content',
	fields: () => ({
		id: {type: GraphQLString},
		type: {type: GraphQLString},
		title: {type: GraphQLString},
		content: {type: GraphQLString}
	})
});

export const PageType = new GraphQLObjectType({
	name: 'Page',
	description: 'Page object',
	fields: () => ({
		id: {type: GraphQLString},
		slug: {type: GraphQLString},
		title: {type: GraphQLString},
		children: {type: new GraphQLList(PageType)},
		component: {type: ComponentType}
	})
});

export const ObjectType = new GraphQLUnionType({
	name: 'Object',
	types: [PageType, ComponentType],
	resolveType(value) {
		if (value.type === 'pages') {
			return PageType;
		}
		if (value.type === 'components') {
			return ComponentType;
		}
	}
});

export const ContentSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			collection: {
				type: new GraphQLList(ObjectType),
				args: {
					type: {type: GraphQLString}
				},
				resolve: (root, {type}) => readCollection(type)
			},
			object: {
				type: ObjectType,
				args: {
					type: {type: GraphQLString},
					id: {type: GraphQLString}
				},
				resolve: (root, {type, id}) => readObject(type, id)
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
