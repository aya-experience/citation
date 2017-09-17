import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { winston } from './../winstonMock';

let query;
let schema;

test.beforeEach(() => {
	query = sinon.stub();
	schema = proxyquire('./schema', {
		'./graphql-client': { query },
		winston
	});
});

test('queryExistingTypes should return query result for existing types', async t => {
	const returnedValue = { data: { __schema: { types: { Page: 'OBJECT' } } } };
	query.returns(returnedValue);
	t.deepEqual(await schema.queryExistingTypes(), returnedValue);
});

test('queryCustomTypes should return data for type', async t => {
	const returnedValue = {
		data: {
			__type: {
				name: 'TEST',
				fields: [{ name: 'id', type: { name: 'ID', kind: 'SCALAR' } }]
			}
		}
	};
	query.returns(returnedValue);
	const expectedValue = {
		__type: { id: { typeName: 'ID', kind: 'SCALAR', ofType: undefined } }
	};
	t.deepEqual(await schema.queryCustomTypes(['TEST']), expectedValue);
});
