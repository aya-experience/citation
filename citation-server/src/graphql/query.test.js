import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

let readModel;

let result;
let query;

test.beforeEach(async () => {
	readModel = sinon.stub().returns(
		Promise.resolve([
			{
				name: 'Type',
				fields: [
					{
						name: 'field1',
						type: ['text']
					},
					{
						name: 'field2',
						type: ['rich-text']
					},
					{
						name: 'field3',
						type: ['image']
					},
					{
						name: 'field4',
						type: ['json']
					},
					{
						name: 'field5',
						type: ['link', '*']
					},
					{
						name: 'field6',
						type: ['link', 'Type']
					},
					{
						name: 'field7',
						type: ['links', '*']
					},
					{
						name: 'field8',
						type: ['links', 'Type']
					},
					{
						name: 'field9',
						type: ['map', '*']
					}
				]
			}
		])
	);
	query = proxyquire('./query', {
		'./model': { readModel },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
	result = await query.buildObjects();
});

test('buildObjects should return in the fields field1 which is GraphQL named String Scalar Type', t => {
	t.is(result.Type._typeConfig.fields().field1.type.name, 'String');
});

test('buildObjects should return in the fields field2 which is GraphQL named RichText Scalar Type', t => {
	t.is(result.Type._typeConfig.fields().field2.type.name, 'RichText');
});

test('buildObjects should return in the fields field3 which is GraphQL named Image Scalar Type', t => {
	t.is(result.Type._typeConfig.fields().field3.type.name, 'Image');
});

test('buildObjects should return in the fields field4 which is GraphQL named Json Scalar Type', t => {
	t.is(result.Type._typeConfig.fields().field4.type.name, 'JSON');
});

test('buildObjects should return in the fields field5 which is GraphQL named Object Interface Type', t => {
	t.is(result.Type._typeConfig.fields().field5.type.name, 'Object');
});

test('buildObjects should return in the fields field6 which is GraphQL named Type Object Type', t => {
	t.is(result.Type._typeConfig.fields().field6.type.name, 'Type');
});

test('buildObjects should return in the fields field7 which is GraphQL named Object ObjectList Type', t => {
	t.is(result.Type._typeConfig.fields().field7.type.ofType.name, 'Object');
});

test('buildObjects should return in the fields field8 which is GraphQL named Type ObjectList Type', t => {
	t.is(result.Type._typeConfig.fields().field8.type.ofType.name, 'Type');
});

test('buildObjects should return in the fields field9 which is GraphQL named KeyValuePair ObjectList Type', t => {
	t.is(result.Type._typeConfig.fields().field9.type.ofType.name, 'KeyValuePair');
});
