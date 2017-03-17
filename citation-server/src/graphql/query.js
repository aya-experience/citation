/* eslint no-use-before-define: 0 */

import _ from 'lodash';
import {
	GraphQLObjectType,
	GraphQLInterfaceType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {readCollection, readObject} from '../gitasdb/read';
import {inspectObject, graphqlQuerySerialize} from '../gitasdb/inspect';
import {readModel} from './model';

export const ObjectInterface = new GraphQLInterfaceType({
	name: 'Object',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString}
	})
});

export async function buildObjects() {
	const ObjectTypes = {};
	const model = await readModel();
	for (const structure of model) {
		ObjectTypes[structure.name] = new GraphQLObjectType({
			name: structure.name,
			interfaces: [ObjectInterface],
			isTypeOf: value => value.__type__ === structure.name,
			fields: () => {
				const resultFields = {
					__id__: {type: GraphQLID},
					__newId__: {type: GraphQLID},
					__type__: {type: GraphQLString},
					__tree__: {
						type: GraphQLString,
						resolve: inspect
					}
				};
				structure.fields.forEach(field => {
					switch (field.type) {
						case 'rich-text':
						case 'text': {
							resultFields[field.name] = {type: GraphQLString};
							break;
						}
						default: {
							if (field.type[0] === 'link' && field.type[1] !== '*') {
								resultFields[field.name] = {type: ObjectTypes[field.type[1]], resolve: root => readChild(root[`${field.name}`])};
							} else if (field.type[0] === 'links' && field.type[1] !== '*') {
								resultFields[field.name] = {type: new GraphQLList(ObjectTypes[field.type[1]]), resolve: root => readChildren(root[`${field.name}`])};
							} else if (field.type[0] === 'links' && field.type[1] === '*') {
								resultFields[field.name] = {type: new GraphQLList(ObjectInterface), resolve: root => readChildren(root[`${field.name}`])};
							} else if (field.type[0] === 'link' && field.type[1] === '*') {
								resultFields[field.name] = {type: ObjectInterface, resolve: root => readChild(root[`${field.name}`])};
							} else {
								resultFields[field.name] = {type: GraphQLString};
							}
							break;
						}
					}
				});
				return resultFields;
			}
		});
	}
	return ObjectTypes;
}

// export const PageType = new GraphQLObjectType({
// 	name: 'Page',
// 	interfaces: [ObjectInterface],
// 	isTypeOf: value => value.__type__ === 'Page',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__type__: {type: GraphQLString},
// 		__tree__: {
// 			type: GraphQLString,
// 			resolve: inspect
// 		},
// 		__newId__: {type: GraphQLID},
// 		slug: {type: GraphQLString},
// 		title: {type: GraphQLString},
// 		children: {
// 			type: new GraphQLList(PageType),
// 			resolve: root => readChildren(root.children)
// 		},
// 		component: {
// 			type: ComponentType,
// 			resolve: root => readChild(root.component)
// 		}
// 	})
// });
//
// export const ComponentType = new GraphQLObjectType({
// 	name: 'Component',
// 	interfaces: [ObjectInterface],
// 	isTypeOf: value => value.__type__ === 'Component',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__type__: {type: GraphQLString},
// 		__tree__: {
// 			type: GraphQLString,
// 			resolve: inspect
// 		},
// 		__newId__: {type: GraphQLID},
// 		type: {type: GraphQLString},
// 		children: {
// 			type: new GraphQLList(ComponentType),
// 			resolve: root => readChildren(root.children)
// 		},
// 		data: {
// 			type: new GraphQLList(ObjectInterface),
// 			resolve: root => readChildren(root.data)
// 		}
// 	})
// });
//
// export const ContentType = new GraphQLObjectType({
// 	name: 'Content',
// 	interfaces: [ObjectInterface],
// 	isTypeOf: value => value.__type__ === 'Content',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__type__: {type: GraphQLString},
// 		__tree__: {
// 			type: GraphQLString,
// 			resolve: inspect
// 		},
// 		__newId__: {type: GraphQLID},
// 		title: {type: GraphQLString},
// 		content: {type: GraphQLString}
// 	})
// });

function read(type, id = null) {
	return id === null ? readCollection(type) : [readObject(type, id)];
}

async function inspect(root) {
	const inspection = await inspectObject(root.__type__, root.__id__);
	return graphqlQuerySerialize(inspection);
}

function readChildren(links) {
	if (!_.isObject(links)) {
		return null;
	}
	return Promise.all(links.links.map(link => {
		const {collection, id} = link;
		return readObject(collection, id);
	}));
}

function readChild(link) {
	if (!_.isObject(link)) {
		return null;
	}
	const {collection, id} = link.link;
	return readObject(collection, id);
}
//
// export default new GraphQLObjectType({
// 	name: 'Query',
// 	fields: {
// 		Page: {
// 			type: new GraphQLList(PageType),
// 			args: {id: {type: GraphQLID}},
// 			resolve: (root, {id}) => read('Page', id)
// 		},
// 		Component: {
// 			type: new GraphQLList(ComponentType),
// 			args: {id: {type: GraphQLID}},
// 			resolve: (root, {id}) => read('Component', id)
// 		},
// 		Content: {
// 			type: new GraphQLList(ContentType),
// 			args: {id: {type: GraphQLID}},
// 			resolve: (root, {id}) => read('Content', id)
// 		}
// 	}
// });

export async function buildQuery(ObjectTypes) {
	// const ObjectType = await buildObjects();
	const query = new GraphQLObjectType({
		name: 'Query',
		fields: () => {
			const QueryObjects = {};
			Object.keys(ObjectTypes).forEach(key => {
				QueryObjects[key] = {type: new GraphQLList(ObjectTypes[key]),
					args: {id: {type: GraphQLID}},
					resolve: (root, {id}) => read(key, id)
				};
			});
			return QueryObjects;
		}
	});
	return query;
}
