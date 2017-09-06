import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../../reduxMock';

let ObjectComponent;

const setup = () => shallow(<ObjectComponent />, { context: { store } }).find('GenericObject').shallow();

test.beforeEach(() => {
	ObjectComponent = proxyquire('./Object', {}).default;
});

test('handleSubmit should call onSubmit with good args', async t => {
	const onSubmit = sinon.stub().returns(true);
	const type = 'TEST';
	const collections = {};
	const fields = {
		TEST: {
			test: { typeName: '*', kind: 'LIST' },
			secondTest: { typeName: 'String', kind: 'SCALAR' },
			thirdTest: { typeName: 'test', kind: 'OBJECT' },
			fourthTest: { typeName: 'TEST', kind: 'LIST' },
			fifthTest: { typeName: '*', kind: 'OBJECT' },
			sixthTest: { typeName: '*', kind: 'LIST', ofType: 'KeyValuePair' },
			seventhTest: { typename: 'String', kind: 'SCALAR' }
		}
	};
	const values = {
		test: [{ __id__: 'myTest', __type__: 'testType' }],
		secondTest: 'mySecondTest',
		thirdTest: { __id__: 'myThirdTest' },
		fourthTest: [{ __id__: 'myFourthTest' }],
		fifthTest: { __id__: 'myFifthTest', __type__: 'testType' },
		sixthTest: [{ __key__: 'mySixthTest', __value__: { __id__: 'id', __type__: 'type' } }],
		seventhTest: null
	};
	const expectedValues = {
		test: {
			links: [{ collection: 'testType', id: 'myTest' }],
			__role__: 'links'
		},
		secondTest: 'mySecondTest',
		thirdTest: {
			link: { collection: 'test', id: 'myThirdTest' },
			__role__: 'link'
		},
		fourthTest: {
			links: [{ collection: 'TEST', id: 'myFourthTest' }],
			__role__: 'links'
		},
		fifthTest: {
			link: { collection: 'testType', id: 'myFifthTest' },
			__role__: 'link'
		},
		sixthTest: {
			map: {
				mySixthTest: {
					collection: 'type',
					id: 'id'
				}
			},
			__role__: 'map'
		},
		seventhTest: ''
	};
	store.getState.returns({ collections });
	const objectComponent = setup();
	objectComponent.setProps({ onSubmit, type, fields });
	await objectComponent.instance().handleSubmit(values);
	t.deepEqual(onSubmit.args[0][0], expectedValues);
});
