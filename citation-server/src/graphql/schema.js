/* eslint no-use-before-define: 0 */
import {GraphQLSchema} from 'graphql';
import {buildQuery} from './query';
import {buildMutation} from './mutation';

export async function buildSchema() {
	const query = await buildQuery();
	const mutation = await buildMutation();
	return new GraphQLSchema({query, mutation});
}
