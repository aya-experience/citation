import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { winston } from './../winstonMock';

let objects;
let mutation;
let query;
let get;
let isUndefined;

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
	get = sinon.stub().returns(Promise.resolve([]));
	isUndefined = sinon.stub().returns(Promise.resolve([]));
	objects = proxyquire('./content', {
		'./graphql-client': { query, mutation },
		lodash: { get, isUndefined },
		winston
	});
});

test('generateTypes should return formatted custom fields only', async t => {
	t.deepEqual(objects.generateTypes(fields), formatedFields);
});

test('loadObject should dispatch result after querying the server ', async t => {
	const getState = sinon.spy();
	const dispatchSpy = sinon.spy();
	const queryReturn = { data: { TEST: ['test success'] } };
	query.withArgs(`{TEST(id: "test") {__id__, ${formatedFields.join(', ')}}}`).returns(Promise.resolve(queryReturn));
	get.withArgs(getState(), `objects.Test.test`).returns('state');
	isUndefined.withArgs('state').returns(true);
	await objects.loadObject('TEST', 'test', fields)(dispatchSpy, getState);
	t.deepEqual(dispatchSpy.args[0][0].payload, { type: 'TEST', id: 'test' });
});

test('loadObject should return if stateObject is undefined', async t => {
	const generateTypes = sinon.stub(objects, 'generateTypes');
	const getState = sinon.spy();
	const dispatchSpy = sinon.spy();
	generateTypes.withArgs(fields).returns(formatedFields);
	get.withArgs(getState(), `objects.Test.test`).returns();
	isUndefined.withArgs().returns(false);
	await objects.loadObject('TEST', 'test', fields)(dispatchSpy, getState);
	t.is(dispatchSpy.called, false);
});

test.only('writeObject should dispatch result after sending mutation to the server', async t => {
	const dispatchSpy = sinon.spy();
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	const generateTypes = sinon.stub(objects, 'generateTypes');
	generateTypes.withArgs(fields).returns(formatedFields);
	const mutationReturn = {
		data: { editTEST: { __id__: 'id' }, editObject: 'myData' }
	};

	mutation
		.withArgs(
			`
			{editTEST(test: {__id__: "id",data: {links: [{value: "data1"}, {value: "data2"}]},__newId__: "id"})
			{${formatedFields.join(', ')}}}
			`
		)
		.returns(Promise.resolve(mutationReturn));
	await objects.writeObject('TEST', 'id', data, fields)(dispatchSpy);
	t.deepEqual(dispatchSpy.args[0][0].payload, {
		type: 'TEST',
		data: 'myData',
		id: 'id'
	});
});

test('if there is no id, writeObject should delete the property data.__id__', t => {
	mutation.reset();
	const dispatchSpy = sinon.spy();
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	const generateTypes = sinon.stub(objects, 'generateTypes');
	generateTypes.withArgs(fields).returns(formatedFields);
	const mutationReturn = {
		data: { editTEST: { __id__: 'id' }, editObject: 'myData' }
	};
	mutation.returns(Promise.resolve(mutationReturn));
	objects.writeObject('TEST', undefined, data, fields)(dispatchSpy);
	t.is(
		mutation.args[0][0],
		`
			{editTEST(test: {data: {links: [{value: "data1"}, {value: "data2"}]},__newId__: "id"})
			{${formatedFields.join(', ')}}}
			`
	);
});

test('if there is an id, writeObject should put the id value for both data.__id__ and data.__newId__', t => {
	mutation.reset();
	const dispatchSpy = sinon.spy();
	const data = {
		__id__: 'id',
		data: { links: [{ value: 'data1' }, { value: 'data2' }] }
	};
	const generateTypes = sinon.stub(objects, 'generateTypes');
	generateTypes.withArgs(fields).returns(formatedFields);
	const mutationReturn = {
		data: { editTEST: { __id__: 'id' }, editObject: 'myData' }
	};
	mutation.returns(Promise.resolve(mutationReturn));
	objects.writeObject('TEST', 'id', data, fields)(dispatchSpy);
	t.is(
		mutation.args[0][0],
		`
			{editTEST(test: {__id__: "id",data: {links: [{value: "data1"}, {value: "data2"}]},__newId__: "id"})
			{${formatedFields.join(', ')}}}
			`
	);
});

test('reducer for loadOjectStarted should return reduceResult', t => {
	const reduceResult = objects.reducer(
		{},
		{
			type: objects.loadObjectStarted.toString(),
			payload: { type: 'TEST', id: 'id' }
		}
	);
	t.deepEqual(reduceResult, { TEST: { id: null } });
});

test('reducer for loadObjectSuccess should return reduceResult', t => {
	const reduceResult = objects.reducer(
		{},
		{
			type: objects.loadObjectSuccess.toString(),
			payload: { type: 'TEST', id: 'id', data: 'myData' }
		}
	);
	t.deepEqual(reduceResult, { TEST: { id: 'myData' } });
});

test('deleteObject should call mutation with good args', t => {
	mutation.reset();
	const type = 'type';
	const id = 'id';
	const expectedResult = `{delete${type}(${type.toLowerCase()}: {__id__: "${id}"}) {__id__, message}}`;
	objects.deleteObject(type, id);
	t.true(mutation.calledWith(expectedResult));
});
