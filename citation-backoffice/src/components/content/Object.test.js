import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../reduxMock';

let ObjectComponent;
let loadObject;
let loadSchemaFields;
let writeObject;
let deleteObject;

const type = 'TEST';
let id;

const schemaFieldsReturned = { schema: 'loadSchemaFields returned' };
const objectReturned = { object: 'loadObject returned' };
const writeObjectReturned = { object: 'writeObject returned' };

const setup = () =>
	shallow(<ObjectComponent match={{ params: { type, id } }} />, {
		context: { store }
	})
		.dive()
		.dive()
		.dive();

test.beforeEach(() => {
	id = 'id';
	loadObject = sinon.stub().returns(objectReturned);
	loadSchemaFields = sinon.stub().returns(schemaFieldsReturned);
	writeObject = sinon.stub().returns(writeObjectReturned);
	deleteObject = sinon.stub().returns(null);
	ObjectComponent = proxyquire('./Object', {
		'../../logic/objects': { loadObject, writeObject, deleteObject },
		'../../logic/schema': { loadSchemaFields }
	}).default;
});

test('componentDidMount should call the load method with good args', async t => {
	const loadFields = sinon.stub().returns(Promise.resolve([true]));
	const loadSpy = sinon.stub();
	const objects = {};
	const fields = { test: { fields: 'fields' } };
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.setProps({ load: loadSpy, loadFields });
	await objectComponent.instance().componentDidMount();
	t.true(loadSpy.calledWith(fields));
});

test('componentDidMount should call the loadFields method with good args', async t => {
	const loadFieldsSpy = sinon.stub().returns(Promise.resolve([true]));
	const load = sinon.stub();
	const objects = {};
	const fields = {};
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.setProps({ load, loadFields: loadFieldsSpy });
	await objectComponent.instance().componentDidMount();
	t.true(loadFieldsSpy.calledWith([type]));
});

test('componentWillReceiveProps should not call lodafFields if fields are already in props', async t => {
	const loadFieldsSpy = sinon.stub().returns(Promise.resolve([true]));
	const load = sinon.stub();
	const objects = {};
	const fields = { TEST: {} };
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.setProps({ load, loadFields: loadFieldsSpy });
	t.false(loadFieldsSpy.called);
});

test.only('title should be Edit if thre is an id', t => {
	const objects = {};
	const fields = { test: { fields: 'fields' } };
	store.getState.returns({ objects, fields });
	const breadcrumb = setup().find(Breadcrumb);
	const firstLink = breadcrumb.childAt(0);
	const secondLink = breadcrumb.childAt(2);
	const label = breadcrumb.childAt(5);
	t.is(firstLink.prop('to'), '/content');
	t.is(firstLink.prop('children'), 'CONTENT');
	t.is(secondLink.prop('to'), `/content/type/${type}`);
	t.is(secondLink.prop('children'), type);
	t.is(label.text(), id);
});

test('title shoud be Add if there is no id', t => {
	id = null;
	const objects = {};
	const fields = { test: { fields: 'fields' } };
	store.getState.returns({ objects, fields });
	const breadcrumb = setup().find(Breadcrumb);
	const label = breadcrumb.childAt(5);
	t.is(label.text(), 'New object...');
});

test('mapDispatchToProps should dispatch loadSchemaFields', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.instance().props.loadFields();
	t.true(store.dispatch.calledWith(schemaFieldsReturned));
});

test('mapDispatchToProps should dispatch loadOject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.instance().props.load();
	t.true(store.dispatch.calledWith(objectReturned));
});

test('mapDispatchToProps should dispatch writeObject', t => {
	store.dispatch.reset();
	const fields = {};
	const objects = {};
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.instance().props.write();
	t.true(store.dispatch.calledWith(writeObjectReturned));
});

test('handleSubmit should call write with good args', t => {
	writeObject.reset();
	const fields = {};
	const objects = {};
	const myData = 'myData';
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.instance().handleSubmit(myData);
	t.true(writeObject.calledWith(type, id, myData, fields));
});

test('handleDelete should call delete with good args', t => {
	const fields = {};
	const objects = {};
	store.getState.returns({ objects, fields });
	const objectComponent = setup();
	objectComponent.instance().props.handleDelete();
	t.true(deleteObject.calledWith(type, id));
});
