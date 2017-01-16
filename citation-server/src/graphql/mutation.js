/* eslint no-use-before-define: 0 */

import _ from 'lodash';
import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLID,
	GraphQLList,
	GraphQLString
} from 'graphql';

import {writeObject} from '../gitasdb/write';
import {PageType, ComponentType, ContentType} from './query';

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
		type: {type: GraphQLString},
		children: {type: LinksInputType},
		data: {type: LinksInputType}
	})
});

export const ContentInputType = new GraphQLInputObjectType({
	name: 'ContentInput',
	fields: () => ({
		__id__: {type: GraphQLID},
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
				console.log('mutation', page);
				return writeObject('Page', page);
			}
		},
		editComponent: {
			type: ComponentType,
			args: {component: {type: ComponentInputType}},
			resolve: async (root, params) => {
				const {component} = params;
				console.log('mutation', component);
				return writeObject('Component', component);
			}
		},
		editContent: {
			type: ContentType,
			args: {page: {type: ContentInputType}},
			resolve: async (root, params) => {
				const {content} = params;
				console.log('mutation', content);
				return writeObject('Content', content);
			}
		}
	}
});
