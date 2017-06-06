import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../reduxMock';

let App;
let loadCollection;
let loadSchema;

const collectionReturned = 'loadCollection returned';
const schemaReturned = 'loadSchema returned';

test.beforeEach(() => {
	loadCollection = sinon.stub().returns(collectionReturned);
	loadSchema = sinon.stub().returns(schemaReturned);
	App = proxyquire('./App', {
		'../logic/collections': { loadCollection },
		'../logic/schema': { loadSchema }
	}).default;
});

const setup = () => shallow(<App />, { context: { store } }).find('App').shallow();

test('has a "Citation Admin" title', t => {
	store.getState.returns({ collections: {} });
	t.is(setup().find('h2').text(), 'Citation Admin');
});

test('pass the collections from the state to the Menu', t => {
	const collections = {};
	store.getState.returns({ collections });
	t.is(setup().find('Menu').prop('collections'), collections);
});

test('componentDidMount should load schema and collections', async t => {
	const loadCollectionsSpy = sinon.spy();
	const loadSchemaMock = sinon.stub().returns(Promise.resolve(true));
	const collections = {};
	store.getState.returns({ collections });
	const app = setup();
	app.setProps({
		loadCollections: loadCollectionsSpy,
		loadSchema: loadSchemaMock
	});
	await app.instance().componentDidMount();
	t.is(loadCollectionsSpy.called, true);
});

test('mapDispatchToProps should dispatch loadSchema', t => {
	store.dispatch.reset();
	const collections = {};
	store.getState.returns({ collections });
	const app = setup();
	app.instance().props.loadSchema();
	t.is(store.dispatch.args[0][0], schemaReturned);
});

test('mapDispatchToProps should dispatch loadCollections()', t => {
	store.dispatch.reset();
	const collections = {};
	store.getState.returns({ collections });
	const app = setup();
	app.instance().props.loadCollections({ data: [test] });
	t.is(store.dispatch.args[0][0], collectionReturned);
});
