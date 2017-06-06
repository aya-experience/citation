import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let inspect;
let readdir;
let readFile;
let getTypesNames;

test.beforeEach(() => {
	readdir = sinon.stub().returns(Promise.resolve([]));
	readFile = sinon.stub().returns(Promise.resolve(new Buffer('')));
	getTypesNames = sinon.stub().returns(['Type', 'LinkedType', 'LinkedType1', 'LinkedType2']);
	inspect = proxyquire('./inspect', {
		'fs-promise': { readdir, readFile },
		'../graphql/model': { getTypesNames },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
});

test('inspectObject should return empty array for an empty object folder', async t => {
	const result = await inspect.inspectObject('Type', 'id');
	const expected = [];
	t.deepEqual(result, expected);
});

test('inspectObject should return field list when no links', async t => {
	const expected = ['one', 'two'];
	readdir.returns(Promise.resolve(expected));
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, expected);
});

test('inspectObject should follow unique link', async t => {
	const link = {
		__role__: 'link',
		link: {
			collection: 'LinkedType',
			id: 'LinkedId'
		}
	};
	readdir.onCall(0).returns(Promise.resolve(['one.md', 'two.json']));
	readdir.onCall(1).returns(Promise.resolve(['three', 'four']));
	readFile.onCall(0).returns(Promise.resolve(new Buffer(JSON.stringify(link))));
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, ['one', { two: ['three', 'four'] }]);
});

test('inspectObject should follow multiple links', async t => {
	const links = {
		__role__: 'links',
		links: [
			{
				collection: 'LinkedType1',
				id: 'LinkedId'
			},
			{
				collection: 'LinkedType2',
				id: 'LinkedId'
			}
		]
	};
	readdir.onCall(0).returns(Promise.resolve(['one.md', 'two.json']));
	readdir.onCall(1).returns(Promise.resolve(['three', 'four']));
	readdir.onCall(2).returns(Promise.resolve(['five', 'six']));
	readFile.onCall(0).returns(Promise.resolve(new Buffer(JSON.stringify(links))));
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, [
		'one',
		{
			two: {
				'... on LinkedType1': ['three', 'four'],
				'... on LinkedType2': ['five', 'six']
			}
		}
	]);
});

test('inspectObject should ignore loops in link', async t => {
	const link = {
		__role__: 'link',
		link: {
			collection: 'LinkedType',
			id: 'LinkedId'
		}
	};
	readdir.returns(Promise.resolve(['one.md', 'two.json']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(link))));
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, [
		'one',
		{
			two: ['one']
		}
	]);
});

test('inspectObject should ignore loops in links', async t => {
	const links = {
		__role__: 'links',
		links: [
			{
				collection: 'LinkedType1',
				id: 'LinkedId'
			},
			{
				collection: 'LinkedType2',
				id: 'LinkedId'
			}
		]
	};
	readdir.returns(Promise.resolve(['one.md', 'two.json']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(links))));
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, [
		'one',
		{
			two: {
				'... on LinkedType1': [
					'one',
					{
						two: { '... on LinkedType2': ['one'] }
					}
				],
				'... on LinkedType2': [
					'one',
					{
						two: { '... on LinkedType1': ['one'] }
					}
				]
			}
		}
	]);
});

test('inspectObject should not fail on a broken link', async t => {
	readdir.throws();
	const result = await inspect.inspectObject('Type', 'id');
	t.deepEqual(result, []);
});

test('graphqlQuerySerialize should serialize arrays', t => {
	const result = inspect.graphqlQuerySerialize(['Test1', 'Test2']);
	t.deepEqual(result, 'Test1, Test2');
});

test('graphqlQuerySerialize should serialize objects', t => {
	const result = inspect.graphqlQuerySerialize({
		Test1: 'Value1',
		Test2: 'Value2'
	});
	t.deepEqual(result, 'Test1 {Value1}, Test2 {Value2}');
});

test('graphqlQuerySerialize should recuse on object values', t => {
	const result = inspect.graphqlQuerySerialize({ Test1: ['Value1', 'Value2'] });
	t.deepEqual(result, 'Test1 {Value1, Value2}');
});

test('graphqlQuerySerialize should skip properties with empty values', t => {
	const result = inspect.graphqlQuerySerialize({ Test1: [], Test2: 'Value2' });
	t.deepEqual(result, 'Test2 {Value2}');
});
