import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from '../utils/mocks/store.mock';

let Model;
const loadTypes = sinon.spy();

const match = { url: 'url' };

const innerSetup = () => shallow(<Model match={match} />, { context: { store } });

test.beforeEach(() => {
	loadTypes.reset();
	Model = proxyquire('./Model', {
		'../logic/model': { loadTypes }
	}).default;
});

test('componentDidMount should call the loadTypes method', async t => {
	const model = innerSetup().dive();
	await model.instance().componentDidMount();
	t.true(loadTypes.called);
});
