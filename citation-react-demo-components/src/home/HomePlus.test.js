import React from 'react';
import test from 'ava';
import proxyquire from 'proxyquire';
import { shallow } from 'enzyme';

let HomePlus;

const plus = { title: 'homePlus', align: 'left', image: 'plusImage', content: 'PlusContent' };

const setup = () => shallow(<HomePlus plus={[plus]} />);

let homePlus;
let homePlusDiv;
let homePlusContent;

test.beforeEach(() => {
	HomePlus = proxyquire('./HomePlus', {}).default;
	homePlus = setup();
	homePlusDiv = homePlus.childAt(0);
	homePlusContent = homePlusDiv.find(`.${plus.align}`);
});

test('HomePlus should have a div with HomePlus title as key', t => {
	t.deepEqual(homePlusDiv.nodes[0].key, plus.title);
});

test('HomePlus should have a div with align className', t => {
	t.is(homePlusContent.length, 1);
});

test('HomePlus should have image name', t => {
	t.deepEqual(homePlusContent.childAt(1).text(), plus.image);
});

test('HomePlus should have image name', t => {
	t.deepEqual(homePlusContent.find('.PlusContent').text(), `${plus.title}${plus.content}`);
});
