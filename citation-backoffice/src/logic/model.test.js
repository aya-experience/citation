import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { winston } from './../winstonMock';

let query;
let model;

test.beforeEach(() => {
	query = sinon.stub();
	model = proxyquire('./model', {
		'./graphql-client': { query },
		winston
	});
});

test('queryExistingTypes should query and parse data', async t => {
	const data = {
		data: {
			__schema: {
				types: [{ name: 'Page', kind: 'OBJECT', fields: [{ name: 'test' }] }]
			}
		}
	};
	const expected = {
		Page: {
			name: 'Page',
			kind: 'OBJECT',
			fields: {
				test: { name: 'test' }
			}
		}
	};
	query.returns(data);
	t.deepEqual(await model.queryExistingTypes(), expected);
});

test('queryTypeFields should return fields object', async t => {
	const data = {
		data: {
			__type: {
				name: 'TEST',
				fields: [{ name: 'id', type: { name: 'ID', kind: 'SCALAR' } }]
			}
		}
	};
	const expected = {
		id: { name: 'id', typeName: 'ID', kind: 'SCALAR', ofType: undefined }
	};
	query.returns(data);
	t.deepEqual(await model.queryTypeFields('TEST'), expected);
});