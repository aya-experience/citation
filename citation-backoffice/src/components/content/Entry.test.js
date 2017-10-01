import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../utils/mocks/store.mock';

let Entry;
let loadEntry;
let loadTypeFields;
let writeEntry;
let deleteEntry;
let content;
let model;
let form2data;

const type = 'TEST';
let id;

const schemaFieldsReturned = { schema: 'loadSchemaFields returned' };
const entryReturned = { entry: 'loadEntry returned' };
const writeEntryReturned = { entry: 'writeEntry returned' };

const setup = () =>
	shallow(<Entry match={{ params: { type, id } }} />, {
		context: { store }
	});

test.beforeEach(() => {
	id = 'id';
	loadEntry = sinon.stub().returns(entryReturned);
	loadTypeFields = sinon.stub().returns(schemaFieldsReturned);
	writeEntry = sinon.stub().returns(writeEntryReturned);
	deleteEntry = sinon.stub().returns(null);
	form2data = sinon.stub();
	content = {};
	model = {};
	store.reset();
	store.getState.returns({ content, model });
	Entry = proxyquire('./Entry', {
		'../../logic/content': { loadEntry, writeEntry, deleteEntry },
		'../../logic/model': { loadTypeFields },
		'../../utils/form2data': { default: form2data }
	}).default;
});

test('componentDidMount should call the load and loadFields methods with good args', async t => {
	const loadFields = sinon.stub().returns(Promise.resolve());
	const load = sinon.stub();
	const type = 'type';
	const fields = 'fields';
	const entry = setup().dive();
	entry.setProps({ fields, type, load, loadFields });
	await entry.instance().componentDidMount();
	t.true(loadFields.calledWith(type));
	t.true(load.calledWith(fields));
});

test('title should be Edit if thre is an id', t => {
	model = { test: { fields: 'fields' } };
	const breadcrumb = setup()
		.dive()
		.dive()
		.dive()
		.find(Breadcrumb);
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
	model = { test: { fields: 'fields' } };
	const breadcrumb = setup()
		.dive()
		.dive()
		.dive()
		.find(Breadcrumb);
	const label = breadcrumb.childAt(5);
	t.is(label.text(), 'New entry...');
});

test('mapDispatchToProps should dispatch loadSchemaFields', t => {
	const entry = setup()
		.dive()
		.dive();
	entry.props().loadFields();
	t.true(store.dispatch.calledWith(schemaFieldsReturned));
});

test('mapDispatchToProps should dispatch loadEntry', t => {
	const entry = setup()
		.dive()
		.dive();
	entry.props().load();
	t.true(store.dispatch.calledWith(entryReturned));
});

test('mapDispatchToProps should dispatch writeEntry', t => {
	const entry = setup();
	entry.props().write();
	t.true(store.dispatch.calledWith(writeEntryReturned));
});

test('handleSubmit should call write with good args', t => {
	const formValues = 'myFormValues';
	const formData = 'myFormData';
	form2data.returns(formData);
	const entry = setup()
		.dive()
		.dive();
	entry.props().handleSubmit(formValues);
	t.true(writeEntry.calledWith(type, id, formData, model));
});

test('handleDelete should call delete with good args', t => {
	const entry = setup()
		.dive()
		.dive();
	entry.props().handleDelete();
	t.true(deleteEntry.calledWith(type, id));
});
