import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import {store} from './../reduxMock';

let ObjectComponent;
let loadObject;
let loadSchemaFields;
let writeObject;

const type = 'TEST';
const id = 'id';

const schemaFieldsReturned = 'loadSchemaFields returned';
const objectReturned = 'loadObject returned';
const writeObjectReturned = 'writeObject returned';

const setup = () => shallow(<ObjectComponent match={{params: {type, id}}}/>, {context: {store}}).find('ObjectComponent').shallow();

test.beforeEach(() => {
	loadObject = sinon.stub().returns('loadObject returned');
	loadSchemaFields = sinon.stub().returns('loadSchemaFields returned');
	writeObject = sinon.stub().returns('writeObject returned');
	ObjectComponent = proxyquire('./Object', {
		'../logic/objects': {loadObject, writeObject},
		'../logic/schema': {loadSchemaFields}
	}).default;
});

test('componentDidMount should call the load method with good args', async t => {
	const loadFields = sinon.stub().returns(Promise.resolve(['test']));
	const loadSpy = sinon.stub();
	const objects = {};
	const fields = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.setProps({load: loadSpy, loadFields});
	await objectComponent.instance().componentDidMount();
	t.true(loadSpy.called);
});

test('componentDidMount should call the loadFields method with good args', async t => {
	const loadFieldsSpy = sinon.stub().returns(Promise.resolve([true]));
	const load = sinon.stub();
	const objects = {};
	const fields = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.setProps({load, loadFields: loadFieldsSpy});
	await objectComponent.instance().componentDidMount();
	t.true(loadFieldsSpy.calledWith(type));
});

test('title shoud be Edit if thre is an id', t => {
	t.is(setup().find('h1').text(), `Edit ${type} ${id}`);
});

test('title shoud be Add if there is no id', t => {
	const setup = () => shallow(<ObjectComponent match={{params: {type}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	t.is(setup().find('h1').text(), `Add ${type} `);
});

test('mapDispatchToProps should dispatch loadSchemaFields', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.instance().props.loadFields();
	t.is(store.dispatch.args[0][0], schemaFieldsReturned);
});

test('mapDispatchToProps should dispatch loadOject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.instance().props.load();
	t.is(store.dispatch.args[0][0], objectReturned);
});

test('mapDispatchToProps should dispatch writeObject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.instance().props.write();
	t.is(store.dispatch.args[0][0], writeObjectReturned);
});

test('handleSubmit should call write with good args', t => {
	writeObject.reset();
	const fields = {};
	const objects = {};
	const myFields = 'myFields';
	const myData = 'myData';
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.setProps({fields: myFields});
	objectComponent.instance().handleSubmit(myData);
	t.true(writeObject.calledWith(type, id, myData, myFields));
});
