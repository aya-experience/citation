/* eslint no-use-before-define: 0 */
import {GraphQLSchema} from 'graphql';
import {buildObjects, buildQuery} from './query';
import {buildMutation} from './mutation';

export async function buildSchema() {
	const ObjectTypes = await buildObjects();
	const QueryType = await buildQuery(ObjectTypes);
	const MutationType = await buildMutation(ObjectTypes);
	return new GraphQLSchema({
		query: QueryType,
		mutation: MutationType
	});
}
