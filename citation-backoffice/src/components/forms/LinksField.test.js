import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { store } from './../../reduxMock';

let LinksField;
const swap = sinon.stub().returns(null);

const setup = () =>
	shallow(<LinksField fields={{ map: () => {}, swap }} meta={{ error: '' }} />, {
		context: { store }
	}).dive();

test.beforeEach(() => {
	LinksField = proxyquire('./LinksField', {}).default;
});

test('handleUp should call swap function with the given index and the index just before', t => {
	const linksField = setup();
	linksField.instance().props.handleUp(1)();
	t.true(swap.calledWith(1, 0));
});

test('handleDown should call swap function with the given index and the index just after', t => {
	const linksField = setup();
	linksField.instance().props.handleDown(1)();
	t.true(swap.calledWith(1, 2));
});
