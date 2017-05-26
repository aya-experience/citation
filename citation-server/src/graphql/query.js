/* eslint no-use-before-define: 0 */

import _ from 'lodash';
import {mapSeries} from 'bluebird';
import {
	GraphQLObjectType,
	GraphQLInterfaceType,
	GraphQLUnionType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import {readCollection, readObject} from '../gitasdb/read';
import {inspectObject, graphqlQuerySerialize} from '../gitasdb/inspect';
import {readModel} from './model';

export const ObjectInterface = new GraphQLInterfaceType({
	name: 'ObjectInterface',
	fields: () => ({
		__id__: {type: GraphQLID},
		__type__: {type: GraphQLString}
	})
});

function buildSchemaObject() {
	return new GraphQLObjectType({
		name: 'Schema',
		fields: {name: {type: GraphQLString}}
	});
}

export async function buildObjects() {
	const model = await readModel();

	const ObjectUnion = new GraphQLUnionType({
		name: 'ObjectUnion',
		types: () => model.map(structure => ObjectTypes[structure.name]),
		resolveType: value => ObjectTypes[value.__type__]
	});

	const KeyValuePair = new GraphQLObjectType({
		name: 'KeyValuePair',
		fields: () => ({
			__key__: {type: GraphQLString},
			__value__: {type: ObjectUnion},
			__list__: {type: new GraphQLList(ObjectUnion)}
		})
	});

	const ObjectTypes = _.fromPairs(model.map(structure => {
		return [structure.name, new GraphQLObjectType({
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
					} else if (_.size(field.type) > 1) {
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
						} else if (field.type[0] === 'map' && field.type[1] === '*') {
							resultFields[field.name] = {
								type: new GraphQLList(KeyValuePair),
								resolve: root => readMap(root[field.name])
							};
						} else {
							resultFields[field.name] = {type: GraphQLString};
						}
					} else if (field.type[0] === 'json') {
						resultFields[field.name] = {type: GraphQLJSON};
					} else {
						resultFields[field.name] = {type: GraphQLString};
					}
				});
				return resultFields;
			}
		})];
	}));
	ObjectTypes.Schema = buildSchemaObject();
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

function readMap(map) {
	if (!_.isObject(map)) {
		return null;
	}
	return mapSeries(
		_.toPairs(map.map),
		pair => {
			console.log('pair', pair);
			return _.isArray(pair[1]) ?
				{__key__: pair[0], __list__: readChildren({links: pair[1]})} :
				{__key__: pair[0], __value__: readChild({link: pair[1]})};
		}
	);
}

export async function buildQuery(ObjectTypes) {
	const query = new GraphQLObjectType({
		name: 'Query',
		fields: () => {
			const QueryObjects = {};
			Object.keys(ObjectTypes).forEach(key => {
				QueryObjects[key] = {type: new GraphQLList(ObjectTypes[key]),
					args: {id: {type: GraphQLID}},
					resolve: (root, {id}) => {
						console.log('resolve root query', key, id);
						return read(key, id);
					}
				};
			});
			return QueryObjects;
		}
	});
	return query;
}
