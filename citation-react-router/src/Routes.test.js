/* global global */

import React from 'react';
import test from 'ava';
import {shallow} from 'enzyme';
import Routes from './Routes';

const componentId = 'componentId';
const component = {__id__: 'componentId', data: []};
const page = {slug: 'test', component, children: []};

global.window = {
	__contents__: {[componentId]: component}
};

const props = {
	serverUrl: 'serverUrl',
	components: {},
	pages: [page],
	match: {url: ''}
};

test('should add contents in state', t => {
	const routes = shallow(<Routes {...props}/>);
	t.is(routes.state('contents'), global.window.__contents__);
});

test('should use content in state if present', t => {
	const routes = shallow(<Routes {...props}/>);
	const route = routes.instance().matchRenderer(page)({url: `/${page.slug}`});
	t.is(route.props.data, component.data);
});
