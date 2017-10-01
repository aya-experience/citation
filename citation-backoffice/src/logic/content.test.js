import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const type = 'TEST';
const id = 'test';

let content;
let mutation;
let query;
let fields2query;

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
const formatedFields = [
	'field1 {__id__, __type__}',
	'field2 {__id__}',
	'field3 {__id__, __type__}',
	'field4 {__id__}',
	'field5',
	'__id__'
];

test.beforeEach(() => {
	mutation = sinon.stub();
	query = sinon.stub();
	fields2query = sinon.stub();
	content = proxyquire('./content', {
		'./graphql-client': { query, mutation },
		fields2query
	});
});

test('loadEntry should dispatch result after querying the server ', async t => {
	const getState = sinon.stub().returns({ content: { [type]: { [id]: 'state' } } });
	const dispatchSpy = sinon.spy();
	query.returns(Promise.resolve({ data: { [type]: ['test success'] } }));
	await content.loadEntry(type, id, fields)(dispatchSpy, getState);
	t.deepEqual(dispatchSpy.args[0][0].payload, { type, id });
});

test('loadEntry should return if existingEntry is not empty', async t => {
	fields2query.returns(formatedFields);
	const getState = sinon
		.stub()
		.returns({ content: { [type]: { [id]: { __id__: id, field: 'value' } } } });
	const dispatchSpy = sinon.spy();
	await content.loadEntry(type, id, fields)(dispatchSpy, getState);
	t.is(dispatchSpy.called, false);
});

test('writeEntry should dispatch result after sending mutation to the server', async t => {
	const dispatchSpy = sinon.spy();
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	fields2query.returns(formatedFields);
	mutation.returns(
		Promise.resolve({
			data: { editTEST: { __id__: 'id' } }
		})
	);
	await content.writeEntry('TEST', 'id', data, fields)(dispatchSpy);
	t.deepEqual(dispatchSpy.args[0][0].payload, {
		type: 'TEST',
		data: { __id__: 'id' },
		id: 'id'
	});
});

test('reducer for loadOjectStarted should return reduceResult', t => {
	const reduceResult = content.reducer(
		{},
		{
			type: content.loadEntryStarted.toString(),
			payload: { type: 'TEST', id: 'id' }
		}
	);
	t.deepEqual(reduceResult, { TEST: { id: null } });
});

test('reducer for loadEntrySuccess should return reduceResult', t => {
	const reduceResult = content.reducer(
		{},
		{
			type: content.loadEntrySuccess.toString(),
			payload: { type: 'TEST', id: 'id', data: 'myData' }
		}
	);
	t.deepEqual(reduceResult, { TEST: { id: 'myData' } });
});

test('deleteEntry should call mutation with good args', t => {
	mutation.reset();
	const type = 'type';
	const id = 'id';
	const expectedResult = `{delete${type}(${type.toLowerCase()}: {__id__: "${id}"}) {__id__, message}}`;
	content.deleteEntry(type, id);
	t.true(mutation.calledWith(expectedResult));
});
