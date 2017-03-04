import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import App from './App';

const store = {
	subscribe: sinon.stub(),
	dispatch: sinon.stub(),
	getState: sinon.stub()
};

const setup = () => shallow(<App/>, {context: {store}}).find('App').shallow();

test('has a "Citation Admin" title', t => {
	store.getState.returns({collections: {}});
	t.is(setup().find('h2').text(), 'Citation Admin');
});

test('pass the collections from the state to the Menu', t => {
	const collections = {};
	store.getState.returns({collections});
	t.is(setup().find('Menu').prop('collections'), collections);
});
