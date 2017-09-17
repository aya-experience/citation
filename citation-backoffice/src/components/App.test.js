import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../reduxMock';

let App;
let loadContentTypes;
let loadModelTypes;

const collectionReturned = 'loadCollection returned';
const schemaReturned = 'loadSchema returned';

test.beforeEach(() => {
	// eslint-disable-next-line no-undef
	global.window = { location: { hostname: 'localhost' } };
	loadContentTypes = sinon.stub().returns(collectionReturned);
	loadModelTypes = sinon.stub().returns(schemaReturned);
	App = proxyquire('./App', {
		'../logic/content': { loadTypes: loadContentTypes },
		'../logic/model': { loadTypes: loadModelTypes }
	}).default;
});

const setup = () => shallow(<App />, { context: { store } }).dive();

test('componentDidMount should load schema and collections', async t => {
	const loadCollectionsSpy = sinon.spy();
	const loadSchemaMock = sinon.stub().returns(Promise.resolve(true));
	store.getState.returns({ collections: {}, schema: { data: [] } });
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
