/* eslint no-use-before-define: 0 */

import { map, fromPairs, isString } from 'lodash';
import { GraphQLObjectType, GraphQLInterfaceType, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import { readModel, getTypesNames } from './model';
import { read, readChild, readChildren, readMap, inspect } from './resolve';

function buildSchemaObject() {
	return new GraphQLObjectType({
		name: 'Schema',
		fields: { name: { type: GraphQLString } }
	});
}

export async function buildObjects() {
	const model = await readModel();
	const modelTypes = getTypesNames(model);

	const ObjectInterface = new GraphQLInterfaceType({
		name: 'Object',
		fields: {
			__id__: { type: GraphQLID },
			__newId__: { type: GraphQLID },
			__type__: { type: GraphQLString },
			__tree__: { type: GraphQLString }
		},
		resolveType: value => ObjectTypes[value.__type__]
	});

	const KeyValuePair = new GraphQLObjectType({
		name: 'KeyValuePair',
		fields: () => ({
			__key__: { type: GraphQLString },
			__value__: { type: ObjectInterface },
			__list__: { type: new GraphQLList(ObjectInterface) }
		})
	});

	const buildField = field => {
		const fieldType = isString(field.type) ? field.type : field.type[0];
		let type;
		switch (fieldType) {
			case 'link':
				type = field.type[1] === '*' ? ObjectInterface : ObjectTypes[field.type[1]];
				return { type, resolve: root => readChild(root[field.name]) };
			case 'links':
				type = field.type[1] === '*' ? new GraphQLList(ObjectInterface) : new GraphQLList(ObjectTypes[field.type[1]]);
				return { type, resolve: root => readChildren(root[field.name], modelTypes) };
			case 'map':
				return {
					type: new GraphQLList(KeyValuePair),
					resolve: root => readMap(root[field.name], modelTypes)
				};
			case 'json':
				return { type: GraphQLJSON };
			default:
				return { type: GraphQLString };
		}
	};
	const ObjectTypes = fromPairs(
		model.map(structure => {
			return [
				structure.name,
				new GraphQLObjectType({
					name: structure.name,
					interfaces: [ObjectInterface],
					fields: () => ({
						__id__: { type: GraphQLID },
						__newId__: { type: GraphQLID },
						__type__: { type: GraphQLString },
						__tree__: {
							type: GraphQLString,
							resolve: root => inspect(root, modelTypes)
						},
						...fromPairs(structure.fields.map(field => [field.name, buildField(field)]))
					})
				})
			];
		})
	);

	ObjectTypes.Schema = buildSchemaObject();
	return ObjectTypes;
}

export async function buildQuery(ObjectTypes) {
	const query = new GraphQLObjectType({
		name: 'Query',
		fields: () =>
			fromPairs(
				map(ObjectTypes, (value, key) => [
					key,
					{
						type: new GraphQLList(value),
						args: { id: { type: GraphQLID } },
						resolve: (root, { id }) => read(key, id)
					}
				])
			)
	});
	return query;
}
