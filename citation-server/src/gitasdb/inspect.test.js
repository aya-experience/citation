import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let inspect;
let readdir;
let readFile;
const modelTypes = ['Type', 'LinkedType', 'LinkedType1', 'LinkedType2'];

test.beforeEach(() => {
	readdir = sinon.stub().returns(Promise.resolve([]));
	readFile = sinon.stub().returns(Promise.resolve(new Buffer('')));
	inspect = proxyquire('./inspect', {
		'fs-extra': { readdir, readFile },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
});

test('inspectEntry should return empty array for an empty entry folder', async t => {
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	const expected = ['__id__'];
	t.deepEqual(result, expected);
});

test('inspectEntry should return field list when no links', async t => {
	const expected = ['__id__', 'one', 'two'];
	readdir.returns(Promise.resolve(['one', 'two']));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, expected);
});

test('inspectEntry should follow unique link', async t => {
	const link = {
		__role__: 'link',
		link: {
			type: 'LinkedType',
			id: 'LinkedId'
		}
	};
	readdir.onCall(0).returns(Promise.resolve(['one.md', 'two.json']));
	readdir.onCall(1).returns(Promise.resolve(['three', 'four']));
	readFile.onCall(0).returns(Promise.resolve(new Buffer(JSON.stringify(link))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, ['__id__', 'one', { two: ['__id__', 'three', 'four'] }]);
});

test('inspectEntry should ignore link if type is not in the model', async t => {
	const links = {
		__role__: 'link',
		link: {
			type: 'LinkedType3',
			id: 'LinkedId'
		}
	};
	readdir.onCall(0).returns(Promise.resolve(['one.md', 'two.json']));
	readFile.onCall(0).returns(Promise.resolve(new Buffer(JSON.stringify(links))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, ['__id__', 'one', { two: {} }]);
});

test('inspectEntry should follow multiple links', async t => {
	const links = {
		__role__: 'links',
		links: [
			{
				type: 'LinkedType1',
				id: 'LinkedId'
			},
			{
				type: 'LinkedType2',
				id: 'LinkedId'
			}
		]
	};
	readdir.onCall(0).returns(Promise.resolve(['one.md', 'two.json']));
	readdir.onCall(1).returns(Promise.resolve(['three', 'four']));
	readdir.onCall(2).returns(Promise.resolve(['five', 'six']));
	readFile.onCall(0).returns(Promise.resolve(new Buffer(JSON.stringify(links))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, [
		'__id__',
		'one',
		{
			two: {
				'... on LinkedType1': ['__id__', 'three', 'four'],
				'... on LinkedType2': ['__id__', 'five', 'six']
			}
		}
	]);
});

test('inspectEntry should ignore loops in link', async t => {
	const link = {
		__role__: 'link',
		link: {
			type: 'LinkedType',
			id: 'LinkedId'
		}
	};
	readdir.returns(Promise.resolve(['one.md', 'two.json']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(link))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, [
		'__id__',
		'one',
		{
			two: ['__id__', 'one', { two: {} }]
		}
	]);
});

test('inspectEntry should ignore loops in links', async t => {
	const links = {
		__role__: 'links',
		links: [
			{
				type: 'LinkedType1',
				id: 'LinkedId'
			},
			{
				type: 'LinkedType2',
				id: 'LinkedId'
			}
		]
	};
	readdir.returns(Promise.resolve(['one.md', 'two.json']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(links))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, [
		'__id__',
		'one',
		{
			two: {
				'... on LinkedType1': [
					'__id__',
					'one',
					{
						two: {
							'... on LinkedType1': {},
							'... on LinkedType2': [
								'__id__',
								'one',
								{
									two: {
										'... on LinkedType1': {},
										'... on LinkedType2': {}
									}
								}
							]
						}
					}
				],
				'... on LinkedType2': [
					'__id__',
					'one',
					{
						two: {
							'... on LinkedType1': [
								'__id__',
								'one',
								{
									two: {
										'... on LinkedType1': {},
										'... on LinkedType2': {}
									}
								}
							],
							'... on LinkedType2': {}
						}
					}
				]
			}
		}
	]);
});

test('inspectEntry should not fail on a broken link', async t => {
	readdir.throws();
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, []);
});

test('inspectEntry should follow a map with single link', async t => {
	const map = {
		__role__: 'map',
		map: {
			prop1: {
				type: 'LinkedType1',
				id: 'LinkedId'
			},
			prop2: {
				type: 'LinkedType2',
				id: 'LinkedId'
			}
		}
	};
	readdir.onCall(0).returns(Promise.resolve(['one.json']));
	readdir.onCall(1).returns(Promise.resolve(['two.md', 'three.md']));
	readdir.onCall(2).returns(Promise.resolve(['four.md', 'five.md']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(map))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, [
		'__id__',
		{
			one: [
				'__key__',
				{
					__value__: {
						'... on LinkedType1': ['__id__', 'two', 'three'],
						'... on LinkedType2': ['__id__', 'four', 'five']
					},
					__list__: {}
				}
			]
		}
	]);
});

test('inspectEntry should follow a map with a link array', async t => {
	const map = {
		__role__: 'map',
		map: {
			prop: [
				{
					type: 'LinkedType1',
					id: 'LinkedId'
				},
				{
					type: 'LinkedType2',
					id: 'LinkedId'
				}
			]
		}
	};
	readdir.onCall(0).returns(Promise.resolve(['one.json']));
	readdir.onCall(1).returns(Promise.resolve(['two.md', 'three.md']));
	readdir.onCall(2).returns(Promise.resolve(['four.md', 'five.md']));
	readFile.returns(Promise.resolve(new Buffer(JSON.stringify(map))));
	const result = await inspect.inspectEntry('Type', 'id', modelTypes);
	t.deepEqual(result, [
		'__id__',
		{
			one: [
				'__key__',
				{
					__value__: {},
					__list__: {
						'... on LinkedType1': ['__id__', 'two', 'three'],
						'... on LinkedType2': ['__id__', 'four', 'five']
					}
				}
			]
		}
	]);
});

test('graphqlQuerySerialize should serialize arrays', t => {
	const result = inspect.graphqlQuerySerialize(['Test1', 'Test2']);
	t.deepEqual(result, 'Test1, Test2');
});

test('graphqlQuerySerialize should serialize entries', t => {
	const result = inspect.graphqlQuerySerialize({
		Test1: 'Value1',
		Test2: 'Value2'
	});
	t.deepEqual(result, 'Test1 {Value1}, Test2 {Value2}');
});

test('graphqlQuerySerialize should recuse on entry values', t => {
	const result = inspect.graphqlQuerySerialize({ Test1: ['Value1', 'Value2'] });
	t.deepEqual(result, 'Test1 {Value1, Value2}');
});

test('graphqlQuerySerialize should skip properties with empty arrays', t => {
	const result = inspect.graphqlQuerySerialize({ Test1: [], Test2: 'Value2' });
	t.deepEqual(result, 'Test2 {Value2}');
});

test('graphqlQuerySerialize should skip properties with empty entries', t => {
	const result = inspect.graphqlQuerySerialize({
		Test1: {},
		Test2: 'Value2'
	});
	t.deepEqual(result, 'Test2 {Value2}');
});

test('graphqlQuerySerialize should skip properties with empty values recursively', t => {
	const result = inspect.graphqlQuerySerialize([{ Value1: {} }, 'Value2']);
	t.deepEqual(result, 'Value2');
});
