import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const workingDirectory = 'workingDirectory';

let readJson;
let resolve;
let model;

test.beforeEach(() => {
	readJson = sinon.stub().returns(Promise.resolve([]));
	resolve = sinon.stub().returns(Promise.resolve([]));
	model = proxyquire('./model', {
		'./constants': { workingDirectory },
		'fs-promise': { readJson },
		path: { resolve },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
});

test('readModel should return data from sources and model', async t => {
	const firstSchema = [{ name: 'type1', fields: 'fields' }, { name: 'type2', fields: 'fields' }];
	const secondSchema = [{ name: 'type3', fields: 'fields' }];
	const expectedResult = [
		{ name: 'type3', fields: 'fields' },
		{ name: 'type1', fields: 'fields' },
		{ name: 'type2', fields: 'fields' }
	];
	resolve.returns('modelPath');
	readJson.onCall(0).returns(firstSchema);
	readJson.onCall(1).returns(secondSchema);
	t.deepEqual(await model.readModel(), expectedResult);
});

test('readModel should not fail if there is no model.json file', async t => {
	const schema = [{ name: 'type1', fields: 'fields' }];
	resolve.returns('modelPath');
	readJson.onCall(0).returns(Promise.reject());
	readJson.onCall(1).returns(schema);
	t.deepEqual(await model.readModel(), schema);
});

test('getTypesNames function should return only type names from the model', async t => {
	const schema = [
		{ name: 'type1', fields: 'fields' },
		{ name: 'type2', fields: 'fields' },
		{ name: 'type3', fields: 'fields' }
	];
	const expectedResult = ['type1', 'type2', 'type3'];
	t.deepEqual(await model.getTypesNames(schema), expectedResult);
});
