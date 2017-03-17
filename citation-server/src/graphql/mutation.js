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
// import {buildObjects} from './query';
import {readModel} from './model';

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

// export const PageInputType = new GraphQLInputObjectType({
// 	name: 'PageInput',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__newId__: {type: GraphQLID},
// 		slug: {type: GraphQLString},
// 		title: {type: GraphQLString},
// 		children: {type: LinksInputType},
// 		component: {type: LinkInputType}
// 	})
// });
//
// export const ComponentInputType = new GraphQLInputObjectType({
// 	name: 'ComponentInput',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__newId__: {type: GraphQLID},
// 		type: {type: GraphQLString},
// 		children: {type: LinksInputType},
// 		data: {type: LinksInputType}
// 	})
// });
//
// export const ContentInputType = new GraphQLInputObjectType({
// 	name: 'ContentInput',
// 	fields: () => ({
// 		__id__: {type: GraphQLID},
// 		__newId__: {type: GraphQLID},
// 		title: {type: GraphQLString},
// 		content: {type: GraphQLString}
// 	})
// });

async function buildInputs() {
	const InputType = {};
	const model = await readModel();
	for (const structure of model) {
		InputType[`${structure.name}`] = new GraphQLInputObjectType({
			name: `${structure.name}Input`,
			fields: () => {
				const resultFields = {
					__id__: {type: GraphQLID},
					__newId__: {type: GraphQLID}
				};
				structure.fields.forEach(field => {
					switch (field.type) {
						case ('text'):
						case ('rich-text'): {
							resultFields[field.name] = {type: GraphQLString};
							break;
						}
						default: {
							if (field.type[0] === 'link') {
								resultFields[field.name] = {type: LinkInputType};
							} else if (field.type[0] === 'links') {
								resultFields[field.name] = {type: LinksInputType};
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
	return InputType;
}

export async function buildMutation(ObjectTypes) {
	const InputType = await buildInputs();
	// const ObjectType = await buildObjects();
	const MutationObjects = {};
	const mutation = new GraphQLObjectType({
		name: 'Mutation',
		fields: () => {
			Object.keys(InputType).forEach(key => {
				const inputs = {};
				inputs[`${key.toLowerCase()}`] = {type: InputType[key]};
				MutationObjects[`edit${key}`] = {type: ObjectTypes[key],
					args: {...inputs},
					resolve: async (root, params) => {
						logger.debug(`mutation ${params}`);
						try {
							return await writeObject(key, params[`${key.toLowerCase()}`]);
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

// export default new GraphQLObjectType({
// 	name: 'Mutation',
// 	fields: {
// 		editPage: {
// 			type: PageType,
// 			args: {page: {type: PageInputType}},
// 			resolve: async (root, params) => {
// 				const {page} = params;
// 				logger.debug(`mutation ${page}`);
// 				try {
// 					return await writeObject('Page', page);
// 				} catch (error) {
// 					throw error;
// 				}
// 			}
// 		},
// 		editComponent: {
// 			type: ComponentType,
// 			args: {component: {type: ComponentInputType}},
// 			resolve: async (root, params) => {
// 				const {component} = params;
// 				logger.debug(`mutation ${component}`);
// 				try {
// 					return await writeObject('Component', component);
// 				} catch (error) {
// 					throw error;
// 				}
// 			}
// 		},
// 		editContent: {
// 			type: ContentType,
// 			args: {content: {type: ContentInputType}},
// 			resolve: async (root, params) => {
// 				const {content} = params;
// 				logger.debug(`mutation ${content}`);
// 				try {
// 					return await writeObject('Content', content);
// 				} catch (error) {
// 					throw error;
// 				}
// 			}
// 		}
// 	}
// });
