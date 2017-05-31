import _ from 'lodash';
import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import {shallow} from 'enzyme';

import {store} from './../reduxMock';

let SchemaComponent;
let loadSchemaFields;
let loadSchema;
let writeSchema;

const schemaFieldsReturned = {schema: 'loadSchemaFields returned'};
const schemaReturned = {object: 'loadSchema returned'};
const writeSchemaReturned = {object: 'writeSchema returned'};

const setup = () => shallow(<SchemaComponent/>, {context: {store}}).find('Schema').shallow();

test.beforeEach(() => {
	loadSchemaFields = sinon.stub().returns(schemaFieldsReturned);
	loadSchema = sinon.stub().returns(schemaReturned);
	writeSchema = sinon.stub().returns(writeSchemaReturned);
	SchemaComponent = proxyquire('./Schema', {
		'../logic/schema': {loadSchemaFields, loadSchema, writeSchema}
	}).default;
});

test('componentDidMount should call the loadFields method with good args', async t => {
	const loadSchema = sinon.stub().returns(Promise.resolve([true]));
	const loadFields = sinon.stub();
	const data = 'test';
	const schema = {data};
	const fields = {};
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.setProps({loadSchema, loadFields});
	await schemaComponent.instance().componentDidMount();
	t.true(loadFields.calledWith(data));
});

test('componentDidMount should call the loadSchema method', async t => {
	const loadSchema = sinon.stub().returns(Promise.resolve([true]));
	const loadFields = sinon.stub();
	const schema = {};
	const fields = {};
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.setProps({loadSchema, loadFields});
	await schemaComponent.instance().componentDidMount();
	t.true(loadSchema.called);
});

test('mapDispatchToProps should dispatch loadSchemaFields', t => {
	store.dispatch.reset();
	const schema = {};
	const fields = {};
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.instance().props.loadFields();
	t.true(store.dispatch.calledWith(schemaFieldsReturned));
});

test('mapDispatchToProps should dispatch loadSchema', t => {
	store.dispatch.reset();
	const schema = {};
	const fields = {};
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.instance().props.loadSchema();
	t.true(store.dispatch.calledWith(schemaReturned));
});

test('mapDispatchToProps should dispatch writeSchema', t => {
	store.dispatch.reset();
	const schema = {};
	const fields = {};
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.instance().props.write();
	t.true(store.dispatch.calledWith(writeSchemaReturned));
});

test('handleSubmit should call write with good args', t => {
	writeSchema.reset();
	const schema = {};
	const fields = {};
	const myData = 'myData';
	store.getState.returns({schema, fields});
	const schemaComponent = setup();
	schemaComponent.instance().handleSubmit(myData);
	t.true(writeSchema.calledWith(myData));
});
