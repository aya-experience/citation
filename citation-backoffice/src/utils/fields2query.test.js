import test from 'ava';
import fields2query from './fields2query';

const fields = {
	field1: {
		kind: 'OBJECT',
		typeName: '*'
	},
	field2: {
		kind: 'OBJECT',
		typeName: 'typeName2'
	},
	field3: {
		kind: 'LIST',
		typeName: '*'
	},
	field4: {
		kind: 'LIST',
		typeName: 'typeName4'
	},
	field5: {
		kind: 'SCALAR',
		typeName: 'typeName'
	}
};
const formatedFields =
	'__id__,field1 {__id__, __type__},field2 {__id__},field3 {__id__, __type__},field4 {__id__},field5';

test('fields2query should return formatted custom fields only', async t => {
	t.deepEqual(fields2query(fields), formatedFields);
});
