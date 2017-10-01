import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let data2query;
let filterByKeys;

test.beforeEach(() => {
	filterByKeys = sinon.stub();
	data2query = proxyquire('./data2query', {
		'./objects': { filterByKeys }
	}).default;
});

test('if there is no id, data2query should delete the property data.__id__', t => {
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	filterByKeys.returns({ data: data.data });
	t.is(
		data2query(undefined, data),
		'data: {links: [{value: "data1"}, {value: "data2"}]},__newId__: "id"'
	);
});

test('if there is an id, data2query should put the id value for both data.__id__ and data.__newId__', t => {
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	filterByKeys.returns({ data: data.data });
	t.is(
		data2query(data.__id__, data),
		'data: {links: [{value: "data1"}, {value: "data2"}]},__newId__: "id",__id__: "id"'
	);
});
