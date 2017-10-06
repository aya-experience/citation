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

test('if there is no id, data2query should delete the property data._id_', t => {
	const data = {
		_id_: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	filterByKeys.returns({ data: data.data });
	t.is(
		data2query(undefined, data),
		'data: {links: [{value: "data1"}, {value: "data2"}]},_newId_: "id"'
	);
});

test('if there is an id, data2query should put the id value for both data._id_ and data._newId_', t => {
	const data = {
		_id_: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	filterByKeys.returns({ data: data.data });
	t.is(
		data2query(data._id_, data),
		'data: {links: [{value: "data1"}, {value: "data2"}]},_newId_: "id",_id_: "id"'
	);
});
