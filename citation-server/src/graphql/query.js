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
					if (_.isString(field.type)) {
						resultFields[field.name] = {type: GraphQLString};
					} else if (_.isArray(field.type)) {
						if (field.type[0] === 'link' && field.type[1] !== '*') {
							resultFields[field.name] = {
								type: ObjectTypes[field.type[1]],
								resolve: root => readChild(root[field.name])
							};
						} else if (field.type[0] === 'links' && field.type[1] !== '*') {
							resultFields[field.name] = {
								type: new GraphQLList(ObjectTypes[field.type[1]]),
								resolve: root => readChildren(root[field.name])
							};
						} else if (field.type[0] === 'links' && field.type[1] === '*') {
							resultFields[field.name] = {
								type: new GraphQLList(ObjectInterface),
								resolve: root => readChildren(root[field.name])
							};
						} else if (field.type[0] === 'link' && field.type[1] === '*') {
							resultFields[field.name] = {
								type: ObjectInterface,
								resolve: root => readChild(root[field.name])
							};
						} else {
							resultFields[field.name] = {type: GraphQLString};
						}
					} else {
						resultFields[field.name] = {type: GraphQLString};
					}
				});
				return resultFields;
			}
		});
	}
	return ObjectTypes;
}

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

export async function buildQuery(ObjectTypes) {
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
