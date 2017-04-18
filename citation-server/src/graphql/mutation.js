/* eslint no-use-before-define: 0 */

import _ from 'lodash';
import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';
import winston from 'winston';

import {writeObject} from '../gitasdb/write';
import {readModel, writeModel} from './model';

const logger = winston.loggers.get('GraphQL');

export const LinkDataInputType = new GraphQLInputObjectType({
	name: 'LinkDataInput',
	fields: () => ({
		collection: {type: GraphQLString},
		id: {type: GraphQLID}
	})
});

export const LinkInputType = new GraphQLInputObjectType({
	name: 'LinkInput',
	fields: () => ({
		__role__: {type: GraphQLString},
		link: {type: LinkDataInputType}
	})
});

export const LinksInputType = new GraphQLInputObjectType({
	name: 'LinksInput',
	fields: () => ({
		__role__: {type: GraphQLString},
		links: {type: new GraphQLList(LinkDataInputType)}
	})
});

export const FieldType = new GraphQLInputObjectType({
	name: 'FieldType',
	fields: () => ({
		name: {type: GraphQLString},
		type: {type: new GraphQLList(GraphQLString)}
	})
});

export const SchemaType = new GraphQLInputObjectType({
	name: 'SchemaType',
	fields: () => ({
		name: {type: GraphQLString},
		fields: {type: new GraphQLList(FieldType)}
	})
});

function buildSchemaInput() {
	return new GraphQLInputObjectType({
		name: 'SchemaInput',
		fields: () => ({
			types: {type: new GraphQLList(SchemaType)}
		})
	});
}

async function buildInputs() {
	const InputType = {};
	const model = await readModel();
	for (const structure of model) {
		InputType[structure.name] = new GraphQLInputObjectType({
			name: `${structure.name}Input`,
			fields: () => {
				const resultFields = {
					__id__: {type: GraphQLID},
					__newId__: {type: GraphQLID}
				};
				structure.fields.forEach(field => {
					if (_.isString(field.type)) {
						resultFields[field.name] = {type: GraphQLString};
					} else if (_.isArray(field.type)) {
						if (field.type[0] === 'link') {
							resultFields[field.name] = {type: LinkInputType};
						} else if (field.type[0] === 'links') {
							resultFields[field.name] = {type: LinksInputType};
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
	InputType.Schema = buildSchemaInput();
	return InputType;
}

export async function buildMutation(ObjectTypes) {
	const InputType = await buildInputs();
	const MutationObjects = {};
	const mutation = new GraphQLObjectType({
		name: 'Mutation',
		fields: () => {
			Object.keys(InputType).forEach(key => {
				const inputs = {};
				inputs[key.toLowerCase()] = {type: InputType[key]};
				MutationObjects[`edit${key}`] = {type: ObjectTypes[key],
					args: {...inputs},
					resolve: async (root, params) => {
						logger.debug(`mutation ${params}`);
						try {
							if (key === 'Schema') {
								return await writeModel(params);
							}
							return await writeObject(key, params[key.toLowerCase()]);
						} catch (error) {
							throw error;
						}
					}
				};
			});
			return MutationObjects;
		}
	});
	return mutation;
}
