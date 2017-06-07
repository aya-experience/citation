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

test('getTypesNames function should return only type names from the model', async t => {
	const firstSchema = [{ name: 'type1', fields: 'fields' }, { name: 'type2', fields: 'fields' }];
	const secondSchema = [{ name: 'type3', fields: 'fields' }];
	const expectedResult = ['type3', 'type1', 'type2'];
	resolve.returns('modelPath1');
	resolve.withArgs('../citation-server/src/sources/sources.json').returns('modelPath2');
	readJson.withArgs('modelPath1').returns(firstSchema);
	readJson.withArgs('modelPath2').returns(secondSchema);
	t.deepEqual(await model.getTypesNames(), expectedResult);
});
