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
import {PageType, ComponentType, ContentType} from './query';

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

export const PageInputType = new GraphQLInputObjectType({
	name: 'PageInput',
	fields: () => ({
		__id__: {type: GraphQLID},
		__newId__: {type: GraphQLID},
		slug: {type: GraphQLString},
		title: {type: GraphQLString},
		children: {type: LinksInputType},
		component: {type: LinkInputType}
	})
});

export const ComponentInputType = new GraphQLInputObjectType({
	name: 'ComponentInput',
	fields: () => ({
		__id__: {type: GraphQLID},
		__newId__: {type: GraphQLID},
		type: {type: GraphQLString},
		children: {type: LinksInputType},
		data: {type: LinksInputType}
	})
});

export const ContentInputType = new GraphQLInputObjectType({
	name: 'ContentInput',
	fields: () => ({
		__id__: {type: GraphQLID},
		__newId__: {type: GraphQLID},
		title: {type: GraphQLString},
		content: {type: GraphQLString}
	})
});

export default new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		editPage: {
			type: PageType,
			args: {page: {type: PageInputType}},
			resolve: async (root, params) => {
				const {page} = params;
				logger.debug(`mutation ${page}`);
				try {
					return await writeObject('Page', page);
				} catch (error) {
					throw error;
				}
			}
		},
		editComponent: {
			type: ComponentType,
			args: {component: {type: ComponentInputType}},
			resolve: async (root, params) => {
				const {component} = params;
				logger.debug(`mutation ${component}`);
				try {
					return await writeObject('Component', component);
				} catch (error) {
					throw error;
				}
			}
		},
		editContent: {
			type: ContentType,
			args: {content: {type: ContentInputType}},
			resolve: async (root, params) => {
				const {content} = params;
				logger.debug(`mutation ${content}`);
				try {
					return await writeObject('Content', content);
				} catch (error) {
					throw error;
				}
			}
		}
	}
});
