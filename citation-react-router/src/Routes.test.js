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
	_id_: 'componentId',
	props: [
		{
			_key_: propName,
			_value_: propValue
		},
		{
			_key_: propNameArray,
			_list_: propValueArray
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
	global.window._contents_ = { [componentId]: component };
	const routes = shallow(<Routes {...props} />);
	t.is(routes.state('contents'), global.window._contents_);
});

test('should use component data in state if present', t => {
	global.window._contents_ = { [componentId]: component };
	const routes = shallow(<Routes {...props} />);
	const route = routes.instance().matchRenderer(page)({ url: `/${page.slug}` });
	t.is(route.props.content, component);
});
