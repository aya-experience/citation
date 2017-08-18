import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../../reduxMock';

let SchemaComponent;

const setup = () => shallow(<SchemaComponent fields={{}} />, { context: { store } }).find('SchemaComponent').shallow();

test.beforeEach(() => {
	SchemaComponent = proxyquire('./Schema', {}).default;
});

test('handleSubmit should call onSubmit with good args', async t => {
	const onSubmit = sinon.stub().returns(true);
	const fields = {};
	const values = {
		data: [
			{
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
		]
	};
	const expectedValues = {
		schema: {
			types: [
				{
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
				}
			]
		}
	};
	store.getState.returns({ fields });
	const schemaComponent = setup();
	schemaComponent.setProps({ onSubmit });
	await schemaComponent.instance().handleSubmit(values);
	t.true(onSubmit.calledWith(expectedValues));
});
