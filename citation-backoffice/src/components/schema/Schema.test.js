import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../../reduxMock';

let Schema;
let onSubmit = sinon.spy();

const match = { params: { id: 'TestType' } };

const setup = () =>
	shallow(<Schema match={match} onSubmit={onSubmit} />, { context: { store } })
		.dive()
		.dive();

test.beforeEach(() => {
	Schema = proxyquire('./Schema', {}).default;
});

test('handleSubmit should call onSubmit with good args', async t => {
	onSubmit = sinon.stub().returns(true);
	const schema = { data: [] };
	const fields = {
		TestType: {
			__name__: 'TestType',
			__fields__: [
				{
					kind: 'String',
					name: 'test1',
					typeName: 'String'
				},
				{
					kind: 'RichText',
					name: 'test2',
					typeName: 'String'
				},
				{
					kind: 'Image',
					name: 'test3',
					typeName: 'String'
				},
				{
					kind: 'Json',
					name: 'test4',
					typeName: 'String'
				},
				{
					kind: 'OBJECT',
					name: 'test5',
					typeName: 'Page'
				},
				{
					kind: 'LIST',
					name: 'test6',
					typeName: 'Page'
				}
			]
		}
	};

	const expectedValues = {
		name: 'TestType',
		fields: [
			{
				name: 'test1',
				type: 'string'
			},
			{
				name: 'test2',
				type: 'richtext'
			},
			{
				name: 'test3',
				type: 'image'
			},
			{
				name: 'test4',
				type: 'json'
			},
			{
				name: 'test5',
				type: ['link', 'Page']
			},
			{
				name: 'test6',
				type: ['links', 'Page']
			}
		]
	};
	store.getState.returns({ schema, fields });

	const schemaComponent = setup();
	schemaComponent.instance().props.handleSubmit(fields.TestType);
	t.deepEqual(onSubmit.firstCall.args[0], expectedValues);
});
