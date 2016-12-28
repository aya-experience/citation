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
import {PageType} from './query';

export const LinkDataInputType = new GraphQLInputObjectType({
	name: 'LinkDataInput',
	fields: () => ({
		type: {type: GraphQLString},
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

export default new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		editPage: {
			type: PageType,
			args: {
				page: {type: PageInputType}
			},
			resolve: async (root, params) => {
				const {page} = params;
				console.log('mutation', page);
				return writeObject('Page', page);
			}
		}
	}
});
