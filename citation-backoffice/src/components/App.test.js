import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from '../utils/mocks/store.mock';

let App;
let loadContentTypes;
let loadModelTypes;

const contentTypesReturned = 'loadContentTypes returned';
const modelTypesReturned = 'loadModelTypes returned';

test.beforeEach(() => {
	// eslint-disable-next-line no-undef
	global.window = { location: { hostname: 'localhost' } };
	loadContentTypes = sinon.stub().returns(contentTypesReturned);
	loadModelTypes = sinon.stub().returns(modelTypesReturned);
	App = proxyquire('./App', {
		'../logic/content': { loadTypes: loadContentTypes },
		'../logic/model': { loadTypes: loadModelTypes }
	}).default;
	store.dispatch.reset();
});

const setup = () =>
	shallow(<App />, {
		context: { store },
		disableLifecycleMethods: true
	}).dive();

test('componentDidMount should load model and content', async t => {
	store.getState.returns({ model: {} });
	const loadContentTypes = sinon.spy();
	const loadModelTypes = sinon.stub().returns(Promise.resolve());
	const app = setup();
	app.setProps({
		loadContentTypes,
		loadModelTypes
	});
	await app.instance().componentDidMount();
	t.is(loadModelTypes.called, true);
	t.is(loadContentTypes.called, true);
});

test('mapDispatchToProps should dispatch loadModelTypes', t => {
	store.getState.returns({ model: {} });
	const app = setup();
	app.instance().props.loadModelTypes();
	t.is(store.dispatch.args[0][0], modelTypesReturned);
});

test('mapDispatchToProps should dispatch loadContentTypes()', t => {
	store.getState.returns({ model: {} });
	const app = setup();
	app.instance().props.loadContentTypes('test');
	t.is(store.dispatch.args[0][0], contentTypesReturned);
});
