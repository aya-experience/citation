import React from 'react';
import test from 'ava';
import {shallow} from 'enzyme';
import Component1 from './Component1';

let data = [];

const setup = () => shallow(<Component1 data={data}/>);

test('has a title section containing title data', t => {
	const title = 'test-title';
	data = [{title}];
	t.true(setup().find('h1').text().includes(title));
});
