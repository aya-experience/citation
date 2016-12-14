/* eslint no-use-before-define: 0 */

import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLUnionType,
	GraphQLInterfaceType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../gitasdb/read';
import {writeObject} from '../gitasdb/write';

export const ObjectInterface = new GraphQLInterfaceType({
	name: 'ObjectInterface',
	fields: () => ({
		id: {type: GraphQLID},
		type: {type: GraphQLString}
	}),
	resolveType: resolveObject
});

export const ObjectType = new GraphQLUnionType({
	name: 'Object',
	types: () => [PageType, Component1Type, Component2Type],
	resolveType: resolveObject
});

function resolveObject(value) {
	console.log('resolveObject', value);
	if (value.type === 'pages') {
		return PageType;
	}
	if (value.type === 'components') {
		return resolveComponent(value);
	}
}

export const ComponentInterface = new GraphQLInterfaceType({
	name: 'ComponentInterface',
	fields: () => ({
		componentType: {type: GraphQLString},
		children: {type: new GraphQLList(ComponentType)},
		__tree__: {type: GraphQLString}
	}),
	resolveType: resolveComponent
});

export const ComponentType = new GraphQLUnionType({
	name: 'Component',
	types: () => [Component1Type, Component2Type],
	resolveType: resolveComponent
});

function resolveComponent(value) {
	if (value.componentType === 'Component1') {
		return Component1Type;
	}
	if (value.componentType === 'Component2') {
		return Component2Type;
	}
}

export const PageType = new GraphQLObjectType({
	name: 'Page',
	interfaces: [ObjectInterface],
	fields: () => ({
		id: {type: GraphQLID},
		type: {type: GraphQLString},
		slug: {type: GraphQLString},
		title: {type: GraphQLString},
		children: {type: new GraphQLList(PageType)},
		component: {type: ComponentType}
	})
});

export const Component1Type = new GraphQLObjectType({
	name: 'Component1',
	interfaces: [ObjectInterface, ComponentInterface],
	fields: () => ({
		id: {type: GraphQLID},
		type: {type: GraphQLString},
		componentType: {type: GraphQLString},
		children: {type: new GraphQLList(ComponentType)},
		__tree__: {type: GraphQLString},
		title: {type: GraphQLString},
		content: {type: GraphQLString}
	})
});

export const Component2Type = new GraphQLObjectType({
	name: 'Component2',
	interfaces: [ObjectInterface, ComponentInterface],
	fields: () => ({
		id: {type: GraphQLID},
		type: {type: GraphQLString},
		componentType: {type: GraphQLString},
		children: {type: new GraphQLList(ComponentType)},
		__tree__: {type: GraphQLString},
		title2: {type: GraphQLString},
		content2: {type: GraphQLString}
	})
});

export const ContentSchema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
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
