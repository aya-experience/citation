/* global global */

import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import Routes from './Routes';

const propName = 'prop';
const propNameArray = 'propArray';
const propValue = { test: 'test' };
const propValueArray = [
	{
		test1: 'test1'
	},
	{
		test2: 'test2'
	}
];
const componentId = 'componentId';
const component = {
	__id__: 'componentId',
	props: [
		{
			__key__: propName,
			__value__: propValue
		},
		{
			__key__: propNameArray,
			__list__: propValueArray
		}
	]
};
const page = { slug: 'test', component, children: [] };

global.window = {};

const props = {
	serverUrl: 'serverUrl',
	components: {},
	pages: [page],
	match: { url: '' }
};

test('should init contents if not present in window', t => {
	const routes = shallow(<Routes {...props} />);
	t.deepEqual(routes.state('contents'), {});
});

test('should add contents in state', t => {
	global.window.__contents__ = { [componentId]: component };
	const routes = shallow(<Routes {...props} />);
	t.is(routes.state('contents'), global.window.__contents__);
});

test('should use prop value in state if present', t => {
	global.window.__contents__ = { [componentId]: component };
	const routes = shallow(<Routes {...props} />);
	const route = routes.instance().matchRenderer(page)({ url: `/${page.slug}` });
	t.is(route.props[propName], propValue);
});

test('should use prop array in state if present', t => {
	global.window.__contents__ = { [componentId]: component };
	const routes = shallow(<Routes {...props} />);
	const route = routes.instance().matchRenderer(page)({ url: `/${page.slug}` });
	t.is(route.props[propNameArray], propValueArray);
});
