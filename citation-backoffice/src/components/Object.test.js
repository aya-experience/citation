import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {shallow} from 'enzyme';

const store = {
	subscribe: sinon.stub(),
	dispatch: sinon.stub(),
	getState: sinon.stub(),
	ownProps: sinon.stub()
};

let ObjectComponent;
let loadObject;
let loadSchemaFields;
let writeObject;

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
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
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
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	const objects = {};
	const fields = {};
	store.getState.returns({objects, fields});
	const objectComponent = setup();
	objectComponent.setProps({load, loadFields: loadFieldsSpy});
	await objectComponent.instance().componentDidMount();
	t.true(loadFieldsSpy.calledWith('TEST'));
});

test('title shoud be Edit if thre is an id', t => {
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	t.is(setup().find('h1').text(), 'Edit TEST id');
});

test('title shoud be Add if there is no id', t => {
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	t.is(setup().find('h1').text(), 'Add TEST ');
});

test('mapDispatchToProps should dispatch loadSchemaFields', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	const objectComponent = setup();
	objectComponent.instance().props.loadFields();
	t.is(store.dispatch.args[0][0], 'loadSchemaFields returned');
});

test('mapDispatchToProps should dispatch loadOject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	const objectComponent = setup();
	objectComponent.instance().props.load();
	t.is(store.dispatch.args[0][0], 'loadObject returned');
});

test('mapDispatchToProps should dispatch writeObject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	const objectComponent = setup();
	objectComponent.instance().props.write();
	t.is(store.dispatch.args[0][0], 'writeObject returned');
});

test('handleSubmit should call write with good args', t => {
	writeObject.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({objects, fields});
	const setup = () => shallow(<ObjectComponent match={{params: {type: 'TEST', id: 'id'}}}/>, {context: {store}}).find('ObjectComponent').shallow();
	const objectComponent = setup();
	objectComponent.setProps({fields: 'myFields'});
	objectComponent.instance().handleSubmit('myData');
	t.true(writeObject.calledWith('TEST', 'id', 'myData', 'myFields'));
});
