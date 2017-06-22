/* global global */

import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { shallow } from 'enzyme';

let queryPages;
let Router;
global.window = {};

test.beforeEach(() => {
	queryPages = sinon.stub();
	Router = proxyquire('./Router', {
		'./queries': { default: { queryPages } }
	}).default;
});

const serverUrl = 'url';
const components = {};
const setup = () => shallow(<Router serverUrl={serverUrl} components={components} />);

test('should init pages if not present in window', t => {
	const router = setup();
	t.deepEqual(router.state('pages'), []);
});

test('should find pages in window if present', t => {
	global.window.__pages__ = [];
	const router = setup();
	t.is(router.state('pages'), global.window.__pages__);
});

test.serial('should not load pages if not empty', async t => {
	const router = setup();
	router.setState({ pages: ['notEmpty'] });
	await router.instance().componentDidMount();
	t.false(queryPages.called);
});

test.serial('should load pages empty', async t => {
	const expected = ['page'];
	queryPages.returns(expected);
	const router = setup();
	await router.instance().componentDidMount();
	t.true(queryPages.called);
	t.is(router.state('pages'), expected);
});

test('should render Routes with all props added with pages', t => {
	const pages = ['page'];
	const router = setup();
	router.setState({ pages });
	const routes = router.find('Routes');
	const real = routes.at(0);
	const preview = routes.at(1);
	t.deepEqual(real.prop('match'), { url: '' });
	t.deepEqual(preview.prop('match'), { url: '/preview' });
	[real, preview].forEach(routes => {
		t.is(routes.prop('serverUrl'), serverUrl);
		t.is(routes.prop('components'), components);
		t.is(routes.prop('pages'), pages);
	});
});

test.afterEach(() => {
	delete global.window.__pages__;
});
