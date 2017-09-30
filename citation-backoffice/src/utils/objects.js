import { toPairs, fromPairs, identity } from 'lodash';

export const filterByKeys = (object, predicate = identity) =>
	fromPairs(toPairs(object).filter(([key]) => predicate({ name: key })));
